import { Section } from '~/components/ui/Section';
import { RsvpPanel } from '~/components/form/RsvpPanel';
import { copy } from '~/lib/config';

/**
 * RSVP section (#rsvp) — free-flowing per the couple's review: the section
 * owns the headline (matching sibling sections); the panel renders the state
 * machine directly on the ivory surface, breathing one block below the lead.
 */
export function RsvpSection() {
  return (
    <Section id="rsvp" ariaLabel="RSVP" title={copy.rsvpOpenHeadline}>
      <p className="mt-4 max-w-[65ch] font-body text-body text-ink-soft">
        Find your household on the invitation to answer. Already answered? We
        remember your latest RSVP.
      </p>
      <div className="mt-6">
        <RsvpPanel />
      </div>
    </Section>
  );
}
