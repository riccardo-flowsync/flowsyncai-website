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
  fade-up on every section, invented metrics.
- Proof beats adjectives: figures come from the dated case studies; illustrations say they are illustrations.

## Motion

- One big moment: the hero headline rises line by line, then the workflow trace plays once and stays on its finished run (it pauses while off screen).
- Small ones: Systems index follows the reader, Results totals count up and bars grow, the Process line draws,
  FAQ answers slide open, magnetic primary button.
- Use `useGSAP` with a scope; set hidden states inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`
  so reduced motion and no-JS show finished content. Never hide content with CSS classes.
- SplitText headings get `key={lang}` and `revertOnUpdate: true` so the language switch re-splits them.
- Lenis runs on mouse/trackpad only; scroll via `scrollToEl` / `lockScroll` in `src/lib/motion.js`.

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
