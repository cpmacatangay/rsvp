'use client';

import { useEffect, useState } from 'react';

/**
 * Countdown (v1.2 review): editorial numerals, no card — four display-serif
 * numbers with thin gold hairlines between them and letter-spaced micro
 * labels beneath. Counts to the start of the wedding day (midnight
 * Asia/Manila); each digit crossfades 180ms on change.
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
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
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
    // first paint: reserved height avoids layout shift
    return <p className="font-display text-[40px] tabular-nums text-ink-soft sm:text-[52px]">&nbsp;</p>;
  }

  const r = remaining(targetMs, now);
  if (r.days + r.hours + r.minutes + r.seconds === 0) {
    return <p className="font-display text-h1 text-primary">It is the wedding day!</p>;
  }

  return (
    <div className="flex items-start justify-center gap-3 sm:gap-6" role="timer" aria-live="off">
      {UNITS.map(({ key, label }, index) => (
        <div key={label} className="flex items-start gap-3 sm:gap-6">
          {index > 0 ? (
            <span aria-hidden="true" className="mt-2 h-10 w-px bg-gold/60 sm:h-12" />
          ) : null}
          <div className="flex min-w-[3.4rem] flex-col items-center gap-1 sm:min-w-[4.5rem]">
            <span
              key={`${label}-${r[key]}`}
              className="font-display text-[40px] leading-none tabular-nums text-ink sm:text-[52px]"
              style={{ animation: 'count-fade 180ms var(--ease-enter)' }}
            >
              {r[key]}
            </span>
            <span className="font-body text-[10px] uppercase tracking-[0.18em] text-ink-soft sm:text-badge">
              {label}
            </span>
          </div>
        </div>
      ))}
      <span className="sr-only">
        {r.days} days, {r.hours} hours, {r.minutes} minutes, {r.seconds} seconds until the wedding
      </span>
    </div>
  );
}
