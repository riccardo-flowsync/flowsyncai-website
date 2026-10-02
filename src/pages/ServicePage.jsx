import PageIntro, { PageClose } from '../components/PageIntro';
import Systems from '../components/Systems';
import ProofPreview from '../components/ProofPreview';
import FAQ from '../components/FAQ';
import Link from '../components/SiteLink';
import { useCopy } from '../lib/lang';

const copy = {
  en: {
    outbound: {
      title: 'Reach the right buyers. Keep control.',
      intro: 'Personal cold emails and organized replies, built and run for your B2B business.',
      fit: 'Is this for your business?',
      fitBody: 'A clear offer, business buyers and customers worth €1,000 or more. We look at the fit together on the first call.',
      flow: ['Find relevant buyers', 'Send personal cold emails', 'Sort replies and prepare an answer', 'You approve by default', 'Calls go into your calendar'],
      control: 'Your team stays at the decision.',
      paragraphs: ['We write the templates and prepare the personal parts. Weak lines are held back before sending. Replies and follow-ups wait for a person to approve, edit or decline by default.', 'Sending uses separate domains and mailboxes. Your main domain is not used to send. You can also exclude existing customers and anyone who must never be contacted.'],
      provides: 'What you bring',
      inputs: ['An offer with clear wording', 'The buyers you want to reach, and who to exclude', 'Your booking link and approval rules'],
      method: 'See preparation and launch',
    },
    support: {
      title: 'Answer the routine. Hand over the rest.',
      intro: 'A customer assistant for your website and Instagram, using your information and connected tools.',
      fit: 'Built around the questions you get.',
      fitBody: 'For teams answering product, shipping, order or return questions. Available actions depend on your shop and the setup we agree.',
      flow: ['A customer asks a question', 'The assistant uses your information', 'It answers or takes a connected action', 'Unresolved cases become a ticket', 'Your team gets the full conversation'],
      control: 'A useful answer, or a useful handover.',
      paragraphs: ['The assistant answers on its own from your information. When connected to the right tools, it can check an order, help with a return or find a product.', 'When it cannot solve a case, it opens a ticket. Your team receives the conversation and customer details, so the customer does not have to start again.'],
      provides: 'What you bring',
      inputs: ['Your product and support information', 'Access to the tools the assistant needs', 'Your rules for actions and handover'],
      method: 'See preparation and launch',
    },
  },
  it: {
    outbound: {
      title: 'Trova nuovi clienti. Mantieni il controllo.',
      intro: 'Email a freddo personali e risposte ordinate, costruite e gestite per la tua azienda B2B.',
      fit: 'Fa per la tua azienda?',
      fitBody: 'Un’offerta chiara, clienti aziendali e un valore per cliente di €1.000 o più. Valutiamo insieme se fa per te nella prima call.',
      flow: ['Troviamo chi compra', 'Inviamo email personali', 'Ordiniamo le risposte e prepariamo una bozza', 'Di norma approvi tu', 'Le call arrivano nel tuo calendario'],
      control: 'La decisione resta al tuo team.',
      paragraphs: ['Scriviamo i modelli e prepariamo le parti personali. Le righe deboli vengono bloccate prima dell’invio. Di norma, risposte e follow-up aspettano che una persona li approvi, modifichi o scarti.', 'Usiamo domini e caselle separati per l’invio. Il tuo dominio principale non viene usato. Puoi anche escludere clienti attuali e chi non deve mai essere contattato.'],
      provides: 'Cosa porti tu',
      inputs: ['Un’offerta con testi chiari', 'Chi vuoi raggiungere e chi escludere', 'Il link per prenotare e le regole di approvazione'],
      method: 'Scopri preparazione e lancio',
    },
    support: {
      title: 'Risponde alle domande. Passa il resto al team.',
      intro: 'Un assistente per il tuo sito e Instagram, con le tue informazioni e i tuoi strumenti collegati.',
      fit: 'Parte dalle domande che ricevi.',
      fitBody: 'Per team che rispondono su prodotti, spedizioni, ordini e resi. Le azioni disponibili dipendono dal negozio e dalla configurazione concordata.',
      flow: ['Il cliente fa una domanda', 'L’assistente usa le tue informazioni', 'Risponde o esegue un’azione collegata', 'I casi irrisolti diventano un ticket', 'Il team riceve la conversazione completa'],
      control: 'Una risposta utile, o un passaggio utile.',
      paragraphs: ['L’assistente risponde da solo, partendo dalle tue informazioni. Con gli strumenti giusti collegati, può controllare un ordine, aiutare con un reso o trovare un prodotto.', 'Quando non può risolvere un caso, apre un ticket. Il team riceve conversazione e dettagli del cliente, che non deve ricominciare da capo.'],
      provides: 'Cosa porti tu',
      inputs: ['Le informazioni su prodotti e assistenza', 'L’accesso agli strumenti necessari', 'Le regole per le azioni e il passaggio al team'],
      method: 'Scopri preparazione e lancio',
    },
  },
};

export default function ServicePage({ service }) {
  const all = useCopy(copy);
  const t = all[service];
  return <>
    <PageIntro title={t.title} body={t.intro}>
      <div className="service-flow border-t border-line pt-6 lg:mt-3"><h2 className="t-h3">{t.fit}</h2><p className="mt-3 text-muted">{t.fitBody}</p><ol className="mt-7 grid gap-0">{t.flow.map((step, i) => <li key={step} className="relative flex gap-4 py-3 text-sm"><span className="w-6 shrink-0 text-faint">{i + 1}</span><span>{step}</span></li>)}</ol></div>
    </PageIntro>
    <Systems service={service} />
    <section className="page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-20"><div><h2 className="t-h2 max-w-[21ch]">{t.control}</h2>{t.paragraphs.map((p) => <p key={p} className="mt-5 max-w-[60ch] text-muted">{p}</p>)}</div><div className="border-t border-line pt-6"><h3 className="t-h3">{t.provides}</h3><ul className="mt-5 grid gap-4">{t.inputs.map((p) => <li key={p} className="border-b border-line pb-4 text-muted">{p}</li>)}</ul><Link to="/how-we-work" className="link mt-6 inline-block min-h-11 py-2">{t.method}</Link></div></section>
    <ProofPreview service={service} />
    <FAQ kind={service} />
    <PageClose />
  </>;
}
