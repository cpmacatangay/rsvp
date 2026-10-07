import { Church, Camera, Cake, DiscoBall, ForkKnife, HandWaving, Martini, MoonStars } from '@phosphor-icons/react/dist/ssr';

import { Section } from '~/components/ui/Section';
import { timeline } from '~/lib/config';

/**
 * Wedding-day timeline (v1.3.1). Mobile: the approved single-column rows.
 * Desktop: the same rows in a two-column grid so the 768px measure is filled
 * with content instead of trailing empty space. Hairlines follow the visual
 * rows per breakpoint: first row has no top rule (mobile rule 1, desktop the
 * first two). No table, no rail, no circles.
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
      <ol className="mt-5 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
        {timeline.map((item) => {
          const IconComponent = ICONS[item.icon];
          return (
            <li
              key={item.time}
              className="flex items-center gap-4 border-line border-t py-3 [&:first-child]:border-t-0 sm:[&:nth-child(-n+2)]:border-t-0"
            >
              <IconComponent
                aria-hidden="true"
                size={20}
                weight="light"
                className="shrink-0 text-primary"
              />
              <span className="w-[5.4rem] shrink-0 font-body text-body font-semibold tabular-nums text-ink sm:w-[5.8rem]">
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
