import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AdminTable, type AdminTableRow } from '~/components/admin/AdminTable';
import { LiveRefresher } from '~/components/admin/LiveRefresher';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { computeTotals, getAdminRows, headcountSplit, type AdminRow } from '~/lib/admin-data';
import { isAdminSession } from '~/lib/session';
import { signOutAdmin } from '~/app/admin/action';

export const metadata: Metadata = {
  title: 'RSVP dashboard',
  robots: { index: false, follow: false },
};

function toTableRow(row: AdminRow): AdminTableRow {
  return {
    householdId: row.householdId,
    displayName: row.displayName,
    maxAdults: row.maxAdults,
    maxKids: row.maxKids,
    capConfirmed: row.capConfirmed,
    status: row.status,
    adults: row.adults,
    kids: row.kids,
    dietary: row.dietary,
    respondedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
  };
}

/** US8-US10: password-gated dashboard, totals, searchable table, CSV export. */
export default async function AdminPage() {
  if (!(await isAdminSession())) redirect('/admin/login');

  const rows = await getAdminRows();
  const totals = computeTotals(rows);
  const split = headcountSplit(rows);

  const stats = [
    { label: 'Households invited', value: totals.households },
    { label: 'Responded', value: `${totals.responded} of ${totals.households}` },
    { label: 'Accepted headcount', value: `${split.adults} adults + ${split.kids} children` },
    { label: 'Notes to caterer', value: totals.dietaryNotes },
  ];

  return (
    <main className="mx-auto w-full max-w-[72rem] px-5 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-display text-h1 text-ink">RSVP dashboard</h1>
        <div className="flex gap-3">
          <Button href="/admin/export.csv" variant="secondary">
            Export CSV
          </Button>
          <form action={signOutAdmin}>
            <Button type="submit" variant="ghost">
              Sign out
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1">
            <p className="font-body text-caption text-ink-soft">{stat.label}</p>
            <p className="font-display text-h3 tabular-nums text-ink">{stat.value}</p>
          </Card>
        ))}
      </div>

      <LiveRefresher />
      <AdminTable rows={rows.map(toTableRow)} />
    </main>
  );
}
