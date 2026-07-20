import React, { useState } from 'react';
import PageLayout, { PageSection } from '../components/PageLayout';

const EMAIL = 'riccardo@flowsyncaisolutions.com';

const content = {
  en: {
    label: 'Legal',
    title: 'Terms of Service',
    updated: 'Last updated: 20 July 2026',
    sections: [
      {
        heading: '1. About these terms',
        body: [
          <>These terms govern your use of the FlowSync AI Solutions website. By using the site you accept them. Questions: <a className="text-accent hover:underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>.</>,
        ],
      },
      {
        heading: '2. Our services',
        body: [
          <>This website presents our AI operations services for B2B companies. The content is informational: it is not a binding offer. Any engagement is governed by a separate written agreement between FlowSync AI Solutions and the client.</>,
        ],
      },
      {
        heading: '3. Waitlist and contact',
        body: [
          <>Joining the waitlist or contacting us does not create any contractual relationship or guarantee of service. We are selective about the clients we onboard and may decline any request at our discretion.</>,
        ],
      },
      {
        heading: '4. Intellectual property',
        body: [
          <>All content on this site (text, graphics, logos, design) belongs to FlowSync AI Solutions and may not be reproduced without permission.</>,
        ],
      },
      {
        heading: '5. Liability',
        body: [
          <>The site is provided "as is". To the maximum extent permitted by law, we are not liable for damages arising from the use of, or inability to use, this website or its content.</>,
        ],
      },
      {
        heading: '6. Governing law',
        body: [
          <>These terms are governed by Italian law. Any dispute will be subject to the jurisdiction of the competent Italian courts, without prejudice to mandatory consumer protections.</>,
        ],
      },
    ],
  },
  it: {
    label: 'Legale',
    title: 'Termini di Servizio',
    updated: 'Ultimo aggiornamento: 20 luglio 2026',
    sections: [
      {
        heading: '1. Su questi termini',
        body: [
          <>Questi termini regolano l'utilizzo del sito web di FlowSync AI Solutions. Utilizzando il sito li accetti. Per domande: <a className="text-accent hover:underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>.</>,
        ],
      },
      {
        heading: '2. I nostri servizi',
        body: [
          <>Questo sito presenta i nostri servizi di AI operations per aziende B2B. I contenuti hanno finalità informativa e non costituiscono un'offerta vincolante. Ogni incarico è regolato da un accordo scritto separato tra FlowSync AI Solutions e il cliente.</>,
        ],
      },
      {
        heading: '3. Waitlist e contatti',
        body: [
          <>L'iscrizione alla waitlist o l'invio di un contatto non crea alcun rapporto contrattuale né garanzia di servizio. Selezioniamo i clienti con cui lavorare e possiamo rifiutare qualsiasi richiesta a nostra discrezione.</>,
        ],
      },
      {
        heading: '4. Proprietà intellettuale',
        body: [
          <>Tutti i contenuti di questo sito (testi, grafiche, loghi, design) appartengono a FlowSync AI Solutions e non possono essere riprodotti senza autorizzazione.</>,
        ],
      },
      {
        heading: '5. Responsabilità',
        body: [
          <>Il sito è fornito "così com'è". Nella misura massima consentita dalla legge, non siamo responsabili per danni derivanti dall'uso o dall'impossibilità di usare questo sito o i suoi contenuti.</>,
        ],
      },
      {
        heading: '6. Legge applicabile',
        body: [
          <>Questi termini sono regolati dalla legge italiana. Ogni controversia sarà di competenza del foro italiano competente, fatte salve le tutele inderogabili previste per i consumatori.</>,
        ],
      },
    ],
  },
};

const Terms = () => {
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

export default Terms;
