import { gsap, ScrollTrigger } from './motion';

// The hero's "interested" tag travels down the empty right margin to the first reply in the Systems inbox (desktop, mouse only).
// Path in screen space from the two live tags, so Lenis and re-splits need no extra maths. Scrubbed: a pure function of scroll.
const A = 0.18; // end of leg 1 (out of the trace card into the lane), as a share of the window
const B = 0.8; // end of leg 2 (down the lane); leg 3 slides into the inbox slot
const slide = gsap.parseEase('power2.inOut');
const sink = gsap.parseEase('sine.inOut');
const lerp = (a, b, u) => a + (b - a) * u;

export default function mount() {
  const src = document.querySelector('[data-handover="from"]');
  const tgt = document.querySelector('[data-handover="to"]');
  if (!src || !tgt) return () => {};

  // A copy of the hero tag without its scrub state (inline opacity/transform) or its offset (mt-1)
  const chip = src.cloneNode(true);
  chip.removeAttribute('style');
  chip.removeAttribute('data-handover');
  chip.classList.remove('trace-detail', 'mt-1');
  chip.setAttribute('aria-hidden', 'true');
  chip.setAttribute('data-motion-only', '');
  Object.assign(chip.style, {
    position: 'fixed', left: '0', top: '0', margin: '0', zIndex: '40', pointerEvents: 'none', transformOrigin: '0 0', whiteSpace: 'nowrap', visibility: 'hidden',
  });
  document.body.append(chip);
  const set = gsap.quickSetter(chip, 'css'); // one transform write (a 'scale' quickSetter is ignored)

  let ok = false;
  let lane = 0;
  let end = 1;
  let state;
  // Measured on every refresh, after the illustration timelines (refreshPriority -1). Any failed gate leaves today's static page.
  const start = () => {
    const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const landing = tgt.closest('section').getBoundingClientRect().top + scrollY - pad; // where a #systems jump stops
    const s = Math.max(0, src.getBoundingClientRect().top + scrollY - innerHeight * 0.5);
    end = Math.min(landing, tgt.getBoundingClientRect().top + scrollY - innerHeight * 0.7);
    const col = Math.max(src.closest('figure').getBoundingClientRect().right, tgt.closest('.ib-panel').getBoundingClientRect().right);
    const room = document.documentElement.clientWidth - col - src.offsetWidth;
    lane = col + Math.min(24, room / 2);
    ok = room >= 24 && end - s >= 240 && src.textContent.trim() === tgt.textContent.trim();
    if (!ok) end = s + 1;
    return s;
  };

  let p = 0;
  // Both ends can still be easing after the scroll stops (the inbox rows are scrubbed with a lag), so while the tag flies it is
  // placed on every frame, after GSAP has rendered them. Outside the window nothing runs.
  const place = () => {
    const a = src.getBoundingClientRect();
    const b = tgt.getBoundingClientRect();
    let x;
    let y;
    let s = 1;
    if (p < A) {
      x = lerp(a.left, lane, slide(p / A));
      y = a.top;
    } else if (p < B) {
      x = lane;
      y = lerp(a.top, b.top, sink((p - A) / (B - A)));
    } else {
      const u = slide((p - B) / (1 - B));
      x = lerp(lane, b.left, u);
      y = b.top;
      s = lerp(1, b.width / a.width, u);
    }
    set({ x, y, scale: s });
  };
  const draw = (progress) => {
    p = progress;
    const next = !ok ? 'off' : p <= 0 ? 'home' : p >= 1 ? 'filed' : 'flying';
    if (next !== state) { // each toggles once per pass
      state = next;
      chip.style.visibility = next === 'flying' ? 'visible' : 'hidden';
      // Clipped, not hidden: "interested" stays in the trace's accessibility tree, and the trace scrub owns its opacity
      src.style.clipPath = next === 'flying' || next === 'filed' ? 'inset(50%)' : '';
      tgt.style.visibility = next === 'home' || next === 'flying' ? 'hidden' : ''; // '' lets the row's own autoAlpha govern it
      if (next === 'flying') gsap.ticker.add(place);
      else gsap.ticker.remove(place);
    }
    if (next === 'flying') place();
  };

  const st = ScrollTrigger.create({
    trigger: tgt,
    start,
    end: () => end,
    refreshPriority: -1,
    onUpdate: (self) => draw(self.progress),
    onRefresh: (self) => draw(self.progress),
  });
  return () => {
    gsap.ticker.remove(place);
    st.kill();
    chip.remove();
    if (src.style.clipPath === 'inset(50%)') src.style.clipPath = '';
    tgt.style.visibility = '';
  };
}
