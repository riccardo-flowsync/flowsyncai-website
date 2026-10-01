import { useRef } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, HOLD, NAV_H, RISE, useFits, riseOnScroll, drawRule } from '../lib/motion';

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
    tools: ['Your inbox', 'Your calendar', 'Your CRM'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    note: 'Illustrations.',
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
    tools: ['La tua posta', 'Il tuo calendario', 'Il tuo CRM'],
    days: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
    note: 'Illustrazioni.',
  },
};

// One small picture per step, each a row of chips: a 30-minute slot being booked, your tools joined into one system,
// the five working days. The .pic-in parts appear, then the .pic-draw parts draw along their length.
// Below 360 px the tools stack, so their connectors run down instead of across.
const chip = 'pic-in relative whitespace-nowrap rounded-md px-1.5 py-1 text-xs ring-1 ring-inset ring-line';
const SLOTS = ['10:00', '10:30', '11:00', '11:30'];
const pictures = [
  () => (
    // Equal columns, so the four slots match in width without tabular digits (Mona Sans draws those with a slashed zero)
    <div className="grid w-max grid-cols-4 gap-1.5 text-center">
      {SLOTS.map((s, i) => (
        <span key={s} className={`${chip} ${i === 1 ? 'text-accent' : 'text-faint'}`}>
          {i === 1 && <span className="pic-draw absolute -inset-px origin-left rounded-md border border-accent bg-accent/15" />}
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
      {t.days.map((d, i) => (
        <span key={d} className={`pic-in w-8 pt-1 text-center text-xs leading-4 ${i < 5 ? 'text-muted' : 'text-faint'}`}>
          {d}
          <span className={`mt-0.5 block h-0.5 origin-left rounded-full ${i < 5 ? 'pic-draw bg-accent' : 'bg-line'}`} />
        </span>
      ))}
    </div>
  ),
];

// A step's picture as its own timeline, so it can sit inside the scrubbed walk or play on the step's trigger.
// One tween per part, not a stagger: after invalidateOnRefresh a nested stagger re-hides only its first element.
function picture(li) {
  const tl = gsap.timeline();
  const ins = li.querySelectorAll('.pic-in');
  ins.forEach((el, i) => tl.from(el, { opacity: 0, y: 8, duration: 0.6, ease: RISE }, i * 0.05));
  li.querySelectorAll('.pic-draw').forEach((el, i) => tl.from(el, { [el.offsetHeight > el.offsetWidth ? 'scaleY' : 'scaleX']: 0, duration: 0.4, ease: 'power2.inOut' }, ins.length * 0.05 + 0.1 + i * 0.06));
  return tl;
}

// One timeline for the wide layout: step 1 rises, the line draws left to right, and each step rises as the line reaches its node
// (t runs 0 to 10). When held, the step before settles to 75% opacity: still above the faint colour, never invisible.
function walk(list, scrollTrigger, settle) {
  const steps = gsap.utils.toArray('.proc-step', list);
  const T0 = 1.5, LINE = 7.5;
  // Where each node sits along the line, 0 to 1 (the columns are not exactly thirds because of the gap). Re-read on every refresh.
  const timeOf = (i) => (i ? T0 + ((steps[i].offsetLeft + 5.5) / list.offsetWidth) * LINE : 0);
  const parts = steps.map(() => []); // the tweens that start when the line reaches step i
  const tl = gsap.timeline({ defaults: { ease: 'none' } });
  tl.fromTo('.proc-fill', { scaleX: 0 }, { scaleX: 1, duration: LINE }, T0);
  steps.forEach((li, i) => {
    parts[i].push(
      tl.from(li.querySelector('.proc-node'), { scale: 0, duration: 0.6, ease: 'back.out(3)' }, timeOf(i)),
      tl.from(li.querySelector('.proc-text'), { y: 40, opacity: 0, duration: 1.4, ease: RISE }, timeOf(i)),
    );
    const pic = picture(li); // a nested timeline, so place() moves it as one piece and its inner timing stays
    tl.add(pic, timeOf(i));
    parts[i].push(pic);
    if (settle && i) parts[i].push(tl.to(steps[i - 1].querySelectorAll('.proc-text, .proc-pic'), { opacity: 0.75, duration: 1.4 }, timeOf(i)));
  });
  tl.set({}, {}, 10); // the walk ends with a beat of rest
  const place = () => parts.forEach((tweens, i) => tweens.forEach((tw) => tw.startTime(timeOf(i))));
  ScrollTrigger.create({ ...scrollTrigger, animation: tl, scrub: true, invalidateOnRefresh: true, onRefresh: place });
  return tl;
}

export default function Process() {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);
  // A pinned scene must fit the screen below the navbar. Crossing that line (resize, late fonts) rebuilds the scene; nothing else does.
  const fits = useFits(root, [lang]);

  // The heading and the top rule only depend on the language, so a resize never replays them
  useGSAP(() => {
    const mm = gsap.matchMedia(root.current);
    mm.add({ motion: MOTION_OK }, ({ conditions }) => {
      if (!conditions.motion) return;
      drawRule(root.current);
      riseOnScroll('.proc-title');
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [lang], revertOnUpdate: true });

  useGSAP(() => {
    const mm = gsap.matchMedia(root.current);
    mm.add({ hold: HOLD, wide: '(min-width: 1024px)', motion: MOTION_OK }, ({ conditions }) => {
      const section = root.current;
      if (!conditions.motion) return;
      const list = section.querySelector('.proc-list');

      if (conditions.wide) {
        // Mouse or trackpad and the section fits: pin it and let the scroll walk the three steps.
        // The walk starts a little before the pin so step 1 is already up when the scene locks.
        if (conditions.hold && fits) {
          // Centred in the space under the navbar, and a hold that stops growing on tall screens
          const pin = ScrollTrigger.create({
            trigger: section, pin: true, invalidateOnRefresh: true,
            start: () => `top ${Math.max(NAV_H, Math.round((window.innerHeight - section.offsetHeight + NAV_H) / 2))}px`,
            end: () => `+=${Math.min(Math.round(window.innerHeight * 1.6), 1400)}`,
          });
          walk(list, { trigger: section, start: 'top 55%', end: () => pin.end }, true);
        } else {
          walk(list, { trigger: list, start: 'top 80%', end: 'top 35%' }, false);
        }
        return;
      }

      // Phones and narrow screens: the line runs down the page and its tip stays at 70% of the screen, each step rises as the tip reaches it.
      // The picture sits under the step's text, so it plays on its own trigger: with the step, or later if it is not yet fully on screen
      // (its bottom at 95%, which is 27% of the screen below the step's own 68% line).
      gsap.fromTo('.proc-fill', { scaleY: 0 }, {
        scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 70%', scrub: true },
      });
      gsap.utils.toArray('.proc-step', list).forEach((li) => {
        gsap.timeline({ scrollTrigger: { trigger: li, start: 'top 68%', toggleActions: 'play none none reverse' } })
          .from(li.querySelector('.proc-text'), { y: 32, opacity: 0, duration: 0.8, ease: RISE })
          .from(li.querySelector('.proc-node'), { scale: 0, duration: 0.45, ease: 'back.out(3)' }, 0);
        const pic = li.querySelector('.proc-pic');
        gsap.timeline({ scrollTrigger: {
          trigger: li, toggleActions: 'play none none reverse',
          start: () => `top+=${Math.max(0, pic.offsetTop + pic.offsetHeight - li.offsetTop - window.innerHeight * 0.27)} 68%`,
        } }).add(picture(li));
      });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [lang, fits], revertOnUpdate: true });

  return (
    <section id="process" ref={root} className="rule py-24 lg:py-32">
      <div className="page">
        <h2 key={lang} className="proc-title t-h2 max-w-[22ch]">{t.title}</h2>
        <div className="proc-list relative mt-14 lg:mt-10">
          {/* From lg the three steps share three rows (subgrid): pictures, then the line with its nodes, then the text.
              Phones and tablets: one column per step, the picture under the text. */}
          <ol className="relative grid gap-12 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-0">
            {/* The line: vertical on phones and tablets, horizontal from lg in the nodes' row */}
            <li aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-line lg:bottom-auto lg:left-0 lg:right-0 lg:row-start-2 lg:row-end-3 lg:top-[5px] lg:h-px lg:w-auto">
              <div className="proc-fill h-full w-full origin-top bg-accent lg:origin-left" />
            </li>
            {t.steps.map((s, i) => (
              <li key={s.title} className="proc-step grid grid-cols-[11px_1fr] gap-x-6 lg:row-span-3 lg:grid-cols-1 lg:grid-rows-subgrid">
                <span aria-hidden="true" className="relative mt-2 grid h-[11px] w-[11px] place-items-center rounded-full border border-line bg-canvas lg:row-start-2 lg:mt-0">
                  <span className="proc-node h-[5px] w-[5px] rounded-full bg-accent" />
                </span>
                <div className="proc-text lg:row-start-3 lg:mt-9 lg:pr-4">
                  <h3 className="t-h3">{s.title}</h3>
                  <p className="mt-3 text-muted">{s.body}</p>
                </div>
                <div aria-hidden="true" className="proc-pic col-start-2 mt-5 select-none lg:col-start-1 lg:row-start-1 lg:mb-4 lg:mt-0">
                  {pictures[i](t)}
                </div>
              </li>
            ))}
          </ol>
          {/* Absolute from lg: it sits in the section's bottom padding and costs the pinned scene no height */}
          <p aria-hidden="true" className="mt-10 text-xs text-faint lg:absolute lg:top-full lg:mt-10">{t.note}</p>
        </div>
      </div>
    </section>
  );
}
