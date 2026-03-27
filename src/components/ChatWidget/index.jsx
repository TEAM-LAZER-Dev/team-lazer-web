import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { STEPS } from './script'
import '../../styles/chat.css'

/* ── Helpers ─────────────────────────────────────── */
function getSessionId() {
  let id = localStorage.getItem('tl_chat_sid')
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('tl_chat_sid', id) }
  return id
}
function Avatar({ agent, size = 36 }) {
  if (agent?.avatar_url) return (
    <img src={agent.avatar_url} alt={agent.name}
      className="chat-avatar-img" style={{ width: size, height: size }} />
  )
  const initials = (agent?.name || 'TL').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
  return (
    <div className="chat-avatar-placeholder" style={{ width: size, height: size }}>
      {initials}
    </div>
  )
}

/* ── Connecting / Agent-Joined Animation ─────────── */
// Einfach: reagiert nur auf agent-Prop, kein callback nötig
function ConnectingScreen({ agent }) {
  return (
    <div className="chat-connecting-screen">
      <AnimatePresence mode="wait">
        {!agent ? (
          <motion.div key="rings" className="connecting-rings-wrap"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            <div className="connecting-rings">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="connecting-ring"
                  animate={{ scale: [1, 2.8], opacity: [0.5, 0] }}
                  transition={{ duration: 2.2, delay: i * 0.7, repeat: Infinity, ease: 'easeOut' }} />
              ))}
              <div className="connecting-center-icon">
                <i className="fas fa-comments" />
              </div>
            </div>
            <p className="connecting-label">Verbinde mit Team Lazer…</p>
            <div className="typing-dots"><span /><span /><span /></div>
          </motion.div>
        ) : (
          <motion.div key="joined" className="agent-joined-wrap"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="agent-joined-avatar"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.1 }}>
              <Avatar agent={agent} size={80} />
              <motion.div className="agent-joined-check"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.5 }}>
                <i className="fas fa-check" />
              </motion.div>
            </motion.div>
            <motion.p className="agent-joined-name"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}>
              {agent.name}
            </motion.p>
            <motion.p className="agent-joined-sub"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}>
              hat den Chat übernommen ✓
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Typing Indicator ────────────────────────────── */
function TypingIndicator() {
  return (
    <motion.div className="chat-msg bot"
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <div className="chat-msg-avatar"><i className="fas fa-robot" /></div>
      <div className="chat-bubble typing-bubble"><span /><span /><span /></div>
    </motion.div>
  )
}

