import Link from './SiteLink';
import { useCopy } from '../lib/lang';

const copy = {
  en: {
    title: 'Real work. Results you can read.',
    body: 'Explore the campaigns and support records, with the dates and definitions behind the numbers.',
    all: 'Explore the results',
    cases: [
      { title: 'Sales outreach', figures: [['49', 'meetings booked'], ['155', 'interested prospects']], note: 'Across five past B2B campaigns, on cold email and LinkedIn. Updated 2026-09-23. Past results depend on the offer and market.', action: 'See the campaigns', filter: 'outbound' },
      { title: 'Customer support', figures: [['1,706', 'customer chats, Italian party shop'], ['3,835', 'customer chats, UK clothing brand']], note: 'Website chat and, for the Italian shop, Instagram. April to September 2026. Counted from each agent’s records on 2026-09-30.', action: 'See the support records', filter: 'support' },
    ],
  },
  it: {
    title: 'Lavoro reale. Risultati da leggere.',
    body: 'Esplora campagne e conversazioni di assistenza, con le date e le definizioni dietro ai numeri.',
    all: 'Esplora i risultati',
    cases: [
      { title: 'Nuovi clienti', figures: [['49', 'appuntamenti fissati'], ['155', 'contatti interessati']], note: 'In cinque campagne B2B passate, via email e LinkedIn. Aggiornate al 2026-09-23. I risultati dipendono dall’offerta e dal mercato.', action: 'Guarda le campagne', filter: 'outbound' },
      { title: 'Assistenza clienti', figures: [['1.706', 'chat clienti, negozio di feste italiano'], ['3.835', 'chat clienti, brand di abbigliamento UK']], note: 'Chat del sito e, per il negozio italiano, Instagram. Da aprile a settembre 2026. Conteggio dai registri degli agenti al 2026-09-30.', action: 'Guarda l’assistenza', filter: 'support' },
    ],
  },
};

export default function ProofPreview({ service }) {
  const t = useCopy(copy);
  const cases = service ? t.cases.filter((c) => c.filter === service) : t.cases;
  return (
    <section id="results" className="border-t border-line py-16 sm:py-20">
      <div className="page">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h2 className="t-h2 max-w-[22ch]">{t.title}</h2><p className="mt-4 max-w-[52ch] text-muted">{t.body}</p></div><Link to="/results" className="link self-start md:self-end">{t.all}</Link></div>
        <div className={`mt-10 grid gap-10 ${cases.length > 1 ? 'md:grid-cols-2 md:gap-14' : ''}`}>
          {cases.map((c) => <article key={c.title} className="border-t border-line pt-6"><h3 className="t-h3">{c.title}</h3><dl className="mt-6 grid grid-cols-2 gap-6">{c.figures.map(([n, label]) => <div key={label} className="flex flex-col-reverse"><dt className="mt-3 max-w-[24ch] text-sm text-muted">{label}</dt><dd className="text-4xl font-semibold leading-none tracking-tight [font-stretch:112%]">{n}</dd></div>)}</dl><p className="mt-6 max-w-[58ch] text-xs leading-relaxed text-faint">{c.note}</p><Link to={`/results?view=${c.filter}`} className="link mt-5 inline-block min-h-11 py-2 text-sm">{c.action}</Link></article>)}
        </div>
      </div>
    </section>
  );
}
