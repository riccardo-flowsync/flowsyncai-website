import { createContext, createElement, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pathLang, pagePath, localizedPath } from './routes';

// Site language: saved choice, else the browser's language, else English.
const LangContext = createContext({ lang: 'en', setLang: () => {} });

function initialLang() {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'it') return saved;
  } catch { /* storage blocked: fall through */ }
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en';
}

export function LangProvider({ children }) {
  const [preferred, setPreferred] = useState(initialLang);
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const lang = pathLang(pathname) || preferred;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next) => {
    setPreferred(next);
    try { localStorage.setItem('lang', next); } catch { /* not persisted, still switches */ }
    navigate(`${localizedPath(pagePath(pathname), next)}${search}${hash}`);
  };

  return createElement(LangContext.Provider, { value: { lang, setLang } }, children);
}

export const useLang = () => useContext(LangContext);

// Copy lives next to each component as { en: {...}, it: {...} }; this picks the active one.
export const useCopy = (copy) => copy[useContext(LangContext).lang];