/* ── Main Widget ──────────────────────────────────── */
export default function ChatWidget() {
  const [isOpen, setIsOpen]             = useState(false)
  const [phase, setPhase]               = useState('bot')
  const [hasUnread, setHasUnread]       = useState(false)

  // Bot
  const [botMessages, setBotMessages]   = useState([])
  const [currentStep, setCurrentStep]   = useState(null)
  const [showTyping, setShowTyping]     = useState(false)
  const [showOptions, setShowOptions]   = useState(false)

  // Name input
  const [nameInput, setNameInput]       = useState('')
  const [userName, setUserName]         = useState('')

  // Live
  const [convId, setConvId]             = useState(null)
  const [liveMessages, setLiveMessages] = useState([])
  const [liveInput, setLiveInput]       = useState('')
  const [agent, setAgent]               = useState(null)

  const sessionId   = useRef(getSessionId())
  const channelRef  = useRef(null)
  const pollRef     = useRef(null)
  const handledRef  = useRef(false) // verhindert doppelte Übernahme-Logik
  const botStarted  = useRef(false)
  const endRef      = useRef(null)
  const nameRef     = useRef(null)
  const liveRef     = useRef(null)

  const scrollBot  = useCallback(() => setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 60), [])
  const scrollLive = useCallback(() => setTimeout(() => liveRef.current?.scrollIntoView({ behavior: 'smooth' }), 60), [])

  /* ── Session wiederherstellen ──────────────────── */
  useEffect(() => {
    async function restore() {
      const { data: conv } = await supabase
        .from('conversations')
        .select('*, agents(*)')
        .eq('session_id', sessionId.current)
        .neq('status', 'closed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (!conv) return

      const { data: msgs } = await supabase
        .from('messages').select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: true })

      botStarted.current = true
      setConvId(conv.id)
      setUserName(conv.user_name)
      setLiveMessages(msgs || [])

      if (conv.status === 'active' && conv.agents) {
        setAgent(conv.agents)
        setPhase('live')
        subscribeToConversation(conv.id)
      } else if (conv.status === 'waiting') {
        setPhase('connecting')
        subscribeToConversation(conv.id)
        startPolling(conv.id)
      }
    }
    restore()
  }, []) // eslint-disable-line

  /* ── Bot starten (StrictMode-sicher) ──────────── */
  useEffect(() => {
    if (phase !== 'bot' || botStarted.current) return
    botStarted.current = true
    runStep('welcome')
  }, [phase]) // eslint-disable-line

  function runStep(stepId) {
    const step = STEPS[stepId]
    if (!step) return
    if (step.action === 'connect') {
      setShowOptions(false)
      setPhase('name_input')
      setTimeout(() => nameRef.current?.focus(), 150)
      return
    }
    setCurrentStep(stepId)
    setShowOptions(false)
    const msgs = step.messages || []
    msgs.forEach((m, i) => {
      const d = m.delay ?? i * 900
      setTimeout(() => setShowTyping(true), d)
      setTimeout(() => {
        setShowTyping(false)
        setBotMessages(prev => [...prev, { id: `${stepId}-${i}-${Date.now()}`, text: m.text, from: 'bot' }])
        scrollBot()
        if (i === msgs.length - 1) setTimeout(() => setShowOptions(true), 300)
      }, d + 700)
    })
  }

  function handleOption(optionId) {
    const opt = STEPS[currentStep]?.options?.find(o => o.id === optionId)
    if (!opt) return
    setBotMessages(prev => [...prev, { id: `u-${Date.now()}`, text: opt.label.replace(/^.\s/, ''), from: 'user' }])
    setShowOptions(false)
    scrollBot()
    setTimeout(() => runStep(optionId), 400)
  }

  /* ── Mit Team verbinden ────────────────────────── */
  async function handleConnectSubmit(e) {
    e.preventDefault()
    const name = nameInput.trim() || 'Besucher'
    setUserName(name)
    setPhase('connecting')
    handledRef.current = false

    const { data: conv } = await supabase
      .from('conversations')
      .insert({ session_id: sessionId.current, user_name: name, status: 'waiting' })
      .select().single()
    if (!conv) return
    setConvId(conv.id)

    const botMsgs = botMessages.map(m => ({
      conversation_id: conv.id,
      sender_type: m.from === 'bot' ? 'bot' : 'user',
      sender_name: m.from === 'bot' ? 'Team Lazer Bot' : name,
      content: m.text,
    }))
    if (botMsgs.length > 0) await supabase.from('messages').insert(botMsgs)

    subscribeToConversation(conv.id)
    startPolling(conv.id)
  }

  /* ── Wenn Agent übernimmt ──────────────────────── */
  async function onAgentJoined(agentId, cid, agentData = null) {
    if (handledRef.current) return   // schon behandelt
    handledRef.current = true
    clearInterval(pollRef.current)
    // NICHT die Subscription entfernen — die brauchen wir für Live-Nachrichten!

    const ag = agentData || (await supabase.from('agents').select('*').eq('id', agentId).single()).data
    if (!ag) return

    const { data: msgs } = await supabase
      .from('messages').select('*').eq('conversation_id', cid).order('created_at')
    setLiveMessages(msgs || [])

    setAgent(ag)
    setTimeout(() => setPhase('live'), 2800)
  }

  /* ── Realtime subscription ─────────────────────── */
  function subscribeToConversation(cid) {
    if (channelRef.current) supabase.removeChannel(channelRef.current)
    const ch = supabase
      .channel('conv-' + cid)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'conversations',
        filter: `id=eq.${cid}`,
      }, (payload) => {
        const c = payload.new
        if (c.status === 'active' && c.assigned_agent_id) {
          onAgentJoined(c.assigned_agent_id, cid)
        }
      })
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${cid}`,
      }, (payload) => {
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

  /* ── Polling fallback (kein stale closure durch ref) ── */
  function startPolling(cid) {
    clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      if (handledRef.current) { clearInterval(pollRef.current); return }
      const { data: conv } = await supabase
        .from('conversations').select('*, agents(*)')
        .eq('id', cid).single()
      if (conv?.status === 'active' && conv?.assigned_agent_id) {
        onAgentJoined(conv.assigned_agent_id, cid, conv.agents)
      }
    }, 2000)
  }

  /* ── Nachricht senden ──────────────────────────── */
  async function sendLiveMessage(e) {
    e.preventDefault()
    const text = liveInput.trim()
    if (!text || !convId) return
    setLiveInput('')
    const { data } = await supabase.from('messages').insert({
      conversation_id: convId,
      sender_type: 'user',
      sender_name: userName,
      content: text,
    }).select().single()
    if (data) { setLiveMessages(prev => [...prev, data]); scrollLive() }
  }

  useEffect(() => () => {
    clearInterval(pollRef.current)
    if (channelRef.current) supabase.removeChannel(channelRef.current)
  }, [])

  function toggle() { setIsOpen(v => !v); setHasUnread(false) }

  const headerName   = agent ? agent.name : 'Team Lazer'
  const headerStatus = agent ? 'Online' : phase === 'connecting' ? 'Verbinde…' : 'Bot'

  /* ── Render ────────────────────────────────────── */
  return (
    <>
      <motion.button className={`chat-fab ${hasUnread ? 'has-unread' : ''}`}
        onClick={toggle} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}>
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.i key="x" className="fas fa-times"
                initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} />
            : <motion.i key="c" className="fas fa-comments"
                initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }} />
          }
        </AnimatePresence>
        {hasUnread && <span className="chat-fab-dot" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="chat-window"
            initial={{ opacity: 0, scale: 0.88, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 18 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}>

            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-left">
                <div className="chat-header-avatar">
                  {agent
                    ? <Avatar agent={agent} size={38} />
                    : <div className="chat-header-bot-icon"><i className="fas fa-robot" /></div>
                  }
                  <span className="chat-online-dot" />
                </div>
                <div className="chat-header-info">
                  <strong>{headerName}</strong>
                  <span>{headerStatus}</span>
                </div>
              </div>
              <button className="chat-header-close" onClick={toggle}><i className="fas fa-times" /></button>
            </div>

            <div className="chat-body">
              {/* BOT */}
              {(phase === 'bot' || phase === 'name_input') && (
                <div className="chat-messages">
                  <AnimatePresence initial={false}>
                    {botMessages.map(msg => (
                      <motion.div key={msg.id} className={`chat-msg ${msg.from}`}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
                        {msg.from === 'bot' && <div className="chat-msg-avatar"><i className="fas fa-robot" /></div>}
                        <div className="chat-bubble">
                          {msg.text.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>)}
                        </div>
                      </motion.div>
                    ))}
                    {showTyping && <TypingIndicator key="typing" />}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showOptions && phase === 'bot' && (
                      <motion.div className="chat-options"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        {STEPS[currentStep]?.options?.map(opt => (
                          <button key={opt.id}
                            className={`chat-option-btn ${opt.highlight ? 'highlight' : ''}`}
                            onClick={() => handleOption(opt.id)}>
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {phase === 'name_input' && (
                      <motion.div className="chat-name-input-wrap"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <motion.div className="chat-msg bot"
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                          <div className="chat-msg-avatar"><i className="fas fa-robot" /></div>
                          <div className="chat-bubble">Bevor ich dich verbinde — wie soll ich dich nennen?</div>
                        </motion.div>
                        <form className="chat-name-form" onSubmit={handleConnectSubmit}>
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
                        className={`chat-msg ${msg.sender_type === 'user' ? 'user' : 'bot'}`}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
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
            </div>

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

            {phase !== 'live' && (
              <div className="chat-footer-brand">Powered by <strong>Team Lazer</strong></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
