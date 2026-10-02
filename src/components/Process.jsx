import { useRef } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, MOTION_OK, RISE, riseOnScroll, drawRule, later } from '../lib/motion';

const copy = {
  en: {
    title: 'A clear route to launch.',
    steps: [
      {
        title: 'A 30\u2011minute call', // non-breaking hyphen
        body: 'We look at your sales or support work and choose the right place to automate.',
      },
      {
        title: 'A focused setup',
        body: 'We connect your tools and prepare the content for a quick launch. Outreach inboxes warm up first. You approve before launch.',
      },
      {
        title: 'It runs every day',
        body: 'Your chosen service handles outreach or customer support. We keep it running for you.',
      },
    ],
    tools: ['Your tools', 'Your data', 'Your workflow'],
    outcomes: ['Calls booked', 'Customers answered'],
    note: 'Illustrations.',
  },
  it: {
    title: 'Un percorso chiaro per partire.',
    steps: [
      {
        title: 'Una call di 30\u00a0minuti',
        body: 'Guardiamo come trovi clienti o gestisci l’assistenza e scegliamo da dove iniziare ad automatizzare.',
      },
      {
        title: 'Una preparazione mirata',
        body: 'Colleghiamo i tuoi strumenti e prepariamo i contenuti per partire in fretta. Prima scaldiamo le caselle per l’outreach. Approvi tu prima del lancio.',
      },
      {
        title: 'Lavora ogni giorno',
        body: 'Il servizio che scegli gestisce l’outreach o l’assistenza clienti. Noi ci occupiamo di farlo funzionare.',
      },
    ],
    tools: ['Strumenti', 'Informazioni', 'Processo'],
    outcomes: ['Call prenotate', 'Clienti assistiti'],
    note: 'Illustrazioni.',
  },
};

// One small picture per step, each a row of chips: a 30-minute slot being booked, your tools joined into one system,
// the sales and support outcomes. The .pic-in parts appear, then the .pic-draw parts draw along their length.
// Below 360 px the tools stack, so their connectors run down instead of across.
const chip = 'pic-in relative whitespace-nowrap rounded-md bg-raised px-1.5 py-1 text-xs ring-1 ring-inset ring-line';
const SLOTS = ['10:00', '10:30', '11:00', '11:30'];
const pictures = [
  () => (
    // Equal columns, so the four slots match in width without tabular digits (Mona Sans draws those with a slashed zero)
    <div className="grid w-max grid-cols-4 gap-1.5 text-center">
      {SLOTS.map((s, i) => (
        <span key={s} className={`${chip} ${i === 1 ? 'text-accent' : 'text-faint'}`}>
          {i === 1 && <span className="pic-draw absolute -inset-px origin-left rounded-md border border-accent" />}
          <span className="relative">{s}</span>
        </span>
      ))}
    </div>
  ),
  (t) => (
    <div className="flex flex-col items-start min-[360px]:flex-row min-[360px]:items-center">
      {t.tools.map((s, i) => (
        <span key={s} className="contents">
          {i > 0 && <span className="pic-draw ml-3 h-2.5 w-px shrink-0 origin-top bg-line min-[360px]:ml-0 min-[360px]:h-px min-[360px]:w-2.5 min-[360px]:origin-left" />}
          <span className={`${chip} text-muted`}>{s}</span>
        </span>
      ))}
    </div>
  ),
  (t) => (
    <div className="flex gap-1.5">
      {t.outcomes.map((outcome) => (
        <span key={outcome} className={`${chip} text-muted`}>
          <span aria-hidden="true" className="pic-draw absolute -inset-px origin-left rounded-md border border-accent" />
          <span className="relative">{outcome}</span>
        </span>
      ))}
    </div>
  ),
];

