// POST /api/lead: website contact form -> ClickUp lead card.
// Env: CLICKUP_API_KEY. Any CRM failure answers 502 so the form can offer its email fallback.
import { LISTS, EMAIL_RE, findLeadByEmail, createLead, commentOnTask } from './_clickup.js';

const DAY_MS = 24 * 60 * 60 * 1000;
// Form "interest" -> ClickUp Service Line ("unsure" has none).
const SERVICE_LINES = {
  email: 'email-system',
  linkedin: 'linkedin-system',
  marketing: 'ai-marketing',
  support: 'support-agents',
};

// Trimmed and clipped string, or '' for anything that is not a string.
const text = (v, max = Infinity) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }

  // Honeypot: real visitors never see the hidden "website" field.
  // ponytail: no rate limit beyond this; add Vercel WAF rules or a KV counter if spam shows up.
  if (text(body.website)) return Response.json({ ok: true });

  const name = text(body.name);
  const email = text(body.email).toLowerCase();
  // 254 is the longest address RFC 5321 allows.
  if (!name || name.length > 120 || email.length > 254 || !EMAIL_RE.test(email)) {
    return Response.json({ error: 'invalid' }, { status: 400 });
  }
  const company = text(body.company, 160);
  const message = text(body.message, 3000);
  const page = text(body.page, 200);
  const lang = text(body.lang) === 'it' ? 'it' : 'en';
  const asked = text(body.interest);
  const interest = Object.hasOwn(SERVICE_LINES, asked) ? asked : 'unsure';

  const rows = [
    ['Email', email],
    ['Company', company],
    ['Interested in', interest],
    ['Submitted', new Date().toISOString()],
  ].filter(([, value]) => value);
  const context = [lang, page].filter(Boolean).join(', ');
  const quoted = message
    .split(/\r?\n/)
    .map((line) => `> ${line}`)
    .join('\n');
  const markdown = [
    `**Website form** (${context})`,
    rows.map(([label, value]) => `- ${label}: ${value}`).join('\n'),
    message && quoted,
  ]
    .filter(Boolean)
    .join('\n\n');
  const note = [
    `New website message (${context})`,
    `Name: ${name}`,
    ...rows.map(([label, value]) => `${label}: ${value}`),
    message && `\n${message}`,
  ]
    .filter(Boolean)
    .join('\n');

  // ponytail: search-then-create is not atomic, so a double submit within a second can
  // make two cards; add an idempotency key if it ever happens.
  // ponytail: no outbox. If ClickUp is down the visitor gets the email fallback and
  // nothing is stored here; add a queue if outages stop being rare.
  try {
    const existing = await findLeadByEmail(email);
    if (existing) {
      await commentOnTask(existing.id, note);
    } else {
      await createLead({
        listId: interest === 'marketing' ? LISTS.MARKETING : LISTS.OUTREACH,
        name,
        email,
        company,
        serviceLine: SERVICE_LINES[interest],
        due: Date.now() + DAY_MS, // reply deadline
        markdown,
      });
    }
    return Response.json({ ok: true });
  } catch (err) {
    // Error name and status code only, never the visitor's data.
    console.error('lead: ClickUp failed:', err.name, err.reason ?? '');
    return Response.json({ error: 'crm_unavailable' }, { status: 502 });
  }
}
