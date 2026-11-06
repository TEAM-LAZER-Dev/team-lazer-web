// ─────────────────────────────────────────────────────────────
// DOWNLOADS & LINKS – hier neue Einträge ergänzen
//
// type:     'file' (Datei zum Download) | 'link' (externer Link, z. B. Discord)
// category: 'programme' | 'discord' | 'tools' | 'sonstiges'
// brand:    'TL' | 'GRL' | 'BEIDE'
// url:      Datei in /public/downloads/ ablegen -> '/downloads/datei.exe'
//           oder externer Link (z. B. GitHub Release). Leer ('') = "Bald verfügbar"
// ─────────────────────────────────────────────────────────────
import { LINKS } from './site'

export const CATEGORIES = [
  { id: 'alle', label: 'Alle', icon: 'fa-solid fa-layer-group' },
  { id: 'programme', label: 'PC-Programme', icon: 'fa-solid fa-computer' },
  { id: 'discord', label: 'Discord', icon: 'fa-brands fa-discord' },
  { id: 'tools', label: 'Tools & Mods', icon: 'fa-solid fa-screwdriver-wrench' },
  { id: 'sonstiges', label: 'Sonstiges', icon: 'fa-solid fa-box-archive' },
]

export const DOWNLOADS = [
  {
    id: 'tl-discord',
    type: 'link',
    category: 'discord',
    brand: 'TL',
    title: 'TEAM LAZER Discord',
    desc: 'Unsere Community: Support, Projekte, Bots und gemeinsames Zocken.',
    url: LINKS.tlDiscord,
    icon: 'fa-brands fa-discord',
  },
  {
    id: 'grl-discord',
    type: 'link',
    category: 'discord',
    brand: 'GRL',
    title: 'German Rising League Discord',
    desc: 'Die GRL-Community mit Ranking, Voice-Räumen und Events.',
    url: LINKS.grlDiscord,
    icon: 'fa-brands fa-discord',
  },
  {
    id: 'tl-dashboard',
    type: 'file',
    category: 'programme',
    brand: 'TL',
    title: 'TEAM LAZER Dashboard',
    desc: 'Desktop-App zum Verwalten von Bots und Projekten.',
    platform: 'Windows',
    version: 'v1.0',
    size: '—',
    url: '', // z. B. '/downloads/TEAM-LAZER-Dashboard.exe'
    icon: 'fa-solid fa-gauge-high',
  },
  {
    id: 'grl-launcher',
    type: 'file',
    category: 'programme',
    brand: 'GRL',
    title: 'GRL Launcher',
    desc: 'Start-Programm für den GRL Discord Shooter und GRL-Tools.',
    platform: 'Windows',
    version: 'Beta',
    size: '—',
    url: '',
    icon: 'fa-solid fa-rocket',
  },
  {
    id: 'asset-pack',
    type: 'file',
    category: 'sonstiges',
    brand: 'BEIDE',
    title: 'Logo- & Banner-Paket',
    desc: 'Offizielle Logos und Banner von TEAM LAZER und GRL (PNG/WebP).',
    platform: 'Alle',
    version: '2026',
    size: '—',
    url: '',
    icon: 'fa-solid fa-image',
  },
]
