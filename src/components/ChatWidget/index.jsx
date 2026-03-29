import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import '../../styles/chat.css'

/* ── Content renderer (images + links) ───────────── */
function renderWidgetContent(content) {
  if (!content) return null
  if (content.startsWith('[img]')) {
    const url = content.slice(5)
    return (
      <img src={url} alt="Bild"
        style={{ maxWidth:'100%', maxHeight:200, borderRadius:8, display:'block', cursor:'pointer' }}
        onClick={() => window.open(url, '_blank')} />
    )
  }
  const parts = content.split(/(https?:\/\/\S+)/g)
  return parts.map((part, i) =>
    /^https?:\/\//.test(part)
      ? <a key={i} href={part} target="_blank" rel="noreferrer"
          style={{ color:'#93c5fd', wordBreak:'break-all' }}>{part}</a>
      : part
  )
}

/* ── Session ──────────────────────────────────────── */
function getSessionId() {
  let id = localStorage.getItem('tl_chat_sid')
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('tl_chat_sid', id) }
  return id
}

/* ── Uhrzeit-Helfer ───────────────────────────────── */
function isNightHours() {
  const h = new Date().getHours()
  return h >= 22 || h < 5
}
function isPeakHours() {
  const now = new Date()
  const day = now.getDay()
  const mins = now.getHours() * 60 + now.getMinutes()
  return day >= 1 && day <= 5 && mins >= 390 && mins < 960
}

/* ── Verbindungs-Sound ─────────────────────────────── */
function playConnectedSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [523, 659, 784]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.14)
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.14)
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.14 + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.14 + 0.4)
      osc.start(ctx.currentTime + i * 0.14)
      osc.stop(ctx.currentTime + i * 0.14 + 0.4)
    })
  } catch(e) {}
}

