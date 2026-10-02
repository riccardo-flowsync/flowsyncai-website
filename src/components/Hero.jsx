import { useRef } from 'react';
import Link from './SiteLink';
import { useCopy } from '../lib/lang';
import { gsap, useGSAP, MOTION_OK, later } from '../lib/motion';

const copy = {
  en: { lines: ['AI that gets', 'work done.'], sub: 'We are an AI automation agency. We build outreach systems and AI agents that take action inside your tools.', book: 'Book a call', explore: 'Explore our services', surface: 'Your tools. Work in motion.', input: 'A task comes in', action: 'The right tools get to work', output: 'The record is updated' },
  it: { lines: ['AI che porta', 'a termine il lavoro.'], sub: 'Siamo un’agenzia di automazione AI. Costruiamo sistemi di outreach e agenti AI che agiscono dentro i tuoi strumenti.', book: 'Prenota una call', explore: 'Esplora i servizi', surface: 'I tuoi strumenti. Il lavoro si muove.', input: 'Arriva una richiesta', action: 'Gli strumenti entrano in azione', output: 'Il record viene aggiornato' },
};
export default function Hero() {
  const t = useCopy(copy);
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, (ctx) => {
      later(ctx, () => {
      gsap.from('.hero-line', { y: 24, opacity: 0.65, duration: 0.5, stagger: 0.055, ease: 'power3.out' });
      gsap.from('.workbench-flow span', { y: 8, opacity: 0.35, duration: 0.28, stagger: 0.12, delay: 0.15, ease: 'power3.out' });
      gsap.to('.hero-workbench', { y: -28, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      }, true);
    });
    return () => mm.revert();
  }, { scope: root });
  return <section ref={root} className="cinematic-hero">
    <div className="page hero-copy">
      <h1 className="cinematic-title">{t.lines.map((line) => <span className="hero-line" key={line}>{line}</span>)}</h1>
      <p className="hero-description">{t.sub}</p>
      <div className="hero-actions"><Link to="/contact" className="btn-primary">{t.book}</Link><Link to="/#systems" className="hero-explore">{t.explore}</Link></div>
    </div>
    <div className="hero-workbench" aria-hidden="true"><div className="workbench-heading">{t.surface}</div><div className="workbench-flow"><span>{t.input}</span><span>{t.action}</span><span>{t.output}</span></div></div>
  </section>;
}
