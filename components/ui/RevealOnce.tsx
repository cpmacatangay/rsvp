'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Once-only scroll reveal (M10 correction of the M7 CSS `animation-timeline`
 * approach): a view()-driven animation is bidirectional — scrolling back up
 * re-hides content (janky under a focused form) and full-page captures catch
 * below-fold sections still hidden. This class-based reveal fires once and
 * stays revealed:
 * - SSR renders fully visible → no-JS users never lose content (PRD §5)
 * - useLayoutEffect hides only below-viewport nodes before first paint
 * - IntersectionObserver (toast-free pattern) flips it once, then unobserves
 * - transform + opacity only; reduced-motion collapses via the global override
 */
export function RevealOnce({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
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
      data-revealed={revealed || undefined}
      className={`mx-auto flex w-full max-w-3xl flex-col transition-[opacity,transform] duration-[450ms] ease-enter ${
        revealed ? 'opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}
