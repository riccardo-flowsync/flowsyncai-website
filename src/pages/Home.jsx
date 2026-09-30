import Hero from '../components/Hero';
import Systems from '../components/Systems';
import Results from '../components/Results';
import Process from '../components/Process';
import Manifesto from '../components/Manifesto';
import FAQ from '../components/FAQ';
import Booking from '../components/Booking';
import { useCopy } from '../lib/lang';

const copy = {
  en: { docTitle: 'FlowSync AI Solutions: AI systems that book B2B meetings' },
  it: { docTitle: 'FlowSync AI Solutions: sistemi AI che portano appuntamenti B2B' },
};

export default function Home() {
  const t = useCopy(copy);
  return (
    <>
      <title>{t.docTitle}</title>
      <Hero />
      <Systems />
      <Results />
      <Process />
      <Manifesto />
      <FAQ />
      <Booking />
    </>
  );
}
