import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLang } from '../lib/lang';
import { ORIGIN, PAGES, pagePath, localizedPath } from '../lib/routes';

export default function Metadata() {
  const { pathname } = useLocation();
  const { lang } = useLang();
  const path = pagePath(pathname);
  const known = PAGES[path];
  const [name, description] = known?.[lang] || (lang === 'it' ? ['Pagina non trovata', 'Questa pagina non esiste.'] : ['Page not found', 'This page does not exist.']);
  const title = `${name} | FlowSync AI Solutions`;
  const url = `${ORIGIN}${localizedPath(path, lang)}`;
  useEffect(() => {
    document.title = title;
    const meta = (selector, attribute, key, value) => {
      let el = document.head.querySelector(selector);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attribute, key); document.head.append(el); }
      el.content = value;
    };
    meta('meta[name="description"]', 'name', 'description', description);
    meta('meta[name="robots"]', 'name', 'robots', known ? 'index,follow' : 'noindex,follow');
    for (const [key, value] of Object.entries({ title, description, url, locale: lang === 'it' ? 'it_IT' : 'en_GB' })) meta(`meta[property="og:${key}"]`, 'property', `og:${key}`, value);
    for (const [key, value] of Object.entries({ title, description })) meta(`meta[name="twitter:${key}"]`, 'name', `twitter:${key}`, value);
    const link = (selector, attrs) => {
      let el = document.head.querySelector(selector);
      if (!el) { el = document.createElement('link'); document.head.append(el); }
      Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    };
    link('link[rel="canonical"]', { rel: 'canonical', href: url });
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    if (known) for (const l of ['en', 'it']) link(`link[hreflang="${l}"]`, { rel: 'alternate', hreflang: l, href: `${ORIGIN}${localizedPath(path, l)}` });
  }, [description, known, lang, path, title, url]);
  return null;
}
