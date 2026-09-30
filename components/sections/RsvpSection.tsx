import { Section } from '~/components/ui/Section';
import { RsvpPanel } from '~/components/form/RsvpPanel';
import { copy } from '~/lib/config';

/**
 * RSVP section (#rsvp) — free-flowing per the couple's review (2026-09-30:
 * no card). The section owns the headline + lead (matched to sibling
 * sections); RsvpPanel renders the state machine (search/answer/success)
 * directly on the ivory surface.
 */
export function RsvpSection() {
  return (
    <Section id="rsvp" ariaLabel="RSVP">
      <h2 className="font-display text-h1 text-ink">{copy.rsvpOpenHeadline}</h2>
      <p className="max-w-[65ch] font-body text-body text-ink-soft">
        Find your household on the invitation to answer. Already answered? We
        remember your latest RSVP.
      </p>
      <RsvpPanel />
    </Section>
  );
}
