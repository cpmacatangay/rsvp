'use client';

import { useEffect, useState } from 'react';

import { ArrowDown } from '@phosphor-icons/react';

/**
 * Sticky RSVP affordance (critique P1a, hero kept off-limits so the CTA lives
 * here): a sage pill pinned to the bottom of the viewport that appears once
 * the hero has scrolled past and hides again while the RSVP section is in
 * view. Anchor link, so it needs no JS to navigate once rendered; motion is
 * opacity/transform only and collapses under reduced motion.
 */

export function RsvpStickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [rsvpVisible, setRsvpVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    const rsvp = document.getElementById('rsvp');
    if (!hero || !rsvp || typeof IntersectionObserver === 'undefined') return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: '0px 0px -20% 0px' },
    );
    const rsvpObserver = new IntersectionObserver(
      ([entry]) => setRsvpVisible(entry.isIntersecting),
      { rootMargin: '0px 0px -30% 0px' },
    );
    heroObserver.observe(hero);
    rsvpObserver.observe(rsvp);
    setReady(true);
    return () => {
      heroObserver.disconnect();
      rsvpObserver.disconnect();
    };
  }, []);

  const visible = ready && pastHero && !rsvpVisible;

  return (
    <a
      href="#rsvp"
      aria-label="Go to the RSVP form"
      className={`fixed bottom-6 left-1/2 z-40 inline-flex h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-6 font-body text-body font-semibold text-page-ivory shadow-elevated transition-[opacity,transform] duration-200 ease-enter hover:bg-primary-dark active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
    >
      RSVP
      <ArrowDown size={18} weight="light" aria-hidden="true" />
    </a>
  );
}
