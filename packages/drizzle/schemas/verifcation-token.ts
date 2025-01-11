import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  boolean
} from 'drizzle-orm/pg-core'

export const verificationToken = pgTable(
  'verification_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    acessToken: text('acess_token').notNull(),
    status: boolean('status').notNull(),
    idToken: text('id_token').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
  },
  (table) => {
    return {
      tokenUnique: uniqueIndex().on(table.acessToken),
    }
  },
)