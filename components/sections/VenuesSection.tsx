import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';

import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { Section } from '~/components/ui/Section';
import { venue } from '~/lib/config';

/**
 * Venues: church + reception, each with a maps directions link. The reception
 * venue was confirmed by the couple 2026-10-08 (CONTENT.md §1); both cards
 * read from `lib/config`, so details update in one place.
 */
export function VenuesSection() {
  return (
    <Section id="venues" ariaLabel="Venues" title="Where We Gather">
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <Card className="flex flex-col gap-2">
          <h3 className="font-display text-h3 text-ink">The Church</h3>
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

        <Card className="flex flex-col gap-2">
          <h3 className="font-display text-h3 text-ink">The Reception</h3>
          <p className="font-body text-body text-ink">{venue.receptionName}</p>
          <div>
            <Button
              href={venue.receptionMapsUrl}
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
