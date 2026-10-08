import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';

import { Button } from '~/components/ui/Button';
import { Section } from '~/components/ui/Section';
import { venue } from '~/lib/config';

/**
 * Venues (v1.6): unboxed editorial blocks — no card fill/border/shadow, so
 * hierarchy comes from type and spacing (impeccable anti-card pass). Both
 * venues share one identical structure (title → name → directions) and align
 * at equal height with the buttons pinned to the bottom. The reception venue
 * was confirmed by the couple 2026-10-08 (CONTENT.md §1).
 */
const VENUES = [
  { title: 'The Church', name: venue.name, href: venue.mapsUrl },
  { title: 'The Reception', name: venue.receptionName, href: venue.receptionMapsUrl },
] as const;

export function VenuesSection() {
  return (
    <Section id="venues" ariaLabel="Venues" title="Where We Gather">
      <div className="mt-4 grid gap-10 sm:grid-cols-2 sm:gap-12">
        {VENUES.map(({ title, name, href }) => (
          <div key={title} className="flex flex-col gap-2">
            <h3 className="font-display text-h3 text-ink">{title}</h3>
            <p className="font-body text-body text-ink">{name}</p>
            <div className="mt-auto pt-2">
              <Button
                href={href}
                variant="secondary"
                trailingIcon={<MapPin size={20} weight="light" />}
              >
                Get directions
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
