import { useRef } from 'react';
import ScrollLink from './ScrollLink';
import WorkflowTrace from './WorkflowTrace';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, SplitText, MOTION_OK, RISE, later, startAt } from '../lib/motion';

const copy = {
  en: {
    title: 'AI that books sales calls and answers your customers.',
    sub: 'Cold email that brings buyers to your calendar. Support agents that handle questions, orders and returns. Built and run for you.',
    book: 'Book a call',
    results: 'See the results',
    proof: 'meetings booked across five past B2B campaigns, on cold email and LinkedIn.',
  },
  it: {
    title: 'AI che fissa call e risponde ai tuoi clienti.',
    sub: 'Email a freddo che portano clienti nel tuo calendario. Assistenti che gestiscono domande, ordini e resi. Costruiti e gestiti per te.',
    book: 'Prenota una call',
    results: 'Guarda i risultati',
    proof: 'appuntamenti fissati in cinque campagne B2B passate, via email e LinkedIn.',
  },
};

// Button that leans toward the pointer (mouse and trackpad only)
function useMagnetic(ref) {
  useGSAP((context, contextSafe) => later(context, () => {
    const el = ref.current;
    if (!el) return undefined;
    const mm = gsap.matchMedia();
    mm.add(`(pointer: fine) and ${MOTION_OK}`, () => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3' });
      const move = contextSafe((e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left + gsap.getProperty(el, 'x') - r.width / 2) * 0.12);
        yTo((e.clientY - r.top + gsap.getProperty(el, 'y') - r.height / 2) * 0.18);
      });
      const leave = contextSafe(() => { xTo(0); yTo(0); });
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      };
    });
    return () => mm.revert();
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
            return gsap.from(self.lines, { yPercent: 110, duration: 0.6, ease: RISE, stagger: 0.055 });
          },
        });
        title.style.opacity = ''; // the lines now sit below their masks
        gsap.to(rise, { y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.045 });
      }, true);
      return () => undo.forEach((u) => u());
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [lang], revertOnUpdate: true });

  return (
    <section ref={root} className="pb-16 pt-24 sm:pt-32 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-6 lg:pt-20">
        <div className="page grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
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
            <WorkflowTrace />
          </div>
        </div>
    </section>
  );
}
