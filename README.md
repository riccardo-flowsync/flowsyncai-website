# FlowSync AI Solutions: website

React 19 + Vite + Tailwind + GSAP, deployed on Vercel. English and Italian.

## Development

```bash
npm install
npm run dev            # site only (the form cannot reach /api locally)
vercel dev             # site + the /api functions
npm run build          # production build
npm run lint
npm test               # lead functions, ClickUp calls stubbed
npm run check:layout   # after a build: 16 screen sizes in EN and IT
```

## Motion

Animations follow normal scrolling. Sections never hold the page in place or add empty scroll distance.
The layout check fails if a scroll hold is introduced, in either language or on any tested screen.

## Pages

- `/`: Hero, Systems, Results, Process, FAQ, Book a call
- `/contact`: the booking block with the form open
- `/privacy`, `/terms`: legal pages; any other URL shows a 404

`vercel.json` rewrites every non-`/api` route to `index.html`.

## Leads

| Function | What it does |
|---|---|
| `api/lead.js` | Contact form. Creates a lead card in ClickUp, or comments on the existing one for that email. |
| `api/cal-booking.js` | Cal.com `BOOKING_CREATED` webhook. Creates a lead card for people who booked without using the form. |

If ClickUp is unreachable the form offers a prefilled email instead.

Environment variables (Vercel, Production and Preview):

| Variable | Value |
|---|---|
| `CLICKUP_API_KEY` | ClickUp personal API token |
| `CAL_WEBHOOK_SECRET` | The secret set on the Cal.com webhook |

Cal.com webhook: URL `https://flowsyncaisolutions.com/api/cal-booking`, trigger "Booking created", same secret.
The embedded calendar's event is set in `src/lib/cal.js`.
