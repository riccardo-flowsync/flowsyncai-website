import { useRef } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, HOLD } from '../lib/motion';

// One lead moving through the outbound system. On a mouse screen where it fits, the scroll walks it (Hero holds the scene);
// elsewhere it plays once and stays on the finished run.
// Without motion (reduced motion, no JS yet) the finished run is shown as is.
const copy = {
  en: {
    title: 'Outbound system',
    tag: 'Example run',
    note: 'An illustrative run. The company and the people are invented.',
    steps: [
      { time: '09:02', label: 'Prospect found', detail: 'Operations director, logistics company, Milan' },
      { time: '09:04', label: 'Researched', detail: 'Opened a second warehouse in May' },
      { time: '09:05', label: 'Email written', detail: 'Subject: your new Piacenza site' },
      { time: '11:47', label: 'Reply received', quote: 'Interesting. How would this work for us?' },
      { time: '11:47', label: 'Classified', tag: 'interested' },
      { time: '11:52', label: 'Reply approved by a person', detail: 'Sends the booking link' },
      { time: '14:10', label: 'Meeting booked', detail: 'Thursday 11:00, 30\u00a0minutes' },
    ],
  },
  it: {
    title: 'Sistema di outbound',
    tag: 'Esempio',
    note: 'Un esempio illustrativo. Azienda e persone sono inventate.',
    steps: [
      { time: '09:02', label: 'Contatto trovato', detail: 'Direttore operativo, azienda di logistica, Milano' },
      { time: '09:04', label: 'Ricerca fatta', detail: 'Ha aperto un secondo magazzino a maggio' },
      { time: '09:05', label: 'Email scritta', detail: 'Oggetto: la nuova sede di Piacenza' },
      { time: '11:47', label: 'Risposta ricevuta', quote: 'Interessante. Come funzionerebbe per noi?' },
      { time: '11:47', label: 'Classificata', tag: 'interessato' },
      { time: '11:52', label: 'Risposta approvata da una persona', detail: 'Invia il link per prenotare' },
      { time: '14:10', label: 'Appuntamento fissato', detail: 'Giovedì 11:00, 30\u00a0minuti' },
    ],
  },
};

export default function WorkflowTrace({ held = false, scene }) {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);
  const marker = useRef(null);
  const introduced = useRef(false); // step 1 has appeared once: a rebuild (language, resize) must not replay it

  useGSAP(() => {
    const mm = gsap.matchMedia(root.current); // scope: selectors below match inside this panel only
    mm.add({ ok: MOTION_OK, hold: HOLD }, (ctx) => {
      if (!ctx.conditions.ok) return undefined;
      gsap.set('.trace-fill', { scale: 0 });
      gsap.set('.trace-seg', { scaleY: 0 });
      gsap.set('.trace-label, .trace-time', { autoAlpha: 0 });
      gsap.set('.trace-detail', { clipPath: 'inset(0 100% 0 0)' });
      const steps = gsap.utils.toArray('.trace-step', root.current);

      if (ctx.conditions.hold && held && scene) {
        // Held scene: step 1 appears by itself, the scroll then walks the lead down the line (Hero builds the pin around this timeline).
        const ring = marker.current;
        ring.hidden = false;
        gsap.set(ring, { autoAlpha: 0, y: 0 });
        const show = (tl, step, at) => {
          const q = gsap.utils.selector(step);
          return tl.to(q('.trace-fill'), { scale: 1, duration: 0.3, ease: 'back.out(3)' }, at)
            .to(q('.trace-label, .trace-time'), { autoAlpha: 1, duration: 0.25 }, '<')
            .to(q('.trace-detail'), { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'steps(22)' }, '<0.1');
        };
        const intro = gsap.timeline({ delay: 0.7 }).to(ring, { autoAlpha: 1, duration: 0.3 }, 0);
        show(intro, steps[0], 0);
        if (introduced.current || window.scrollY > 4) intro.progress(1);
        introduced.current = true;

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
        const dotY = (i) => steps[i].offsetTop - steps[0].offsetTop;
        steps.forEach((step, i) => {
          if (i > 0) {
            tl.to(steps[i - 1].querySelector('.trace-seg'), { scaleY: 1, duration: 0.5 })
              .to(ring, { y: () => dotY(i), duration: 0.5 }, '<');
            show(tl, step, '>-0.05').to({}, { duration: 0.35 }); // the pause lets each step be read
          }
        });
        tl.to({}, { duration: 0.5 }); // the finished run holds for a moment before the page moves on
        scene.current = { tl };
        return () => { scene.current = null; ring.hidden = true; };
      }

      // Everywhere else: it plays once when it comes into view and pauses off screen.
      const tl = gsap.timeline({ paused: true });
      tl.to({}, { duration: 0.7 }); // let the headline land first
      steps.forEach((step) => {
        const q = gsap.utils.selector(step);
        tl.to(q('.trace-fill'), { scale: 1, duration: 0.3, ease: 'back.out(3)' })
          .to(q('.trace-label, .trace-time'), { autoAlpha: 1, duration: 0.25 }, '<')
          .to(q('.trace-detail'), { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'steps(22)' }, '<0.1')
          .to(q('.trace-seg'), { scaleY: 1, duration: 0.4, ease: 'power1.inOut' }, '+=0.3');
      });

      // Only run while visible
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
      return undefined;
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [lang, held], revertOnUpdate: true });

  return (
    <figure ref={root} className="rounded-[10px] border border-line bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
        <span className="text-[0.95rem] font-semibold [font-stretch:110%]">{t.title}</span>
        <span className="text-xs text-faint">{t.tag}</span>
      </div>

      <ol className="trace-list relative px-5 py-5">
        {/* Rides the line in the held scene (see Hero); hidden otherwise. top and left centre it on the first dot (20px padding + 6px dot offset + 5px radius, less its own 10px). */}
        <span ref={marker} hidden aria-hidden="true" className="pointer-events-none absolute left-[15px] top-[21px] h-5 w-5 rounded-full border border-accent" />
        {t.steps.map((s, i) => (
          <li key={i} className="trace-step relative grid grid-cols-[10px_1fr_auto] gap-x-3.5 pb-4 last:pb-0">
            {i < t.steps.length - 1 && (
              <span aria-hidden="true" className="absolute left-[4.5px] top-[19px] -bottom-[4px] w-px bg-line">
                <span className="trace-seg block h-full w-full origin-top bg-accent" />
              </span>
            )}
            <span aria-hidden="true" className="relative mt-[6px] h-[10px] w-[10px] rounded-full border border-faint">
              <span className="trace-fill absolute -inset-px rounded-full bg-accent" />
            </span>
            <div className="min-w-0">
              <p className="trace-label text-[0.95rem] font-medium leading-snug">{s.label}</p>
              {s.detail && <p className="trace-detail mt-0.5 font-mono text-[0.78rem] leading-relaxed text-muted">{s.detail}</p>}
              {s.quote && (
                <p className="trace-detail mt-1.5 rounded-md bg-raised px-3 py-2 text-[0.88rem] leading-snug text-muted">
                  “{s.quote}”
                </p>
              )}
              {s.tag && (
                <span className="trace-detail mt-1 inline-block rounded-md bg-accent/15 px-2 py-0.5 font-mono text-[0.78rem] text-accent">
                  {s.tag}
                </span>
              )}
            </div>
            <time className="trace-time font-mono text-[0.75rem] leading-[1.6rem] text-faint tabular-nums">{s.time}</time>
          </li>
        ))}
      </ol>

      <figcaption className="border-t border-line px-5 py-3 text-xs text-faint">{t.note}</figcaption>
    </figure>
  );
}
