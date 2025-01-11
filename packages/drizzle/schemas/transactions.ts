import { relations } from 'drizzle-orm';
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import {
  files,
  user,
} from './';

export const transactions = pgTable('transasctions', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyName: varchar('company_name'),
    entity: varchar('entity'),
    identify: varchar('identify'),
    details: text('details'),
    dateInvoice: text('date_invoice'),
    expiryDate: text('expiry_date'),
    typeInvoice: text('type_invoice'),
    unitPrice: jsonb('unit_price'),
    amount: jsonb('amount'),
    total:  jsonb('total'),
    totalIva:  jsonb('total_iva'),
    balanceTotal: jsonb('balance_total'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: text('user_id'),
    idFile: text('id_file'),
});


export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  user: one(user, {
    fields: [transactions.userId], 
    references: [user.id],
  }),
  files: one(files, {
    fields: [transactions.idFile], 
    references: [files.id],
  })
}));
