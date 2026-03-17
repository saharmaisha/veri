import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeImage } from '@/lib/services/image-analysis';
import type { AnalysisRequest } from '@/lib/types/analysis';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const analysisRequest: AnalysisRequest = {
      pin_id: body.pin_id,
      image_url: body.image_url,
      crop: body.crop,
    };

    const analysis = await analyzeImage(analysisRequest, user.id);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
