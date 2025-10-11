require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// API: Submit RSVP
app.post('/api/rsvp', async (req, res) => {
  const { firstName, lastName, inviteCode } = req.body;
  
  if (!firstName || !lastName || !inviteCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const connection = await pool.getConnection();
  
  try {
    // Verify invite code exists
    const [invite] = await connection.query(
      'SELECT * FROM invites WHERE code = ?',
      [inviteCode]
    );
    
    if (invite.length === 0) {
      return res.status(401).json({ error: 'Invalid invitation code' });
    }

    // Insert RSVP
    await connection.query(
      'INSERT INTO rsvp (first_name, last_name, invite_code) VALUES (?, ?, ?)',
      [firstName, lastName, inviteCode]
    );
    
    res.json({ success: true, message: 'RSVP submitted successfully' });
  } catch (error) {
    console.error('RSVP Error:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    connection.release();
  }
});

// API: Get all RSVPs (for admin view)
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

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});