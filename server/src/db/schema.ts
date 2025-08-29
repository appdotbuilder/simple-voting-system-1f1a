import { serial, text, pgTable, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Options table for voting options
export const optionsTable = pgTable('options', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'), // Nullable by default
  vote_count: integer('vote_count').notNull().default(0), // Track vote count for performance
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Votes table to store individual votes
export const votesTable = pgTable('votes', {
  id: serial('id').primaryKey(),
  option_id: integer('option_id').notNull().references(() => optionsTable.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Define relations between options and votes
export const optionsRelations = relations(optionsTable, ({ many }) => ({
  votes: many(votesTable),
}));

export const votesRelations = relations(votesTable, ({ one }) => ({
  option: one(optionsTable, {
    fields: [votesTable.option_id],
    references: [optionsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type Option = typeof optionsTable.$inferSelect;
export type NewOption = typeof optionsTable.$inferInsert;
export type Vote = typeof votesTable.$inferSelect;
export type NewVote = typeof votesTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = { 
  options: optionsTable, 
  votes: votesTable 
};

export const tableRelations = {
  optionsRelations,
  votesRelations
};