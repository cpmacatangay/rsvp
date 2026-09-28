import { Section } from '~/components/ui/Section';
import { dressCode } from '~/lib/config';

const PALETTE_SWATCHES = [
  { name: 'Ivory', hex: '#FAF7F0', ring: true },
  { name: 'Cream', hex: '#F3EEE3', ring: false },
  { name: 'Sage', hex: '#5B6E4F', ring: false },
  { name: 'Soft gold', hex: '#B79B5B', ring: false },
] as const;

/**
 * Dress code (#dresscode) — couple's rule: guest attire follows the site
 * palette. Swatch chips are the palette itself (no new decoration colors).
 */
export function DressCodeSection() {
  return (
    <Section id="dresscode" ariaLabel="Dress code" tone="warm">
      <h2 className="font-display text-h1 text-ink">{dressCode.heading}</h2>
      <p className="max-w-[65ch] font-body text-body text-ink">{dressCode.line}</p>
      <ul className="flex flex-wrap gap-3">
        {PALETTE_SWATCHES.map((swatch) => (
          <li key={swatch.name} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`h-6 w-6 rounded-full ${swatch.ring ? 'border border-line' : ''}`}
              style={{ backgroundColor: swatch.hex }}
            />
            <span className="font-body text-caption text-ink-soft">{swatch.name}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
