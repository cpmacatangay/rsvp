import Image from 'next/image';
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';

import churchPhoto from '~/assets/venue/church.jpg';
import receptionPhoto from '~/assets/venue/reception.jpg';
import { Button } from '~/components/ui/Button';
import { Section } from '~/components/ui/Section';
import { venue } from '~/lib/config';

/**
 * Venues (v1.8): each painting is presented as an organic torn-brush panel —
 * an SVG alpha mask (`/venue-mask.svg`) for the soft painted edge, a parent
 * drop-shadow that follows that silhouette, and a warm veil so the vivid
 * canvas sits inside the palette. Identical structure for both venues
 * (art → title → name → directions), equal height, buttons pinned to the
 * bottom, with more air and the type leading. The church source is portrait,
 * so its focal point is tuned to the facade/tower. Reception venue confirmed
 * 2026-10-08 (CONTENT.md §1).
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
      <div className="mt-8 grid gap-12 sm:grid-cols-2 sm:gap-16">
        {VENUES.map(({ title, name, href, photo, alt, position }) => (
          <div key={title} className="flex flex-col gap-4">
            <div className="venue-art-shadow w-[86%] max-w-[320px]">
              <div className="venue-art-mask">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photo}
                    alt={alt}
                    fill
                    sizes="(max-width: 640px) 80vw, 320px"
                    className="venue-art-img object-cover"
                    style={{ objectPosition: position }}
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-page-ivory/15" />
                </div>
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
        ))}
      </div>
    </Section>
  );
}
