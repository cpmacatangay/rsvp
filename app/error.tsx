'use client';

/**
 * Route-level error boundary (PRD: every async surface defines its state).
 * In-flow retry per DESIGN (no toasts/modals policy).
 */
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="font-display text-h1 text-ink">Something went wrong</h1>
      <p className="font-body text-body text-ink-soft">
        An unexpected error interrupted the page. Trying again usually sorts it out.
      </p>
      {process.env.NODE_ENV === 'development' ? (
        <p className="max-w-[65ch] font-body text-caption text-danger">{error.message}</p>
      ) : null}
      <button
        onClick={reset}
        className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-5 font-body text-body font-semibold text-page-ivory transition-colors duration-150 ease-enter hover:bg-primary-dark"
      >
        Try again
      </button>
    </main>
  );
}
