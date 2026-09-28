import { Section } from '~/components/ui/Section';
import { RsvpPanel } from '~/components/form/RsvpPanel';
import { copy } from '~/lib/config';

/**
 * RSVP section (#rsvp) — the guest flow lives in RsvpPanel (client island):
 * type-ahead → household → answer → confirmation (BUILD 4.6).
 */
export function RsvpSection() {
  return (
    <Section id="rsvp" ariaLabel="RSVP">
      <RsvpPanel />
    </Section>
  );
}
