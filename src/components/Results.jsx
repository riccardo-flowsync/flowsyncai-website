import { useRef } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, MOTION_OK } from '../lib/motion';

// Source: the outbound case studies, updated 2026-09-23. Interested and meetings add up to the totals.
const ROWS = [
  { rate: 16.4, interested: 76, meetings: 12 },
  { rate: 12.6, interested: 14, meetings: null },
  { rate: 11, interested: 65, meetings: 16 },
  { rate: 22, interested: null, meetings: 10 },
  { rate: 41, interested: null, meetings: 11 },
];
const CHARTS = [[5.1, 3.4, 2.2, 0.45], [22, 3.5], [41, 28.5]]; // last value = market average

const copy = {
  en: {
    title: 'The results, campaign by campaign.',
    intro: 'Five real B2B campaigns on cold email and LinkedIn, in the UK, Europe and the UAE. Names withheld.',
    totals: [
      [49, '', 'meetings booked'],
      [155, '', 'interested prospects'],
      [11, '×', 'the average cold email reply rate, in our best campaign'],
    ],
    head: ['Campaign', 'Result', 'Interested', 'Meetings'],
    total: 'Total',
    none: 'not reported',
    rows: [
      ['AI automation agency', 'Done-for-you outbound, sold cold to agencies and B2B companies', 'Cold email, UK, Europe and UAE, 2026', 'reply rate'],
      ['Tech company', 'AI automation, sold to business owners', 'Cold email, Europe, July to September 2025', 'reply rate'],
      ['Lead gen agency', 'Done-for-you lead generation, sold cold to agencies', 'Cold email, Europe, since July 2026', 'reply rate'],
      ['Cybersecurity consultancy', 'NIS2 compliance consulting, sent in the client’s name', 'Cold email, Europe, 3\u00a0months', 'of replies became meetings'],
      ['Contact-centre software', 'Sold to IT, operations and customer care leaders', 'LinkedIn, Europe, 6\u00a0weeks in spring 2026', 'of connection requests accepted'],
    ],
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
  },
  it: {
    title: 'I risultati, campagna per campagna.',
    intro: 'Cinque campagne B2B reali, via email a freddo e LinkedIn, tra Regno Unito, Europa ed Emirati. Nomi riservati.',
    totals: [
      [49, '', 'appuntamenti fissati'],
      [155, '', 'contatti interessati'],
      [11, '×', 'il tasso medio di risposta alle email a freddo, nella campagna migliore'],
    ],
    head: ['Campagna', 'Risultato', 'Interessati', 'Appuntamenti'],
    total: 'Totale',
    none: 'non rilevato',
    rows: [
      ['Agenzia di automazione AI', 'Outbound chiavi in mano, venduto a freddo ad agenzie e aziende B2B', 'Email a freddo, Regno Unito, Europa ed Emirati, 2026', 'tasso di risposta'],
      ['Azienda tech', 'Automazioni AI, vendute a titolari d’azienda', 'Email a freddo, Europa, da luglio a settembre 2025', 'tasso di risposta'],
      ['Agenzia di lead generation', 'Lead generation chiavi in mano, venduta a freddo ad agenzie', 'Email a freddo, Europa, da luglio 2026', 'tasso di risposta'],
      ['Consulenza di cybersecurity', 'Consulenza per la conformità NIS2, inviata a nome del cliente', 'Email a freddo, Europa, 3\u00a0mesi', 'delle risposte diventate appuntamenti'],
      ['Software per contact center', 'Venduto a responsabili IT, operations e customer care', 'LinkedIn, Europa, 6\u00a0settimane in primavera 2026', 'delle richieste di collegamento accettate'],
    ],
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
  },
};

function Figure({ value, none }) {
  if (value !== null) return value;
  return (
    <>
      <span aria-hidden="true" className="text-faint">–</span>
      <span className="sr-only">{none}</span>
    </>
  );
}

