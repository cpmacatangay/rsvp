'use client';

import { useMemo, useState } from 'react';

import { Badge } from '~/components/ui/Badge';
import { statusView } from '~/lib/status';

/**
 * Admin table (US9).
 * - Search: name-only (fastest approach at 63 rows: one lowercase substring test)
 * - Header-level status filter: All / Pending / Accepted / Declined chips
 * - Totals above are computed on ALL rows and never change with the filters.
 * Rows arrive serialized from the server (dates as strings).
 */

const STATUS_CHIPS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'declined', label: 'Declined' },
] as const;

type StatusChipKey = (typeof STATUS_CHIPS)[number]['key'];

export type AdminTableRow = {
  householdId: string;
  displayName: string;
  maxAdults: number;
  maxKids: number;
  capConfirmed: boolean;
  status: 'accepted' | 'declined' | null;
  adults: number | null;
  kids: number | null;
  dietary: string | null;
  respondedAt: string | null;
};

export function AdminTable({ rows }: { rows: AdminTableRow[] }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusChipKey>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== 'all' && (row.status ?? 'pending') !== statusFilter) return false;
      if (q && !row.displayName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, query, statusFilter]);

  const showCounts = query.trim().length > 0 || statusFilter !== 'all';

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1 sm:max-w-sm">
          <label htmlFor="guest-search" className="font-body text-caption text-ink-soft">
            Search guests
          </label>
          <input
            id="guest-search"
            name="guest-search"
            type="search"
            placeholder="Search by name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-md border-[1.5px] border-line bg-card px-4 py-3 font-body text-body text-ink transition-colors duration-150 ease-enter focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
          {STATUS_CHIPS.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => setStatusFilter(chip.key)}
              aria-pressed={statusFilter === chip.key}
              className={`h-11 rounded-full border-[1.5px] px-4 font-body text-caption transition-colors duration-150 ease-enter ${
                statusFilter === chip.key
                  ? 'border-primary bg-primary text-page-ivory'
                  : 'border-line bg-card text-ink-soft hover:bg-warm'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {showCounts ? (
        <p className="font-body text-caption text-ink-soft" role="status">
          Showing {filtered.length} of {rows.length} households. Totals above always count all
          guests.
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-line bg-card shadow-card">
        <table className="w-full min-w-[46rem] border-collapse font-body text-caption">
          <thead>
            <tr className="bg-warm text-left text-ink-soft">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Invitation</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Adults</th>
              <th className="px-4 py-3">Children</th>
              <th className="px-4 py-3">Dietary</th>
              <th className="px-4 py-3">Responded</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
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
                    <Badge label={view.label} dot={view.dot} className={view.className} />
                  </td>
                  <td className="px-4 py-3 tabular-nums">{row.adults ?? ''}</td>
                  <td className="px-4 py-3 tabular-nums">{row.kids ?? ''}</td>
                  <td className="px-4 py-3">{row.dietary ?? ''}</td>
                  <td className="px-4 py-3">
                    {row.respondedAt
                      ? new Intl.DateTimeFormat('en-PH', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                          timeZone: 'Asia/Manila',
                        }).format(new Date(row.respondedAt))
                      : ''}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-ink-soft">
                  No guests match the current search or filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
