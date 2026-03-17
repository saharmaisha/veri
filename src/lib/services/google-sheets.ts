import { google } from 'googleapis';
import { createClient } from '@/lib/supabase/server';
import { decrypt, encrypt } from './encryption';
import type { ProductResult } from '@/lib/types/database';

interface SheetAppendData {
  product: ProductResult;
  user_email: string;
  board_name?: string;
  pin_id?: string;
  pin_title?: string;
  inspiration_image_url?: string;
  balanced_query?: string;
  mode?: string;
}

async function getOAuthClient(userId: string) {
  const supabase = await createClient();

  const { data: integration } = await supabase
    .from('google_integrations')
    .select('access_token_encrypted, refresh_token_encrypted, google_connected')
    .eq('user_id', userId)
    .single();

  if (!integration?.google_connected || !integration.access_token_encrypted) {
    throw new Error('Google not connected for this user');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google/callback'
  );

  const accessToken = decrypt(integration.access_token_encrypted);
  const refreshToken = integration.refresh_token_encrypted
    ? decrypt(integration.refresh_token_encrypted)
    : undefined;

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  // Auto-refresh and persist new access token if the old one expires
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await supabase.from('google_integrations').update({
        access_token_encrypted: encrypt(tokens.access_token),
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId);
    }
  });

  return oauth2Client;
}

export async function appendToSheet(
  spreadsheetId: string,
  data: SheetAppendData,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await getOAuthClient(userId);
    const sheets = google.sheets({ auth, version: 'v4' });
    const range = process.env.GOOGLE_SHEETS_DEFAULT_RANGE || 'Sheet1!A:P';

    const row = [
      new Date().toISOString(),
      data.user_email,
      data.board_name || '',
      data.pin_id || '',
      data.pin_title || '',
      data.inspiration_image_url || '',
      data.product.title,
      data.product.retailer,
      data.product.price_text,
      data.product.numeric_price?.toString() || '',
      data.product.currency,
      data.product.product_url,
      data.product.image_url,
      data.product.match_reason || '',
      data.balanced_query || '',
      data.mode || 'vibe',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Google Sheets] Append failed:', message);
    return { success: false, error: message };
  }
}

export async function ensureHeaders(
  spreadsheetId: string,
  userId: string
): Promise<void> {
  try {
    const auth = await getOAuthClient(userId);
    const sheets = google.sheets({ auth, version: 'v4' });

    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A1:P1',
    });

    if (!existing.data.values || existing.data.values.length === 0) {
      const headers = [
        'Saved At', 'User Email', 'Board Name', 'Pin ID', 'Pin Title',
        'Inspiration Image URL', 'Product Title', 'Retailer', 'Price Text',
        'Numeric Price', 'Currency', 'Product URL', 'Product Image URL',
        'Match Reason', 'Balanced Query', 'Mode',
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1:P1',
        valueInputOption: 'RAW',
        requestBody: { values: [headers] },
      });
    }
  } catch (error) {
    console.error('[Google Sheets] Header setup failed:', error);
  }
}
