import { Hero } from '~/components/sections/Hero';
import { InfoSection } from '~/components/sections/InfoSection';
import { StorySection } from '~/components/sections/StorySection';
import { ScheduleSection } from '~/components/sections/ScheduleSection';
import { DressCodeSection } from '~/components/sections/DressCodeSection';
import { RsvpSection } from '~/components/sections/RsvpSection';
import { Footer } from '~/components/sections/Footer';

/**
 * Guest page — one route, all server-rendered facts (PRD §3 scope order:
 * hero → countdown+location → story → schedule → dress code → RSVP → footer).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <main>
        <InfoSection />
        <StorySection />
        <ScheduleSection />
        <DressCodeSection />
        <RsvpSection />
      </main>
      <Footer />
    </>
  );
}
