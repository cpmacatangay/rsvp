'use client';

import { Minus, Plus } from '@phosphor-icons/react';

/**
 * Stepper — the guest-count control (DESIGN §6 anatomy: "Adults − 2 + (of 2)").
 * 48px square buttons inside the touch comfort budget; value announced in a
 * polite live region; bounds disable rather than error.
 */
type StepperProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  /** allowance hint text, e.g. "of 2" */
  helper?: string;
  id?: string;
};

export function Stepper({ label, value, min, max, onChange, helper, id = `stepper-${label}` }: StepperProps) {
  const step = (delta: 1 | -1) => {
    const next = Math.min(max, Math.max(min, value + delta));
    if (next !== value) onChange(next);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="font-body text-caption text-ink-soft">
          {label}
        </label>
        {helper ? <span className="font-body text-caption text-ink-soft">{helper}</span> : null}
      </div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label={`Fewer ${label.toLowerCase()}`}
          disabled={value <= min}
          className="h-12 w-12 shrink-0 rounded-md border-[1.5px] border-line bg-card text-ink transition-colors duration-150 ease-enter hover:bg-warm active:scale-[0.98] motion-reduce:active:scale-100 disabled:opacity-45 disabled:pointer-events-none"
        >
          <Minus size={20} weight="light" />
        </button>
        <output
          id={id}
          aria-live="polite"
          className="font-display text-h1 tabular-nums text-ink"
        >
          {value}
        </output>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label={`More ${label.toLowerCase()}`}
          disabled={value >= max}
          className="h-12 w-12 shrink-0 rounded-md border-[1.5px] border-line bg-card text-ink transition-colors duration-150 ease-enter hover:bg-warm active:scale-[0.98] motion-reduce:active:scale-100 disabled:opacity-45 disabled:pointer-events-none"
        >
          <Plus size={20} weight="light" />
        </button>
      </div>
    </div>
  );
}
