import { useRef } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, ScrollTrigger } from '../lib/motion';

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
        ['Giulia, Studio Ferri', 'interessata', 'Mi sembra utile. Ne parliamo la prossima settimana?'],
        ['Tom, Harbour Freight', 'non ora', 'Risentiamoci dopo il primo trimestre.'],
        ['Sara, Nord Logistica', 'persona sbagliata', 'Provate con Luca, il responsabile vendite.'],
      ],
      draft: 'Bozza di risposta, in attesa di approvazione',
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

const Panel = ({ title, children }) => (
  <div aria-hidden="true" className="select-none overflow-hidden rounded-[10px] border border-line bg-surface">
    <p className="border-b border-line px-5 py-3 text-sm font-semibold [font-stretch:110%]">{title}</p>
    <div className="p-5">{children}</div>
  </div>
);

function Inbox({ t }) {
  return (
    <Panel title={t.title}>
      <ul className="grid gap-3">
        {t.rows.map(([who, tag, text], i) => (
          <li key={who} className={`rounded-lg px-3.5 py-3 ${i === 0 ? 'bg-raised' : ''}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium">{who}</span>
              <span className={`rounded-md px-2 py-0.5 font-mono text-[0.72rem] ${i === 0 ? 'bg-accent/15 text-accent' : 'bg-raised text-faint'}`}>{tag}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-lg border border-line p-4">
        <p className="text-xs text-faint">{t.draft}</p>
        <p className="mt-1.5 text-sm">{t.draftText}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-canvas">{t.approve}</span>
          <span className="rounded-md px-3 py-1.5 text-xs font-semibold text-muted ring-1 ring-inset ring-line">{t.edit}</span>
        </div>
      </div>
    </Panel>
  );
}

function Chat({ t }) {
  return (
    <Panel title={t.title}>
      <p className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-raised px-3.5 py-2.5 text-sm text-muted">{t.user}</p>
      <p className="mt-3 max-w-[85%] rounded-lg rounded-bl-sm border border-line px-3.5 py-2.5 text-sm">{t.agent}</p>
      <ul className="mt-4 grid gap-1.5 border-t border-line pt-4">
        {t.actions.map((a) => (
          <li key={a} className="flex items-center gap-2 font-mono text-[0.75rem] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
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
  const artifacts = { outbound: <Inbox t={t.inbox} />, support: <Chat t={t.chat} /> };

  // Highlight the system being read in the sticky index (desktop only, pure class toggles)
  useGSAP(() => {
    gsap.utils.toArray('[data-system]', root.current).forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        toggleClass: { targets: root.current.querySelector(`[data-index="${el.dataset.system}"]`), className: 'is-active' },
      });
    });
  }, { scope: root, dependencies: [lang], revertOnUpdate: true });

  return (
    <section id="systems" ref={root} className="border-t border-line py-24 lg:py-32">
      <div className="page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 className="t-h2">{t.title}</h2>
            <p className="t-lead mt-5 max-w-[34rem] text-muted">{t.intro}</p>
            <ol className="mt-10 hidden gap-3 border-l border-line lg:grid">
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
          </div>
        </div>

        <div className="grid gap-20 lg:col-span-7 lg:gap-28">
          {t.systems.map((s) => (
            <article key={s.id} data-system={s.id} className="grid gap-7">
              <div>
                <h3 className="t-h3 text-[1.5rem]">{s.name}</h3>
                <p className="mt-3 text-muted">{s.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.points.map((p) => (
                    <li key={p} className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted">{p}</li>
                  ))}
                </ul>
              </div>
              {artifacts[s.id]}
            </article>
          ))}
          <p className="-mt-10 text-xs text-faint lg:-mt-16">{t.note}</p>
        </div>
      </div>
    </section>
  );
}