/* ══════════════════════════════════════════════════
   UMFASSENDER BOT
══════════════════════════════════════════════════ */
const BOT_KB = {
  // ── UNTERNEHMEN ──────────────────────────────────
  about: {
    keywords: /wer seid ihr|was macht ihr|über euch|team lazer|wer bist du|wer bist|über das team|stellt euch vor|vorstellen/i,
    reply: [
      'TEAM LAZER ist ein junges, technisch versiertes Entwicklungsteam. 🚀',
      'Wir entwickeln:\n\n💻 **Websites & Web-Apps** (React, modern & schnell)\n🤖 **Discord-Bots** (einfach bis komplex)\n⚙️ **Automatisierungen** (APIs, Webhooks, Scripts)\n🖥️ **Server-Setup & DevOps**\n\nKein Projekt zu klein, keine Idee zu groß — wir finden eine Lösung.'
    ]
  },

  // ── WEBSITE ──────────────────────────────────────
  website: {
    keywords: /website|webseite|homepage|landing page|shop|onlineshop|portfolio|firmenseite|unternehmensseite|one pager|onepager|react|nextjs/i,
    reply: [
      '💻 Websites sind unser Kerngeschäft!',
      'Was wir entwickeln:\n\n🎯 **Landing Pages** — ab 149€, perfekt für Produkte & Events\n🏢 **Business-Websites** — ab 349€, mit Kontaktformular, Blog uvm.\n🛒 **Online-Shops** — auf Anfrage (Stripe, PayPal integrierbar)\n⚡ **Web-Apps** — komplexe Anwendungen mit Dashboard, Login usw.\n\nAlle Seiten:\n✅ Mobil-optimiert (responsive)\n✅ Schnell (Lighthouse Score 90+)\n✅ SEO-ready\n✅ Keine versteckten Kosten\n\nHosting & Domain werden transparent im Angebot aufgeführt.',
    ],
    followUp: 'Soll ich dich direkt mit dem Team verbinden für ein kostenloses Briefing?'
  },

  // ── DISCORD ──────────────────────────────────────
  discord: {
    keywords: /discord|bot|slash command|server bot|moderation bot|ticket|leveling|musik bot|music bot|discord server/i,
    reply: [
      '🤖 Discord-Bots — unsere absolute Spezialität!',
      'Was wir bauen:\n\n🛡️ **Moderations-Bots** — Auto-Mod, Warns, Mutes, Bans\n🎫 **Ticket-Systeme** — Support-Tickets mit Logs\n📊 **Leveling-Systeme** — XP, Ränge, Leaderboards\n🎵 **Musik-Bots** — YouTube, Spotify, Playlists\n🎮 **Games & Minispiele** — Custom Commands, Gambling uvm.\n🔗 **API-Integrationen** — verbinde Discord mit allem\n\n**Preise:**\n• Einfacher Bot ab 79€\n• Komplexe Systeme ab 199€\n• Anpassungen ab 25€/h',
    ],
    followUp: 'Was genau brauchst du für deinen Server?'
  },

  // ── AUTOMATION ───────────────────────────────────
  automation: {
    keywords: /automat|script|api|webhook|cronjob|daten|workflow|bot ohne discord|n8n|zapier|make|integration|verbind|sync/i,
    reply: [
      '⚙️ Automatisierung — hier sparen wir dir täglich Zeit!',
      'Was wir umsetzen:\n\n🔗 **API-Verbindungen** — verbinde beliebige Tools miteinander\n📊 **Datenverarbeitung** — CSVs, JSONs, Datenbanken automatisch verarbeiten\n🕷️ **Web-Scraping** — Preise, Daten, Listings automatisch sammeln\n📧 **E-Mail-Automatisierung** — Trigger-basierte E-Mails & Newsletter\n⏰ **Geplante Aufgaben** — Cronjobs, tägliche Reports, Backups\n📱 **Telegram-Bots** — Benachrichtigungen & Steuerung\n\n**Preise ab 79€** je nach Komplexität.',
    ],
    followUp: 'Was soll automatisiert werden?'
  },

  // ── SERVER / DEVOPS ──────────────────────────────
  server: {
    keywords: /server|vps|hosting|linux|ubuntu|nginx|apache|docker|deploy|ssl|domain|root|hetzner|digitalocean|cloudflare|devops/i,
    reply: [
      '🖥️ Server-Setup & DevOps — wir richten alles ein!',
      'Unsere Leistungen:\n\n🔧 **Server-Setup** (Ubuntu, Debian) — ab 49€\n🔒 **SSL-Zertifikate** — Let\'s Encrypt oder custom\n🌐 **Domain-Konfiguration** — DNS, Weiterleitung, Subdomains\n🐳 **Docker & Container** — Apps containerisiert deployen\n📦 **CI/CD-Pipelines** — Auto-Deploy mit GitHub Actions\n🛡️ **Firewall & Sicherheit** — Server absichern\n📊 **Monitoring** — Uptime, Alerts, Logs\n\nWir arbeiten mit Hetzner, DigitalOcean, AWS, Cloudflare uvm.',
    ]
  },

  // ── PREISE ───────────────────────────────────────
  pricing: {
    keywords: /preis|kosten|was kostet|budget|angebot|rechnung|zahlung|bezahl|wie viel|günstig|teuer|rate|stunde/i,
    reply: [
      '💰 Unsere Preisübersicht:',
      '**Websites:**\n• Landing Page ab **149€**\n• Business-Website ab **349€**\n• Custom-Projekt auf Anfrage\n\n**Bots & Apps:**\n• Basis-Bot ab **79€**\n• Advanced-Bot ab **199€**\n• Bot-Anpassung ab **25€/h**\n\n**Server & APIs:**\n• Server-Setup ab **49€**\n• Webhook & API ab **99€**\n• Custom-Skript ab **79€**\n\n💡 Alle Preise sind Richtwerte. Nach einem kurzen Briefing (~15 Min) bekommst du ein **verbindliches Festpreis-Angebot** — keine versteckten Kosten, keine Überraschungen.',
    ],
    followUp: 'Möchtest du ein kostenloses Briefing für dein Projekt?'
  },

  // ── ZEITRAHMEN / DAUER ───────────────────────────
  timeline: {
    keywords: /wie lange|dauer|zeitrahmen|wann fertig|deadline|schnell|kurzfristig|express|bis wann|lieferzeit/i,
    reply: [
      '⏱️ Typische Umsetzungszeiten:',
      '• **Landing Page** — 3–7 Tage\n• **Business-Website** — 1–3 Wochen\n• **Einfacher Bot** — 2–5 Tage\n• **Komplexes Projekt** — individuell besprechen\n\nFür **Express-Umsetzung** innerhalb von 24–48h kann ein Aufpreis anfallen. Sag uns einfach deine Deadline — wir schauen was möglich ist!'
    ]
  },

  // ── KONTAKT ──────────────────────────────────────
  contact: {
    keywords: /kontakt|erreichen|melden|schreiben|email|mail|telefon|anruf|sprechen|termin|meeting|call/i,
    reply: [
      '📬 So erreichst du uns:',
      '✉️ **E-Mail:** kontakt@team-lazer.de\n🌐 **Website:** team-lazer.de\n💬 **Direkt hier im Chat** — ein Klick auf "Mit Mitarbeiter sprechen" und wir sind da!\n\nWir antworten werktags in der Regel innerhalb weniger Stunden.'
    ]
  },

  // ── REFERENZEN ───────────────────────────────────
  portfolio: {
    keywords: /referenz|portfolio|beispiel|projekt|arbeit|was habt ihr gemacht|was habt ihr gebaut|zeig|zeigen|habt ihr schon/i,
    reply: [
      '🖼️ Unsere Referenzen findest du auf team-lazer.de!',
      'Konkrete Beispiele zeigen wir dir gerne direkt — einfach nachfragen. Wir haben unter anderem gebaut:\n\n✅ Business-Websites für lokale Unternehmen\n✅ Discord-Bots mit Tausenden Nutzern\n✅ Automatisierungssysteme für E-Commerce\n✅ Custom Chat-Systeme (wie dieses hier! 😄)\n\nSprich uns an, wir finden sicher etwas Passendes zum Zeigen.'
    ]
  },

  // ── TECHNOLOGIE ──────────────────────────────────
  tech: {
    keywords: /technologie|tech stack|womit|welche sprache|programmiersprache|framework|react|vue|node|python|typescript|javascript|php/i,
    reply: [
      '💡 Unser Tech-Stack:',
      '**Frontend:** React 18, TypeScript, Vite, Framer Motion, Tailwind\n**Backend:** Node.js, Python, Supabase, PostgreSQL\n**Bots:** discord.js v14, Python (discord.py)\n**DevOps:** Netlify, Vercel, Hetzner, Docker, Cloudflare\n**APIs:** Stripe, SendGrid, Twilio, OpenAI, uvm.\n\nWir empfehlen immer den Stack, der am besten zu deinem Projekt passt — nicht den, den wir gerade am liebsten mögen. 😄'
    ]
  },

  // ── DATENSCHUTZ / DSGVO ──────────────────────────
  dsgvo: {
    keywords: /datenschutz|dsgvo|gdpr|impressum|rechtlich|sicher|verschlüssel|ssl/i,
    reply: [
      '🔒 Datenschutz & Sicherheit nehmen wir ernst!',
      'Bei jeder Website die wir bauen:\n\n✅ SSL-Verschlüsselung (HTTPS)\n✅ DSGVO-konformes Kontaktformular\n✅ Cookie-Banner (wenn nötig)\n✅ Datenschutzerklärung & Impressum auf Wunsch\n\nWir helfen dir auch bei der Erstellung rechtssicherer Texte (in Zusammenarbeit mit Juristen).'
    ]
  },

  // ── SUPPORT ──────────────────────────────────────
  support: {
    keywords: /support|hilfe|problem|fehler|bug|kaputt|funktioniert nicht|geht nicht|absturz|crash|broken/i,
    reply: [
      '🆘 Kein Problem, wir helfen!',
      'Beschreib mir kurz:\n\n1️⃣ Was genau funktioniert nicht?\n2️⃣ Seit wann?\n3️⃣ Hast du Fehlermeldungen?\n\nOder klick direkt auf "Mit Mitarbeiter sprechen" — dann kümmert sich unser Team sofort darum!'
    ]
  },

  // ── WARTUNG / UPDATES ────────────────────────────
  maintenance: {
    keywords: /wartung|update|maintain|pflege|aktualisier|content|änder|anpass|erweiter/i,
    reply: [
      '🔄 Wartung & Updates — wir halten alles am Laufen!',
      'Wir bieten:\n\n🛠️ **Inhaltspflege** — Texte, Bilder, Preise aktualisieren\n🔄 **Software-Updates** — Dependencies, Security-Patches\n📊 **Performance-Optimierung** — Speed, SEO verbessern\n✨ **Feature-Erweiterungen** — neue Seiten, Funktionen hinzufügen\n\n**Preise:** Stundenweise ab 25€/h oder als Paket auf Anfrage.'
    ]
  },

  // ── GRÜSSE ───────────────────────────────────────
  greeting: {
    keywords: /^(hallo|hi|hey|guten morgen|guten abend|guten tag|servus|moin|nabend|n abend|jo|joa|na)[\s!?]*$/i,
    reply: ['Hey! 👋 Schön dass du hier bist. Was kann ich für dich tun?']
  },

  // ── DANKE ────────────────────────────────────────
  thanks: {
    keywords: /danke|dankeschön|danke schön|dankesehr|super|toll|klasse|perfekt|genau das|hilft mir/i,
    reply: ['Sehr gerne! 😊 Gibt es noch etwas, wobei ich dir helfen kann?']
  },

  // ── FALLBACK ─────────────────────────────────────
  fallback: {
    reply: [
      'Danke für deine Nachricht! Zu diesem Thema kann ich dir leider keine direkte Auskunft geben.',
      'Unser Team steht dir gerne persönlich zur Verfügung und beantwortet deine Frage schnell und kompetent. Klick einfach auf "Mit Mitarbeiter sprechen" — wir sind für dich da! 💬'
    ]
  }
}

