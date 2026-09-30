import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import ScrollLink from './ScrollLink';
import WorkflowTrace from './WorkflowTrace';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, ScrollTrigger, SplitText, MOTION_OK, HOLD, NAV_H, fitsScreen } from '../lib/motion';

const copy = {
  en: {
    title: 'AI systems that find your clients, answer them and book the meeting.',
    sub: 'We find the companies that fit, write to each one and handle the replies. Interested buyers land on your calendar, and by default a person approves every reply.',
    book: 'Book a call',
    results: 'See the results',
    proof: 'meetings booked across five B2B campaigns on cold email and LinkedIn, in the UK, Europe and the UAE.',
  },
  it: {
    title: 'Sistemi AI che trovano i tuoi clienti, rispondono e fissano la call.',
    sub: 'Troviamo le aziende giuste, scriviamo a ognuna e gestiamo le risposte. Chi è interessato finisce nel tuo calendario e, di norma, ogni risposta la approva una persona.',
    book: 'Prenota una call',
    results: 'Guarda i risultati',
    proof: 'appuntamenti fissati in cinque campagne B2B via email e LinkedIn, tra Regno Unito, Europa ed Emirati.',
  },
};

// Button that leans toward the pointer (mouse and trackpad only)
function useMagnetic(ref) {
  useGSAP((_, contextSafe) => {
    const el = ref.current;
    if (!el || !matchMedia(`(pointer: fine) and ${MOTION_OK}`).matches) return undefined;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    const move = contextSafe((e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.25);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    const leave = contextSafe(() => { xTo(0); yTo(0); });
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  });
}

export default function Hero() {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);
  const book = useRef(null);
  useMagnetic(book);

  // Held scene: on a mouse screen where the content fits below the navbar, the hero stays put for two screens of
  // scrolling and the scroll walks the example lead through the trace. `held` says the content fits; HOLD (media query)
  // is checked inside the effects. The runway is the empty scroll distance that pinning adds after the section.
  const stage = useRef(null);
  const runway = useRef(null);
  const scene = useRef(null);
  const [held, setHeld] = useState(false);
  const hold = useSyncExternalStore(
    (notify) => { const mq = matchMedia(HOLD); mq.addEventListener('change', notify); return () => mq.removeEventListener('change', notify); },
    () => matchMedia(HOLD).matches,
    () => false,
  );

  useLayoutEffect(() => {
    const check = () => setHeld(fitsScreen(stage.current));
    check();
    ScrollTrigger.addEventListener('refresh', check); // resize, font swap, language switch: layout has settled
    return () => ScrollTrigger.removeEventListener('refresh', check);
  }, [lang]);

  useGSAP(() => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, () => {
      SplitText.create('.hero-title', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.09, delay: 0.1 }),
      });
      gsap.from('.hero-rise', { y: 14, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.5 });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [lang], revertOnUpdate: true });

  useGSAP(() => {
    const mm = gsap.matchMedia(root.current);
    mm.add(HOLD, () => {
      const s = scene.current; // the trace's scrubbed timeline, built by WorkflowTrace under the same conditions
      if (!held || !s) return undefined;
      const st = stage.current;
      const run = runway.current;
      const title = root.current.querySelector('.hero-title');

      // The headline lifts a little (never above the navbar); the subtitle and the buttons do not move.
      const rest = () => (st.closest('.pin-spacer') || st).getBoundingClientRect().top + window.scrollY;
      const lift = () => {
        const inStage = title.getBoundingClientRect().top - st.getBoundingClientRect().top - gsap.getProperty(title, 'y');
        return gsap.utils.clamp(0, 24, rest() + inStage - (NAV_H + 16));
      };
      s.tl.to(title, { y: () => -lift(), ease: 'none', duration: s.tl.duration() }, 0);

      ScrollTrigger.create({
        animation: s.tl,
        trigger: st,
        pin: st,
        pinSpacing: false, // the runway supplies the distance, so the section's own centring does not jump
        start: 0,
        end: () => `+=${run.offsetHeight}`,
        scrub: 0.4,
        invalidateOnRefresh: true,
      });
      ScrollTrigger.refresh();
      return undefined;
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [lang, held], revertOnUpdate: true });

  return (
    <>
      <section ref={root} className="pb-16 pt-24 sm:pt-32 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-6 lg:pt-20">
        <div ref={stage} className="page grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h1 key={lang} className="hero-title t-display max-w-[17ch] lg:[font-size:clamp(2.75rem,min(1.2rem_+_4.6vw,8.5vh),4.6rem)]">{t.title}</h1>
            <p className="hero-rise t-lead mt-6 max-w-[36rem] text-muted">{t.sub}</p>
            <div className="hero-rise mt-8 flex flex-wrap items-center gap-3">
              <ScrollLink ref={book} to="#book" className="btn-primary">{t.book}</ScrollLink>
              <ScrollLink to="#results" className="btn-quiet">{t.results}</ScrollLink>
            </div>
            <p className="hero-rise mt-10 max-w-[31rem] border-t border-line pt-5 text-sm text-muted">
              <span className="mr-1.5 text-base font-semibold text-fg tabular-nums">49</span>
              {t.proof}
            </p>
          </div>
          <div className="lg:col-span-5">
            <WorkflowTrace held={held} scene={scene} />
          </div>
        </div>
      </section>
    <div ref={runway} aria-hidden="true" style={hold && held ? { height: '200vh' } : undefined} />
    </>
  );
}
