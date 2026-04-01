require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'portal_db',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET123';

// ── Migrate: add missing columns if they don't exist ──────────────────────────
pool.query(`
  ALTER TABLE users ADD COLUMN IF NOT EXISTS department  VARCHAR(100) DEFAULT 'IT';
  ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url  TEXT;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS position    VARCHAR(100) DEFAULT 'Қызметкер';
  ALTER TABLE users ADD COLUMN IF NOT EXISTS phone       VARCHAR(50);
`).catch(err => console.warn('Migration warning (safe to ignore):', err.message));

// ── Migrate: messages & contacts tables ───────────────────────────────────────
pool.query(`
  CREATE TABLE IF NOT EXISTS messages (
    id          SERIAL PRIMARY KEY,
    sender_id   INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    text        TEXT    NOT NULL,
    read        BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW()
  );

  ALTER TABLE messages DROP COLUMN IF EXISTS sender_name;
  ALTER TABLE messages DROP COLUMN IF EXISTS receiver_name;

  CREATE TABLE IF NOT EXISTS contacts (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL,
    contact_id INTEGER NOT NULL,
    UNIQUE(user_id, contact_id)
  );

  CREATE INDEX IF NOT EXISTS idx_messages_sender   ON messages(sender_id);
  CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
  CREATE INDEX IF NOT EXISTS idx_contacts_user     ON contacts(user_id);
`).catch(err => console.warn('Messages migration warning:', err.message));

// ── LOGIN ─────────────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email және пароль қажет' });

  try {
    if (email === 'admin' && password === 'admin123') {
      const token = jwt.sign({ id: 0, role: 'admin' }, JWT_SECRET);
      return res.json({
        token,
        user: { id: 0, fullname: 'Admin', role: 'admin', email: 'admin', department: 'IT', avatar_url: null },
      });
    }

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'Қолданушы табылмады' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Қате пароль' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        role: user.role,
        email: user.email,
        department: user.department || 'IT',
        avatar_url: user.avatar_url || null,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Серверде техникалық қате' });
  }
});

// ── REGISTER ──────────────────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  const { fullname, email, password, role, department } = req.body;
  if (!fullname || !email || !password)
    return res.status(400).json({ message: 'Барлық өрістер қажет' });

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(409).json({ message: 'Бұл email тіркелген' });

    const hashed = await bcrypt.hash(password, 10);

    try {
      await pool.query(
        'INSERT INTO users (fullname, email, password, role, department) VALUES ($1,$2,$3,$4,$5)',
        [fullname, email, hashed, role || 'employee', department || 'IT'],
      );
    } catch {
      await pool.query(
        'INSERT INTO users (fullname, email, password, role) VALUES ($1,$2,$3,$4)',
        [fullname, email, hashed, role || 'employee'],
      );
    }

    res.json({ message: 'Сәтті қосылды' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Қосу қатесі: ' + err.message });
  }
});

// ── ANNOUNCEMENTS ─────────────────────────────────────────────────────────────
app.get('/api/announcements', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Қате' });
  }
});

app.post('/api/announcements', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Тақырып және мазмұн қажет' });
  try {
    await pool.query('INSERT INTO announcements (title, content) VALUES ($1,$2)', [title, content]);
    res.json({ message: 'Жарияланды' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Қате' });
  }
});

// ── ATTENDANCE ────────────────────────────────────────────────────────────────
app.post('/api/attendance', async (req, res) => {
  const { userId } = req.body;
  try {
    await pool.query('INSERT INTO attendance (user_id) VALUES ($1)', [userId ?? 0]);
    res.json({ message: 'Тіркелді' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Қате' });
  }
});

// ── USERS ─────────────────────────────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, fullname, email, role, department FROM users ORDER BY id ASC',
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Қате' });
  }
});

