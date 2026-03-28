-- =====================================================
-- TEAM LAZER — team_messages Tabelle
-- Interne DMs zwischen Agenten
-- =====================================================
-- Ausführen in: Supabase Dashboard → SQL Editor

-- 1. Tabelle erstellen
CREATE TABLE IF NOT EXISTS team_messages (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id     UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  receiver_id   UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  content       TEXT NOT NULL,
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index für schnelle Abfragen (Konversations-Suche)
CREATE INDEX IF NOT EXISTS team_messages_pair_idx
  ON team_messages (
    LEAST(sender_id::text, receiver_id::text),
    GREATEST(sender_id::text, receiver_id::text),
    created_at
  );

CREATE INDEX IF NOT EXISTS team_messages_receiver_unread_idx
  ON team_messages (receiver_id, is_read)
  WHERE is_read = FALSE;

-- 3. Row Level Security aktivieren
ALTER TABLE team_messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Agenten können nur Nachrichten lesen, an denen sie beteiligt sind
CREATE POLICY "team_messages_select" ON team_messages
  FOR SELECT USING (
    sender_id   = (SELECT id FROM agents WHERE auth_user_id = auth.uid()) OR
    receiver_id = (SELECT id FROM agents WHERE auth_user_id = auth.uid())
  );

-- Agenten können nur eigene Nachrichten erstellen
CREATE POLICY "team_messages_insert" ON team_messages
  FOR INSERT WITH CHECK (
    sender_id = (SELECT id FROM agents WHERE auth_user_id = auth.uid())
  );

-- Agenten können nur eigene Nachrichten als gelesen markieren (Update nur auf is_read)
CREATE POLICY "team_messages_update" ON team_messages
  FOR UPDATE USING (
    receiver_id = (SELECT id FROM agents WHERE auth_user_id = auth.uid())
  );

-- 5. Realtime für team_messages aktivieren
-- (Im Supabase Dashboard unter Database → Replication → team_messages aktivieren)
-- Oder per SQL:
ALTER PUBLICATION supabase_realtime ADD TABLE team_messages;
