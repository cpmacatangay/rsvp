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
