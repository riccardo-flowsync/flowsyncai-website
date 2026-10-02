import { useRef } from 'react';
import Hero from '../components/Hero';
import CinematicStory from '../components/CinematicStory';
import WorkspaceEnvironment from '../components/WorkspaceEnvironment';
import Link from '../components/SiteLink';
import { useCopy } from '../lib/lang';
import { gsap, useGSAP, MOTION_OK, later } from '../lib/motion';
const copy = {
  en: { process: 'Your process. Built to run.', intro: 'We build around the way your business works.', steps: [['Understand the work', 'We map the task, the tools and where your team makes decisions.'], ['Connect and configure', 'We connect the right tools and set the rules for your business.'], ['Test and launch', 'You see it working, approve the setup and we put it to work.']], close: 'What should your business stop doing by hand?', book: 'Let’s talk', note: 'A 30-minute call about your work and what we can automate.' },
  it: { process: 'Il tuo processo. Pronto a lavorare.', intro: 'Costruiamo intorno al modo in cui lavora la tua azienda.', steps: [['Capiamo il lavoro', 'Mappiamo attività, strumenti e decisioni del tuo team.'], ['Colleghiamo e configuriamo', 'Colleghiamo gli strumenti giusti e impostiamo le regole per la tua azienda.'], ['Testiamo e lanciamo', 'Lo vedi funzionare, approvi la configurazione e lo mettiamo al lavoro.']], close: 'Quale lavoro non vuoi più fare a mano?', book: 'Parliamone', note: 'Una call di 30 minuti sul tuo lavoro e su cosa possiamo automatizzare.' },
};
export default function Home() {
  const t = useCopy(copy), process = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, (ctx) => {
      later(ctx, () => {
      gsap.from('.process-rail', { scaleY: 0, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: process.current, start: 'top 70%', end: 'bottom 80%', scrub: 0.25 } });
      gsap.from('.process-step', { y: 18, stagger: 0.15, ease: 'none', scrollTrigger: { trigger: process.current, start: 'top 80%', end: 'bottom 80%', scrub: 0.3 } });
      });
    });
    return () => mm.revert();
  }, { scope: process });
  return <>
    <div className="workspace-world home-workspace"><WorkspaceEnvironment /><Hero /><div id="systems"><CinematicStory service="outbound" /><CinematicStory service="support" /></div></div>
    <section id="process" ref={process} className="cinematic-process page"><div><h2>{t.process}</h2><p>{t.intro}</p></div><div className="process-sequence"><span className="process-rail" aria-hidden="true"/><ol>{t.steps.map(([title, body], i) => <li className="process-step" key={title}><span className="process-number">{i + 1}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol></div></section>
    <section id="book" className="cinematic-close page"><h2>{t.close}</h2><div><Link to="/contact" className="btn-primary">{t.book}</Link><p>{t.note}</p></div></section>
  </>;
}
