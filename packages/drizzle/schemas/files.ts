import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { user } from './';

export const files = pgTable(
  'files',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    fileName: text('file_name').notNull(),
    filePath: text('file_path'),
    fileType: text('file_type').notNull(),
    filesize: integer('file_size').notNull(),
    idFile: text('id_file').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
    lastModified: text('last_modified'),
    lastModifiedDate: timestamp('last_modified_date').notNull(), 
    userId: uuid('user_id').notNull(),
  }
);

export const filesRelations = relations(files, ({ one }) => ({
  user: one(user, {
    fields: [files.userId],
    references: [user.id],
  }),
}));
