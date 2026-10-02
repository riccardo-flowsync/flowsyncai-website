import { useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, MOTION_OK } from '../lib/motion';

const EMAIL = 'riccardo@flowsyncaisolutions.com';

const copy = {
  en: {
    name: 'Name',
    email: 'Work email',
    company: 'Company (optional)',
    interest: 'What would you like to automate?',
    options: [['email', 'AI outreach'], ['support', 'AI agent'], ['unsure', 'Not sure yet']],
    message: 'Anything we should know?',
    optional: 'optional',
    send: 'Send message',
    sending: 'Sending…',
    invalid: 'Please add your name and a valid email address.',
    failed: 'Your message could not be sent. Please email us instead:',
    thanks: (name) => `Thanks, ${name}. Riccardo will reply within 24\u00a0hours.`,
    pick: 'Or pick a time for a call now:',
    see: 'See available times',
  },
  it: {
    name: 'Nome',
    email: 'Email di lavoro',
    company: 'Azienda (facoltativo)',
    interest: 'Cosa vorresti automatizzare?',
    options: [['email', 'AI outreach'], ['support', 'AI agent'], ['unsure', 'Non lo so ancora']],
    message: 'Qualcosa che dovremmo sapere?',
    optional: 'facoltativo',
    send: 'Invia il messaggio',
    sending: 'Invio in corso…',
    invalid: 'Inserisci il tuo nome e un indirizzo email valido.',
    failed: 'Non siamo riusciti a inviare il messaggio. Scrivici direttamente:',
    thanks: (name) => `Grazie, ${name}. Riccardo ti risponderà entro 24\u00a0ore.`,
    pick: 'Oppure scegli subito un orario per la call:',
    see: 'Vedi gli orari disponibili',
  },
};

const mailto = (d) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(`Website: ${d?.name || ''}`)}&body=${encodeURIComponent(
    [d?.message, '', d?.name, d?.company, d?.email].filter((x) => x !== undefined).join('\n'),
  )}`;

export default function LeadForm({ onSent, onPickTime }) {
  const t = useCopy(copy);
  const { lang } = useLang();
  const { pathname } = useLocation();
  const id = useId();
  const [status, setStatus] = useState('idle'); // idle | sending | sent | invalid | failed
  const [sent, setSent] = useState(null);
  const [draft, setDraft] = useState(null); // kept for the email fallback, so nothing typed is lost
  const note = useRef(null);

  // The message mounts already filled and the button that had focus goes away: focus the message so it is read out
  useEffect(() => {
    if (status === 'sent' || status === 'invalid' || status === 'failed') note.current?.focus();
  }, [status]);

  // The tick draws, then the rest of the card settles in. Only the tweens hide anything (from values), so reduced motion and no-JS show the finished card.
  // The card itself is never animated: it holds focus. Opacity, not autoAlpha: visibility would pull the live region's children out of the accessibility tree and back in.
  // Only the status matters here, so a language switch after sending does not replay it.
  useGSAP(() => {
    if (status !== 'sent') return undefined;
    const mm = gsap.matchMedia(note.current);
    mm.add(MOTION_OK, () => {
      // autoRound off: GSAP rounds px values to whole numbers, which would snap the 0 to 1 offset instead of drawing it
      gsap.from('.sent-tick', { strokeDashoffset: 1, autoRound: false, duration: 0.5, ease: 'power2.out', delay: 0.15 });
      gsap.from([...note.current.children].slice(1), { y: 8, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1, delay: 0.3 });
    });
    return () => mm.revert();
  }, { scope: note, dependencies: [status] });

  async function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setDraft(data);
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang, page: pathname }),
      });
      if (res.ok) {
        const person = { name: data.name.trim(), email: data.email.trim() };
        setSent(person);
        setStatus('sent');
        onSent?.(person);
      } else {
        setStatus(res.status === 400 ? 'invalid' : 'failed');
      }
    } catch {
      setStatus('failed');
    }
  }

  if (status === 'sent') {
    return (
      <div ref={note} tabIndex={-1} role="status" className="rounded-[10px] border border-line bg-surface p-6">
        <p className="flex items-start gap-3 text-lg font-semibold [font-stretch:110%]">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-6 w-6 shrink-0 fill-none stroke-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path className="sent-tick" d="M5 12.5l4.5 4.5L19 7.5" pathLength="1" strokeDasharray="1 2" />
          </svg>
          {t.thanks(sent.name.split(' ')[0])}
        </p>
        <p className="mt-3 text-muted">{t.pick}</p>
        <button type="button" onClick={onPickTime} className="btn-primary mt-4">{t.see}</button>
      </div>
    );
  }

  // Cmd or Ctrl + Enter sends from the message box; requestSubmit keeps the browser's own validation
  const sendOnEnter = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && status !== 'sending') e.currentTarget.form.requestSubmit();
  };

  const label = 'mb-1.5 block text-sm font-medium text-muted';
  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>{t.name}</label>
          <input id={`${id}-name`} name="name" required maxLength={120} autoComplete="name" className="field" />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>{t.email}</label>
          <input id={`${id}-email`} name="email" type="email" required autoComplete="email" spellCheck={false} className="field" />
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-company`} className={label}>{t.company}</label>
        <input id={`${id}-company`} name="company" maxLength={160} autoComplete="organization" className="field" />
      </div>
      <fieldset>
        <legend className={label}>{t.interest}</legend>
        <div className="flex flex-wrap gap-2">
          {t.options.map(([value, text]) => (
            <label key={value} className="cursor-pointer">
              <input type="radio" name="interest" value={value} defaultChecked={value === 'unsure'} className="peer sr-only" />
              <span className="inline-block rounded-lg border border-faint px-3 py-2 text-sm text-muted transition-colors coarse:inline-flex coarse:min-h-11 coarse:items-center hover:text-fg peer-checked:border-accent peer-checked:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
                {text}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor={`${id}-message`} className={label}>
          {t.message} <span className="text-faint">({t.optional})</span>
        </label>
        <textarea id={`${id}-message`} name="message" rows={4} maxLength={3000} onKeyDown={sendOnEnter} className="field resize-y" />
      </div>
      {/* Honeypot: invisible to people, bots fill it in */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />

      {(status === 'invalid' || status === 'failed') && (
        <p ref={note} tabIndex={-1} role="alert" className="text-sm text-fg">
          {status === 'invalid' ? t.invalid : (
            <>
              {t.failed}{' '}
              <a href={mailto(draft)} className="link break-all">{EMAIL}</a>
            </>
          )}
        </p>
      )}
      <div>
        <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-60">
          {status === 'sending' ? t.sending : t.send}
        </button>
      </div>
    </form>
  );
}
