import { Section } from '~/components/ui/Section';
import { Card } from '~/components/ui/Card';
import { copy } from '~/lib/config';

/**
 * RSVP section (#rsvp) — the form island lands in BUILD 4.6; this honest
 * placeholder is replaced by RsvpPanel then (never shipped as-is).
 */
export function RsvpSection() {
  return (
    <Section id="rsvp" ariaLabel="RSVP">
      <h2 className="font-display text-h1 text-ink">{copy.rsvpOpenHeadline}</h2>
      <Card className="flex flex-col gap-2">
        <p className="font-body text-body text-ink-soft">
          The RSVP form arrives in the next build step. Guests will find their
          household and answer here.
        </p>
      </Card>
    </Section>
  );
}
