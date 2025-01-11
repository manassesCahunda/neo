import { env } from '@neo/env';
import { configure } from '@trigger.dev/sdk/v3';

configure({
  secretKey: env.TRIGGER_SECRET_KEY_DEV
});

export * from "./src/openaiGenerate";
export * from "./src/uploadFile";
export * from "./src/openaiGenerateMessage";