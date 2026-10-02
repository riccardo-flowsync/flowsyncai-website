import { useRef, useState } from 'react';
import { Check, Mail, Package, Search, FileCheck, CornerDownRight } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, later } from '../lib/motion';
import { useCopy, useLang } from '../lib/lang';
import Link from './SiteLink';
import WorkspaceEnvironment from './WorkspaceEnvironment';

const copy = {
  en: {
    outbound: { name: 'AI outreach', title: 'From the right person to the next conversation.', body: 'Research, personal emails and organised replies. A system that keeps opportunities moving, with you at the decision.', link: 'Explore AI outreach', steps: ['Find the right buyers', 'Research the business', 'Prepare the message', 'Put you at the decision'], source: 'Prospect research', request: 'Find operations directors at growing logistics companies.', record: 'Company record', fields: [['Business', 'Northline Logistics'], ['Role', 'Operations director'], ['Signal', 'A second warehouse']], action: 'Personal email', subject: 'Your new warehouse', message: 'A new site means more moving parts. Could we help your operations team with the repetitive work?', states: ['Matching the brief', 'Research attached', 'Email prepared', 'Reply ready for approval'], result: 'A relevant reply. Your decision.', detail: 'You approve replies by default.' },
    support: { name: 'AI agents', title: 'A request comes in. The work gets done.', body: 'An agent that reads your records, uses your tools and takes action. Built for your processes, starting with ecommerce.', link: 'Explore AI agents', steps: ['Understand the request', 'Open the right record', 'Check the business rules', 'Perform the action'], source: 'Customer request', request: 'Can I return the blue item from order 4821?', record: 'Order 4821', fields: [['Item', 'Blue cotton shirt'], ['Quantity', '1'], ['Status', 'Shipped']], action: 'Return workspace', subject: 'Return for order 4821', message: 'The blue item is eligible. Register the return and pass the label request to the team.', states: ['Request received', 'Order retrieved', 'Return eligibility checked', 'Return registered'], result: 'Return registered in the store.', detail: 'The team receives the label request with the full context.' },
    note: 'Illustrative example. Names, messages and records are invented.', progress: 'Watch the work unfold', open: 'Open service', complete: 'Action record', status: 'Status', next: 'Next step',
  },
  it: {
    outbound: { name: 'AI outreach', title: 'Dalla persona giusta alla prossima conversazione.', body: 'Ricerca, email personali e risposte ordinate. Un sistema che porta avanti le opportunità, con te al momento della decisione.', link: 'Esplora AI outreach', steps: ['Trova chi compra', 'Studia l’azienda', 'Prepara il messaggio', 'Porta a te la decisione'], source: 'Ricerca contatti', request: 'Trova responsabili operativi in aziende logistiche in crescita.', record: 'Scheda azienda', fields: [['Azienda', 'Northline Logistics'], ['Ruolo', 'Responsabile operativo'], ['Segnale', 'Un secondo magazzino']], action: 'Email personale', subject: 'Il vostro nuovo magazzino', message: 'Una nuova sede porta altro lavoro. Possiamo aiutare il team operativo con le attività ripetitive?', states: ['Verifica dei criteri', 'Ricerca allegata', 'Email preparata', 'Risposta pronta da approvare'], result: 'Una risposta pertinente. Decidi tu.', detail: 'Di norma, le risposte le approvi tu.' },
    support: { name: 'Agenti AI', title: 'Arriva una richiesta. Il lavoro viene fatto.', body: 'Un agente che legge i dati, usa i tuoi strumenti e agisce. Costruito per i tuoi processi, a partire dall’ecommerce.', link: 'Esplora gli agenti AI', steps: ['Comprende la richiesta', 'Apre il record giusto', 'Verifica le regole', 'Esegue l’azione'], source: 'Richiesta del cliente', request: 'Posso restituire l’articolo blu dell’ordine 4821?', record: 'Ordine 4821', fields: [['Articolo', 'Camicia blu in cotone'], ['Quantità', '1'], ['Stato', 'Spedito']], action: 'Gestione resi', subject: 'Reso per l’ordine 4821', message: 'L’articolo blu può essere restituito. Registra il reso e passa al team la richiesta dell’etichetta.', states: ['Richiesta ricevuta', 'Ordine recuperato', 'Condizioni del reso verificate', 'Reso registrato'], result: 'Reso registrato nel negozio.', detail: 'Il team riceve la richiesta dell’etichetta con tutto il contesto.' },
    note: 'Esempio illustrativo. Nomi, messaggi e dati sono inventati.', progress: 'Guarda il lavoro prendere forma', open: 'Apri il servizio', complete: 'Registro delle azioni', status: 'Stato', next: 'Prossimo passo',
  },
};

