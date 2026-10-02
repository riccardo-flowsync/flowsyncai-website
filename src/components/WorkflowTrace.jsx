import { useRef } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, later, startAt } from '../lib/motion';

// One timed example, independent of scroll speed. It pauses off screen and stays finished.
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
  useGSAP(() => {
    const mm = gsap.matchMedia(root.current); // scope: selectors below match inside this panel only
    mm.add(MOTION_OK, (ctx) => {
      const all = (sel) => root.current.querySelectorAll(sel);
      const steps = gsap.utils.toArray(all('.trace-step'));
      const ring = marker.current;
      ring.hidden = false;
      const undo = [
        startAt(all('.trace-fill'), { transform: 'scale(0)' }),
        startAt(all('.trace-seg'), { transform: 'scaleY(0)' }),
        () => { ring.hidden = true; },
      ];
      later(ctx, playOnce);
      return () => undo.forEach((u) => u());

      // It plays once when it comes into view and pauses off screen.
      function playOnce() {
        const tl = gsap.timeline({ paused: true });
        tl.to({}, { duration: 0.3 }); // let the headline lead
        steps.forEach((step, i) => {
          const q = gsap.utils.selector(step);
          tl.to(q('.trace-fill'), { scale: 1, duration: 0.18, ease: 'power2.out' })
            .fromTo(q('.trace-label'), { color: '#82817c' }, { color: '#f4f3ed', duration: 0.18 }, '<')
            .fromTo(q('.trace-detail'), { y: 3 }, { y: 0, duration: 0.22, ease: 'power2.out' }, '<');
          if (i < steps.length - 1) tl.to(q('.trace-seg'), { scaleY: 1, duration: 0.22, ease: 'power1.inOut' }, '+=0.08')
            .to(ring, { y: () => steps[i + 1].offsetTop - steps[0].offsetTop, duration: 0.22, ease: 'power1.inOut' }, '<'); // the last step has no line below it
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
        {/* Follows the timed sequence; hidden with reduced motion. top and left centre it on the first dot (20px padding + 6px dot offset + 5px radius, less its own 10px). */}
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
