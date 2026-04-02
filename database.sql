-- 1. Қолданушылар кестесіне аватар бағанын қосу
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

-- 2. Хабарламалар кестесі (болмаса, құрылады)
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Келу-кету кестесі (Attendance)
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    check_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Чат хабарламалары кестесі
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver_name VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    time VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Чат контактілері кестесі
CREATE TABLE IF NOT EXISTS chat_contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(255),
    UNIQUE(user_id, contact_name)
);

-- ── ЖАҢА: messages кестесіне жетіспеген бағандар ─────────────────────────────
ALTER TABLE messages ADD COLUMN IF NOT EXISTS receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT FALSE;

-- ── ЖАҢА: contacts кестесі (chat_contacts бөлек қалады) ──────────────────────
CREATE TABLE IF NOT EXISTS contacts (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, contact_id)
);

-- ── ЖАҢА: индекстер ───────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_messages_sender   ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_contacts_user     ON contacts(user_id);

-- Тексеру
SELECT * FROM users;
SELECT * FROM announcements;
SELECT * FROM attendance;
SELECT * FROM messages;
SELECT * FROM chat_contacts;
SELECT * FROM contacts;
