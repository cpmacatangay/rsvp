import Image from 'next/image';
import heroPhoto from '~/assets/hero/cpcj.jpg';
import { Button } from '~/components/ui/Button';
import { DoubleBezel } from '~/components/ui/Card';
import { couple, venue, weddingDateDisplay } from '~/lib/config';

/**
 * Hero — taste rules: stack ≤ 4 elements (names, one subtext line, CTA, photo),
 * min-h-[100dvh] (never h-screen), top padding under the pt-24 cap. The photo
 * is the couple's own (CONTENT.md §3); alt describes the real scene.
 */
export function Hero() {
  return (
    <section
      aria-label={`${couple.names} wedding`}
      className="flex min-h-[100dvh] flex-col items-center gap-8 px-5 pb-12 pt-16 text-center sm:px-6 sm:pt-20"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3">
        <h1 className="font-display text-hero text-ink sm:text-[46px]">
          {couple.names.split(' & ')[0]} <span className="text-primary">&amp;</span>{' '}
          {couple.names.split(' & ')[1]}
        </h1>
        <p className="font-body text-body text-ink-soft">
          {weddingDateDisplay} <span aria-hidden="true">·</span>{' '}
          <span className="capitalize">{venue.city}</span>
        </p>
        <Button href="#rsvp" variant="primary" className="mt-2">
          RSVP
        </Button>
      </div>

      <div className="w-full max-w-3xl">
        <DoubleBezel className="overflow-hidden">
          <Image
            src={heroPhoto}
            alt="Christian and Christine smiling together at a cozy hotpot restaurant, steam rising from the table in front of them"
            className="h-auto w-full rounded-sm object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            quality={85}
          />
        </DoubleBezel>
      </div>
    </section>
  );
}
