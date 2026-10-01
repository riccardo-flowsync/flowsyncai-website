import Booking from '../components/Booking';
import { useCopy } from '../lib/lang';

const copy = {
  en: { docTitle: 'FlowSync AI Solutions: book a call or write to us' },
  it: { docTitle: 'FlowSync AI Solutions: prenota una call o scrivici' },
};

// Same block as on the home page, with the message form already open.
export default function Contact() {
  const t = useCopy(copy);
  return (
    <div className="pt-16">
      <title>{t.docTitle}</title>
      <Booking heading="h1" formOpen />
    </div>
  );
}
