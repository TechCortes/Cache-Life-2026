import type { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';

// ---------------------------------------------------------------------------
// Validation helpers (mirrors client-side rules)
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

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

  const body = req.body ?? {};
  const cleanEmail = String(body.email ?? '').trim();
  const cleanPhone = String(body.phone_number ?? '').trim();
  const cleanName  = String(body.name ?? '').trim() || null;

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

    const [result] = await conn.execute<mysql.ResultSetHeader>(
      `INSERT INTO subscribers (email, phone_number, name, subscribed)
       VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE
         phone_number = VALUES(phone_number),
         name         = VALUES(name),
         subscribed   = 1`,
      [cleanEmail, cleanPhone || null, cleanName]
    );

    return res.status(201).json({ message: 'Subscribed successfully.', id: result.insertId });
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: 'Database error.', detail });
  } finally {
    await conn?.end();
  }
}
