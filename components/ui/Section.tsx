import type { ReactNode } from 'react';

import { RevealOnce } from '~/components/ui/RevealOnce';

/**
 * Section shell — DESIGN §5/§6: single column on the locked measure.
 * Rhythm ruling (2026-10-01 proportion pass): headings sit tight to their
 * content (16px), while whole blocks breathe apart — so the heading gap is
 * explicit per section, not a blanket flex gap.
 */
type SectionProps = {
  id: string;
  ariaLabel: string;
  /** optional section heading, rendered once with the type scale */
  title?: string;
  /** alternating surfaces per DESIGN §3; 'warm' for story + dress code */
  tone?: 'ivory' | 'warm';
  /** scroll-linked entry reveal (CSS `animation-timeline: view()`, M7). */
  reveal?: boolean;
  children: ReactNode;
  className?: string;
};

export function Section({
  id,
  ariaLabel,
  title,
  tone = 'ivory',
  reveal = true,
  children,
  className = '',
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`px-5 py-16 sm:px-6 sm:py-24 ${tone === 'warm' ? 'bg-warm' : 'bg-page-ivory'} ${className}`}
    >
      <RevealOnce className={reveal ? '' : 'reveal-disabled'}>
        {title ? <h2 className="font-display text-h1 text-ink">{title}</h2> : null}
        {children}
      </RevealOnce>
    </section>
  );
}
