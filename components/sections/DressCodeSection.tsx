import Image from 'next/image';

import dressCodePhoto from '~/assets/dress-code/dresscode.jpg';
import { Section } from '~/components/ui/Section';
import { dressCode } from '~/lib/config';

const PALETTE_SWATCHES = [
  { name: 'Ivory', className: 'bg-page-ivory' },
  { name: 'Cream', className: 'bg-warm' },
  { name: 'Sage', className: 'bg-primary' },
  { name: 'Soft Gold', className: 'bg-gold' },
] as const;

/**
 * Dress code (#dresscode) — couple's rule: guest attire follows the site
 * palette. Swatch chips are the palette itself (no new decoration colors)
 * and sit closer to their sentence than the heading does.
 */
export function DressCodeSection() {
  return (
    <Section id="dresscode" ariaLabel="Dress code" tone="warm" title={dressCode.heading}>
      <div className="mt-4 flex flex-col gap-5">
        <p className="max-w-[65ch] font-body text-body text-ink">{dressCode.line}</p>
        <ul className="flex flex-wrap gap-3">
          {PALETTE_SWATCHES.map((swatch) => (
            <li key={swatch.name} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`h-6 w-6 rounded-full border-[1.5px] border-line ${swatch.className}`}
              />
              <span className="font-body text-caption text-ink-soft">{swatch.name}</span>
            </li>
          ))}
        </ul>
        <Image
          src={dressCodePhoto}
          alt="Guests in festive celebration attire posing among tall cacti, as attire inspiration"
          className="h-auto w-full rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          quality={80}
        />
      </div>
    </Section>
  );
}
