import { isPinterestConfigured } from '@/lib/config';
import type {
  PinterestOAuthTokenResponse,
  PinterestBoardResponse,
  PinterestPinResponse,
  PinterestPaginatedResponse,
} from '@/lib/types/pinterest';

const PINTEREST_API_BASE = 'https://api.pinterest.com/v5';
const PINTEREST_OAUTH_BASE = 'https://api.pinterest.com/oauth';

export function getPinterestAuthUrl(): string {
  const clientId = process.env.PINTEREST_CLIENT_ID!;
  const redirectUri = process.env.PINTEREST_REDIRECT_URI!;
  const scope = 'boards:read,pins:read,user_accounts:read';

  return `${PINTEREST_OAUTH_BASE}/?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
}

export async function exchangePinterestCode(code: string): Promise<PinterestOAuthTokenResponse> {
  const clientId = process.env.PINTEREST_CLIENT_ID!;
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET!;
  const redirectUri = process.env.PINTEREST_REDIRECT_URI!;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${PINTEREST_API_BASE}/oauth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Pinterest token exchange failed: ${text}`);
  }

  return response.json();
}

export async function fetchPinterestBoards(
  accessToken: string
): Promise<PinterestBoardResponse[]> {
  const boards: PinterestBoardResponse[] = [];
  let bookmark: string | null = null;

  do {
    const url = new URL(`${PINTEREST_API_BASE}/boards`);
    url.searchParams.set('page_size', '25');
    if (bookmark) url.searchParams.set('bookmark', bookmark);

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) throw new Error(`Pinterest boards fetch failed: ${response.status}`);

    const data: PinterestPaginatedResponse<PinterestBoardResponse> = await response.json();
    boards.push(...data.items);
    bookmark = data.bookmark;
  } while (bookmark);

  return boards;
}

export async function fetchPinterestBoardPins(
  accessToken: string,
  boardId: string
): Promise<PinterestPinResponse[]> {
  const pins: PinterestPinResponse[] = [];
  let bookmark: string | null = null;

  do {
    const url = new URL(`${PINTEREST_API_BASE}/boards/${boardId}/pins`);
    url.searchParams.set('page_size', '25');
    if (bookmark) url.searchParams.set('bookmark', bookmark);

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) throw new Error(`Pinterest pins fetch failed: ${response.status}`);

    const data: PinterestPaginatedResponse<PinterestPinResponse> = await response.json();
    pins.push(...data.items);
    bookmark = data.bookmark;
  } while (bookmark);

  return pins;
}

export function isPinterestAvailable(): boolean {
  return isPinterestConfigured();
}
