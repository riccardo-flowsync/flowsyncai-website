# FlowSync AI Solutions website

Marketing site for FlowSync AI Solutions (Rome). Its one job: get the right B2B visitor to book a call.
Live at https://flowsyncaisolutions.com (Vercel). This repository is public: never commit secrets,
personal data, or internal tooling names.

## Stack and commands

React 19, Vite 7, Tailwind 3.4, GSAP 3.14 (ScrollTrigger, SplitText, `@gsap/react`), Lenis, `@calcom/embed-react`.
Two serverless functions in `api/` (Vercel, Node).

```
npm run dev            # site only; the form needs `vercel dev` to reach api/
npm run build
npm run lint
npm test               # api/ logic with fetch stubbed, no network
npm run check:layout   # after build: 16 screen sizes x EN/IT, fails on overflow or clipped text
```

Deploy: Vercel builds every branch as a preview and `main` as production. Work on a branch, open a PR,
check the preview, merge only with the owner's OK.

## Design system (keep it; the old site was a viral AI template and looked like one)

- Colors (`tailwind.config.js`): canvas `#0a0a0b`, surface `#121214`, raised `#17161b`, line `#232227`,
  fg `#f4f3ed`, muted `#b3b1aa`, faint `#82817c` (lowest contrast allowed for text), accent `#9d7cff`.
  Accent is a signal (primary button, live state, key figures), never decoration.
- Type: Mona Sans Variable for everything, headings at `font-stretch: 112%`. IBM Plex Mono only for machine
  output inside illustrations. Fonts are self-hosted (Fontsource).
- Classes in `src/index.css`: `.page`, `.t-display`, `.t-h2`, `.t-h3`, `.t-lead`, `.btn-primary`, `.btn-quiet`,
  `.link`, `.field`.
- Never: glass/backdrop blur, glows, gradient text, pulsing status dots, fake "system online" labels,
  all-caps or monospace labels, eyebrow labels above headings, one accented word in a headline, arrows
  appended to links, metadata joined with middle dots, numbered markers on things that are not a sequence,
  fade-up on every section, invented metrics, horizontal-scroll galleries, stacked-card piles, mesh gradients or
  WebGL colour washes, scrolling marquees, looping "live" ticks.
- Proof beats adjectives: figures come from the dated case studies; illustrations say they are illustrations.

## Motion

Every scroll shows something new: the moving parts follow the scroll (scrub, and rewind on the way back), they do not
just play once. Owner's decision 2026-09-30; built in levels, each only if Lighthouse stays >= 90: A scroll story with
GSAP, then B illustrated extras (SVG morphs, a picture per Process step), then C one light WebGL moment.

- The hero example card is the one exception to scroll-driven motion: it plays on its own and loops (each step lights in
  turn, the finished run holds, then it restarts), paused off screen. Owner's decision 2026-10-06: scrubbing it felt off.
- Held scenes, pinned and scrubbed: the Systems stage (the picture
  starts filling in as it scrolls up, the inbox sorts, a reply drafts, "Approve" is pressed last, then the chat reply
  types); the Process walk (the line draws, each step rises as the line reaches it).
- Every other section gets one scroll moment of its own: Results bars grow against the market bar and the totals build
  from the campaign rows; section rules and FAQ dividers draw in; the booking calendar builds; a thin progress line runs
  down the page edge. Headings rise through a line mask with one signature ease. The form draws a tick when sent.
- Pin only with a mouse or trackpad (`(pointer: fine)`) and only when the section fits the screen below the navbar.
  Phones, touch tablets and short screens get a simple scrub or the finished state. Never capture the wheel page-wide.
  Held distance in total stays around 6 screens.
- Scrubbed numbers end exactly on the printed figures. Unlike metrics never count up in one comparable column.
- Use `useGSAP` with a scope; set hidden states inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`
  so reduced motion and no-JS show finished content. Never hide content with CSS classes. A state that only exists
  inside an animation (a chip lighting up, a label that swaps) is not content: mark it `data-motion-only`.
- Late height changes (a heading re-split after a resize, an FAQ answer opening) re-measure every trigger through the
  body ResizeObserver in `src/lib/motion.js`: no per-component `ScrollTrigger.refresh()` for that.
- SplitText headings get `key={lang}` and `revertOnUpdate: true` so the language switch re-splits them.
- Lenis runs on mouse/trackpad only; scroll via `scrollToEl` / `lockScroll` in `src/lib/motion.js`.
- After every motion change: Lighthouse mobile home >= 90, and `npm run check:layout` including the held states.

## Responsive rules

No fixed-height content boxes, no horizontal offsets that start outside the screen, text must never be clipped.
`npm run check:layout` covers 320x568 up to 2560x1440, including landscape phones, in both languages.

## Copy and languages

Every component keeps its copy at the top as `{ en: {...}, it: {...} }` and reads it with `useCopy`.
Language = saved choice, else the browser language, else English (`src/lib/lang.js`). Sentence case, plain
words, short sentences, numbers as digits, Italian with "tu".

What the site may claim:
- Only services that run for clients today: outbound on cold email, and support agents on website chat and
  Instagram. LinkedIn is where buyers are found, not a channel we run.
- Human approval of outbound replies is "by default", never "always". Chat agents answer on their own and hand
  over through a ticket.
- Case-study figures exactly as the dated case-study pack prints them, anonymised, framed as real campaigns
  (never "clients"). Never put a headline reply rate next to the market benchmark: the bars compare like with like.
- Support-agent figures come from each agent's own chat records, dated, anonymised by trade and country. Time saved is
  never measured: show it only as "up to", labelled an estimate, with its method and source in the note.
- No prices, fee structure, guarantees, contract length, "GDPR compliant", client names or testimonials.

## Leads

- `api/lead.js`: the contact form. Validates, drops honeypot hits, finds an existing card by email and comments
  on it, otherwise creates a card in the CRM (ClickUp) assigned to the owner with a 24-hour reply due date.
- `api/cal-booking.js`: Cal.com `BOOKING_CREATED` webhook, signature checked, creates a card for new people only.
- `api/_clickup.js`: shared ClickUp calls (not deployed as a function).
- Env vars (Vercel, Production + Preview): `CLICKUP_API_KEY`, `CAL_WEBHOOK_SECRET`. Never expose them as `VITE_*`.
- The Cal.com calendar loads only after the visitor clicks (privacy); `CAL_LINK` lives in `src/lib/cal.js` (not in the embed file, so Booking can link to it without loading the embed).

## Legal

Every page shows "FlowSync AI Solutions di Riccardo Casale", "P.IVA 18068831009", "Roma, Italia" in the footer
(Italian law). Privacy and terms pages exist in English and Italian; update their date when their content changes.
