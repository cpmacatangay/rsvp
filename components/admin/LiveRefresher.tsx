'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ArrowClockwise } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { Button } from '~/components/ui/Button';

/**
 * Dashboard freshness (couple review 2026-09-30: "updated in realtime").
 * Deliberate KISS choice: visibility-aware 15s polling via router.refresh()
 * (re-renders the server components with fresh rows) + a manual button —
 * no SSE/websocket infra, documented as the right trade in ARCHITECTURE §9.4.
 */
export function LiveRefresher() {
  const router = useRouter();
  const [checkedAt, setCheckedAt] = useState('');

  const refreshNow = useCallback(() => {
    router.refresh();
    setCheckedAt(
      new Intl.DateTimeFormat('en-PH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date()),
    );
  }, [router]);

  useEffect(() => {
    refreshNow();
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') refreshNow();
    }, 15_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshNow();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refreshNow]);

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="truncate font-body text-caption text-ink-soft" role="status">
        Live updates every 15s{checkedAt ? ` · last ${checkedAt}` : ''}
      </p>
      <Button
        onClick={refreshNow}
        variant="ghost"
        className="shrink-0 whitespace-nowrap px-3 text-caption"
        trailingIcon={<ArrowClockwise size={18} weight="light" />}
      >
        Refresh
      </Button>
    </div>
  );
}
