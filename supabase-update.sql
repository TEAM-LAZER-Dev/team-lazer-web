-- =====================================================
--  TEAM LAZER — Datenbank Update
--  Im SQL Editor ausführen
-- =====================================================

-- ── 1. Alte Chats löschen ────────────────────────
TRUNCATE messages CASCADE;
TRUNCATE conversations CASCADE;

-- ── 2. Quick Replies Tabelle ─────────────────────
CREATE TABLE IF NOT EXISTS quick_replies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quick_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agents_read_quick_replies" ON quick_replies
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "agents_write_quick_replies" ON quick_replies
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_read_quick_replies" ON quick_replies
  FOR SELECT TO anon USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE quick_replies;

-- ── 3. Agents Tabelle erweitern ───────────────────
ALTER TABLE agents ADD COLUMN IF NOT EXISTS notify_sound     BOOLEAN DEFAULT TRUE;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS notify_browser   BOOLEAN DEFAULT TRUE;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS push_subscription JSONB DEFAULT NULL;

-- ── 4. Supabase Storage Bucket für Avatare ────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (DROP first to avoid conflicts)
DROP POLICY IF EXISTS "avatars_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "avatars_auth_upload"  ON storage.objects;
DROP POLICY IF EXISTS "avatars_auth_update"  ON storage.objects;
DROP POLICY IF EXISTS "avatars_auth_delete"  ON storage.objects;

CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_auth_upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "avatars_auth_update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'avatars');

CREATE POLICY "avatars_auth_delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'avatars');

-- ── 5. Standard Quick Replies einfügen ───────────
INSERT INTO quick_replies (title, content, sort_order) VALUES
('Begrüßung',     'Hallo! 👋 Willkommen bei Team Lazer. Wie kann ich dir helfen?', 1),
('Einen Moment',  'Einen kurzen Moment bitte, ich schaue direkt nach! 🔍', 2),
('Mehr Infos',    'Danke für dein Interesse! Könntest du mir ein bisschen mehr zu deinem Projekt erzählen? Dann kann ich dir ein genaues Angebot machen.', 3),
('Angebot folgt', 'Verstanden! Wir erstellen dir zeitnah ein individuelles Angebot und melden uns.', 4),
('Verabschiedung','Vielen Dank für deine Anfrage! Wir melden uns so schnell wie möglich. Schönen Tag noch! 😊', 5);
