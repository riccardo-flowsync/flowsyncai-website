import { useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase, useGSAP);

// A phone address bar sliding in and out must not re-measure every trigger
ScrollTrigger.config({ ignoreMobileResize: true });

export const REDUCED = '(prefers-reduced-motion: reduce)';
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
// The only condition under which a scene may pin: mouse or trackpad, a wide screen, motion allowed.
// Phones and touch tablets never pin. Pair it with fitsScreen(el) so a pinned scene is never taller than the screen below the navbar.
export const HOLD = '(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 1024px)';
export const NAV_H = 64; // the fixed navbar (h-16 in Navbar.jsx)
export const fitsScreen = (el) => el.offsetHeight + NAV_H <= window.innerHeight;

// fitsScreen as React state, checked again after every ScrollTrigger refresh (resize, late fonts, a pin appearing)
export function useFits(ref, deps) {
  const [fits, setFits] = useState(false);
  useLayoutEffect(() => {
    const check = () => { if (ref.current) setFits(fitsScreen(ref.current)); };
    check();
    ScrollTrigger.addEventListener('refresh', check);
    return () => ScrollTrigger.removeEventListener('refresh', check);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return fits;
}

// Late fonts change heights: re-measure every trigger (and every useFits) once they are in
document.fonts?.ready.then(() => ScrollTrigger.refresh());

// Anything that changes the page's height after ScrollTrigger measured it moves every trigger below it: a heading re-split
// 200 ms after a resize (SplitText waits, ScrollTrigger does not), an FAQ answer opening. Measure again once it settles.
let settling;
new ResizeObserver(() => {
  clearTimeout(settling);
  settling = setTimeout(() => ScrollTrigger.refresh(), 300);
}).observe(document.body);

// The signature ease of the site: every heading rise uses it (a fast start that settles softly)
export const RISE = 'rise';
CustomEase.create(RISE, '0.16, 1, 0.3, 1');

let lenis = null;

// Smooth scrolling for mouse and trackpad only. Touch keeps native scrolling, reduced motion gets none.
export function startSmoothScroll() {
  if (lenis || matchMedia(`${REDUCED}, (pointer: coarse)`).matches) return undefined;
  lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

// No offset here: where the jump lands is html's scroll-padding-top in index.css, which Lenis and scrollIntoView both read
export function scrollToEl(el) {
  if (!el) return;
  if (lenis) {
    lenis.resize(); // after a route change Lenis still has the previous page's height as its scroll limit
    lenis.scrollTo(el);
  } else el.scrollIntoView({ behavior: matchMedia(REDUCED).matches ? 'auto' : 'smooth' });
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

// Freeze the page behind an overlay (mobile menu)
export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

// A heading rises line by line, once, as it comes into view (the hero gesture, reused on the two headings that ask for a decision).
// Call inside gsap.matchMedia(MOTION_OK); the heading needs key={lang} so the language switch re-splits it.
export function riseOnScroll(target) {
  return SplitText.create(target, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    reduceWhiteSpace: false, // the default turns the non-breaking space in "30 minuti" into a breakable one
    onSplit: (self) => gsap.from(self.lines, {
      yPercent: 110,
      duration: 1.1,
      ease: RISE,
      stagger: 0.09,
      scrollTrigger: { trigger: target, start: 'top 85%', once: true },
    }),
  });
}

// The top rule of a section draws itself from the left as the section enters, scrubbed (it rewinds on the way back).
// Sections use className "rule" instead of "border-t border-line": the line is a ::before driven by --rule (see index.css),
// fully drawn by default so reduced motion and no-JS show it. Call inside gsap.matchMedia(MOTION_OK).
export function drawRule(section) {
  return gsap.fromTo(section, { '--rule': 0 }, {
    '--rule': 1,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 60%', scrub: true },
  });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
