export const ORIGIN = 'https://flowsyncaisolutions.com';

// One route inventory also drives static pages and the sitemap.
export const PAGES = {
  '/': {
    en: ['AI for sales and customer support', 'Cold-email sales outreach and customer support on your website and Instagram. Built and run for you by FlowSync AI Solutions.'],
    it: ['AI per vendite e assistenza clienti', 'Email a freddo per trovare clienti e assistenti sul tuo sito e Instagram. Sistemi costruiti e gestiti per te da FlowSync AI Solutions.'],
  },
  '/sales-outreach': {
    en: ['Sales outreach', 'Find relevant B2B buyers, send personal cold emails and handle replies, with human approval by default. Explore the process and real campaign results.'],
    it: ['Trova nuovi clienti', 'Trova chi compra, invia email personali e gestisci le risposte, con approvazione umana di norma. Scopri il metodo e i risultati delle campagne.'],
  },
  '/customer-support': {
    en: ['Customer support assistants', 'Assistants for website chat and Instagram. Answers from your information, connected order and return actions, and tickets for your team when needed.'],
    it: ['Assistenti clienti', 'Assistenti per la chat del sito e Instagram. Risposte dalle tue informazioni, azioni su ordini e resi collegati e ticket al team quando serve.'],
  },
  '/results': {
    en: ['Real campaign and support results', 'Explore anonymized sales campaigns and support agents in two online shops. See the dates, definitions and limitations behind every result.'],
    it: ['Risultati di campagne e assistenti', 'Esplora campagne di vendita anonime e assistenti in due negozi online. Date, definizioni e limiti per leggere ogni risultato.'],
  },
  '/how-we-work': {
    en: ['How we work', 'From a 30-minute introductory call to preparation, approval and a system that runs every day. Meet FlowSync AI Solutions, based in Rome.'],
    it: ['Come lavoriamo', 'Dalla call conoscitiva di 30 minuti alla preparazione, approvazione e gestione quotidiana. Scopri FlowSync AI Solutions, a Roma.'],
  },
  '/contact': {
    en: ['Book a call or write to us', 'Book a 30-minute call about sales outreach or customer support, or send FlowSync AI Solutions a message.'],
    it: ['Prenota una call o scrivici', 'Prenota una call di 30 minuti sulle vendite o l’assistenza clienti, oppure invia un messaggio a FlowSync AI Solutions.'],
  },
  '/privacy': {
    en: ['Privacy policy', 'How FlowSync AI Solutions handles contact requests, bookings and website data.'],
    it: ['Privacy policy', 'Come FlowSync AI Solutions tratta richieste di contatto, prenotazioni e dati del sito.'],
  },
  '/terms': {
    en: ['Website terms', 'Terms for using the FlowSync AI Solutions website.'],
    it: ['Termini del sito', 'Termini per l’uso del sito FlowSync AI Solutions.'],
  },
};

export const pagePath = (path) => path.replace(/^\/(en|it)(?=\/|$)/, '').replace(/\/$/, '') || '/';
export const pathLang = (path) => path.match(/^\/(en|it)(?=\/|$)/)?.[1];
export const localizedPath = (path, lang) => `/${lang}${path === '/' ? '' : path}`;
