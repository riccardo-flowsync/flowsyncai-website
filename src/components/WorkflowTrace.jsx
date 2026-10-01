import { useRef } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, HOLD, later, startAt } from '../lib/motion';

// One lead moving through the outbound system. On a wide mouse screen, normal page scroll walks it;
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

export default function WorkflowTrace() {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);
  const marker = useRef(null);
  const introduced = useRef(false); // step 1 has appeared once: a rebuild (language, resize) must not replay it

  useGSAP(() => {
    const mm = gsap.matchMedia(root.current); // scope: selectors below match inside this panel only
    mm.add({ ok: MOTION_OK, hold: HOLD }, (ctx) => {
      if (!ctx.conditions.ok) return undefined;
      // Waiting steps keep their label in the faint colour, so the whole workflow reads at a glance before anything runs.
      // A step that is reached fills its dot, its label turns bright and its time and detail appear.
      // The hidden states are plain style writes, in the first frame; the timelines are built after the first paint (they measure).
      const all = (sel) => root.current.querySelectorAll(sel);
      const labels = all('.trace-label');
      const steps = gsap.utils.toArray(all('.trace-step'));
      const ring = marker.current;
      const scrubbed = ctx.conditions.hold;
      labels.forEach((el) => el.classList.add('text-faint'));
      const undo = [
        () => labels.forEach((el) => el.classList.remove('text-faint')),
        startAt(all('.trace-fill'), { transform: 'scale(0)' }),
        startAt(all('.trace-seg'), { transform: 'scaleY(0)' }),
      ];
      if (scrubbed) {
        // Scroll scene: opacity and a small lift only (no visibility or clip-path), so the text stays findable and readable by assistive tech.
        undo.push(startAt(all('.trace-time'), { opacity: '0' }), startAt(all('.trace-detail'), { opacity: '0', transform: 'translateY(6px)' }));
        ring.hidden = false;
        undo.push(startAt(ring, { opacity: '0', visibility: 'hidden' }), () => { ring.hidden = true; });
      } else {
        undo.push(startAt(all('.trace-time'), { opacity: '0', visibility: 'hidden' }), startAt(all('.trace-detail'), { clipPath: 'inset(0 100% 0 0)' }));
      }
      let fg;
      later(ctx, () => {
        fg = getComputedStyle(root.current).color; // a reached step's label turns to the panel's own text colour
        return scrubbed ? scrub() : playOnce();
      });
      return () => undo.forEach((u) => u());

      function scrub() {
        // Scroll scene: step 1 appears by itself, the scroll then walks the lead down the line as the page moves.
        const show = (tl, step, at) => {
          const q = gsap.utils.selector(step);
          return tl.to(q('.trace-fill'), { scale: 1, duration: 0.3, ease: 'back.out(3)' }, at)
            .to(q('.trace-label'), { color: fg, duration: 0.25 }, '<')
            .to(q('.trace-time'), { opacity: 1, duration: 0.25 }, '<')
            .to(q('.trace-detail'), { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '<0.1');
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
        tl.to({}, { duration: 0.5 }); // finish the example before the tag departs
        // Finish before the tag leaves the hero. The page keeps moving throughout, with no pin or extra scroll distance.
        ScrollTrigger.create({
          animation: tl,
          trigger: root.current,
          start: 0,
          end: () => {
            const tag = root.current.querySelector('[data-handover="from"]');
            return Math.max(1, tag.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.5);
          },
          scrub: true,
          invalidateOnRefresh: true,
        });
      }

      // Everywhere else: it plays once when it comes into view and pauses off screen.
      function playOnce() {
        const tl = gsap.timeline({ paused: true });
        tl.to({}, { duration: 0.7 }); // let the headline land first
        steps.forEach((step, i) => {
          const q = gsap.utils.selector(step);
          tl.to(q('.trace-fill'), { scale: 1, duration: 0.3, ease: 'back.out(3)' })
            .to(q('.trace-label'), { color: fg, duration: 0.25 }, '<')
            .to(q('.trace-time'), { autoAlpha: 1, duration: 0.25 }, '<')
            .to(q('.trace-detail'), { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'steps(22)' }, '<0.1');
          if (i < steps.length - 1) tl.to(q('.trace-seg'), { scaleY: 1, duration: 0.4, ease: 'power1.inOut' }, '+=0.3'); // the last step has no line below it
        });

        // Only run while visible
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
        });
      }
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [lang], revertOnUpdate: true });

  return (
    <figure ref={root} className="rounded-[10px] border border-line bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
        <span className="text-[0.95rem] font-semibold [font-stretch:110%]">{t.title}</span>
        <span className="text-xs text-faint">{t.tag}</span>
      </div>

      <ol className="trace-list relative px-5 py-5">
        {/* Rides the line in the scroll scene; hidden otherwise. top and left centre it on the first dot (20px padding + 6px dot offset + 5px radius, less its own 10px). */}
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
                <span data-handover="from" className="trace-detail mt-1 inline-block rounded-md bg-accent/15 px-2 py-0.5 font-mono text-[0.78rem] text-accent">
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
