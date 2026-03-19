import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_FEEDBACK_FORM_URL: z.string().url().optional().or(z.literal('')).default(''),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email().optional().or(z.literal('')).default(''),
  BROWSERBASE_API_KEY: z.string().default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default(''),
  OPENAI_API_KEY: z.string().default(''),
  SHOPPING_PROVIDER_MODE: z.enum(['mock', 'text', 'image', 'full']).default('mock'),
  TEXT_SHOPPING_PROVIDER_KEY: z.string().default(''),
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
    BROWSERBASE_API_KEY: process.env.BROWSERBASE_API_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SHOPPING_PROVIDER_MODE: process.env.SHOPPING_PROVIDER_MODE,
    TEXT_SHOPPING_PROVIDER_KEY: process.env.TEXT_SHOPPING_PROVIDER_KEY,
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

export function isOpenAIConfigured(): boolean {
  return !!env().OPENAI_API_KEY;
}

export function isBrowserbaseConfigured(): boolean {
  return !!env().BROWSERBASE_API_KEY;
}
