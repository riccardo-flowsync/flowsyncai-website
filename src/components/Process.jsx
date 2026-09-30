import { useEffect, useRef, useState } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, HOLD, NAV_H, RISE, fitsScreen, riseOnScroll, drawRule } from '../lib/motion';

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

// One timeline for the wide layout: step 1 rises, the line draws left to right, and each step rises as the line reaches its node
// (t runs 0 to 10). When held, the step before settles to 75% opacity: still above the faint colour, never invisible.
function walk(list, scrollTrigger, settle) {
  const steps = gsap.utils.toArray('.proc-step', list);
  // Where each node sits along the line, 0 to 1 (the columns are not exactly thirds because of the gap)
  const at = steps.map((li) => (li.offsetLeft + 5.5) / list.offsetWidth);
  const T0 = 1.5, LINE = 7.5;
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger });
  tl.fromTo('.proc-fill', { scaleX: 0 }, { scaleX: 1, duration: LINE }, T0);
  steps.forEach((li, i) => {
    const t = i ? T0 + at[i] * LINE : 0;
    tl.from(li.querySelector('.proc-node'), { scale: 0, duration: 0.6, ease: 'back.out(3)' }, t);
    tl.from(li.querySelector('.proc-text'), { y: 40, opacity: 0, duration: 1.4, ease: RISE }, t);
    if (settle && i) tl.to(steps[i - 1].querySelector('.proc-text'), { opacity: 0.75, duration: 1.4 }, t);
  });
  tl.set({}, {}, 10); // the walk ends with a beat of rest
  return tl;
}

export default function Process() {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);
  // Whether the section fits the screen below the navbar (a pinned scene must). Re-measured on resize, language change and font load.
  const [fits, setFits] = useState(false);
  useEffect(() => {
    const measure = () => setFits(fitsScreen(root.current));
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [lang]);

  useGSAP(() => {
    const mm = gsap.matchMedia(root.current);
    mm.add({ hold: HOLD, wide: '(min-width: 1024px)', motion: MOTION_OK }, ({ conditions }) => {
      if (!conditions.motion) return;
      const section = root.current;
      const list = section.querySelector('.proc-list');
      drawRule(section);
      riseOnScroll('.proc-title');

      if (conditions.wide) {
        // Mouse or trackpad and the section fits: pin it and let the scroll walk the three steps.
        // The walk starts a little before the pin so step 1 is already up when the scene locks.
        if (conditions.hold && fits) {
          const pin = ScrollTrigger.create({
            trigger: section, pin: true, start: `top ${NAV_H}px`, end: () => `+=${Math.round(window.innerHeight * 2.2)}`, invalidateOnRefresh: true,
          });
          walk(list, { trigger: section, start: 'top 55%', end: () => pin.end, scrub: true, invalidateOnRefresh: true }, true);
        } else {
          walk(list, { trigger: list, start: 'top 80%', end: 'top 35%', scrub: true, invalidateOnRefresh: true }, false);
        }
        return;
      }

      // Phones and narrow screens: the line runs down the page and its tip stays at 70% of the screen, each step rises as the tip reaches it
      gsap.fromTo('.proc-fill', { scaleY: 0 }, {
        scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 70%', scrub: true },
      });
      gsap.utils.toArray('.proc-step', list).forEach((li) => {
        gsap.timeline({ scrollTrigger: { trigger: li, start: 'top 68%', toggleActions: 'play none none reverse' } })
          .from(li.querySelector('.proc-text'), { y: 32, opacity: 0, duration: 0.8, ease: RISE })
          .from(li.querySelector('.proc-node'), { scale: 0, duration: 0.45, ease: 'back.out(3)' }, 0);
      });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [lang, fits], revertOnUpdate: true });

  return (
    <section id="process" ref={root} className="rule py-24 lg:py-32">
      <div className="page">
        <h2 key={lang} className="proc-title t-h2 max-w-[22ch] flow-root [&>div]:-mb-[0.08em] [&>div]:pb-[0.08em]">{t.title}</h2>
        <div className="proc-list relative mt-14 lg:mt-20">
          {/* Vertical on phones and tablets, horizontal from lg */}
          <div aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-line lg:bottom-auto lg:left-0 lg:right-0 lg:top-[5px] lg:h-px lg:w-auto">
            <div className="proc-fill h-full w-full origin-top bg-accent lg:origin-left" />
          </div>
          <ol className="relative grid gap-12 lg:grid-cols-3 lg:gap-12">
            {t.steps.map((s) => (
              <li key={s.title} className="proc-step grid grid-cols-[11px_1fr] gap-x-6 lg:block">
                <span aria-hidden="true" className="mt-2 grid h-[11px] w-[11px] place-items-center rounded-full border border-line bg-canvas lg:mt-0">
                  <span className="proc-node h-[5px] w-[5px] rounded-full bg-accent" />
                </span>
                <div className="proc-text lg:mt-9 lg:pr-4">
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
