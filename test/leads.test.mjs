import { test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

// Env first, then import the handlers.
process.env.CLICKUP_API_KEY = 'test-token';
process.env.CAL_WEBHOOK_SECRET = 'whsec_test';
const { POST: postLead } = await import('../api/lead.js');
const { POST: postBooking } = await import('../api/cal-booking.js');

// Ids are written out on purpose: a typo in api/_clickup.js must fail here, not in production.
const OUTREACH = '901522398391';
const MARKETING = '901524072435';
const RICCARDO = 194695054;
const FIELD = {
  EMAIL: 'c73ceeca-37f6-486f-8119-304c310d3b92',
  COMPANY: '7b6a0547-4ce6-4925-9a57-f57bd05f1ee7',
  SOURCE: '45dac931-f965-4cff-913f-5e9323df15cf',
  OWNER: 'f8080e83-bfdb-4420-9c77-6dc2918bb266',
  TRACKER_ROW_KEY: 'c7e7189f-1784-42df-8b80-1c61f9004d4b',
  LAST_INBOUND: '9a0bef0b-a812-4907-9b9e-a91f28a955a3',
  SERVICE_LINE: '4bad6fdf-b3e7-4349-aeb6-a5c70129b0f6',
};
const OPTION = {
  website: '6abc4f24-94ff-47c4-a221-0e6f6ff0c96d',
  riccardo: '24c6ab1a-8896-4261-9f2b-6e66d95cec92',
  'email-system': '2eac7a37-f86e-4f60-86fc-d70d9bb35d29',
  'linkedin-system': '854383f9-290f-49db-bb14-46f7bcf57c3b',
  'ai-marketing': '0339d0e5-eb6c-447c-9165-826518ad85c9',
  'support-agents': '2aba1510-e1a6-451a-9c6a-a1419ce7ce04',
};
const DAY_MS = 24 * 60 * 60 * 1000;

// fetch stub: records every call and answers from a queue. It never reaches the
// network, and an unexpected call throws.
const calls = [];
let queue = [];
globalThis.fetch = async (url, init = {}) => {
  calls.push({
    url: String(url),
    method: init.method ?? 'GET',
    headers: init.headers,
    signal: init.signal,
    body: init.body ? JSON.parse(init.body) : undefined,
  });
  const next = queue.shift();
  if (next === undefined) throw new Error(`unexpected fetch: ${init.method ?? 'GET'} ${url}`);
  if (next instanceof Error) throw next;
  return next;
};
const reply = (status, data) => Response.json(data, { status });
const ok = (data = {}) => reply(200, data);
const willReturn = (...responses) => queue.push(...responses);

beforeEach(() => {
  calls.length = 0;
  queue = [];
  mock.method(console, 'error', () => {}); // handlers log CRM failures; keep the output clean
});
afterEach(() => mock.restoreAll());

const field = (task, id) => task.custom_fields.find((f) => f.id === id)?.value;
const hasField = (task, id) => task.custom_fields.some((f) => f.id === id);
const card = (id, fieldId, value) => ({ id, custom_fields: [{ id: fieldId, value }] });

// ---------- website form ----------

const form = {
  name: 'Jane Doe',
  email: 'jane@acme.com',
  company: 'Acme',
  interest: 'email',
  message: 'Hi there\nSecond line',
  lang: 'it',
  page: '/contact',
};
const submit = (fields = {}, raw) =>
  postLead(
    new Request('http://localhost/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: raw ?? JSON.stringify({ ...form, ...fields }),
    }),
  );

