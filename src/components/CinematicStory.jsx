import { useRef, useState } from 'react';
import { Check, Mail, Package, Search, FileCheck, CornerDownRight, Clock3 } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, later } from '../lib/motion';
import { useCopy, useLang } from '../lib/lang';
import Link from './SiteLink';
import WorkspaceEnvironment from './WorkspaceEnvironment';

const copy = {
  en: {
    outbound: { name: 'AI outreach', title: 'From the right person to the next conversation.', body: 'Research, personal emails and organised replies. A system that keeps opportunities moving, with you at the decision.', link: 'Explore AI outreach', steps: ['Find the right buyers', 'Research the business', 'Prepare the message', 'Put you at the decision'], source: 'Prospect research', request: 'Find operations directors at growing logistics companies.', record: 'Company record', fields: [['Business', 'Northline Logistics'], ['Role', 'Operations director'], ['Signal', 'A second warehouse']], action: 'Personal email', subject: 'Your new warehouse', message: 'A new site means more moving parts. Could we help your operations team with the repetitive work?', states: ['Matching the brief', 'Research attached', 'Email prepared', 'Reply ready for approval'], result: 'A relevant reply. Your decision.', detail: 'You approve replies by default.' },
    support: { name: 'AI agents', title: 'A request comes in. The work gets done.', body: 'An agent that reads your records, uses your tools and takes action. Built for your processes, starting with ecommerce.', link: 'Explore AI agents', steps: ['Understand the request', 'Open the right record', 'Check the business rules', 'Perform the action'], source: 'Customer request', request: 'Can I return the blue item from order 4821?', record: 'Order 4821', fields: [['Item', 'Blue cotton shirt'], ['Quantity', '1'], ['Status', 'Shipped']], action: 'Return workspace', subject: 'Return for order 4821', message: 'The blue item is eligible. Register the return and pass the label request to the team.', states: ['Request received', 'Order retrieved', 'Return eligibility checked', 'Return registered'], result: 'Return registered in the store.', detail: 'The team receives the label request with the full context.' },
    rules: ['Item is eligible for return', 'Return permitted by store policy'], checking: 'Check the store rules', replyLabel: 'Incoming reply', replyTitle: 'Later, a reply arrives', reply: 'Interesting. Could you send more details about how this would work for our team?', classification: 'Interested', waiting: 'Waiting for review', pending: 'No action taken yet.',
    note: 'Illustrative example. Names, messages and records are invented.', progress: 'Watch the work unfold', open: 'Open service', complete: 'Action record', status: 'Status', next: 'Next step',
  },
  it: {
    outbound: { name: 'AI outreach', title: 'Dalla persona giusta alla prossima conversazione.', body: 'Ricerca, email personali e risposte ordinate. Un sistema che porta avanti le opportunità, con te al momento della decisione.', link: 'Esplora AI outreach', steps: ['Trova chi compra', 'Studia l’azienda', 'Prepara il messaggio', 'Porta a te la decisione'], source: 'Ricerca contatti', request: 'Trova responsabili operativi in aziende logistiche in crescita.', record: 'Scheda azienda', fields: [['Azienda', 'Northline Logistics'], ['Ruolo', 'Responsabile operativo'], ['Segnale', 'Un secondo magazzino']], action: 'Email personale', subject: 'Il vostro nuovo magazzino', message: 'Una nuova sede porta altro lavoro. Possiamo aiutare il team operativo con le attività ripetitive?', states: ['Verifica dei criteri', 'Ricerca allegata', 'Email preparata', 'Risposta pronta da approvare'], result: 'Una risposta pertinente. Decidi tu.', detail: 'Di norma, le risposte le approvi tu.' },
    support: { name: 'Agenti AI', title: 'Arriva una richiesta. Il lavoro viene fatto.', body: 'Un agente che legge i dati, usa i tuoi strumenti e agisce. Costruito per i tuoi processi, a partire dall’ecommerce.', link: 'Esplora gli agenti AI', steps: ['Comprende la richiesta', 'Apre il record giusto', 'Verifica le regole', 'Esegue l’azione'], source: 'Richiesta del cliente', request: 'Posso restituire l’articolo blu dell’ordine 4821?', record: 'Ordine 4821', fields: [['Articolo', 'Camicia blu in cotone'], ['Quantità', '1'], ['Stato', 'Spedito']], action: 'Gestione resi', subject: 'Reso per l’ordine 4821', message: 'L’articolo blu può essere restituito. Registra il reso e passa al team la richiesta dell’etichetta.', states: ['Richiesta ricevuta', 'Ordine recuperato', 'Condizioni del reso verificate', 'Reso registrato'], result: 'Reso registrato nel negozio.', detail: 'Il team riceve la richiesta dell’etichetta con tutto il contesto.' },
    rules: ['L’articolo può essere restituito', 'Reso consentito dalle regole del negozio'], checking: 'Verifica le regole del negozio', replyLabel: 'Risposta ricevuta', replyTitle: 'Poi arriva una risposta', reply: 'Interessante. Potete inviarci più dettagli su come funzionerebbe per il nostro team?', classification: 'Interessato', waiting: 'Da approvare', pending: 'Nessuna azione eseguita.',
    note: 'Esempio illustrativo. Nomi, messaggi e dati sono inventati.', progress: 'Guarda il lavoro prendere forma', open: 'Apri il servizio', complete: 'Registro delle azioni', status: 'Stato', next: 'Prossimo passo',
  },
};

