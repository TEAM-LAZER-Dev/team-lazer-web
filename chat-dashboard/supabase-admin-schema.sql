-- =====================================================
-- TEAM LAZER — Admin & Profil Schema-Erweiterung
-- =====================================================
-- Ausführen in: Supabase Dashboard → SQL Editor

-- 1. Spalten zur agents-Tabelle hinzufügen
ALTER TABLE agents ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Support';
ALTER TABLE agents ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Jon Wagner als Admin setzen
UPDATE agents
SET is_admin = TRUE,
    role = 'Admin',
    email = 'jon.wagner@team-lazer.de'
WHERE auth_user_id = (
  SELECT id FROM auth.users WHERE email = 'jon.wagner@team-lazer.de'
);

-- 3. E-Mails aller Agents aus auth.users befüllen
UPDATE agents a
SET email = u.email
FROM auth.users u
WHERE a.auth_user_id = u.id
  AND a.email IS NULL;

-- 4. Storage Buckets erstellen
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('agent-avatars', 'agent-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage Policies (alte zuerst löschen um Konflikte zu vermeiden)
DROP POLICY IF EXISTS "agents_upload_chat_images" ON storage.objects;
DROP POLICY IF EXISTS "public_read_chat_images"   ON storage.objects;
DROP POLICY IF EXISTS "agents_upload_avatars"     ON storage.objects;
DROP POLICY IF EXISTS "agents_update_avatars"     ON storage.objects;
DROP POLICY IF EXISTS "public_read_avatars"       ON storage.objects;

CREATE POLICY "agents_upload_chat_images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-images');

CREATE POLICY "public_read_chat_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-images');

CREATE POLICY "agents_upload_avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'agent-avatars');

CREATE POLICY "agents_update_avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'agent-avatars');

CREATE POLICY "public_read_avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'agent-avatars');

-- 6. RLS Policy für agents-Tabelle (alte zuerst löschen)
DROP POLICY IF EXISTS "admin_update_agent_roles" ON agents;

CREATE POLICY "admin_update_agent_roles"
ON agents FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM agents WHERE auth_user_id = auth.uid() AND is_admin = TRUE)
  OR auth_user_id = auth.uid()
);
