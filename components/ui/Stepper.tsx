'use client';

import { Minus, Plus } from '@phosphor-icons/react';

/**
 * Stepper — the guest-count control (DESIGN §6 anatomy). Review fix 2026-09-28:
 * label is just "Adults"/"Children" (the cap lives in the invitation summary
 * line), and the +/- glyphs are flex-centered in their 48px touch buttons.
 */
type StepperProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  id?: string;
};

export function Stepper({ label, value, min, max, onChange, id = `stepper-${label}` }: StepperProps) {
  const step = (delta: 1 | -1) => {
    const next = Math.min(max, Math.max(min, value + delta));
    if (next !== value) onChange(next);
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-body text-caption text-ink-soft">
        {label}
      </label>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label={`Fewer ${label.toLowerCase()}`}
          disabled={value <= min}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border-[1.5px] border-line bg-card text-ink transition-colors duration-150 ease-enter hover:bg-warm active:scale-[0.98] motion-reduce:active:scale-100 disabled:opacity-45 disabled:pointer-events-none"
        >
          <Minus size={20} weight="light" />
        </button>
        <output id={id} aria-live="polite" className="font-display text-h1 tabular-nums text-ink">
          {value}
        </output>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label={`More ${label.toLowerCase()}`}
          disabled={value >= max}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border-[1.5px] border-line bg-card text-ink transition-colors duration-150 ease-enter hover:bg-warm active:scale-[0.98] motion-reduce:active:scale-100 disabled:opacity-45 disabled:pointer-events-none"
        >
          <Plus size={20} weight="light" />
        </button>
      </div>
    </div>
  );
}
