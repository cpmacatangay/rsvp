'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Ornament hairline above a section heading (v1.1 motion emphasis):
 * a 72px gold rule that "draws" itself via scaleX when the section reveals.
 * Pairs with RevealOnce (same IntersectionObserver contract, separate node):
 * SSR renders finalize—width so no-JS/print never lose the rule; reduced
 * motion collapses the transform to instant via the global override.
 */
export function OrnamentRule({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setDrawn(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-48px 0px 0px 0px', threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`h-0.5 w-16 origin-left bg-gold transition-transform duration-[600ms] ease-enter ${
        drawn ? 'scale-x-100' : 'scale-x-0'
      } ${className}`}
    />
  );
}
