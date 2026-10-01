import { useRef } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, HOLD, NAV_H, fitsScreen, riseOnScroll, drawRule, later } from '../lib/motion';

const copy = {
  en: {
    title: 'Built and run for you, every day.',
    intro: 'Each one takes a job your team does by hand, runs it every day and hands over to a person when it should.',
    note: 'Illustrations. Names and messages are invented.',
    systems: [
      {
        id: 'outbound',
        name: 'Outbound on cold email',
        body: 'We find the companies that fit, research each one and verify every address. Each lead gets a sequence written for them, sent from new domains we set up and warm up, so your main domain stays untouched. Replies are drafted by an assistant and, by default, approved by a person. Interested buyers book straight into your calendar.',
        points: ['Companies researched one by one', 'Your main domain stays untouched', 'Calls booked into your calendar'],
      },
      {
        id: 'support',
        name: 'Customer support on chat',
        body: 'An agent on your website chat and Instagram messages that answers from your own information and acts in your tools: it looks up an order, logs a return, opens a ticket. What it cannot solve goes to your team as a ticket, with the conversation attached.',
        points: ['Answers from your own information', 'Looks up orders, opens tickets', 'Hands over with the full context'],
      },
    ],
    inbox: {
      title: 'Replies',
      rows: [
        ['Giulia, Studio Ferri', 'interested', 'Sounds useful. Can we talk next week?'],
        ['Tom, Harbour Freight', 'not now', 'Back in touch after Q1, please.'],
        ['Sara, Nord Logistica', 'wrong person', 'Try our head of sales, Luca.'],
      ],
      draft: 'Draft reply, waiting for approval',
      sent: 'Reply approved and sent',
      from: 'From anna@yourbrand-mail.com',
      draftText: 'Great to hear, Giulia. Here is my calendar: pick any time that suits you.',
      approve: 'Approve and send',
      edit: 'Edit',
    },
    chat: {
      title: 'Website chat',
      user: 'Where is my order 4821? And can I send back the blue one?',
      agent: 'Order 4821 left the warehouse yesterday and should arrive on Thursday. I have logged the return for the blue one, and the team will email you the label today.',
      actions: ['order found: 4821, shipped', 'return logged: 1\u00a0item', 'ticket opened for the team'],
    },
  },
  it: {
    title: 'Costruiti e gestiti per te, ogni giorno.',
    intro: 'Ognuno prende un lavoro che il tuo team fa a mano, lo porta avanti ogni giorno e passa la mano a una persona quando serve.',
    note: 'Illustrazioni. Nomi e messaggi sono inventati.',
    systems: [
      {
        id: 'outbound',
        name: 'Outbound via email a freddo',
        body: 'Troviamo le aziende giuste, studiamo ognuna e verifichiamo ogni indirizzo. Ogni contatto riceve una sequenza scritta su misura, inviata da nuovi domini che configuriamo e scaldiamo noi: il tuo dominio principale resta intatto. Le risposte le prepara un assistente e, di norma, le approva una persona. Chi è interessato prenota direttamente nel tuo calendario.',
        points: ['Aziende studiate una per una', 'Il tuo dominio principale resta intatto', 'Call prenotate nel tuo calendario'],
      },
      {
        id: 'support',
        name: 'Assistenza clienti in chat',
        body: 'Un agente sulla chat del tuo sito e nei messaggi Instagram che risponde partendo dalle tue informazioni e agisce nei tuoi strumenti: cerca un ordine, registra un reso, apre un ticket. Quello che non può risolvere arriva al tuo team come ticket, con la conversazione allegata.',
        points: ['Risposte dalle tue informazioni', 'Cerca ordini, apre ticket', 'Passa la mano con tutto il contesto'],
      },
    ],
    inbox: {
      title: 'Risposte',
      rows: [
        ['Giulia, Studio Ferri', 'interessato', 'Mi sembra utile. Ne parliamo la prossima settimana?'],
        ['Tom, Harbour Freight', 'non ora', 'Risentiamoci dopo il primo trimestre.'],
        ['Sara, Nord Logistica', 'persona sbagliata', 'Provate con Luca, il responsabile vendite.'],
      ],
      draft: 'Bozza di risposta, in attesa di approvazione',
      sent: 'Risposta approvata e inviata',
      from: 'Da anna@tuobrand-mail.com',
      draftText: 'Ottimo, Giulia. Ecco il mio calendario: scegli l’orario che preferisci.',
      approve: 'Approva e invia',
      edit: 'Modifica',
    },
    chat: {
      title: 'Chat del sito',
      user: 'Dov’è il mio ordine 4821? E posso restituire quello blu?',
      agent: 'L’ordine 4821 è partito ieri dal magazzino e dovrebbe arrivare giovedì. Ho registrato il reso di quello blu: il team ti manda l’etichetta via email oggi.',
      actions: ['ordine trovato: 4821, spedito', 'reso registrato: 1\u00a0articolo', 'ticket aperto per il team'],
    },
  },
};

