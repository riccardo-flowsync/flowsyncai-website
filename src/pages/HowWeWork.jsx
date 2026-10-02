import PageIntro, { PageClose } from '../components/PageIntro';
import Process from '../components/Process';
import Link from '../components/SiteLink';
import { useCopy } from '../lib/lang';

const copy = {
  en: {
    title: 'A system starts with your work.',
    intro: 'First we understand the job. Then we connect your tools, prepare the system and get your approval before launch.',
    title2: 'What we handle. What you decide.',
    rows: [
      ['Before launch', 'We prepare the emails or support answers and connect the tools.', 'You provide the information, exclusions and rules. You approve the prepared system.'],
      ['Sales outreach', 'We find buyers, send personal emails and organize the replies.', 'You approve, edit or decline replies by default, and take the booked calls.'],
      ['Customer support', 'The assistant answers and takes the actions available in the agreed setup.', 'Your team handles unresolved cases, with the conversation attached to a ticket.'],
    ],
    us: 'The person behind FlowSync.',
    person: 'Riccardo Casale',
    role: 'Founder, FlowSync AI Solutions. Rome, Italy.',
    body: 'The introductory call is where we look at your sales or support work together and tell you whether a system fits. Bring the job you want to improve, and the questions you need answered.',
    contact: 'Book an intro call',
    we: 'What we do', you: 'Your part',
  },
  it: {
    title: 'Un sistema parte dal tuo lavoro.',
    intro: 'Prima capiamo cosa serve. Poi colleghiamo gli strumenti, prepariamo il sistema e riceviamo la tua approvazione prima del lancio.',
    title2: 'Cosa gestiamo. Cosa decidi tu.',
    rows: [
      ['Prima del lancio', 'Prepariamo le email o le risposte per l’assistenza e colleghiamo gli strumenti.', 'Fornisci informazioni, esclusioni e regole. Approvi il sistema preparato.'],
      ['Nuovi clienti', 'Troviamo chi compra, inviamo email personali e ordiniamo le risposte.', 'Di norma approvi, modifichi o scarti le risposte e fai le call prenotate.'],
      ['Assistenza clienti', 'L’assistente risponde ed esegue le azioni disponibili nella configurazione concordata.', 'Il team gestisce i casi irrisolti, con la conversazione allegata a un ticket.'],
    ],
    us: 'La persona dietro FlowSync.',
    person: 'Riccardo Casale',
    role: 'Fondatore, FlowSync AI Solutions. Roma, Italia.',
    body: 'Nella call conoscitiva guardiamo insieme le tue vendite o l’assistenza e ti diciamo se un sistema fa per te. Porta il lavoro che vuoi migliorare e le domande a cui vuoi una risposta.',
    contact: 'Prenota la call conoscitiva',
    we: 'Cosa facciamo', you: 'La tua parte',
  },
};

export default function HowWeWork() {
  const t = useCopy(copy);
  return <>
    <PageIntro title={t.title} body={t.intro} />
    <Process />
    <section className="page py-16 sm:py-20"><h2 className="t-h2 max-w-[24ch]">{t.title2}</h2><div className="mt-10">{t.rows.map(([name, we, you]) => <article key={name} className="grid gap-5 border-t border-line py-8 lg:grid-cols-[0.7fr_1fr_1fr] lg:gap-14"><h3 className="t-h3">{name}</h3><div><p className="text-sm text-faint">{t.we}</p><p className="mt-2 text-muted">{we}</p></div><div><p className="text-sm text-faint">{t.you}</p><p className="mt-2 text-muted">{you}</p></div></article>)}</div></section>
    <section className="border-t border-line py-16 sm:py-20"><div className="page grid gap-8 lg:grid-cols-2 lg:gap-20"><h2 className="t-h2 max-w-[20ch]">{t.us}</h2><div><h3 className="t-h3 text-2xl">{t.person}</h3><p className="mt-2 text-sm text-faint">{t.role}</p><p className="mt-6 max-w-[58ch] text-muted">{t.body}</p><Link to="/contact" className="link mt-5 inline-flex min-h-11 items-center">{t.contact}</Link></div></div></section>
    <PageClose />
  </>;
}
