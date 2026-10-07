'use client';

import { useEffect, useState } from 'react';

import { invitation } from '~/lib/config';

/**
 * The invitation curtain (v1.2 review): a real curtain now — stacked fold
 * shading, a vertical sheen and a faint weave across two sage panels with a
 * gold trim at the meeting edges. No initials (removed by request).
 *
 * Pacing (slow + luxurious, couple-approved):
 *   tap → the hint fades (300ms) → the panels sweep apart over 1600ms on
 *   the drawer curve (starting after a 300ms beat) → the overlay unmounts
 *   at ~2.1s and focus lands on the hero title.
 *
 * Guarantees kept:
 * - SSR renders the curtain for a true first paint; scroll locks only while
 *   closed; the overlay is transparent apart from the panels (the page is
 *   the reveal — the former ivory blind layer stayed removed).
 * - noscript never reaches this client component.
 * - reduced motion collapses durations AND delays to ~0 (global override)
 *   so the tap simply dismisses.
 * - sessionStorage shows it once per browser session; failures degrade to
 *   "shows again", never a locked page.
 */

const SEEN_KEY = 'curtain-opened-v1';

export function Curtain() {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'gone'>('closed');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      seen = false;
    }
    if (seen) setPhase('gone');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (phase !== 'closed' || !mounted) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase, mounted]);

  function open() {
    if (phase !== 'closed') return;
    setPhase('opening');
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // write failed → the curtain simply shows again next visit
    }
    // budget: 300ms beat + 1600ms sweep = 1900ms; unmount a beat later
    window.setTimeout(() => {
      setPhase('gone');
      document.getElementById('hero-title')?.focus();
    }, 2100);
  }

  if (phase === 'gone') return null;

  const opening = phase === 'opening';

  return (
    <div
      role="dialog"
      aria-label="Wedding invitation cover"
      aria-hidden={opening || undefined}
      className={`fixed inset-0 z-50 ${opening ? 'pointer-events-none' : ''}`}
    >
      {phase === 'closed' ? <style>{'body{overflow:hidden!important}'}</style> : null}

      {/* LEFT panel */}
      <button
        type="button"
        onClick={open}
        aria-label={invitation.curtainHint}
        className={`absolute inset-y-0 left-0 w-1/2 cursor-pointer overflow-hidden border-r-4 border-gold shadow-[inset_-48px_0_64px_-36px_rgba(0,0,0,0.5)] outline-none transition-transform duration-[1600ms] ease-[cubic-bezier(0.32,0.72,0,1)] delay-300 ${
          opening ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <Panel />
      </button>

      {/* RIGHT panel */}
      <button
        type="button"
        onClick={open}
        aria-label={invitation.curtainHint}
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 w-1/2 cursor-pointer overflow-hidden border-l-4 border-gold shadow-[inset_48px_0_64px_-36px_rgba(0,0,0,0.5)] outline-none transition-transform duration-[1600ms] ease-[cubic-bezier(0.32,0.72,0,1)] delay-300 ${
          opening ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <Panel />
      </button>

      {/* pulsing hint */}
      <p
        aria-hidden="true"
        className={`absolute bottom-16 left-1/2 -translate-x-1/2 font-body text-badge uppercase text-primary-soft transition-opacity duration-300 ease-enter ${
          opening ? 'opacity-0' : 'curtain-hint-pulse opacity-100'
        }`}
      >
        {invitation.curtainHint}
      </p>
    </div>
  );
}

/** Fabric stack: fold shading (base), sheen, weave, top rod shadow. */
function Panel() {
  return (
    <span aria-hidden="true" className="curtain-fabric absolute inset-0 block">
      <span className="curtain-sheen absolute inset-0 block" />
      <span className="curtain-weave absolute inset-0 block" />
      {/* implied rod shadow along the top */}
      <span className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[rgba(0,0,0,0.30)] to-transparent" />
    </span>
  );
}
