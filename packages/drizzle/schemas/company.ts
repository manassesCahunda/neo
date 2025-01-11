import { relations } from 'drizzle-orm';
import { json,timestamp, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { files , user , teams } from '.';

export const companies = pgTable(
  'companies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    domain: text('domain').notNull(),
    externalId: text('external_id'),
    externalApiKey: json('external_api_key').$type<{}>(),
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
  },
  (table) => {
    return {
      domainKey: uniqueIndex().on(table.domain),
    };
  }
);


export const companyRelations = relations(companies, ({ many }) => ({
  members: many(user),
  files: many(files),  
  teams: many(teams), 
}));



