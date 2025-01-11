import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  pgEnum
} from 'drizzle-orm/pg-core';

import { companies, session, files , teams } from '.';

export const rolesEnum = pgEnum('roles', ['Owner', 'admin', 'member', 'Anonymous']);


export const user = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id').notNull(),
    name: text('name'),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    emailVerified: timestamp('email_verified'),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
    role: rolesEnum('roles').default('Anonymous'),
  },
  (table) => {
    return {
      emailUnique: uniqueIndex().on(table.email), 
    };
  },
);

export const userRelations = relations(user, ({ one, many }) => ({
  companies: one(companies, {
    fields: [user.companyId],
    references: [companies.id],
  }),
  sessions: many(session),
  teams: many(teams),
  files: many(files),
}));
