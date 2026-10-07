import { couple, invitation } from '~/lib/config';

/**
 * Hero (v1.2 review): Great Vibes script for the names, then the full
 * invitation message in three sentences (lead in display serif, support in
 * body). No RSVP button, no photo, no date line (the date has its own
 * scratch-reveal section). The title carries #hero-title (tabIndex -1) as
 * the curtain's focus target.
 *
 * Script-font care: Great Vibes has long ascenders/descenders, so the
 * heading gets leading-[1.2] and bottom padding to keep the descenders of
 * the final letters from clipping.
 */
export function Hero() {
  return (
    <section
      aria-label={`${couple.names} wedding`}
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 px-5 pb-20 text-center sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5">
        <h1
          id="hero-title"
          tabIndex={-1}
          className="font-script text-[64px] leading-[1.2] text-ink outline-none sm:text-[92px]"
        >
          {couple.names.split(' & ')[0]} <span className="text-primary">&</span>{' '}
          {couple.names.split(' & ')[1]}
        </h1>
        <div className="flex max-w-[46ch] flex-col items-center gap-3">
          <p className="font-display text-h3 text-ink">{invitation.heroMessage.lead}</p>
          <p className="font-body text-caption text-ink-soft">{invitation.heroMessage.body1}</p>
          <p className="font-body text-caption text-ink-soft">{invitation.heroMessage.body2}</p>
        </div>
      </div>
    </section>
  );
}
