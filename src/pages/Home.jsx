import Hero from '../components/Hero';
import Systems from '../components/Systems';
import Process from '../components/Process';
import FAQ from '../components/FAQ';
import Booking from '../components/Booking';
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
      <Hero />
      <Systems />
      <Process />
      <FAQ />
      <Booking />
    </>
  );
}
