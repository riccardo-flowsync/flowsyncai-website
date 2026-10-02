import PageLayout, { PageSection } from '../components/PageLayout';
import { useCopy } from '../lib/lang';

const EMAIL = 'riccardo@flowsyncaisolutions.com';
const mail = <a href={`mailto:${EMAIL}`}>{EMAIL}</a>;
const garante = <a href="https://www.garanteprivacy.it">garanteprivacy.it</a>;

const copy = {
  en: {
    docTitle: 'FlowSync AI Solutions: privacy policy',
    title: 'Privacy policy',
    updated: 'Last updated: 30 September 2026',
    sections: [
      {
        title: '1. Who is responsible for your data',
        body: (
          <>
            <p>
              The data controller is FlowSync AI Solutions di Riccardo Casale, P.IVA 18068831009 (Italian VAT number),
              Rome, Italy. For any question or request about your data, write to {mail}.
            </p>
            <p>This notice is given under Article 13 of the GDPR (Regulation (EU) 2016/679).</p>
          </>
        ),
      },
      {
        title: '2. What data we collect',
        body: (
          <>
            <p>We collect what you give us and what the site needs to run.</p>
            <ul>
              <li>If you use the contact form: your name, work email, company, what you want to automate and your message.</li>
              <li>If you book a call: your name, email, company and the time you choose.</li>
              <li>When you visit the site: your IP address, your browser and the pages you request. Our hosting provider keeps these in technical logs.</li>
              <li>If you switch the site language: your choice, saved in your browser’s local storage so the site opens in that language next time. It stays on your device.</li>
            </ul>
            <p>Giving us your data is optional, but without the details the form asks for we cannot reply or arrange a call.</p>
          </>
        ),
      },
      {
        title: '3. Why we use it',
        body: (
          <>
            <p>We use your data for two purposes.</p>
            <ul>
              <li>To reply to your requests and arrange calls. Legal basis: steps taken at your request before a contract (Article 6(1)(b) GDPR).</li>
              <li>To manage our business contacts and keep the site secure. Legal basis: our legitimate interest (Article 6(1)(f) GDPR).</li>
            </ul>
            <p>
              We do not sell your data, and the site has no advertising or profiling tools. We do not make automated
              decisions that have legal effects on you.
            </p>
          </>
        ),
      },
      {
        title: '4. Who else handles it',
        body: (
          <>
            <p>These providers process data on our behalf and on our instructions:</p>
            <ul>
              <li>Vercel Inc.: hosts the site and keeps its technical logs.</li>
              <li>Mango Technologies, Inc., which operates ClickUp: where we record form requests and bookings.</li>
              <li>Cal.com, Inc.: the booking calendar. It loads only after you click to see available times, and it may then set its own cookies.</li>
              <li>Google: Calendar and Meet, for the calls you book.</li>
            </ul>
            <p>
              Some of these providers are based outside the European Economic Area, for example in the United States.
              Transfers outside the EEA rely on the European Commission’s Standard Contractual Clauses. We share data
              with public authorities only when the law requires it.
            </p>
          </>
        ),
      },
      {
        title: '5. Cookies and local storage',
        body: (
          <p>
            The site sets no cookies of its own. The only thing it stores in your browser is your language choice, in
            local storage, and you can delete it at any time from your browser settings. The only cookies you may meet
            come from the booking calendar (see section 4).
          </p>
        ),
      },
      {
        title: '6. How long we keep it',
        body: (
          <ul>
            <li>If you do not become a client, we delete your details within 24&nbsp;months of our last exchange.</li>
            <li>If you become a client, we keep them for the length of the contract and for as long as the law requires afterwards.</li>
            <li>Technical logs are kept for the short period set by our hosting provider.</li>
          </ul>
        ),
      },
      {
        title: '7. Your rights',
        body: (
          <>
            <p>
              You can ask us for access to your data, to correct it, to erase it or to restrict its use, and to receive
              it in a portable format. You can also object to its use. To do any of this, write to {mail}. We reply
              within one month.
            </p>
            <p>
              You can also complain to the Garante per la protezione dei dati personali ({garante}), the Italian data
              protection authority, or to the authority in your own country.
            </p>
          </>
        ),
      },
    ],
  },
  it: {
    docTitle: 'FlowSync AI Solutions: privacy policy',
    title: 'Privacy policy',
    updated: 'Ultimo aggiornamento: 30 settembre 2026',
    sections: [
      {
        title: '1. Titolare del trattamento',
        body: (
          <>
            <p>
              Il titolare del trattamento è FlowSync AI Solutions di Riccardo Casale, P.IVA 18068831009, Roma, Italia.
              Per qualsiasi domanda o richiesta sui tuoi dati scrivi a {mail}.
            </p>
            <p>Questa informativa è resa ai sensi dell’art. 13 del Regolamento (UE) 2016/679 (GDPR).</p>
          </>
        ),
      },
      {
        title: '2. Quali dati raccogliamo',
        body: (
          <>
            <p>Raccogliamo i dati che ci fornisci tu e quelli tecnici necessari al funzionamento del sito.</p>
            <ul>
              <li>Se usi il modulo di contatto: nome, email di lavoro, azienda, che cosa vuoi automatizzare e il tuo messaggio.</li>
              <li>Se prenoti una call: nome, email, azienda e orario scelto.</li>
              <li>Quando visiti il sito: indirizzo IP, browser e pagine richieste, che il nostro fornitore di hosting registra nei log tecnici.</li>
              <li>Se cambi la lingua del sito: la tua scelta, salvata nel local storage del browser perché alla visita successiva il sito si apra nella stessa lingua. Resta sul tuo dispositivo.</li>
            </ul>
            <p>Il conferimento dei dati è facoltativo, ma senza quelli richiesti dal modulo non possiamo risponderti né fissare una call.</p>
          </>
        ),
      },
      {
        title: '3. Perché li trattiamo e su quale base',
        body: (
          <>
            <p>Trattiamo i tuoi dati per due finalità.</p>
            <ul>
              <li>Rispondere alle tue richieste e fissare le call. Base giuridica: misure precontrattuali adottate su tua richiesta (art. 6, par. 1, lett. b, GDPR).</li>
              <li>Gestire i contatti commerciali e proteggere la sicurezza del sito. Base giuridica: il nostro legittimo interesse (art. 6, par. 1, lett. f, GDPR).</li>
            </ul>
            <p>
              Non vendiamo i tuoi dati e il sito non usa strumenti pubblicitari o di profilazione. Non adottiamo alcun
              processo decisionale automatizzato che produca effetti giuridici nei tuoi confronti.
            </p>
          </>
        ),
      },
      {
        title: '4. Chi tratta i dati per nostro conto',
        body: (
          <>
            <p>Questi fornitori trattano i dati per nostro conto e secondo le nostre istruzioni (responsabili del trattamento):</p>
            <ul>
              <li>Vercel Inc.: ospita il sito e conserva i log tecnici.</li>
              <li>Mango Technologies, Inc., che gestisce ClickUp: qui registriamo le richieste inviate dal modulo e le prenotazioni.</li>
              <li>Cal.com, Inc.: il calendario per le prenotazioni. Si carica solo dopo che clicchi per vedere gli orari disponibili e da quel momento può impostare cookie propri.</li>
              <li>Google: Calendar e Meet, per le call prenotate.</li>
            </ul>
            <p>
              Alcuni di questi fornitori hanno sede fuori dallo Spazio economico europeo (SEE), ad esempio negli Stati
              Uniti. I trasferimenti di dati fuori dal SEE si basano sulle clausole contrattuali tipo (Standard
              Contractual Clauses) della Commissione europea. Comunichiamo i dati ad autorità pubbliche solo quando la
              legge lo impone.
            </p>
          </>
        ),
      },
      {
        title: '5. Cookie e local storage',
        body: (
          <p>
            Il sito non imposta cookie propri. L’unica informazione che salva nel tuo browser è la scelta della lingua,
            nel local storage: puoi cancellarla in qualsiasi momento dalle impostazioni del browser. Gli unici cookie
            che potresti incontrare provengono dal calendario di prenotazione (vedi il punto 4).
          </p>
        ),
      },
      {
        title: '6. Per quanto tempo conserviamo i dati',
        body: (
          <ul>
            <li>Se non diventi nostro cliente, cancelliamo i tuoi dati entro 24&nbsp;mesi dall’ultimo contatto.</li>
            <li>Se diventi nostro cliente, li conserviamo per la durata del contratto e, dopo, per il tempo richiesto dalla legge.</li>
            <li>I log tecnici vengono conservati per il breve periodo stabilito dal fornitore di hosting.</li>
          </ul>
        ),
      },
      {
        title: '7. I tuoi diritti',
        body: (
          <>
            <p>
              Puoi chiederci l’accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione del trattamento e
              la portabilità, e puoi opporti al trattamento. Scrivi a {mail}: ti rispondiamo entro un mese.
            </p>
            <p>
              Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali ({garante}) o
              all’autorità di controllo del tuo Paese.
            </p>
          </>
        ),
      },
    ],
  },
};

export default function Privacy() {
  const t = useCopy(copy);
  return (
    <PageLayout title={t.title} updated={t.updated}>
      {t.sections.map((s) => (
        <PageSection key={s.title} title={s.title}>{s.body}</PageSection>
      ))}
    </PageLayout>
  );
}
