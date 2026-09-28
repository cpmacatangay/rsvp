import 'server-only';

import { eq } from 'drizzle-orm';

import { getDb } from '~/db';
import { households, rsvps } from '~/db/schema';

/**
 * Admin dashboard data (ARCH §3.2: single eager query — few hundred rows).
 * LEFT JOIN keeps households without responses visible as Pending.
 */

export type AdminRow = {
  householdId: string;
  displayName: string;
  maxAdults: number;
  maxKids: number;
  capConfirmed: boolean;
  status: 'accepted' | 'declined' | null;
  adults: number | null;
  kids: number | null;
  dietary: string | null;
  updatedAt: Date | null;
};

export type AdminTotals = {
  households: number;
  responded: number;
  pending: number;
  acceptedHeadcount: number;
  dietaryNotes: number;
};

export async function getAdminRows(): Promise<AdminRow[]> {
  const db = getDb();
  const rows = await db
    .select({
      householdId: households.id,
      displayName: households.displayName,
      maxAdults: households.maxAdults,
      maxKids: households.maxKids,
      capConfirmed: households.capConfirmed,
      status: rsvps.status,
      adults: rsvps.adultsAttending,
      kids: rsvps.kidsAttending,
      dietary: rsvps.dietaryNotes,
      updatedAt: rsvps.updatedAt,
    })
    .from(households)
    .leftJoin(rsvps, eq(rsvps.householdId, households.id))
    .orderBy(households.searchName);

  return rows.map((row) => ({
    ...row,
    status: row.status ?? null,
    adults: row.adults ?? null,
    kids: row.kids ?? null,
    dietary: row.dietary ?? null,
    updatedAt: row.updatedAt ?? null,
  }));
}

export function computeTotals(rows: AdminRow[]): AdminTotals {
  const responded = rows.filter((r) => r.status !== null);
  return {
    households: rows.length,
    responded: responded.length,
    pending: rows.length - responded.length,
    acceptedHeadcount: responded
      .filter((r) => r.status === 'accepted')
      .reduce((sum, r) => sum + (r.adults ?? 0) + (r.kids ?? 0), 0),
    dietaryNotes: responded.filter((r) => (r.dietary ?? '').length > 0).length,
  };
}

/** guard for aggregates used in both page + CSV (kept pure): accepted split */
export function headcountSplit(rows: AdminRow[]): { adults: number; kids: number } {
  const accepted = rows.filter((r) => r.status === 'accepted');
  return {
    adults: accepted.reduce((sum, r) => sum + (r.adults ?? 0), 0),
    kids: accepted.reduce((sum, r) => sum + (r.kids ?? 0), 0),
  };
}
