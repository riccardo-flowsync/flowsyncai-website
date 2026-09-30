import { useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCopy, useLang } from '../lib/lang';

const EMAIL = 'riccardo@flowsyncaisolutions.com';

const copy = {
  en: {
    name: 'Name',
    email: 'Work email',
    company: 'Company',
    interest: 'What would you like to automate?',
    options: [['email', 'Outbound on cold email'], ['support', 'A support agent on chat'], ['unsure', 'Not sure yet']],
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
    company: 'Azienda',
    interest: 'Cosa vorresti automatizzare?',
    options: [['email', 'Outbound via email a freddo'], ['support', 'Un agente per l’assistenza in chat'], ['unsure', 'Non lo so ancora']],
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
        <p className="text-lg font-semibold [font-stretch:110%]">{t.thanks(sent.name.split(' ')[0])}</p>
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