function getBotReply(text, lastTopic) {
  const t = text.trim()
  // Check each topic
  for (const [key, topic] of Object.entries(BOT_KB)) {
    if (key === 'fallback') continue
    if (topic.keywords?.test(t)) {
      return { replies: topic.reply, followUp: topic.followUp, topic: key }
    }
  }
  // Fallback
  return { replies: BOT_KB.fallback.reply, followUp: null, topic: lastTopic }
}

/* ── Avatar ───────────────────────────────────────── */
function Avatar({ agent, size = 36 }) {
  if (agent?.avatar_url) return (
    <img src={agent.avatar_url} alt={agent.name}
      className="chat-avatar-img" style={{ width: size, height: size }} />
  )
  const initials = (agent?.name || 'TL').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
  return <div className="chat-avatar-placeholder" style={{ width: size, height: size }}>{initials}</div>
}

/* ── Tipp-Indikator ───────────────────────────────── */
function TypingIndicator() {
  return (
    <motion.div className="chat-msg bot"
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <div className="chat-msg-avatar"><i className="fas fa-robot" /></div>
      <div className="chat-bubble typing-bubble"><span /><span /><span /></div>
    </motion.div>
  )
}

/* ── Connecting Screen ────────────────────────────── */
function ConnectingScreen({ agent }) {
  const peak = isPeakHours()
  return (
    <div className="chat-connecting-screen">
      <AnimatePresence mode="wait">
        {!agent ? (
          <motion.div key="rings" className="connecting-rings-wrap"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="connecting-rings">
              {[0,1,2].map(i => (
                <motion.div key={i} className="connecting-ring"
                  animate={{ scale:[1,2.8], opacity:[0.5,0] }}
                  transition={{ duration:2.2, delay:i*0.7, repeat:Infinity, ease:'easeOut' }} />
              ))}
              <div className="connecting-center-icon"><i className="fas fa-comments" /></div>
            </div>
            <p className="connecting-label">Verbinde mit TEAM LAZER…</p>
            <div className="typing-dots"><span /><span /><span /></div>
            {peak && (
              <motion.div className="connecting-peak-info"
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.8 }}>
                <i className="fas fa-clock" />
                <span>Mo – Fr zwischen 6:30 und 16:00 Uhr kann es zu einer Wartezeit von ca. 15 Min. kommen.</span>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div key="joined" className="agent-joined-wrap"
            initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <motion.div className="agent-joined-avatar"
              initial={{ scale:0.3, opacity:0 }} animate={{ scale:1, opacity:1 }}
              transition={{ type:'spring', stiffness:240, damping:18, delay:0.1 }}>
              <Avatar agent={agent} size={80} />
              <motion.div className="agent-joined-check"
                initial={{ scale:0 }} animate={{ scale:1 }}
                transition={{ type:'spring', stiffness:300, damping:18, delay:0.5 }}>
                <i className="fas fa-check" />
              </motion.div>
            </motion.div>
            <motion.p className="agent-joined-name"
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 }}>
              {agent.name}
            </motion.p>
            <motion.p className="agent-joined-sub"
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.85 }}>
              hat den Chat übernommen ✓
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Nachtmodus-Screen ────────────────────────────── */
function NightScreen({ onClose }) {
  return (
    <div className="chat-night-screen">
      <motion.div className="chat-night-inner"
        initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
        <div className="chat-night-icon"><i className="fas fa-moon" /></div>
        <h3>Wir sind gerade offline</h3>
        <p>Zwischen 22:00 und 5:00 Uhr ist kein Team-Mitglied erreichbar. Schreib uns eine E-Mail — wir melden uns am nächsten Werktag!</p>
        <a className="chat-email-btn" href="mailto:kontakt@team-lazer.de">
          <i className="fas fa-envelope" /> E-Mail schreiben
        </a>
        <button className="chat-restart-btn" onClick={onClose} style={{ marginTop: '10px' }}>
          <i className="fas fa-times" /> Schließen
        </button>
      </motion.div>
    </div>
  )
}

