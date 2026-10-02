import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ScrollLink from './ScrollLink';
import { useCopy, useLang } from '../lib/lang';
import { lockScroll } from '../lib/motion';
import logoMask from '../assets/logo-mask.webp'; // 1.4 KB, so the build inlines it: the first paint waits for no image request

const copy = {
  en: {
    nav: 'Main',
    links: [['#systems', 'Systems'], ['#results', 'Results'], ['#process', 'Process'], ['#faq', 'FAQ']],
    book: 'Book a call',
    menu: 'Menu',
    skip: 'Skip to content',
    home: 'FlowSync AI Solutions, home',
    language: 'Language',
  },
  it: {
    nav: 'Principale',
    links: [['#systems', 'Sistemi'], ['#results', 'Risultati'], ['#process', 'Metodo'], ['#faq', 'FAQ']],
    book: 'Prenota una call',
    menu: 'Menu',
    skip: 'Vai al contenuto',
    home: 'FlowSync AI Solutions, home page',
    language: 'Lingua',
  },
};

const LANGUAGES = [['en', 'English'], ['it', 'Italiano']]; // each in its own language, whatever the page language

export function Logo({ className = '' }) {
  const mask = `url(${logoMask}) center / contain no-repeat`; // 112 px: 4x the 28 px it is shown at
  return <span aria-hidden="true" className={`inline-block shrink-0 bg-accent ${className}`} style={{ mask, WebkitMask: mask }} />;
}

export function LangSwitch({ className = '' }) {
  const { lang, setLang } = useLang();
  const t = useCopy(copy);
  return (
    <div role="group" aria-label={t.language} className={`flex rounded-lg p-0.5 ring-1 ring-inset ring-line ${className}`}>
      {LANGUAGES.map(([l, name]) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={name}
          lang={l}
          className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition-colors coarse:min-h-11 ${
            lang === l ? 'bg-raised text-fg' : 'text-faint hover:text-fg'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const t = useCopy(copy);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    lockScroll(true);
    const behind = document.querySelectorAll('main, footer'); // out of reach for keyboard and screen readers until the menu closes
    behind.forEach((el) => el.setAttribute('inert', ''));
    const wide = matchMedia('(min-width: 1280px)'); // close when the desktop navigation replaces the menu
    const onWide = () => wide.matches && setOpen(false);
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggle.current?.focus();
    };
    wide.addEventListener('change', onWide);
    window.addEventListener('keydown', onKey);
    return () => {
      wide.removeEventListener('change', onWide);
      window.removeEventListener('keydown', onKey);
      behind.forEach((el) => el.removeAttribute('inert'));
      lockScroll(false);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] border-b transition-colors duration-300 ${
        scrolled || open ? 'border-line bg-canvas/95' : 'border-transparent'
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[120] focus:px-5 focus:py-3 btn-quiet bg-canvas">
        {t.skip}
      </a>
      <nav aria-label={t.nav} className="page flex h-16 items-center justify-between gap-4">
        <Link to="/" onClick={close} aria-label={t.home} className="flex items-center gap-2.5 text-sm sm:text-[1.05rem] font-semibold tracking-tight [font-stretch:115%] coarse:min-h-11">
          <Logo className="h-7 w-7" />
          <span translate="no" className="max-w-[150px] leading-tight sm:max-w-none">FlowSync AI Solutions</span>
        </Link>

        <ul className="hidden items-center gap-7 text-[0.94rem] text-muted xl:flex">
          {t.links.map(([to, label]) => (
            <li key={to}>
              <ScrollLink to={to} className="nav-link transition-colors hover:text-fg">{label}</ScrollLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch className="hidden xl:flex" />
          <ScrollLink to="#book" onClick={close} className="btn-primary hidden px-3.5 py-2 text-sm sm:inline-flex sm:px-4 coarse:min-h-11">
            {t.book}
          </ScrollLink>
          <button
            ref={toggle}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t.menu}
            className="-mr-2 rounded-lg p-2 text-muted transition-colors hover:text-fg xl:hidden coarse:min-h-11"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto overscroll-contain bg-canvas xl:hidden">
          <div className="page flex min-h-full flex-col gap-10 py-10">
            <ul className="flex flex-col gap-5">
              {t.links.map(([to, label]) => (
                <li key={to}>
                  <ScrollLink to={to} onClick={close} className="text-3xl font-semibold tracking-tight [font-stretch:112%]">
                    {label}
                  </ScrollLink>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-4">
              <LangSwitch className="self-start" />
              <ScrollLink to="#book" onClick={close} className="btn-primary w-full">{t.book}</ScrollLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
