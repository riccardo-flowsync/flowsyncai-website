import Hero from '../components/Hero';
import ProofPreview from '../components/ProofPreview';
import FAQ from '../components/FAQ';
import { PageClose } from '../components/PageIntro';
import Link from '../components/SiteLink';
import { useCopy } from '../lib/lang';

const copy = {
  en: {
    title: 'Two jobs. Two systems built to do them.',
    sales: 'Bring the right buyers to a conversation.',
    salesBody: 'Find relevant businesses, send personal cold emails and sort the replies. A person approves replies by default.',
    salesLink: 'Explore sales outreach',
    support: 'Give customers an answer, and your team context.',
    supportBody: 'An assistant for your website and Instagram. It answers from your information, takes connected actions and hands over by ticket.',
    supportLink: 'Explore customer support',
    method: 'Built around your work. Run every day.',
    methodBody: 'We start with a call, prepare the system with you and get your approval before launch. Then it handles the daily work and passes the right decisions to your team.',
    methodLink: 'See how we work',
    steps: ['Understand your work', 'Prepare and approve', 'Run and hand over'],
  },
  it: {
    title: 'Due lavori. Due sistemi per farli.',
    sales: 'Porta chi compra a una conversazione.',
    salesBody: 'Troviamo aziende adatte, inviamo email personali e ordiniamo le risposte. Di norma le approva una persona.',
    salesLink: 'Scopri come trovare clienti',
    support: 'Una risposta ai clienti, tutto il contesto al team.',
    supportBody: 'Un assistente per il sito e Instagram. Risponde dalle tue informazioni, esegue le azioni collegate e passa la mano con un ticket.',
    supportLink: 'Scopri l’assistenza clienti',
    method: 'Parte dal tuo lavoro. Lo porta avanti ogni giorno.',
    methodBody: 'Partiamo da una call, prepariamo il sistema con te e riceviamo la tua approvazione prima del lancio. Poi gestisce il lavoro quotidiano e passa le decisioni giuste al team.',
    methodLink: 'Scopri come lavoriamo',
    steps: ['Capiamo il tuo lavoro', 'Prepariamo e approvi', 'Gestiamo e passiamo la mano'],
  },
};

export default function Home() {
  const t = useCopy(copy);
  return <>
    <Hero />
    <section id="systems" className="border-t border-line py-16 sm:py-20"><div className="page"><h2 className="t-h2 max-w-[22ch]">{t.title}</h2><div className="mt-10 grid gap-0 md:grid-cols-2 md:gap-14">
      <article id="system-outbound" className="service-door border-t border-line py-8"><h3 className="t-h2 max-w-[19ch]">{t.sales}</h3><p className="mt-5 max-w-[48ch] text-muted">{t.salesBody}</p><Link to="/sales-outreach" className="link mt-6 inline-flex min-h-11 items-center">{t.salesLink}</Link></article>
      <article id="system-support" className="service-door border-t border-line py-8"><h3 className="t-h2 max-w-[19ch]">{t.support}</h3><p className="mt-5 max-w-[48ch] text-muted">{t.supportBody}</p><Link to="/customer-support" className="link mt-6 inline-flex min-h-11 items-center">{t.supportLink}</Link></article>
    </div></div></section>
    <ProofPreview />
    <section id="process" className="border-t border-line py-16 sm:py-20"><div className="page grid gap-10 lg:grid-cols-2 lg:gap-20"><div><h2 className="t-h2 max-w-[22ch]">{t.method}</h2><p className="mt-5 max-w-[52ch] text-muted">{t.methodBody}</p><Link to="/how-we-work" className="link mt-6 inline-flex min-h-11 items-center">{t.methodLink}</Link></div><ol className="self-center">{t.steps.map((s, i) => <li key={s} className="flex gap-6 border-t border-line py-5 text-lg"><span className="text-faint">{i + 1}</span><span>{s}</span></li>)}</ol></div></section>
    <FAQ kind="home" />
    <PageClose />
  </>;
}
