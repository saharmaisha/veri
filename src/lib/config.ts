import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_FEEDBACK_FORM_URL: z.string().url().optional().or(z.literal('')).default(''),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email().optional().or(z.literal('')).default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default(''),
  OPENAI_API_KEY: z.string().default(''),
  PINTEREST_CLIENT_ID: z.string().default(''),
  PINTEREST_CLIENT_SECRET: z.string().default(''),
  PINTEREST_REDIRECT_URI: z.string().default('http://localhost:3000/api/pinterest/callback'),
  GOOGLE_CLIENT_EMAIL: z.string().default(''),
  GOOGLE_PRIVATE_KEY: z.string().default(''),
  GOOGLE_CLIENT_ID: z.string().default(''),
  GOOGLE_CLIENT_SECRET: z.string().default(''),
  GOOGLE_REDIRECT_URI: z.string().default('http://localhost:3000/api/google/callback'),
  GOOGLE_SHEETS_DEFAULT_RANGE: z.string().default('Sheet1!A1'),
  SHOPPING_PROVIDER_MODE: z.enum(['mock', 'text', 'image', 'full']).default('mock'),
  TEXT_SHOPPING_PROVIDER_KEY: z.string().default(''),
  IMAGE_SHOPPING_PROVIDER_KEY: z.string().default(''),
  ENCRYPTION_SECRET: z
    .string()
    .regex(/^[0-9a-f]{64}$/i, 'ENCRYPTION_SECRET must be a 64-character hex string'),
});

type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  return envSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_FEEDBACK_FORM_URL: process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL,
    NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PINTEREST_CLIENT_ID: process.env.PINTEREST_CLIENT_ID,
    PINTEREST_CLIENT_SECRET: process.env.PINTEREST_CLIENT_SECRET,
    PINTEREST_REDIRECT_URI: process.env.PINTEREST_REDIRECT_URI,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    GOOGLE_SHEETS_DEFAULT_RANGE: process.env.GOOGLE_SHEETS_DEFAULT_RANGE,
    SHOPPING_PROVIDER_MODE: process.env.SHOPPING_PROVIDER_MODE,
    TEXT_SHOPPING_PROVIDER_KEY: process.env.TEXT_SHOPPING_PROVIDER_KEY,
    IMAGE_SHOPPING_PROVIDER_KEY: process.env.IMAGE_SHOPPING_PROVIDER_KEY,
    ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
  });
}

let _env: Env | null = null;

export function env(): Env {
  if (!_env) {
    _env = getEnv();
  }
  return _env;
}

export function isMockMode(): boolean {
  return env().SHOPPING_PROVIDER_MODE === 'mock';
}

export function isPinterestConfigured(): boolean {
  const e = env();
  return !!(e.PINTEREST_CLIENT_ID && e.PINTEREST_CLIENT_SECRET);
}

export function isOpenAIConfigured(): boolean {
  return !!env().OPENAI_API_KEY;
}

export function isGoogleSheetsConfigured(): boolean {
  const e = env();
  // Supports both service account (legacy) and OAuth modes
  return !!(e.GOOGLE_CLIENT_ID && e.GOOGLE_CLIENT_SECRET) ||
    !!(e.GOOGLE_CLIENT_EMAIL && e.GOOGLE_PRIVATE_KEY);
}

export function isGoogleOAuthConfigured(): boolean {
  const e = env();
  return !!(e.GOOGLE_CLIENT_ID && e.GOOGLE_CLIENT_SECRET);
}
