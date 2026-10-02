import { useRef } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, MOTION_OK, later } from '../lib/motion';

// Source: the outbound case studies, updated 2026-09-23. Interested and meetings add up to the totals.
const ROWS = [
  { rate: 16.4, interested: 76, meetings: 12 },
  { rate: 12.6, interested: 14, meetings: null },
  { rate: 11, interested: 65, meetings: 16 },
  { rate: 22, interested: null, meetings: 10 },
  { rate: 41, interested: null, meetings: 11 },
];
// A ledger row draws its own bottom rule as it crosses the screen (same length for every row: the rates are different metrics)
const ROW_RULE = 'relative after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-line after:[transform:scaleX(var(--row,1))]';
const CHARTS = [[5.1, 3.4, 2.2, 0.45], [22, 3.5], [41, 28.5]]; // last value = market average

// Source: each support agent's own chat records, counted 2026-09-30, old and new version of the agent together. Chats = at least
// one customer message, test chats left out. split = share of chats [closed with no ticket, done by the agent then the team told
// by ticket, handed to the team], in %. hours = estimate: chats with no ticket x 8 min 25 s (LiveChat 2024 average chat length), per month.
// Party shop: 1,706 chats 2026-04-01 to 09-28, 1,569 with no ticket, 137 handed over (its agent cannot act on orders).
// UK brand: 3,835 chats 2026-04-01 to 09-30 (old agent 3,000 to 09-23, new agent 835 from 09-22), 1,809 with no ticket, 1,324 with
// a ticket plus a return, exchange or sheet entry made by the agent, 702 handed over. 1,809 x 8 min 25 s = 254 h over 183 days.
// Its test chats: no country recorded (from 2026-05-01 on, when the country starts being recorded) or from Italy (our own tests).
const SUPPORT = [
  { chats: 1706, hours: 37, split: [92, 0, 8] },
  { chats: 3835, hours: 42, split: [47, 35, 18] },
];
const SPLIT_COLORS = ['bg-accent', 'bg-accent/50', 'bg-faint/60'];

