'use client';

import { useEffect, useState } from 'react';

/**
 * Countdown — client island inside the server-rendered Info section.
 * targetMs: end-of-day Asia/Manila cutoff, or null while date is TBD
 * (CONTENT.md: wedding date is an explicit open fact => graceful state).
 * Changing digits crossfade 180ms (DESIGN §9); reduced-motion collapses this
 * via the global CSS rule, so no extra hook needed.
 */

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function remaining(targetMs: number, now: number): Remaining {
  const diff = Math.max(0, targetMs - now);
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 60_000) % 60;
  const hours = Math.floor(diff / 3_600_000) % 24;
  const days = Math.floor(diff / 86_400_000);
  return { days, hours, minutes, seconds };
}

const UNITS: Array<{ key: keyof Remaining; label: string }> = [
  { key: 'days', label: 'days' },
  { key: 'hours', label: 'hours' },
  { key: 'minutes', label: 'minutes' },
  { key: 'seconds', label: 'seconds' },
];

export function CountdownCell({ targetMs }: { targetMs: number | null }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (targetMs === null) {
    return (
      <p className="font-display text-h1 text-ink">
        Date to be announced<span className="text-primary">.</span>
      </p>
    );
  }

  if (now === null) {
    // first server/browser paint: reserved height (tabular digits) avoids CLS
    return <p className="font-display text-h1 tabular-nums text-ink-soft">&nbsp;</p>;
  }

  const r = remaining(targetMs, now);
  if (r.days + r.hours + r.minutes + r.seconds === 0) {
    return <p className="font-display text-h1 text-primary">It is the wedding day!</p>;
  }

  return (
    <p className="flex items-baseline gap-1 font-display text-h1 tabular-nums text-ink">
      {UNITS.map(({ key, label }, index) => (
        <span key={label} className="flex items-baseline gap-1">
          {index > 0 ? (
            <span aria-hidden="true" className="text-ink-faint">
              :
            </span>
          ) : null}
          <span key={`${label}-${r[key]}`} style={{ animation: 'count-fade 180ms var(--ease-enter)' }}>
            {r[key]}
          </span>
          <span aria-label={label} className="sr-only">
            {label}
          </span>
        </span>
      ))}
    </p>
  );
}
