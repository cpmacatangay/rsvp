import { Church, Camera, Cake, DiscoBall, ForkKnife, HandWaving, Martini, MoonStars } from '@phosphor-icons/react/dist/ssr';
import type { Icon } from '@phosphor-icons/react';

import { OrnamentRule } from '~/components/ui/OrnamentRule';
import { Section } from '~/components/ui/Section';
import { timeline } from '~/lib/config';

/**
 * Wedding-day timeline (v1.1, supersedes the old 4-row schedule; ceremony
 * now 3:00 PM). Icon keys verified against the installed Phosphor set;
 * icon choice documented in lib/config.ts. Hairline rail: one <li> per
 * moment, dividers between rows only (DESIGN §14.3).
 */

const ICONS = {
  handwaving: HandWaving,
  church: Church,
  martini: Martini,
  camera: Camera,
  cake: Cake,
  forkknife: ForkKnife,
  discoball: DiscoBall,
  moonstars: MoonStars,
} as const;

export function TimelineSection() {
  return (
    <Section id="timeline" ariaLabel="How the day runs" title="How the day runs">
      <OrnamentRule className="mb-3" />
      <ol className="mt-4 flex flex-col">
        {timeline.map((item, index) => {
          const IconComponent = ICONS[item.icon];
          return (
            <li
              key={item.time}
              className={`flex items-center gap-4 py-3.5 ${index > 0 ? 'border-line border-t' : ''}`}
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
              >
                <IconComponent size={22} weight="light" />
              </span>
              <span className="w-20 shrink-0 font-display text-h3 tabular-nums text-primary">
                {item.time}
              </span>
              <span className="font-body text-body text-ink">{item.label}</span>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
