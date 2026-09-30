import { useRef } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, MOTION_OK } from '../lib/motion';

const copy = {
  en: {
    title: 'From the first call to a system that runs every day.',
    steps: [
      {
        title: 'A 30\u2011minute call', // non-breaking hyphen
        body: 'We look at what you sell, who buys it and how you work today. Then we tell you plainly whether a system fits.',
      },
      {
        title: 'We build it around how you work',
        body: 'We connect to the tools you already use, set everything up and write the messages. You approve the wording on one onboarding page, and nothing goes out before you do.',
      },
      {
        title: 'It runs every day',
        body: 'Emails go out on weekdays, in business hours, within a daily limit. Replies are drafted and, by default, approved by a person. Interested buyers book into your calendar and you take the calls. You see every lead in a dashboard.',
      },
    ],
  },
  it: {
    title: 'Dalla prima call a un sistema che lavora ogni giorno.',
    steps: [
      {
        title: 'Una call di 30\u00a0minuti',
        body: 'Guardiamo cosa vendi, chi lo compra e come lavori oggi. Poi ti diciamo chiaramente se un sistema fa per te.',
      },
      {
        title: 'Lo costruiamo sul tuo modo di lavorare',
        body: 'Ci colleghiamo agli strumenti che usi già, configuriamo tutto e scriviamo i messaggi. Approvi i testi in un’unica pagina di onboarding, e prima della tua approvazione non parte nulla.',
      },
      {
        title: 'Lavora ogni giorno',
        body: 'Le email partono nei giorni feriali, in orario d’ufficio, entro un limite giornaliero. Le risposte vengono preparate e, di norma, approvate da una persona. Chi è interessato prenota nel tuo calendario e tu fai le call. Vedi ogni contatto in una dashboard.',
      },
    ],
  },
};

export default function Process() {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);

  // The line draws through the three steps once, and each node lights up as it passes
  useGSAP(() => {
    const mm = gsap.matchMedia(root.current);
    mm.add({ wide: '(min-width: 1024px)', motion: MOTION_OK }, ({ conditions }) => {
      if (!conditions.motion) return;
      gsap.timeline({ scrollTrigger: { trigger: '.proc-list', start: 'top 75%', once: true } })
        .from('.proc-fill', { [conditions.wide ? 'scaleX' : 'scaleY']: 0, duration: 1.6, ease: 'power2.inOut' })
        .from('.proc-node', { scale: 0, duration: 0.45, ease: 'back.out(3)', stagger: 0.55 }, 0.15);
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [lang], revertOnUpdate: true });

  return (
    <section id="process" ref={root} className="border-t border-line py-24 lg:py-32">
      <div className="page">
        <h2 className="t-h2 max-w-[22ch]">{t.title}</h2>
        <div className="proc-list relative mt-14 lg:mt-20">
          {/* Vertical on phones and tablets, horizontal from lg */}
          <div aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-line lg:bottom-auto lg:left-0 lg:right-0 lg:top-[5px] lg:h-px lg:w-auto">
            <div className="proc-fill h-full w-full origin-top bg-accent lg:origin-left" />
          </div>
          <ol className="relative grid gap-12 lg:grid-cols-3 lg:gap-12">
            {t.steps.map((s) => (
              <li key={s.title} className="grid grid-cols-[11px_1fr] gap-x-6 lg:block">
                <span aria-hidden="true" className="mt-2 grid h-[11px] w-[11px] place-items-center rounded-full border border-line bg-canvas lg:mt-0">
                  <span className="proc-node h-[5px] w-[5px] rounded-full bg-accent" />
                </span>
                <div className="lg:mt-9 lg:pr-4">
                  <h3 className="t-h3">{s.title}</h3>
                  <p className="mt-3 text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
