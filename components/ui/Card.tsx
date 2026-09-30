import type { ReactNode } from 'react';

/**
 * Card — DESIGN §7 warm-tinted shadow + hairline pairing (never bare fills),
 * radius scale locked: cards 16 (`--radius-lg`).
 */
type CardProps = {
  children: ReactNode;
  className?: string;
};

export const cardRecipe = 'rounded-lg border border-line bg-card shadow-card';

export function Card({ children, className = '' }: CardProps) {
  return <div className={`${cardRecipe} p-5 sm:p-6 ${className}`}>{children}</div>;
}

/**
 * Double-bezel card (DESIGN §14.4): outer shell (warm hairline + gap) around
 * an inner core. Concentric math stays inside the locked radius scale:
 * outer radius 16 minus 8px gap ⇒ inner radius 8 (`--radius-sm`).
 */
type DoubleBezelProps = {
  children: ReactNode;
  id?: string;
  className?: string;
};

export function DoubleBezel({ children, id, className = '' }: DoubleBezelProps) {
  return (
    <div id={id} className={`rounded-lg border border-line bg-warm p-2 shadow-card ${className}`}>
      <div className="rounded-sm border border-line bg-card p-5 sm:p-6">{children}</div>
    </div>
  );
}