export default function CinematicStory({ service, detail = false }) {
  const all = useCopy(copy), t = all[service];
  const { lang } = useLang();
  const root = useRef(null);
  const manual = useRef(false);
  const [step, setStep] = useState(3);
  const support = service === 'support';
  const recordReady = step >= 1, actionReady = step >= 2, complete = step === 3;
  const path = support ? '/customer-support' : '/sales-outreach';
  useGSAP(() => {
    // A click wins over any scroll still settling. Resume only on a new scroll gesture.
    const resume = () => { manual.current = false; };
    const resumeKey = (event) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) resume(); };
    window.addEventListener('wheel', resume, { passive: true });
    window.addEventListener('touchmove', resume, { passive: true });
    window.addEventListener('keydown', resumeKey);
    const mm = gsap.matchMedia();
    mm.add({ motion: MOTION_OK, wide: '(min-width: 1000px) and (min-height: 700px)' }, (ctx) => {
      manual.current = false;
      if (!ctx.conditions.motion) { setStep(3); return undefined; }
      later(ctx, () => {
      const wide = ctx.conditions.wide;
      ScrollTrigger.create({
        trigger: root.current.querySelector('.story-track'),
        start: wide ? 'top 88px' : 'top 65%',
        end: wide ? 'bottom bottom' : 'bottom 45%',
        // Scroll chooses the step; each surface settles promptly, independent of wheel speed.
        onUpdate: (self) => { if (!manual.current) setStep(Math.min(3, Math.floor(self.progress * 4))); },
        onRefresh: (self) => { if (!manual.current) setStep(Math.min(3, Math.floor(self.progress * 4))); },
      });
      });
    });
    return () => {
      mm.revert();
      window.removeEventListener('wheel', resume);
      window.removeEventListener('touchmove', resume);
      window.removeEventListener('keydown', resumeKey);
    };
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
          <ol className="story-steps" aria-label={all.progress}>{t.steps.map((label, i) => <li key={label} data-current={step === i} data-complete={step > i}><button type="button" aria-pressed={step === i} aria-controls={`tools-${service}`} onClick={() => { manual.current = true; setStep(i); }}><span className="step-mark" aria-hidden="true">{step > i ? <Check size={12} /> : i + 1}</span>{label}</button></li>)}</ol>
          <p className="scene-notice">{all.note}</p>
        </div>
        <div className="tool-theatre" id={`tools-${service}`} data-step={step}>
          <div className="tool-surface tool-request"><div className="tool-bar">{support ? <Mail size={16} /> : <Search size={16} />}<span>{t.source}</span></div><p className="tool-question">{t.request}</p><div className="tool-connection" aria-hidden="true"><CornerDownRight size={22}/></div></div>
          <div className="tool-surface tool-record">
            <div className="tool-bar">{support ? <Package size={16} /> : <Search size={16}/>}<span>{t.record}</span></div>
            <dl>{t.fields.map(([label, value], i) => <div key={label} className="tool-field" data-ready={recordReady}>
              <dt>{label}</dt><dd><span className="tool-field-value" aria-hidden={!recordReady} style={{ transitionDelay: recordReady ? `${i * 55}ms` : '0ms' }}>{value}</span><span className="tool-field-placeholder" aria-hidden="true" /></dd>
            </div>)}</dl>
          </div>
          <div className="tool-surface tool-action">
            <div className="tool-bar"><FileCheck size={16}/><span>{!support && complete ? all.replyLabel : t.action}</span><span className="tool-status" role="status">{!support && complete ? all.waiting : t.states[step]}</span></div>
            <div className="tool-action-content" data-ready={actionReady}>
              <div className="tool-action-draft" data-shown={support || !complete} aria-hidden={!actionReady || (!support && complete)}>
                <h3>{support ? all.checking : t.subject}</h3>
                {support ? <ul className="tool-rules">{all.rules.map((rule, i) => <li key={rule} style={{ transitionDelay: actionReady ? `${i * 90}ms` : '0ms' }}><Check size={15} aria-hidden="true"/>{rule}</li>)}</ul> : <p>{t.message}</p>}
              </div>
              {!support && <div className="tool-action-reply" data-shown={complete} aria-hidden={!complete}>
                <h3>{all.replyTitle}</h3><p>“{all.reply}”</p><div className="tool-reply-tags"><span>{all.classification}</span><span>{all.waiting}</span></div>
              </div>}
              <p className="tool-action-pending" aria-hidden={actionReady}>{all.pending}</p>
            </div>
            <div className="tool-result" data-ready={complete} aria-hidden={!complete}>
              {complete ? <Check size={18} aria-hidden="true"/> : <Clock3 size={18} aria-hidden="true"/>}
              <div><strong>{complete ? t.result : t.states[step]}</strong><span>{complete ? t.detail : all.pending}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
