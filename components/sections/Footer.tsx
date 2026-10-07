import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';

import { couple, copy, venue } from '~/lib/config';

/**
 * Footer — quiet close: names, one tagline line, venue link-out.
 * No invented contact details (none were provided; PRD scope).
 */
export function Footer() {
  return (
    <footer className="border-line border-t bg-warm px-5 py-12 text-center sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-2">
        <p className="font-display text-h3 text-ink">{couple.names}</p>
        <p className="font-body text-body text-ink-soft">{copy.tagline}</p>
        <a
          href={venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex min-h-11 items-center gap-1.5 font-body text-caption text-ink-soft underline transition-colors duration-150 ease-enter hover:text-primary"
        >
          <MapPin size={16} weight="light" aria-hidden="true" />
          {venue.name}
        </a>
      </div>
    </footer>
  );
}
