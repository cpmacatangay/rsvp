'use client';

import { useEffect, useState } from 'react';

import { couple, invitation } from '~/lib/config';

/**
 * The invitation curtain (v1.1): first thing every visitor sees, ONCE per
 * browser session (sessionStorage — mid-party address checks skip it).
 *
 * Choreography (MOTION dial 7, transform/opacity only, token curves):
 *   tap → crest + hint fade (200ms) AND the two panels sweep outward
 *   (900ms, drawer curve) run concurrently → the overlay unmounts at
 *   950ms and focus lands on the hero title. The overlay never paints an
 *   opaque backdrop: it is transparent except the panels, so the page
 *   itself is what the parting panels reveal.
 *
 * Guarantees:
 * - SSR: rendered in the server HTML (true first paint); scroll locked only
 *   while closed (style tag — no JS class juggling).
 * - noscript: client-mounted, so guests without JS never see it.
 * - reduced-motion: the global override collapses transitions to ~0 — the
 *   tap simply dismisses (an action, not decoration).
 * - sessionStorage failures degrade to "shows again", never to a broken lock.
 * - regression note (2026-10-06): an ivory "peek-through" layer once sat
 *   absolutely over the viewport and, with the unmount timer originally
 *   missing, kept the hero blocked until refresh. Both were removed; the
 *   panels are the only painted surface and the overlay always unmounts.
 */

const SEEN_KEY = 'curtain-opened-v1';

export function Curtain() {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'gone'>('closed');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // decide AFTER hydration so the server HTML always contains the curtain,
    // but a mid-session revisit skips it
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      seen = false; // storage unavailable → show (graceful)
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
    // sweep budget: 900ms panels + margin. Then the overlay unmounts for
    // good and keyboard/AT focus moves into the revealed content.
    window.setTimeout(() => {
      setPhase('gone');
      document.getElementById('hero-title')?.focus();
    }, 950);
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

      {/* LEFT panel (the keyboard stop) */}
      <button
        type="button"
        onClick={open}
        aria-label={invitation.curtainHint}
        className={`absolute inset-y-0 left-0 w-1/2 cursor-pointer overflow-hidden border-r-[3px] border-gold bg-primary outline-none transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          opening ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <Monogram side="left" opening={opening} />
      </button>

      {/* RIGHT panel */}
      <button
        type="button"
        onClick={open}
        aria-label={invitation.curtainHint}
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 w-1/2 cursor-pointer overflow-hidden border-l-[3px] border-gold bg-primary outline-none transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          opening ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <Monogram side="right" opening={opening} />
      </button>

      {/* pulsing hint */}
      <p
        aria-hidden="true"
        className={`absolute bottom-16 left-1/2 -translate-x-1/2 font-body text-badge uppercase text-primary-soft transition-opacity duration-200 ease-enter ${
          opening ? 'opacity-0' : 'curtain-hint-pulse opacity-100'
        }`}
      >
        {invitation.curtainHint}
      </p>
    </div>
  );
}

/** Center crest, split across both panels: monogram + fold shading. */
function Monogram({ side, opening }: { side: 'left' | 'right'; opening: boolean }) {
  const isLeft = side === 'left';
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-y-0 ${isLeft ? 'right-0' : 'left-0'} flex w-full items-center justify-center transition-opacity duration-200 ease-enter ${
        opening ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span
        className={`absolute inset-y-0 w-14 ${
          isLeft
            ? 'right-0 bg-gradient-to-l from-[rgba(47,42,32,0.18)] to-transparent'
            : 'left-0 bg-gradient-to-r from-[rgba(47,42,32,0.18)] to-transparent'
        }`}
      />
      <span className="relative font-display text-[18vw] font-light leading-none text-primary-soft sm:text-[110px]">
        {couple.names
          .split(' & ')
          .map((name) => name.charAt(0))
          .join(' & ')}
      </span>
    </span>
  );
}
