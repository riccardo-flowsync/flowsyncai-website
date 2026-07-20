import React, { useState } from 'react';
import PageLayout, { PageSection } from '../components/PageLayout';

const EMAIL = 'riccardo@flowsyncaisolutions.com';

const content = {
  en: {
    label: 'Legal',
    title: 'Privacy Policy',
    updated: 'Last updated: 20 July 2026',
    sections: [
      {
        heading: '1. Who we are',
        body: [
          <>FlowSync AI Solutions ("we", "us") operates this website. For any privacy-related question or request, contact us at <a className="text-accent hover:underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>.</>,
        ],
      },
      {
        heading: '2. What data we collect',
        body: [
          <>We only collect the personal data you voluntarily submit through our waitlist and contact forms: your name, email address, company name, and the content of your message.</>,
          <>We do not use advertising trackers or profiling cookies. Technical data (such as IP addresses in server logs) may be processed by our hosting provider for security and operational purposes.</>,
        ],
      },
      {
        heading: '3. Why we process it',
        body: [
          <>We process your data to respond to your enquiries, manage the waitlist, and communicate with you about our services. The legal basis is your consent and, where applicable, pre-contractual measures taken at your request (Art. 6(1)(a) and (b) GDPR).</>,
        ],
      },
      {
        heading: '4. How long we keep it',
        body: [
          <>We keep form submissions only as long as needed to handle your request or maintain our business relationship, after which they are deleted.</>,
        ],
      },
      {
        heading: '5. Sharing',
        body: [
          <>We do not sell your data. It may be processed by service providers strictly necessary to operate this website (hosting and email infrastructure), acting on our instructions.</>,
        ],
      },
      {
        heading: '6. Your rights',
        body: [
          <>Under the GDPR you may request access, rectification, erasure, restriction, portability, or object to processing, and lodge a complaint with your supervisory authority (in Italy, the Garante per la protezione dei dati personali). To exercise any right, write to <a className="text-accent hover:underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>.</>,
        ],
      },
    ],
  },
  it: {
    label: 'Legale',
    title: 'Privacy Policy',
    updated: 'Ultimo aggiornamento: 20 luglio 2026',
    sections: [
      {
        heading: '1. Chi siamo',
        body: [
          <>FlowSync AI Solutions ("noi") gestisce questo sito web. Per qualsiasi domanda o richiesta relativa alla privacy, contattaci a <a className="text-accent hover:underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>.</>,
        ],
      },
      {
        heading: '2. Quali dati raccogliamo',
        body: [
          <>Raccogliamo esclusivamente i dati personali che ci fornisci volontariamente tramite i moduli di waitlist e contatto: nome, indirizzo email, nome dell'azienda e contenuto del messaggio.</>,
          <>Non utilizziamo tracker pubblicitari né cookie di profilazione. I dati tecnici (come gli indirizzi IP nei log del server) possono essere trattati dal nostro provider di hosting per finalità di sicurezza e operative.</>,
        ],
      },
      {
        heading: '3. Perché li trattiamo',
        body: [
          <>Trattiamo i tuoi dati per rispondere alle tue richieste, gestire la waitlist e comunicare con te riguardo ai nostri servizi. La base giuridica è il tuo consenso e, ove applicabile, l'esecuzione di misure precontrattuali adottate su tua richiesta (art. 6(1)(a) e (b) GDPR).</>,
        ],
      },
      {
        heading: '4. Per quanto tempo li conserviamo',
        body: [
          <>Conserviamo i dati inviati tramite i moduli solo per il tempo necessario a gestire la tua richiesta o il rapporto commerciale, dopodiché vengono cancellati.</>,
        ],
      },
      {
        heading: '5. Condivisione',
        body: [
          <>Non vendiamo i tuoi dati. Possono essere trattati da fornitori strettamente necessari al funzionamento di questo sito (hosting e infrastruttura email), che agiscono su nostre istruzioni.</>,
        ],
      },
      {
        heading: '6. I tuoi diritti',
        body: [
          <>Ai sensi del GDPR puoi richiedere accesso, rettifica, cancellazione, limitazione, portabilità o opporti al trattamento, e presentare reclamo al Garante per la protezione dei dati personali. Per esercitare i tuoi diritti scrivi a <a className="text-accent hover:underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>.</>,
        ],
      },
    ],
  },
};

const Privacy = () => {
  const [lang, setLang] = useState('en');
  const t = content[lang];
  return (
    <PageLayout label={t.label} title={t.title} lang={lang} setLang={setLang}>
      <p className="font-mono text-xs text-text/40 uppercase tracking-widest">{t.updated}</p>
      {t.sections.map((s) => (
        <PageSection key={s.heading} heading={s.heading}>
          {s.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </PageSection>
      ))}
    </PageLayout>
  );
};

export default Privacy;