// ── PASSWORD RESET ────────────────────────────────────────────────────────────
app.post('/api/reset-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email қажет' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.json({ message: 'Жіберілді' });

    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      const resetLink = `http://localhost:3000/reset?token=demo&email=${encodeURIComponent(email)}`;
      await transporter.sendMail({
        from: `"Tulpar Portal" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Tulpar Portal — Парольді қалпына келтіру',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#f4f7fe;border-radius:16px;">
            <h2 style="color:#4318ff;">🐴 Tulpar Portal</h2>
            <p>Сәлем! Парольді қалпына келтіру сұратылды.</p>
            <a href="${resetLink}" style="display:inline-block;padding:14px 28px;background:#4318ff;color:#fff;border-radius:10px;text-decoration:none;font-weight:bold;margin:16px 0;">
              Парольді өзгерту
            </a>
            <p style="color:#a3aed0;font-size:13px;">Егер сіз бұл сұратуды жіберген болмасаңыз, хатты елемеңіз.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.warn('Email send failed:', emailErr.message);
    }

    res.json({ message: 'Жіберілді' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Қате' });
  }
});

// ── AVATAR ────────────────────────────────────────────────────────────────────
app.put('/api/user/avatar', async (req, res) => {
  const { userId, avatarUrl } = req.body;
  try {
    await pool.query('UPDATE users SET avatar_url=$1 WHERE id=$2', [avatarUrl, userId]);
    res.json({ message: 'Жаңартылды' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Қате' });
  }
});

// ═════════════════════════════════════════════════════════════════════════════
// ── MESSAGES ─────────────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

// POST /api/messages/send
// Body: { senderId, receiverId, text }
app.post('/api/messages/send', async (req, res) => {
  const { senderId, receiverId, text } = req.body;

  if (!senderId || !receiverId || !text?.trim())
    return res.status(400).json({ message: 'senderId, receiverId және text міндетті' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, text)
       VALUES ($1, $2, $3)
       RETURNING
         id,
         sender_id   AS "senderId",
         receiver_id AS "receiverId",
         text,
         read,
         created_at  AS "createdAt"`,
      [senderId, receiverId, text.trim()],
    );

    const sender = await pool.query(
      'SELECT fullname, avatar_url FROM users WHERE id = $1',
      [senderId],
    );

    res.status(201).json({
      success: true,
      message: {
        ...rows[0],
        senderName:   sender.rows[0]?.fullname   || 'Белгісіз',
        senderAvatar: sender.rows[0]?.avatar_url || null,
      },
    });
  } catch (err) {
    console.error('Messages/send error:', err);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// GET /api/messages/:userId?withUser=<id>&limit=50&before=<msgId>
app.get('/api/messages/:userId', async (req, res) => {
  const userId   = parseInt(req.params.userId);
  const withUser = parseInt(req.query.withUser);
  const limit    = parseInt(req.query.limit)  || 50;
  const before   = parseInt(req.query.before) || null;

  if (!userId || !withUser)
    return res.status(400).json({ message: 'userId және withUser міндетті' });

  try {
    const params = [userId, withUser, withUser, userId, limit];
    const beforeClause = before ? `AND m.id < $${params.push(before)}` : '';

    const { rows: messages } = await pool.query(
      `SELECT
         m.id,
         m.sender_id   AS "senderId",
         m.receiver_id AS "receiverId",
         m.text,
         m.read,
         m.created_at  AS "createdAt",
         u.fullname    AS "senderName",
         u.avatar_url  AS "senderAvatar"
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE (
         (m.sender_id = $1 AND m.receiver_id = $2)
         OR
         (m.sender_id = $3 AND m.receiver_id = $4)
       )
       ${beforeClause}
       ORDER BY m.created_at DESC
       LIMIT $5`,
      params,
    );

    // Оқылды деп белгілейміз
    await pool.query(
      `UPDATE messages SET read = TRUE
       WHERE receiver_id = $1 AND sender_id = $2 AND read = FALSE`,
      [userId, withUser],
    );

    res.json({
      messages: messages.reverse(),
      hasMore:  messages.length === limit,
    });
  } catch (err) {
    console.error('Messages/get error:', err);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// ═════════════════════════════════════════════════════════════════════════════
// ── CONTACTS ─────────────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

// GET /api/contacts/:userId
app.get('/api/contacts/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (!userId) return res.status(400).json({ message: 'userId міндетті' });

  try {
    const { rows } = await pool.query(
      `SELECT
         u.id,
         u.fullname,
         u.avatar_url                AS avatar,
         last_msg.text               AS "lastMessage",
         last_msg.created_at         AS "lastMessageTime",
         last_msg.sender_id          AS "lastMessageSenderId",
         (
           SELECT COUNT(*) FROM messages
           WHERE sender_id = u.id
             AND receiver_id = $1
             AND read = FALSE
         )::int                      AS "unreadCount"
       FROM contacts c
       JOIN users u ON u.id = c.contact_id
       LEFT JOIN LATERAL (
         SELECT text, created_at, sender_id
         FROM messages
         WHERE
           (sender_id = $1 AND receiver_id = u.id)
           OR
           (sender_id = u.id AND receiver_id = $1)
         ORDER BY created_at DESC
         LIMIT 1
       ) last_msg ON TRUE
       WHERE c.user_id = $1
       ORDER BY last_msg.created_at DESC NULLS LAST`,
      [userId],
    );

    res.json({ contacts: rows });
  } catch (err) {
    console.error('Contacts/get error:', err);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// POST /api/contacts/add
// Body: { userId, contactId }
app.post('/api/contacts/add', async (req, res) => {
  const { userId, contactId } = req.body;

  if (!userId || !contactId || userId === contactId)
    return res.status(400).json({ message: 'Жарамды userId және contactId жіберіңіз' });

  try {
    await pool.query(
      `INSERT INTO contacts (user_id, contact_id) VALUES ($1,$2),($2,$1)
       ON CONFLICT DO NOTHING`,
      [userId, contactId],
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Contacts/add error:', err);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
app.listen(5000, () => console.log('Backend 5000 портында қосулы 🚀'));