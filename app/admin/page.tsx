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
    {
      label: 'Guests coming',
      value: `${split.adults + split.kids} guest${split.adults + split.kids === 1 ? '' : 's'}`,
    },
    { label: 'Notes to caterer', value: totals.dietaryNotes },
  ];

  return (
    <main className="mx-auto flex w-full max-w-[72rem] flex-col gap-6 px-5 py-12 sm:px-6 sm:py-16">
      {/* header: stacked on a phone (full-page buttons, couple review r7), one row from sm */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-h2 text-ink sm:text-h1">RSVP dashboard</h1>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-3">
          <Button
            href="/admin/export.csv"
            variant="secondary"
            className="h-12 w-full whitespace-nowrap px-4 text-caption sm:h-11 sm:w-auto sm:text-caption"
          >
            Export CSV
          </Button>
          <form action={signOutAdmin} className="contents">
            <Button
              type="submit"
              variant="ghost"
              className="h-12 w-full whitespace-nowrap px-4 text-caption sm:h-11 sm:w-auto sm:text-caption"
            >
              Sign out
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1">
            <p className="font-body text-caption text-ink-soft">{stat.label}</p>
            <p className="break-words font-display text-h3 tabular-nums text-ink">{stat.value}</p>
          </Card>
        ))}
      </div>

      <LiveRefresher />
      <AdminTable rows={rows.map(toTableRow)} />
    </main>
  );
}
