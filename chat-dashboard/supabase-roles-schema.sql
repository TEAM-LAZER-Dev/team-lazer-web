-- =====================================================
-- TEAM LAZER — Rollen-System
-- =====================================================
-- Ausführen in: Supabase Dashboard → SQL Editor

-- 1. Rollen-Tabelle erstellen
CREATE TABLE IF NOT EXISTS roles (
  id    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name  TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#7c3aed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique index auf name (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS roles_name_unique
  ON roles (LOWER(name));

-- RLS aktivieren
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Jeder Agent darf Rollen lesen
DROP POLICY IF EXISTS "agents_read_roles" ON roles;
CREATE POLICY "agents_read_roles" ON roles FOR SELECT USING (true);

-- Nur Admins dürfen Rollen erstellen/löschen
DROP POLICY IF EXISTS "admin_manage_roles" ON roles;
CREATE POLICY "admin_manage_roles" ON roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM agents WHERE auth_user_id = auth.uid() AND is_admin = TRUE)
  );

-- 2. role_ids Array-Spalte und is_owner zu agents hinzufügen
ALTER TABLE agents ADD COLUMN IF NOT EXISTS role_ids UUID[] DEFAULT '{}';
ALTER TABLE agents ADD COLUMN IF NOT EXISTS is_owner BOOLEAN DEFAULT FALSE;

-- 3. Jon Wagner als Owner markieren (niemals degradierbar)
UPDATE agents
SET is_owner = TRUE, is_admin = TRUE
WHERE auth_user_id = (
  SELECT id FROM auth.users WHERE email = 'jon.wagner@team-lazer.de'
);

-- 4. Standard-Rollen anlegen
INSERT INTO roles (name, color) VALUES
  ('Admin',      '#fbbf24'),
  ('Support',    '#7c3aed'),
  ('Developer',  '#3b82f6'),
  ('Marketing',  '#10b981'),
  ('Vertrieb',   '#f97316')
ON CONFLICT DO NOTHING;

-- 5. Bestehende role TEXT → role_ids migrieren (einmalig)
-- Wer role='Admin' hat bekommt die Admin-Rolle zugewiesen
UPDATE agents
SET role_ids = ARRAY(
  SELECT id FROM roles WHERE LOWER(name) = LOWER(agents.role) LIMIT 1
)
WHERE role IS NOT NULL AND role != '' AND (role_ids IS NULL OR role_ids = '{}');

-- 6. Realtime für roles aktivieren
ALTER PUBLICATION supabase_realtime ADD TABLE roles;
