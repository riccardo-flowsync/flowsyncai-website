import nodemailer from 'nodemailer';

// Vercel serverless function: emails form submissions (waitlist + contact page)
// to MAIL_TO via SMTP. Required env vars (set in the Vercel dashboard):
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, message, source, website } = req.body || {};

  // Honeypot: real users never fill the hidden "website" field
  if (website) return res.status(200).json({ ok: true });

  if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const clip = (v, n) => String(v ?? '').slice(0, n);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const label = source === 'contact-page' ? 'Contact form' : 'Waitlist';
  const lines = [
    `Source: ${label}`,
    `Name: ${clip(name, 200)}`,
    `Email: ${clip(email, 200)}`,
    `Company: ${clip(company, 200)}`,
    message ? `Message:\n${clip(message, 5000)}` : null,
  ].filter(Boolean);

  try {
    await transporter.sendMail({
      from: `"FlowSync Website" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: clip(email, 200),
      subject: `[FlowSync] New ${label} submission — ${clip(name, 100)}`,
      text: lines.join('\n'),
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Mail send failed:', err.message);
    return res.status(500).json({ error: 'Failed to send' });
  }
}