// One span per word: React owns them, so the reply can stream in without SplitText and hidden words keep their space
const Words = ({ text, cls }) => text.split(' ').map((w, i) => <span key={i} className={cls}>{w}{' '}</span>);


// ---- Scroll scenes ----
// One timeline per system, written in seconds. Scrubbed it is spread over the scroll (and rewinds on the way back);
// played once (touch, short or narrow screens) it runs at 1.5x from when the stage comes into view.
// Only opacity and transforms move. Each chip lights (its accent ring fades in) when the matching thing happens in the picture.
// Reduced motion and no-JS show the picture without the chips lit: the accent there would only be decoration.
const lightChip = (tl, chip, at) => tl.to(chip, { opacity: 1, duration: 0.3 }, at);
const finish = (tl, st) => (st.scrub ? tl.to({}, { duration: 1.2 }) : tl.timeScale(1.5)); // scrubbed: a short rest on the finished picture

function inboxScene(stage, st) {
  const q = gsap.utils.selector(stage);
  const chips = q('.pt-lit');
  const words = q('.ib-w');
  gsap.set(q('.ib-row'), { autoAlpha: 0, y: -10 });
  gsap.set(q('.ib-draft, .ib-w, .ib-btns'), { autoAlpha: 0 });
  const tl = gsap.timeline({ scrollTrigger: st });
  // Replies arrive one company at a time. Played once, each tag scrambles onto its label; scrubbed, a scramble would freeze
  // half-garbled whenever the reader stops scrolling, so the tag just fades in.
  q('.ib-row').forEach((row, i) => {
    const tag = row.querySelector('.ib-tag');
    tl.to(row, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, i * 0.9);
    if (st.scrub) tl.fromTo(tag, { opacity: 0 }, { opacity: 1, duration: 0.4 }, i * 0.9 + 0.3);
    else tl.to(tag, { scrambleText: { text: tag.textContent, chars: 'lowerCase', speed: 0.6 }, duration: 0.7 }, i * 0.9 + 0.2);
  });
  lightChip(tl, chips[0], 0.3);
  // The draft builds word by word (sent from the outreach domain, not the main one), then the buttons appear
  tl.to(q('.ib-draft'), { autoAlpha: 1, duration: 0.4 }, 3.3)
    .to(words, { autoAlpha: 1, duration: 0.12, stagger: 0.1 }, 3.6)
    .to(q('.ib-btns'), { autoAlpha: 1, duration: 0.4 }, 3.6 + words.length * 0.1 + 0.4);
  lightChip(tl, chips[1], 3.5);
  // Approve is pressed last: its own beat, after a rest with the buttons on screen. The draft's label turns to "approved".
  tl.addLabel('press', st.scrub ? '+=1' : '+=0.5')
    .to(q('.ib-approve'), { scale: 0.92, duration: 0.2, ease: 'power2.in' }, 'press')
    .to(q('.ib-approve'), { scale: 1, duration: 0.3, ease: 'power2.out' })
    .to(q('.ib-edit'), { opacity: 0.4, duration: 0.3 }, 'press')
    .fromTo(q('.ib-ok'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, 'press+=0.2') // the ring draws round the draft
    .to(q('.ib-wait'), { opacity: 0, duration: 0.2 }, 'press+=0.2')
    .fromTo(q('.ib-sent'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 'press+=0.35');
  lightChip(tl, chips[2], 'press+=0.3');
  return finish(tl, st);
}

function chatScene(stage, st) {
  const q = gsap.utils.selector(stage);
  const chips = q('.pt-lit');
  const words = q('.ch-w');
  gsap.set(q('.ch-user, .ch-agent, .ch-w, .ch-act'), { autoAlpha: 0 });
  gsap.set(q('.ch-dot'), { scale: 0 });
  const tl = gsap.timeline({ scrollTrigger: st });
  tl.fromTo(q('.ch-user'), { y: 8 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' })
    .to(q('.ch-agent'), { autoAlpha: 1, duration: 0.3 }, '+=0.5') // a silent beat, no typing dots
    .addLabel('reply')
    .to(words, { autoAlpha: 1, duration: 0.12, stagger: 0.09 }, 'reply');
  lightChip(tl, chips[0], 'reply');
  // Each action lands as the reply reaches its clause; the last one is the hand-over
  const span = words.length * 0.09;
  q('.ch-act').forEach((act, i) => {
    const at = `reply+=${span * (0.2 + i * 0.3)}`;
    tl.to(act, { autoAlpha: 1, duration: 0.25 }, at)
      .to(act.querySelector('.ch-dot'), { scale: 1, duration: 0.3, ease: 'back.out(3)' }, at);
    if (i === 0) lightChip(tl, chips[1], at);
    if (i === 2) lightChip(tl, chips[2], at).addLabel('handover', at);
  });
  return finish(tl, st);
}

// The line icon beside the index (wide screens with a mouse only): an envelope while the outbound system is on screen, a chat
// bubble as the index moves to support, a ticket at the hand-over. Elsewhere (touch, reduced motion) it stays hidden: a still
// envelope would be wrong half the time, and the index already says which system is on screen.
// All three outlines are drawn with the same commands (a rounded box, a notch on each side, a tail under the bottom left; the
// parts a shape does not have are flat or zero length), so GSAP tweens the numbers in `d` directly and every in-between frame
// is the same box stretched. The inner marks never morph (a line into a line would spin): they cross-fade.
const outline = (t, b, notch, tail) => {
  const m = (t + b) / 2;
  const k = 1.1; // corner radius 2 as a cubic
  const c = (4 / 3) * notch; // notch half circle as a cubic, flat when 0
  return `M5 ${t}L19 ${t}C${19 + k} ${t} 21 ${t + 2 - k} 21 ${t + 2}L21 ${m - 2.5}C${21 - c} ${m - 2.5} ${21 - c} ${m + 2.5} 21 ${m + 2.5}`
    + `L21 ${b - 2}C21 ${b - 2 + k} ${19 + k} ${b} 19 ${b}L11 ${b}L6 ${b + tail}L6 ${b}L5 ${b}`
    + `C${5 - k} ${b} 3 ${b - 2 + k} 3 ${b - 2}L3 ${m + 2.5}C${3 + c} ${m + 2.5} ${3 + c} ${m - 2.5} 3 ${m - 2.5}`
    + `L3 ${t + 2}C3 ${t + 2 - k} ${5 - k} ${t} 5 ${t}Z`;
};
const ICON = { envelope: outline(5, 19, 0, 0), bubble: outline(4, 17, 0, 4), ticket: outline(5, 19, 2.5, 0) };

// The bubble forms while the support article's top crosses 60% to 50% of the screen: the index switches at 55%, same rule.
// The ticket forms over the 0.4 s of the chat timeline after its hand-over line. One draw() reads both and sets the icon,
// so the two never fight over the same attribute when the reader jumps.
function iconScene(svg, article, chat) {
  const [line, flap, dash, stub] = svg.children;
  // fromTo throughout: each frame is a pure function of the time, whatever order the tweens first rendered in
  const icon = gsap.timeline({ paused: true, defaults: { ease: 'power1.inOut', immediateRender: false } })
    .fromTo(line, { attr: { d: ICON.envelope } }, { attr: { d: ICON.bubble }, duration: 1 }, 0)
    .fromTo(flap, { opacity: 1 }, { opacity: 0, duration: 0.5 }, 0)
    .fromTo(dash, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.5)
    .fromTo(line, { attr: { d: ICON.bubble } }, { attr: { d: ICON.ticket }, duration: 1 }, 1)
    .fromTo(dash, { opacity: 1 }, { opacity: 0, duration: 0.5 }, 1)
    .fromTo(stub, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.5);
  const bubble = { p: 0 };
  const draw = () => {
    const ticket = gsap.utils.clamp(0, 1, (chat.time() - chat.labels.handover) / 0.4);
    icon.time(ticket > 0 ? 1 + ticket : bubble.p);
  };
  gsap.to(bubble, {
    p: 1,
    ease: 'none',
    onUpdate: draw,
    scrollTrigger: { trigger: article, start: 'top 60%', end: 'top 50%', scrub: 0.5, refreshPriority: 0 },
  });
  chat.eventCallback('onUpdate', draw);
  draw();
}

// How much scroll each held stage takes, in screens (Systems total: 1.5)
const SCENES = { outbound: { run: inboxScene, hold: 0.9 }, support: { run: chatScene, hold: 0.6 } };

// The article's height if nothing were pinned: a pinned stage leaves a tall spacer behind that would inflate offsetHeight.
// Summed from exact heights and rounded up: adding up rounded ones can come out a pixel short and let a scene pin 1px too tall.
const natural = (article) => {
  const h = (el) => el.getBoundingClientRect().height;
  return { offsetHeight: Math.ceil(h(article.firstElementChild) + parseFloat(getComputedStyle(article).rowGap) + h(article.querySelector('[data-stage]'))) };
};

const Panel = ({ title, cls = '', children }) => (
  <div aria-hidden="true" className={`${cls} select-none overflow-hidden rounded-[10px] border border-line bg-surface`}>
    <p className="border-b border-line px-5 py-3 text-sm font-semibold [font-stretch:110%]">{title}</p>
    <div className="p-5">{children}</div>
  </div>
);

function Inbox({ t, lang }) {
  return (
    <Panel title={t.title} cls="ib-panel">
      <ul className="grid gap-3">
        {t.rows.map(([who, tag, text], i) => (
          <li key={who} className={`ib-row rounded-lg px-3.5 py-3 ${i === 0 ? 'bg-raised' : ''}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium">{who}</span>
              <span key={lang} data-handover={i === 0 ? 'to' : undefined} className={`ib-tag rounded-md px-2 py-0.5 font-mono text-[0.72rem] ${i === 0 ? 'bg-accent/15 text-accent' : 'bg-raised text-faint'}`}>{tag}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </li>
        ))}
      </ul>
      <div className="ib-draft relative mt-4 rounded-lg border border-line p-4">
        <span className="ib-ok pointer-events-none absolute -inset-px origin-left scale-x-0 rounded-lg border border-accent" />
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 text-xs text-faint">
          <p className="grid">
            <span className="ib-wait [grid-area:1/1]">{t.draft}</span>
            <span data-motion-only className="ib-sent text-muted opacity-0 [grid-area:1/1]">{t.sent}</span>
          </p>
          <p>{t.from}</p>
        </div>
        <p className="mt-1.5 text-sm"><Words cls="ib-w" text={t.draftText} /></p>
        <div className="ib-btns mt-3 flex flex-wrap gap-2">
          <span className="ib-approve rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-canvas">{t.approve}</span>
          <span className="ib-edit rounded-md px-3 py-1.5 text-xs font-semibold text-muted ring-1 ring-inset ring-line">{t.edit}</span>
        </div>
      </div>
    </Panel>
  );
}

function Chat({ t }) {
  return (
    <Panel title={t.title} cls="ch-panel">
      <p className="ch-user ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-raised px-3.5 py-2.5 text-sm text-muted">{t.user}</p>
      <p className="ch-agent mt-3 max-w-[85%] rounded-lg rounded-bl-sm border border-line px-3.5 py-2.5 text-sm"><Words cls="ch-w" text={t.agent} /></p>
      <ul className="mt-4 grid gap-1.5 border-t border-line pt-4">
        {t.actions.map((a) => (
          <li key={a} className="ch-act flex items-center gap-2 font-mono text-[0.75rem] text-muted">
            <span className="ch-dot h-1.5 w-1.5 rounded-full bg-accent" />
            {a}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

let handover; // lib/handover.js once fetched: a language switch then remounts it in the same frame, not a few frames later

export default function Systems() {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);
  const artifacts = { outbound: <Inbox t={t.inbox} lang={lang} />, support: <Chat t={t.chat} /> };

  // The sticky index follows the reader: a system is active from when its article reaches mid-screen until the next one does
  // (the last one until the note under them), so it stays active through a hold. Read live from where things are on screen,
  // so it does not depend on the order ScrollTrigger measures pins in.
  useGSAP((context) => later(context, () => {
    const articles = gsap.utils.toArray('[data-system]', root.current);
    const note = root.current.querySelector('[data-note]');
    const items = articles.map((el) => root.current.querySelector(`[data-index="${el.dataset.system}"]`));
    const slot = (el) => el.closest('.pin-spacer') || el; // a pinned article is fixed: its spacer holds its place in the flow
    const icon = root.current.querySelector('.sys-icon');
    const hold = window.matchMedia(HOLD); // the icon only moves under HOLD (see iconScene)
    let shown = -2;
    const update = () => {
      const y = innerHeight * 0.55;
      let on = -1;
      articles.forEach((el, i) => { if (slot(el).getBoundingClientRect().top <= y) on = i; });
      if (note.getBoundingClientRect().top <= y) on = -1;
      icon.classList.toggle('is-active', on !== -1 && hold.matches);
      if (on === shown) return;
      shown = on;
      items.forEach((li, i) => li.classList.toggle('is-active', i === on));
    };
    ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top', onUpdate: update, onRefresh: update, onToggle: update });
  }), { scope: root, dependencies: [lang], revertOnUpdate: true });

  // The section's top rule draws in and the heading rises (motion allowed only)
  useGSAP((context) => later(context, () => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, () => {
      drawRule(root.current);
      riseOnScroll(root.current.querySelector('.sys-title'));
    });
    return () => mm.revert();
  }), { scope: root, dependencies: [lang], revertOnUpdate: true });

  // The two stages. Under HOLD each one is pinned and scrubbed: the whole article if it fits below the navbar, else only its
  // chips + picture, else it is only scrubbed while it scrolls by. Outside HOLD (touch, narrow) it plays once.
  // Fit is checked again after every ScrollTrigger refresh (resize, fonts loading), rebuilding the scenes if it changed.
  useGSAP((context) => later(context, () => {
    const mm = gsap.matchMedia(root.current);
    mm.add({ hold: HOLD, ok: MOTION_OK }, (ctx) => {
      const { hold } = ctx.conditions;
      const articles = gsap.utils.toArray('[data-system]', root.current);
      // per article: -1 nothing pins, 0 the article pins, 1 its stage pins
      const plan = () => articles.map((a) => (!hold ? -1 : fitsScreen(natural(a)) ? 0 : fitsScreen(a.querySelector('[data-stage]')) ? 1 : -1)).join();
      let inner;
      let key;
      let alive = true;
      const build = () => {
        inner?.revert();
        key = plan();
        const modes = key.split(',');
        inner = gsap.context(() => {
          articles.forEach((article, i) => {
            const { run, hold: screens } = SCENES[article.dataset.system];
            const stage = article.querySelector('[data-stage]');
            const pinned = [article, stage][modes[i]];
            // refreshPriority (even 0) makes ScrollTrigger refresh everything in page order, so the pin spacers add up correctly
            // (the pin is refreshed before its scene: its trigger sits higher on the page, or is the same element created first)
            const pin = pinned && ScrollTrigger.create({
              trigger: pinned,
              pin: true,
              start: () => `top ${Math.round(NAV_H + Math.max(0, (innerHeight - NAV_H - pinned.offsetHeight) / 2))}px`,
              end: () => `+=${Math.round(innerHeight * screens)}`,
              invalidateOnRefresh: true,
              refreshPriority: 0,
            });
            // The scene starts as the picture comes into view, so it never scrolls up empty, and ends with the hold
            const tl = run(stage, pin
              ? { trigger: stage, pinnedContainer: pinned, start: 'top 85%', end: () => pin.end, scrub: 0.5, invalidateOnRefresh: true, refreshPriority: 0 }
              : hold
                ? { trigger: stage, start: 'top 80%', end: 'bottom 40%', scrub: 0.5, refreshPriority: 0 }
                : { trigger: stage, start: 'top 70%', once: true, refreshPriority: 0 });
            if (hold && article.dataset.system === 'support') iconScene(root.current.querySelector('.sys-icon'), article, tl);
          });
        }, root.current);
      };
      build();
      const recheck = () => {
        if (plan() === key) return;
        requestAnimationFrame(() => {
          if (!alive) return;
          build();
          ScrollTrigger.refresh();
        });
      };
      ScrollTrigger.addEventListener('refresh', recheck);
      return () => {
        alive = false;
        ScrollTrigger.removeEventListener('refresh', recheck);
        inner.revert();
      };
    });
    return () => mm.revert();
  }), { scope: root, dependencies: [lang], revertOnUpdate: true });

  // The "interested" tag of the hero's example run files itself on the first reply here (lib/handover.js). Mouse screens only.
  useGSAP((context) => later(context, () => {
    const mm = gsap.matchMedia();
    mm.add(HOLD, () => {
      let stop;
      let gone = false;
      const go = (m) => { handover = m; if (!gone) stop = m.default(); };
      if (handover) go(handover);
      else import('../lib/handover').then(go).catch(() => {});
      return () => { gone = true; stop?.(); };
    });
    return () => mm.revert();
  }), { scope: root, dependencies: [lang], revertOnUpdate: true });

  return (
    <section id="systems" ref={root} className="rule py-24 lg:py-32">
      <div className="page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 key={lang} className="sys-title t-h2">{t.title}</h2>
            <p className="t-lead mt-5 max-w-[34rem] text-muted">{t.intro}</p>
            <div className="mt-10 hidden items-center gap-8 lg:flex">
              {/* the list is wider than its longest label in either language, so the icon does not move on a switch */}
              <ol className="grid min-w-[15rem] gap-3 border-l border-line">
                {t.systems.map((s) => (
                  <li
                    key={s.id}
                    data-index={s.id}
                    className="-ml-px border-l border-transparent pl-5 text-faint transition-colors duration-300 [&.is-active]:border-accent [&.is-active]:text-fg"
                  >
                    {s.name}
                  </li>
                ))}
              </ol>
              {/* stroke 2/3 of a unit = 1px at 36px */}
              <svg aria-hidden="true" data-motion-only className="sys-icon h-9 w-9 shrink-0 text-muted opacity-0 transition-opacity duration-300 [&.is-active]:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2 / 3} strokeLinecap="round" strokeLinejoin="round">
                <path d={ICON.envelope} />
                <path d="M3.5 7.5 12 13l8.5-5.5" />
                <path d="M8 10.5h8" opacity="0" />
                <path d="M15 8v8" opacity="0" strokeDasharray="1.5 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid gap-20 lg:col-span-7 lg:gap-28">
          {t.systems.map((s) => (
            <article key={s.id} data-system={s.id} className="grid gap-5">
              <div>
                <h3 className="t-h3 text-[1.5rem]">{s.name}</h3>
                <p className="mt-3 text-muted">{s.body}</p>
              </div>
              <div data-stage className="grid gap-7">
                <ul className="flex flex-wrap gap-2">
                  {s.points.map((p) => (
                    <li key={p} className="relative rounded-lg border border-line px-3 py-1.5 text-sm text-muted">
                      {p}
                      <span aria-hidden="true" data-motion-only className="pt-lit pointer-events-none absolute -inset-px rounded-lg border border-accent bg-accent/10 opacity-0" />
                    </li>
                  ))}
                </ul>
                {artifacts[s.id]}
              </div>
            </article>
          ))}
          <p data-note className="-mt-10 text-xs text-faint lg:-mt-16">{t.note}</p>
        </div>
      </div>
    </section>
  );
}
