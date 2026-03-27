# TEAM LAZER – React Setup

## 1. Node.js installieren
Gehe auf https://nodejs.org → **LTS Version** herunterladen und installieren.
Nach der Installation VS Code neu starten.

## 2. Abhängigkeiten installieren
Terminal in VS Code öffnen (Strg + ö) und im Projektordner ausführen:
```
npm install
```
Das lädt React, Vite, Framer Motion usw. (einmalig, ca. 30 Sek.)

## 3. Lokale Entwicklung starten
```
npm run dev
```
Öffnet die Seite unter http://localhost:5173 – mit Live-Reload.

## 4. Für Netlify bauen
```
npm run build
```
Erstellt den `dist/` Ordner. Netlify macht das automatisch beim Deploy.

## 5. Netlify einrichten
In Netlify unter **Site settings → Build & Deploy** sicherstellen:
- Build command: `npm run build`
- Publish directory: `dist`

Das `netlify.toml` in diesem Projekt setzt das automatisch.
