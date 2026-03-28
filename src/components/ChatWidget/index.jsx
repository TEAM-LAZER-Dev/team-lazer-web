import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import '../../styles/chat.css'

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
  const day = now.getDay()           // 0=So … 6=Sa
  const mins = now.getHours() * 60 + now.getMinutes()
  return day >= 1 && day <= 5 && mins >= 390 && mins < 960  // Mo-Fr 6:30–16:00
}

/* ── Bot-Antworten (Keyword-basiert) ──────────────── */
const QUICK_ANSWERS = {
  website:    ['🚀 Wir bauen moderne Websites mit React — schnell, individuell und ohne versteckte Kosten.', 'Beschreib mir kurz was du dir vorstellst, dann leite ich das ans Team weiter!'],
  discord:    ['🤖 Discord Bots sind unsere Spezialität — von simplen Utility-Bots bis zu komplexen Systemen mit Datenbank.', 'Sag mir kurz was du brauchst!'],
  pricing:    ['💡 Preise sind bei uns immer individuell — nach einem kurzen Briefing bekommst du ein konkretes Angebot ohne versteckte Kosten.'],
  automation: ['⚙️ Automatisierung spart täglich Zeit. Wir bauen API-Verbindungen, Skripte, Webhooks und Cronjobs.', 'Was soll automatisiert werden?'],
  fallback:   ['Gute Frage! Ich leite das direkt ans Team weiter — die helfen dir am besten. 👇'],
}

function getBotReply(text) {
  const t = text.toLowerCase()
  if (/(website|webseite|seite|landing|shop)/i.test(t))       return QUICK_ANSWERS.website
  if (/(bot|discord|slash|command)/i.test(t))                  return QUICK_ANSWERS.discord
  if (/(preis|kosten|was kostet|budget|angebot)/i.test(t))     return QUICK_ANSWERS.pricing
  if (/(automat|script|api|webhook|cronjob|skript)/i.test(t)) return QUICK_ANSWERS.automation
  return QUICK_ANSWERS.fallback
}

