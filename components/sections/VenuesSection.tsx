import Image from 'next/image';
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';

import churchPhoto from '~/assets/venue/church.png';
import receptionPhoto from '~/assets/venue/reception.png';
import { Button } from '~/components/ui/Button';
import { Section } from '~/components/ui/Section';
import { venue } from '~/lib/config';

/**
 * Venues (v1.7): unboxed editorial blocks, now each with a painted venue photo
 * — identical structure (photo → title → name → directions), equal height, and
 * the buttons pinned to the bottom. Both photos share one treatment: a 4:3
 * landscape crop under a soft feathered mask (no sides/borders), so they read
 * as paint on the page. The church source is portrait, so its focal point is
 * tuned to the facade and tower. Reception venue confirmed 2026-10-08
 * (CONTENT.md §1).
 */
const VENUES = [
  {
    title: 'The Church',
    name: venue.name,
    href: venue.mapsUrl,
    photo: churchPhoto,
    alt: 'Painting of the Minor Basilica of Our Lady of Peñafrancia with its bell tower, palms, and lawn',
    position: '50% 45%',
  },
  {
    title: 'The Reception',
    name: venue.receptionName,
    href: venue.receptionMapsUrl,
    photo: receptionPhoto,
    alt: "Painting of Villa Caceres Hotel's facade and entrance",
    position: '50% 50%',
  },
] as const;

export function VenuesSection() {
  return (
    <Section id="venues" ariaLabel="Venues" title="Where We Gather">
      <div className="mt-6 grid gap-10 sm:grid-cols-2 sm:gap-12">
        {VENUES.map(({ title, name, href, photo, alt, position }) => (
          <div key={title} className="flex flex-col gap-3">
            <div className="venue-art-fade-x">
              <div className="venue-art-fade-y">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photo}
                    alt={alt}
                    fill
                    sizes="(max-width: 640px) 90vw, 360px"
                    className="object-cover"
                    style={{ objectPosition: position }}
                  />
                </div>
              </div>
            </div>
            <h3 className="mt-2 font-display text-h3 text-ink">{title}</h3>
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
