import { useSearchParams } from 'react-router-dom';
import PageIntro, { PageClose } from '../components/PageIntro';
import Results from '../components/Results';
import { useCopy } from '../lib/lang';

const copy = {
  en: { title: 'The work, in numbers.', body: 'Real campaigns and support conversations. Names withheld, with the scope, dates and counting notes kept visible.', group: 'Choose results', filters: [['all', 'All results'], ['outbound', 'Sales outreach'], ['support', 'Customer support']] },
  it: { title: 'Il lavoro, in numeri.', body: 'Campagne e conversazioni reali. Nomi riservati, con ambito, date e criteri di conteggio visibili.', group: 'Scegli i risultati', filters: [['all', 'Tutti i risultati'], ['outbound', 'Nuovi clienti'], ['support', 'Assistenza clienti']] },
};

export default function ResultsPage() {
  const t = useCopy(copy);
  const [params, setParams] = useSearchParams();
  const selected = ['outbound', 'support'].includes(params.get('view')) ? params.get('view') : 'all';
  return <>
    <PageIntro title={t.title} body={t.body} />
    <div className="page pb-8"><div role="group" aria-label={t.group} className="flex flex-wrap gap-2">{t.filters.map(([id, name]) => <button key={id} type="button" aria-pressed={selected === id} onClick={() => setParams(id === 'all' ? {} : { view: id })} className={`result-filter min-h-11 rounded-lg border px-4 py-2 text-sm transition-colors ${selected === id ? 'border-fg bg-raised text-fg' : 'border-line text-muted hover:border-faint hover:text-fg'}`}>{name}</button>)}</div></div>
    <Results key={selected} view={selected} />
    <PageClose />
  </>;
}
