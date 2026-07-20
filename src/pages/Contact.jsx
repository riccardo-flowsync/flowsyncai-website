import React, { useState } from 'react';
import PageLayout, { PageSection } from '../components/PageLayout';

const EMAIL = 'riccardo@flowsyncaisolutions.com';

const content = {
  en: {
    label: 'Contact',
    title: 'Get in touch.',
    intro: 'Tell us about your operations and where you want to scale. We reply personally to every serious enquiry.',
    directHeading: 'Direct',
    name: 'Full Name',
    email: 'Work Email',
    company: 'Company Name',
    message: 'Message',
    namePh: 'John Doe',
    emailPh: 'john@company.com',
    companyPh: 'Acme Corp',
    messagePh: 'What would you like to automate?',
    submit: 'Send Message',
    success: 'Message sent. We will get back to you shortly.',
    error: 'Something went wrong. Please email us directly at',
  },
  it: {
    label: 'Contatti',
    title: 'Parliamone.',
    intro: 'Raccontaci le tue operations e dove vuoi scalare. Rispondiamo personalmente a ogni richiesta seria.',
    directHeading: 'Contatto diretto',
    name: 'Nome e Cognome',
    email: 'Email di Lavoro',
    company: 'Azienda',
    message: 'Messaggio',
    namePh: 'Mario Rossi',
    emailPh: 'mario@azienda.it',
    companyPh: 'Azienda Srl',
    messagePh: 'Cosa vorresti automatizzare?',
    submit: 'Invia Messaggio',
    success: 'Messaggio inviato. Ti risponderemo a breve.',
    error: 'Si è verificato un errore. Scrivici direttamente a',
  },
};

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-text font-sans focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-colors placeholder:text-text/20';
const labelCls = 'font-mono text-[10px] text-text/50 uppercase tracking-widest pl-1';

const Contact = () => {
  const [lang, setLang] = useState('en');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const t = content[lang];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'contact-page' }),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <PageLayout label={t.label} title={t.title} lang={lang} setLang={setLang}>
      <p className="font-sans text-text/60 text-lg max-w-xl">{t.intro}</p>

      <PageSection heading={t.directHeading}>
        <p>
          <a className="text-accent hover:underline font-mono" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </p>
      </PageSection>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full bg-[#0a0a0b] border border-white/5 p-8 md:p-10 rounded-3xl glass-panel shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
      >
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 space-y-2">
            <label className={labelCls}>{t.name}</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputCls}
              placeholder={t.namePh}
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className={labelCls}>{t.email}</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputCls}
              placeholder={t.emailPh}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className={labelCls}>{t.company}</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className={inputCls}
            placeholder={t.companyPh}
          />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>{t.message}</label>
          <textarea
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className={inputCls}
            placeholder={t.messagePh}
          />
        </div>

        {status === 'success' && (
          <p className="font-sans text-sm text-emerald-400">{t.success}</p>
        )}
        {status === 'error' && (
          <p className="font-sans text-sm text-red-400">
            {t.error}{' '}
            <a className="underline" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-accent text-[#0a0a0b] font-sans font-bold text-base px-8 py-4 rounded-xl mt-2 flex items-center justify-center transition-all hover:shadow-[0_0_30px_rgba(157,124,255,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? (
            <div className="w-5 h-5 border-2 border-[#0a0a0b]/20 border-t-[#0a0a0b] rounded-full animate-spin" />
          ) : (
            t.submit
          )}
        </button>
      </form>
    </PageLayout>
  );
};

export default Contact;