test('form lead with no existing card: one search, one create in Outreach', async () => {
  willReturn(ok({ tasks: [] }), ok({ id: 'new1' }));
  const before = Date.now();
  const res = await submit({ email: '  Jane@Acme.COM ' });
  const after = Date.now();

  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 2);

  const [search, create] = calls;
  const url = new URL(search.url);
  assert.equal(search.method, 'GET');
  assert.equal(url.origin + url.pathname, 'https://api.clickup.com/api/v2/team/90151208907/task');
  assert.deepEqual(url.searchParams.getAll('list_ids[]'), [OUTREACH, MARKETING]);
  assert.equal(url.searchParams.get('include_closed'), 'true');
  assert.deepEqual(JSON.parse(url.searchParams.get('custom_fields')), [
    { field_id: FIELD.TRACKER_ROW_KEY, operator: '=', value: 'jane@acme.com' },
  ]);
  assert.equal(search.headers.Authorization, 'test-token'); // raw token, no "Bearer"
  // Every ClickUp call carries a timeout signal (8s in the helper).
  assert.ok(calls.every((c) => c.signal instanceof AbortSignal && !c.signal.aborted));

  assert.equal(create.method, 'POST');
  assert.equal(create.url, `https://api.clickup.com/api/v2/list/${OUTREACH}/task`);
  assert.equal(create.headers.Authorization, 'test-token');
  const task = create.body;
  assert.equal(task.name, 'Jane Doe');
  assert.equal(task.status, 'replied / to do');
  assert.deepEqual(task.assignees, [RICCARDO]);
  assert.equal(task.due_date_time, true);
  assert.equal(task.notify_all, true);
  assert.ok(task.due_date >= before + DAY_MS && task.due_date <= after + DAY_MS);

  assert.equal(task.custom_fields.length, 7);
  assert.equal(field(task, FIELD.EMAIL), 'jane@acme.com');
  assert.equal(field(task, FIELD.COMPANY), 'Acme');
  assert.equal(field(task, FIELD.SOURCE), OPTION.website);
  assert.equal(field(task, FIELD.OWNER), OPTION.riccardo);
  assert.equal(field(task, FIELD.TRACKER_ROW_KEY), 'jane@acme.com');
  assert.equal(field(task, FIELD.SERVICE_LINE), OPTION['email-system']);
  const inbound = field(task, FIELD.LAST_INBOUND);
  assert.ok(inbound >= before && inbound <= after);

  assert.match(task.markdown_content, /^\*\*Website form\*\* \(it, \/contact\)\n\n- Email: jane@acme\.com\n- Company: Acme\n- Interested in: email\n- Submitted: \d{4}-\d\d-\d\dT[\d:.]+Z\n\n> Hi there\n> Second line$/);
});

for (const [interest, list, service] of [
  ['email', OUTREACH, 'email-system'],
  ['linkedin', OUTREACH, 'linkedin-system'],
  ['marketing', MARKETING, 'ai-marketing'],
  ['support', OUTREACH, 'support-agents'],
  ['unsure', OUTREACH, undefined],
  ['nonsense', OUTREACH, undefined],
  ['constructor', OUTREACH, undefined],
]) {
  test(`interest "${interest}" picks the list and service line`, async () => {
    willReturn(ok({ tasks: [] }), ok({ id: 'new1' }));
    assert.equal((await submit({ interest })).status, 200);
    const create = calls[1];
    assert.equal(create.url, `https://api.clickup.com/api/v2/list/${list}/task`);
    assert.equal(hasField(create.body, FIELD.SERVICE_LINE), Boolean(service));
    if (service) assert.equal(field(create.body, FIELD.SERVICE_LINE), OPTION[service]);
  });
}

test('company is left out of the card when the form has none', async () => {
  willReturn(ok({ tasks: [] }), ok({ id: 'new1' }));
  await submit({ company: '  ' });
  assert.equal(hasField(calls[1].body, FIELD.COMPANY), false);
  assert.doesNotMatch(calls[1].body.markdown_content, /Company/);
});

test('honeypot filled: 200 and no ClickUp call', async () => {
  const res = await submit({ website: 'http://spam.example' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 0);
});

for (const [label, fields] of [
  ['invalid email', { email: 'not-an-email' }],
  ['missing name', { name: '   ' }],
  ['name over 120 characters', { name: 'x'.repeat(121) }],
  ['name that is not a string', { name: 42 }],
  ['email over 254 characters', { email: `${'a'.repeat(250)}@x.io` }],
]) {
  test(`${label}: 400 and no ClickUp call`, async () => {
    const res = await submit(fields);
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: 'invalid' });
    assert.equal(calls.length, 0);
  });
}

