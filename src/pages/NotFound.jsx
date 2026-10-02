import { Link } from 'react-router-dom';
import { useCopy } from '../lib/lang';

const copy = {
  en: { docTitle: 'FlowSync AI Solutions: page not found', title: 'This page does not exist.', body: 'The link may be old or mistyped.', home: 'Go to the home page' },
  it: { docTitle: 'FlowSync AI Solutions: pagina non trovata', title: 'Questa pagina non esiste.', body: 'Il link potrebbe essere vecchio o scritto male.', home: 'Torna alla home' },
};

export default function NotFound() {
  const t = useCopy(copy);
  return (
    <section className="page flex min-h-[70svh] flex-col items-start justify-center pb-20 pt-32">
      <title>{t.docTitle}</title>
      <meta name="robots" content="noindex" />
      <h1 className="t-h2">{t.title}</h1>
      <p className="mt-4 text-muted">{t.body}</p>
      <Link to="/" className="btn-quiet mt-8">{t.home}</Link>
    </section>
  );
}
