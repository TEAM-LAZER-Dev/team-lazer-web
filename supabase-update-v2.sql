-- =====================================================
--  TEAM LAZER — Supabase Update v2
--  Im SQL Editor ausführen
-- =====================================================

-- 1. Neue Spalten in conversations
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS user_email  TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS user_topic  TEXT DEFAULT NULL;

-- 2. Schnellantworten leeren (falls noch Voreinstellungen drin)
DELETE FROM quick_replies;
