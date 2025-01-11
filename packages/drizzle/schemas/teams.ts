import { relations } from 'drizzle-orm';
import { pgTable,timestamp, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { files, user , companies } from '.';

export const teams = pgTable(
  'teams',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    amount:text("amount").notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
  },
  (table) => {
    return {
      companyKey: uniqueIndex().on(table.companyId),
    };
  }
);

export const teamRelations = relations(teams, ({ many }) => ({
  members: many(user),
  files:many(files)
}));