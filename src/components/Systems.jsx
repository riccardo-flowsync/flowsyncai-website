import { useRef, useState } from 'react';
import ScrollLink from './ScrollLink';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, HOLD, riseOnScroll, drawRule, later } from '../lib/motion';

const copy = {
  en: {
    title: 'Built and run for you, every day.',
    intro: 'Each one takes a job your team does by hand, runs it every day and hands over to a person when it should.',
    note: 'Illustrations. Names and messages are invented.',
    example: 'Interactive example',
    replay: 'Replay example',
    try: 'Choose a customer question',
    show: 'See it in action',
    serviceIntro: 'Try the example. See where the system acts and where a person takes over.',
    scenarios: {
      order: { label: 'Order and return' },
      question: { label: 'A routine question', user: 'Where can I find your returns policy?', agent: 'You can find the returns policy in the help section. I can also help you check the steps for your order.', actions: ['help information found', 'answer prepared from that information', 'no ticket needed'] },
      handover: { label: 'A case for the team', user: 'Can you change the address after my order has shipped?', agent: 'I cannot change an order that has already shipped. I have opened a ticket for the team with your question and this conversation.', actions: ['request reviewed', 'ticket opened for the team', 'conversation attached'] },
    },
    systems: [
      {
        id: 'outbound',
        name: 'Sales outreach',
        body: 'For B2B businesses with a clear offer and customers worth €1,000 or more. We find buyers, send personal emails and handle replies. A person approves replies by default. Your main email domain stays untouched.',
        points: ['Replies sorted for you', 'You approve by default', 'Calls booked into your calendar'],
      },
      {
        id: 'support',
        name: 'Customer support assistant',
        body: 'For teams handling customer questions on their website and Instagram. The assistant answers from your information, checks orders and starts returns. Your team gets anything it cannot solve, with the conversation attached.',
        points: ['Answers customer questions', 'Checks orders and returns', 'Hands over with the full context'],
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
      approved: 'Example approved',
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
    example: 'Esempio interattivo',
    replay: 'Rivedi l’esempio',
    try: 'Scegli una domanda del cliente',
    show: 'Provalo con un esempio.',
    serviceIntro: 'Prova l’esempio. Guarda cosa fa il sistema e quando passa la mano a una persona.',
    scenarios: {
      order: { label: 'Ordine e reso' },
      question: { label: 'Una domanda comune', user: 'Dove trovo le condizioni per i resi?', agent: 'Trovi le condizioni per i resi nella sezione assistenza. Posso anche aiutarti a controllare i passaggi per il tuo ordine.', actions: ['informazioni trovate', 'risposta preparata da quelle informazioni', 'nessun ticket necessario'] },
      handover: { label: 'Un caso per il team', user: 'Puoi cambiare l’indirizzo se l’ordine è già partito?', agent: 'Non posso cambiare un ordine già spedito. Ho aperto un ticket per il team con la tua domanda e questa conversazione.', actions: ['richiesta verificata', 'ticket aperto per il team', 'conversazione allegata'] },
    },
    systems: [
      {
        id: 'outbound',
        name: 'Trova nuovi clienti',
        body: 'Per aziende B2B con un’offerta chiara e clienti da €1.000 o più. Troviamo chi compra, inviamo email personali e gestiamo le risposte. Di norma le approva una persona. Il tuo dominio principale resta intatto.',
        points: ['Risposte ordinate per te', 'Di norma approvi tu', 'Call prenotate nel tuo calendario'],
      },
      {
        id: 'support',
        name: 'Assistente clienti',
        body: 'Per team che rispondono ai clienti sul sito e su Instagram. L’assistente usa le tue informazioni, controlla ordini e avvia resi. Al tuo team arriva quello che non può risolvere, con la conversazione allegata.',
        points: ['Risponde ai clienti', 'Controlla ordini e resi', 'Passa la mano con tutto il contesto'],
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
      approved: 'Esempio approvato',
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


// Timed examples pause off screen and keep their finished state. Scroll speed never changes their pace.
// Only opacity and transforms move. Each chip lights (its accent ring fades in) when the matching thing happens in the picture.
// Reduced motion and no-JS show the picture without the chips lit: the accent there would only be decoration.
const lightChip = (tl, chip, at) => tl.fromTo(chip, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' }, at)
  .to(chip.parentElement, { color: '#f4f3ed', duration: 0.25 }, at);

function inboxScene(stage) {
  const q = gsap.utils.selector(stage);
  const chips = q('.pt-lit');
  const words = q('.ib-w');
  gsap.set(q('.ib-row'), { autoAlpha: 0, y: -10 });
  gsap.set(q('.ib-draft, .ib-w'), { autoAlpha: 0 });
  const tl = gsap.timeline({ paused: true });
  // Replies arrive and are classified one at a time.
  q('.ib-row').forEach((row, i) => {
    const tag = row.querySelector('.ib-tag');
    tl.to(row, { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power3.out' }, i * 0.32);
    tl.fromTo(tag, { opacity: 0 }, { opacity: 1, duration: 0.2 }, i * 0.32 + 0.12);
  });
  lightChip(tl, chips[0], 0.3);
  // Stop at the human decision. Approval is a real example control, never an automatic click.
  tl.to(q('.ib-draft'), { autoAlpha: 1, duration: 0.25 }, 0.95)
    .to(words, { autoAlpha: 1, duration: 0.08, stagger: 0.025 }, 1.1);
  return tl;
}

function chatScene(stage) {
  const q = gsap.utils.selector(stage);
  const chips = q('.pt-lit');
  const words = q('.ch-w');
  gsap.set(q('.ch-user, .ch-agent, .ch-w, .ch-act'), { autoAlpha: 0 });
  gsap.set(q('.ch-dot'), { scale: 0 });
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(q('.ch-user'), { y: 8 }, { y: 0, autoAlpha: 1, duration: 0.25, ease: 'power3.out' })
    .to(q('.ch-agent'), { autoAlpha: 1, duration: 0.2 }, '+=0.15')
    .addLabel('reply')
    .to(words, { autoAlpha: 1, duration: 0.08, stagger: 0.025 }, 'reply');
  lightChip(tl, chips[0], 'reply');
  // Each action lands as the reply reaches its clause; the last one is the hand-over
  const span = words.length * 0.025;
  q('.ch-act').forEach((act, i) => {
    const at = `reply+=${span * (0.2 + i * 0.3)}`;
    tl.to(act, { autoAlpha: 1, duration: 0.25 }, at)
      .to(act.querySelector('.ch-dot'), { scale: 1, duration: 0.3, ease: 'back.out(3)' }, at);
    if (i === 0 && stage.dataset.scenario === 'order') lightChip(tl, chips[1], at);
    if (i === 2 && stage.dataset.scenario !== 'question') lightChip(tl, chips[2], at).addLabel('handover', at);
  });
  return tl;
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

const SCENES = { outbound: inboxScene, support: chatScene };

const Panel = ({ title, cls = '', children, example, replay, onReplay, controls }) => (
  <div role="group" aria-label={`${title}: ${example}`} className={`${cls} overflow-hidden rounded-[10px] border border-line bg-surface`}>
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
      <p className="text-sm font-semibold [font-stretch:110%]">{title}</p>
      <span className="text-xs text-faint">{example}</span>
    </div>
    <div className="p-5">{children}</div>
    <div className={`flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3 ${controls ? '' : 'motion-reduce:hidden'}`}>
      {controls}
      <button type="button" onClick={onReplay} className="demo-replay link min-h-11 text-sm text-muted hover:text-fg">{replay}</button>
    </div>
  </div>
);

function Inbox({ t, lang, approved, onApprove, ...panel }) {
  return (
    <Panel title={t.title} cls="ib-panel" {...panel} controls={
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onApprove} disabled={approved} className="ib-approve btn-primary min-h-11 px-3 py-2 text-sm disabled:bg-raised disabled:text-fg disabled:cursor-default">
          {approved ? t.approved : t.approve}
        </button>
        <span role="status" className="sr-only">{approved ? t.sent : ''}</span>
      </div>
    }>
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
      <div className={`ib-draft relative mt-4 rounded-lg border p-4 transition-colors ${approved ? 'border-accent' : 'border-line'}`}>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 text-xs text-faint">
          <p>{approved ? t.sent : t.draft}</p>
          <p>{t.from}</p>
        </div>
        <p className="mt-1.5 text-sm"><Words cls="ib-w" text={t.draftText} /></p>
      </div>
    </Panel>
  );
}

function Chat({ t, ...panel }) {
  return (
    <Panel title={t.title} cls="ch-panel" {...panel}>
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

export default function Systems({ service }) {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);
  const scenes = useRef({});
  const [approved, setApproved] = useState(false);
  const [scenario, setScenario] = useState('order');
  const systems = service ? t.systems.filter((s) => s.id === service) : t.systems;
  const replay = (id) => {
    if (id === 'outbound') setApproved(false);
    scenes.current[id]?.restart();
  };
  const approve = () => {
    scenes.current.outbound?.progress(1).pause();
    setApproved(true);
  };
  const panel = { example: t.example, replay: t.replay };
  const artifacts = {
    outbound: <Inbox t={t.inbox} lang={lang} approved={approved} onApprove={approve} {...panel} onReplay={() => replay('outbound')} />,
    support: <Chat t={{ ...t.chat, ...t.scenarios[scenario] }} {...panel} onReplay={() => replay('support')} />,
  };

  // The sticky index follows the reader: a system is active from when its article reaches mid-screen until the next one does
  // (the last one until the note under them), so it stays active as the article scrolls by. Read live from where things are on screen,
  // so it does not depend on the order ScrollTrigger measures pins in.
  useGSAP((context) => later(context, () => {
    if (service) return;
    const articles = gsap.utils.toArray('[data-system]', root.current);
    const note = root.current.querySelector('[data-note]');
    const items = articles.map((el) => [...root.current.querySelectorAll(`[data-index="${el.dataset.system}"]`)]);
    const icon = root.current.querySelector('.sys-icon');
    const hold = window.matchMedia(HOLD); // the icon only moves under HOLD (see iconScene)
    let shown = -2;
    const update = () => {
      const y = innerHeight * 0.55;
      let on = -1;
      articles.forEach((el, i) => { if (el.getBoundingClientRect().top <= y) on = i; });
      if (note.getBoundingClientRect().top <= y) on = -1;
      icon.classList.toggle('is-active', on !== -1 && hold.matches);
      if (on === shown) return;
      shown = on;
      items.forEach((links, i) => links.forEach((li) => { li.classList.toggle('is-active', i === on); li.querySelector('a').setAttribute('aria-current', i === on ? 'true' : 'false'); }));
      icon.querySelector('path').setAttribute('d', on === 1 ? ICON.bubble : ICON.envelope);
      icon.children[1].style.opacity = on === 1 ? '0' : '1';
    };
    ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top', onUpdate: update, onRefresh: update, onToggle: update });
  }), { scope: root, dependencies: [lang, service], revertOnUpdate: true });

  // The section's top rule draws in and the heading rises (motion allowed only)
  useGSAP((context) => later(context, () => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, () => {
      drawRule(root.current);
      riseOnScroll(root.current.querySelector('.sys-title'));
    });
    return () => mm.revert();
  }), { scope: root, dependencies: [lang, service], revertOnUpdate: true });

  // Illustrations play at the same measured pace on every screen. Nothing pins the page.
  useGSAP((context) => later(context, () => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray('[data-system]', root.current).forEach((article) => {
        const stage = article.querySelector('[data-stage]');
        const tl = SCENES[article.dataset.system](stage);
        scenes.current[article.dataset.system] = tl;
        if (article.dataset.system === 'outbound' && approved) tl.progress(1).pause();
        ScrollTrigger.create({
          trigger: stage, start: 'top 85%', end: 'bottom top',
          onToggle: ({ isActive }) => isActive ? tl.play() : tl.pause(),
        });
      });
      return () => { scenes.current = {}; };
    });
    return () => mm.revert();
  }), { scope: root, dependencies: [lang, service, scenario], revertOnUpdate: true });

  // The "interested" tag of the hero's example run files itself on the first reply here (lib/handover.js). Mouse screens only.
  useGSAP((context) => later(context, () => {
    if (service) return;
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
  }), { scope: root, dependencies: [lang, service], revertOnUpdate: true });

  return (
    <section id="systems" ref={root} className="rule py-16 lg:py-20">
      <div className="page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 key={lang} className="sys-title t-h2">{service ? t.show : t.title}</h2>
            <p className="t-lead mt-5 max-w-[34rem] text-muted">{service ? t.serviceIntro : t.intro}</p>
            {!service && <div className="mt-8 hidden items-center gap-8 lg:flex">
              {/* the list is wider than its longest label in either language, so the icon does not move on a switch */}
              <ul className="grid gap-3 border-l border-line">
                {systems.map((s) => (
                  <li
                    key={s.id}
                    data-index={s.id}
                    className="-ml-px border-l border-transparent pl-5 text-faint transition-colors duration-150 [&.is-active]:border-accent [&.is-active]:text-fg"
                  >
                    <ScrollLink local to={`#system-${s.id}`} className="inline-flex min-h-11 items-center rounded px-1 hover:text-fg focus-visible:outline focus-visible:outline-accent">{s.name}</ScrollLink>
                  </li>
                ))}
              </ul>
              {/* stroke 2/3 of a unit = 1px at 36px */}
              <svg aria-hidden="true" data-motion-only className="sys-icon hidden h-9 w-9 lg:block shrink-0 text-muted opacity-0 transition-opacity duration-300 [&.is-active]:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2 / 3} strokeLinecap="round" strokeLinejoin="round">
                <path d={ICON.envelope} />
                <path d="M3.5 7.5 12 13l8.5-5.5" />
                <path d="M8 10.5h8" opacity="0" />
                <path d="M15 8v8" opacity="0" strokeDasharray="1.5 2" />
              </svg>
            </div>}
          </div>
        </div>

        {!service && <nav aria-label={t.title} className="sticky top-16 z-20 -my-5 grid grid-cols-2 gap-2 border-y border-line bg-canvas py-3 lg:hidden">
          {systems.map((s) => (
            <div key={s.id} data-index={s.id} className="rounded-lg border border-line text-muted transition-colors [&.is-active]:border-accent [&.is-active]:text-fg">
              <ScrollLink local to={`#system-${s.id}`} className="flex min-h-12 items-center justify-center rounded-lg px-3 py-2 text-center text-sm focus-visible:outline focus-visible:outline-accent">{s.name}</ScrollLink>
            </div>
          ))}
        </nav>}
        <div className="grid gap-16 lg:col-span-7 lg:gap-20">
          {systems.map((s) => (
            <article id={`system-${s.id}`} key={s.id} data-system={s.id} className="grid scroll-mt-24 gap-5 lg:scroll-mt-0">
              <div>
                <h3 className="t-h3 text-[1.5rem]">{s.name}</h3>
                <p className="mt-3 text-muted">{s.body}</p>
              </div>
              <div data-stage data-scenario={scenario} className="grid gap-7">
                {s.id === 'support' && <div role="group" aria-label={t.try} className="flex flex-wrap gap-2">{Object.entries(t.scenarios).map(([id, item]) => <button key={id} type="button" aria-pressed={scenario === id} onClick={() => setScenario(id)} className={`example-choice min-h-11 rounded-lg border px-3 py-2 text-sm transition-colors ${scenario === id ? 'border-fg bg-raised text-fg' : 'border-line text-muted hover:border-faint hover:text-fg'}`}>{item.label}</button>)}</div>}
                <ul className="flex flex-wrap gap-2">
                  {s.points.map((p) => (
                    <li key={p} className={`relative rounded-lg border border-line px-3 py-1.5 text-sm text-muted ${s.id === 'outbound' && approved ? '[&:nth-child(n+2)]:border-accent [&:nth-child(n+2)]:text-fg' : ''}`}>
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
