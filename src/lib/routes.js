export const ORIGIN = 'https://flowsyncaisolutions.com';

// One route inventory also drives static pages and the sitemap.
export const PAGES = {
  '/': {
    en: ['AI automation agency in Rome', 'FlowSync AI Solutions builds AI outreach systems and agents that do work inside your tools.'],
    it: ['Agenzia di automazione AI a Roma', 'FlowSync AI Solutions costruisce sistemi di AI outreach e agenti che lavorano nei tuoi strumenti.'],
  },
  '/sales-outreach': {
    en: ['AI outreach for B2B sales', 'Reach relevant B2B buyers with personal cold email. Replies are prepared for your review by default.'],
    it: ['AI outreach per le vendite B2B', 'Raggiungi i clienti B2B giusti con email a freddo personali. Di norma, le risposte sono preparate per la tua revisione.'],
  },
  '/customer-support': {
    en: ['AI agents for support and office work', 'Agents configured for customer support or repeatable office work, within the tools and permissions you choose.'],
    it: ['Agenti AI per assistenza e attività d’ufficio', 'Agenti configurati per l’assistenza clienti o le attività d’ufficio ripetitive, con gli strumenti e i permessi che scegli.'],
  },
  '/contact': {
    en: ['Book a call about AI outreach or agents', 'Book a 30-minute call about AI outreach or AI agents, or send FlowSync AI Solutions a message.'],
    it: ['Prenota una call su AI outreach o agenti', 'Prenota una call di 30 minuti su AI outreach o agenti AI, oppure invia un messaggio a FlowSync AI Solutions.'],
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
