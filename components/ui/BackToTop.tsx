'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from '@phosphor-icons/react';

/**
 * Back-to-top (US-companion, couple review r9 #25): appears once the viewport
 * passes a sentinel element (IntersectionObserver — never a scroll listener,
 * DTF §5.D hard ban). Fixed over every page that mounts it; safe-area aware.
 * The smooth scroll comes from the global `scroll-behavior: smooth` and
 * collapses to instant under prefers-reduced-motion.
 */
export function BackToTop({ observeId }: { observeId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(observeId);
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '-64px 0px 0px 0px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [observeId]);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0 })}
      className={`fixed right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-primary shadow-elevated transition-[opacity,transform] duration-[320ms] ease-enter ${
        visible ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
      }`}
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <ArrowUp size={20} weight="light" />
    </button>
  );
}
