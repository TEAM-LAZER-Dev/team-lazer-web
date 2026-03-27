-- =====================================================
--  TEAM LAZER LIVE CHAT — Supabase Schema
--  Dieses SQL im Supabase SQL Editor ausführen
-- =====================================================

-- 1. Agents (Team-Mitglieder)
CREATE TABLE IF NOT EXISTS agents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  avatar_url    TEXT,
  is_online     BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Conversations (jede User-Session)
CREATE TABLE IF NOT EXISTS conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      TEXT NOT NULL,
  user_name       TEXT DEFAULT 'Besucher',
  status          TEXT DEFAULT 'bot'
                  CHECK (status IN ('bot','waiting','active','closed')),
  assigned_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Messages
CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type     TEXT NOT NULL CHECK (sender_type IN ('user','bot','agent')),
  sender_name     TEXT,
  sender_avatar   TEXT,
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ──────────────────────────────

ALTER TABLE conversations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents         ENABLE ROW LEVEL SECURITY;

-- Conversations: jeder darf anlegen und lesen (gefiltert per session_id im Client)
CREATE POLICY "anon_insert_conversations" ON conversations
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "anon_select_conversations" ON conversations
  FOR SELECT TO anon, authenticated USING (true);

-- Nur eingeloggte Agenten dürfen Status ändern
CREATE POLICY "agent_update_conversations" ON conversations
  FOR UPDATE TO authenticated USING (true);

-- Messages: jeder darf schreiben und lesen
CREATE POLICY "anon_insert_messages" ON messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "anon_select_messages" ON messages
  FOR SELECT TO anon, authenticated USING (true);

-- Agents: nur eingeloggte sehen die Liste
CREATE POLICY "auth_select_agents" ON agents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "agent_update_own" ON agents
  FOR UPDATE TO authenticated USING (auth.uid() = auth_user_id);

-- ── Realtime aktivieren ──────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE agents;

-- ── Trigger: last_message_at aktuell halten ──────────
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_message
AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION update_conversation_timestamp();