/* ── Verbindungs-Sound ─────────────────────────────── */
function playConnectedSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(523, ctx.currentTime)
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.12)
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.24)
    gain.gain.setValueAtTime(0.22, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.7)
  } catch(e) {}
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
function NightScreen() {
  return (
    <div className="chat-night-screen">
      <motion.div className="chat-night-inner"
        initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
        <div className="chat-night-icon"><i className="fas fa-moon" /></div>
        <h3>Wir sind gerade offline</h3>
        <p>Zwischen 22:00 und 5:00 Uhr ist kein Team-Mitglied erreichbar. Schreib uns eine E-Mail — wir melden uns am nächsten Werktag!</p>
        <a className="chat-email-btn" href="mailto:info@team-lazer.de">
          <i className="fas fa-envelope" /> E-Mail schreiben
        </a>
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
        <i className="fas fa-redo" /> Neuen Chat starten
      </motion.button>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   MAIN WIDGET
══════════════════════════════════════════════════ */
export default function ChatWidget() {
  const [isOpen, setIsOpen]               = useState(false)
  // Phases: bot | name_input | email_input | connecting | live | closed | night
  const [phase, setPhase]                 = useState('bot')
  const [hasUnread, setHasUnread]         = useState(false)
  const [closedByUser, setClosedByUser]   = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)

  // Bot
  const [botMessages, setBotMessages]     = useState([])
  const [showTyping, setShowTyping]       = useState(false)
  const [userInput, setUserInput]         = useState('')
  const [showLiveBtn, setShowLiveBtn]     = useState(false)

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

  /* ── Bot starten ───────────────────────────────── */
  useEffect(() => {
    if (phase !== 'bot' || botStarted.current) return
    botStarted.current = true
    addBotMessage('Hey! 👋 Willkommen bei TEAM LAZER.', 0)
    addBotMessage('Wie kann ich dir behilflich sein?', 900, () => setShowLiveBtn(true))
  }, [phase]) // eslint-disable-line

  function addBotMessage(text, delay = 0, onDone) {
    setTimeout(() => setShowTyping(true), delay)
    setTimeout(() => {
      setShowTyping(false)
      setBotMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, text, from:'bot' }])
      scrollBot()
      onDone?.()
    }, delay + 700)
  }

  /* ── User schreibt im Bot-Bereich ──────────────── */
  function handleUserMessage(e) {
    e.preventDefault()
    const text = userInput.trim()
    if (!text) return
    setUserInput('')
    setShowLiveBtn(false)
    setBotMessages(prev => [...prev, { id:`u-${Date.now()}`, text, from:'user' }])
    setUserTopic(prev => prev || text.slice(0, 80))
    scrollBot()
    // Bot-Antwort mit Verzögerung
    const replies = getBotReply(text)
    replies.forEach((reply, i) => addBotMessage(reply, i * 900))
    // "Mit Mitarbeiter sprechen"-Button nach Antwort wieder zeigen
    setTimeout(() => setShowLiveBtn(true), replies.length * 900 + 800)
  }

  /* ── "Mit Mitarbeiter sprechen" geklickt ───────── */
  function handleLiveChatRequest() {
    if (isNightHours()) { setPhase('night'); return }
    setShowLiveBtn(false)
    setPhase('name_input')
    setTimeout(() => nameRef.current?.focus(), 150)
  }

  /* ── Name abgeschickt → E-Mail ─────────────────── */
  function handleNameSubmit(e) {
    e.preventDefault()
    const name = nameInput.trim() || 'Besucher'
    setUserName(name)
    setPhase('email_input')
    setTimeout(() => emailRef.current?.focus(), 150)
  }

  /* ── E-Mail abgeschickt → Verbinden ────────────── */
  async function handleEmailSubmit(e) {
    e.preventDefault()
    const email = emailInput.trim()
    setPhase('connecting')
    handledRef.current = false

    const topic = userTopic || botMessages.filter(m => m.from === 'user').map(m => m.text).join(' ').slice(0,100) || ''

    const { data: conv } = await supabase
      .from('conversations')
      .insert({
        session_id: sessionId.current,
        user_name: userName,
        user_email: email || null,
        user_topic: topic || null,
        status: 'waiting',
      })
      .select().single()
    if (!conv) return
    setConvId(conv.id)

    // Bisherige Bot-Nachrichten speichern
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

    const { data: msgs } = await supabase
      .from('messages').select('*').eq('conversation_id', cid).order('created_at')
    setLiveMessages(msgs || [])
    setAgent(ag)
    playConnectedSound()
    setTimeout(() => setPhase('live'), 2800)
  }

  /* ── Chat beenden (Kunde) ──────────────────────── */
  async function endChatByUser() {
    setShowEndConfirm(false)
    if (convId) await supabase.from('conversations').update({ status:'closed' }).eq('id', convId)
    clearInterval(pollRef.current)
    if (channelRef.current) supabase.removeChannel(channelRef.current)
    setClosedByUser(true); setPhase('closed')
  }

  /* ── Neuer Chat ────────────────────────────────── */
  function restartChat() {
    localStorage.removeItem('tl_chat_sid')
    sessionId.current = crypto.randomUUID()
    localStorage.setItem('tl_chat_sid', sessionId.current)
    clearInterval(pollRef.current)
    if (channelRef.current) supabase.removeChannel(channelRef.current)
    setPhase('bot'); setBotMessages([]); setShowTyping(false)
    setUserInput(''); setShowLiveBtn(false)
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

  /* ── Nachricht senden (Live) ───────────────────── */
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
                     : phase === 'night'      ? 'Offline'
                     : agent                  ? 'Online'
                     : phase === 'connecting' ? 'Verbinde…'
                     : 'Support'

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
                          <div className="chat-bubble">Und deine E-Mail-Adresse? (Falls wir dich nicht direkt erreichen)</div>
                        </motion.div>
                        <form className="chat-name-form" onSubmit={handleEmailSubmit}>
                          <input ref={emailRef} type="email" className="chat-name-field"
                            placeholder="deine@email.de" value={emailInput}
                            onChange={e => setEmailInput(e.target.value)} maxLength={80} />
                          <button type="submit" className="chat-name-submit">
                            <i className="fas fa-arrow-right" />
                          </button>
                        </form>
                        <button className="chat-skip-email" onClick={handleEmailSubmit}>
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
                        <div className="chat-bubble">{msg.content}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={liveRef} />
                </div>
              )}

              {/* NIGHT */}
              {phase === 'night' && <NightScreen />}

              {/* CLOSED */}
              {phase === 'closed' && <ClosedScreen byUser={closedByUser} onRestart={restartChat} />}
            </div>

            {/* Eingabebereich je nach Phase */}
            {phase === 'bot' && (
              <div className="chat-bot-input-area">
                <form className="chat-input-bar" onSubmit={handleUserMessage}>
                  <input ref={inputRef} type="text" placeholder="Schreib deine Frage…"
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
                      initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
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