const copy = {
  en: {
    outreach: 'AI outreach results',
    campaigns: 'Five past B2B campaigns on cold email and LinkedIn, in the UK, Europe and the UAE. Names withheld.',
    totals: [
      [49, '', 'meetings booked'],
      [155, '', 'interested prospects'],
      [11, '×', 'the average cold email reply rate, in our best campaign'],
    ],
    head: ['Campaign', 'Result', 'Interested', 'Meetings'],
    total: 'Total',
    none: 'not reported',
    rows: [
      ['AI automation agency', 'Done-for-you outbound, sold cold to agencies and B2B companies', 'Cold email, UK, Europe and UAE, 2026', 'platform reply rate'],
      ['Tech company', 'AI automation, sold to business owners', 'Cold email, Europe, July to September 2025', 'platform reply rate'],
      ['Lead gen agency', 'Done-for-you lead generation, sold cold to agencies', 'Cold email, Europe, since July 2026', 'platform reply rate'],
      ['Cybersecurity consultancy', 'NIS2 compliance consulting, sent in the client’s name', 'Cold email, Europe, 3\u00a0months', 'of replies became meetings'],
      ['Contact-centre software', 'Sold to IT, operations and customer care leaders', 'LinkedIn, Europe, 6\u00a0weeks in spring 2026', 'of connection requests accepted'],
    ],
    details: 'Campaign details',
    method: 'How we counted',
    market: 'Against the market',
    charts: [
      {
        title: 'Real replies per email sent',
        source: 'Automatic replies removed. Market average: Belkins 2026, 7.5\u00a0million B2B cold emails.',
        bars: ['AI automation agency', 'Lead gen agency', 'Tech company', 'Market average'],
        multiple: ['11×', 'the market average, at best'],
      },
      {
        title: 'Replies that became a meeting',
        source: 'Market average: Belkins 2026.',
        bars: ['Cybersecurity consultancy', 'Market average'],
        multiple: ['6×', 'the market average'],
      },
      {
        title: 'LinkedIn connection requests accepted',
        source: 'Market average: Expandi 2026, 13.2\u00a0million requests.',
        bars: ['Contact-centre software', 'Market average'],
        multiple: ['1.4×', 'the market average'],
      },
    ],
    note: 'Past results: yours depend on your offer and your market. Reply rates as reported by the sending platform for each campaign’s period. Interested means the person replied asking for details, a price or a call. Updated 23 September 2026.',
    support: {
      title: 'AI agent results',
      intro: 'Two online shops. Each agent answers on its own and passes unresolved cases to the team as a ticket. Names withheld.',
      capabilities: 'What the agent handles',
      chats: 'customer chats',
      upTo: 'up to',
      hours: 'hours of staff time saved a month (estimate)',
      split: ['Closed with no ticket', 'Done by the agent, team told by ticket', 'Handed to the team by ticket'],
      cases: [
        {
          name: 'Party-supplies shop, Italy',
          scope: 'Website chat and Instagram, April to September 2026',
          does: ['Finds products among 16,178', 'Plans a party, with quantities', 'Answers shipping, payment and returns questions', 'Opens a ticket for the team', 'Signs customers up with an emailed code'],
        },
        {
          name: 'Outdoor clothing brand, UK',
          scope: 'Website chat in English, customers in the UK and US, April to September 2026',
          does: ['Starts returns and exchanges', 'Recommends a size', 'Finds an order, checks a refund', 'Suggests products, checks stock', 'Hands over to the team with a ticket'],
        },
      ],
      note: 'Customer chats have at least one message from the customer, counted from each agent’s own chat records on 30 September 2026. Time saved is an estimate, not a measurement: chats closed with no ticket × 8\u00a0min 25\u00a0s, the average length of a support chat in LiveChat’s 2024 customer service report (1.7\u00a0billion chats). Staff often handle 2 or 3 chats at once, so read it as a maximum.',
    },
  },
  it: {
    outreach: 'Risultati di AI outreach',
    campaigns: 'Cinque campagne B2B passate, via email a freddo e LinkedIn, tra Regno Unito, Europa ed Emirati. Nomi riservati.',
    totals: [
      [49, '', 'appuntamenti fissati'],
      [155, '', 'contatti interessati'],
      [11, '×', 'il tasso medio di risposta alle email a freddo, nella campagna migliore'],
    ],
    head: ['Campagna', 'Risultato', 'Interessati', 'Appuntamenti'],
    total: 'Totale',
    none: 'non rilevato',
    rows: [
      ['Agenzia di automazione AI', 'Outbound chiavi in mano, venduto a freddo ad agenzie e aziende B2B', 'Email a freddo, Regno Unito, Europa ed Emirati, 2026', 'risposte sulla piattaforma'],
      ['Azienda tech', 'Automazioni AI, vendute a titolari d’azienda', 'Email a freddo, Europa, da luglio a settembre 2025', 'risposte sulla piattaforma'],
      ['Agenzia di lead generation', 'Lead generation chiavi in mano, venduta a freddo ad agenzie', 'Email a freddo, Europa, da luglio 2026', 'risposte sulla piattaforma'],
      ['Consulenza di cybersecurity', 'Consulenza per la conformità NIS2, inviata a nome del cliente', 'Email a freddo, Europa, 3\u00a0mesi', 'delle risposte diventate appuntamenti'],
      ['Software per contact center', 'Venduto a responsabili IT, operations e customer care', 'LinkedIn, Europa, 6\u00a0settimane in primavera 2026', 'delle richieste di collegamento accettate'],
    ],
    details: 'Dettagli delle campagne',
    method: 'Come li abbiamo contati',
    market: 'Rispetto al mercato',
    charts: [
      {
        title: 'Risposte vere per email inviata',
        source: 'Risposte automatiche escluse. Media di mercato: Belkins 2026, 7,5\u00a0milioni di email B2B a freddo.',
        bars: ['Agenzia di automazione AI', 'Agenzia di lead generation', 'Azienda tech', 'Media di mercato'],
        multiple: ['11×', 'la media di mercato, nel caso migliore'],
      },
      {
        title: 'Risposte diventate appuntamenti',
        source: 'Media di mercato: Belkins 2026.',
        bars: ['Consulenza di cybersecurity', 'Media di mercato'],
        multiple: ['6×', 'la media di mercato'],
      },
      {
        title: 'Richieste di collegamento LinkedIn accettate',
        source: 'Media di mercato: Expandi 2026, 13,2\u00a0milioni di richieste.',
        bars: ['Software per contact center', 'Media di mercato'],
        multiple: ['1,4×', 'la media di mercato'],
      },
    ],
    note: 'Risultati passati: i tuoi dipendono dalla tua offerta e dal tuo mercato. Tassi di risposta come riportati dalla piattaforma di invio per il periodo di ciascuna campagna. Interessato significa che la persona ha risposto chiedendo dettagli, un prezzo o una call. Aggiornato il 23 settembre 2026.',
    support: {
      title: 'Risultati di AI agent',
      intro: 'Due negozi online. Ogni agente risponde da solo e passa i casi irrisolti al team con un ticket. Nomi riservati.',
      capabilities: 'Di cosa si occupa l’agente',
      chats: 'chat dei clienti',
      upTo: 'fino a',
      hours: 'ore di lavoro risparmiate al mese (stima)',
      split: ['Chiuse senza ticket', 'Fatte dall’agente, team avvisato con un ticket', 'Passate al team con un ticket'],
      cases: [
        {
          name: 'Negozio di articoli per feste, Italia',
          scope: 'Chat del sito e Instagram, da aprile a settembre 2026',
          does: ['Trova prodotti tra 16.178', 'Organizza una festa, con le quantità', 'Risponde su spedizioni, pagamenti e resi', 'Apre un ticket per il team', 'Iscrive i clienti con un codice via email'],
        },
        {
          name: 'Marchio di abbigliamento outdoor, Regno Unito',
          scope: 'Chat del sito in inglese, clienti in Regno Unito e Stati Uniti, da aprile a settembre 2026',
          does: ['Avvia resi e cambi', 'Consiglia la taglia', 'Trova un ordine, controlla un rimborso', 'Suggerisce prodotti, controlla le scorte', 'Passa la mano al team con un ticket'],
        },
      ],
      note: 'Contiamo le chat con almeno un messaggio del cliente, dai registri di ogni agente, il 30 settembre 2026. Il tempo risparmiato è una stima, non una misura: chat chiuse senza ticket × 8\u00a0min 25\u00a0s, la durata media di una chat di assistenza nel report 2024 di LiveChat (1,7\u00a0miliardi di chat). Spesso chi fa assistenza segue 2 o 3 chat alla volta: leggila come un massimo.',
    },
  },
};

