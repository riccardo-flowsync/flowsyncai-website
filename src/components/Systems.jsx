import { useRef } from 'react';
import ScrollLink from './ScrollLink';
import Results from './Results';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, HOLD, riseOnScroll, drawRule, later } from '../lib/motion';

const copy = {
  en: {
    title: 'Two services. Built and run for you.',
    intro: 'Two separate services for two different needs. AI outreach brings in new business. AI agent handles customer questions. Choose the one your team needs.',
    note: 'Illustrations. Names and messages are invented.',
    systems: [
      {
        id: 'outbound',
        name: 'AI outreach',
        outcome: 'From the right buyers to booked calls.',
        body: 'We find B2B buyers, send personal cold emails and manage replies through to a booked call. You approve replies by default.',
        setup: 'Built to launch quickly. We set up and run it for you, keeping your main email domain untouched.',
        points: ['Replies sorted', 'You approve by default', 'Booking link sent'],
      },
      {
        id: 'support',
        name: 'AI agent',
        outcome: 'Customer questions handled. Time back for your team.',
        body: 'An AI secretary for your website and Instagram. It answers from your information, checks orders and starts returns. Anything it cannot solve becomes a ticket for your team, with the conversation attached.',
        points: ['Answers questions', 'Checks orders and returns', 'Hands over with context'],
      },
    ],
    inbox: {
      title: 'An interested reply becomes a next step',
      rows: [
        ['Giulia, Studio Ferri', 'interested', 'Sounds useful. Can we talk next week?'],
        ['Tom, Harbour Freight', 'not now', 'Back in touch after Q1, please.'],
        ['Sara, Nord Logistica', 'wrong person', 'Try our head of sales, Luca.'],
      ],
      draft: 'Draft reply, waiting for approval',
      sent: 'Reply approved and sent',
      from: 'From anna@yourbrand-mail.com',
      draftText: 'Sounds good, Giulia. Pick a time in my calendar and let’s talk.',
      approve: 'Approve and send',
      edit: 'Edit',
    },
    chat: {
      title: 'A question answered. A return started.',
      user: 'Where is my order 4821? And can I send back the blue one?',
      agent: 'Order 4821 is on its way. I’ve logged the return for the blue one. Our team will email your return label.',
      actions: ['order found: 4821, shipped', 'return logged: 1\u00a0item', 'ticket opened for the team'],
    },
  },
  it: {
    title: 'Due servizi. Costruiti e gestiti per te.',
    intro: 'Due servizi separati per due esigenze diverse. AI outreach trova nuovi clienti. AI agent risponde alle domande dei clienti. Scegli quello che serve al tuo team.',
    note: 'Illustrazioni. Nomi e messaggi sono inventati.',
    systems: [
      {
        id: 'outbound',
        name: 'AI outreach',
        outcome: 'Dai contatti giusti alle call prenotate.',
        body: 'Troviamo potenziali clienti B2B, inviamo email a freddo personali e gestiamo le risposte fino alla prenotazione di una call. Di norma approvi tu le risposte.',
        setup: 'Pensato per partire in fretta. Lo configuriamo e gestiamo noi, senza toccare il tuo dominio email principale.',
        points: ['Risposte ordinate', 'Di norma approvi tu', 'Link di prenotazione inviato'],
      },
      {
        id: 'support',
        name: 'AI agent',
        outcome: 'Risposte ai clienti. Tempo per il tuo team.',
        body: 'Una segreteria AI per il tuo sito e Instagram. Risponde con le tue informazioni, controlla ordini e avvia resi. Quello che non può risolvere diventa un ticket per il tuo team, con la conversazione allegata.',
        points: ['Risponde alle domande', 'Controlla ordini e resi', 'Passa la mano con il contesto'],
      },
    ],
    inbox: {
      title: 'Una risposta interessata diventa un passo avanti',
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
      title: 'Una domanda risolta. Un reso avviato.',
      user: 'Dov’è il mio ordine 4821? E posso restituire quello blu?',
      agent: 'L’ordine 4821 è in viaggio. Ho registrato il reso di quello blu. Il team ti invierà l’etichetta via email.',
      actions: ['ordine trovato: 4821, spedito', 'reso registrato: 1\u00a0articolo', 'ticket aperto per il team'],
    },
  },
};

// Timed examples pause off screen and keep their finished state. Scroll speed never changes their pace.
// Whole messages arrive together, so a visitor can read the result without waiting for simulated typing.
// Reduced motion and no-JS show the picture without the chips lit: the accent there would only be decoration.
const lightChip = (tl, chip, at) => tl.fromTo(chip, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, at)
  .to(chip.parentElement, { color: '#f4f3ed', duration: 0.3 }, at);

