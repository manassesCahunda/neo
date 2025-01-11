import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { user } from '.'

export const session = pgTable('sessions', {
  idToken: text('id_token').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  token: text('token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  tokenType: text('token_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(), 
  updatedAt: timestamp('updated_at').defaultNow().notNull(), 
})

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))