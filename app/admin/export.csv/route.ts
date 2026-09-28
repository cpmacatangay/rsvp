import type { NextRequest, NextResponse } from 'next/server';

import { buildRsvpCsv } from '~/lib/csv';
import { getAdminRows } from '~/lib/admin-data';
import { isAdminSession } from '~/lib/session';

/** US10 — CSV export, session-gated (ARCH §10). */
export async function GET(_request: NextRequest) {
  if (!(await isAdminSession())) {
    const res: NextResponse = new Response('Unauthorized', { status: 401 }) as NextResponse;
    return res;
  }

  const rows = await getAdminRows();
  const csv = buildRsvpCsv(
    rows.map((row) => ({
      household: row.displayName,
      status: row.status ?? 'pending',
      adults: row.adults,
      kids: row.kids,
      dietary: row.dietary,
      capConfirmed: row.capConfirmed,
      respondedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
    })),
  );

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="wedding-rsvps.csv"`,
    },
  });
}