for (const [label, raw] of [['malformed JSON', '{oops'], ['a JSON null', 'null']]) {
  test(`${label}: 400 bad_request`, async () => {
    const res = await submit({}, raw);
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: 'bad_request' });
    assert.equal(calls.length, 0);
  });
}

test('over-long company, message and page are clipped', async () => {
  willReturn(ok({ tasks: [] }), ok({ id: 'new1' }));
  await submit({ company: 'c'.repeat(500), message: 'm'.repeat(5000), page: 'p'.repeat(500) });
  const task = calls[1].body;
  assert.equal(field(task, FIELD.COMPANY).length, 160);
  assert.ok(task.markdown_content.includes(`> ${'m'.repeat(3000)}\n`) || task.markdown_content.endsWith(`> ${'m'.repeat(3000)}`));
  assert.ok(task.markdown_content.includes(`(it, ${'p'.repeat(200)})`));
});

test('existing card (Tracker Row Key in another case): comment, no create', async () => {
  willReturn(ok({ tasks: [card('abc123', FIELD.TRACKER_ROW_KEY, 'JANE@Acme.com ')] }), ok({ id: 'c1' }));
  const res = await submit();

  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 2);
  const comment = calls[1];
  assert.equal(comment.method, 'POST');
  assert.equal(comment.url, 'https://api.clickup.com/api/v2/task/abc123/comment');
  assert.equal(comment.body.notify_all, true);
  assert.match(comment.body.comment_text, /Hi there\nSecond line/);
  assert.match(comment.body.comment_text, /Name: Jane Doe/);
  assert.match(comment.body.comment_text, /Email: jane@acme\.com/);
  assert.ok(calls.every((c) => !c.url.includes('/list/')));
});

test('existing card found through the Email field also counts', async () => {
  willReturn(ok({ tasks: [card('abc123', FIELD.EMAIL, 'Jane@Acme.com')] }), ok({ id: 'c1' }));
  assert.equal((await submit()).status, 200);
  assert.equal(calls[1].url, 'https://api.clickup.com/api/v2/task/abc123/comment');
});

test('a search hit for a different email is ignored: create', async () => {
  willReturn(
    ok({ tasks: [card('t1', FIELD.TRACKER_ROW_KEY, 'jane@acme.com.au'), card('t2', FIELD.EMAIL, 'jane@acme.co')] }),
    ok({ id: 'new1' }),
  );
  assert.equal((await submit()).status, 200);
  assert.equal(calls[1].url, `https://api.clickup.com/api/v2/list/${OUTREACH}/task`);
});

test('first create rejected: retry without custom_fields, values kept in the description', async () => {
  willReturn(ok({ tasks: [] }), reply(400, { err: 'Custom field invalid', ECODE: 'FIELD_004' }), ok({ id: 'new1' }));
  const res = await submit();

  assert.equal(res.status, 200);
  assert.equal(calls.length, 3);
  const [, first, second] = calls;
  assert.ok(first.body.custom_fields);
  assert.equal(second.url, first.url);
  assert.equal('custom_fields' in second.body, false);
  assert.equal(second.body.status, 'replied / to do');
  assert.deepEqual(second.body.assignees, [RICCARDO]);
  assert.equal(second.body.due_date, first.body.due_date);
  assert.equal(second.body.due_date_time, true);
  assert.equal(second.body.notify_all, true);
  assert.ok(second.body.markdown_content.startsWith(first.body.markdown_content));
  for (const line of ['Email: jane@acme.com', 'Company: Acme', 'Source: website', 'Owner: Riccardo', 'Tracker Row Key: jane@acme.com', 'Service line: email-system', 'Last inbound: ']) {
    assert.ok(second.body.markdown_content.includes(line), `missing "${line}"`);
  }
});

