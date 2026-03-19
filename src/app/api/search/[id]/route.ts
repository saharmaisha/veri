import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch search run
  const { data: searchRun, error: searchRunError } = await supabase
    .from('search_runs')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (searchRunError || !searchRun) {
    return NextResponse.json({ error: 'Search run not found' }, { status: 404 });
  }

  // Fetch products for this search run
  const { data: products, error: productsError } = await supabase
    .from('product_results')
    .select('*')
    .eq('search_run_id', id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (productsError) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }

  // Fetch selected pins if available
  let selectedPins: unknown[] = [];
  if (searchRun.selected_pin_ids && searchRun.selected_pin_ids.length > 0) {
    const { data: pins } = await supabase
      .from('pinterest_pins')
      .select('*')
      .in('id', searchRun.selected_pin_ids);
    selectedPins = pins || [];
  }

  // Fetch board if available
  let board = null;
  if (searchRun.board_id) {
    const { data: boardData } = await supabase
      .from('pinterest_boards')
      .select('id, name')
      .eq('id', searchRun.board_id)
      .single();
    board = boardData;
  } else if (searchRun.board_name) {
    board = { id: null, name: searchRun.board_name };
  }

  // Fetch analyses for the pins
  let analyses: unknown[] = [];
  if (searchRun.selected_pin_ids && searchRun.selected_pin_ids.length > 0) {
    const { data: analysesData } = await supabase
      .from('pin_analyses')
      .select('*')
      .in('pin_id', searchRun.selected_pin_ids)
      .order('created_at', { ascending: false });

    // Get the most recent analysis for each pin
    const analysisMap = new Map<string, unknown>();
    for (const analysis of analysesData || []) {
      if (!analysisMap.has(analysis.pin_id)) {
        analysisMap.set(analysis.pin_id, analysis);
      }
    }
    analyses = Array.from(analysisMap.values());
  }

  return NextResponse.json({
    search_run_id: searchRun.id,
    search_run: searchRun,
    products: products || [],
    analyses,
    selected_pins: selectedPins,
    board,
  });
}
