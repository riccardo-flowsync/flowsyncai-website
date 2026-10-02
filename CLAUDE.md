# FlowSync AI Solutions website

Marketing site for FlowSync AI Solutions, an AI automation agency in Rome. Its job is to help the right B2B visitor understand the work, review evidence and book a call. The approved 2026-10-02 redesign has four core pages: home, AI outreach, AI agents and contact. Privacy and terms remain separate legal pages.

The site is live at https://flowsyncaisolutions.com on Vercel. This repository is public: never commit secrets, personal data or internal tooling names.

## Stack and commands

React 19, Vite 7, Tailwind 3.4, GSAP 3.14 (ScrollTrigger, SplitText, `@gsap/react`), Lenis, Three.js and `@calcom/embed-react`. Two serverless functions in `api/` (Vercel, Node).

```
npm run dev            # site only; the form needs `vercel dev` to reach api/
npm run build
npm run lint
npm test               # api/ logic with fetch stubbed, no network
npm run check:layout   # after build: 19 screen sizes x EN/IT, fails on overflow or clipped text
```

Vercel builds every branch as a preview and `main` as production. Work on a branch, open a PR, inspect the preview and merge only with the owner's approval. Production changes require the owner's OK.

## The experience

- Home introduces the agency, then shows AI outreach and AI agents as separate services, explains the setup process and leads to booking.
- `/sales-outreach` explains cold-email outreach and contains its campaign evidence.
- `/customer-support` explains AI agents and contains the support examples and records. The role can cover customer support or agreed repeatable office work, within the tools and permissions configured for it.
- `/contact` keeps the existing call booking and message form. The calendar loads only after the visitor asks to see available times.
- The header groups the two services under Services. It retains the logo, language switch and booking action. On mobile, Services expands into a grouped menu.
- `/privacy` and `/terms` remain available in English and Italian. The old `/results` and `/how-we-work` pages are no longer in the page or sitemap inventory. Legacy links redirect: `/results?view=support` to `/customer-support#results`, `/results?view=outbound` to `/sales-outreach#results`, bare `/results` to `/#systems`, and `/how-we-work` to `/#process`. The same paths retain `/en` and `/it` when present. Client routing also handles legacy links in local previews.

## Visual system

- Keep the FlowSync identity and Mona Sans. The visual world is a graphite workspace with sculpted tool surfaces, directional white and lavender light, and readable type. Existing logo stays.
- Colors (`tailwind.config.js`): canvas `#0a0a0b`, surface `#121214`, raised `#17161b`, line `#232227`, fg `#f4f3ed`, muted `#b3b1aa`, faint `#82817c`, accent `#9d7cff`.
- Accent is a signal for actions and key figures, not decoration. IBM Plex Mono is for machine output inside illustrations. Fonts are self-hosted.
- Reuse `.page`, `.t-display`, `.t-h2`, `.t-h3`, `.t-lead`, `.btn-primary`, `.btn-quiet`, `.link` and `.field` from `src/index.css` where they fit.
- Keep text plain and sentence case. Avoid fake system-status labels, glows, gradient text, glass blur, decorative all-caps labels, invented metrics, looping marquees and motion that does not explain the work.
- Label synthetic demonstrations as illustrative. Keep real evidence distinct from invented example names, messages and records.

## Motion and fallback

- Three.js runs in an OffscreenCanvas worker; keep shader preparation off the main thread. Drawing is on demand and stops while the workspace or document is hidden. Browsers without worker canvas support use the readable HTML composition.

- `WorkspaceEnvironment` dynamically loads one Three.js scene when its workspace approaches the viewport. Its camera and architectural surfaces follow normal page scroll through a scheduled animation frame. It does not run an endless animation or capture the wheel.
- Readable work surfaces, examples, headings and controls are HTML. CSS provides the workspace backdrop if WebGL is unavailable or loses its context. Reduced motion skips WebGL and GSAP motion; the content and actions remain available.
- GSAP scenes scrub with scrolling and reverse naturally. The desktop workspace scene may hold its work surface while the visitor scrolls through it. Smaller screens use a simpler flow. Never pin the whole page or intercept scrolling.
- Lenis runs only for mouse and trackpad input, and is disabled for reduced motion and touch. Use `scrollToEl` and `lockScroll` from `src/lib/motion.js` for section navigation and overlays.
- Use `useGSAP` with a scope. Put motion inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`; no-JS, reduced motion and failed WebGL must show useful finished content.
- Keep the existing keyboard, touch and focus behavior for navigation, forms, FAQ and booking. New dropdown behavior must open by hover, click or keyboard, and close on Escape or outside interaction.
- No fixed-height content boxes, horizontal offsets outside the viewport or clipped text. `npm run check:layout` covers 320x568 through 2560x1440 in EN and IT.

## Copy and evidence

Every component keeps its copy at the top as `{ en: {...}, it: {...} }` and reads it with `useCopy`. Language is the URL prefix when present, otherwise the saved choice, browser language, then English (`src/lib/lang.js`). Use Italian with "tu".

What the site may claim:

- Current services include cold-email outbound and AI agents. LinkedIn is a source for finding buyers, not a channel FlowSync runs for clients.
- Outbound replies are prepared for human review by default, never claim they are always approved. Support agents can act within agreed tool access and pass unresolved cases to the team.
- Campaign figures must match the dated evidence in `src/components/Results.jsx`, remain anonymized, and describe real campaigns rather than "clients". Compare like with like; do not place a headline reply rate beside an unlike market benchmark.
- Support figures come from each agent's dated chat records, anonymized by trade and country. Time saved is an estimate, not a measurement: call it "up to" and keep its method and source with it.
- No prices, fee structure, guarantees, contract length, "GDPR compliant", client names or testimonials.

## Leads and legal

- `api/lead.js` validates contact forms, drops honeypot hits, comments on an existing ClickUp card by email, or creates a card assigned to the owner with a 24-hour reply due date.
- `api/cal-booking.js` checks the Cal.com `BOOKING_CREATED` signature and creates a card for new people only. `api/_clickup.js` contains shared ClickUp calls and is not deployed as a function.
- Vercel Production and Preview need `CLICKUP_API_KEY` and `CAL_WEBHOOK_SECRET`. Never expose them as `VITE_*`.
- `CAL_LINK` lives in `src/lib/cal.js`; preserve click-to-load calendar behavior for privacy.
- Every page shows "FlowSync AI Solutions di Riccardo Casale", "P.IVA 18068831009" and "Roma, Italia" in the footer. Update the privacy or terms date when its content changes.