test('both creates fail: 502, and nothing personal is logged', async () => {
  willReturn(ok({ tasks: [] }), reply(400, { err: 'x' }), reply(500, { err: 'y' }));
  const res = await submit();

  assert.equal(res.status, 502);
  assert.deepEqual(await res.json(), { error: 'crm_unavailable' });
  assert.equal(calls.length, 3);
  const logged = JSON.stringify(console.error.mock.calls.map((c) => c.arguments));
  assert.ok(logged.includes('500'));
  assert.doesNotMatch(logged, /jane|acme|hi there/i);
});

test('create times out: 502 and no retry (the card may already exist)', async () => {
  willReturn(ok({ tasks: [] }), new DOMException('timed out', 'TimeoutError'));
  const res = await submit();
  assert.equal(res.status, 502);
  assert.equal(calls.length, 2);
});

test('search fails: 502 and no create', async () => {
  willReturn(reply(500, { err: 'boom' }));
  const res = await submit();
  assert.equal(res.status, 502);
  assert.deepEqual(await res.json(), { error: 'crm_unavailable' });
  assert.equal(calls.length, 1);
});

test('missing CLICKUP_API_KEY: 502 without calling ClickUp', async () => {
  const key = process.env.CLICKUP_API_KEY;
  delete process.env.CLICKUP_API_KEY;
  try {
    const res = await submit();
    assert.equal(res.status, 502);
    assert.deepEqual(await res.json(), { error: 'crm_unavailable' });
    assert.equal(calls.length, 0);
  } finally {
    process.env.CLICKUP_API_KEY = key;
  }
});

// ---------- Cal.com webhook ----------

const booking = {
  triggerEvent: 'BOOKING_CREATED',
  createdAt: '2026-09-30T10:00:00.000Z',
  payload: {
    uid: 'bk_abc123',
    startTime: '2026-10-06T13:00:00Z', // 15:00 in Rome (CEST)
    endTime: '2026-10-06T13:30:00Z',
    // The attendee name differs on purpose: the card name must come from responses.name.
    attendees: [{ name: 'M. Rossi', email: 'Mario@Rossi.it', timeZone: 'Europe/Rome' }],
    responses: {
      name: { label: 'Your name', value: { firstName: 'Mario', lastName: 'Rossi' }, isHidden: false },
      email: { label: 'Email address', value: ' Mario@Rossi.it ', isHidden: false },
      azienda: { label: 'Azienda', value: 'Rossi Srl', isHidden: false },
      notes: { label: 'Additional notes', isHidden: false }, // Cal.com omits "value" when empty
    },
  },
};
const withPayload = (changes) => ({ ...booking, payload: { ...booking.payload, ...changes } });

const sign = (raw, secret = process.env.CAL_WEBHOOK_SECRET) =>
  createHmac('sha256', secret).update(raw).digest('hex');
const send = (raw, headers = {}) =>
  postBooking(
    new Request('http://localhost/api/cal-booking', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: raw,
    }),
  );
const sendSigned = (event) => {
  const raw = JSON.stringify(event);
  return send(raw, { 'x-cal-signature-256': sign(raw) });
};

test('webhook PING: 200 ignored, no ClickUp call, no signature needed', async () => {
  const ping = { triggerEvent: 'PING', createdAt: '2026-09-30T10:00:00.000Z', payload: { type: 'Test', title: 'Test trigger event' } };
  const res = await send(JSON.stringify(ping));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, ignored: true });
  assert.equal(calls.length, 0);
});

test('webhook with malformed JSON: 400', async () => {
  const res = await send('{oops');
  assert.equal(res.status, 400);
  assert.equal(calls.length, 0);
});

const raw = JSON.stringify(booking);
for (const [label, headers] of [
  ['a wrong signature', { 'x-cal-signature-256': sign(raw, 'other-secret') }],
  ['a signature of a different body', { 'x-cal-signature-256': sign(`${raw} `) }],
  ['a short signature', { 'x-cal-signature-256': 'abc' }],
  ['the "no-secret-provided" placeholder', { 'x-cal-signature-256': 'no-secret-provided' }],
  ['no signature header', {}],
]) {
  test(`BOOKING_CREATED with ${label}: 401, no ClickUp call`, async () => {
    const res = await send(raw, headers);
    assert.equal(res.status, 401);
    assert.equal(calls.length, 0);
  });
}

