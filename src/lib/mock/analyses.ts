import type { PinAnalysis } from '@/lib/types/database';
import type { AnalysisResult } from '@/lib/types/analysis';

const MOCK_ANALYSES: Record<string, AnalysisResult> = {
  'mock-pin-1': {
    short_description: 'Elegant white midi dress with puff sleeves and a fitted bodice, perfect for formal spring events',
    category: 'dress',
    primary_color: 'white',
    secondary_colors: [],
    material_or_texture: 'cotton blend',
    silhouette: 'A-line',
    sleeve_length: 'elbow-length puff',
    strap_type: null,
    length: 'midi',
    neckline: 'square',
    fit: 'fitted waist, flared skirt',
    notable_details: ['puff sleeves', 'smocked bodice', 'tiered skirt'],
    occasion: 'graduation, formal event',
    style_keywords: ['elegant', 'feminine', 'classic', 'spring'],
    broad_query: 'white midi dress',
    balanced_query: 'white puff sleeve midi dress A-line',
    specific_query: 'white cotton midi dress puff sleeves square neckline smocked bodice tiered skirt',
  },
  'mock-pin-2': {
    short_description: 'Colorful floral wrap dress with a V-neckline and flutter sleeves',
    category: 'dress',
    primary_color: 'multicolor floral',
    secondary_colors: ['pink', 'green', 'yellow'],
    material_or_texture: 'chiffon',
    silhouette: 'wrap',
    sleeve_length: 'flutter',
    strap_type: null,
    length: 'knee-length',
    neckline: 'V-neck',
    fit: 'wrap waist, flowing skirt',
    notable_details: ['wrap tie', 'ruffled hem', 'floral print'],
    occasion: 'graduation, garden party',
    style_keywords: ['romantic', 'floral', 'spring', 'feminine'],
    broad_query: 'floral wrap dress',
    balanced_query: 'floral wrap dress V-neck flutter sleeves',
    specific_query: 'chiffon floral wrap dress V-neckline flutter sleeves knee length ruffled hem',
  },
  'mock-pin-3': {
    short_description: 'Classic navy blue A-line dress with cap sleeves and a modest neckline',
    category: 'dress',
    primary_color: 'navy blue',
    secondary_colors: [],
    material_or_texture: 'crepe',
    silhouette: 'A-line',
    sleeve_length: 'cap',
    strap_type: null,
    length: 'knee-length',
    neckline: 'boat neck',
    fit: 'fitted bodice, flared skirt',
    notable_details: ['cap sleeves', 'back zipper', 'clean lines'],
    occasion: 'graduation, office, formal',
    style_keywords: ['classic', 'timeless', 'professional', 'elegant'],
    broad_query: 'navy blue dress',
    balanced_query: 'navy blue A-line dress cap sleeves boat neck',
    specific_query: 'navy blue crepe A-line dress cap sleeves boat neckline knee length fitted bodice',
  },
  'mock-pin-4': {
    short_description: 'Soft pastel pink cocktail dress with a sweetheart neckline and fitted silhouette',
    category: 'dress',
    primary_color: 'pastel pink',
    secondary_colors: [],
    material_or_texture: 'satin',
    silhouette: 'bodycon',
    sleeve_length: 'sleeveless',
    strap_type: 'thin straps',
    length: 'above knee',
    neckline: 'sweetheart',
    fit: 'body-hugging',
    notable_details: ['sweetheart neckline', 'satin finish', 'back slit'],
    occasion: 'cocktail party, graduation dinner',
    style_keywords: ['romantic', 'glamorous', 'feminine', 'party'],
    broad_query: 'pink cocktail dress',
    balanced_query: 'pastel pink satin cocktail dress sweetheart neckline',
    specific_query: 'pastel pink satin bodycon dress sweetheart neckline thin straps above knee back slit',
  },
};

export function getMockAnalysis(pinId: string): AnalysisResult | null {
  return MOCK_ANALYSES[pinId] || null;
}

export function getMockPinAnalysis(pinId: string, userId: string): PinAnalysis | null {
  const analysis = MOCK_ANALYSES[pinId];
  if (!analysis) return null;

  return {
    id: `mock-analysis-${pinId}`,
    pin_id: pinId,
    region_id: null,
    user_id: userId,
    analysis_mode: 'full_pin',
    ...analysis,
    raw_model_output: analysis as unknown as Record<string, unknown>,
    created_at: new Date().toISOString(),
  };
}

export function getAllMockAnalyses(): Record<string, AnalysisResult> {
  return MOCK_ANALYSES;
}
