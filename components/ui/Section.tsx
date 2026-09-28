import type { ReactNode } from 'react';

/**
 * Section shell — DESIGN §5/§6: single column, generous rhythm.
 * Guests see one decision per section; the max width is the same measure
 * everywhere (admin uses its own wider layout).
 */
type SectionProps = {
  id: string;
  ariaLabel: string;
  /** alternating surfaces per DESIGN §3; 'warm' for story + dress code */
  tone?: 'ivory' | 'warm';
  children: ReactNode;
  className?: string;
};

export function Section({ id, ariaLabel, tone = 'ivory', children, className = '' }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`px-5 py-16 sm:px-6 sm:py-24 ${tone === 'warm' ? 'bg-warm' : 'bg-page-ivory'} ${className}`}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">{children}</div>
    </section>
  );
}
