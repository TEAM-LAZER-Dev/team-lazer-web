// ─────────────────────────────────────────────────────────────
// DOWNLOADS & LINKS – hier neue Einträge ergänzen
//
// type:     'file' (Datei zum Download) | 'link' (externer Link, z. B. Discord)
// category: 'programme' | 'discord' | 'tools' | 'sonstiges'
// brand:    'TL' | 'GRL' | 'BEIDE'
// url:      Datei in /public/downloads/ ablegen -> '/downloads/datei.exe'
//           oder externer Link (z. B. GitHub Release). Leer ('') = "Bald verfügbar"
// ─────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { id: 'alle', label: 'Alle', icon: 'fa-solid fa-layer-group' },
  { id: 'programme', label: 'PC-Programme', icon: 'fa-solid fa-computer' },
  { id: 'discord', label: 'Discord', icon: 'fa-brands fa-discord' },
  { id: 'tools', label: 'Tools & Mods', icon: 'fa-solid fa-screwdriver-wrench' },
  { id: 'sonstiges', label: 'Sonstiges', icon: 'fa-solid fa-box-archive' },
]

// Aktuell gibt es keine Downloads – solange die Liste leer ist, wird der Bereich auf der Software-Seite ausgeblendet.
// Vorlage für einen neuen Eintrag:
// {
//   id: 'mein-tool',
//   type: 'file',            // 'file' oder 'link'
//   category: 'programme',
//   brand: 'TL',             // 'TL' | 'GRL' | 'BEIDE'
//   title: 'Mein Tool',
//   desc: 'Kurze Beschreibung.',
//   platform: 'Windows',
//   version: 'v1.0',
//   size: '12 MB',
//   url: '/downloads/mein-tool.exe',
//   icon: 'fa-solid fa-computer',
// },
export const DOWNLOADS = []
