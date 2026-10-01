import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK, later, startAt } from '../lib/motion';

// A 1px line on the left edge that fills as the page scrolls (scrubbed, so it empties on the way back).
// Wide screens only; reduced motion hides it, since a progress line that never moves says nothing.
export default function ScrollProgress() {
  const fill = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, (ctx) => {
      const undo = startAt(fill.current, { transform: 'scaleY(0)' }); // empty in the first frame, before the trigger can measure the page
      later(ctx, () => gsap.fromTo(fill.current, { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true },
      }));
      return undo;
    });
    return () => mm.revert();
  });
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden w-px bg-line lg:block motion-reduce:hidden">
      <div ref={fill} className="h-full origin-top bg-muted" />
    </div>
  );
}