// A step’s picture plays once, without hiding the text.
// One tween per part, not a stagger: after invalidateOnRefresh a nested stagger re-hides only its first element.
function picture(li) {
  const tl = gsap.timeline();
  const ins = li.querySelectorAll('.pic-in');
  ins.forEach((el, i) => tl.from(el, { opacity: 0, y: 8, duration: 0.6, ease: RISE }, i * 0.05));
  li.querySelectorAll('.pic-draw').forEach((el, i) => tl.from(el, { [el.offsetHeight > el.offsetWidth ? 'scaleY' : 'scaleX']: 0, duration: 0.4, ease: 'power2.inOut' }, ins.length * 0.05 + 0.1 + i * 0.06));
  return tl;
}

export default function Process() {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);

  // The heading and the top rule only depend on the language, so a resize never replays them
  useGSAP((context) => later(context, () => {
    const mm = gsap.matchMedia(root.current);
    mm.add({ motion: MOTION_OK }, ({ conditions }) => {
      if (!conditions.motion) return;
      drawRule(root.current);
      riseOnScroll('.proc-title');
    });
    return () => mm.revert();
  }), { scope: root, dependencies: [lang], revertOnUpdate: true });

  useGSAP((context) => later(context, () => {
    const mm = gsap.matchMedia(root.current);
    mm.add({ wide: '(min-width: 1024px)', motion: MOTION_OK }, ({ conditions }) => {
      if (!conditions.motion) return;
      const list = root.current.querySelector('.proc-list');

      gsap.fromTo('.proc-fill', { [conditions.wide ? 'scaleX' : 'scaleY']: 0 }, {
        [conditions.wide ? 'scaleX' : 'scaleY']: 1, duration: 1.4, ease: 'power2.inOut',
        scrollTrigger: { trigger: list, start: 'top 85%', once: true },
      });
      gsap.utils.toArray('.proc-step', list).forEach((li) => {
        gsap.timeline({ scrollTrigger: { trigger: li, start: 'top 90%', once: true } })
          .from(li.querySelector('.proc-node'), { scale: 0, duration: 0.5, ease: 'back.out(2)' })
          .add(picture(li), 0);
      });
    });
    return () => mm.revert();
  }), { scope: root, dependencies: [lang], revertOnUpdate: true });

  return (
    <section id="process" ref={root} className="rule py-20 lg:py-24">
      <div className="page">
        <h2 key={lang} className="proc-title t-h2 max-w-[22ch]">{t.title}</h2>
        <div className="proc-list relative mt-10">
          {/* From lg the three steps share three rows (subgrid): pictures, then the line with its nodes, then the text.
              Phones and tablets: one column per step, the picture under the text. */}
          <ol className="relative grid gap-9 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-0">
            {/* The line: vertical on phones and tablets, horizontal from lg in the nodes' row */}
            <li aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-line lg:bottom-auto lg:left-0 lg:right-0 lg:row-start-2 lg:row-end-3 lg:top-[5px] lg:h-px lg:w-auto">
              <div className="proc-fill h-full w-full origin-top bg-accent lg:origin-left" />
            </li>
            {t.steps.map((s, i) => (
              <li key={s.title} className="proc-step grid grid-cols-[11px_1fr] gap-x-6 lg:row-span-3 lg:grid-cols-1 lg:grid-rows-subgrid">
                <span aria-hidden="true" className="relative mt-2 grid h-[11px] w-[11px] place-items-center rounded-full border border-line bg-canvas lg:row-start-2 lg:mt-0">
                  <span className="proc-node h-[5px] w-[5px] rounded-full bg-accent" />
                </span>
                <div className="proc-text lg:row-start-3 lg:mt-6 lg:pr-4">
                  <h3 className="t-h3">{s.title}</h3>
                  <p className="mt-3 text-muted">{s.body}</p>
                </div>
                <div aria-hidden="true" className="proc-pic col-start-2 mt-5 select-none lg:col-start-1 lg:row-start-1 lg:mb-4 lg:mt-0">
                  {pictures[i](t)}
                </div>
              </li>
            ))}
          </ol>
          {/* Absolute from lg: it sits in the section's bottom padding and leaves the three steps aligned */}
          <p aria-hidden="true" className="mt-10 text-xs text-faint lg:absolute lg:top-full lg:mt-10">{t.note}</p>
        </div>
      </div>
    </section>
  );
}
