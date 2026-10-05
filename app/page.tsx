import { TimelineSection } from '~/components/sections/TimelineSection';
import { InfoSection } from '~/components/sections/InfoSection';
import { StorySection } from '~/components/sections/StorySection';
import { DressCodeSection } from '~/components/sections/DressCodeSection';
import { RsvpSection } from '~/components/sections/RsvpSection';
import { Footer } from '~/components/sections/Footer';

/**
 * Guest page — one route, all server-rendered facts.
 * v1.1 order transitional: hero → countdown+venues → story → timeline →
 * dress code → RSVP → footer. The v1.1 redesign steps (curtain, scratch-date,
 * hero slim) re-order this file in their own steps; each keeps the tree green.
 */
export default function HomePage() {
  return (
    <>
      <main>
        <InfoSection />
        <StorySection />
        <TimelineSection />
        <DressCodeSection />
        <RsvpSection />
      </main>
      <Footer />
    </>
  );
}
