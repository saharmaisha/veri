import { z } from 'zod';

export const analysisResultSchema = z.object({
  short_description: z.string(),
  category: z.string(),
  primary_color: z.string(),
  secondary_colors: z.array(z.string()).default([]),
  material_or_texture: z.string().nullable().default(null),
  silhouette: z.string().nullable().default(null),
  sleeve_length: z.string().nullable().default(null),
  strap_type: z.string().nullable().default(null),
  length: z.string().nullable().default(null),
  neckline: z.string().nullable().default(null),
  fit: z.string().nullable().default(null),
  notable_details: z.array(z.string()).default([]),
  occasion: z.string().nullable().default(null),
  style_keywords: z.array(z.string()).default([]),
  broad_query: z.string(),
  balanced_query: z.string(),
  specific_query: z.string(),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export interface AnalysisRequest {
  pin_id: string;
  region_id?: string;
  image_url: string;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}
