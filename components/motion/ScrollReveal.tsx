'use client';

import { useEffect } from 'react';

/**
 * Scroll-triggered section reveals (v1.4). Each `main > section` rises in when
 * it enters from below and replays on the next downward pass; exiting upward
 * keeps a section revealed (no reverse animation), exiting downward resets it.
 *
 * The hidden start state lives in globals.css behind `.js-reveal`. A pre-paint
 * inline script in the root layout sets that class so above-the-fold sections
 * animate in on load without a flash.
 *
 * Capture-safe: the class is withheld for reduced-motion users, for
 * `navigator.webdriver`, and whenever the URL carries `?capture=1` (or
 * `?reveal=off`) — the explicit switch for full-page screenshots, since
 * automation is not reliably detectable in stealth browsers. Those paths show
 * the final state immediately. This component owns the runtime observer and
 * re-asserts the same eligibility decision.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const params = new URLSearchParams(window.location.search);
    const captureSafe = params.get('reveal') === 'off' || params.has('capture');

    if (reduce.matches || navigator.webdriver || captureSafe) {
      root.classList.remove('js-reveal');
      return;
    }

    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section'));
    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') return;

    root.classList.add('js-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('is-revealed');
          } else if (entry.boundingClientRect.top > 0) {
            // left the viewport downward → reset so the next pass replays
            el.classList.remove('is-revealed');
          }
        }
      },
      // reveal once a section crosses ~12% above the viewport bottom
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return null;
}
