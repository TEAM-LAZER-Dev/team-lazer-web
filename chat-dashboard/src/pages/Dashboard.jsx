import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

/* ── Helpers ─────────────────────────────────────── */
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)   return 'Gerade eben'
  if (diff < 3600) return `${Math.floor(diff / 60)} Min`
  if (diff < 86400) return `${Math.floor(diff / 3600)} Std`
  return new Date(dateStr).toLocaleDateString('de-DE')
}
function Avatar({ agent, size = 36 }) {
  if (agent?.avatar_url) return (
    <img src={agent.avatar_url} alt={agent.name}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />
  )
  const initials = (agent?.name || 'TL').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
  return (
    <div className="avatar-placeholder" style={{ width: size, height: size }}>
      {initials}
    </div>
  )
}
const STATUS_LABEL = { waiting: 'Wartend', active: 'Aktiv', bot: 'Bot', closed: 'Geschlossen' }
const STATUS_CLASS = { waiting: 'status-waiting', active: 'status-active', bot: 'status-bot', closed: 'status-closed' }

/* ── Main Dashboard ──────────────────────────────── */
export default function Dashboard({ session }) {
  const [agent, setAgent]               = useState(null)
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv]     = useState(null)
  const [messages, setMessages]         = useState([])
  const [replyInput, setReplyInput]     = useState('')
  const [isOnline, setIsOnline]         = useState(true)
  const [mobileShowChat, setMobileShowChat] = useState(false)

  const endRef      = useRef(null)
  const channelRef  = useRef(null)

  /* ── Load agent profile ──────────────────────── */
  useEffect(() => {
    async function loadAgent() {
      const { data } = await supabase
        .from('agents').select('*').eq('auth_user_id', session.user.id).single()
      if (data) {
        setAgent(data)
        await supabase.from('agents')
          .update({ is_online: true }).eq('id', data.id)
      }
    }
    loadAgent()

    // Set offline on unload
    const handle = () => {
      if (agent?.id) {
        navigator.sendBeacon('/api/offline') // fallback — also set via beforeunload
        supabase.from('agents').update({ is_online: false }).eq('id', agent?.id)
      }
    }
    window.addEventListener('beforeunload', handle)
    return () => window.removeEventListener('beforeunload', handle)
  }, [session.user.id]) // eslint-disable-line

  /* ── Load conversations ──────────────────────── */
  useEffect(() => {
    loadConversations()
    const ch = supabase
      .channel('dashboard-convs')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'conversations'
      }, () => loadConversations())
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, []) // eslint-disable-line

  async function loadConversations() {
    const { data } = await supabase
      .from('conversations')
      .select('*, agents(*)')
      .in('status', ['waiting', 'active'])
      .order('last_message_at', { ascending: false })
    setConversations(data || [])
  }

  /* ── Select conversation ─────────────────────── */
  async function selectConversation(conv) {
    setActiveConv(conv)
    setMobileShowChat(true)
    setReplyInput('')

    const { data: msgs } = await supabase
      .from('messages').select('*')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: true })
    setMessages(msgs || [])
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'instant' }), 60)

    // Subscribe to new messages in this conversation
    if (channelRef.current) supabase.removeChannel(channelRef.current)
    const ch = supabase
      .channel('dashboard-msgs-' + conv.id)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${conv.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
        setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
      })
      .subscribe()
    channelRef.current = ch
  }

  /* ── Claim conversation ──────────────────────── */
  async function claimConversation(conv) {
    if (!agent) return
    await supabase.from('conversations').update({
      status: 'active',
      assigned_agent_id: agent.id
    }).eq('id', conv.id)
    setActiveConv({ ...conv, status: 'active', assigned_agent_id: agent.id, agents: agent })
    await loadConversations()
  }

  /* ── Close conversation ──────────────────────── */
  async function closeConversation(convId) {
    await supabase.from('conversations').update({ status: 'closed' }).eq('id', convId)
    setActiveConv(null)
    setMessages([])
    setMobileShowChat(false)
    if (channelRef.current) supabase.removeChannel(channelRef.current)
    await loadConversations()
  }

  /* ── Send message ────────────────────────────── */
  async function sendMessage(e) {
    e.preventDefault()
    const text = replyInput.trim()
    if (!text || !activeConv || !agent) return
    setReplyInput('')

    await supabase.from('messages').insert({
      conversation_id: activeConv.id,
      sender_type: 'agent',
      sender_name: agent.name,
      sender_avatar: agent.avatar_url,
      content: text,
    })
  }

  /* ── Toggle online status ────────────────────── */
  async function toggleOnline() {
    const next = !isOnline
    setIsOnline(next)
    if (agent) await supabase.from('agents').update({ is_online: next }).eq('id', agent.id)
  }

  /* ── Logout ──────────────────────────────────── */
  async function logout() {
    if (agent) await supabase.from('agents').update({ is_online: false }).eq('id', agent.id)
    await supabase.auth.signOut()
  }

  const waitingCount = conversations.filter(c => c.status === 'waiting').length

  /* ── Render ────────────────────────────────────── */
  return (
    <div className="db-root">

      {/* Sidebar */}
      <div className={`db-sidebar ${mobileShowChat ? 'mobile-hidden' : ''}`}>
        {/* Sidebar Header */}
        <div className="db-sidebar-header">
          <div className="db-brand">
            <i className="fas fa-bolt" />
            <span>Chat Dashboard</span>
          </div>
          <div className="db-agent-row">
            <Avatar agent={agent} size={32} />
            <div className="db-agent-info">
              <strong>{agent?.name || '…'}</strong>
              <button className={`online-toggle ${isOnline ? 'online' : 'offline'}`} onClick={toggleOnline}>
                <span className="online-dot" />
                {isOnline ? 'Online' : 'Offline'}
              </button>
            </div>
            <button className="logout-btn" onClick={logout} title="Ausloggen">
              <i className="fas fa-sign-out-alt" />
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="db-conv-list">
          {waitingCount > 0 && (
            <div className="db-section-label">
              <span>Wartend</span>
              <span className="db-count">{waitingCount}</span>
            </div>
          )}

          <AnimatePresence initial={false}>
            {conversations.length === 0 && (
              <motion.div className="db-empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <i className="fas fa-comment-slash" />
                <p>Keine aktiven Chats</p>
              </motion.div>
            )}
            {conversations.map(conv => (
              <motion.div key={conv.id}
                className={`db-conv-item ${activeConv?.id === conv.id ? 'active' : ''} ${conv.status === 'waiting' ? 'is-waiting' : ''}`}
                onClick={() => selectConversation(conv)}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }} layout>
                <div className="db-conv-avatar">
                  <span>{conv.user_name?.[0]?.toUpperCase() || '?'}</span>
                </div>
                <div className="db-conv-info">
                  <div className="db-conv-top">
                    <strong>{conv.user_name}</strong>
                    <span className="db-conv-time">{timeAgo(conv.last_message_at)}</span>
                  </div>
                  <div className="db-conv-bottom">
                    <span className={`db-status-badge ${STATUS_CLASS[conv.status]}`}>
                      {STATUS_LABEL[conv.status]}
                    </span>
                    {conv.agents && <span className="db-conv-agent">→ {conv.agents.name}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`db-main ${mobileShowChat ? '' : 'mobile-hidden-main'}`}>
        {!activeConv ? (
          <div className="db-main-empty">
            <i className="fas fa-comments" />
            <p>Wähle einen Chat aus der Liste</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="db-chat-header">
              <button className="db-back-btn" onClick={() => { setMobileShowChat(false); setActiveConv(null) }}>
                <i className="fas fa-arrow-left" />
              </button>
              <div className="db-chat-header-info">
                <div className="db-conv-avatar sm">
                  <span>{activeConv.user_name?.[0]?.toUpperCase() || '?'}</span>
                </div>
                <div>
                  <strong>{activeConv.user_name}</strong>
                  <span className={`db-status-badge ${STATUS_CLASS[activeConv.status]}`}>
                    {STATUS_LABEL[activeConv.status]}
                  </span>
                </div>
              </div>
              <div className="db-chat-header-actions">
                {activeConv.status === 'waiting' && (
                  <button className="db-claim-btn" onClick={() => claimConversation(activeConv)}>
                    <i className="fas fa-headset" /> Übernehmen
                  </button>
                )}
                <button className="db-close-btn" onClick={() => closeConversation(activeConv.id)}
                  title="Chat schließen">
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="db-messages">
              {messages.map(msg => (
                <motion.div key={msg.id}
                  className={`db-msg ${msg.sender_type}`}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="db-msg-meta">
                    <span className="db-msg-sender">
                      {msg.sender_type === 'user' ? activeConv.user_name
                       : msg.sender_type === 'bot' ? '🤖 Bot'
                       : msg.sender_name}
                    </span>
                    <span className="db-msg-time">
                      {new Date(msg.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="db-msg-bubble">{msg.content}</div>
                </motion.div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Reply Input */}
            {activeConv.status === 'active' && activeConv.assigned_agent_id === agent?.id ? (
              <form className="db-reply-bar" onSubmit={sendMessage}>
                <input
                  type="text"
                  placeholder={`Antworten als ${agent?.name}…`}
                  value={replyInput}
                  onChange={e => setReplyInput(e.target.value)}
                  className="db-reply-input"
                  autoFocus
                />
                <button type="submit" className="db-send-btn" disabled={!replyInput.trim()}>
                  <i className="fas fa-paper-plane" />
                  Senden
                </button>
              </form>
            ) : activeConv.status === 'waiting' ? (
              <div className="db-claim-bar">
                <p>Noch nicht übernommen</p>
                <button className="db-claim-btn large" onClick={() => claimConversation(activeConv)}>
                  <i className="fas fa-headset" /> Chat übernehmen
                </button>
              </div>
            ) : (
              <div className="db-claim-bar muted">
                <p><i className="fas fa-info-circle" /> Dieser Chat wird von {activeConv.agents?.name} bearbeitet</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
