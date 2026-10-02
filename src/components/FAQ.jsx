import { useRef } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, MOTION_OK, riseOnScroll, drawRule, later } from '../lib/motion';

// The questions prospects ask on calls. Answers stay within what the service does today: no prices, no guarantees.
const copy = {
  en: {
    title: 'A few useful answers.',
    items: [
      ['What does your agency automate?', 'We are an AI automation agency with two services. AI outreach finds prospects, sends personal cold emails and helps book sales calls. AI agent answers customer questions on your website and Instagram, and hands unresolved cases to your team.'],
      ['Who checks the outreach messages?', 'We write the templates. AI fills in the personal parts, like a first line about something the company actually did. An automated check holds back weak lines before anything is sent, and by default every reply and follow-up waits for a person to approve, edit or decline it.'],
      ['Will you send from my main domain?', 'We buy new domains that look like yours and point them to your website, set up the mailboxes with SPF, DKIM and DMARC, and warm them up before any real email goes out. Your main domain is never used to send. You can also list existing customers who must never be contacted.'],
      ['How much does it cost?', 'It depends on your volume and the tools you need. We give you the exact figure on the call, before you commit to anything.'],
      ['How quickly can AI outreach go live?', 'About 2\u00a0weeks to start. New mailboxes warm up before they send real email, then sending rises to full pace over roughly another week.'],
      ['What do you need from me?', 'One onboarding page: you approve the wording of the offer, tell us who must never be emailed and what the reply assistant may say. You open accounts for the sending tools and add us as admin, give us your booking link, and take the calls. Nothing is sent before you approve.'],
      ['Is my business a good fit for cold email?', 'It works best when what you sell solves an urgent problem with a measurable result, your buyers are businesses where one person decides, there are thousands of them to reach, they are open to new suppliers, and one customer is worth about €1,000 or more to you. We check this on the call and tell you plainly.'],
      ['Does AI agent answer on its own?', 'Yes, straight away, from your own information. When it cannot solve something, it opens a ticket for your team with the conversation and the customer’s details attached.'],
      ['Who owns the contacts and the data?', 'You do. The contacts, the meetings and the data the campaign produces are yours and are handed over to you. We keep our own infrastructure, templates and know-how.'],
      ['Do you work in English and outside Italy?', 'Yes. We write natively in English and Italian, and our campaigns have run in the UK, Europe and the UAE.'],
    ],
  },
  it: {
    title: 'Qualche risposta utile.',
    items: [
      ['Cosa automatizza la vostra agenzia?', 'Siamo un’agenzia di automazione AI con due servizi. AI outreach trova potenziali clienti, invia email a freddo personalizzate e aiuta a fissare call commerciali. AI agent risponde ai clienti sul sito e su Instagram e passa i casi irrisolti al tuo team.'],
      ['Chi controlla i messaggi di outreach?', 'I modelli dei messaggi li scriviamo noi. L’AI compila le parti personali, come una prima riga su qualcosa che l’azienda ha fatto davvero. Un controllo automatico blocca le righe deboli prima di qualsiasi invio e, di norma, ogni risposta e ogni follow-up aspetta che una persona lo approvi, lo modifichi o lo scarti.'],
      ['Userete il mio dominio principale per inviare?', 'Acquistiamo nuovi domini simili al tuo, che rimandano al tuo sito, creiamo le caselle con SPF, DKIM e DMARC e le scaldiamo prima di qualsiasi invio reale. Il tuo dominio principale non viene mai usato per inviare. Puoi anche indicarci i clienti attuali da non contattare mai.'],
      ['Quanto costa?', 'Dipende dai volumi e dagli strumenti che servono. Ti diamo la cifra esatta in call, prima che tu ti impegni a qualsiasi cosa.'],
      ['Quanto ci vuole per avviare AI outreach?', 'In circa 2\u00a0settimane siamo operativi. Le nuove caselle si scaldano prima di inviare email vere, poi l’invio sale al ritmo pieno in circa un’altra settimana.'],
      ['Cosa devo fare io?', 'Compilare un’unica pagina di onboarding: approvi i testi dell’offerta, ci dici chi non va mai contattato e cosa può rispondere l’assistente. Apri gli account degli strumenti di invio e ci aggiungi come amministratori, ci dai il link per le prenotazioni e fai le call. Prima della tua approvazione non parte nulla.'],
      ['La mia attività è adatta all’email a freddo?', 'Funziona meglio quando vendi la soluzione a un problema urgente con un risultato misurabile, i tuoi clienti sono aziende in cui decide una persona, ce ne sono migliaia da raggiungere, sono aperti a nuovi fornitori e un cliente vale per te circa 1.000\u00a0€ o più. Lo verifichiamo in call e te lo diciamo chiaramente.'],
      ['AI agent risponde da solo?', 'Sì, subito, partendo dalle tue informazioni. Quando non può risolvere qualcosa, apre un ticket per il tuo team con la conversazione e i dati del cliente.'],
      ['Di chi sono i contatti e i dati?', 'Tuoi. I contatti, gli appuntamenti e i dati prodotti dalla campagna sono tuoi e ti vengono consegnati. Noi teniamo la nostra infrastruttura, i modelli e il know-how.'],
      ['Lavorate anche in inglese e fuori dall’Italia?', 'Sì. Scriviamo in modo nativo in inglese e in italiano, e abbiamo portato avanti campagne nel Regno Unito, in Europa e negli Emirati.'],
    ],
  },
};

export default function FAQ() {
  const t = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);

  // Scrubbed, so the lines rewind on the way back: the section rule, the list's top line, then each row's divider in a short wave.
  // The wave is one timeline on the list's top edge (not one trigger per row), so opening an answer cannot undraw a divider.
  useGSAP((context) => later(context, () => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, () => {
      riseOnScroll('.faq-title');
      drawRule(root.current);
      gsap.fromTo('.faq-list', { '--rule': 0 }, {
        '--rule': 1,
        ease: 'none',
        scrollTrigger: { trigger: '.faq-list', start: 'top 92%', end: 'top 76%', scrub: true },
      });
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.faq-list', start: 'top 88%', end: 'top 35%', scrub: true },
      }).fromTo('.faq-row', { '--d': 0 }, { '--d': 1, duration: 1, stagger: 0.15 });
    });
    return () => mm.revert();
  }), { scope: root, dependencies: [lang], revertOnUpdate: true });

  return (
    <section id="faq" ref={root} className="faq rule py-20 lg:py-24">
      <div className="page grid gap-9 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2 key={lang} className="faq-title t-h2 lg:sticky lg:top-28">{t.title}</h2>
        </div>
        <div className="faq-list rule lg:col-span-8">
          {t.items.map(([q, a]) => (
            <details
              key={q}
              className="faq-row group relative after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-line after:[transform:scaleX(var(--d,1))]"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[1.05rem] font-medium [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden="true" className="relative mt-[0.4em] h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-open:rotate-45">
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-muted transition-colors group-hover:bg-accent" />
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-muted transition-colors group-hover:bg-accent" />
                </span>
              </summary>
              <p className="max-w-[62ch] pb-6 pr-10 text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
