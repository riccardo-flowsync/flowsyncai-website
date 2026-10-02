import { useRef } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, MOTION_OK, later } from '../lib/motion';

const copy = {
  en: {
    title: 'AI outreach',
    tag: 'Example run',
    note: 'Illustration. The company and people are invented.',
    steps: [
      { time: '09:02', label: 'The right buyer found', detail: 'Operations director, logistics company, Milan' },
      { time: '09:05', label: 'Researched. Personal email sent.', detail: 'Subject: your new Piacenza site' },
      { time: '11:47', label: 'An interested reply', quote: 'Interesting. How would this work for us?' },
      { time: '11:52', label: 'You approve the next step', detail: 'A reply with your booking link' },
      { time: '14:10', label: 'Meeting booked', detail: 'Thursday 11:00, 30\u00a0minutes' },
    ],
  },
  it: {
    title: 'AI outreach',
    tag: 'Esempio',
    note: 'Illustrazione. Azienda e persone sono inventate.',
    steps: [
      { time: '09:02', label: 'Il contatto giusto trovato', detail: 'Direttore operativo, azienda di logistica, Milano' },
      { time: '09:05', label: 'Ricerca fatta. Email personale inviata.', detail: 'Oggetto: la nuova sede di Piacenza' },
      { time: '11:47', label: 'Una risposta interessata', quote: 'Interessante. Come funzionerebbe per noi?' },
      { time: '11:52', label: 'Approvi il prossimo passo', detail: 'Una risposta con il tuo link di prenotazione' },
      { time: '14:10', label: 'Appuntamento fissato', detail: 'Giovedì 11:00, 30\u00a0minuti' },
    ],
  },
};

export default function WorkflowTrace() {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);

  useGSAP((context) => later(context, () => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, () => {
      // A short scroll traces the whole example. Text stays readable, including at rest.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          // Resolve the start before adding the range, including when the figure is visible on load.
          start: () => Math.max(0, root.current.getBoundingClientRect().top + scrollY - innerHeight * 0.72),
          end: '+=240',
          scrub: 0.15,
        },
      });
      gsap.utils.toArray('.trace-step').forEach((step, i) => {
        tl.fromTo(step.querySelector('.trace-fill'), { opacity: 0 }, { opacity: 1, duration: 0.12 }, i * 0.2);
        const segment = step.querySelector('.trace-seg');
        if (segment) tl.fromTo(segment, { scaleY: 0 }, { scaleY: 1, duration: 0.2 }, i * 0.2);
      });
    });
    return () => mm.revert();
  }), { scope: root, dependencies: [lang], revertOnUpdate: true });

  return (
    <figure ref={root} className="workflow-figure overflow-hidden rounded-xl border border-line bg-surface">
      <figcaption className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <span className="font-semibold [font-stretch:110%]">{t.title}</span>
        <span className="text-xs text-muted">{t.tag}</span>
      </figcaption>
      <ol className="px-5 py-5">
        {t.steps.map((step, i) => (
          <li key={step.time} className="trace-step relative grid grid-cols-[10px_1fr] gap-x-3.5 pb-5 last:pb-0">
            {i < t.steps.length - 1 && (
              <span aria-hidden="true" className="absolute bottom-0 left-[4.5px] top-[19px] w-px bg-line">
                <span className="trace-seg block h-full w-full origin-top bg-accent" />
              </span>
            )}
            <span aria-hidden="true" className="relative mt-1.5 h-2.5 w-2.5 rounded-full border border-faint">
              <span className="trace-fill absolute -inset-px rounded-full bg-accent" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-sm font-semibold">{step.label}</p>
                <time className="font-mono text-[0.7rem] text-faint">{step.time}</time>
              </div>
              {step.detail && <p className="mt-1 text-sm leading-relaxed text-muted">{step.detail}</p>}
              {step.quote && <p className="mt-2 rounded-lg bg-raised px-3 py-2 text-sm text-fg">“{step.quote}”</p>}
            </div>
          </li>
        ))}
      </ol>
      <p className="border-t border-line px-5 py-3 text-xs text-muted">{t.note}</p>
    </figure>
  );
}
