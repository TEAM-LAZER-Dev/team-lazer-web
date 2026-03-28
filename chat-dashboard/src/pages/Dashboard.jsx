import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/* ── Notification helpers ────────────────────────── */
function playSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.12)
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4)
  } catch(e) {}
}

function showBrowserNotification(title, body) {
  if (Notification?.permission === 'granted') {
    const n = new Notification(title, { body, icon: '/icon-192.png', badge: '/icon-192.png' })
    setTimeout(() => n.close(), 6000)
  }
}

/* ── Time helpers ────────────────────────────────── */
function timeAgo(d) {
  const diff = Math.floor((Date.now() - new Date(d)) / 1000)
  if (diff < 60)   return 'Jetzt'
  if (diff < 3600) return `${Math.floor(diff/60)}m`
  if (diff < 86400) return `${Math.floor(diff/3600)}h`
  return new Date(d).toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit' })
}
function fmtTime(d) {
  return new Date(d).toLocaleTimeString('de-DE', { hour:'2-digit', minute:'2-digit' })
}

/* ── Avatar ──────────────────────────────────────── */
function Avatar({ agent, size = 36, name }) {
  const displayName = agent?.name || name || '?'
  if (agent?.avatar_url) return (
    <img src={agent.avatar_url} alt={displayName}
      style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
  )
  const initials = displayName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return (
    <div className="avatar-placeholder" style={{ width:size, height:size, fontSize: size*0.36 }}>
      {initials}
    </div>
  )
}

const STATUS_LABEL = { waiting:'Wartend', active:'Aktiv', bot:'Bot', closed:'Geschlossen' }
const STATUS_CLS   = { waiting:'status-waiting', active:'status-active', bot:'status-bot', closed:'status-closed' }

/* ── ConvItem ────────────────────────────────────── */
function ConvItem({ conv, activeConv, unreadCounts, onSelect, onDelete, showDelete }) {
  return (
    <motion.div
      className={`db-conv-item ${activeConv?.id === conv.id ? 'selected' : ''} ${conv.status === 'waiting' ? 'is-waiting' : ''}`}
      onClick={() => onSelect(conv)}
      initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:-8 }} layout>
      <div className="db-conv-avatar-wrap">
        <div className="db-conv-avatar">
          <span>{(conv.user_name?.[0] || '?').toUpperCase()}</span>
        </div>
        {unreadCounts[conv.id] > 0 && (
          <span className="unread-dot">{unreadCounts[conv.id]}</span>
        )}
        {conv.status === 'waiting' && <span className="db-conv-waiting-dot" />}
      </div>
      <div className="db-conv-info">
        <div className="db-conv-top">
          <strong>{conv.user_name || 'Besucher'}</strong>
          <span className="db-conv-time">{timeAgo(conv.last_message_at)}</span>
        </div>
        <div className="db-conv-preview">
          {conv.user_topic
            ? <span className="db-conv-topic-preview"><i className="fas fa-tag" />{conv.user_topic}</span>
            : <span className={`db-status-badge ${STATUS_CLS[conv.status]}`}>{STATUS_LABEL[conv.status]}</span>
          }
          {conv.agents && <span className="db-conv-agent-tag">→ {conv.agents.name}</span>}
        </div>
      </div>
      {showDelete && (
        <button className="db-conv-delete" onClick={e => onDelete(conv.id, e)} title="Löschen">
          <i className="fas fa-trash" />
        </button>
      )}
    </motion.div>
  )
}