export default function CinematicStory({ service, detail = false }) {
  const all = useCopy(copy), t = all[service];
  const { lang } = useLang();
  const root = useRef(null);
  const [step, setStep] = useState(3);
  const support = service === 'support';
  const path = support ? '/customer-support' : '/sales-outreach';
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: MOTION_OK, wide: '(min-width: 1000px) and (min-height: 700px)' }, (ctx) => {
      if (!ctx.conditions.motion) { setStep(3); return undefined; }
      later(ctx, () => {
      const wide = ctx.conditions.wide;
      const tl = gsap.timeline({ scrollTrigger: {
        trigger: root.current.querySelector('.story-track'), start: wide ? 'top 88px' : 'top 65%', end: wide ? 'bottom bottom' : 'bottom 45%', scrub: 0.3,
        onUpdate: (self) => setStep(Math.min(3, Math.floor(self.progress * 4))),
        onRefresh: (self) => setStep(Math.min(3, Math.floor(self.progress * 4))),
      } });
      tl.fromTo('.tool-request', { x: 0, y: 35, rotateY: wide ? 12 : 0, rotateZ: -2 }, { x: 0, y: 0, rotateY: 0, rotateZ: 0, duration: 1 }, 0)
        .fromTo('.tool-record', { x: 0, y: 50, rotateY: wide ? -16 : 0, rotateZ: 2 }, { x: 0, y: 0, rotateY: 0, rotateZ: 0, duration: 1.5 }, 0.3)
        .fromTo('.tool-action', { y: 65, z: -120, rotateX: 12 }, { y: 0, z: 0, rotateX: 0, duration: 1.4 }, 0.8)
        .fromTo('.tool-result', { y: 18, opacity: 0.25 }, { y: 0, opacity: 1, duration: 0.6 }, 2)
        .to({}, { duration: 0.6 });
      });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [lang, service], revertOnUpdate: true });
  return <section ref={root} className={`cinematic-story ${detail ? 'workspace-world story-detail' : ''}`} id={`story-${service}`}>
    {detail && <WorkspaceEnvironment />}
    <div className="story-track">
      <div className="story-stage page">
        <div className="story-caption">
          <h2 className="story-service">{t.name}</h2>
          <p className="story-thesis">{t.title}</p>
          <p className="story-description">{t.body}</p>
          {!detail && <Link to={path} className="story-link">{t.link}</Link>}
          <ol className="story-steps" aria-label={all.progress}>{t.steps.map((label, i) => <li key={label} data-current={step === i} data-complete={step > i}><span className="step-mark" aria-hidden="true">{step > i ? <Check size={12} /> : i + 1}</span>{label}</li>)}</ol>
          <p className="scene-notice">{all.note}</p>
        </div>
        <div className="tool-theatre" data-step={step}>
          <div className="tool-surface tool-request"><div className="tool-bar">{support ? <Mail size={16} /> : <Search size={16} />}<span>{t.source}</span></div><p className="tool-question">{t.request}</p><div className="tool-connection" aria-hidden="true"><CornerDownRight size={22}/></div></div>
          <div className="tool-surface tool-record"><div className="tool-bar">{support ? <Package size={16} /> : <Search size={16}/>}<span>{t.record}</span></div><dl>{t.fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
          <div className="tool-surface tool-action"><div className="tool-bar"><FileCheck size={16}/><span>{t.action}</span><span className="tool-status">{t.states[step]}</span></div><h3>{t.subject}</h3><p>{t.message}</p><div className="tool-result"><Check size={18} aria-hidden="true"/><div><strong>{step === 3 ? t.result : t.states[step]}</strong><span>{t.detail}</span></div></div></div>
        </div>
      </div>
    </div>
  </section>;
}
