import { useEffect, useRef, useState } from 'react';
import Link from './SiteLink';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useCopy, useLang } from '../lib/lang';
import { lockScroll } from '../lib/motion';
import logoMask from '../assets/logo-mask.webp';

const copy = {
  en: {
    nav: 'Main',
    services: 'Services',
    outreach: 'AI outreach',
    support: 'AI agents',
    book: 'Book a call',
    menu: 'Menu',
    skip: 'Skip to content',
    home: 'FlowSync AI Solutions, home',
    language: 'Language',
  },
  it: {
    nav: 'Principale',
    services: 'Servizi',
    outreach: 'AI outreach',
    support: 'Agenti AI',
    book: 'Prenota una call',
    menu: 'Menu',
    skip: 'Vai al contenuto',
    home: 'FlowSync AI Solutions, home page',
    language: 'Lingua',
  },
};

const LANGUAGES = [['en', 'English'], ['it', 'Italiano']];
const serviceLinks = [
  { to: '/sales-outreach', key: 'outreach' },
  { to: '/customer-support', key: 'support' },
];

export function Logo({ className = '' }) {
  const mask = `url(${logoMask}) center / contain no-repeat`;
  return <span aria-hidden="true" className={`inline-block shrink-0 bg-accent ${className}`} style={{ mask, WebkitMask: mask }} />;
}

export function LangSwitch({ className = '' }) {
  const { lang, setLang } = useLang();
  const t = useCopy(copy);
  return (
    <div role="group" aria-label={t.language} className={`flex rounded-lg p-0.5 ring-1 ring-inset ring-line ${className}`}>
      {LANGUAGES.map(([l, name]) => (
        <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l} aria-label={name} lang={l}
          className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition-colors coarse:min-h-11 ${lang === l ? 'bg-raised text-fg' : 'text-faint hover:text-fg'}`}>
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
  const [servicesOpen, setServicesOpen] = useState(false);
  const toggle = useRef(null);
  const services = useRef(null);
  const servicesButton = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return undefined;
    const onPointer = (event) => { if (!services.current?.contains(event.target)) setServicesOpen(false); };
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      setServicesOpen(false);
      servicesButton.current?.focus();
    };
    document.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [servicesOpen]);

  useEffect(() => {
    if (!open) return undefined;
    lockScroll(true);
    const behind = document.querySelectorAll('main, footer');
    behind.forEach((el) => el.setAttribute('inert', ''));
    const wide = matchMedia('(min-width: 1280px)');
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

  const close = () => { setOpen(false); toggle.current?.focus(); };
  const menuLink = 'block py-2 text-2xl font-semibold tracking-tight [font-stretch:112%]';

  return (
    <header className={`fixed inset-x-0 top-0 z-[100] border-b transition-colors duration-150 ${scrolled || open || servicesOpen ? 'border-line bg-canvas/95' : 'border-transparent'}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[120] focus:px-5 focus:py-3 btn-quiet bg-canvas">{t.skip}</a>
      <nav aria-label={t.nav} className="page flex h-16 items-center justify-between gap-4">
        <Link to="/" onClick={close} aria-label={t.home} className="flex items-center gap-2.5 text-sm font-semibold tracking-tight [font-stretch:115%] sm:text-[1.05rem] coarse:min-h-11">
          <Logo className="h-7 w-7" /><span translate="no" className="max-w-[150px] leading-tight sm:max-w-none">FlowSync AI Solutions</span>
        </Link>

        <ul className="hidden items-center gap-5 text-[0.88rem] text-muted xl:flex">
          <li ref={services} className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false); }}>
            <button ref={servicesButton} type="button" aria-expanded={servicesOpen} aria-controls="services-menu" onClick={() => setServicesOpen(true)}
              onKeyDown={(event) => {
                if (event.key !== 'ArrowDown') return;
                event.preventDefault();
                setServicesOpen(true);
                requestAnimationFrame(() => services.current?.querySelector('#services-menu a')?.focus());
              }}
              className="inline-flex items-center gap-1.5 py-3 transition-colors hover:text-fg">
              {t.services}<ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {servicesOpen && <ul id="services-menu" className="absolute left-0 top-full min-w-56 rounded-xl border border-line bg-surface p-2 shadow-xl" onKeyDown={(event) => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                const items = [...event.currentTarget.querySelectorAll('a')];
                const index = items.indexOf(document.activeElement);
                items[(index + (event.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length]?.focus();
              }
            }}>
              {serviceLinks.map(({ to, key }) => <li key={to}><Link to={to} onClick={() => setServicesOpen(false)} className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-raised hover:text-fg">{t[key]}</Link></li>)}
            </ul>}
          </li>
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch className="hidden xl:flex" />
          <Link to="/contact" onClick={close} className="btn-primary hidden px-3.5 py-2 text-sm sm:inline-flex sm:px-4 coarse:min-h-11">{t.book}</Link>
          <button ref={toggle} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={t.menu}
            className="-mr-2 rounded-lg p-2 text-muted transition-colors hover:text-fg xl:hidden coarse:min-h-11">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto overscroll-contain bg-canvas xl:hidden">
        <div className="page flex min-h-full flex-col gap-8 py-8">
          <div>
            <p className="pb-2 text-sm text-faint">{t.services}</p>
            <ul className="flex flex-col">{serviceLinks.map(({ to, key }) => <li key={to}><Link to={to} onClick={close} className={menuLink}>{t[key]}</Link></li>)}</ul>
          </div>
          <div className="mt-auto flex flex-col gap-4"><LangSwitch className="self-start" /><Link to="/contact" onClick={close} className="btn-primary w-full">{t.book}</Link></div>
        </div>
      </div>}
    </header>
  );
}
