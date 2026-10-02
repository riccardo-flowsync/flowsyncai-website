import { useRef } from 'react';
import ScrollLink from './ScrollLink';
import WorkflowTrace from './WorkflowTrace';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, SplitText, MOTION_OK, RISE, later, startAt } from '../lib/motion';

const copy = {
  en: {
    title: 'AI automation. More time to grow.',
    sub: 'We’re an AI automation agency. Our AI outreach service finds the right buyers, starts conversations and books calls. Built and run for you.',
    book: 'Book a call',
    results: 'See the results',
    proof: 'meetings booked across 5 past B2B campaigns.',
    supportLink: 'Looking for customer support? Explore AI agent.',
  },
  it: {
    title: 'Automazioni AI. Più tempo per crescere.',
    sub: 'Siamo un’agenzia di automazione AI. Il nostro servizio AI outreach trova i contatti giusti, avvia conversazioni e prenota call. Lo costruiamo e gestiamo per te.',
    book: 'Prenota una call',
    results: 'Guarda i risultati',
    proof: 'appuntamenti fissati in 5 campagne B2B passate.',
    supportLink: 'Ti serve assistenza clienti? Scopri AI agent.',
  },
};

// Button that leans toward the pointer (mouse and trackpad only)
function useMagnetic(ref) {
  useGSAP((context, contextSafe) => later(context, () => {
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
  }));
}

export default function Hero() {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);
  const book = useRef(null);
  useMagnetic(book);

  // The headline rises line by line through its masks. It is hidden for the first frame (opacity, which costs no layout), then split
  // and shown by the first job after the first paint (splitting measures the lines). The subtitle, the buttons and the proof line
  // rise with it by transform only: they are fully visible from the first frame, as the subtitle is the page's largest paint.
  useGSAP(() => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, (ctx) => {
      const title = root.current.querySelector('.hero-title');
      const rise = root.current.querySelectorAll('.hero-rise');
      // First, as later() runs at once after the first load
      const undo = [startAt(title, { opacity: '0' }), startAt(rise, { transform: 'translateY(14px)' })];
      later(ctx, () => {
        SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          reduceWhiteSpace: false,
          onSplit: (self) => {
            // A line never wraps inside its mask while a late font or a resize waits for the re-split (the text below would jump)
            self.lines.forEach((l) => { l.style.whiteSpace = 'nowrap'; });
            return gsap.from(self.lines, { yPercent: 110, duration: 0.75, ease: RISE, stagger: 0.07 });
          },
        });
        title.style.opacity = ''; // the lines now sit below their masks
        gsap.to(rise, { y: 0, duration: 0.65, ease: 'power3.out', stagger: 0.06 });
      }, true);
      return () => undo.forEach((u) => u());
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [lang], revertOnUpdate: true });

  return (
    <section ref={root} className="hero-section relative pb-16 pt-24 sm:pt-32 lg:flex lg:min-h-[min(90svh,850px)] lg:items-center lg:py-28">
        <div className="page grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h1 key={lang} className="hero-title t-display max-w-[14ch] lg:[font-size:clamp(2.75rem,min(1.2rem_+_4.6vw,8.5vh),4.6rem)]">{t.title}</h1>
            <p className="hero-rise t-lead mt-6 max-w-[36rem] text-muted">{t.sub}</p>
            <div className="hero-rise mt-8 flex flex-wrap items-center gap-3">
              <ScrollLink ref={book} to="#book" className="btn-primary">{t.book}</ScrollLink>
              <ScrollLink to="#results" className="btn-quiet">{t.results}</ScrollLink>
            </div>
            <p className="hero-rise mt-8 max-w-[34rem] text-sm text-muted"><strong className="font-semibold text-fg">49</strong> {t.proof}</p>
            <ScrollLink to="#system-support" className="hero-rise link mt-5 inline-flex min-h-11 items-center text-sm text-muted">{t.supportLink}</ScrollLink>
          </div>
          <div className="lg:col-span-5">
            <WorkflowTrace />
          </div>
        </div>
    </section>
  );
}
