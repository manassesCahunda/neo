import type { Config } from 'drizzle-kit';
import { env } from "@neo/env";


export default {
    dialect:"postgresql",
      schema:"./schemas/index.ts",
      out:"./migrations",
      dbCredentials:{
        url:env.DATABASE_URL!,
     },
    strict:true,
    verbose:true,
} satisfies Config;