/* ── Chat-Beendet-Screen ──────────────────────────── */
function ClosedScreen({ byUser, onRestart }) {
  return (
    <motion.div className="chat-closed-screen"
      initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
      <motion.div className="chat-closed-icon"
        initial={{ scale:0 }} animate={{ scale:1 }}
        transition={{ type:'spring', stiffness:260, damping:18, delay:0.15 }}>
        <i className="fas fa-check-circle" />
      </motion.div>
      <motion.h3 initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
        Chat beendet
      </motion.h3>
      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.45 }}>
        {byUser
          ? 'Du hast den Chat beendet. Danke für deine Nachricht!'
          : 'Das Team hat den Chat beendet. Danke für dein Vertrauen!'}
      </motion.p>
      <motion.button className="chat-restart-btn" onClick={onRestart}
        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}>
        <i className="fas fa-arrow-left" /> Zurück
      </motion.button>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   MAIN WIDGET
══════════════════════════════════════════════════ */
export default function ChatWidget() {
  const [isOpen, setIsOpen]               = useState(false)
  const [phase, setPhase]                 = useState('bot')
  const [hasUnread, setHasUnread]         = useState(false)
  const [closedByUser, setClosedByUser]   = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)

  // Bot
  const [botMessages, setBotMessages]     = useState([])
  const [showTyping, setShowTyping]       = useState(false)
  const [userInput, setUserInput]         = useState('')
  const [showLiveBtn, setShowLiveBtn]     = useState(false)
  const [lastTopic, setLastTopic]         = useState(null)
  const [pendingFollowUp, setPendingFollowUp] = useState(null)

  // Formulare
  const [nameInput, setNameInput]         = useState('')
  const [emailInput, setEmailInput]       = useState('')
  const [userName, setUserName]           = useState('')
  const [userTopic, setUserTopic]         = useState('')

  // Live
  const [convId, setConvId]               = useState(null)
  const [liveMessages, setLiveMessages]   = useState([])
  const [liveInput, setLiveInput]         = useState('')
  const [agent, setAgent]                 = useState(null)

  const sessionId  = useRef(getSessionId())
  const channelRef = useRef(null)
  const pollRef    = useRef(null)
  const handledRef = useRef(false)
  const botStarted = useRef(false)
  const endRef     = useRef(null)
  const nameRef    = useRef(null)
  const emailRef   = useRef(null)
  const liveRef    = useRef(null)
  const inputRef   = useRef(null)

  const scrollBot  = useCallback(() => setTimeout(() => endRef.current?.scrollIntoView({ behavior:'smooth' }), 60), [])
  const scrollLive = useCallback(() => setTimeout(() => liveRef.current?.scrollIntoView({ behavior:'smooth' }), 60), [])

  /* ── Session wiederherstellen ──────────────────── */
  useEffect(() => {
    async function restore() {
      const { data: conv } = await supabase
        .from('conversations').select('*, agents(*)')
        .eq('session_id', sessionId.current)
        .order('created_at', { ascending: false })
        .limit(1).single()
      if (!conv) return

      if (conv.status === 'closed') {
        botStarted.current = true
        setConvId(conv.id); setUserName(conv.user_name)
        setClosedByUser(false); setPhase('closed')
        return
      }

      const { data: msgs } = await supabase
        .from('messages').select('*').eq('conversation_id', conv.id)
        .order('created_at', { ascending: true })

      botStarted.current = true
      setConvId(conv.id); setUserName(conv.user_name)
      setLiveMessages(msgs || [])

      if (conv.status === 'active' && conv.agents) {
        setAgent(conv.agents); setPhase('live')
        subscribeToConversation(conv.id)
      } else if (conv.status === 'waiting') {
        setPhase('connecting')
        subscribeToConversation(conv.id); startPolling(conv.id)
      }
    }
    restore()
  }, []) // eslint-disable-line

  /* ── Bot startet erst wenn Chat geöffnet wird ──── */
  useEffect(() => {
    if (!isOpen || phase !== 'bot' || botStarted.current) return
    botStarted.current = true
    addBotMsg('Hey! 👋 Willkommen bei TEAM LAZER.', 0)
    addBotMsg('Wie kann ich dir behilflich sein? Stell mir einfach deine Frage — oder klick auf "Mit Mitarbeiter sprechen" wenn du direkt jemanden brauchst.', 900, () => setShowLiveBtn(true))
  }, [isOpen, phase]) // eslint-disable-line

  /* ── Bot-Nachricht hinzufügen ──────────────────── */
  function addBotMsg(text, delay = 0, onDone) {
    setTimeout(() => setShowTyping(true), delay)
    setTimeout(() => {
      setShowTyping(false)
      setBotMessages(prev => [...prev, { id:`bot-${Date.now()}-${Math.random()}`, text, from:'bot' }])
      scrollBot()
      onDone?.()
    }, delay + 650)
  }

  /* ── Nutzer schreibt im Bot-Bereich ────────────── */
  function handleUserMessage(e) {
    e.preventDefault()
    const text = userInput.trim()
    if (!text) return
    setUserInput('')
    setShowLiveBtn(false)
    setPendingFollowUp(null)
    setBotMessages(prev => [...prev, { id:`u-${Date.now()}`, text, from:'user' }])
    if (!userTopic) setUserTopic(text.slice(0, 100))
    scrollBot()

    const { replies, followUp, topic } = getBotReply(text, lastTopic)
    setLastTopic(topic)

    replies.forEach((reply, i) => addBotMsg(reply, i * 950))
    const totalDelay = replies.length * 950 + 600
    setTimeout(() => {
      setShowLiveBtn(true)
      if (followUp) setPendingFollowUp(followUp)
    }, totalDelay)
  }

  /* ── "Mit Mitarbeiter sprechen" ────────────────── */
  function handleLiveChatRequest() {
    if (isNightHours()) { setPhase('night'); return }
    setShowLiveBtn(false)
    setPendingFollowUp(null)
    setPhase('name_input')
    setTimeout(() => nameRef.current?.focus(), 150)
  }

  /* ── Name → E-Mail ─────────────────────────────── */
  function handleNameSubmit(e) {
    e.preventDefault()
    const name = nameInput.trim() || 'Besucher'
    setUserName(name)
    setPhase('email_input')
    setTimeout(() => emailRef.current?.focus(), 150)
  }

  /* ── E-Mail → Verbinden ─────────────────────────── */
  async function handleEmailSubmit(e) {
    e?.preventDefault()
    setPhase('connecting')
    handledRef.current = false

    const topic = userTopic || botMessages.filter(m => m.from === 'user').map(m => m.text).join(' ').slice(0,100)

    const { data: conv } = await supabase
      .from('conversations')
      .insert({ session_id: sessionId.current, user_name: userName,
                user_email: emailInput.trim() || null, user_topic: topic || null, status: 'waiting' })
      .select().single()
    if (!conv) return
    setConvId(conv.id)

    const botMsgs = botMessages.map(m => ({
      conversation_id: conv.id,
      sender_type: m.from === 'bot' ? 'bot' : 'user',
      sender_name: m.from === 'bot' ? 'TEAM LAZER Bot' : userName,
      content: m.text,
    }))
    if (botMsgs.length > 0) await supabase.from('messages').insert(botMsgs)

    subscribeToConversation(conv.id)
    startPolling(conv.id)
  }

  /* ── Agent übernimmt ───────────────────────────── */
  async function onAgentJoined(agentId, cid, agentData = null) {
    if (handledRef.current) return
    handledRef.current = true
    clearInterval(pollRef.current)
    const ag = agentData || (await supabase.from('agents').select('*').eq('id', agentId).single()).data
    if (!ag) return
    const { data: msgs } = await supabase.from('messages').select('*').eq('conversation_id', cid).order('created_at')
    setLiveMessages(msgs || [])
    setAgent(ag)
    playConnectedSound()
    setTimeout(() => setPhase('live'), 2800)
  }

  /* ── Chat beenden ───────────────────────────────── */
  async function endChatByUser() {
    setShowEndConfirm(false)
    if (convId) await supabase.from('conversations').update({ status:'closed' }).eq('id', convId)
    clearInterval(pollRef.current)
    if (channelRef.current) supabase.removeChannel(channelRef.current)
    setClosedByUser(true); setPhase('closed')
  }

  /* ── Zurück ────────────────────────────────────── */
  function restartChat() {
    localStorage.removeItem('tl_chat_sid')
    sessionId.current = crypto.randomUUID()
    localStorage.setItem('tl_chat_sid', sessionId.current)
    clearInterval(pollRef.current)
    if (channelRef.current) supabase.removeChannel(channelRef.current)
    setPhase('bot'); setBotMessages([]); setShowTyping(false)
    setUserInput(''); setShowLiveBtn(false); setPendingFollowUp(null); setLastTopic(null)
    setNameInput(''); setEmailInput(''); setUserName(''); setUserTopic('')
    setConvId(null); setLiveMessages([]); setLiveInput(''); setAgent(null)
    setClosedByUser(false); setShowEndConfirm(false)
    handledRef.current = false; botStarted.current = false
  }

  /* ── Realtime ──────────────────────────────────── */
  function subscribeToConversation(cid) {
    if (channelRef.current) supabase.removeChannel(channelRef.current)
    const ch = supabase.channel('conv-' + cid)
      .on('postgres_changes', { event:'UPDATE', schema:'public', table:'conversations', filter:`id=eq.${cid}` },
        (payload) => {
          const c = payload.new
          if (c.status === 'active' && c.assigned_agent_id) onAgentJoined(c.assigned_agent_id, cid)
          if (c.status === 'closed') {
            clearInterval(pollRef.current)
            setClosedByUser(false); setPhase('closed'); setIsOpen(true)
          }
        })
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`conversation_id=eq.${cid}` },
        (payload) => {
          const msg = payload.new
          if (msg.sender_type === 'agent') {
            setLiveMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg])
            if (!isOpen) setHasUnread(true)
            scrollLive()
          }
        })
      .subscribe()
    channelRef.current = ch
  }

  function startPolling(cid) {
    clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      if (handledRef.current) { clearInterval(pollRef.current); return }
      const { data: conv } = await supabase.from('conversations').select('*, agents(*)')
        .eq('id', cid).single()
      if (conv?.status === 'active' && conv?.assigned_agent_id)
        onAgentJoined(conv.assigned_agent_id, cid, conv.agents)
    }, 2000)
  }

  /* ── Live-Nachricht senden ─────────────────────── */
  async function sendLiveMessage(e) {
    e.preventDefault()
    const text = liveInput.trim()
    if (!text || !convId) return
    setLiveInput('')
    const { data } = await supabase.from('messages').insert({
      conversation_id: convId, sender_type:'user',
      sender_name: userName, content: text,
    }).select().single()
    if (data) { setLiveMessages(prev => [...prev, data]); scrollLive() }
  }

  useEffect(() => () => {
    clearInterval(pollRef.current)
    if (channelRef.current) supabase.removeChannel(channelRef.current)
  }, [])

  function toggle() { setIsOpen(v => !v); setHasUnread(false) }

  const headerName   = agent ? agent.name : 'TEAM LAZER'
  const headerStatus = phase === 'closed'     ? 'Chat beendet'
                     : phase === 'night'      ? 'Offline (22–5 Uhr)'
                     : agent                  ? 'Verbunden'
                     : phase === 'connecting' ? 'Verbinde…'
                     : 'Support-Bot'

  /* ── Render ─────────────────────────────────────── */
  return (
    <>
      <motion.button className={`chat-fab ${hasUnread ? 'has-unread' : ''}`}
        onClick={toggle} whileHover={{ scale:1.08 }} whileTap={{ scale:0.94 }}>
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.i key="x" className="fas fa-times"
                initial={{ rotate:-90, opacity:0 }} animate={{ rotate:0, opacity:1 }}
                exit={{ rotate:90, opacity:0 }} transition={{ duration:0.18 }} />
            : <motion.i key="c" className="fas fa-comments"
                initial={{ rotate:90, opacity:0 }} animate={{ rotate:0, opacity:1 }}
                exit={{ rotate:-90, opacity:0 }} transition={{ duration:0.18 }} />
          }
        </AnimatePresence>
        {hasUnread && <span className="chat-fab-dot" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="chat-window"
            initial={{ opacity:0, scale:0.88, y:18 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.88, y:18 }}
            transition={{ duration:0.22, ease:'easeOut' }}>

            {/* Header */}
            <div className={`chat-header ${phase === 'closed' || phase === 'night' ? 'chat-header-closed' : ''}`}>
              <div className="chat-header-left">
                <div className="chat-header-avatar">
                  {agent
                    ? <Avatar agent={agent} size={38} />
                    : <div className="chat-header-bot-icon">
                        <i className={
                          phase === 'closed' ? 'fas fa-check-circle'
                          : phase === 'night' ? 'fas fa-moon'
                          : 'fas fa-robot'
                        } />
                      </div>
                  }
                  {phase !== 'closed' && phase !== 'night' && <span className="chat-online-dot" />}
                </div>
                <div className="chat-header-info">
                  <strong>{headerName}</strong>
                  <span>{headerStatus}</span>
                </div>
              </div>
              <div className="chat-header-actions">
                {phase === 'live' && !showEndConfirm && (
                  <button className="chat-end-btn" onClick={() => setShowEndConfirm(true)}>
                    <i className="fas fa-times-circle" /><span>Beenden</span>
                  </button>
                )}
                <button className="chat-header-close" onClick={toggle}>
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>

            {/* Beenden-Bestätigung */}
            <AnimatePresence>
              {showEndConfirm && (
                <motion.div className="chat-end-confirm"
                  initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                  exit={{ opacity:0, height:0 }}>
                  <span><i className="fas fa-exclamation-triangle" /> Chat wirklich beenden?</span>
                  <div className="chat-end-confirm-btns">
                    <button className="chat-end-confirm-yes" onClick={endChatByUser}>Ja, beenden</button>
                    <button className="chat-end-confirm-no" onClick={() => setShowEndConfirm(false)}>Abbrechen</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="chat-body">
              {/* BOT-PHASE */}
              {(phase === 'bot' || phase === 'name_input' || phase === 'email_input') && (
                <div className="chat-messages">
                  <AnimatePresence initial={false}>
                    {botMessages.map(msg => (
                      <motion.div key={msg.id} className={`chat-msg ${msg.from}`}
                        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                        transition={{ duration:0.2 }}>
                        {msg.from === 'bot' && (
                          <div className="chat-msg-avatar"><i className="fas fa-robot" /></div>
                        )}
                        <div className="chat-bubble">
                          {msg.text.split('\n').map((l,i,a) =>
                            <span key={i}>{l}{i < a.length-1 && <br />}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {showTyping && <TypingIndicator key="typing" />}
                  </AnimatePresence>

                  {/* Follow-up Frage als Bubble */}
                  <AnimatePresence>
                    {pendingFollowUp && phase === 'bot' && (
                      <motion.div className="chat-msg bot followup"
                        initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                        <div className="chat-msg-avatar"><i className="fas fa-robot" /></div>
                        <div className="chat-bubble chat-bubble-followup">{pendingFollowUp}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Name-Input */}
                  <AnimatePresence>
                    {phase === 'name_input' && (
                      <motion.div className="chat-name-input-wrap"
                        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
                        <motion.div className="chat-msg bot"
                          initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}>
                          <div className="chat-msg-avatar"><i className="fas fa-robot" /></div>
                          <div className="chat-bubble">Super! Wie soll ich dich nennen?</div>
                        </motion.div>
                        <form className="chat-name-form" onSubmit={handleNameSubmit}>
                          <input ref={nameRef} type="text" className="chat-name-field"
                            placeholder="Dein Name…" value={nameInput}
                            onChange={e => setNameInput(e.target.value)} maxLength={40} />
                          <button type="submit" className="chat-name-submit">
                            <i className="fas fa-arrow-right" />
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* E-Mail-Input */}
                  <AnimatePresence>
                    {phase === 'email_input' && (
                      <motion.div className="chat-name-input-wrap"
                        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
                        <motion.div className="chat-msg bot"
                          initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}>
                          <div className="chat-msg-avatar"><i className="fas fa-robot" /></div>
                          <div className="chat-bubble">Und deine E-Mail-Adresse? (Für Rückfragen falls du offline gehst)</div>
                        </motion.div>
                        <form className="chat-name-form" onSubmit={handleEmailSubmit}>
                          <input ref={emailRef} type="email" className="chat-name-field"
                            placeholder="deine@email.de" value={emailInput}
                            onChange={e => setEmailInput(e.target.value)} maxLength={80} />
                          <button type="submit" className="chat-name-submit">
                            <i className="fas fa-arrow-right" />
                          </button>
                        </form>
                        <button className="chat-skip-email" onClick={() => handleEmailSubmit(null)}>
                          Überspringen
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={endRef} />
                </div>
              )}

              {/* CONNECTING */}
              {phase === 'connecting' && <ConnectingScreen agent={agent} />}

              {/* LIVE */}
              {phase === 'live' && (
                <div className="chat-messages live">
                  <AnimatePresence initial={false}>
                    {liveMessages.map(msg => (
                      <motion.div key={msg.id}
                        className={`chat-msg ${msg.sender_type === 'user' ? 'user' : msg.sender_type === 'agent' ? 'agent' : 'bot'}`}
                        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                        transition={{ duration:0.2 }}>
                        {msg.sender_type !== 'user' && (
                          <div className="chat-msg-avatar">
                            {msg.sender_type === 'agent'
                              ? <Avatar agent={agent} size={28} />
                              : <i className="fas fa-robot" />}
                          </div>
                        )}
                        <div className="chat-bubble">{renderWidgetContent(msg.content)}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={liveRef} />
                </div>
              )}

              {/* NIGHT */}
              {phase === 'night' && <NightScreen onClose={toggle} />}
              {/* CLOSED */}
              {phase === 'closed' && <ClosedScreen byUser={closedByUser} onRestart={restartChat} />}
            </div>

            {/* Eingabe */}
            {phase === 'bot' && (
              <div className="chat-bot-input-area">
                <form className="chat-input-bar" onSubmit={handleUserMessage}>
                  <input ref={inputRef} type="text" placeholder="Stell mir eine Frage…"
                    value={userInput} onChange={e => setUserInput(e.target.value)}
                    className="chat-input" />
                  <button type="submit" className="chat-send-btn" disabled={!userInput.trim()}>
                    <i className="fas fa-paper-plane" />
                  </button>
                </form>
                <AnimatePresence>
                  {showLiveBtn && (
                    <motion.button className="chat-live-request-btn"
                      onClick={handleLiveChatRequest}
                      initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:6 }}>
                      <i className="fas fa-headset" /> Mit Mitarbeiter sprechen
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            )}

            {phase === 'live' && (
              <form className="chat-input-bar" onSubmit={sendLiveMessage}>
                <input type="text" placeholder="Nachricht schreiben…"
                  value={liveInput} onChange={e => setLiveInput(e.target.value)}
                  className="chat-input" autoFocus />
                <button type="submit" className="chat-send-btn" disabled={!liveInput.trim()}>
                  <i className="fas fa-paper-plane" />
                </button>
              </form>
            )}

            {(phase !== 'live' && phase !== 'closed' && phase !== 'night') && (
              <div className="chat-footer-brand">Powered by <strong>TEAM LAZER</strong></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
