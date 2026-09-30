// Shared ClickUp helpers for the lead endpoints (website form, Cal.com webhook).
// The leading underscore keeps Vercel from deploying this file as a function.
// Env: CLICKUP_API_KEY (personal token, sent raw: no "Bearer").

const API = 'https://api.clickup.com/api/v2';
const TEAM = '90151208907';
const ASSIGNEE = 194695054; // Riccardo
// Always send a status: Outreach Leads' default first status is "pause".
const STATUS = 'replied / to do';

// Outreach and Marketing have identical field ids and statuses.
export const LISTS = { OUTREACH: '901522398391', MARKETING: '901524072435' };

// One email rule for both endpoints: the lowercase email is the join key.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD = {
  EMAIL: 'c73ceeca-37f6-486f-8119-304c310d3b92',
  COMPANY: '7b6a0547-4ce6-4925-9a57-f57bd05f1ee7',
  SOURCE: '45dac931-f965-4cff-913f-5e9323df15cf',
  OWNER: 'f8080e83-bfdb-4420-9c77-6dc2918bb266',
  // Holds the lead's lowercase email; other automations join on it.
  TRACKER_ROW_KEY: 'c7e7189f-1784-42df-8b80-1c61f9004d4b',
  LAST_INBOUND: '9a0bef0b-a812-4907-9b9e-a91f28a955a3', // date, unix ms
  SERVICE_LINE: '4bad6fdf-b3e7-4349-aeb6-a5c70129b0f6',
};
// Dropdown values are sent as the option id.
const SOURCE_WEBSITE = '6abc4f24-94ff-47c4-a221-0e6f6ff0c96d';
const OWNER_RICCARDO = '24c6ab1a-8896-4261-9f2b-6e66d95cec92';
const SERVICE_LINES = {
  'email-system': '2eac7a37-f86e-4f60-86fc-d70d9bb35d29',
  'linkedin-system': '854383f9-290f-49db-bb14-46f7bcf57c3b',
  'ai-marketing': '0339d0e5-eb6c-447c-9165-826518ad85c9',
  'support-agents': '2aba1510-e1a6-451a-9c6a-a1419ce7ce04',
};

// Carries only an HTTP status (or 'no_api_key'), never request data, so callers can log it.
class ClickUpError extends Error {
  constructor(reason) {
    super(`ClickUp ${reason}`);
    this.name = 'ClickUpError';
    this.reason = reason;
  }
}

async function clickup(method, path, body) {
  const key = process.env.CLICKUP_API_KEY;
  if (!key) throw new ClickUpError('no_api_key');
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: key, 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new ClickUpError(res.status);
  return res.json();
}

// First card (either list, closed ones included) whose Tracker Row Key or Email
// field equals `email`, else null. The API only pre-filters on the Tracker Row
// Key; the exact match is done here.
// ponytail: a card with an Email but no Tracker Row Key never passes that filter, so
// hand-made cards are missed; add a second query on the Email field if that matters.
export async function findLeadByEmail(email) {
  const wanted = email.trim().toLowerCase();
  const query = new URLSearchParams();
  query.append('list_ids[]', LISTS.OUTREACH);
  query.append('list_ids[]', LISTS.MARKETING);
  query.set('include_closed', 'true');
  query.set(
    'custom_fields',
    JSON.stringify([{ field_id: FIELD.TRACKER_ROW_KEY, operator: '=', value: wanted }]),
  );
  // ponytail: first page only (100 tasks); an exact-email filter never gets near that.
  const { tasks = [] } = await clickup('GET', `/team/${TEAM}/task?${query}`);
  const matches = (f) =>
    (f.id === FIELD.TRACKER_ROW_KEY || f.id === FIELD.EMAIL) &&
    typeof f.value === 'string' &&
    f.value.trim().toLowerCase() === wanted;
  return tasks.find((t) => t.custom_fields?.some(matches)) ?? null;
}

// `serviceLine` is a SERVICE_LINES key ('email-system', ...); `due` is unix ms.
export async function createLead({ listId, name, email, company, serviceLine, due, markdown }) {
  const now = Date.now();
  // [label, field id, value sent to ClickUp, readable text for the fallback note]
  const fields = [
    ['Email', FIELD.EMAIL, email],
    company && ['Company', FIELD.COMPANY, company],
    ['Source', FIELD.SOURCE, SOURCE_WEBSITE, 'website'],
    ['Owner', FIELD.OWNER, OWNER_RICCARDO, 'Riccardo'],
    ['Tracker Row Key', FIELD.TRACKER_ROW_KEY, email],
    ['Last inbound', FIELD.LAST_INBOUND, now, new Date(now).toISOString()],
    serviceLine && ['Service line', FIELD.SERVICE_LINE, SERVICE_LINES[serviceLine], serviceLine],
  ].filter(Boolean);

  const task = {
    name,
    markdown_content: markdown,
    assignees: [ASSIGNEE],
    status: STATUS,
    due_date: due,
    due_date_time: true,
    notify_all: true,
  };
  const path = `/list/${listId}/task`;
  try {
    return await clickup('POST', path, {
      ...task,
      custom_fields: fields.map(([, id, value]) => ({ id, value })),
    });
  } catch (err) {
    // Retry only when ClickUp answered with an error (typically a field or option it
    // refused). A timeout may still have created the task, and retrying would duplicate it.
    if (typeof err.reason !== 'number') throw err;
    // The card will lack its fields (and the Tracker Row Key), so make noise about it.
    console.error('createLead: fields rejected, retrying without them:', err.reason);
    const lines = fields.map(([label, , value, text = value]) => `- ${label}: ${text}`);
    return clickup('POST', path, {
      ...task,
      markdown_content: `${markdown}\n\n---\nCustom fields (ClickUp rejected them, set by hand):\n${lines.join('\n')}`,
    });
  }
}

export const commentOnTask = (taskId, text) =>
  clickup('POST', `/task/${taskId}/comment`, { comment_text: text, notify_all: true });
