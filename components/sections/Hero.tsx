import { couple, invitation } from '~/lib/config';

/**
 * Hero (v1.3.2): script names stacked tightly (tight leading, the "&" set
 * smaller so the lines sit close together), then the full invitation message
 * as ONE paragraph in the shared body typography. No RSVP button, no photo,
 * no date line (the date has its own scratch-reveal section).
 *
 * Script-font care: Great Vibes has long ascenders/descenders, so each name
 * line keeps a small bottom reserve while the leading stays tight.
 *
 * Entrance (v1.12): the names, ampersand, and message carry `hero-*` classes.
 * globals.css hides them when `.js-reveal` is present and reveals them on a
 * slow cinematic stagger once the curtain adds `.invitation-open` (so the hero
 * performs right after the curtain opens, and immediately for returning
 * guests). Pure CSS — this stays a server component.
 */
export function Hero() {
  return (
    <header
      id="hero"
      aria-label={`${couple.names} wedding`}
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 px-[max(1.25rem,var(--drape-w))] pb-20 text-center"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6">
        <h1
          id="hero-title"
          tabIndex={-1}
          className="font-script text-[64px] leading-[0.95] text-ink outline-none sm:text-[92px]"
        >
          <span className="hero-line hero-line-1 block pb-[0.1em]">
            {couple.names.split(' & ')[0]}
          </span>
          <span className="hero-amp block text-[0.65em] leading-[0.9] text-primary">&</span>
          <span className="hero-line hero-line-2 block pb-[0.1em]">
            {couple.names.split(' & ')[1]}
          </span>
        </h1>
        <p className="hero-para max-w-[52ch] text-center font-body text-body text-ink-soft">
          {invitation.heroMessage}
        </p>
      </div>
    </header>
  );
}
