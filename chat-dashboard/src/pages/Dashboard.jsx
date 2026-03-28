import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/* ── Audio ───────────────────────────────────────── */
function playSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator(); const gain = ctx.createGain()
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
    const n = new Notification(title, { body, icon: '/icon-192.png' })
    setTimeout(() => n.close(), 6000)
  }
}

/* ── Time ────────────────────────────────────────── */
function timeAgo(d) {
  const diff = Math.floor((Date.now() - new Date(d)) / 1000)
  if (diff < 60)    return 'Jetzt'
  if (diff < 3600)  return `${Math.floor(diff/60)}m`
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
    <div className="avatar-placeholder" style={{ width:size, height:size, fontSize:size*0.36 }}>
      {initials}
    </div>
  )
}

/* ── Nav rail button ─────────────────────────────── */
function NavBtn({ icon, label, active, badge, danger, onClick }) {
  return (
    <button className={`db-nav-btn ${active?'active':''} ${danger?'danger':''}`} onClick={onClick} title={label}>
      <div className="db-nav-btn-icon">
        <i className={`fas fa-${icon}`} />
        {badge > 0 && <span className="db-nav-badge">{badge > 9 ? '9+' : badge}</span>}
      </div>
      <span>{label}</span>
    </button>
  )
}

/* ── Collapsible Section ─────────────────────────── */
function Section({ title, count, accent, open, onToggle, children }) {
  const icons = { waiting:'clock', active:'bolt', closed:'times-circle' }
  return (
    <div className={`db-section db-section-${accent}`}>
      <button className="db-section-hdr" onClick={onToggle}>
        <span className={`db-section-dot ${accent}`} />
        <i className={`fas fa-${icons[accent]||'circle'} db-section-icon`} />
        <span className="db-section-title">{title}</span>
        {count > 0 && <span className={`db-section-badge ${accent}`}>{count}</span>}
        <i className={`fas fa-chevron-${open?'up':'down'} db-section-arrow`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:0.18 }} style={{ overflow:'hidden' }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Customer conv item ──────────────────────────── */
function ConvItem({ conv, active, unread, onSelect, onDelete, accent }) {
  return (
    <motion.div className={`db-conv-item accent-${accent} ${active?'selected':''}`}
      onClick={() => onSelect(conv)} layout
      initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}>
      <div className="db-conv-av-wrap">
        <div className={`db-conv-av accent-${accent}`}>{(conv.user_name?.[0]||'?').toUpperCase()}</div>
        {unread > 0 && <span className="db-conv-unread">{unread}</span>}
      </div>
      <div className="db-conv-info">
        <div className="db-conv-row1">
          <strong>{conv.user_name||'Besucher'}</strong>
          <span className="db-conv-time">{timeAgo(conv.last_message_at)}</span>
        </div>
        <div className="db-conv-row2">
          <span className="db-conv-sub">
            {conv.user_topic ? <><i className="fas fa-tag" /> {conv.user_topic}</>
              : conv.agents?.name ? `→ ${conv.agents.name}` : 'Kein Thema'}
          </span>
        </div>
      </div>
      {onDelete && (
        <button className="db-conv-del" onClick={e=>{e.stopPropagation();onDelete(conv.id)}} title="Löschen">
          <i className="fas fa-trash" />
        </button>
      )}
    </motion.div>
  )
}

/* ── Contact item ────────────────────────────────── */
function ContactItem({ agent, selected, unread, onSelect, onChat }) {
  return (
    <motion.div className={`db-contact-item ${selected?'selected':''}`}
      initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }}>
      <button className="db-contact-main" onClick={onSelect}>
        <div className="db-team-av-wrap">
          <Avatar agent={agent} size={40} />
          <span className={`db-online-dot-sm ${agent.is_online?'online':''}`} />
        </div>
        <div className="db-team-info">
          <strong>{agent.name}</strong>
          <span className={agent.is_online ? 'text-online' : 'text-offline'}>
            {agent.is_online ? '● Online' : '○ Offline'}
          </span>
        </div>
        {unread > 0 && <span className="db-team-unread">{unread}</span>}
      </button>
      <button className="db-contact-chat-icon" onClick={onChat} title="Nachricht senden">
        <i className="fas fa-comment-dots" />
      </button>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════ */
export default function Dashboard({ session, agent, onAgentUpdate }) {
  const navigate = useNavigate()

  /* ── Nav ─────────────────────────────────────── */
  const [navSection, setNavSection] = useState('chats')
  const [mobileTab, setMobileTab]   = useState('chats')
  const [mobileShowChat, setMobileShowChat] = useState(false)

  /* ── Customer chats ──────────────────────────── */
  const [conversations, setConversations] = useState([])
  const [history, setHistory]       = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages]     = useState([])
  const [replyInput, setReplyInput] = useState('')
  const [unreadCounts, setUnreadCounts] = useState({})
  const [quickReplies, setQuickReplies] = useState([])
  const [showQR, setShowQR]         = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showNotes, setShowNotes]   = useState(false)
  const [noteInput, setNoteInput]   = useState('')
  const [showInfo, setShowInfo]     = useState(false)
  const [sectionsOpen, setSectionsOpen] = useState({ waiting:true, active:true, closed:false })

  /* ── Team ────────────────────────────────────── */
  const [allAgents, setAllAgents]     = useState([])
  const [onlineAgents, setOnlineAgents] = useState([])
  const [isOnline, setIsOnline]       = useState(true)

  /* ── Team DMs ────────────────────────────────── */
  const [teamChatWith, setTeamChatWith] = useState(null)
  const [teamMsgs, setTeamMsgs]         = useState([])
  const [teamInput, setTeamInput]       = useState('')
  const [unreadTeam, setUnreadTeam]     = useState({})
  const [contactInfo, setContactInfo]   = useState(null)

  const endRef      = useRef(null)
  const teamEndRef  = useRef(null)
  const channelRef  = useRef(null)
  const teamChanRef = useRef(null)
  const inputRef    = useRef(null)
  const teamInputRef = useRef(null)

  /* ── SW ──────────────────────────────────────── */
  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{})
  }, [])

  /* ── Agents ──────────────────────────────────── */
  useEffect(() => {
    loadAllAgents()
    const ch = supabase.channel('agents-watch')
      .on('postgres_changes', { event:'UPDATE', schema:'public', table:'agents' }, loadAllAgents)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  async function loadAllAgents() {
    const { data } = await supabase.from('agents').select('id,name,avatar_url,is_online').order('name')
    setAllAgents(data || [])
    setOnlineAgents((data||[]).filter(a => a.is_online))
  }

  /* ── Own status ──────────────────────────────── */
  useEffect(() => {
    if (agent?.id) supabase.from('agents').update({ is_online:true }).eq('id', agent.id)
    const off = () => { if (agent?.id) supabase.from('agents').update({ is_online:false }).eq('id', agent.id) }
    window.addEventListener('beforeunload', off)
    return () => { window.removeEventListener('beforeunload', off); off() }
  }, [agent?.id])

  /* ── Customer convs ──────────────────────────── */
  useEffect(() => {
    loadConversations(); loadHistory(); loadQuickReplies()
    const ch = supabase.channel('db-convs')
      .on('postgres_changes', { event:'*', schema:'public', table:'conversations' }, (payload) => {
        loadConversations()
        if (payload.eventType==='INSERT' && payload.new.status==='waiting') {
          const name = payload.new.user_name||'Besucher'
          if (agent?.notify_sound!==false) playSound()
          if (agent?.notify_browser!==false) showBrowserNotification('Neuer Chat! 💬', `${name} wartet`)
        }
        if (payload.new?.status==='closed') {
          loadHistory()
          setActiveConv(prev => prev?.id===payload.new.id ? {...prev, status:'closed'} : prev)
        }
      }).subscribe()
    return () => supabase.removeChannel(ch)
  }, [agent]) // eslint-disable-line

  async function loadConversations() {
    const { data } = await supabase.from('conversations').select('*, agents(*)')
      .in('status',['waiting','active']).order('last_message_at',{ascending:false})
    setConversations(data||[])
  }
  async function loadHistory() {
    const { data } = await supabase.from('conversations').select('*, agents(*)')
      .eq('status','closed').order('last_message_at',{ascending:false}).limit(50)
    setHistory(data||[])
  }
  async function loadQuickReplies() {
    const { data } = await supabase.from('quick_replies').select('*').order('sort_order')
    setQuickReplies(data||[])
  }

  /* ── Select conv ─────────────────────────────── */
  const selectConv = useCallback(async (conv) => {
    setActiveConv(conv); setTeamChatWith(null)
    setMobileShowChat(true); setReplyInput(''); setShowQR(false); setShowNotes(false)
    const { data:msgs } = await supabase.from('messages').select('*')
      .eq('conversation_id', conv.id).order('created_at',{ascending:true})
    setMessages(msgs||[])
    setUnreadCounts(prev => ({...prev, [conv.id]:0}))
    setTimeout(() => endRef.current?.scrollIntoView({behavior:'instant'}), 60)
    if (channelRef.current) supabase.removeChannel(channelRef.current)
    const ch = supabase.channel('dash-msgs-'+conv.id)
      .on('postgres_changes', {event:'INSERT',schema:'public',table:'messages',filter:`conversation_id=eq.${conv.id}`},
        (payload) => {
          setMessages(prev => prev.find(m=>m.id===payload.new.id) ? prev : [...prev, payload.new])
          setTimeout(() => endRef.current?.scrollIntoView({behavior:'smooth'}), 60)
        }).subscribe()
    channelRef.current = ch
  }, [])

  async function claimConv(conv) {
    if (!agent) return
    await supabase.from('conversations').update({status:'active',assigned_agent_id:agent.id}).eq('id',conv.id)
    const updated = {...conv, status:'active', assigned_agent_id:agent.id, agents:agent}
    setActiveConv(updated)
    setConversations(prev => prev.map(c => c.id===conv.id ? updated : c))
  }

  async function closeConv(convId) {
    await supabase.from('conversations').update({status:'closed'}).eq('id',convId)
    setActiveConv(prev => prev?.id===convId ? {...prev,status:'closed'} : prev)
    setMobileShowChat(false)
    if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current=null }
    loadConversations(); loadHistory()
  }

  async function transferConv(targetAgent) {
    if (!activeConv) return
    await supabase.from('conversations').update({assigned_agent_id:targetAgent.id}).eq('id',activeConv.id)
    await supabase.from('messages').insert({
      conversation_id:activeConv.id, sender_type:'system', sender_name:'System',
      content:`Chat von ${agent.name} an ${targetAgent.name} übergeben.`
    })
    setActiveConv(prev => ({...prev, assigned_agent_id:targetAgent.id, agents:targetAgent}))
    setShowTransfer(false)
  }

  async function deleteConv(convId) {
    await supabase.from('messages').delete().eq('conversation_id',convId)
    await supabase.from('conversations').delete().eq('id',convId)
    setHistory(prev => prev.filter(c => c.id!==convId))
    if (activeConv?.id===convId) { setActiveConv(null); setMessages([]) }
  }

  async function sendMessage(e) {
    e?.preventDefault()
    const text = replyInput.trim(); if (!text||!activeConv||!agent) return
    setReplyInput(''); setShowQR(false)
    await supabase.from('messages').insert({
      conversation_id:activeConv.id, sender_type:'agent',
      sender_name:agent.name, sender_avatar:agent.avatar_url, content:text
    })
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  async function sendNote(e) {
    e?.preventDefault()
    const text = noteInput.trim(); if (!text||!activeConv) return
    setNoteInput('')
    await supabase.from('messages').insert({
      conversation_id:activeConv.id, sender_type:'note', sender_name:agent?.name||'Team', content:text
    })
  }

  /* ── Team DMs ────────────────────────────────── */
  async function openTeamChat(targetAgent) {
    setTeamChatWith(targetAgent); setActiveConv(null)
    setMobileShowChat(true); setTeamInput(''); setContactInfo(null)
    setUnreadTeam(prev => ({...prev, [targetAgent.id]:0}))
    const { data } = await supabase.from('team_messages')
      .select('*')
      .or(`and(sender_id.eq.${agent.id},receiver_id.eq.${targetAgent.id}),and(sender_id.eq.${targetAgent.id},receiver_id.eq.${agent.id})`)
      .order('created_at',{ascending:true})
    setTeamMsgs(data||[])
    setTimeout(() => teamEndRef.current?.scrollIntoView({behavior:'instant'}), 60)
    await supabase.from('team_messages')
      .update({is_read:true}).eq('sender_id',targetAgent.id).eq('receiver_id',agent.id).eq('is_read',false)
    if (teamChanRef.current) supabase.removeChannel(teamChanRef.current)
    const ch = supabase.channel(`team-dm-${[agent.id,targetAgent.id].sort().join('-')}`)
      .on('postgres_changes', {event:'INSERT',schema:'public',table:'team_messages'}, (payload) => {
        const msg = payload.new
        const ok = (msg.sender_id===agent.id&&msg.receiver_id===targetAgent.id) ||
                   (msg.sender_id===targetAgent.id&&msg.receiver_id===agent.id)
        if (!ok) return
        setTeamMsgs(prev => prev.find(m=>m.id===msg.id) ? prev : [...prev, msg])
        if (msg.sender_id!==agent.id) supabase.from('team_messages').update({is_read:true}).eq('id',msg.id)
        setTimeout(() => teamEndRef.current?.scrollIntoView({behavior:'smooth'}), 60)
      }).subscribe()
    teamChanRef.current = ch
  }

  async function sendTeamMessage(e) {
    e?.preventDefault()
    const text = teamInput.trim(); if (!text||!teamChatWith||!agent) return
    setTeamInput('')
    await supabase.from('team_messages').insert({
      sender_id:agent.id, receiver_id:teamChatWith.id, content:text, is_read:false
    })
    setTimeout(() => teamInputRef.current?.focus(), 50)
  }

  useEffect(() => {
    if (!agent?.id) return
    const ch = supabase.channel(`team-incoming-${agent.id}`)
      .on('postgres_changes', {event:'INSERT',schema:'public',table:'team_messages',filter:`receiver_id=eq.${agent.id}`},
        (payload) => {
          const sid = payload.new.sender_id
          if (teamChatWith?.id===sid) return
          setUnreadTeam(prev => ({...prev, [sid]:(prev[sid]||0)+1}))
          playSound()
        }).subscribe()
    return () => supabase.removeChannel(ch)
  }, [agent?.id, teamChatWith?.id])

  async function toggleOnline() {
    const next = !isOnline; setIsOnline(next)
    if (agent) await supabase.from('agents').update({is_online:next}).eq('id',agent.id)
  }
  async function logout() {
    if (agent) await supabase.from('agents').update({is_online:false}).eq('id',agent.id)
    await supabase.auth.signOut()
  }

  /* ── Computed ────────────────────────────────── */
  const waitingList   = conversations.filter(c => c.status==='waiting')
  const activeList    = conversations.filter(c => c.status==='active')
  const totalUnread   = Object.values(unreadCounts).reduce((a,b)=>a+b,0)
  const totalTeamUnread = Object.values(unreadTeam).reduce((a,b)=>a+b,0)

  /* ════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════ */
  return (
    <div className="db-root">

      {/* ════ NAV RAIL ════ */}
      <nav className="db-nav-rail">
        <div className="db-rail-logo">
          <img src="/icon-192.png" alt="TL" />
        </div>
        <div className="db-rail-items">
          <NavBtn icon="comments" label="Chats" active={navSection==='chats'}
            badge={totalUnread+waitingList.length}
            onClick={() => { setNavSection('chats'); setMobileShowChat(false) }} />
          <NavBtn icon="user-friends" label="Team" active={navSection==='team'}
            badge={totalTeamUnread}
            onClick={() => { setNavSection('team'); setMobileShowChat(false) }} />
          <NavBtn icon="address-book" label="Kontakte" active={navSection==='contacts'}
            onClick={() => { setNavSection('contacts'); setMobileShowChat(false) }} />
        </div>
        <div className="db-rail-bottom">
          <div className="db-rail-agent" onClick={toggleOnline} title={isOnline?'Klick für Offline':'Klick für Online'}>
            <div className={`db-rail-status ${isOnline?'online':''}`} />
            <Avatar agent={agent} size={32} />
          </div>
          <NavBtn icon="cog" label="Einst." onClick={() => navigate('/settings')} />
          <NavBtn icon="sign-out-alt" label="Logout" danger onClick={logout} />
        </div>
      </nav>

      {/* ════ LEFT PANEL ════ */}
      <aside className={`db-panel ${mobileShowChat ? 'mobile-hidden' : ''}`}>

        {/* CHATS */}
        {navSection === 'chats' && (
          <div className="db-panel-content">
            <div className="db-panel-header">
              <h2>Kunden-Chats</h2>
              <div className="db-stats-row">
                <span className="db-stat-chip waiting">{waitingList.length} wartend</span>
                <span className="db-stat-chip active-chip">{activeList.length} aktiv</span>
              </div>
            </div>
            <div className="db-panel-list">
              <Section title="Wartend" count={waitingList.length} accent="waiting"
                open={sectionsOpen.waiting} onToggle={() => setSectionsOpen(p=>({...p,waiting:!p.waiting}))}>
                {waitingList.length===0
                  ? <p className="db-section-empty">Keine wartenden Chats</p>
                  : waitingList.map(conv => <ConvItem key={conv.id} conv={conv} accent="waiting"
                      active={activeConv?.id===conv.id} unread={unreadCounts[conv.id]||0} onSelect={selectConv} />)
                }
              </Section>
              <Section title="Aktiv" count={activeList.length} accent="active"
                open={sectionsOpen.active} onToggle={() => setSectionsOpen(p=>({...p,active:!p.active}))}>
                {activeList.length===0
                  ? <p className="db-section-empty">Keine aktiven Chats</p>
                  : activeList.map(conv => <ConvItem key={conv.id} conv={conv} accent="active"
                      active={activeConv?.id===conv.id} unread={unreadCounts[conv.id]||0} onSelect={selectConv} />)
                }
              </Section>
              <Section title="Beendet" count={history.length} accent="closed"
                open={sectionsOpen.closed} onToggle={() => setSectionsOpen(p=>({...p,closed:!p.closed}))}>
                {history.length===0
                  ? <p className="db-section-empty">Keine beendeten Chats</p>
                  : history.map(conv => <ConvItem key={conv.id} conv={conv} accent="closed"
                      active={activeConv?.id===conv.id} unread={0} onSelect={selectConv} onDelete={deleteConv} />)
                }
              </Section>
            </div>
          </div>
        )}

        {/* TEAM CHAT */}
        {navSection === 'team' && (
          <div className="db-panel-content">
            <div className="db-panel-header">
              <h2>Team-Chat</h2>
              <p className="db-panel-sub">Interne Nachrichten</p>
            </div>
            <div className="db-panel-list">
              {allAgents.filter(a=>a.id!==agent?.id).length===0
                ? <div className="db-panel-empty"><i className="fas fa-users"/><p>Keine anderen Mitglieder</p></div>
                : allAgents.filter(a=>a.id!==agent?.id).map(a => (
                    <motion.button key={a.id} className={`db-team-item ${teamChatWith?.id===a.id?'selected':''}`}
                      onClick={() => { openTeamChat(a); setNavSection('team') }}
                      initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}}>
                      <div className="db-team-av-wrap">
                        <Avatar agent={a} size={38} />
                        <span className={`db-online-dot-sm ${a.is_online?'online':''}`} />
                      </div>
                      <div className="db-team-info">
                        <strong>{a.name}</strong>
                        <span className={a.is_online?'text-online':'text-offline'}>{a.is_online?'● Online':'○ Offline'}</span>
                      </div>
                      {unreadTeam[a.id]>0 && <span className="db-team-unread">{unreadTeam[a.id]}</span>}
                    </motion.button>
                  ))
              }
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {navSection === 'contacts' && (
          <div className="db-panel-content">
            <div className="db-panel-header">
              <h2>Kontakte</h2>
              <p className="db-panel-sub">{onlineAgents.length} online</p>
            </div>
            <div className="db-panel-list">
              {onlineAgents.filter(a=>a.id!==agent?.id).length>0 && (
                <p className="db-contacts-section-lbl">● Online</p>
              )}
              {onlineAgents.filter(a=>a.id!==agent?.id).map(a => (
                <ContactItem key={a.id} agent={a} selected={contactInfo?.id===a.id}
                  unread={unreadTeam[a.id]||0}
                  onSelect={() => setContactInfo(prev => prev?.id===a.id ? null : a)}
                  onChat={() => { openTeamChat(a); setNavSection('team') }} />
              ))}
              {allAgents.filter(a=>a.id!==agent?.id&&!a.is_online).length>0 && (
                <p className="db-contacts-section-lbl">○ Offline</p>
              )}
              {allAgents.filter(a=>a.id!==agent?.id&&!a.is_online).map(a => (
                <ContactItem key={a.id} agent={a} selected={contactInfo?.id===a.id}
                  unread={0}
                  onSelect={() => setContactInfo(prev => prev?.id===a.id ? null : a)}
                  onChat={() => { openTeamChat(a); setNavSection('team') }} />
              ))}
              <AnimatePresence>
                {contactInfo && (
                  <motion.div className="db-contact-card"
                    initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
                    <button className="db-contact-card-close" onClick={() => setContactInfo(null)}>
                      <i className="fas fa-times" />
                    </button>
                    <Avatar agent={contactInfo} size={52} />
                    <h3>{contactInfo.name}</h3>
                    <span className={`db-contact-status-badge ${contactInfo.is_online?'online':'offline'}`}>
                      {contactInfo.is_online ? '● Online' : '○ Offline'}
                    </span>
                    <button className="db-contact-chat-btn"
                      onClick={() => { openTeamChat(contactInfo); setNavSection('team') }}>
                      <i className="fas fa-comment-dots" /> Nachricht senden
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </aside>

      {/* ════ MAIN CONTENT ════ */}
      <div className={`db-main ${mobileShowChat?'':'mobile-hidden-main'}`}>

        {/* CUSTOMER CHAT */}
        {activeConv && !teamChatWith && (
          <>
            <div className="db-chat-header">
              <button className="db-back-btn" onClick={() => { setMobileShowChat(false); setActiveConv(null) }}>
                <i className="fas fa-arrow-left" />
              </button>
              <Avatar name={activeConv.user_name} size={36} />
              <div className="db-chat-header-info">
                <strong>{activeConv.user_name}</strong>
                <div className="db-chat-meta">
                  <span className={`db-conv-status-chip ${activeConv.status}`}>
                    {activeConv.status==='waiting'?'Wartend':activeConv.status==='active'?'Aktiv':'Beendet'}
                  </span>
                  {activeConv.user_topic && (
                    <span className="db-conv-topic-tag"><i className="fas fa-tag" /> {activeConv.user_topic}</span>
                  )}
                  {activeConv.agents && (
                    <span className="db-assigned"><Avatar agent={activeConv.agents} size={14} /> {activeConv.agents.name}</span>
                  )}
                  <span className="db-chat-since">{fmtTime(activeConv.created_at)}</span>
                </div>
              </div>
              <div className="db-chat-header-actions">
                <button className={`icon-btn ${showInfo?'active':''}`} onClick={() => setShowInfo(v=>!v)} title="Info">
                  <i className="fas fa-user-circle" />
                </button>
                {activeConv.status!=='closed' && activeConv.assigned_agent_id===agent?.id && (
                  <button className={`icon-btn ${showNotes?'active':''}`} onClick={() => setShowNotes(v=>!v)} title="Notiz">
                    <i className="fas fa-sticky-note" />
                  </button>
                )}
                {activeConv.status==='active' && activeConv.assigned_agent_id===agent?.id && (
                  <button className={`icon-btn ${showTransfer?'active':''}`} onClick={() => setShowTransfer(v=>!v)} title="Übergeben">
                    <i className="fas fa-exchange-alt" />
                  </button>
                )}
                {activeConv.status==='waiting' && (
                  <button className="db-claim-btn" onClick={() => claimConv(activeConv)}>
                    <i className="fas fa-headset" /> Übernehmen
                  </button>
                )}
                {activeConv.status==='active' && activeConv.assigned_agent_id && activeConv.assigned_agent_id!==agent?.id && (
                  <span className="db-locked-badge"><i className="fas fa-lock" /> Besetzt</span>
                )}
                {activeConv.status!=='closed' && (
                  <button className="db-end-btn" onClick={() => closeConv(activeConv.id)}>
                    <i className="fas fa-times-circle" /> Beenden
                  </button>
                )}
              </div>
              <AnimatePresence>
                {showTransfer && (
                  <motion.div className="db-transfer-dropdown"
                    initial={{opacity:0,y:-8,scale:0.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8,scale:0.96}}>
                    <p className="db-transfer-title"><i className="fas fa-exchange-alt" /> Übergeben an:</p>
                    {onlineAgents.filter(a=>a.id!==agent?.id).length===0
                      ? <p className="db-transfer-empty">Niemand online</p>
                      : onlineAgents.filter(a=>a.id!==agent?.id).map(a => (
                          <button key={a.id} className="db-transfer-agent" onClick={() => transferConv(a)}>
                            <Avatar agent={a} size={28} /><span>{a.name}</span>
                            <span className="db-transfer-online-dot" />
                          </button>
                        ))
                    }
                    <button className="db-transfer-cancel" onClick={() => setShowTransfer(false)}>Abbrechen</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showInfo && (
                <motion.div className="db-info-inline" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{overflow:'hidden'}}>
                  <div className="db-info-inline-inner">
                    {activeConv.user_email && <div className="db-info-chip"><i className="fas fa-envelope" /><a href={`mailto:${activeConv.user_email}`}>{activeConv.user_email}</a></div>}
                    {activeConv.user_topic && <div className="db-info-chip"><i className="fas fa-tag" /><span>{activeConv.user_topic}</span></div>}
                    <div className="db-info-chip"><i className="fas fa-clock" /><span>{new Date(activeConv.created_at).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</span></div>
                    <div className="db-info-chip"><i className="fas fa-comment" /><span>{messages.length} Nachrichten</span></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="db-messages">
              {messages.map((msg,i) => {
                const isOut  = msg.sender_type==='agent'
                const isNote = msg.sender_type==='note'
                const isSys  = msg.sender_type==='system'
                const showDate = i===0 || new Date(messages[i-1].created_at).toDateString()!==new Date(msg.created_at).toDateString()
                return (
                  <div key={msg.id}>
                    {showDate && <div className="db-date-divider">{new Date(msg.created_at).toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'})}</div>}
                    {isSys && <div className="db-system-msg"><i className="fas fa-info-circle" /> {msg.content}</div>}
                    {isNote && (
                      <motion.div className="db-note-msg" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}}>
                        <i className="fas fa-sticky-note" />
                        <div className="db-note-content">
                          <span className="db-note-author">{msg.sender_name} · Notiz</span>
                          <span>{msg.content}</span>
                        </div>
                        <span className="db-msg-time">{fmtTime(msg.created_at)}</span>
                      </motion.div>
                    )}
                    {!isNote && !isSys && (
                      <motion.div className={`db-msg-row ${isOut?'outgoing':'incoming'}`} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}}>
                        {!isOut && <div className="db-msg-avatar-sm">{msg.sender_type==='bot'?<span style={{fontSize:'1.1rem'}}>🤖</span>:<div className="db-msg-user-dot">{(activeConv.user_name?.[0]||'?').toUpperCase()}</div>}</div>}
                        <div className="db-msg-content">
                          <div className="db-msg-meta">
                            <span className="db-msg-sender">{msg.sender_type==='user'?activeConv.user_name:msg.sender_type==='bot'?'Bot':msg.sender_name||'Agent'}</span>
                            <span className="db-msg-time">{fmtTime(msg.created_at)}</span>
                          </div>
                          <div className={`db-msg-bubble ${isOut?'out':'in'}`}>{msg.content}</div>
                        </div>
                        {isOut && <div className="db-msg-avatar-sm"><Avatar agent={agent} size={26} /></div>}
                      </motion.div>
                    )}
                  </div>
                )
              })}
              <div ref={endRef} />
            </div>

            <AnimatePresence>
              {showNotes && (
                <motion.div className="db-note-area" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>
                  <form className="db-note-form" onSubmit={sendNote}>
                    <input value={noteInput} onChange={e=>setNoteInput(e.target.value)} placeholder="Interne Notiz…" className="db-note-input" />
                    <button type="submit" className="db-note-btn" disabled={!noteInput.trim()}><i className="fas fa-sticky-note" /> Notiz</button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {activeConv.status==='active' && activeConv.assigned_agent_id===agent?.id ? (
              <div className="db-input-area">
                <AnimatePresence>
                  {showQR && quickReplies.length>0 && (
                    <motion.div className="qr-panel" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>
                      {quickReplies.map(r => <button key={r.id} className="qr-chip" onClick={() => {setReplyInput(r.content);setShowQR(false);inputRef.current?.focus()}}><i className="fas fa-bolt" /> {r.title}</button>)}
                    </motion.div>
                  )}
                </AnimatePresence>
                <form className="db-reply-bar" onSubmit={sendMessage}>
                  {quickReplies.length>0 && <button type="button" className={`qr-toggle-btn ${showQR?'active':''}`} onClick={() => setShowQR(v=>!v)}><i className="fas fa-bolt" /></button>}
                  <input ref={inputRef} type="text" placeholder={`Antworten als ${agent?.name}…`} value={replyInput} onChange={e=>setReplyInput(e.target.value)} className="db-reply-input" />
                  <button type="submit" className="db-send-btn" disabled={!replyInput.trim()}><i className="fas fa-paper-plane" /></button>
                </form>
              </div>
            ) : activeConv.status==='waiting' ? (
              <div className="db-claim-bar"><p><i className="fas fa-clock" /> Wartet</p>
                <button className="db-claim-btn large" onClick={() => claimConv(activeConv)}><i className="fas fa-headset" /> Übernehmen</button>
              </div>
            ) : activeConv.status==='closed' ? (
              <div className="db-claim-bar muted"><p><i className="fas fa-lock" /> Chat beendet</p></div>
            ) : (
              <div className="db-claim-bar muted"><p><i className="fas fa-info-circle" /> Wird von <strong>{activeConv.agents?.name}</strong> bearbeitet</p></div>
            )}
          </>
        )}

        {/* TEAM DM CHAT */}
        {teamChatWith && !activeConv && (
          <>
            <div className="db-chat-header">
              <button className="db-back-btn" onClick={() => { setMobileShowChat(false); setTeamChatWith(null) }}>
                <i className="fas fa-arrow-left" />
              </button>
              <div style={{position:'relative'}}>
                <Avatar agent={teamChatWith} size={36} />
                <span className={`db-online-dot-sm ${teamChatWith.is_online?'online':''}`} style={{position:'absolute',bottom:0,right:0}} />
              </div>
              <div className="db-chat-header-info">
                <strong>{teamChatWith.name}</strong>
                <div className="db-chat-meta">
                  <span className={`db-contact-status-badge ${teamChatWith.is_online?'online':'offline'}`}>{teamChatWith.is_online?'● Online':'○ Offline'}</span>
                  <span className="db-conv-topic-tag"><i className="fas fa-user-friends" /> Team-Intern</span>
                </div>
              </div>
            </div>

            <div className="db-messages">
              {teamMsgs.length===0 && (
                <div className="db-main-empty">
                  <Avatar agent={teamChatWith} size={52} />
                  <p>Schreib <strong>{teamChatWith.name}</strong> eine Nachricht</p>
                </div>
              )}
              {teamMsgs.map((msg,i) => {
                const isOut = msg.sender_id===agent?.id
                const showDate = i===0 || new Date(teamMsgs[i-1].created_at).toDateString()!==new Date(msg.created_at).toDateString()
                return (
                  <div key={msg.id}>
                    {showDate && <div className="db-date-divider">{new Date(msg.created_at).toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'})}</div>}
                    <motion.div className={`db-msg-row ${isOut?'outgoing':'incoming'}`} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}}>
                      {!isOut && <div className="db-msg-avatar-sm"><Avatar agent={teamChatWith} size={26} /></div>}
                      <div className="db-msg-content">
                        <div className="db-msg-meta">
                          <span className="db-msg-sender">{isOut ? agent?.name : teamChatWith.name}</span>
                          <span className="db-msg-time">{fmtTime(msg.created_at)}</span>
                        </div>
                        <div className={`db-msg-bubble ${isOut?'out':'in'} team`}>{msg.content}</div>
                      </div>
                      {isOut && <div className="db-msg-avatar-sm"><Avatar agent={agent} size={26} /></div>}
                    </motion.div>
                  </div>
                )
              })}
              <div ref={teamEndRef} />
            </div>

            <div className="db-input-area">
              <form className="db-reply-bar" onSubmit={sendTeamMessage}>
                <input ref={teamInputRef} type="text" placeholder={`Nachricht an ${teamChatWith.name}…`}
                  value={teamInput} onChange={e=>setTeamInput(e.target.value)} className="db-reply-input" />
                <button type="submit" className="db-send-btn team" disabled={!teamInput.trim()}>
                  <i className="fas fa-paper-plane" />
                </button>
              </form>
            </div>
          </>
        )}

        {/* EMPTY */}
        {!activeConv && !teamChatWith && (
          <div className="db-main-empty">
            <img src="/icon-192.png" alt="TL" className="db-empty-logo" />
            <p>Wähle einen Chat aus</p>
            {waitingList.length>0 && (
              <button className="db-claim-btn" onClick={() => { selectConv(waitingList[0]); setNavSection('chats') }}>
                <i className="fas fa-headset" /> {waitingList.length} wartende{waitingList.length>1?'':'r'} Chat{waitingList.length>1?'s':''}
              </button>
            )}
          </div>
        )}
      </div>

      {/* RIGHT PANEL (Desktop) */}
      <AnimatePresence>
        {activeConv && showInfo && (
          <motion.aside className="db-right-panel"
            initial={{width:0,opacity:0}} animate={{width:260,opacity:1}} exit={{width:0,opacity:0}} transition={{duration:0.2}}>
            <div className="db-right-panel-inner">
              <div className="db-right-panel-avatar">
                <Avatar name={activeConv.user_name} size={56} />
                <h3>{activeConv.user_name}</h3>
                <span className={`db-conv-status-chip ${activeConv.status}`}>
                  {activeConv.status==='waiting'?'Wartend':activeConv.status==='active'?'Aktiv':'Beendet'}
                </span>
              </div>
              <div className="db-info-rows">
                {activeConv.user_email && <div className="db-info-row"><i className="fas fa-envelope" /><div><span>E-Mail</span><a href={`mailto:${activeConv.user_email}`}>{activeConv.user_email}</a></div></div>}
                {activeConv.user_topic && <div className="db-info-row"><i className="fas fa-tag" /><div><span>Thema</span><strong>{activeConv.user_topic}</strong></div></div>}
                <div className="db-info-row"><i className="fas fa-clock" /><div><span>Gestartet</span><strong>{new Date(activeConv.created_at).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</strong></div></div>
                <div className="db-info-row"><i className="fas fa-comment" /><div><span>Nachrichten</span><strong>{messages.length}</strong></div></div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAV */}
      <nav className="db-mobile-nav">
        <button className={mobileTab==='chats'&&!mobileShowChat?'active':''} onClick={() => {setMobileTab('chats');setNavSection('chats');setMobileShowChat(false)}}>
          <div className="db-nav-icon-wrap"><i className="fas fa-comments" />{(totalUnread+waitingList.length)>0&&<span className="db-nav-badge">{totalUnread+waitingList.length}</span>}</div>
          <span>Chats</span>
        </button>
        <button className={mobileTab==='team'&&!mobileShowChat?'active':''} onClick={() => {setMobileTab('team');setNavSection('team');setMobileShowChat(false)}}>
          <div className="db-nav-icon-wrap"><i className="fas fa-user-friends" />{totalTeamUnread>0&&<span className="db-nav-badge">{totalTeamUnread}</span>}</div>
          <span>Team</span>
        </button>
        <button className={mobileTab==='contacts'&&!mobileShowChat?'active':''} onClick={() => {setMobileTab('contacts');setNavSection('contacts');setMobileShowChat(false)}}>
          <div className="db-nav-icon-wrap"><i className="fas fa-address-book" /></div>
          <span>Kontakte</span>
        </button>
        <button onClick={() => navigate('/settings')}>
          <div className="db-nav-icon-wrap"><i className="fas fa-cog" /></div>
          <span>Einst.</span>
        </button>
      </nav>
    </div>
  )
}
