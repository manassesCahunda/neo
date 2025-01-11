import { z } from 'zod';

import { createEnv } from '@t3-oss/env-nextjs';

require("dotenv-mono").load();

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    DATABASE_URL: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    EMAIL: z.string().min(1),
    EMAIL_PASSOWRD: z.string().min(1),
    SUPABASE_URL: z.string().min(1),
    SUPABASE_PRIVATE_KEY: z.string().min(1),
    PDF_API_KEY: z.string().min(1),
    TRIGGER_SECRET_KEY_PROD: z.string().min(1),
    TRIGGER_SECRET_KEY_DEV:  z.string().min(1),
    PROJECT_ID : z.string().min(1),
    SECRET_KEY_JWT: z.string().min(1),
    GOOGLE_API_KEY_AI: z.string().min(1),
    URL: z.string().min(1),
    HTTPONLY: z.string().min(1),
    QSTASH_URL: z.string().min(1),
    QSTASH_TOKEN: z.string().min(1),
    QSTASH_CURRENT_SIGNING_KEY: z.string().min(1),
    QSTASH_NEXT_SIGNING_KEY: z.string().min(1),
  },
  client: {
    //NEXT_PUBLIC_VERCEL_URL: z.string().url().min(1),
  },
  shared: {
    VERCEL_ENV: z
      .enum(['production', 'preview', 'development'])
      .default('development'),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})