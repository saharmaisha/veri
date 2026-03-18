import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { appendToSheet, ensureHeaders } from '@/lib/services/google-sheets';
import { sheetsAppendSchema } from '@/lib/utils/validators';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = sheetsAppendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        sync_status: 'failed',
        error: 'Invalid Google Sheets payload',
      }, { status: 400 });
    }

    // Look up the user's spreadsheet ID from their google_integrations row
    const { data: integration } = await supabase
      .from('google_integrations')
      .select('google_connected, spreadsheet_id')
      .eq('user_id', user.id)
      .single();

    if (!integration?.google_connected) {
      return NextResponse.json({
        success: false,
        sync_status: 'not_configured',
        message: 'Google not connected. Visit Settings to connect your Google account.',
      });
    }

    const spreadsheetId = parsed.data.spreadsheet_id || integration?.spreadsheet_id;

    if (!spreadsheetId) {
      return NextResponse.json({
        success: false,
        sync_status: 'not_configured',
        message: 'No spreadsheet ID set. Add it in Settings.',
      });
    }

    // Ensure header row exists on first use
    await ensureHeaders(spreadsheetId, user.id);

    const result = await appendToSheet(
      spreadsheetId,
      {
        product: parsed.data.product,
        user_email: user.email || '',
        board_name: parsed.data.board_name,
        pin_id: parsed.data.pin_id,
        pin_title: parsed.data.pin_title,
        inspiration_image_url: parsed.data.inspiration_image_url,
        balanced_query: parsed.data.balanced_query,
        mode: parsed.data.mode,
      },
      user.id
    );

    return NextResponse.json({
      success: result.success,
      sync_status: result.success ? 'synced' : 'failed',
      error: result.error,
    });
  } catch (error) {
    console.error('Sheets append error:', error);
    return NextResponse.json({
      success: false,
      sync_status: 'failed',
      error: 'Failed to append to sheet',
    }, { status: 500 });
  }
}
