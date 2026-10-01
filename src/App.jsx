import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LangProvider } from './lib/lang';
import { ScrollTrigger, startSmoothScroll, scrollToEl, scrollToTop, scenesReady } from './lib/motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

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
    const newPage = shown.current !== pathname;
    shown.current = pathname;
    if (!hash) {
      scrollToTop();
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

export default function App() {
  useEffect(() => {
    const stop = startSmoothScroll();
    // Text reflows once the web fonts land: re-measure every trigger (and every useFits). Here and not at module load,
    // where fonts.ready resolves at once because no font has started loading yet.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return stop;
  }, []);

  return (
    <LangProvider>
      <BrowserRouter>
        <ScrollManager />
        <Navbar />
        <main id="main" tabIndex={-1} className="outline-none">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <div className="grain" aria-hidden="true" />
      </BrowserRouter>
    </LangProvider>
  );
}
