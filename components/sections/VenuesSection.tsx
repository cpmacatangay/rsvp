import Image from 'next/image';
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';

import churchPhoto from '~/assets/venue/church.jpg';
import receptionPhoto from '~/assets/venue/reception.jpg';
import { Button } from '~/components/ui/Button';
import { Section } from '~/components/ui/Section';
import { venue } from '~/lib/config';

/**
 * Venues (v1.11): the page is the canvas. Each painting dissolves into the page
 * (soft brushed alpha mask) AND its own colours bleed faintly into the page
 * behind the whole block — a decorative, heavily blurred copy at low opacity,
 * so the block reads as painted rather than the image sitting in one spot.
 * Full colour, full width, no veil, no shadow. Identical structure for both
 * venues (art → title → name → directions), equal height, buttons pinned to the
 * bottom. The church source is portrait, so its focal point is tuned to the
 * facade/tower. Reception venue confirmed 2026-10-08 (CONTENT.md §1).
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
      <div className="mt-8 grid gap-12 sm:grid-cols-2 sm:gap-14">
        {VENUES.map(({ title, name, href, photo, alt, position }) => (
          <div key={title} className="relative flex flex-col gap-4">
            {/* colour bleed: the painting's own colours wash into the page */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-6 -top-6 -bottom-4 z-0 overflow-hidden opacity-[0.12] blur-2xl"
            >
              <Image
                src={photo}
                alt=""
                fill
                sizes="(max-width: 640px) 60vw, 220px"
                className="scale-125 object-cover"
                style={{ objectPosition: position }}
              />
            </div>

            <div className="relative z-10 flex flex-col gap-4">
              <div className="venue-art-mask">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photo}
                    alt={alt}
                    fill
                    sizes="(max-width: 640px) 92vw, 360px"
                    className="object-cover"
                    style={{ objectPosition: position }}
                  />
                </div>
              </div>
              <h3 className="mt-1 font-display text-h3 text-ink">{title}</h3>
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
          </div>
        ))}
      </div>
    </Section>
  );
}
