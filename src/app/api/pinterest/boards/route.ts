import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getBoards, importBoardFromUrl, refreshBoardsAndPins } from '@/lib/services/board-sync';
import type { PinterestBoard, PinterestPin } from '@/lib/types/database';

export interface BoardWithPreviews extends PinterestBoard {
  preview_pins: string[];
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const boards = await getBoards(user.id);

  // Fetch first 4 pin images for each board
  const boardIds = boards.map(b => b.id);
  const { data: pins } = await supabase
    .from('pinterest_pins')
    .select('board_id, image_url')
    .in('board_id', boardIds)
    .order('imported_at', { ascending: false });

  // Group pins by board and take first 4
  const pinsByBoard = new Map<string, string[]>();
  for (const pin of (pins as Pick<PinterestPin, 'board_id' | 'image_url'>[] || [])) {
    const existing = pinsByBoard.get(pin.board_id) || [];
    if (existing.length < 4) {
      existing.push(pin.image_url);
      pinsByBoard.set(pin.board_id, existing);
    }
  }

  const boardsWithPreviews: BoardWithPreviews[] = boards.map(board => ({
    ...board,
    preview_pins: pinsByBoard.get(board.id) || [],
  }));

  return NextResponse.json({ boards: boardsWithPreviews });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({})) as { board_url?: string };

    if (body.board_url?.trim()) {
      const { board, boards, warning } = await importBoardFromUrl(user.id, body.board_url);
      return NextResponse.json({ board, boards, warning });
    }

    const result = await refreshBoardsAndPins(user.id);
    return NextResponse.json({
      boards: result.boards,
      refresh: {
        refreshed_boards: result.refreshed_boards,
        failed_boards: result.failed_boards,
        refreshed_pin_count: result.refreshed_pin_count,
        warnings: result.warnings,
        failures: result.failures,
      },
    });
  } catch (error) {
    console.error('Board sync error:', error);
    const message = error instanceof Error ? error.message : 'Failed to sync boards';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
