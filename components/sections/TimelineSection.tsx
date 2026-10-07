import { Church, Camera, Cake, DiscoBall, ForkKnife, HandWaving, Martini, MoonStars } from '@phosphor-icons/react/dist/ssr';

import { Section } from '~/components/ui/Section';
import { timeline } from '~/lib/config';

/**
 * Wedding-day timeline (v1.3): compact one-line itinerary rows — free
 * hairline icon, a fixed-width time column (so labels align down the list)
 * and the label filling the row. This replaces the earlier two-line blocks
 * whose stacked time + wide empty right half wasted space. One hairline
 * between rows, no container, no rail, no circles.
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
      <ol className="mt-5 flex flex-col">
        {timeline.map((item, index) => {
          const IconComponent = ICONS[item.icon];
          return (
            <li
              key={item.time}
              className={`flex items-center gap-4 py-3 ${index > 0 ? 'border-line border-t' : ''}`}
            >
              <IconComponent
                aria-hidden="true"
                size={20}
                weight="light"
                className="shrink-0 text-primary"
              />
              <span className="w-[5.4rem] shrink-0 font-body text-body font-semibold tabular-nums text-ink sm:w-[6rem]">
                {item.time}
              </span>
              <span className="font-body text-body text-ink-soft">{item.label}</span>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
