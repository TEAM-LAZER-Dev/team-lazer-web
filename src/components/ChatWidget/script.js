// =====================================================
//  TEAM LAZER CHAT — Bot Script (regelbasiert)
//  Jeder Step hat: messages[] und options[]
//  'action: connect' startet die Live-Chat-Übergabe
// =====================================================

export const STEPS = {

  welcome: {
    messages: [
      { delay: 0,    text: 'Hey! 👋 Willkommen bei TEAM LAZER.' },
      { delay: 900,  text: 'Ich kann dir direkt weiterhelfen oder dich mit unserem Team verbinden. Worum geht es?' },
    ],
    options: [
      { id: 'website',    label: '💻 Website entwickeln' },
      { id: 'discord',    label: '🤖 Discord Bot' },
      { id: 'automation', label: '⚙️ Automation & Skripte' },
      { id: 'pricing',    label: '💰 Preise & Angebote' },
      { id: 'connect',    label: '💬 Direkt mit Team sprechen', highlight: true },
    ],
  },

  website: {
    messages: [
      { delay: 0,    text: 'Gute Wahl! 🚀 Wir bauen moderne Websites mit React — schnell, schön und individuell auf dich zugeschnitten.' },
      { delay: 1000, text: 'So läuft\'s ab:\n\n① Kurzes Briefing (~15 Min)\n② Wir schicken dir ein individuelles Angebot\n③ Entwicklung mit Feedback-Runden\n④ Live-Schaltung 🎉\n\nHosting & Domain werden transparent im Angebot aufgeführt — keine versteckten Kosten.' },
    ],
    options: [
      { id: 'connect',    label: '📞 Angebot anfragen', highlight: true },
      { id: 'pricing',    label: '💰 Was kostet eine Website?' },
      { id: 'portfolio',  label: '🖼️ Referenzen ansehen' },
      { id: 'welcome',    label: '↩ Zurück' },
    ],
  },

  discord: {
    messages: [
      { delay: 0,    text: 'Discord Bots sind unsere Spezialität! 🤖' },
      { delay: 800,  text: 'Von simplen Utility-Bots bis zu komplexen Systemen:\n\n✅ Moderations-Bots\n✅ Custom Commands & Slash Commands\n✅ Leveling-Systeme mit Datenbank\n✅ Ticket-Systeme\n✅ Musik, Games, API-Integrationen\n\nWir bauen genau das, was dein Server braucht.' },
    ],
    options: [
      { id: 'connect',    label: '📞 Bot anfragen', highlight: true },
      { id: 'pricing',    label: '💰 Was kostet ein Bot?' },
      { id: 'welcome',    label: '↩ Zurück' },
    ],
  },

  automation: {
    messages: [
      { delay: 0,    text: 'Mit der richtigen Automatisierung sparst du täglich Zeit ⚙️' },
      { delay: 900,  text: 'Was wir bauen können:\n\n✅ Daten-Automatisierung & Verarbeitung\n✅ Web Scraping\n✅ API-Verbindungen zwischen Tools\n✅ Batch-Verarbeitung großer Dateien\n✅ Geplante Aufgaben & Cronjobs\n✅ Telegram-Bots mit Datenbank\n\nSag uns einfach was du brauchst — wir finden eine Lösung.' },
    ],
    options: [
      { id: 'connect',    label: '📞 Projekt besprechen', highlight: true },
      { id: 'pricing',    label: '💰 Was kostet das?' },
      { id: 'welcome',    label: '↩ Zurück' },
    ],
  },

  pricing: {
    messages: [
      { delay: 0,    text: 'Unsere Preise sind immer individuell — weil jedes Projekt anders ist. 💡' },
      { delay: 1000, text: 'Was du wissen solltest:\n\n• Kein Angebot ohne kurzes Briefing\n• Hosting & Domain werden separat & transparent aufgeführt\n• Domains haben manchmal Mindestlaufzeiten\n• Keine versteckten Kosten — alles offen kommuniziert\n\nNach einem kurzen Gespräch bekommst du ein konkretes Angebot.' },
    ],
    options: [
      { id: 'connect',  label: '📞 Kostenloses Briefing anfragen', highlight: true },
      { id: 'welcome',  label: '↩ Zurück' },
    ],
  },

  portfolio: {
    messages: [
      { delay: 0,    text: 'Unsere Referenzen findest du direkt auf unserer Website! 🖼️' },
      { delay: 700,  text: 'Du kannst dir auch gerne konkrete Beispiele von uns zeigen lassen — einfach kurz melden.' },
    ],
    options: [
      { id: 'connect',  label: '📞 Beispiele anfragen', highlight: true },
      { id: 'welcome',  label: '↩ Zurück' },
    ],
  },

  connect: {
    // Dieser Step löst die Verbindungsanimation aus
    action: 'connect',
  },
}
