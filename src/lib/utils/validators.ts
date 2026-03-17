import { z } from 'zod';

export const analysisRequestSchema = z.object({
  pin_id: z.string().min(1),
  image_url: z.string().url().or(z.string().min(1)),
  crop: z
    .object({
      x: z.number(),
      y: z.number(),
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional(),
});

export const searchRequestSchema = z.object({
  analysis_id: z.string().min(1),
  pin_id: z.string().optional(),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  excluded_retailers: z.array(z.string()).optional(),
  exclude_luxury: z.boolean().optional(),
  mode: z.enum(['exact', 'vibe', 'both']).optional(),
  image_url: z.string().optional(),
});

export const sheetsAppendSchema = z.object({
  product: z.object({
    title: z.string(),
    retailer: z.string(),
    price_text: z.string(),
    numeric_price: z.number().nullable(),
    currency: z.string(),
    product_url: z.string(),
    image_url: z.string(),
    match_reason: z.string().nullable(),
  }),
  spreadsheet_id: z.string().optional(),
  search_run_id: z.string().optional(),
  pin_id: z.string().optional(),
  pin_title: z.string().optional(),
  board_name: z.string().optional(),
  inspiration_image_url: z.string().optional(),
  balanced_query: z.string().optional(),
  mode: z.string().optional(),
});

export const preferencesSchema = z.object({
  default_budget_min: z.number().nullable().optional(),
  default_budget_max: z.number().nullable().optional(),
  exclude_luxury: z.boolean().optional(),
});
