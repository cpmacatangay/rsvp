import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const rsvpStatus = pgEnum('rsvp_status', ['accepted', 'declined']);

/**
 * SCHEMA.md §3.1 — preloaded guest list. `capConfirmed=false` marks the 11
 * households whose count the couple did not supply (seeded at 1/0 per the
 * approved default; displayed with a "cap unconfirmed" badge in /admin).
 */
export const households = pgTable('households', {
  id: uuid().primaryKey().defaultRandom(),
  code: varchar({ length: 12 }).notNull().unique(),
  searchName: varchar({ length: 80 }).notNull().unique(),
  displayName: varchar({ length: 80 }).notNull(),
  maxAdults: integer().notNull().default(1),
  maxKids: integer().notNull().default(0),
  capConfirmed: boolean().notNull().default(true),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

/**
 * SCHEMA.md §3.2 — one response per household (unique FK, cascade delete).
 * Latest submission wins: the upsert overwrites all response fields and
 * refreshes `updatedAt` while `submittedAt` keeps the first-ever timestamp.
 */
export const rsvps = pgTable('rsvps', {
  id: uuid().primaryKey().defaultRandom(),
  householdId: uuid()
    .notNull()
    .references(() => households.id, { onDelete: 'cascade' })
    .unique(),
  status: text({ enum: ['accepted', 'declined'] }).notNull(),
  adultsAttending: integer().notNull().default(0),
  kidsAttending: integer().notNull().default(0),
  dietaryNotes: varchar({ length: 280 }),
  submittedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
