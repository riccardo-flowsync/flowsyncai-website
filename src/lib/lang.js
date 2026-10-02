import { createContext, createElement, useContext, useEffect, useState } from 'react';

// Site language: saved choice, else the browser's language, else English.
// ponytail: language lives in the browser, not the URL; add /it/ routes if Italian search traffic matters.
const LangContext = createContext({ lang: 'en', setLang: () => {} });

function initialLang() {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'it') return saved;
  } catch { /* storage blocked: fall through */ }
  return navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en';
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next) => {
    setLangState(next);
    try { localStorage.setItem('lang', next); } catch { /* not persisted, still switches */ }
  };

  return createElement(LangContext.Provider, { value: { lang, setLang } }, children);
}

export const useLang = () => useContext(LangContext);

// Copy lives next to each component as { en: {...}, it: {...} }; this picks the active one.
export const useCopy = (copy) => copy[useContext(LangContext).lang];
