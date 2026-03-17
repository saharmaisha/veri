import { createClient } from '@/lib/supabase/server';
import { isPinterestConfigured } from '@/lib/config';
import { fetchPinterestBoards } from './pinterest';
import { decrypt } from './encryption';
import { importPublicPinterestBoard, type PublicImportWarning } from './pinterest-public';
import { importPins } from './pin-import';
import type { PinterestBoard } from '@/lib/types/database';

interface ExistingBoardSourceRow {
  pinterest_board_id: string;
  source_type: PinterestBoard['source_type'];
  source_url: string | null;
}

export interface RefreshBoardsResult {
  boards: PinterestBoard[];
  refreshed_boards: number;
  failed_boards: number;
  refreshed_pin_count: number;
  warnings: Array<{
    board_id: string;
    board_name: string;
    warning: PublicImportWarning;
  }>;
  failures: Array<{
    board_id: string;
    board_name: string;
    error: string;
  }>;
}

export async function syncBoards(userId: string): Promise<PinterestBoard[]> {
  if (!isPinterestConfigured()) {
    return getBoards(userId);
  }

  const supabase = await createClient();

  const { data: account } = await supabase
    .from('pinterest_accounts')
    .select('access_token_encrypted')
    .eq('user_id', userId)
    .single();

  if (!account) {
    return getBoards(userId);
  }

  const accessToken = decrypt(account.access_token_encrypted);
  const pinterestBoards = await fetchPinterestBoards(accessToken);
  const { data: existingSources } = await supabase
    .from('pinterest_boards')
    .select('pinterest_board_id, source_type, source_url')
    .eq('user_id', userId);

  const sourceByPinterestId = new Map(
    ((existingSources ?? []) as ExistingBoardSourceRow[]).map((row) => [row.pinterest_board_id, row])
  );

  for (const pb of pinterestBoards) {
    const imageUrl = pb.media?.image_cover_url || pb.media?.pin_thumbnail_urls?.[0] || null;
    const existing = sourceByPinterestId.get(pb.id);
    const preservePublicSource =
      existing?.source_type === 'public_url' &&
      typeof existing.source_url === 'string' &&
      existing.source_url.length > 0;

    const { error } = await supabase
      .from('pinterest_boards')
      .upsert(
        {
          user_id: userId,
          pinterest_board_id: pb.id,
          name: pb.name,
          description: pb.description || null,
          image_url: imageUrl,
          pin_count: pb.pin_count,
          source_type: preservePublicSource ? existing.source_type : 'api',
          source_url: preservePublicSource ? existing.source_url : null,
          last_synced_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,pinterest_board_id' }
      )
      .select('id');

    if (error) console.error('Board upsert error:', error);
  }

  return getBoards(userId);
}

export async function getBoards(userId: string): Promise<PinterestBoard[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('pinterest_boards')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  return (data as PinterestBoard[]) || [];
}

export async function importBoardFromUrl(
  userId: string,
  boardUrl: string
): Promise<{ board: PinterestBoard; boards: PinterestBoard[]; warning: PublicImportWarning | null }> {
  const { board, warning } = await importPublicPinterestBoard(userId, boardUrl);
  const boards = await getBoards(userId);

  return { board, boards, warning };
}

export async function refreshBoardsAndPins(userId: string): Promise<RefreshBoardsResult> {
  await syncBoards(userId);
  const boards = await getBoards(userId);
  const failures: RefreshBoardsResult['failures'] = [];
  const warnings: RefreshBoardsResult['warnings'] = [];
  let refreshedBoards = 0;
  let refreshedPinCount = 0;

  for (const board of boards) {
    try {
      const result = await importPins(userId, board.id);
      refreshedBoards += 1;
      refreshedPinCount += result.pins.length;
      if (result.warning) {
        warnings.push({
          board_id: board.id,
          board_name: board.name,
          warning: result.warning,
        });
      }
    } catch (error) {
      failures.push({
        board_id: board.id,
        board_name: board.name,
        error: error instanceof Error ? error.message : 'Unknown refresh error',
      });
    }
  }

  const refreshedBoardsList = await getBoards(userId);

  return {
    boards: refreshedBoardsList,
    refreshed_boards: refreshedBoards,
    failed_boards: failures.length,
    refreshed_pin_count: refreshedPinCount,
    warnings,
    failures,
  };
}
