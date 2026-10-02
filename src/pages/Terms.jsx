import Link from '../components/SiteLink';
import PageLayout, { PageSection } from '../components/PageLayout';
import { useCopy } from '../lib/lang';

const EMAIL = 'riccardo@flowsyncaisolutions.com';
const mail = <a href={`mailto:${EMAIL}`}>{EMAIL}</a>;

const copy = {
  en: {
    docTitle: 'FlowSync AI Solutions: terms of service',
    title: 'Terms of service',
    updated: 'Last updated: 30 September 2026',
    sections: [
      {
        title: '1. Who runs this site',
        body: (
          <p>
            This site is run by FlowSync AI Solutions di Riccardo Casale, P.IVA 18068831009 (Italian VAT number), Rome,
            Italy. By using the site you accept these terms. We may update them: the date at the top shows the current
            version. Questions: {mail}.
          </p>
        ),
      },
      {
        title: '2. What this site is',
        body: (
          <>
            <p>
              The site gives information about the AI systems and services we build and run for B2B companies:
              outbound on cold email and customer support agents. It is for information only. Using it does not create a
              contract between you and us, and its content is not an offer to the public under Article 1336 of the
              Italian Civil Code. Any engagement is governed by a separate written agreement between FlowSync AI
              Solutions and the client.
            </p>
            <p>Results and figures on the site describe past work. They are not a promise of future results.</p>
          </>
        ),
      },
      {
        title: '3. Requests and bookings',
        body: (
          <>
            <p>
              Sending a request through the contact form or booking a call does not create a contract or guarantee
              that we will work together. We choose the clients we work with and may decline any request.
            </p>
            <p>
              Bookings are handled through Cal.com and calls take place on Google Meet. Both run under their own
              terms. Our <Link to="/privacy">privacy policy</Link> explains how we handle your data.
            </p>
          </>
        ),
      },
      {
        title: '4. Intellectual property',
        body: (
          <p>
            The text, graphics, logo and design of this site belong to FlowSync AI Solutions di Riccardo Casale and may
            not be reproduced without our written permission.
          </p>
        ),
      },
      {
        title: '5. Liability',
        body: (
          <p>
            The site is provided “as is”. We take care to keep it accurate, but we do not guarantee that it is
            complete, up to date or always available. To the maximum extent permitted by law, we are not liable for
            damages arising from the use of, or inability to use, this site or its content. Nothing in these terms
            excludes liability that the law does not allow us to exclude.
          </p>
        ),
      },
      {
        title: '6. Governing law and courts',
        body: (
          <p>
            These terms are governed by Italian law. The courts of Rome have jurisdiction over any dispute, without
            prejudice to any mandatory consumer protections that apply to you.
          </p>
        ),
      },
    ],
  },
  it: {
    docTitle: 'FlowSync AI Solutions: termini di servizio',
    title: 'Termini di servizio',
    updated: 'Ultimo aggiornamento: 30 settembre 2026',
    sections: [
      {
        title: '1. Chi gestisce il sito',
        body: (
          <p>
            Questo sito è gestito da FlowSync AI Solutions di Riccardo Casale, P.IVA 18068831009, Roma, Italia.
            Utilizzando il sito accetti questi termini. Possiamo aggiornarli: la data in cima alla pagina indica la
            versione in vigore. Per domande: {mail}.
          </p>
        ),
      },
      {
        title: '2. Natura del sito',
        body: (
          <>
            <p>
              Il sito fornisce informazioni sui sistemi e sui servizi AI che realizziamo e gestiamo per aziende B2B:
              outbound via email a freddo e agenti per l’assistenza clienti. Ha solo scopo informativo: utilizzarlo non fa nascere alcun
              contratto tra te e noi e i suoi contenuti non costituiscono offerta al pubblico ai sensi dell’art. 1336
              del codice civile. Ogni incarico è regolato da un accordo scritto separato tra FlowSync AI
              Solutions e il cliente.
            </p>
            <p>I risultati e i numeri pubblicati descrivono lavori già svolti e non sono una promessa di risultati futuri.</p>
          </>
        ),
      },
      {
        title: '3. Richieste e prenotazioni',
        body: (
          <>
            <p>
              Inviare una richiesta dal modulo di contatto o prenotare una call non crea alcun rapporto contrattuale né
              garantisce che lavoreremo insieme. Scegliamo i clienti con cui lavorare e possiamo rifiutare qualsiasi
              richiesta.
            </p>
            <p>
              Le prenotazioni passano da Cal.com e le call si svolgono su Google Meet, servizi soggetti ai rispettivi
              termini. Come trattiamo i tuoi dati è spiegato nella nostra <Link to="/privacy">privacy policy</Link>.
            </p>
          </>
        ),
      },
      {
        title: '4. Proprietà intellettuale',
        body: (
          <p>
            Testi, grafiche, logo e design di questo sito appartengono a FlowSync AI Solutions di Riccardo Casale e non
            possono essere riprodotti senza la nostra autorizzazione scritta.
          </p>
        ),
      },
      {
        title: '5. Responsabilità',
        body: (
          <p>
            Il sito è fornito «così com’è». Ci impegniamo a mantenere le informazioni corrette, ma non garantiamo che
            siano complete, aggiornate o che il sito sia sempre disponibile. Nei limiti massimi consentiti dalla legge,
            non rispondiamo dei danni derivanti dall’uso o dall’impossibilità di usare il sito o i suoi contenuti.
            Restano ferme le responsabilità che la legge non consente di escludere.
          </p>
        ),
      },
      {
        title: '6. Legge applicabile e foro competente',
        body: (
          <p>
            Questi termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il Foro di Roma,
            fatte salve le tutele inderogabili previste per i consumatori.
          </p>
        ),
      },
    ],
  },
};

export default function Terms() {
  const t = useCopy(copy);
  return (
    <PageLayout title={t.title} updated={t.updated}>
      {t.sections.map((s) => (
        <PageSection key={s.title} title={s.title}>{s.body}</PageSection>
      ))}
    </PageLayout>
  );
}
