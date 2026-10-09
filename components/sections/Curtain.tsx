'use client';

import { useEffect, useState } from 'react';

import { invitation } from '~/lib/config';

/**
 * The invitation curtain (v1.13). Opening reads like fabric being drawn aside:
 * each half-panel translates off-screen AND compresses toward its outer edge
 * (transform-origin at the rod side), so the folds gather as it goes, over a
 * slow cinematic 2.8s sweep after a 350ms beat. ONE accessible control covers
 * the overlay (tap anywhere, wheel/touch scroll, or Escape).
 *
 * Visibility: the curtain shows on EVERY page load / refresh — there is no
 * once-per-session persistence — and it is a one-shot overlay, so it never
 * re-appears when the guest scrolls back up to the hero or navigates an in-page
 * anchor. The only skip is the QA `?capture=1` flag (so full-page screenshots
 * aren't covered). While closed, the page behind is `inert`. When it is gone it adds
 * `invitation-open` to <html>, which triggers the hero's entrance (Hero.tsx /
 * globals.css).
 */
export function Curtain() {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'gone'>('closed');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // QA-only escape hatch: full-page captures must not be covered by the
    // curtain. Guests (no param) always see it on load.
    const params = new URLSearchParams(window.location.search);
    if (params.get('reveal') === 'off' || params.has('capture')) setPhase('gone');
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

  // hand off to the hero entrance once the curtain is gone (or was skipped)
  useEffect(() => {
    if (phase === 'gone') {
      document.documentElement.classList.add('invitation-open');
    }
  }, [phase]);

  function open() {
    if (phase !== 'closed') return;
    setPhase('opening');
    // budget: 350ms beat + 2800ms sweep = 3150ms; unmount a beat later
    window.setTimeout(() => {
      setPhase('gone');
      document.getElementById('hero-title')?.focus();
    }, 3250);
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

      {/* LEFT panel (decorative: the overlay control handles interaction).
          origin-left + scale-x makes the fabric gather toward the rod side. */}
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1/2 origin-left overflow-hidden shadow-[inset_-48px_0_64px_-36px_rgba(0,0,0,0.45)] transition-transform duration-[2800ms] ease-[cubic-bezier(0.45,0,0.15,1)] delay-[350ms] ${
          opening ? '-translate-x-full scale-x-[0.42]' : 'translate-x-0 scale-x-100'
        }`}
      >
        <Panel side="left" />
      </div>

      {/* RIGHT panel */}
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 right-0 w-1/2 origin-right overflow-hidden shadow-[inset_48px_0_64px_-36px_rgba(0,0,0,0.45)] transition-transform duration-[2800ms] ease-[cubic-bezier(0.45,0,0.15,1)] delay-[350ms] ${
          opening ? 'translate-x-full scale-x-[0.42]' : 'translate-x-0 scale-x-100'
        }`}
      >
        <Panel side="right" />
      </div>

      {/* the rod */}
      <div
        aria-hidden="true"
        className={`curtain-rod absolute inset-x-0 top-0 h-3 transition-opacity duration-500 ${
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
          className={`absolute bottom-16 left-1/2 -translate-x-1/2 font-body text-badge uppercase text-page-ivory/90 transition-opacity duration-500 ${
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
