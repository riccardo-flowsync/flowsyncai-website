import { useCopy } from '../lib/lang';
import ScrollLink from './ScrollLink';

const copy = {
  en: {
    title: 'Meet the person behind FlowSync.',
    intro: 'I’m Riccardo Casale, founder of FlowSync AI Solutions in Rome.',
    body: 'We build and run AI outreach and customer-support systems that take repetitive work off your team.',
    cta: 'Talk to Riccardo',
  },
  it: {
    title: 'La persona dietro FlowSync.',
    intro: 'Sono Riccardo Casale, fondatore di FlowSync AI Solutions a Roma.',
    body: 'Realizziamo e gestiamo sistemi di AI outreach e assistenza clienti per togliere al tuo team il lavoro ripetitivo.',
    cta: 'Parla con Riccardo',
  },
};

export default function About() {
  const t = useCopy(copy);
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 lg:py-24">
      <div className="page grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-20">
        <img
          src="/riccardo-casale.webp"
          alt="Riccardo Casale"
          width="1262"
          height="1246"
          loading="lazy"
          decoding="async"
          className="w-full max-w-[26rem] rounded-xl md:justify-self-end"
        />
        <div className="reading-surface max-w-[32rem]">
          <h2 id="about-title" className="t-h2 max-w-[18ch]">{t.title}</h2>
          <p className="t-lead mt-6 text-fg">{t.intro}</p>
          <p className="mt-4 text-muted">{t.body}</p>
          <ScrollLink to="#book" className="btn-primary mt-8">{t.cta}</ScrollLink>
        </div>
      </div>
    </section>
  );
}
