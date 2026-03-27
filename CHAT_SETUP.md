# Live Chat — Setup Anleitung

## Schritt 1 — Supabase Account

1. Gehe auf **supabase.com** → "Start your project" → kostenlosen Account anlegen
2. Neues Projekt erstellen (Name: `team-lazer-chat`, Region: `West EU (Frankfurt)`)
3. Warte ~2 Minuten bis das Projekt bereit ist

## Schritt 2 — Datenbank einrichten

1. Im Supabase Dashboard → **SQL Editor** (links in der Navigation)
2. Den gesamten Inhalt der Datei `supabase-schema.sql` einfügen und ausführen (Run)

## Schritt 3 — API Keys kopieren

1. Im Dashboard → **Project Settings** → **API**
2. Kopiere:
   - `Project URL` → das ist dein `VITE_SUPABASE_URL`
   - `anon / public` key → das ist dein `VITE_SUPABASE_ANON_KEY`

## Schritt 4 — .env Dateien erstellen

**Für die Website** (im Hauptordner):
```
.env (neu erstellen, Kopie von .env.example)
VITE_SUPABASE_URL=https://dein-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=dein_anon_key
```

**Für das Dashboard** (im `chat-dashboard/` Ordner):
```
chat-dashboard/.env (gleiche Werte)
```

## Schritt 5 — Team-Mitglieder anlegen

1. Supabase → **Authentication** → **Users** → "Add user"
2. E-Mail + Passwort für jedes Teammitglied anlegen
3. Dann im **SQL Editor** für jede Person einen Agent-Eintrag erstellen:

```sql
INSERT INTO agents (auth_user_id, name, avatar_url)
VALUES (
  'USER_ID_AUS_AUTH_USERS',  -- zu finden unter Authentication → Users
  'Jon Wagner',
  null  -- oder URL zu einem Profilbild, z.B. 'https://...'
);
```

## Schritt 6 — Website deployen (Netlify)

In Netlify → **Site settings** → **Environment variables** die zwei Variablen hinzufügen:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Dann neu deployen.

## Schritt 7 — Dashboard deployen (Netlify)

1. Neues Netlify-Projekt aus dem `chat-dashboard/` Ordner erstellen
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Die gleichen zwei Environment Variables hinzufügen
5. Custom domain: z.B. `chat.team-lazer.de`

## Schritt 8 — Dashboard im Browser öffnen

1. Gehe auf die Dashboard-URL (z.B. `chat.team-lazer.de`)
2. Mit der E-Mail und dem Passwort aus Schritt 5 einloggen
3. Fertig — eingehende Chats erscheinen automatisch in der Liste

---

## Profilbild für Agenten

Am einfachsten: Bild irgendwo hosten (z.B. in Supabase Storage oder Cloudinary),
dann URL in der `agents` Tabelle eintragen:

```sql
UPDATE agents SET avatar_url = 'https://dein-bild.jpg' WHERE name = 'Jon Wagner';
```

---

## Lokal entwickeln

```bash
# Website
npm install
npm run dev

# Dashboard (in separatem Terminal)
cd chat-dashboard
npm install
npm run dev
```