test('BOOKING_CREATED without CAL_WEBHOOK_SECRET configured: 401', async () => {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  delete process.env.CAL_WEBHOOK_SECRET;
  try {
    const res = await send(raw, { 'x-cal-signature-256': sign(raw, secret) });
    assert.equal(res.status, 401);
    assert.equal(calls.length, 0);
  } finally {
    process.env.CAL_WEBHOOK_SECRET = secret;
  }
});

test('valid booking: card in Outreach, due at the call start, company set', async () => {
  willReturn(ok({ tasks: [] }), ok({ id: 'new1' }));
  const res = await sendSigned(booking);

  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 2);
  assert.equal(calls[0].method, 'GET');
  const create = calls[1];
  assert.equal(create.url, `https://api.clickup.com/api/v2/list/${OUTREACH}/task`);
  const task = create.body;
  assert.equal(task.name, 'Mario Rossi');
  assert.equal(task.due_date, Date.parse('2026-10-06T13:00:00Z'));
  assert.equal(task.due_date_time, true);
  assert.equal(task.status, 'replied / to do');
  assert.deepEqual(task.assignees, [RICCARDO]);
  assert.equal(task.notify_all, true);
  assert.equal(field(task, FIELD.COMPANY), 'Rossi Srl');
  assert.equal(field(task, FIELD.EMAIL), 'mario@rossi.it');
  assert.equal(field(task, FIELD.TRACKER_ROW_KEY), 'mario@rossi.it');
  assert.equal(field(task, FIELD.SOURCE), OPTION.website);
  assert.equal(field(task, FIELD.OWNER), OPTION.riccardo);
  assert.equal(hasField(task, FIELD.SERVICE_LINE), false);
  assert.match(task.markdown_content, /^\*\*Booked a call\*\* for .*15:00 \(Europe\/Rome\)\n\n- Email: mario@rossi\.it\n- Company: Rossi Srl\n\nCal\.com booking bk_abc123$/);
});

test('booking for an email that already has a card: no create', async () => {
  willReturn(ok({ tasks: [card('abc123', FIELD.TRACKER_ROW_KEY, 'MARIO@rossi.it')] }));
  const res = await sendSigned(booking);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, existing: true });
  assert.equal(calls.length, 1);
});

test('booking falls back to the attendee for name and email, and finds company by label', async () => {
  const event = withPayload({
    attendees: [{ name: 'Anna Bianchi', email: 'Anna@Bianchi.it' }],
    responses: { q1: { label: 'Nome della società', value: 'Bianchi SpA' }, location: { label: 'Location', value: { value: 'x' } } },
  });
  willReturn(ok({ tasks: [] }), ok({ id: 'new1' }));
  assert.equal((await sendSigned(event)).status, 200);
  const task = calls[1].body;
  assert.equal(task.name, 'Anna Bianchi');
  assert.equal(field(task, FIELD.EMAIL), 'anna@bianchi.it');
  assert.equal(field(task, FIELD.COMPANY), 'Bianchi SpA');
});

test('booking with no usable email: 200 ignored, no ClickUp call', async () => {
  const event = withPayload({ attendees: [], responses: { email: { label: 'Email', value: 'nope' } } });
  const res = await sendSigned(event);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, ignored: true });
  assert.equal(calls.length, 0);
});

test('booking without a usable start time: 400', async () => {
  const res = await sendSigned(withPayload({ startTime: undefined }));
  assert.equal(res.status, 400);
  assert.equal(calls.length, 0);
});

test('booking when ClickUp is down: 502', async () => {
  willReturn(ok({ tasks: [] }), reply(500, {}), reply(500, {}));
  const res = await sendSigned(booking);
  assert.equal(res.status, 502);
  assert.equal(calls.length, 3);
});
