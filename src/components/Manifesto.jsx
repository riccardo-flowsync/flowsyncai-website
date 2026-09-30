import { useRef } from 'react';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, SplitText, MOTION_OK } from '../lib/motion';

const copy = {
  en: [
    'Hephaestus walked into the fire everyone else ran from, and hammered it into tools.',
    'AI is the fire of our time.',
    'Power without structure is chaos with a price tag.',
    'We are the forge: we shape it into systems that do the work, every day.',
  ],
  it: [
    'Efesto entrò nel fuoco da cui tutti scappavano, e a colpi di martello ne fece strumenti.',
    'L’AI è il fuoco del nostro tempo.',
    'Potenza senza struttura è caos con un prezzo.',
    'Noi siamo la fucina: la trasformiamo in sistemi che fanno il lavoro, ogni giorno.',
  ],
};

export default function Manifesto() {
  const lines = useCopy(copy);
  const { lang } = useLang();
  const root = useRef(null);

  // Words brighten as the reader scrolls through; without motion the text is simply shown
  useGSAP(() => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, () => {
      // aria 'none': the default hides every word and labels a plain div, so the real text would go unread
      const split = SplitText.create('.manifesto-text', { type: 'words', aria: 'none' });
      gsap.fromTo(split.words, { opacity: 0.4 }, {
        opacity: 1,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 55%', scrub: true },
      });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [lang], revertOnUpdate: true });

  return (
    <section ref={root} id="manifesto" className="border-t border-line py-28 lg:py-40">
      <div key={lang} className="manifesto-text page font-serif text-[clamp(1.9rem,1.1rem+3vw,3.5rem)] italic leading-[1.14] tracking-[-0.01em]">
        {lines.map((line) => (
          <p key={line} className="max-w-[26ch] [&:not(:first-child)]:mt-[0.5em]">{line}</p>
        ))}
      </div>
    </section>
  );
}
