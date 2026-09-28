import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { computeTotals, getAdminRows, headcountSplit } from '~/lib/admin-data';
import { statusView } from '~/lib/status';
import { isAdminSession } from '~/lib/session';

export const metadata: Metadata = {
  title: 'RSVP dashboard',
  robots: { index: false, follow: false },
};

/** US8-US10: password-gated dashboard, totals, CSV export (no editing: PRD non-goal). */
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
          <form>
            {/* sign out posted as a plain form so it never depends on JS */}
          </form>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1">
            <p className="font-body text-caption text-ink-soft">{stat.label}</p>
            <p className="font-display text-h3 tabular-nums text-ink">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-card shadow-card">
        <table className="w-full min-w-[46rem] border-collapse font-body text-caption">
          <thead>
            <tr className="bg-warm text-left text-ink-soft">
              <th className="px-4 py-3">Household</th>
              <th className="px-4 py-3">Invitation</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Adults</th>
              <th className="px-4 py-3">Children</th>
              <th className="px-4 py-3">Dietary</th>
              <th className="px-4 py-3">Responded</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const view = statusView(row.status);
              const invited =
                `${row.maxAdults} adult${row.maxAdults === 1 ? '' : 's'}` +
                `${row.maxKids > 0 ? ` + ${row.maxKids} child${row.maxKids === 1 ? '' : 'ren'}` : ''}`;
              return (
                <tr key={row.householdId} className="border-line border-t text-ink">
                  <td className="px-4 py-3 text-body">{row.displayName}</td>
                  <td className="px-4 py-3">
                    <span>{invited}</span>
                    {!row.capConfirmed ? (
                      <span className="ml-2">
                        <Badge label="cap unconfirmed" className="bg-warm text-ink-soft" />
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {row.status ? (
                      <Badge label={view.label} dot={view.dot} className={view.className} />
                    ) : (
                      <Badge label="Pending" className={statusView(null).className} />
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{row.adults ?? ''}</td>
                  <td className="px-4 py-3 tabular-nums">{row.kids ?? ''}</td>
                  <td className="px-4 py-3">{row.dietary ?? ''}</td>
                  <td className="px-4 py-3">
                    {row.updatedAt
                      ? new Intl.DateTimeFormat('en-PH', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                          timeZone: 'Asia/Manila',
                        }).format(row.updatedAt)
                      : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
