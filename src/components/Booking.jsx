import { lazy, Suspense, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LeadForm from './LeadForm';
import { useCopy, useLang } from '../lib/lang';
import { gsap, useGSAP, MOTION_OK, HOLD, riseOnScroll, drawRule, scrollToEl, later } from '../lib/motion';
import { CAL_LINK } from '../lib/cal';

// If the calendar code cannot be fetched (a tab left open across a deploy), the visitor gets the Cal.com page itself
const CalendarEmbed = lazy(() => import('./CalendarEmbed').catch(() => ({ default: CalendarLink })));
const CAL_URL = `https://cal.com/${CAL_LINK}`;
const PHOTO = null; // '/founder.jpg' once Riccardo sends it
const LINKEDIN = null; // his profile URL once provided

const copy = {
  en: {
    title: 'Book a 30\u2011minute call', // non-breaking hyphen
    sub: 'Sales or support, we’ll see where a system would help.',
    role: 'Founder, FlowSync AI Solutions',
    agenda: [
      'Your sales or customer support today.',
      'Where a system would help, and what it would do.',
      'What happens next, if it makes sense for both of us.',
    ],
    event: 'Intro call with FlowSync AI',
    facts: ['30\u00a0minutes', 'Google Meet', 'Times in your time zone'],
    see: 'See available times',
    note: 'The calendar is provided by Cal.com and loads only when you click. Cal.com may then set its own cookies.',
    privacy: 'Privacy policy',
    loading: 'Loading the calendar…',
    stuck: 'Calendar not loading?',
    stuckLink: 'Open it on Cal.com.',
    call: 'Book a call',
    open: 'Send a message',
    reply: 'We reply within 24\u00a0hours.',
  },
  it: {
    title: 'Prenota una call di 30\u00a0minuti',
    sub: 'Vendite o assistenza: vediamo dove un sistema ti aiuterebbe.',
    role: 'Fondatore, FlowSync AI Solutions',
    agenda: [
      'Come trovi clienti o gestisci l’assistenza oggi.',
      'Dove un sistema ti aiuterebbe, e cosa farebbe.',
      'I prossimi passi, se ha senso per entrambi.',
    ],
    event: 'Call conoscitiva con FlowSync AI',
    facts: ['30\u00a0minuti', 'Google Meet', 'Orari nel tuo fuso orario'],
    see: 'Vedi gli orari disponibili',
    note: 'Il calendario è fornito da Cal.com e si carica solo quando fai clic. Da quel momento Cal.com può impostare i propri cookie.',
    privacy: 'Privacy policy',
    loading: 'Caricamento del calendario…',
    stuck: 'Il calendario non si carica?',
    stuckLink: 'Aprilo su Cal.com.',
    call: 'Prenota una call',
    open: 'Invia un messaggio',
    reply: 'Rispondiamo entro 24\u00a0ore.',
  },
};

// Stands in for the calendar when its code cannot be fetched: the same event, on Cal.com
function CalendarLink() {
  const t = useCopy(copy);
  return (
    <div className="p-8">
      <a href={CAL_URL} target="_blank" rel="noreferrer" className="btn-primary">{t.see}</a>
    </div>
  );
}

// A quiet, static picture of this month so the frame reads as a calendar before it loads. No availability implied.
function MonthPreview({ animate }) {
  const { lang } = useLang();
  const locale = lang === 'it' ? 'it-IT' : 'en-GB';
  const now = new Date();
  const month = new Date(now.getFullYear(), now.getMonth() + (now.getDate() > 20 ? 1 : 0), 1); // late in the month, show the next one
  const today = month.getMonth() === now.getMonth() ? now.getDate() : 0;
  const offset = (month.getDay() + 6) % 7; // weeks start on Monday
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const weekdays = [...Array(7)].map((_, i) => new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(2024, 0, 1 + i)));
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const box = useRef(null);

  // The grid builds at a steady pace when it comes into view, then today’s ring is drawn.
  // Its own scope: the preview unmounts when the real calendar opens, and its triggers go with it. On /contact it stays as drawn.
  useGSAP((context) => animate && later(context, () => {
    const mm = gsap.matchMedia(box.current);
    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: box.current, start: 'top 88%', once: true },
      });
      tl.from('.cal-wd', { opacity: 0, duration: 0.3, stagger: 0.03 })
        .from('.cal-day', { opacity: 0, scale: 0.8, duration: 0.5, stagger: 0.05 }, '>-0.1');
      // A dashed copy draws the ring; once it is done a plain copy takes over, so the finished ring has no seam at the start point.
      // (Two layers instead of an onUpdate that clears the dash: ScrollTrigger refreshes render without callbacks.)
      if (box.current.querySelector('.cal-ring')) {
        tl.fromTo('.cal-ring-draw', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2 }, '>-0.2')
          .fromTo('.cal-ring-done', { opacity: 0 }, { opacity: 1, duration: 0.05 }, '>');
      }
    });
    return () => mm.revert();
  }), { scope: box });

  return (
    <div ref={box} aria-hidden="true" className="select-none">
      <p className="mb-3 text-sm font-medium capitalize text-muted">
        {new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month)}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs tabular-nums">
        {weekdays.map((d, i) => <span key={`w${i}`} className="cal-wd pb-1 text-faint">{d}</span>)}
        {cells.map((d, i) => (
          <span
            key={i}
            className={`${d ? 'cal-day ' : ''}relative grid h-8 place-items-center rounded-md ${
              d === today ? 'text-fg' : d && d > today ? 'bg-raised text-muted' : 'text-faint/60'
            }`}
          >
            {d}
            {d === today && (
              // Today's ring is an outline that can be drawn (same look as the old inset ring): a 2px stroke on the cell edge, half of it clipped by the svg.
              // Plain percentage attributes, so it renders the same everywhere; pathLength 1 lets the scroll drive the dash
              <svg aria-hidden="true" className="cal-ring pointer-events-none absolute inset-0 h-full w-full text-accent">
                <rect className="cal-ring-draw" width="100%" height="100%" rx="6" pathLength="1" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect className="cal-ring-done" width="100%" height="100%" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Booking({ heading = 'h2', formOpen = false }) {
  const Heading = heading; // h1 on the contact page
  const t = useCopy(copy);
  const { lang } = useLang();
  const [calOpen, setCalOpen] = useState(false);
  const [prefill, setPrefill] = useState(null);
  const [writing, setWriting] = useState(formOpen);
  const frame = useRef(null);
  const root = useRef(null);

  // Only the home page section moves: on /contact the heading is the h1 at the top of the page and everything stays still
  useGSAP((context) => heading === 'h2' && later(context, () => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, () => {
      riseOnScroll('.book-title');
      drawRule(root.current);
      // The agenda and its marks draw once, independently of scroll speed.
      gsap.fromTo('.book-agenda', { '--rule': 0 }, {
        '--rule': 1,
        ease: 'none',
        duration: 0.7, scrollTrigger: { trigger: '.book-agenda', start: 'top 90%', once: true },
      });
      gsap.utils.toArray('.book-agenda li').forEach((li) => gsap.from(li.querySelector('.book-mark'), {
        scaleX: 0,
        transformOrigin: 'left center',
        ease: 'none',
        duration: 0.5, scrollTrigger: { trigger: li, start: 'top 95%', once: true },
      }));
    });
    return () => mm.revert();
  }), { scope: root, dependencies: [lang], revertOnUpdate: true });

  // The page's one WebGL moment (a dot field settling into the calendar's grid, see lib/dotField.js). Desktop with a mouse
  // and motion allowed only, fetched when the section is a screen away. Phones, touch and reduced motion get nothing:
  // the settled grid is quiet by design, and a static copy could not keep clear of the text without the same measuring.
  useGSAP(() => {
    if (heading !== 'h2') return undefined;
    const mm = gsap.matchMedia();
    mm.add(HOLD, () => {
      let stop;
      let gone = false;
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        import('../lib/dotField').then(({ default: mount }) => { if (!gone) stop = mount(root.current); }).catch(() => {});
      }, { rootMargin: '100% 0px' });
      io.observe(root.current);
      return () => { gone = true; io.disconnect(); stop?.(); };
    });
    return () => mm.revert();
  }, { scope: root });

  const openCalendar = () => {
    setWriting(false);
    setCalOpen(true);
    requestAnimationFrame(() => scrollToEl(frame.current));
  };

  return (
    <section id="book" ref={root} className="rule isolate py-24 lg:py-32">
      <div className="page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Heading key={lang} className="book-title t-h2">{t.title}</Heading>
          <p className="t-lead mt-5 text-muted">{t.sub}</p>

          <div className="mt-8 flex items-center gap-4">
            {PHOTO ? (
              <img src={PHOTO} alt="" width="56" height="56" className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <span aria-hidden="true" className="grid h-14 w-14 place-items-center rounded-full border border-line bg-raised font-semibold text-muted">RC</span>
            )}
            <div>
              <p className="font-semibold">Riccardo Casale</p>
              <p className="text-sm text-muted">{t.role}</p>
              {LINKEDIN && <a href={LINKEDIN} target="_blank" rel="noreferrer" className="link text-sm">LinkedIn</a>}
            </div>
          </div>

          <ul className="book-agenda rule mt-8 grid gap-3 pt-6 text-muted">
            {t.agenda.map((item) => (
              <li key={item} className="grid grid-cols-[14px_1fr] gap-3">
                <span aria-hidden="true" className="book-mark mt-[0.6em] h-px w-3.5 bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <div className="mb-5 flex flex-wrap gap-3" role="group" aria-label={t.title}>
            <button type="button" aria-pressed={!writing} onClick={() => setWriting(false)} className={!writing ? 'btn-primary' : 'btn-quiet'}>{t.call}</button>
            <button type="button" aria-pressed={writing} onClick={() => setWriting(true)} className={writing ? 'btn-primary' : 'btn-quiet'}>{t.open}</button>
          </div>
          <div hidden={!writing} className="rounded-[10px] border border-line bg-surface p-6 sm:p-8">
            <p className="mb-5 text-sm text-muted">{t.reply}</p>
            <LeadForm onSent={setPrefill} onPickTime={openCalendar} />
          </div>
          <div hidden={writing} ref={frame} className="overflow-hidden rounded-[10px] border border-line bg-surface shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
            {calOpen ? (
              <Suspense fallback={<p className="grid min-h-[560px] place-items-center text-sm text-faint">{t.loading}</p>}>
                <CalendarEmbed prefill={prefill} />
              </Suspense>
            ) : (
              <div className="grid gap-8 p-6 sm:grid-cols-[1fr_minmax(0,17rem)] sm:p-8">
                <div className="flex flex-col">
                  <p className="t-h3">{t.event}</p>
                  <ul className="mt-3 grid gap-1 text-sm text-muted">
                    {t.facts.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  <button type="button" onClick={openCalendar} className="btn-primary mt-8 self-start">{t.see}</button>
                  <p className="mt-5 max-w-[46ch] text-xs leading-relaxed text-faint">
                    {t.note} <Link to="/privacy" className="link">{t.privacy}</Link>
                  </p>
                </div>
                <button type="button" onClick={openCalendar} aria-label={t.see} className="rounded-lg text-left transition-colors hover:bg-raised focus-visible:outline focus-visible:outline-accent"><MonthPreview animate={heading === 'h2'} /></button>
              </div>
            )}
          </div>

          {calOpen && !writing && (
            <p className="mt-3 text-sm text-faint">
              {t.stuck} <a href={CAL_URL} target="_blank" rel="noreferrer" className="link text-fg decoration-faint">{t.stuckLink}</a>
            </p>
          )}


        </div>
      </div>
    </section>
  );
}
