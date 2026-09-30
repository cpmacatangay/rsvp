import { Section } from '~/components/ui/Section';
import { schedule } from '~/lib/config';

/**
 * Day schedule (#schedule) — CONFIRMED times (CONTENT.md §5); labels are the
 * couple's pick pending M4 copy review. Rows separated by one hairline
 * (DESIGN §14.3: never double borders on rows).
 */
export function ScheduleSection() {
  return (
    <Section id="schedule" ariaLabel="How the day runs" title="How the day runs">
      <ol className="mt-4 flex flex-col">
        {schedule.map((item, index) => (
          <li
            key={item.time}
            className={`flex items-baseline justify-between gap-4 py-3 ${index > 0 ? 'border-line border-t' : ''}`}
          >
            <span className="font-display text-h3 tabular-nums text-primary">{item.time}</span>
            <span className="font-body text-body text-ink">{item.label}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
