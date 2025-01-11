import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { user } from './';

export const webhooks = pgTable(
  'webhooks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    url: text('url').notNull(),
    channels: text('channels').notNull(), 
    eventType: text('event_type').notNull(), 
    status: boolean('status').default(true),
    userId: uuid('user_id') 
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
  }
);


export const webhooksRelations = relations(webhooks, ({ one }) => ({
  user: one(user, {
    fields: [webhooks.userId],
    references: [user.id],
  }),
}));