export default function Results() {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);
  const pct = (v) => `${new Intl.NumberFormat(lang === 'it' ? 'it-IT' : 'en-GB', { maximumFractionDigits: 2 }).format(v)}%`;

  // Totals count up and bars grow, once, as they come into view. Counters show their real value until then.
  useGSAP(() => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, () => {
      // Tween a plain number, not the text itself: reverting a text tween would leave "0" on screen
      const counters = gsap.utils.toArray('.res-count');
      counters.forEach((el) => {
        const n = { v: 0 };
        gsap.to(n, {
          v: Number(el.dataset.value),
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(n.v); },
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });
      gsap.utils.toArray('.res-chart').forEach((chart) => {
        gsap.from(chart.querySelectorAll('.res-bar'), {
          scaleX: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: chart, start: 'top 80%', once: true },
        });
      });
      return () => counters.forEach((el) => { el.textContent = el.dataset.value; });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [lang], revertOnUpdate: true });

  return (
    <section id="results" ref={root} className="border-t border-line py-24 lg:py-32">
      <div className="page">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
          <h2 className="t-h2 lg:col-span-7">{t.title}</h2>
          <p className="t-lead text-muted lg:col-span-5">{t.intro}</p>
        </div>

        <dl className="mt-14 grid border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-line">
          {t.totals.map(([n, unit, label]) => (
            <div key={label} className="flex flex-col-reverse justify-end gap-2 border-line py-7 [&:not(:first-child)]:border-t sm:px-8 sm:first:pl-0 sm:[&:not(:first-child)]:border-t-0">
              <dt className="max-w-[24ch] text-sm text-muted">{label}</dt>
              <dd className="text-[clamp(2.75rem,2rem+2.6vw,4.25rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums [font-stretch:112%]">
                <span className="res-count" data-value={n}>{n}</span>{unit}
              </dd>
            </div>
          ))}
        </dl>

        {/* Ledger: a table from sm up, a list on phones (the columns do not fit at 320px) */}
        <table className="mt-14 hidden w-full text-left sm:table">
          <thead className="text-sm text-faint">
            <tr className="border-b border-line">
              <th scope="col" className="pb-3 font-normal">{t.head[0]}</th>
              <th scope="col" className="pb-3 pl-6 font-normal">{t.head[1]}</th>
              <th scope="col" className="pb-3 pl-6 text-right font-normal">{t.head[2]}</th>
              <th scope="col" className="pb-3 pl-6 text-right font-normal">{t.head[3]}</th>
            </tr>
          </thead>
          <tbody>
            {t.rows.map(([name, what, where, rateLabel], i) => (
              <tr key={name} className="border-b border-line align-top">
                <th scope="row" className="py-5 pr-4 font-normal">
                  <span className="font-medium">{name}</span>
                  <span className="mt-1 block text-sm text-muted">{what}</span>
                  <span className="block text-sm text-faint">{where}</span>
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
              <td className="pt-4 text-right text-lg font-semibold tabular-nums">155</td>
              <td className="pt-4 text-right text-lg font-semibold tabular-nums">49</td>
            </tr>
          </tfoot>
        </table>

        <ul className="mt-12 grid border-t border-line sm:hidden">
          {t.rows.map(([name, what, where, rateLabel], i) => (
            <li key={name} className="border-b border-line py-5">
              <p className="font-medium">{name}</p>
              <p className="mt-1 text-sm text-muted">{what}</p>
              <p className="text-sm text-faint">{where}</p>
              <p className="mt-3 text-sm text-muted"><span className="mr-1.5 text-base font-semibold text-fg tabular-nums">{pct(ROWS[i].rate)}</span>{rateLabel}</p>
              <p className="mt-1 flex flex-wrap gap-x-5 text-sm text-muted">
                {ROWS[i].interested !== null && <span><span className="font-semibold text-fg tabular-nums">{ROWS[i].interested}</span> {t.head[2].toLowerCase()}</span>}
                {ROWS[i].meetings !== null && <span><span className="font-semibold text-fg tabular-nums">{ROWS[i].meetings}</span> {t.head[3].toLowerCase()}</span>}
              </p>
            </li>
          ))}
        </ul>

        <h3 className="t-h3 mt-20">{t.market}</h3>
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
                          <span className={isMarket ? 'text-faint' : 'text-muted'}>{c.bars[i]}</span>
                          <span className={`tabular-nums ${isMarket ? 'text-faint' : 'font-medium'}`}>{pct(v)}</span>
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
                <p className="mt-auto border-t border-line pt-4 text-xs leading-relaxed text-faint">{c.source}</p>
              </figure>
            );
          })}
        </div>

        <p className="mt-8 max-w-[80ch] text-xs leading-relaxed text-faint">{t.note}</p>
      </div>
    </section>
  );
}