function inboxScene(stage) {
  const q = gsap.utils.selector(stage);
  const chips = q('.pt-lit');
  gsap.set(q('.ib-row'), { autoAlpha: 0, y: 6 });
  gsap.set(q('.ib-draft, .ib-btns'), { autoAlpha: 0 });
  const tl = gsap.timeline({ paused: true });
  // Replies arrive and are classified one at a time.
  q('.ib-row').forEach((row, i) => {
    const tag = row.querySelector('.ib-tag');
    tl.to(row, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out' }, i * 0.15);
    tl.fromTo(tag, { opacity: 0 }, { opacity: 1, duration: 0.2 }, i * 0.15 + 0.14);
  });
  lightChip(tl, chips[0], 0.18);
  tl.to(q('.ib-draft'), { autoAlpha: 1, duration: 0.3 }, 0.55)
    .to(q('.ib-btns'), { autoAlpha: 1, duration: 0.2 }, 0.78);
  // Approval remains a distinct step before the booking link is sent.
  tl.addLabel('press', 1.3)
    .to(q('.ib-approve'), { scale: 0.96, duration: 0.14, ease: 'power2.in' }, 'press')
    .to(q('.ib-approve'), { scale: 1, duration: 0.2, ease: 'power2.out' })
    .to(q('.ib-edit'), { opacity: 0.4, duration: 0.2 }, 'press')
    .fromTo(q('.ib-ok'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, 'press+=0.14')
    .to(q('.ib-wait'), { opacity: 0, duration: 0.2 }, 'press+=0.14')
    .fromTo(q('.ib-sent'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 'press+=0.25');
  lightChip(tl, chips[1], 'press');
  lightChip(tl, chips[2], 'press+=0.5');
  return tl;
}

function chatScene(stage) {
  const q = gsap.utils.selector(stage);
  const chips = q('.pt-lit');
  gsap.set(q('.ch-agent, .ch-act'), { autoAlpha: 0 });
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(q('.ch-agent'), { y: 6 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.out' }, 0.25);
  lightChip(tl, chips[0], 0.35);
  q('.ch-act').forEach((act, i) => {
    const at = 0.7 + i * 0.5;
    tl.fromTo(act, { y: 4 }, { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, at);
    if (i === 0) lightChip(tl, chips[1], at);
    if (i === 2) lightChip(tl, chips[2], at);
  });
  return tl;
}

// The line icon beside the index (wide screens with a mouse only): an envelope while the outbound system is on screen, a chat
// bubble as the index moves to support. Elsewhere (touch, reduced motion) it stays hidden: a still
// envelope would be wrong half the time, and the index already says which system is on screen.
// Both outlines are drawn with the same commands (a rounded box, a notch on each side, a tail under the bottom left; the
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
const ICON = { envelope: outline(5, 19, 0, 0), bubble: outline(4, 17, 0, 4) };

const SCENES = { outbound: inboxScene, support: chatScene };

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
              <span key={lang} className={`ib-tag rounded-md border border-line bg-canvas px-2 py-0.5 font-mono text-[0.72rem] ${i === 0 ? 'text-accent' : 'text-muted'}`}>{tag}</span>
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
        <p className="mt-1.5 text-sm">{t.draftText}</p>
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
      <p className="ch-agent mt-3 max-w-[85%] rounded-lg rounded-bl-sm border border-line px-3.5 py-2.5 text-sm">{t.agent}</p>
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

export default function Systems() {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);
  const artifacts = { outbound: <Inbox t={t.inbox} lang={lang} />, support: <Chat t={t.chat} /> };

  // The sticky index follows the reader: a system is active from when its article reaches mid-screen until the next one does
  // (the last one until the note under them), so it stays active as the article scrolls by. Read live from where things are on screen,
  // so direct links and language switches use the same positions as ordinary scrolling.
  useGSAP((context, contextSafe) => later(context, () => {
    const articles = gsap.utils.toArray('[data-system]', root.current);
    const note = root.current.querySelector('[data-note]');
    const items = articles.map((el) => [...root.current.querySelectorAll(`[data-index="${el.dataset.system}"]`)]);
    const icon = root.current.querySelector('.sys-icon');
    const hold = window.matchMedia(HOLD);
    let shown = -2;
    const update = contextSafe(() => {
      const y = innerHeight * 0.55;
      let on = -1;
      articles.forEach((el, i) => { if (el.getBoundingClientRect().top <= y) on = i; });
      if (note.getBoundingClientRect().top <= y) on = -1;
      icon.classList.toggle('is-active', on !== -1 && hold.matches);
      if (on === shown) return;
      const duration = hold.matches && shown >= 0 && on >= 0 ? 0.35 : 0;
      shown = on;
      items.forEach((links, i) => links.forEach((li) => { li.classList.toggle('is-active', i === on); li.querySelector('a').setAttribute('aria-current', i === on ? 'true' : 'false'); }));
      gsap.to(icon.children[0], { attr: { d: on === 1 ? ICON.bubble : ICON.envelope }, duration, ease: 'power2.out', overwrite: true });
      gsap.to(icon.children[1], { opacity: on === 1 ? 0 : 1, duration, overwrite: true });
      gsap.to(icon.children[2], { opacity: on === 1 ? 1 : 0, duration, overwrite: true });
    });
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

  // Illustrations play at the same measured pace on every screen. Nothing pins the page.
  useGSAP((context) => later(context, () => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray('[data-system]', root.current).forEach((article) => {
        const stage = article.querySelector('[data-stage]');
        const tl = SCENES[article.dataset.system](stage);
        ScrollTrigger.create({
          trigger: stage, start: 'top 85%', end: 'bottom top',
          onToggle: ({ isActive }) => isActive ? tl.play() : tl.pause(),
        });
      });
    });
    return () => mm.revert();
  }), { scope: root, dependencies: [lang], revertOnUpdate: true });

  return (
    <section id="systems" ref={root} className="rule py-24 lg:py-32">
      <div className="page grid gap-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-16">
        <div className="grid gap-5 lg:col-span-12 lg:grid-cols-2 lg:items-end lg:gap-16">
          <h2 key={lang} className="sys-title t-h2 max-w-[18ch]">{t.title}</h2>
          <p className="t-lead max-w-[34rem] text-muted">{t.intro}</p>
        </div>
        <div className="hidden lg:col-span-2 lg:block">
          <div className="sticky top-8">
            <div className="flex flex-col items-start gap-6 py-2">
              <ul className="grid gap-3 border-l border-line">
                {t.systems.map((s) => (
                  <li
                    key={s.id}
                    data-index={s.id}
                    className="-ml-px border-l border-transparent pl-3 text-muted transition-colors duration-300 [&.is-active]:border-accent [&.is-active]:text-fg"
                  >
                    <ScrollLink to={`#system-${s.id}`} className="inline-flex min-h-11 items-center rounded px-1 hover:text-fg focus-visible:outline focus-visible:outline-accent">{s.name}</ScrollLink>
                  </li>
                ))}
              </ul>
              {/* stroke 2/3 of a unit = 1px at 36px */}
              <svg aria-hidden="true" data-motion-only className="sys-icon hidden h-9 w-9 lg:block shrink-0 text-muted opacity-0 transition-opacity duration-300 [&.is-active]:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2 / 3} strokeLinecap="round" strokeLinejoin="round">
                <path d={ICON.envelope} />
                <path d="M3.5 7.5 12 13l8.5-5.5" />
                <path d="M8 10.5h8" opacity="0" />
              </svg>
            </div>
          </div>
        </div>

        <nav aria-label={t.title} className="sticky top-0 z-20 -my-5 grid grid-cols-2 gap-2 border-y border-line bg-canvas py-3 lg:hidden">
          {t.systems.map((s) => (
            <div key={s.id} data-index={s.id} className="rounded-lg border border-line text-muted transition-colors [&.is-active]:border-accent [&.is-active]:text-fg">
              <ScrollLink to={`#system-${s.id}`} className="flex min-h-12 items-center justify-center rounded-lg px-3 py-2 text-center text-sm focus-visible:outline focus-visible:outline-accent">{s.name}</ScrollLink>
            </div>
          ))}
        </nav>
        <div className="grid gap-20 lg:col-span-10 lg:gap-28">
          {t.systems.map((s) => (
            <article id={`system-${s.id}`} key={s.id} data-system={s.id} className="scroll-mt-24 border-t border-faint/40 pt-12 first:border-t-0 first:pt-0 lg:scroll-mt-0">
              <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                  <h3 className="t-h2">{s.name}</h3>
                  <p className="mt-3 text-lg font-medium leading-snug text-fg">{s.outcome}</p>
                  <p className="mt-3 text-muted">{s.body}</p>
                  {s.setup && <p className="mt-3 text-sm text-muted">{s.setup}</p>}
                </div>
                <div data-stage className="grid gap-7">
                  <ul className="flex flex-wrap gap-2">
                    {s.points.map((p) => (
                      <li key={p} className="relative rounded-lg border border-line bg-raised px-3 py-1.5 text-sm text-fg">
                        {p}
                        <span aria-hidden="true" data-motion-only className="pt-lit pointer-events-none absolute -inset-px rounded-lg border border-accent opacity-0" />
                      </li>
                    ))}
                  </ul>
                  {artifacts[s.id]}
                </div>
              </div>
              <Results service={s.id} />
            </article>
          ))}
          <p data-note className="-mt-10 text-xs text-faint lg:-mt-16">{t.note}</p>
        </div>
      </div>
    </section>
  );
}