/* ── Section ─────────────────────────────────────── */
function Section({ icon, title, badge, badgeWarn, open, onToggle, children, emptyText }) {
  return (
    <div className="db-section">
      <button className="db-section-hdr" onClick={onToggle}>
        <i className={`fas fa-${icon}`} />
        <span>{title}</span>
        {badge > 0 && <span className={`db-section-badge ${badgeWarn ? 'warn' : ''}`}>{badge}</span>}
        <i className={`fas fa-chevron-${open ? 'up' : 'down'} db-section-arrow`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}>
            {children}
            {!children?.length && (
              <p className="db-section-empty">{emptyText}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════ */
export default function Dashboard({ session, agent, onAgentUpdate }) {
  const navigate = useNavigate()

  const [conversations, setConversations] = useState([])
  const [history, setHistory]       = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages]     = useState([])
  const [replyInput, setReplyInput] = useState('')
  const [isOnline, setIsOnline]     = useState(true)
  const [activeTab, setActiveTab]   = useState('active')  // mobile only
  const [mobileShowChat, setMobileShowChat] = useState(false)
  const [quickReplies, setQuickReplies] = useState([])
  const [showQR, setShowQR]         = useState(false)
  const [unreadCounts, setUnreadCounts] = useState({})
  const [onlineAgents, setOnlineAgents] = useState([])
  const [showTransfer, setShowTransfer] = useState(false)
  const [noteInput, setNoteInput]   = useState('')
  const [showNotes, setShowNotes]   = useState(false)
  const [showInfo, setShowInfo]     = useState(false)
  const [sectionsOpen, setSectionsOpen] = useState({ waiting: true, active: true, history: false })

  const endRef      = useRef(null)
  const channelRef  = useRef(null)
  const inputRef    = useRef(null)

  function toggleSection(key) {
    setSectionsOpen(prev => ({ ...prev, [key]: !prev[key] }))
  }

  /* ── Service Worker ──────────────────────────── */
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  /* ── Quick replies ───────────────────────────── */
  useEffect(() => {
    loadQuickReplies()
    const ch = supabase.channel('qr-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quick_replies' }, () => loadQuickReplies())
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  /* ── Online agents ───────────────────────────── */
  useEffect(() => {
    loadOnlineAgents()
    const ch = supabase.channel('agents-online')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'agents' }, () => loadOnlineAgents())
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  async function loadOnlineAgents() {
    const { data } = await supabase.from('agents').select('id, name, avatar_url, is_online').eq('is_online', true)
    setOnlineAgents(data || [])
  }

  async function loadQuickReplies() {
    const { data } = await supabase.from('quick_replies').select('*').order('sort_order')
    setQuickReplies(data || [])
  }

  /* ── Own online status ───────────────────────── */
  useEffect(() => {
    if (agent?.id) supabase.from('agents').update({ is_online: true }).eq('id', agent.id)
    const off = () => { if (agent?.id) supabase.from('agents').update({ is_online: false }).eq('id', agent.id) }
    window.addEventListener('beforeunload', off)
    return () => { window.removeEventListener('beforeunload', off); off() }
  }, [agent?.id])

  /* ── Load + subscribe conversations ─────────── */
  useEffect(() => {
    loadConversations(); loadHistory()
    const ch = supabase.channel('db-convs')
      .on('postgres_changes', { event: '*', schema:'public', table:'conversations' }, (payload) => {
        loadConversations()
        if (payload.eventType === 'INSERT' && payload.new.status === 'waiting') {
          const name = payload.new.user_name || 'Besucher'
          if (agent?.notify_sound !== false) playSound()
          if (agent?.notify_browser !== false) showBrowserNotification('Neuer Chat! 💬', `${name} wartet auf Antwort`)
        }
        if (payload.new?.status === 'closed') {
          loadHistory()
          setActiveConv(prev => prev?.id === payload.new.id ? { ...prev, status: 'closed' } : prev)
        }
      })
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [agent]) // eslint-disable-line

  async function loadConversations() {
    const { data } = await supabase
      .from('conversations').select('*, agents(*)')
      .in('status', ['waiting','active'])
      .order('last_message_at', { ascending: false })
    setConversations(data || [])
  }

  async function loadHistory() {
    const { data } = await supabase
      .from('conversations').select('*, agents(*)')
      .eq('status', 'closed')
      .order('last_message_at', { ascending: false })
      .limit(50)
    setHistory(data || [])
  }

  /* ── Select conversation ─────────────────────── */
  const selectConv = useCallback(async (conv) => {
    setActiveConv(conv)
    setMobileShowChat(true)
    setReplyInput(''); setShowQR(false); setShowNotes(false)
    const { data: msgs } = await supabase
      .from('messages').select('*').eq('conversation_id', conv.id).order('created_at', { ascending: true })
    setMessages(msgs || [])
    setUnreadCounts(prev => ({ ...prev, [conv.id]: 0 }))
    setTimeout(() => endRef.current?.scrollIntoView({ behavior:'instant' }), 60)
    if (channelRef.current) supabase.removeChannel(channelRef.current)
    const ch = supabase.channel('dash-msgs-' + conv.id)
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`conversation_id=eq.${conv.id}` },
        (payload) => {
          setMessages(prev => prev.find(m => m.id === payload.new.id) ? prev : [...prev, payload.new])
          setTimeout(() => endRef.current?.scrollIntoView({ behavior:'smooth' }), 60)
        })
      .subscribe()
    channelRef.current = ch
  }, [])

  /* ── Claim ───────────────────────────────────── */
  async function claimConv(conv) {
    if (!agent) return
    await supabase.from('conversations').update({ status: 'active', assigned_agent_id: agent.id }).eq('id', conv.id)
    const updated = { ...conv, status:'active', assigned_agent_id:agent.id, agents:agent }
    setActiveConv(updated)
    setConversations(prev => prev.map(c => c.id === conv.id ? updated : c))
  }

  /* ── Close conversation ──────────────────────── */
  async function closeConv(convId) {
    await supabase.from('conversations').update({ status:'closed' }).eq('id', convId)
    setActiveConv(prev => prev?.id === convId ? { ...prev, status: 'closed' } : prev)
    setMobileShowChat(false)
    if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current = null }
    loadConversations(); loadHistory()
  }

  /* ── Transfer ────────────────────────────────── */
  async function transferConv(targetAgent) {
    if (!activeConv || !targetAgent) return
    await supabase.from('conversations').update({ assigned_agent_id: targetAgent.id }).eq('id', activeConv.id)
    await supabase.from('messages').insert({
      conversation_id: activeConv.id, sender_type: 'system', sender_name: 'System',
      content: `Chat wurde von ${agent.name} an ${targetAgent.name} übergeben.`
    })
    setActiveConv(prev => ({ ...prev, assigned_agent_id: targetAgent.id, agents: targetAgent }))
    setShowTransfer(false)
  }

  /* ── Internal note ───────────────────────────── */
  async function sendNote(e) {
    e?.preventDefault()
    const text = noteInput.trim()
    if (!text || !activeConv) return
    setNoteInput('')
    await supabase.from('messages').insert({
      conversation_id: activeConv.id, sender_type: 'note',
      sender_name: agent?.name || 'Team', content: text
    })
  }

  /* ── Delete conv ─────────────────────────────── */
  async function deleteConv(convId, e) {
    e.stopPropagation()
    await supabase.from('messages').delete().eq('conversation_id', convId)
    await supabase.from('conversations').delete().eq('id', convId)
    setHistory(prev => prev.filter(c => c.id !== convId))
    if (activeConv?.id === convId) { setActiveConv(null); setMessages([]) }
  }

  /* ── Send message ────────────────────────────── */
  async function sendMessage(e) {
    e?.preventDefault()
    const text = replyInput.trim()
    if (!text || !activeConv || !agent) return
    setReplyInput(''); setShowQR(false)
    await supabase.from('messages').insert({
      conversation_id: activeConv.id, sender_type: 'agent',
      sender_name: agent.name, sender_avatar: agent.avatar_url, content: text
    })
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function insertQR(content) {
    setReplyInput(content); setShowQR(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  async function toggleOnline() {
    const next = !isOnline
    setIsOnline(next)
    if (agent) await supabase.from('agents').update({ is_online: next }).eq('id', agent.id)
  }

  async function logout() {
    if (agent) await supabase.from('agents').update({ is_online: false }).eq('id', agent.id)
    await supabase.auth.signOut()
  }

  /* ── Computed ────────────────────────────────── */
  const waitingList = conversations.filter(c => c.status === 'waiting')
  const activeList  = conversations.filter(c => c.status === 'active')
  const tabList = activeTab === 'history' ? history : activeTab === 'waiting' ? waitingList : activeList

  /* ════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════ */
  return (
    <div className="db-root">

      {/* ════ SIDEBAR ════ */}
      <aside className={`db-sidebar ${mobileShowChat ? 'mobile-hidden' : ''}`}>

        {/* Brand */}
        <div className="db-sidebar-top">
          <div className="db-brand">
            <img src="/icon-192.png" alt="TL" className="db-brand-logo" />
            <span>TEAM LAZER</span>
          </div>
          <div className="db-brand-actions">
            <button className="icon-btn" onClick={() => navigate('/settings')} title="Einstellungen">
              <i className="fas fa-cog" />
            </button>
            <button className="icon-btn danger" onClick={logout} title="Ausloggen">
              <i className="fas fa-sign-out-alt" />
            </button>
          </div>
        </div>

        {/* Agent */}
        <div className="db-agent-bar">
          <Avatar agent={agent} size={34} />
          <div className="db-agent-info">
            <strong>{agent?.name || '…'}</strong>
            <button className={`online-toggle ${isOnline ? 'online' : 'offline'}`} onClick={toggleOnline}>
              <span className="online-dot" />{isOnline ? 'Online' : 'Offline'}
            </button>
          </div>
          {onlineAgents.length > 1 && (
            <div className="db-online-mini">
              {onlineAgents.filter(a => a.id !== agent?.id).slice(0,3).map(a => (
                <div key={a.id} className="db-online-mini-avatar" title={a.name}>
                  <Avatar agent={a} size={22} />
                  <span className="db-online-dot-sm" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="db-stats-strip">
          <div className="db-stat">
            <span className="db-stat-num">{waitingList.length + activeList.length}</span>
            <span className="db-stat-lbl">Offene Chats</span>
          </div>
          <div className="db-stat-divider" />
          <div className="db-stat">
            <span className={`db-stat-num ${waitingList.length > 0 ? 'warn' : ''}`}>{waitingList.length}</span>
            <span className="db-stat-lbl">Wartend</span>
          </div>
          <div className="db-stat-divider" />
          <div className="db-stat">
            <span className="db-stat-num">{onlineAgents.length}</span>
            <span className="db-stat-lbl">Online</span>
          </div>
        </div>

        {/* ── Desktop: collapsible sections ── */}
        <div className="db-conv-list db-desktop-only">
          <Section icon="clock" title="Wartend" badge={waitingList.length} badgeWarn
            open={sectionsOpen.waiting} onToggle={() => toggleSection('waiting')}
            emptyText="Keine wartenden Chats">
            {waitingList.length > 0 && waitingList.map(conv => (
              <ConvItem key={conv.id} conv={conv} activeConv={activeConv}
                unreadCounts={unreadCounts} onSelect={selectConv} onDelete={deleteConv} />
            ))}
          </Section>
          <Section icon="comment-dots" title="Aktiv" badge={activeList.length}
            open={sectionsOpen.active} onToggle={() => toggleSection('active')}
            emptyText="Keine aktiven Chats">
            {activeList.length > 0 && activeList.map(conv => (
              <ConvItem key={conv.id} conv={conv} activeConv={activeConv}
                unreadCounts={unreadCounts} onSelect={selectConv} onDelete={deleteConv} />
            ))}
          </Section>
          <Section icon="history" title="Verlauf"
            open={sectionsOpen.history} onToggle={() => toggleSection('history')}
            emptyText="Keine abgeschlossenen Chats">
            {history.length > 0 && history.map(conv => (
              <ConvItem key={conv.id} conv={conv} activeConv={activeConv}
                unreadCounts={unreadCounts} onSelect={selectConv} onDelete={deleteConv} showDelete />
            ))}
          </Section>
        </div>

        {/* ── Mobile: tab-filtered list ── */}
        <div className="db-conv-list db-mobile-only">
          <AnimatePresence initial={false}>
            {tabList.length === 0 ? (
              <motion.div className="db-empty" initial={{ opacity:0 }} animate={{ opacity:1 }}>
                <i className={`fas fa-${activeTab === 'history' ? 'history' : 'comment-slash'}`} />
                <p>{activeTab === 'history' ? 'Keine abgeschlossenen Chats' : 'Keine Chats'}</p>
              </motion.div>
            ) : tabList.map(conv => (
              <ConvItem key={conv.id} conv={conv} activeConv={activeConv}
                unreadCounts={unreadCounts} onSelect={selectConv} onDelete={deleteConv}
                showDelete={activeTab === 'history'} />
            ))}
          </AnimatePresence>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <div className={`db-main ${mobileShowChat ? '' : 'mobile-hidden-main'}`}>
        {!activeConv ? (
          <div className="db-main-empty">
            <img src="/icon-192.png" alt="TL" className="db-empty-logo" />
            <p>Wähle einen Chat aus der Liste</p>
            {waitingList.length > 0 && (
              <button className="db-claim-btn" onClick={() => selectConv(waitingList[0])}>
                <i className="fas fa-headset" /> {waitingList.length} wartende{waitingList.length > 1 ? '' : 'r'} Chat{waitingList.length > 1 ? 's' : ''}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="db-chat-header">
              <button className="db-back-btn" onClick={() => { setMobileShowChat(false); setActiveConv(null) }}>
                <i className="fas fa-arrow-left" />
              </button>
              <Avatar name={activeConv.user_name} size={36} />
              <div className="db-chat-header-info">
                <strong>{activeConv.user_name}</strong>
                <div className="db-chat-meta">
                  <span className={`db-status-badge ${STATUS_CLS[activeConv.status]}`}>
                    {STATUS_LABEL[activeConv.status]}
                  </span>
                  {activeConv.user_topic && (
                    <span className="db-conv-topic-tag">
                      <i className="fas fa-tag" /> {activeConv.user_topic}
                    </span>
                  )}
                  {activeConv.agents && (
                    <span className="db-assigned">
                      <Avatar agent={activeConv.agents} size={14} />
                      {activeConv.agents.name}
                    </span>
                  )}
                  <span className="db-chat-since">{fmtTime(activeConv.created_at)}</span>
                </div>
              </div>
              <div className="db-chat-header-actions">
                <button className={`icon-btn ${showInfo ? 'active' : ''}`}
                  onClick={() => setShowInfo(v => !v)} title="Kundeninfo">
                  <i className="fas fa-user-circle" />
                </button>
                {activeConv.status !== 'closed' && activeConv.assigned_agent_id === agent?.id && (
                  <button className={`icon-btn ${showNotes ? 'active' : ''}`}
                    onClick={() => setShowNotes(v => !v)} title="Interne Notiz">
                    <i className="fas fa-sticky-note" />
                  </button>
                )}
                {activeConv.status === 'active' && activeConv.assigned_agent_id === agent?.id && (
                  <button className={`icon-btn ${showTransfer ? 'active' : ''}`}
                    onClick={() => setShowTransfer(v => !v)} title="Chat übergeben">
                    <i className="fas fa-exchange-alt" />
                  </button>
                )}
                {activeConv.status === 'waiting' && (
                  <button className="db-claim-btn" onClick={() => claimConv(activeConv)}>
                    <i className="fas fa-headset" /> Übernehmen
                  </button>
                )}
                {activeConv.status === 'active' && activeConv.assigned_agent_id && activeConv.assigned_agent_id !== agent?.id && (
                  <span className="db-locked-badge"><i className="fas fa-lock" /> Besetzt</span>
                )}
                {activeConv.status !== 'closed' && (
                  <button className="db-end-btn" onClick={() => closeConv(activeConv.id)}>
                    <i className="fas fa-times-circle" /> Beenden
                  </button>
                )}
              </div>

              {/* Transfer dropdown */}
              <AnimatePresence>
                {showTransfer && (
                  <motion.div className="db-transfer-dropdown"
                    initial={{ opacity:0, y:-8, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, y:-8, scale:0.96 }}>
                    <p className="db-transfer-title"><i className="fas fa-exchange-alt" /> Chat übergeben an:</p>
                    {onlineAgents.filter(a => a.id !== agent?.id).length === 0
                      ? <p className="db-transfer-empty">Keine anderen Agenten online</p>
                      : onlineAgents.filter(a => a.id !== agent?.id).map(a => (
                          <button key={a.id} className="db-transfer-agent" onClick={() => transferConv(a)}>
                            <Avatar agent={a} size={28} />
                            <span>{a.name}</span>
                            <span className="db-transfer-online-dot" />
                          </button>
                        ))
                    }
                    <button className="db-transfer-cancel" onClick={() => setShowTransfer(false)}>Abbrechen</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages */}
            <div className="db-messages">
              {messages.map((msg, i) => {
                const isOutgoing = msg.sender_type === 'agent'
                const isBot = msg.sender_type === 'bot'
                const isNote = msg.sender_type === 'note'
                const isSystem = msg.sender_type === 'system'
                const showDate = i === 0 || new Date(messages[i-1].created_at).toDateString() !== new Date(msg.created_at).toDateString()
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="db-date-divider">
                        {new Date(msg.created_at).toLocaleDateString('de-DE', { weekday:'short', day:'2-digit', month:'2-digit' })}
                      </div>
                    )}
                    {isSystem && (
                      <div className="db-system-msg">
                        <i className="fas fa-info-circle" /> {msg.content}
                      </div>
                    )}
                    {isNote && (
                      <motion.div className="db-note-msg" initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }}>
                        <i className="fas fa-sticky-note" />
                        <div className="db-note-content">
                          <span className="db-note-author">{msg.sender_name} · Notiz</span>
                          <span>{msg.content}</span>
                        </div>
                        <span className="db-msg-time">{fmtTime(msg.created_at)}</span>
                      </motion.div>
                    )}
                    {!isNote && !isSystem && (
                      <motion.div className={`db-msg-row ${isOutgoing ? 'outgoing' : 'incoming'}`}
                        initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }}>
                        {!isOutgoing && (
                          <div className="db-msg-avatar-sm">
                            {isBot
                              ? <span style={{fontSize:'1.1rem'}}>🤖</span>
                              : <div className="db-msg-user-dot">{(activeConv.user_name?.[0] || '?').toUpperCase()}</div>
                            }
                          </div>
                        )}
                        <div className="db-msg-content">
                          <div className="db-msg-meta">
                            <span className="db-msg-sender">
                              {msg.sender_type === 'user' ? activeConv.user_name
                              : msg.sender_type === 'bot' ? 'Bot'
                              : msg.sender_name || agent?.name || 'Agent'}
                            </span>
                            <span className="db-msg-time">{fmtTime(msg.created_at)}</span>
                          </div>
                          <div className={`db-msg-bubble ${isOutgoing ? 'out' : 'in'}`}>{msg.content}</div>
                        </div>
                        {isOutgoing && (
                          <div className="db-msg-avatar-sm">
                            <Avatar agent={agent} size={26} />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )
              })}
              <div ref={endRef} />
            </div>

            {/* Info panel (mobile / small desktop — above input) */}
            <AnimatePresence>
              {showInfo && (
                <motion.div className="db-info-panel db-info-inline"
                  initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                  exit={{ opacity:0, height:0 }}>
                  <CustomerInfoContent conv={activeConv} messages={messages} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Internal notes */}
            <AnimatePresence>
              {showNotes && (
                <motion.div className="db-note-area"
                  initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                  exit={{ opacity:0, height:0 }}>
                  <form className="db-note-form" onSubmit={sendNote}>
                    <input type="text" placeholder="Interne Notiz (nur für das Team sichtbar)…"
                      value={noteInput} onChange={e => setNoteInput(e.target.value)}
                      className="db-note-input" />
                    <button type="submit" className="db-note-btn" disabled={!noteInput.trim()}>
                      <i className="fas fa-sticky-note" /> Notiz
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input area */}
            {activeConv.status === 'active' && activeConv.assigned_agent_id === agent?.id ? (
              <div className="db-input-area">
                <AnimatePresence>
                  {showQR && quickReplies.length > 0 && (
                    <motion.div className="qr-panel"
                      initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                      exit={{ opacity:0, height:0 }}>
                      {quickReplies.map(r => (
                        <button key={r.id} className="qr-chip" onClick={() => insertQR(r.content)} title={r.content}>
                          <i className="fas fa-bolt" /> {r.title}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                <form className="db-reply-bar" onSubmit={sendMessage}>
                  <button type="button" className={`qr-toggle-btn ${showQR ? 'active' : ''}`}
                    onClick={() => setShowQR(v => !v)} title="Schnellantworten">
                    <i className="fas fa-bolt" />
                  </button>
                  <input ref={inputRef} type="text"
                    placeholder={`Antworten als ${agent?.name}…`}
                    value={replyInput} onChange={e => setReplyInput(e.target.value)}
                    className="db-reply-input" />
                  <button type="submit" className="db-send-btn" disabled={!replyInput.trim()}>
                    <i className="fas fa-paper-plane" />
                  </button>
                </form>
              </div>
            ) : activeConv.status === 'waiting' ? (
              <div className="db-claim-bar">
                <p><i className="fas fa-clock" /> Wartet auf Übernahme</p>
                <button className="db-claim-btn large" onClick={() => claimConv(activeConv)}>
                  <i className="fas fa-headset" /> Chat übernehmen
                </button>
              </div>
            ) : activeConv.status === 'closed' ? (
              <div className="db-claim-bar muted">
                <p><i className="fas fa-lock" /> Chat wurde beendet</p>
              </div>
            ) : (
              <div className="db-claim-bar muted">
                <p><i className="fas fa-info-circle" /> Wird von <strong>{activeConv.agents?.name}</strong> bearbeitet</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ════ RIGHT PANEL (Desktop) ════ */}
      <AnimatePresence>
        {activeConv && showInfo && (
          <motion.aside className="db-right-panel"
            initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
            <div className="db-right-panel-inner">
              <div className="db-right-panel-avatar">
                <Avatar name={activeConv.user_name} size={64} />
                <h3>{activeConv.user_name}</h3>
                <span className={`db-status-badge ${STATUS_CLS[activeConv.status]}`}>
                  {STATUS_LABEL[activeConv.status]}
                </span>
              </div>
              <CustomerInfoContent conv={activeConv} messages={messages} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ════ MOBILE BOTTOM NAV ════ */}
      <nav className="db-mobile-nav">
        <button className={activeTab === 'active' && !mobileShowChat ? 'active' : ''}
          onClick={() => { setActiveTab('active'); setMobileShowChat(false) }}>
          <div className="db-nav-icon-wrap">
            <i className="fas fa-comments" />
            {activeList.length > 0 && <span className="db-nav-badge">{activeList.length}</span>}
          </div>
          <span>Aktiv</span>
        </button>
        <button className={activeTab === 'waiting' && !mobileShowChat ? 'active' : ''}
          onClick={() => { setActiveTab('waiting'); setMobileShowChat(false) }}>
          <div className="db-nav-icon-wrap">
            <i className="fas fa-clock" />
            {waitingList.length > 0 && <span className="db-nav-badge warn">{waitingList.length}</span>}
          </div>
          <span>Wartend</span>
        </button>
        <button className={activeTab === 'history' && !mobileShowChat ? 'active' : ''}
          onClick={() => { setActiveTab('history'); setMobileShowChat(false) }}>
          <div className="db-nav-icon-wrap">
            <i className="fas fa-history" />
          </div>
          <span>Verlauf</span>
        </button>
        <button onClick={() => navigate('/settings')}>
          <div className="db-nav-icon-wrap">
            <i className="fas fa-cog" />
          </div>
          <span>Einst.</span>
        </button>
      </nav>
    </div>
  )
}

/* ── Customer info content (reused in inline + right panel) ── */
function CustomerInfoContent({ conv, messages }) {
  return (
    <div className="db-info-rows">
      {conv.user_email && (
        <div className="db-info-row">
          <i className="fas fa-envelope" />
          <div>
            <span>E-Mail</span>
            <a href={`mailto:${conv.user_email}`}>{conv.user_email}</a>
          </div>
        </div>
      )}
      {conv.user_topic && (
        <div className="db-info-row">
          <i className="fas fa-tag" />
          <div><span>Thema</span><strong>{conv.user_topic}</strong></div>
        </div>
      )}
      <div className="db-info-row">
        <i className="fas fa-clock" />
        <div>
          <span>Gestartet</span>
          <strong>{new Date(conv.created_at).toLocaleString('de-DE', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}</strong>
        </div>
      </div>
      <div className="db-info-row">
        <i className="fas fa-comment" />
        <div><span>Nachrichten</span><strong>{messages.length}</strong></div>
      </div>
    </div>
  )
}
