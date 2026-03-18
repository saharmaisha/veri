import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { trackAppEvent } from '@/lib/services/app-events';
import { appendToSheet, ensureHeaders } from '@/lib/services/google-sheets';
import { deleteSavedItem, getSavedItems, upsertSavedItem } from '@/lib/services/saved-items';
import type { ProductResult } from '@/lib/types/database';
import { savedItemCreateSchema, savedItemDeleteSchema } from '@/lib/utils/validators';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const items = await getSavedItems(user.id);
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load saved items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = savedItemCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid save payload' }, { status: 400 });
    }

    const { product, board_name, pin_title, inspiration_image_url, balanced_query, mode } = parsed.data;
    if (!product.source_pin_id) {
      return NextResponse.json({ error: 'Missing source pin for saved item' }, { status: 400 });
    }

    const { data: integration } = await supabase
      .from('google_integrations')
      .select('google_connected, spreadsheet_id')
      .eq('user_id', user.id)
      .single();

    let googleSyncStatus: 'pending' | 'synced' | 'failed' | 'not_configured' = 'not_configured';
    let googleSyncError: string | null = null;

    if (integration?.google_connected && integration.spreadsheet_id) {
      const productForSheet: ProductResult = {
        ...product,
        board_id: product.board_id ?? null,
        board_name: product.board_name ?? null,
        source_pin_id: product.source_pin_id ?? null,
        source_pin_title: product.source_pin_title ?? null,
        source_pin_image_url: product.source_pin_image_url ?? null,
        balanced_query: product.balanced_query ?? null,
        raw_payload: product.raw_payload ?? null,
      };
      googleSyncStatus = 'pending';
      await ensureHeaders(integration.spreadsheet_id, user.id);
      const sheetResult = await appendToSheet(
        integration.spreadsheet_id,
        {
          product: productForSheet,
          user_email: user.email || '',
          board_name: board_name ?? product.board_name ?? undefined,
          pin_id: product.source_pin_id,
          pin_title: pin_title ?? product.source_pin_title ?? undefined,
          inspiration_image_url: inspiration_image_url ?? product.source_pin_image_url ?? undefined,
          balanced_query: balanced_query ?? product.balanced_query ?? undefined,
          mode: mode ?? undefined,
        },
        user.id
      );

      googleSyncStatus = sheetResult.success ? 'synced' : 'failed';
      googleSyncError = sheetResult.success ? null : sheetResult.error || 'Failed to append to sheet';
    }

    const item = await upsertSavedItem({
      userId: user.id,
      productResultId: product.id,
      pinId: product.source_pin_id,
      searchRunId: product.search_run_id,
      googleSyncStatus,
      googleSyncError,
    });

    await trackAppEvent({
      userId: user.id,
      eventType: 'product_saved',
      path: '/api/saved',
      metadata: {
        productResultId: product.id,
        searchRunId: product.search_run_id,
        googleSyncStatus,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Save item error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = savedItemDeleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid delete payload' }, { status: 400 });
    }

    await deleteSavedItem(user.id, parsed.data.product_result_id);

    await trackAppEvent({
      userId: user.id,
      eventType: 'product_unsaved',
      path: '/api/saved',
      metadata: { productResultId: parsed.data.product_result_id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to remove saved item' },
      { status: 500 }
    );
  }
}
