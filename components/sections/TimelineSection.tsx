import { Church, Camera, Cake, DiscoBall, ForkKnife, HandWaving, Martini, MoonStars } from '@phosphor-icons/react/dist/ssr';

import { Section } from '~/components/ui/Section';
import { timeline } from '~/lib/config';

/**
 * Wedding-day timeline (v1.2 review): editorial blocks, not a table —
 * each moment is a free-standing block with a hairline icon (no circle),
 * an oversized display-serif time and its label, separated by whitespace
 * and a single thin rule. No container, no rail, no column chrome.
 * Icon keys verified against the installed Phosphor set (lib/config.ts).
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
    <Section id="timeline" ariaLabel="How the day runs" title="How the Day Runs">
      <ol className="mt-8 flex flex-col">
        {timeline.map((item, index) => {
          const IconComponent = ICONS[item.icon];
          return (
            <li
              key={item.time}
              className={`flex items-start gap-5 py-5 ${index > 0 ? 'border-line border-t' : ''}`}
            >
              <IconComponent
                aria-hidden="true"
                size={26}
                weight="light"
                className="mt-1.5 shrink-0 text-primary"
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-h2 leading-tight tabular-nums text-ink">
                  {item.time}
                </span>
                <span className="font-body text-body text-ink-soft">{item.label}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
