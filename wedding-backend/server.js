require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const { randomUUID: uuidv4 } = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const XLSX = require('xlsx');
const cron = require('node-cron');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Multer – memory storage for Excel uploads
const upload = multer({ storage: multer.memoryStorage() });

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ─── Email transporter ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function buildReminderEmail(firstName) {
  return {
    subject: '💍 Reminder: Filip & Matea\'s Wedding is Tomorrow!',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
        <h1 style="font-weight: 300; font-size: 2rem; color: #fff; margin-bottom: 8px;">Filip &amp; Matea</h1>
        <p style="color: #94a3b8; margin-bottom: 32px;">Wedding Reminder</p>
        <p style="font-size: 1.1rem;">Dear ${firstName},</p>
        <p>This is a friendly reminder that you are confirmed for our wedding <strong>tomorrow, August 28th 2026</strong>. We can't wait to celebrate with you!</p>
        <div style="background: #1e293b; border-left: 3px solid #f43f5e; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0 0 8px; color: #94a3b8; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em;">📍 Ceremony</p>
          <p style="margin: 0; font-size: 1.05rem;">Church Sv. Nikola, Varaždin</p>
          <p style="margin: 4px 0 0; color: #94a3b8;">August 28th at 17:30</p>
        </div>
        <div style="background: #1e293b; border-left: 3px solid #06b6d4; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0 0 8px; color: #94a3b8; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em;">🍽️ Reception</p>
          <p style="margin: 0; font-size: 1.05rem;">Restaurant Kneja, Međimurje</p>
          <p style="margin: 4px 0 0; color: #94a3b8;">August 28th at 20:00</p>
        </div>
        <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 32px;">See you tomorrow! 🥂<br/><em>Filip &amp; Matea</em></p>
      </div>
    `,
  };
}

// ─── API: Get invite details by code ─────────────────────────────────────────
app.get('/api/invite/:code', async (req, res) => {
  const { code } = req.params;
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      'SELECT guest_name FROM invites WHERE code = ?',
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Invalid invitation code' });
    }

    res.json({ guestName: rows[0].guest_name });
  } catch (error) {
    console.error('Invite lookup error:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    connection.release();
  }
});

// ─── API: Submit RSVP ────────────────────────────────────────────────────────
app.post('/api/rsvp', async (req, res) => {
  const { firstName, lastName, email, attendance } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.query(
      'INSERT INTO rsvp (first_name, last_name, email, attendance) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email || null, attendance || 'da']
    );

    res.json({ success: true, message: 'RSVP submitted successfully' });
  } catch (error) {
    console.error('RSVP Error:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    connection.release();
  }
});

// ─── API: Get Wedding Date ───────────────────────────────────────────────────
app.get('/api/wedding-date', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT date FROM wedding_date WHERE id = 1');
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Wedding date not set' });
    }
    // Format date as 'YYYY-MM-DDTHH:mm' for input type="datetime-local"
    const dateObj = new Date(rows[0].date);
    const pad = n => n.toString().padStart(2, '0');
    const formatted = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
    res.json({ date: formatted });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  } finally {
    connection.release();
  }
});

// ─── API: Set Wedding Date ─────────────────────────────────────────────────--
app.post('/api/wedding-date', async (req, res) => {
  const { date } = req.body;
  if (!date) return res.status(400).json({ error: 'Missing date' });
  const connection = await pool.getConnection();
  try {
    await connection.query('INSERT INTO wedding_date (id, date) VALUES (1, ?) ON DUPLICATE KEY UPDATE date = VALUES(date)', [date]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  } finally {
    connection.release();
  }
});

// ─── API: Delete an RSVP ─────────────────────────────────────────────────────
app.delete('/api/rsvp/:id', async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.query('DELETE FROM rsvp WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'RSVP not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete RSVP error:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    connection.release();
  }
});

// ─── API: Get all RSVPs ───────────────────────────────────────────────────────
app.get('/api/rsvp-list', async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [rsvps] = await connection.query(
      'SELECT * FROM rsvp ORDER BY created_at DESC'
    );
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  } finally {
    connection.release();
  }
});

// ─── API: Generate invites from Excel ────────────────────────────────────────
app.post('/api/invites/generate', upload.single('file'), async (req, res) => {
  const baseUrl = req.body.baseUrl;

  if (!baseUrl) {
    return res.status(400).json({ error: 'baseUrl is required' });
  }

  let names = [];

  if (req.file) {
    try {
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Accept any non-empty string in the first column (skip header if it's not a name)
      for (const row of rows) {
        const cell = String(row[0] || '').trim();
        if (cell && !/^(name|ime|full.?name|guest)/i.test(cell)) {
          names.push(cell);
        }
      }
    } catch {
      return res.status(400).json({ error: 'Could not parse Excel file' });
    }
  }

  const connection = await pool.getConnection();

  try {
    const results = [];

    // Always generate a general link
    const generalCode = uuidv4();
    await connection.query(
      'INSERT INTO invites (code, guest_name, is_general) VALUES (?, ?, ?)',
      [generalCode, 'General Invitation', true]
    );
    results.push({ name: 'General Invitation', url: `${baseUrl}?invite=${generalCode}`, isGeneral: true });

    for (const name of names) {
      const code = uuidv4();
      await connection.query(
        'INSERT INTO invites (code, guest_name, is_general) VALUES (?, ?, ?)',
        [code, name, false]
      );
      results.push({ name, url: `${baseUrl}?invite=${code}`, isGeneral: false });
    }

    res.json({ success: true, invites: results });
  } catch (error) {
    console.error('Generate invites error:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    connection.release();
  }
});

// ─── API: Send test email ─────────────────────────────────────────────────────
app.post('/api/email/test', async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ error: 'Recipient email is required' });
  }

  const { subject, html } = buildReminderEmail('there');

  try {
    await transporter.sendMail({
      from: `"Filip & Matea 💍" <${process.env.SMTP_USER}>`,
      to,
      subject: `[TEST] ${subject}`,
      html,
    });

    res.json({ success: true, message: `Test email sent to ${to}` });
  } catch (error) {
    console.error('Email send error:', error.message, error.code || '');
    res.status(500).json({ error: `Failed to send email: ${error.message}` });
  }
});

// ─── API: Send reminders to all RSVPs with email ─────────────────────────────
async function sendReminderEmails() {
  const connection = await pool.getConnection();

  try {
    const [guests] = await connection.query(
      "SELECT first_name, email FROM rsvp WHERE email IS NOT NULL AND email != ''"
    );

    const results = { sent: 0, failed: 0, errors: [] };

    for (const guest of guests) {
      const { subject, html } = buildReminderEmail(guest.first_name);
      try {
        await transporter.sendMail({
          from: `"Filip & Matea 💍" <${process.env.SMTP_USER}>`,
          to: guest.email,
          subject,
          html,
        });
        results.sent++;
      } catch (err) {
        results.failed++;
        results.errors.push({ email: guest.email, error: err.message });
      }
    }

    return results;
  } finally {
    connection.release();
  }
}

app.post('/api/email/send-reminders', async (req, res) => {
  try {
    const results = await sendReminderEmails();
    res.json({ success: true, ...results });
  } catch (error) {
    console.error('Send reminders error:', error);
    res.status(500).json({ error: 'Failed to send reminders' });
  }
});

// ─── Cron: Auto-send reminders at 17:30 the day before wedding ───────────────
cron.schedule('30 17 * * *', async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT date FROM wedding_date WHERE id = 1');
    if (rows.length === 0) return;
    const weddingDate = new Date(rows[0].date);
    const now = new Date();
    // If today is the day before the wedding
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    if (
      weddingDate.getFullYear() === tomorrow.getFullYear() &&
      weddingDate.getMonth() === tomorrow.getMonth() &&
      weddingDate.getDate() === tomorrow.getDate()
    ) {
      console.log('[CRON] Sending wedding reminder emails...');
      try {
        const results = await sendReminderEmails();
        console.log(`[CRON] Done — sent: ${results.sent}, failed: ${results.failed}`);
      } catch (err) {
        console.error('[CRON] Error sending reminders:', err);
      }
    }
  } finally {
    connection.release();
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});