function Figure({ value, none }) {
  if (value !== null) return value;
  return (
    <>
      <span aria-hidden="true" className="text-muted">–</span>
      <span className="sr-only">{none}</span>
    </>
  );
}

function DisclosureSummary({ children }) {
  return (
    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-2 focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-4 [&::-webkit-details-marker]:hidden">
      {children}
      <span aria-hidden="true" className="relative h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-open:rotate-45">
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-muted transition-colors group-hover:bg-accent" />
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-muted transition-colors group-hover:bg-accent" />
      </span>
    </summary>
  );
}

export default function Results({ service }) {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);
  const outbound = service === 'outbound';
  const id = outbound ? 'results' : 'results-support';
  const locale = lang === 'it' ? 'it-IT' : 'en-GB';
  const pf = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const nf = new Intl.NumberFormat(locale, { useGrouping: 'always' }); // Italian leaves 4-digit numbers ungrouped by default
  const pct = (v) => `${pf.format(v)}%`;
  const num = (v) => nf.format(v);

  // Real figures stay printed. Only supporting bars animate, at a fixed pace.
  useGSAP((context) => later(context, () => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray('.res-chart', root.current).forEach((chart) => {
        const bars = chart.querySelectorAll('.res-bar');
        gsap.timeline({ scrollTrigger: { trigger: chart, start: 'top 88%', once: true } })
          .from(bars[bars.length - 1], { scaleX: 0, duration: 0.4, ease: 'power2.out' })
          .from([...bars].slice(0, -1), { scaleX: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, 0.3);
      });
      gsap.utils.toArray('.sup-card', root.current).forEach((card) => {
        gsap.from(card.querySelector('.sup-bar'), {
          scaleX: 0, transformOrigin: 'left center', duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        });
      });
    });
    return () => mm.revert();
  }), { scope: root, dependencies: [lang, service], revertOnUpdate: true });

  return (
    <section id={id} data-results={service} aria-labelledby={`${id}-heading`} ref={root} className="relative mt-10 scroll-mt-24 border-t border-line pt-8 text-fg lg:scroll-mt-0">
      <h4 id={`${id}-heading`} className="reading-surface t-h3 w-fit font-semibold">{outbound ? t.outreach : t.support.title}</h4>
      {outbound ? <>
        <p className="reading-surface mt-3 max-w-[70ch] text-sm text-muted">{t.campaigns}</p>
        <dl className="res-totals mt-6 grid border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-line">
          {t.totals.map(([n, unit, label]) => (
            <div key={label} className="reading-surface flex flex-col-reverse justify-end gap-2 border-line py-7 [&:not(:first-child)]:border-t sm:px-8 sm:first:pl-0 sm:[&:not(:first-child)]:border-t-0">
              <dt className="max-w-[24ch] text-sm text-muted">{label}</dt>
              <dd className="text-[clamp(2.75rem,2rem+2.6vw,4.25rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums [font-stretch:112%]">
                {n}{unit}
              </dd>
            </div>
          ))}
        </dl>

        <h5 className="reading-surface mt-8 w-fit text-lg font-medium">{t.market}</h5>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {t.charts.map((c, ci) => {
            const values = CHARTS[ci];
            const max = Math.max(...values);
            return (
              <figure key={c.title} className="res-chart flex flex-col rounded-[10px] border border-line bg-surface p-6">
                <figcaption className="font-medium">{c.title}</figcaption>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-[2rem] font-semibold leading-none tabular-nums [font-stretch:112%]">{c.multiple[0]}</span>
                  <span className="text-sm text-muted">{c.multiple[1]}</span>
                </p>
                <ul className="mb-8 mt-6 grid gap-3.5">
                  {values.map((v, i) => {
                    const isMarket = i === values.length - 1;
                    return (
                      <li key={c.bars[i]}>
                        <div className="flex items-baseline justify-between gap-3 text-sm">
                          <span className="text-muted">{c.bars[i]}</span>
                          <span className={`tabular-nums ${isMarket ? 'text-muted' : 'font-medium'}`}>{pct(v)}</span>
                        </div>
                        <div aria-hidden="true" className="mt-1.5 h-1.5 rounded-full bg-raised">
                          <div
                            className={`res-bar h-full origin-left rounded-full ${isMarket ? 'bg-faint/60' : i === 0 ? 'bg-accent' : 'bg-accent/50'}`}
                            style={{ width: `${(v / max) * 100}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-auto border-t border-line pt-4 text-xs leading-relaxed text-muted">{c.source}</p>
              </figure>
            );
          })}
        </div>

        <details className="group mt-8 rounded-lg border border-line bg-surface px-5 py-3">
          <DisclosureSummary><span className="font-medium">{t.details}</span></DisclosureSummary>
        {/* Ledger: a table from sm up, a list on phones (the columns do not fit at 320px) */}
        <table className="mt-6 hidden w-full text-left sm:table">
          <thead className="text-sm text-muted">
            <tr className="border-b border-line">
              <th scope="col" className="pb-3 font-normal">{t.head[0]}</th>
              <th scope="col" className="pb-3 pl-6 font-normal">{t.head[1]}</th>
              <th scope="col" className="pb-3 pl-6 text-right font-normal">{t.head[2]}</th>
              <th scope="col" className="pb-3 pl-6 text-right font-normal">{t.head[3]}</th>
            </tr>
          </thead>
          <tbody>
            {t.rows.map(([name, what, where, rateLabel], i) => (
              <tr key={name} className={`res-tr ${ROW_RULE} align-top`}>
                <th scope="row" className="py-5 pr-4 font-normal">
                  <span className="font-medium">{name}</span>
                  <span className="mt-1 block text-sm text-muted">{what}</span>
                  <span className="block text-sm text-muted">{where}</span>
                </th>
                <td className="py-5 pl-6">
                  <span className="text-lg font-semibold tabular-nums">{pct(ROWS[i].rate)}</span>
                  <span className="block max-w-[18ch] text-sm text-muted">{rateLabel}</span>
                </td>
                <td className="py-5 pl-6 text-right text-lg tabular-nums"><Figure value={ROWS[i].interested} none={t.none} /></td>
                <td className="py-5 pl-6 text-right text-lg tabular-nums"><Figure value={ROWS[i].meetings} none={t.none} /></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={2} className="pt-4 text-left font-medium">{t.total}</th>
              <td className="pt-4 text-right text-lg font-semibold tabular-nums"><span data-value="155" data-sum="interested">155</span></td>
              <td className="pt-4 text-right text-lg font-semibold tabular-nums"><span data-value="49" data-sum="meetings">49</span></td>
            </tr>
          </tfoot>
        </table>

        <ul className="mt-6 grid border-t border-line sm:hidden">
          {t.rows.map(([name, what, where, rateLabel], i) => (
            <li key={name} className={`res-li ${ROW_RULE} py-5`}>
              <p className="font-medium">{name}</p>
              <p className="mt-1 text-sm text-muted">{what}</p>
              <p className="text-sm text-muted">{where}</p>
              <p className="mt-3 text-sm text-muted"><span className="mr-1.5 text-base font-semibold text-fg tabular-nums">{pct(ROWS[i].rate)}</span>{rateLabel}</p>
              <p className="mt-1 flex flex-wrap gap-x-5 text-sm text-muted">
                {ROWS[i].interested !== null && <span><span className="font-semibold text-fg tabular-nums">{ROWS[i].interested}</span> {t.head[2].toLowerCase()}</span>}
                {ROWS[i].meetings !== null && <span><span className="font-semibold text-fg tabular-nums">{ROWS[i].meetings}</span> {t.head[3].toLowerCase()}</span>}
              </p>
            </li>
          ))}
        </ul>

          <p className="mt-6 max-w-[80ch] text-xs leading-relaxed text-muted">{t.note}</p>
        </details>

      </> : <>
        <p className="reading-surface mt-3 max-w-[40rem] text-muted">{t.support.intro}</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-y-0">
          {t.support.cases.map((c, ci) => {
            const s = SUPPORT[ci];
            return (
              <article key={c.name} className="sup-card flex flex-col rounded-[10px] border border-line bg-surface p-6 lg:row-span-6 lg:grid lg:grid-rows-subgrid">
                <h5 className="font-medium">{c.name}</h5>
                <p className="mt-1 text-sm text-muted">{c.scope}</p>
                <dl className="mt-6 grid grid-cols-2 gap-6">
                  <div className="flex flex-col-reverse justify-end gap-2">
                    <dt className="text-sm text-muted">{t.support.chats}</dt>
                    <dd className="text-[2rem] font-semibold leading-none tabular-nums [font-stretch:112%]">
                      <span className="res-count" data-value={s.chats}>{num(s.chats)}</span>
                    </dd>
                  </div>
                  <div className="flex flex-col-reverse justify-end gap-2">
                    <dt className="text-sm text-muted">{t.support.hours}</dt>
                    <dd className="text-[2rem] font-semibold leading-none tabular-nums [font-stretch:112%]">
                      <span className="mr-1.5 text-sm font-normal text-muted [font-stretch:100%]">{t.support.upTo}</span>
                      {num(s.hours)}
                    </dd>
                  </div>
                </dl>
                <div aria-hidden="true" className="mt-7 h-1.5 overflow-hidden rounded-full bg-raised">
                  <div className="sup-bar flex h-full">
                    {s.split.map((v, i) => v > 0 && <div key={i} className={SPLIT_COLORS[i]} style={{ width: `${v}%` }} />)}
                  </div>
                </div>
                <ul className="mt-4 grid gap-2 text-sm">
                  {s.split.map((v, i) => v > 0 && (
                    <li key={i} className="flex items-baseline justify-between gap-3">
                      <span className="flex items-baseline gap-2.5 text-muted">
                        <span aria-hidden="true" className={`inline-block h-2 w-2 shrink-0 rounded-sm ${SPLIT_COLORS[i]}`} />
                        {t.support.split[i]}
                      </span>
                      <span className="font-medium tabular-nums">{pct(v)}</span>
                    </li>
                  ))}
                </ul>
                <details className="group mt-6 border-t border-line pt-2 text-sm text-muted">
                  <DisclosureSummary>{t.support.capabilities}</DisclosureSummary>
                  <ul className="mt-3 grid list-disc gap-1.5 pl-4">
                    {c.does.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                </details>
              </article>
            );
          })}
        </div>
        <details className="reading-surface group mt-6 text-sm text-muted"><DisclosureSummary>{t.method}</DisclosureSummary><p className="mt-3 max-w-[80ch] text-xs leading-relaxed text-muted">{t.support.note}</p></details>
      </>}
    </section>
  );
}
