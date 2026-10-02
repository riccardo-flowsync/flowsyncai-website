import Hero from '../components/Hero';
import Systems from '../components/Systems';
import Results from '../components/Results';
import Process from '../components/Process';
import FAQ from '../components/FAQ';
import Booking from '../components/Booking';
import ScrollProgress from '../components/ScrollProgress';
import CircuitBackdrop from '../components/CircuitBackdrop';
import { useCopy } from '../lib/lang';

const copy = {
  en: { docTitle: 'FlowSync AI Solutions: AI automation agency' },
  it: { docTitle: 'FlowSync AI Solutions: agenzia di automazione AI' },
};

export default function Home() {
  const t = useCopy(copy);
  return (
    <>
      <title>{t.docTitle}</title>
      <ScrollProgress />
      <div className="relative isolate">
        <CircuitBackdrop />
        <Hero />
        <Systems />
      </div>
      <Results />
      <Process />
      <FAQ />
      <Booking />
    </>
  );
}
