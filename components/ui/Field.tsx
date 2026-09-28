import type { ReactNode } from 'react';

/**
 * Field — DESIGN §10: visible label above, helper + error below with stable
 * ids for aria-describedby; placeholders are example-only, never labels.
 */
type FieldProps = {
  label: string;
  /** id of the control; generated ids <id>-err / <id>-hint follow for aria */
  id: string;
  control: ReactNode;
  hint?: string;
  error?: string | null;
  className?: string;
};

export function Field({ label, id, control, hint, error, className = '' }: FieldProps) {
  const hintId = hint !== undefined ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [errId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="font-body text-caption text-ink-soft">
        {label}
      </label>
      {control}
      {error ? (
        <p id={errId} role="alert" className="font-body text-caption text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="font-body text-caption text-ink-faint">
          {hint}
        </p>
      ) : null}
      <span aria-hidden="true" className="hidden">
        {describedBy}
      </span>
    </div>
  );
}

/** Shared control styling for inputs/textarea (DESIGN §10). */
export const controlClass = (error?: string | null): string =>
  `w-full rounded-md border-[1.5px] ${error ? 'border-danger' : 'border-line'} bg-card px-4 py-3 font-body text-body text-ink transition-colors duration-150 ease-enter focus:border-primary focus:outline-none`;
