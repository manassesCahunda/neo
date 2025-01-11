import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '@neo/env'

import * as schema from "./schemas";

const connectionString = env.DATABASE_URL

const client = postgres(connectionString)
export const db = drizzle(client, { schema })
