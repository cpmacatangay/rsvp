import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';

import { CountdownCell } from '~/components/sections/CountdownCell';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { Section } from '~/components/ui/Section';
import { venue, weddingDate, weddingDateDisplay } from '~/lib/config';

/**
 * Info section (#info): countdown + location facts (US2). Two cards side by
 * side from `sm`, stacked on a phone. Map = tappable link-out (deferred
 * decision: no third-party embed iframe).
 *
 * Countdown counts to the START of the wedding day (midnight Asia/Manila).
 * Wedding date lives in lib/config (single source).
 */
export function InfoSection() {
  return (
    <Section id="info" ariaLabel="When and where" title="The day">
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card className="flex flex-col gap-2">
          <h3 className="font-display text-h3 text-ink">Counting down</h3>
          <CountdownCell targetMs={weddingDate.getTime()} />
          <p className="font-body text-caption text-ink-soft">
            {weddingDateDisplay} <span aria-hidden="true">·</span> Naga City
          </p>
        </Card>

        <Card className="flex flex-col gap-2">
          <h3 className="font-display text-h3 text-ink">Where to be</h3>
          <p className="font-body text-body text-ink">
            {venue.name}
            {', '}
            {venue.city}
          </p>
          <div>
            <Button
              href={venue.mapsUrl}
              variant="secondary"
              trailingIcon={<MapPin size={20} weight="light" />}
            >
              Get directions
            </Button>
          </div>
        </Card>
      </div>
    </Section>
  );
}
