import { createClient } from '@/lib/supabase/server';
import { isPinterestConfigured } from '@/lib/config';
import { fetchPinterestBoardPins } from './pinterest';
import { decrypt } from './encryption';
import { refreshImportedPublicBoard, type PublicImportWarning } from './pinterest-public';
import type { PinterestPin } from '@/lib/types/database';

export interface ImportPinsResult {
  pins: PinterestPin[];
  warning: PublicImportWarning | null;
  expectedPinCount: number | null;
  fetchedPinCount: number;
}

function getBestImageUrl(
  media: { images: Record<string, { url: string; width: number; height: number }> } | undefined
): string {
  if (!media?.images) return '';
  const sizes = ['1200x', 'originals', '600x', '400x300', '236x'];
  for (const size of sizes) {
    if (media.images[size]?.url) return media.images[size].url;
  }
  const first = Object.values(media.images)[0];
  return first?.url || '';
}

function toAbsolutePinterestBoardUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('/')) {
    return `https://www.pinterest.com${trimmed.endsWith('/') ? trimmed : `${trimmed}/`}`;
  }

  try {
    const url = new URL(trimmed);
    if (!/(\.|^)pinterest\.com$/i.test(url.hostname)) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

function getLegacyBoardUrlFromPayload(rawPayload: Record<string, unknown> | null): string | null {
  if (!rawPayload) {
    return null;
  }

  const boardValue = rawPayload.board;
  if (!boardValue || typeof boardValue !== 'object') {
    return null;
  }

  const board = boardValue as Record<string, unknown>;
  return typeof board.url === 'string' ? toAbsolutePinterestBoardUrl(board.url) : null;
}

export async function importPins(userId: string, boardId: string): Promise<ImportPinsResult> {
  const supabase = await createClient();
  const { data: board } = await supabase
    .from('pinterest_boards')
    .select('pinterest_board_id, source_type, source_url')
    .eq('id', boardId)
    .eq('user_id', userId)
    .single();

  if (!board) throw new Error('Board not found');

  if (board.source_type === 'public_url') {
    return refreshImportedPublicBoard(userId, boardId);
  }

  if (!isPinterestConfigured()) {
    const { data: legacyPin } = await supabase
      .from('pinterest_pins')
      .select('raw_payload')
      .eq('user_id', userId)
      .eq('board_id', boardId)
      .order('imported_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const recoveredUrl = getLegacyBoardUrlFromPayload(
      (legacyPin?.raw_payload as Record<string, unknown> | null) || null
    );

    if (recoveredUrl) {
      const { error: updateError } = await supabase
        .from('pinterest_boards')
        .update({
          source_type: 'public_url',
          source_url: recoveredUrl,
        })
        .eq('id', boardId)
        .eq('user_id', userId);

      if (updateError) {
        throw new Error(`Failed to recover board source URL: ${updateError.message}`);
      }

      const imported = await refreshImportedPublicBoard(userId, boardId);
      return imported;
    }

    throw new Error('Pinterest API is not configured for this board.');
  }

  const { data: account } = await supabase
    .from('pinterest_accounts')
    .select('access_token_encrypted')
    .eq('user_id', userId)
    .single();

  if (!account) {
    throw new Error('Pinterest account not connected.');
  }

  const accessToken = decrypt(account.access_token_encrypted);
  const pinterestPins = await fetchPinterestBoardPins(accessToken, board.pinterest_board_id);

  const pins: PinterestPin[] = [];
  const importedAt = new Date().toISOString();

  for (const pp of pinterestPins) {
    const imageUrl = getBestImageUrl(pp.media);
    if (!imageUrl) continue;

    const { data, error } = await supabase
      .from('pinterest_pins')
      .upsert(
        {
          user_id: userId,
          board_id: boardId,
          pinterest_pin_id: pp.id,
          section_key: null,
          section_name: null,
          title: pp.title || null,
          description: pp.description || null,
          image_url: imageUrl,
          source_url: pp.link || null,
          raw_payload: pp as unknown as Record<string, unknown>,
          imported_at: importedAt,
        },
        { onConflict: 'user_id,pinterest_pin_id' }
      )
      .select()
      .single();

    if (data) pins.push(data as PinterestPin);
    if (error) console.error('Pin upsert error:', error);
  }

  const { error: boardUpdateError } = await supabase
    .from('pinterest_boards')
    .update({
      pin_count: pins.length,
      last_synced_at: importedAt,
    })
    .eq('id', boardId)
    .eq('user_id', userId);

  if (boardUpdateError) {
    console.error('Board metadata update error:', boardUpdateError);
  }

  return {
    pins,
    warning: null,
    expectedPinCount: null,
    fetchedPinCount: pins.length,
  };
}

export async function getPins(userId: string, boardId: string): Promise<PinterestPin[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('pinterest_pins')
    .select('*')
    .eq('user_id', userId)
    .eq('board_id', boardId)
    .order('imported_at', { ascending: false });

  return (data as PinterestPin[]) || [];
}

export async function getPin(userId: string, pinId: string): Promise<PinterestPin | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('pinterest_pins')
    .select('*')
    .eq('id', pinId)
    .eq('user_id', userId)
    .single();

  return data as PinterestPin | null;
}
