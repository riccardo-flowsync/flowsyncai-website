import Link from './SiteLink';
import { useCopy } from '../lib/lang';

const copy = {
  en: { book: 'Book a call', home: 'Home' },
  it: { book: 'Prenota una call', home: 'Home' },
};

export default function PageIntro({ title, body, children }) {
  const t = useCopy(copy);
  return (
    <section className="page pb-14 pt-24 sm:pb-20 sm:pt-32">
      <div className={`grid items-start gap-12 ${children ? 'lg:grid-cols-[1.2fr_1fr] lg:gap-20' : ''}`}>
        <div>
          <h1 className="t-display max-w-[19ch]">{title}</h1>
          <p className="t-lead mt-5 max-w-[48ch] text-muted">{body}</p>
          <Link to="/contact" className="btn-primary mt-7">{t.book}</Link>
        </div>
        {children}
      </div>
    </section>
  );
}

const closeCopy = {
  en: { title: 'Let’s look at your sales or support.', body: 'A 30-minute call to see where a system would help, and whether it fits.', book: 'Book a call', method: 'See how we work' },
  it: { title: 'Guardiamo le tue vendite o l’assistenza.', body: 'Una call di 30 minuti per vedere dove un sistema ti aiuterebbe e se fa per te.', book: 'Prenota una call', method: 'Scopri come lavoriamo' },
};

export function PageClose() {
  const t = useCopy(closeCopy);
  return <section id="book" className="border-t border-line py-16 sm:py-20"><div className="page flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><h2 className="t-h2 max-w-[23ch]">{t.title}</h2><p className="mt-4 max-w-[50ch] text-muted">{t.body}</p></div><div className="flex flex-wrap gap-3"><Link to="/contact" className="btn-primary">{t.book}</Link><Link to="/how-we-work" className="btn-quiet">{t.method}</Link></div></div></section>;
}
