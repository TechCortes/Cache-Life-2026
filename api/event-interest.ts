import type { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
const SLUG_RE  = /^[a-z0-9-]{1,100}$/;

function validateEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return PHONE_RE.test(phone.trim()) && digits.length >= 7 && digits.length <= 15;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body            = req.body ?? {};
  const cleanEmail      = String(body.email       ?? '').trim();
  const cleanPhone      = String(body.phone_number ?? '').trim();
  const cleanName       = String(body.name         ?? '').trim() || null;
  const cleanEventSlug  = String(body.event_slug   ?? '').trim();
  const cleanEventTitle = String(body.event_title  ?? '').trim();

  const errors: Record<string, string> = {};

  if (!cleanEmail) {
    errors.email = 'Email is required.';
  } else if (!validateEmail(cleanEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (cleanPhone && !validatePhone(cleanPhone)) {
    errors.phone_number =
      'Please enter a valid phone number (7–15 digits, optional country code).';
  }

  if (!cleanEventSlug || !SLUG_RE.test(cleanEventSlug)) {
    errors.event_slug = 'Invalid event.';
  }

  if (!cleanEventTitle) {
    errors.event_title = 'Event title is required.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ error: 'Validation failed', fields: errors });
  }

  let conn: mysql.Connection | undefined;
  try {
    conn = await mysql.createConnection({
      host:     process.env.DB_HOST     ?? 'localhost',
      port:     Number(process.env.DB_PORT ?? 3306),
      database: process.env.DB_NAME     ?? 'mydb',
      user:     process.env.DB_USER     ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
    });

    // Upsert subscriber — preserve existing phone/name if new values are null
    await conn.execute<mysql.ResultSetHeader>(
      `INSERT INTO subscribers (email, phone_number, name, subscribed, source)
       VALUES (?, ?, ?, 1, 'whats-happening')
       ON DUPLICATE KEY UPDATE
         phone_number = COALESCE(VALUES(phone_number), phone_number),
         name         = COALESCE(VALUES(name), name),
         subscribed   = 1,
         id           = LAST_INSERT_ID(id)`,
      [cleanEmail, cleanPhone || null, cleanName]
    );

    // Resolve subscriber id (works for both INSERT and UPDATE paths)
    const [rows] = await conn.execute<mysql.RowDataPacket[]>(
      'SELECT id FROM subscribers WHERE email = ?',
      [cleanEmail]
    );
    const subscriberId = rows[0]?.id as number;

    // Record event interest (ignore if already registered for this event)
    await conn.execute(
      `INSERT INTO subscriber_events (subscriber_id, event_slug, event_title)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE event_title = VALUES(event_title)`,
      [subscriberId, cleanEventSlug, cleanEventTitle]
    );

    return res.status(201).json({ message: "You're on the list!" });
  } catch {
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  } finally {
    await conn?.end();
  }
}
