import { env } from '@neo/env'
import { Client } from '@upstash/qstash'

export const qstash = new Client({
  token: env.QSTASH_TOKEN,
})