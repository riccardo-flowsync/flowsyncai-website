# FlowSync AI Solutions — Website

React 19 + Vite + Tailwind + GSAP landing page, deployed on Vercel.

## Development

```bash
npm install
npm run dev      # frontend only (form submits will fail locally)
vercel dev       # frontend + /api/waitlist serverless function
npm run build    # production build
```

## Pages

- `/` — landing page (Hero, Features, Services, Philosophy, Protocol, CTA, Waitlist)
- `/privacy`, `/terms`, `/contact` — legal & contact pages, EN/IT toggle

Routing uses `react-router-dom`; `vercel.json` rewrites all non-`/api` routes to `index.html`.

## Form email delivery

The waitlist form and the contact-page form POST to `api/waitlist.js`, a Vercel
serverless function that sends the submission by email via SMTP (nodemailer).

Set these environment variables in the Vercel dashboard (Project → Settings →
Environment Variables):

| Variable | Example |
|---|---|
| `SMTP_HOST` | `smtp.yourprovider.com` |
| `SMTP_PORT` | `587` (or `465` for SSL) |
| `SMTP_USER` | `riccardo@flowsyncaisolutions.com` |
| `SMTP_PASS` | mailbox password / app password |
| `MAIL_TO`   | `riccardo@flowsyncaisolutions.com` |

Without these variables the endpoint returns 500 and the forms show an error
message with a direct mailto fallback.
