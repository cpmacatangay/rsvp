import { couple, invitation } from '~/lib/config';

/**
 * Hero (v1.1 slim): monogram names + one invitation line.
 * Per the couple's redesign: no RSVP button, no photo, no date line here —
 * the date gets its own scratch-reveal section further down.
 * The title carries #hero-title (tabIndex -1) as the curtain's focus target.
 */
export function Hero() {
  return (
    <section
      aria-label={`${couple.names} wedding`}
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-5 pb-20 text-center sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
        <h1
          id="hero-title"
          tabIndex={-1}
          className="font-display text-hero text-ink outline-none sm:text-[46px]"
        >
          {couple.names.split(' & ')[0]} <span className="text-primary">&</span>{' '}
          {couple.names.split(' & ')[1]}
        </h1>
        <p className="font-body text-body text-ink-soft">{invitation.heroSubline}</p>
      </div>
    </section>
  );
}
