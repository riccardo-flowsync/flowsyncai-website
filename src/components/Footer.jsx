import Link from './SiteLink';
import { Logo } from './Navbar';
import { useCopy } from '../lib/lang';

const EMAIL = 'riccardo@flowsyncaisolutions.com';

const copy = {
  en: {
    tagline: 'AI systems for B2B outbound and customer support.',
    site: 'Site',
    sections: [['/sales-outreach', 'AI outreach'], ['/customer-support', 'AI agents'], ['/#process', 'How it works'], ['/contact', 'Book a call']],
    legal: 'Legal',
    pages: [['/privacy', 'Privacy policy'], ['/terms', 'Terms'], ['/contact', 'Contact']],
    city: 'Rome, Italy',
  },
  it: {
    tagline: 'Sistemi AI per l’outbound B2B e l’assistenza clienti.',
    site: 'Sito',
    sections: [['/sales-outreach', 'AI outreach'], ['/customer-support', 'Agenti AI'], ['/#process', 'Come funziona'], ['/contact', 'Prenota una call']],
    legal: 'Legale',
    pages: [['/privacy', 'Privacy policy'], ['/terms', 'Termini di servizio'], ['/contact', 'Contatti']],
    city: 'Roma, Italia',
  },
};

const link = 'inline-block py-1 transition-colors hover:text-fg coarse:inline-flex coarse:min-h-11 coarse:items-center';

export default function Footer() {
  const t = useCopy(copy);

  return (
    <footer className="border-t border-line">
      <div className="page py-14 sm:py-16">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-x-12 lg:gap-x-20">
          <div>
            <div className="flex items-center gap-2.5 text-[1.05rem] font-semibold tracking-tight [font-stretch:115%]">
              <Logo className="h-7 w-7" />
              <span translate="no">FlowSync AI Solutions</span>
            </div>
            <p className="mt-4 max-w-[34ch] text-muted">{t.tagline}</p>
          </div>

          <nav aria-label={t.site}>
            <p className="text-sm text-faint">{t.site}</p>
            <ul className="mt-3 space-y-1 text-[0.94rem] text-muted">
              {t.sections.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className={link}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.legal}>
            <p className="text-sm text-faint">{t.legal}</p>
            <ul className="mt-3 space-y-1 text-[0.94rem] text-muted">
              {t.pages.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className={link}>{label}</Link>
                </li>
              ))}
              <li>
                <a href={`mailto:${EMAIL}`} className={`${link} break-all`}>{EMAIL}</a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Legal identity: required by Italian law on every page, keep it visible and readable */}
        <div className="mt-14 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-6 text-sm text-faint">
          <span>FlowSync AI Solutions di Riccardo Casale</span>
          <span>P.IVA 18068831009</span>
          <span>{t.city}</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
