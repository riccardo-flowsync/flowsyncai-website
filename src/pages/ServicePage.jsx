import PageIntro, { PageClose } from '../components/PageIntro';
import CinematicStory from '../components/CinematicStory';
import Results from '../components/Results';
import Systems from '../components/Systems';
import FAQ from '../components/FAQ';
import Link from '../components/SiteLink';
import { useCopy } from '../lib/lang';

const copy = {
  en: {
    outbound: {
      title: 'AI outreach for the right buyers.',
      intro: 'Personal cold email for B2B teams, with replies prepared for your review by default.',
      setup: 'Built around your sales process.',
      details: ['Your offer and the buyers you want to reach', 'People and companies to exclude', 'Your reply rules and booking link'],
      method: 'See how we work',
    },
    support: {
      title: 'AI agents that work inside your tools.',
      intro: 'Agents configured for customer support or repeatable office work, within the tools and permissions you choose.',
      setup: 'A defined role, with agreed access.',
      setupBody: 'An agent can handle agreed secretary or office tasks through the tools and permissions set for that role.',
      details: ['The information the role needs', 'The tools and actions agreed for that role', 'The cases or decisions to hand over to your team'],
      method: 'See how we work',
    },
  },
  it: {
    outbound: {
      title: 'AI outreach per trovare i clienti giusti.',
      intro: 'Email a freddo personali per aziende B2B, con risposte preparate per la tua revisione, di norma.',
      setup: 'Costruito sul tuo processo di vendita.',
      details: ['La tua offerta e i clienti che vuoi raggiungere', 'Persone e aziende da escludere', 'Le regole per le risposte e il link per prenotare'],
      method: 'Scopri come lavoriamo',
    },
    support: {
      title: 'Agenti AI che lavorano nei tuoi strumenti.',
      intro: 'Agenti configurati per l’assistenza clienti o le attività d’ufficio ripetitive, con gli strumenti e i permessi che scegli.',
      setup: 'Un ruolo definito, con accessi concordati.',
      setupBody: 'Un agente può svolgere attività concordate da segreteria o d’ufficio, usando gli strumenti e i permessi previsti per quel ruolo.',
      details: ['Le informazioni necessarie per il ruolo', 'Gli strumenti e le azioni concordati per quel ruolo', 'I casi o le decisioni da passare al tuo team'],
      method: 'Scopri come lavoriamo',
    },
  },
};

export default function ServicePage({ service }) {
  const all = useCopy(copy);
  const t = all[service];
  return <>
    <PageIntro title={t.title} body={t.intro} />
    <CinematicStory service={service} detail />
    <div className="story-interaction"><Systems service={service} /></div>
    <Results view={service} />
    <section className="page grid gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-20">
      <h2 className="t-h2 max-w-[20ch]">{t.setup}</h2>
      <div>
        {t.setupBody && <p className="mb-5 max-w-[52ch] text-muted">{t.setupBody}</p>}
        <ul className="grid border-t border-line">
          {t.details.map((item) => <li key={item} className="border-b border-line py-4 text-muted">{item}</li>)}
        </ul>
        <Link to="/#process" className="link mt-5 inline-block min-h-11 py-2">{t.method}</Link>
      </div>
    </section>
    <FAQ kind={service} />
    <PageClose />
  </>;
}
