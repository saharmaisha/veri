import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeImage } from '@/lib/services/image-analysis';
import { orchestrateSearch } from '@/lib/services/search-orchestrator';
import type { BoardSearchRequest, SearchFilters } from '@/lib/types/products';
import type { PinAnalysis, PinterestPin } from '@/lib/types/database';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const filters: SearchFilters = {
      budget_min: body.budget_min,
      budget_max: body.budget_max,
      excluded_retailers: body.excluded_retailers || [],
      exclude_luxury: false,
      length: body.length ?? body.dress_length,
      sleeve_preference: body.sleeve_preference,
      color: body.color,
      mode: body.mode || 'both',
    };

    if (body.pins?.length) {
      const boardRequest = body as BoardSearchRequest;
      const selectedPins = boardRequest.search_scope === 'selected_pins' && boardRequest.selected_pin_ids?.length
        ? boardRequest.pins.filter((pin) => boardRequest.selected_pin_ids?.includes(pin.id))
        : boardRequest.pins;

      if (selectedPins.length === 0) {
        return NextResponse.json({ error: 'Select at least one pin.' }, { status: 400 });
      }

      const analyses = await Promise.all(
        selectedPins.map((pin) =>
          analyzeImage(
            {
              pin_id: pin.id,
              image_url: pin.image_url,
            },
            user.id
          )
        )
      );

      const result = await orchestrateSearch({
        pinSearches: selectedPins.map((pin, index) => ({
          pin,
          analysis: analyses[index],
          imageUrl: pin.image_url,
        })),
        filters,
        userId: user.id,
        boardId: boardRequest.board_id,
        boardName: boardRequest.board_name || null,
        searchScope: boardRequest.search_scope,
      });

      return NextResponse.json({
        search_run_id: result.searchRun.id,
        search_run: result.searchRun,
        products: result.products,
        analyses: result.analyses,
        selected_pins: result.selectedPins,
        board: result.board,
      });
    }

    if (!body.analysis) {
      return NextResponse.json(
        { error: 'Missing analysis object. Run analysis first.' },
        { status: 400 },
      );
    }

    const analysis: PinAnalysis = body.analysis;
    const pin: PinterestPin = body.pin || {
      id: analysis.pin_id,
      user_id: user.id,
      board_id: body.board_id || '',
      pinterest_pin_id: analysis.pin_id,
      section_key: null,
      section_name: null,
      title: body.pin_title || null,
      description: null,
      image_url: body.image_url || '',
      source_url: null,
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await orchestrateSearch({
      pinSearches: [{ pin, analysis, imageUrl: body.image_url || pin.image_url }],
      filters,
      userId: user.id,
      boardId: body.board_id || pin.board_id || null,
      boardName: body.board_name || null,
      searchScope: 'single_pin',
    });

    return NextResponse.json({
      search_run_id: result.searchRun.id,
      search_run: result.searchRun,
      products: result.products,
      analyses: result.analyses,
      selected_pins: result.selectedPins,
      board: result.board,
      analysis,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
