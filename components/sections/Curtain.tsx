'use client';

import { useEffect, useState } from 'react';

import { invitation } from '~/lib/config';

/**
 * The invitation curtain (v1.3.3, critique P1b): lighter woven linen with a
 * visible rod and legible meeting edges; ONE accessible control covers the
 * overlay (tap anywhere, wheel/touch scroll, or Escape dismisses it); the
 * sweep is faster (1.1s after a 150ms beat, unmount at ~1.3s). Seen state
 * persists in localStorage (sessionStorage is unreliable in in-app messaging
 * browsers), and a #rsvp deep link skips the curtain entirely. While closed,
 * the page behind is `inert` so focus and AT stay inside the cover.
 */

const SEEN_KEY = 'curtain-opened-v2';

export function Curtain() {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'gone'>('closed');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      seen = false;
    }
    const deepLinked = window.location.hash === '#rsvp';
    if (seen || deepLinked) setPhase('gone');
    setMounted(true);
  }, []);

  // keep the page behind inert while the curtain is up
  useEffect(() => {
    const content = document.getElementById('page-content');
    if (!content) return;
    if (phase === 'closed') {
      content.setAttribute('inert', '');
    } else {
      content.removeAttribute('inert');
    }
    return () => content.removeAttribute('inert');
  }, [phase]);

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
      window.localStorage.setItem(SEEN_KEY, '1');
    } catch {
      // write failed → the curtain simply shows again next visit
    }
    // budget: 150ms beat + 1100ms sweep = 1250ms; unmount a beat later
    window.setTimeout(() => {
      setPhase('gone');
      document.getElementById('hero-title')?.focus();
    }, 1300);
  }

  if (phase === 'gone') return null;

  const opening = phase === 'opening';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation cover"
      aria-hidden={opening || undefined}
      className={`fixed inset-0 z-50 ${opening ? 'pointer-events-none' : ''}`}
    >
      {phase === 'closed' ? <style>{'body{overflow:hidden!important}'}</style> : null}

      {/* LEFT panel (decorative: the overlay control handles interaction) */}
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1/2 overflow-hidden shadow-[inset_-48px_0_64px_-36px_rgba(0,0,0,0.45)] transition-transform duration-[1100ms] ease-[cubic-bezier(0.32,0.72,0,1)] delay-150 ${
          opening ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <Panel side="left" />
      </div>

      {/* RIGHT panel */}
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 right-0 w-1/2 overflow-hidden shadow-[inset_48px_0_64px_-36px_rgba(0,0,0,0.45)] transition-transform duration-[1100ms] ease-[cubic-bezier(0.32,0.72,0,1)] delay-150 ${
          opening ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <Panel side="right" />
      </div>

      {/* the rod */}
      <div
        aria-hidden="true"
        className={`curtain-rod absolute inset-x-0 top-0 h-3 transition-opacity duration-150 ${
          opening ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* ONE accessible control over everything: tap, wheel, touch or Escape */}
      <button
        type="button"
        onClick={open}
        onWheel={open}
        onTouchMove={open}
        onKeyDown={(event) => {
          if (event.key === 'Escape') open();
        }}
        aria-label="Open the wedding invitation"
        className={`absolute inset-0 h-full w-full cursor-pointer bg-transparent outline-none ${
          opening ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span
          className={`absolute bottom-16 left-1/2 -translate-x-1/2 font-body text-badge uppercase text-page-ivory/90 transition-opacity duration-200 ${
            opening ? 'opacity-0' : 'curtain-hint-pulse opacity-100'
          }`}
        >
          {invitation.curtainHint}
        </span>
      </button>
    </div>
  );
}

/** Fabric stack: fold shading (base), sheen, weave, and the gold trim. */
function Panel({ side }: { side: 'left' | 'right' }) {
  return (
    <span className="curtain-fabric absolute inset-0 block">
      <span className="curtain-sheen absolute inset-0 block" />
      <span className="curtain-weave absolute inset-0 block" />
      {/* gold trim at the curtain's meeting edge */}
      <span
        className={`absolute inset-y-0 w-2.5 ${
          side === 'left'
            ? 'right-0 bg-gradient-to-l from-gold/80 via-gold/35 to-transparent'
            : 'left-0 bg-gradient-to-r from-gold/80 via-gold/35 to-transparent'
        }`}
      />
    </span>
  );
}
