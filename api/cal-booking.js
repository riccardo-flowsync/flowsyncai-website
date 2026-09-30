// POST /api/cal-booking: Cal.com BOOKING_CREATED webhook -> ClickUp lead card.
// Env: CLICKUP_API_KEY, CAL_WEBHOOK_SECRET (the secret set on the webhook in Cal.com).
import { createHmac, timingSafeEqual } from 'node:crypto';
import { LISTS, EMAIL_RE, findLeadByEmail, createLead } from './_clickup.js';

const COMPANY_RE = /azienda|company|societ/i;

const str = (v) => (typeof v === 'string' ? v.trim() : '');

// A string, or { firstName, lastName } when the event type uses Cal.com's "split name" field.
const personName = (v) =>
  typeof v === 'string' ? v.trim() : [v?.firstName, v?.lastName].map(str).filter(Boolean).join(' ');

// Cal.com signs the raw body: hex HMAC-SHA256 keyed with the webhook secret.
function validSignature(raw, header, secret) {
  const expected = Buffer.from(createHmac('sha256', secret).update(raw).digest('hex'));
  const given = Buffer.from(header);
  // timingSafeEqual throws on different lengths, so compare those first.
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request) {
  const raw = await request.text();
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }

  // Every other event, including Cal.com's "Ping" test, gets a plain 200 (signed or not).
  if (body.triggerEvent !== 'BOOKING_CREATED') return Response.json({ ok: true, ignored: true });

  const secret = process.env.CAL_WEBHOOK_SECRET;
  const signature = request.headers.get('x-cal-signature-256');
  if (!secret || !signature || !validSignature(raw, signature, secret)) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const payload = body.payload ?? {};
  const responses = payload.responses ?? {};
  const attendee = payload.attendees?.[0] ?? {};

  const email = (str(responses.email?.value) || str(attendee.email)).toLowerCase();
  if (!EMAIL_RE.test(email)) return Response.json({ ok: true, ignored: true });
  const name = personName(responses.name?.value) || personName(attendee.name) || email;
  const start = Date.parse(payload.startTime);
  if (Number.isNaN(start)) return Response.json({ error: 'bad_request' }, { status: 400 });

  // ponytail: first field whose key or label looks like a company; an earlier
  // "Company size" style field would win. Pin the field key if the form grows.
  const hit = Object.entries(responses).find(
    ([key, field]) => (COMPANY_RE.test(key) || COMPANY_RE.test(field?.label)) && str(field?.value),
  );
  const company = hit ? str(hit[1].value) : '';

  const when = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Rome',
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(start);
  const uid = str(payload.uid);
  const markdown = [
    `**Booked a call** for ${when} (Europe/Rome)`,
    [`- Email: ${email}`, company && `- Company: ${company}`].filter(Boolean).join('\n'),
    uid && `Cal.com booking ${uid}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  try {
    // Existing card: another system advances its status, so leave it alone.
    if (await findLeadByEmail(email)) return Response.json({ ok: true, existing: true });
    await createLead({ listId: LISTS.OUTREACH, name, email, company, due: start, markdown });
    return Response.json({ ok: true });
  } catch (err) {
    // Error name and status code only, never the attendee's data.
    console.error('cal-booking: ClickUp failed:', err.name, err.reason ?? '');
    return Response.json({ error: 'crm_unavailable' }, { status: 502 });
  }
}
