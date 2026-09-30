import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export const REDUCED = '(prefers-reduced-motion: reduce)';
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

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

export { gsap, ScrollTrigger, SplitText, useGSAP };
