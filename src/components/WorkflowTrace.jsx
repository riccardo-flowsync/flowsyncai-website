import { useRef } from 'react';
import { Mail, MessageSquare, Check } from 'lucide-react';
import ScrollLink from './ScrollLink';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, later } from '../lib/motion';

const copy = {
  en: {
    title: 'Two services. Work in sync.',
    note: 'Illustration of the two services.',
    lanes: [
      { id: 'outbound', name: 'AI outreach', purpose: 'Win new customers', steps: ['Find the right buyers', 'Start a conversation', 'Book a meeting'], tag: 'interested' },
      { id: 'support', name: 'AI agent', purpose: 'Look after customers', steps: ['Receive a question', 'Answer from your information', 'Resolve or hand over'] },
    ],
  },
  it: {
    title: 'Due servizi. Tutto in sintonia.',
    note: 'Illustrazione dei due servizi.',
    lanes: [
      { id: 'outbound', name: 'AI outreach', purpose: 'Trova nuovi clienti', steps: ['Trova i contatti giusti', 'Avvia una conversazione', 'Fissa un appuntamento'], tag: 'interessato' },
      { id: 'support', name: 'AI agent', purpose: 'Prenditi cura dei clienti', steps: ['Riceve una domanda', 'Risponde con le tue informazioni', 'Risolve o passa al team'] },
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
      // Content is immediately readable. Only the connecting paths and status marks animate.
      const tl = gsap.timeline({ paused: true });
      tl.fromTo('.trace-branch', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.65, ease: 'power2.inOut' })
        .from('.trace-dot', { scale: 0.5, opacity: 0, duration: 0.3, stagger: 0.12, ease: 'power2.out' }, 0.4)
        .from('.trace-seg', { scaleY: 0, duration: 0.45, stagger: 0.18, ease: 'power2.inOut' }, 0.55)
        .from('.trace-done', { opacity: 0, x: -4, duration: 0.35, stagger: 0.12, ease: 'power2.out' }, 1.4);
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 88%',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
    });
    return () => mm.revert();
  }), { scope: root, dependencies: [lang], revertOnUpdate: true });

  return (
    <figure ref={root} className="workflow-figure rounded-xl border border-line bg-surface p-5 sm:p-6">
      <figcaption className="text-center text-base font-semibold [font-stretch:110%]">{t.title}</figcaption>
      <div aria-hidden="true" className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-lg border border-faint/40 bg-raised px-4 py-2.5 text-sm font-semibold">
        <span className="h-2 w-2 rounded-sm bg-accent" />FlowSync
      </div>
      <svg aria-hidden="true" className="mx-auto block h-14 w-full text-accent" viewBox="0 0 400 56" preserveAspectRatio="none" fill="none" strokeWidth="1.25">
        {['M200 0V12Q200 22 190 22H110Q100 22 100 32V56', 'M200 0V12Q200 22 210 22H290Q300 22 300 32V56'].map((d) => (
          <g key={d}>
            <path d={d} stroke="#343139" vectorEffect="non-scaling-stroke" />
            <path className="trace-branch" d={d} pathLength="1" stroke="currentColor" strokeDasharray="1" vectorEffect="non-scaling-stroke" />
          </g>
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {t.lanes.map((lane, index) => {
          const Icon = index === 0 ? Mail : MessageSquare;
          return (
            <div key={lane.id} className="min-w-0">
              <ScrollLink to={`#system-${lane.id}`} className="group flex min-h-11 flex-col items-center justify-center gap-2 rounded-lg text-center">
                <Icon aria-hidden="true" className="h-5 w-5 text-accent transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none" strokeWidth={1.5} />
                <span className="font-semibold">{lane.name}</span>
              </ScrollLink>
              <p className="mt-1 min-h-[2.8em] text-center text-xs leading-relaxed text-muted">{lane.purpose}</p>
              <ol className="mt-5 grid gap-0">
                {lane.steps.map((step, i) => (
                  <li key={step} className="relative grid grid-cols-[8px_1fr] gap-x-2.5 pb-5 last:pb-0">
                    {i < 2 && <span aria-hidden="true" className="absolute bottom-0 left-[3.5px] top-4 w-px bg-line"><span className="trace-seg block h-full origin-top bg-accent/60" /></span>}
                    <span aria-hidden="true" className="trace-dot relative mt-[6px] h-2 w-2 rounded-full border border-accent bg-surface" />
                    <div className="min-w-0 text-[0.82rem] leading-relaxed">
                      <p className={i === 2 ? 'font-medium text-fg' : 'text-muted'}>{step}</p>
                      {i === 1 && lane.tag && <span data-handover="from" className="mt-1 inline-block rounded-md bg-accent/15 px-2 py-0.5 font-mono text-[0.72rem] text-accent">{lane.tag}</span>}
                      {i === 2 && <Check aria-hidden="true" className="trace-done mt-2 h-4 w-4 text-accent" strokeWidth={1.5} />}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
      <p className="mt-5 border-t border-line pt-3 text-center text-xs text-faint">{t.note}</p>
    </figure>
  );
}
