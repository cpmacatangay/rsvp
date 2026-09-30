'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { controlClass } from '~/components/ui/Field';

/**
 * Household type-ahead combobox (PRD §6.2, US3).
 * Debounced fetch (200ms), masked results only, arrow/Escape keys, ARIA
 * combobox semantics. Selecting sends the opaque code up — names never leave
 * the search step unmasked.
 */

export type HouseholdPick = {
  code: string;
  label: string;
  maxAdults: number;
  maxKids: number;
  previous: {
    status: 'accepted' | 'declined';
    adults: number;
    kids: number;
    dietary: string | null;
    respondedAt: string;
  } | null;
};

type LookupResult = HouseholdPick;

function allowanceText(maxAdults: number, maxKids: number): string {
  const adults = `${maxAdults} adult${maxAdults === 1 ? '' : 's'}`;
  if (maxKids === 0) return `party of ${adults}`;
  return `party of ${adults} and ${maxKids} child${maxKids === 1 ? '' : 'ren'}`;
}

export function RsvpCombobox({ onPick }: { onPick: (pick: HouseholdPick) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LookupResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const skipFetch = useRef(true); // ignore the very first change (initial render)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    if (skipFetch.current) {
      skipFetch.current = false;
      return;
    }
    const q = query.trim();
    if (debounce.current) clearTimeout(debounce.current);
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      setError(null);
      return;
    }
    setLoading(true);
    debounce.current = setTimeout(async () => {
      abort.current?.abort();
      abort.current = new AbortController();
      try {
        const res = await fetch(`/api/lookup?q=${encodeURIComponent(q)}`, {
          signal: abort.current!.signal,
        });
        const json: { ok: boolean; results?: LookupResult[]; message?: string } = await res.json();
        if (json.ok && json.results) {
          setResults(json.results);
          setOpen(true);
          setActiveIndex(json.results.length === 1 ? 0 : -1);
          setError(null);
        } else {
          setResults([]);
          setOpen(false);
          setError(json.message ?? 'Search is unavailable right now.');
        }
      } catch {
        // aborted requests land here; only surface real failures
        setError('Search is unavailable right now.');
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query]);

  const pick = useCallback(
    (result: LookupResult) => {
      setOpen(false);
      setQuery('');
      setSelectedLabel(result.label);
      onPick(result);
    },
    [onPick],
  );

  const listboxId = 'household-listbox';

  return (
    <div>
      <div className="relative">
        <label htmlFor="household-lookup" className="mb-1 flex font-body text-caption text-ink-soft">
          Your name
        </label>
        {selectedLabel ? (
          <p className="font-body text-caption text-ink-soft" role="status">
            Picking: you selected {selectedLabel}. Use the Not-you button below to change.
          </p>
        ) : null}
        {/* eslint-disable-next-line jsx-a11y/no-autofocus -- the form's first step */}
        <input
          id="household-lookup"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          enterKeyHint="search"
          aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
          autoComplete="off"
          className={controlClass(null)}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (!open || results.length === 0) return;
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActiveIndex((i) => (i + 1) % results.length);
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((i) => (i - 1 + results.length) % results.length);
            } else if (event.key === 'Enter' && activeIndex >= 0) {
              event.preventDefault();
              pick(results[activeIndex]!);
            } else if (event.key === 'Escape') {
              setOpen(false);
            }
          }}
        />
        {open ? (
          /* keyboard-initiated UI (typing): NO entrance animation — Emil
             framework rule #1; the press feedback below is pointer-only */
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-10 mt-2 w-full overflow-hidden rounded-md border border-line bg-card shadow-card"
          >
            {results.map((result, index) => (
              <li
                key={result.code}
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                tabIndex={-1}
                onMouseDown={(event) => {
                  event.preventDefault();
                  pick(result);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex cursor-pointer items-baseline justify-between px-4 py-3 font-body text-body text-ink transition-colors duration-100 ease-enter active:bg-warm ${index === activeIndex ? 'bg-primary-soft' : ''}`}
              >
                <span>{result.label}</span>
                <span className="ml-3 shrink-0 font-body text-caption text-ink-soft">
                  {allowanceText(result.maxAdults, result.maxKids)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {query.trim().length < 2 ? (
        <p className="mt-1 font-body text-caption text-ink-soft">Start typing your name (at least 2 letters).</p>
      ) : error ? (
        <p className="mt-1 font-body text-caption text-danger" role="status">
          {error}
        </p>
      ) : loading ? (
        <p className="mt-1 font-body text-caption text-ink-soft">Searching…</p>
      ) : null}
    </div>
  );
}
