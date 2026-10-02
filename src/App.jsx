import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LangProvider, useCopy, useLang } from './lib/lang';
import Metadata from './components/Metadata';
import { pagePath } from './lib/routes';
import { ScrollTrigger, startSmoothScroll, scrollToEl, scrollToTop, scenesReady } from './lib/motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { loaders } from './lib/pages';
const Contact = lazy(loaders['/contact']);
const Privacy = lazy(loaders['/privacy']);
const Terms = lazy(loaders['/terms']);
const ServicePage = lazy(loaders['/sales-outreach']);
import NotFound from './pages/NotFound';

function LegacyRedirect() {
  const location = useLocation();
  const { lang } = useLang();
  const path = pagePath(location.pathname);
  const destination = path === '/how-we-work'
    ? '/#process'
    : new URLSearchParams(location.search).get('view') === 'support'
      ? '/customer-support#results'
      : new URLSearchParams(location.search).get('view') === 'outbound'
        ? '/sales-outreach#results'
        : '/#systems';
  return <Navigate replace to={`/${lang}${destination}`} />;
}

// ScrollTrigger re-measures the page when the fonts and the page finish loading and when a pinned scene is set up,
// which cancels a scroll under way
const settled = () => Promise.all([
  document.fonts?.ready,
  scenesReady(),
  document.readyState === 'complete' || new Promise((done) => window.addEventListener('load', done, { once: true })),
]);

// New page: start at the top, with focus on its content instead of on the link that was used.
// Link to /#section: go to that section once the page has laid out and loaded.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const shown = useRef(pathname);
  useEffect(() => {
    const newPage = pagePath(shown.current) !== pagePath(pathname);
    shown.current = pathname;
    if (!hash) {
      if (newPage) scrollToTop();
      if (newPage) document.getElementById('main')?.focus({ preventScroll: true });
      return undefined;
    }
    let frame;
    let live = true;
    settled().then(() => {
      if (live) frame = requestAnimationFrame(() => scrollToEl(document.getElementById(hash.slice(1))));
    });
    return () => {
      live = false;
      cancelAnimationFrame(frame);
    };
  }, [pathname, hash]);
  return null;
}

const loadingCopy = { en: { loading: 'Loading the page…' }, it: { loading: 'Caricamento della pagina…' } };
function Loading() {
  const t = useCopy(loadingCopy);
  return <p role="status" className="page min-h-[50svh] py-32 text-muted">{t.loading}</p>;
}

export function Site({ page, initialPage, initialPath }) {
  const { pathname } = useLocation();
  const ready = page || (pagePath(pathname) === initialPath ? initialPage : null);
  return (
      <LangProvider>
        <Metadata />
        <ScrollManager />
        <Navbar />
        <main id="main" tabIndex={-1} className="outline-none">
          {ready || <Suspense fallback={<Loading />}>
            <Routes>
              {['', '/en', '/it'].map((prefix) => [
                <Route key={`${prefix}/`} path={prefix || '/'} element={<Home />} />,
                <Route key={`${prefix}/sales-outreach`} path={`${prefix}/sales-outreach`} element={<ServicePage key="outbound" service="outbound" />} />,
                <Route key={`${prefix}/customer-support`} path={`${prefix}/customer-support`} element={<ServicePage key="support" service="support" />} />,
                <Route key={`${prefix}/results`} path={`${prefix}/results`} element={<LegacyRedirect />} />,
                <Route key={`${prefix}/how-we-work`} path={`${prefix}/how-we-work`} element={<LegacyRedirect />} />,
                <Route key={`${prefix}/contact`} path={`${prefix}/contact`} element={<Contact />} />,
                <Route key={`${prefix}/privacy`} path={`${prefix}/privacy`} element={<Privacy />} />,
                <Route key={`${prefix}/terms`} path={`${prefix}/terms`} element={<Terms />} />,
              ])}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>}
        </main>
        <Footer />
      </LangProvider>
  );
}

export default function App({ initialPage, initialPath }) {
  useEffect(() => {
    const stop = startSmoothScroll();
    // Text reflows once the web fonts land: re-measure every trigger. Here and not at module load,
    // where fonts.ready resolves at once because no font has started loading yet.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return stop;
  }, []);

  return <BrowserRouter><Site initialPage={initialPage} initialPath={initialPath} /></BrowserRouter>;
}
