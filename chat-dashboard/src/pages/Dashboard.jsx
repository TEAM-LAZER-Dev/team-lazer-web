import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/* ── Content renderer: Images + clickable Links ──── */
function renderContent(content) {
  if (!content) return null
  if (content.startsWith('[img]')) {
    const url = content.slice(5)
    return (
      <img src={url} alt="Bild" className="db-msg-img"
        onClick={() => window.open(url, '_blank')} />
    )
  }
  // Split on URLs, keep delimiters
  const parts = content.split(/(https?:\/\/\S+)/g)
  return parts.map((part, i) =>
    /^https?:\/\//.test(part)
      ? <a key={i} href={part} target="_blank" rel="noreferrer" className="db-msg-link">{part}</a>
      : part
  )
}

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

/* ── Default icon set ────────────────────────────── */
const AVATAR_ICONS = [
  'user','user-astronaut','user-ninja','user-secret','user-tie',
  'robot','ghost','skull','fire','bolt','star','crown',
  'gamepad','dragon','cat','dog','dove','spider','fish','horse',
]

/* ── Avatar ──────────────────────────────────────── */
function Avatar({ agent, size = 36, name }) {
  const displayName = agent?.name || name || '?'
  const av = agent?.avatar_url || ''
  // Icon-based avatar
  if (av.startsWith('icon:')) {
    const iconName = av.slice(5)
    return (
      <div className="avatar-placeholder" style={{ width:size, height:size, fontSize:size*0.42 }}>
        <i className={`fas fa-${iconName}`} />
      </div>
    )
  }
  if (av) return (
    <img src={av} alt={displayName}
      style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
  )
  const initials = displayName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return (
    <div className="avatar-placeholder" style={{ width:size, height:size, fontSize:size*0.36 }}>
      {initials}
    </div>
  )
}

/* ── Role chips display ──────────────────────────── */
function RoleChips({ roleIds, allRoles, small }) {
  if (!roleIds?.length || !allRoles?.length) return null
  const chips = roleIds.map(id => allRoles.find(r => r.id === id)).filter(Boolean)
  if (!chips.length) return null
  return (
    <div className={`db-role-chips-row${small ? ' small' : ''}`}>
      {chips.map(r => (
        <span key={r.id} className="db-role-chip-tag"
          style={{ background: r.color + '22', color: r.color, borderColor: r.color + '55' }}>
          {r.name}
        </span>
      ))}
    </div>
  )
}

/* ── Profile Modal ───────────────────────────────── */
function ProfileModal({ agent, roles, onSave, onClose, onUpdateRoleIds }) {
  const [name, setName]             = useState(agent?.name || '')
  const [saving, setSaving]         = useState(false)
  const [msg, setMsg]               = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(agent?.avatar_url || null)
  const [localOnline, setLocalOnline] = useState(!!agent?.is_online)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState(
    agent?.avatar_url?.startsWith('icon:') ? agent.avatar_url.slice(5) : null
  )
  const avatarRef = useRef(null)

  async function toggleOnlineStatus() {
    const next = !localOnline
    setLocalOnline(next)
    await supabase.from('agents').update({ is_online: next }).eq('id', agent.id)
    onSave({ ...agent, name: name.trim() || agent.name, is_online: next })
  }

  function pickIcon(icon) {
    setSelectedIcon(icon)
    setAvatarFile(null)
    setAvatarPreview('icon:' + icon)
    setShowIconPicker(false)
  }

  function pickPhoto() {
    setShowIconPicker(false)
    avatarRef.current?.click()
  }

  async function save() {
    if (!name.trim()) return
    setSaving(true); setMsg('')
    let avatar_url = agent?.avatar_url
    if (avatarPreview?.startsWith('icon:')) {
      avatar_url = avatarPreview
    } else if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `avatars/${agent.id}.${ext}`
      await supabase.storage.from('agent-avatars').upload(path, avatarFile, { upsert: true })
      const { data: { publicUrl } } = supabase.storage.from('agent-avatars').getPublicUrl(path)
      avatar_url = publicUrl + '?t=' + Date.now()
    }
    const { data, error } = await supabase.from('agents')
      .update({ name: name.trim(), avatar_url, is_online: localOnline })
      .eq('id', agent.id).select().single()
    setSaving(false)
    if (error) { setMsg('Fehler: ' + error.message); return }
    setMsg('✓ Gespeichert!')
    onSave(data)
    setTimeout(onClose, 900)
  }

  const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '?'
  const myRoleIds = agent?.role_ids || []
  const myRoles = myRoleIds.map(id => roles?.find(r => r.id === id)).filter(Boolean)

  function renderAvatarPreview() {
    if (avatarPreview?.startsWith('icon:')) {
      const icon = avatarPreview.slice(5)
      return <div className="avatar-placeholder pm-avatar-initials" style={{fontSize:'2rem'}}><i className={`fas fa-${icon}`} /></div>
    }
    if (avatarPreview) return <img src={avatarPreview} alt="Avatar" />
    return <div className="avatar-placeholder pm-avatar-initials">{initials}</div>
  }

  return (
    <div className="pm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pm-modal">
        <div className="pm-header">
          <h3><i className="fas fa-user-circle" /> Mein Profil</h3>
          <button className="pm-close" onClick={onClose}><i className="fas fa-times" /></button>
        </div>
        <div className="pm-avatar-area">
          <div className="pm-avatar-preview" onClick={() => setShowIconPicker(v => !v)}>
            {renderAvatarPreview()}
            <div className="pm-avatar-overlay"><i className="fas fa-camera" /> Ändern</div>
          </div>
          <input ref={avatarRef} type="file" accept="image/*" style={{ display:'none' }}
            onChange={e => { const f = e.target.files[0]; if(!f) return; setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); setSelectedIcon(null) }} />
          {showIconPicker && (
            <div className="pm-icon-picker">
              <button className="pm-icon-picker-photo" onClick={pickPhoto}>
                <i className="fas fa-camera" /> Foto hochladen
              </button>
              <div className="pm-icon-grid">
                {AVATAR_ICONS.map(ic => (
                  <button key={ic} className={`pm-icon-btn ${selectedIcon===ic?'active':''}`}
                    onClick={() => pickIcon(ic)} title={ic}>
                    <i className={`fas fa-${ic}`} />
                  </button>
                ))}
              </div>
            </div>
          )}
          {agent?.is_admin ? (
            <button className={`pm-online-badge toggleable ${localOnline ? 'online' : ''}`}
              onClick={toggleOnlineStatus} title="Status umschalten">
              {localOnline ? '● Online' : '○ Offline'} <i className="fas fa-pencil-alt pm-toggle-icon" />
            </button>
          ) : (
            <div className={`pm-online-badge ${localOnline ? 'online' : ''}`}>
              {localOnline ? '● Online' : '○ Offline'}
            </div>
          )}
          {agent?.is_admin && (
            <div className="pm-admin-badge"><i className="fas fa-shield-alt" /> Admin</div>
          )}
        </div>
        <div className="pm-fields">
          <div className="pm-field">
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Dein Name" />
          </div>
          {/* Self role assignment for admins */}
          {agent?.is_admin && roles?.length > 0 && (
            <div className="pm-field">
              <label>Rollen</label>
              <div className="pm-roles-display">
                {roles.map(r => {
                  const isActive = myRoleIds.includes(r.id)
                  const isProtected = agent?.is_owner && r.name.toLowerCase() === 'admin'
                  return (
                    <button key={r.id}
                      className={`db-role-chip-btn ${isActive ? 'active' : ''} ${isProtected ? 'protected' : ''}`}
                      style={isActive ? { background: r.color + '33', color: r.color, borderColor: r.color } : {}}
                      onClick={async () => {
                        if (isProtected) return
                        const newIds = isActive
                          ? myRoleIds.filter(id => id !== r.id)
                          : [...myRoleIds, r.id]
                        if (onUpdateRoleIds) await onUpdateRoleIds(agent.id, newIds, roles)
                      }}>
                      {isProtected && <i className="fas fa-lock" style={{marginRight:4,fontSize:'0.7rem'}} />}
                      {r.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          {/* Non-admin: show roles read-only */}
          {!agent?.is_admin && myRoles.length > 0 && (
            <div className="pm-field">
              <label>Rollen</label>
              <div className="pm-roles-display">
                {myRoles.map(r => (
                  <span key={r.id} className="db-role-chip-tag"
                    style={{ background: r.color + '22', color: r.color, borderColor: r.color + '55' }}>
                    {r.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {agent?.email && (
            <div className="pm-field">
              <label>E-Mail</label>
              <input value={agent.email} disabled className="pm-disabled" />
            </div>
          )}
        </div>
        <div className="pm-actions">
          {msg && <span className={`pm-msg ${msg.startsWith('✓')?'ok':'err'}`}>{msg}</span>}
          <button className="btn-secondary-sm" onClick={onClose}>Abbrechen</button>
          <button className="btn-primary-sm" onClick={save} disabled={saving || !name.trim()}>
            {saving ? <span className="btn-spinner" /> : <><i className="fas fa-save" /> Speichern</>}
          </button>
        </div>
      </div>
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
  const icons = { waiting:'clock', active:'bolt', hold:'pause-circle', closed:'times-circle' }
  return (
    <div className={`db-section db-section-${accent}`}>
      <button className="db-section-hdr" onClick={onToggle}>
        <span className={`db-section-dot ${accent}`} />
        <i className={`fas fa-${icons[accent]||'circle'} db-section-icon`} />
        <span className="db-section-title">{title}</span>
        <span className="db-section-spacer" />
        {count > 0 && (
          <span className={`db-section-dot-badge ${accent}`}>{count > 9 ? '9+' : count}</span>
        )}
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

/* ── Elapsed timer helper ─────────────────────────── */
function useElapsed(since) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!since) return
    const iv = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(iv)
  }, [since])
  if (!since) return null
  const sec = Math.max(0, Math.floor((now - new Date(since).getTime()) / 1000))
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}h ${String(m).padStart(2,'0')}m`
  return `${m}:${String(s).padStart(2,'0')}`
}

/* ── Duration formatter (static, no timer) ─────── */
function formatDuration(startISO, endISO) {
  if (!startISO || !endISO) return null
  const sec = Math.max(0, Math.floor((new Date(endISO) - new Date(startISO)) / 1000))
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`
  if (m > 0) return `${m}m ${String(s).padStart(2,'0')}s`
  return `${s}s`
}

/* ── Customer conv item ──────────────────────────── */
function ConvItem({ conv, active, unread, onSelect, onDelete, accent }) {
  const elapsed = useElapsed(accent !== 'closed' ? conv.created_at : null)
  const duration = accent === 'closed' ? formatDuration(conv.created_at, conv.last_message_at) : null
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
          {elapsed && <span className={`db-conv-timer accent-${accent}`}><i className="fas fa-clock" /> {elapsed}</span>}
          {duration && <span className="db-conv-timer accent-closed"><i className="fas fa-hourglass-end" /> {duration}</span>}
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
function ContactItem({ agent, selected, unread, onSelect, onChat, allRoles }) {
  return (
    <motion.div className={`db-contact-item ${selected?'selected':''}`}
      initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }}>
      <button className="db-contact-main" onClick={onSelect}>
        <div className="db-team-av-wrap">
          <Avatar agent={agent} size={40} />
          <span className={`db-online-dot-sm ${agent.is_online?'online':''}`} />
        </div>
        <div className="db-team-info">
          <strong>
            {agent.name}
            {agent.is_admin && <span className="db-admin-crown" title="Admin"><i className="fas fa-shield-alt" /></span>}
          </strong>
          {agent.role_ids?.length > 0
            ? <RoleChips roleIds={agent.role_ids} allRoles={allRoles} small />
            : <span className="db-team-role">{agent.role || 'Support'}</span>}
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
  const [sectionsOpen, setSectionsOpen] = useState({ waiting:true, active:true, hold:true, closed:false })

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
  const [teamConvPartners, setTeamConvPartners] = useState([])

  /* ── Roles ───────────────────────────────────── */
  const [roles, setRoles] = useState([])

  /* ── Profile modal ───────────────────────────── */
  const [showProfileModal, setShowProfileModal] = useState(false)

  /* ── Image upload ────────────────────────────── */
  const [imageUploading, setImageUploading] = useState(false)

  /* ── Live elapsed timer for active chat header ── */
  const [headerNow, setHeaderNow] = useState(Date.now())
  useEffect(() => {
    if (!activeConv || activeConv.status === 'closed') return
    const iv = setInterval(() => setHeaderNow(Date.now()), 1000)
    return () => clearInterval(iv)
  }, [activeConv?.id, activeConv?.status])

  const endRef            = useRef(null)
  const teamEndRef        = useRef(null)
  const channelRef        = useRef(null)
  const closedByMeRef     = useRef(new Set())
  const teamChanRef       = useRef(null)
  const typingChanRef     = useRef(null)
  const agentTypingTimer  = useRef(null)
  const teamTypingTimer   = useRef(null)
  const inputRef     = useRef(null)
  const teamInputRef = useRef(null)
  const fileInputRef = useRef(null)

  /* ── Typing indicator states ────────────────── */
  const [customerTyping,    setCustomerTyping]    = useState(false)
  const [teamPartnerTyping, setTeamPartnerTyping] = useState(false)

  /* ── SW ──────────────────────────────────────── */
  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{})
  }, [])

  /* ── Apply appearance & chat settings ────────── */
  useEffect(() => {
    const compact  = localStorage.getItem('tl_compact') === 'true'
    const density  = localStorage.getItem('tl_msg_density') || 'normal'
    document.documentElement.classList.toggle('tl-compact', compact)
    document.documentElement.classList.remove('tl-density-compact','tl-density-normal','tl-density-relaxed')
    document.documentElement.classList.add(`tl-density-${density}`)
    // Listen for storage changes from Settings page
    function onStorage(e) {
      if (e.key === 'tl_compact')      document.documentElement.classList.toggle('tl-compact', e.newValue === 'true')
      if (e.key === 'tl_msg_density') {
        document.documentElement.classList.remove('tl-density-compact','tl-density-normal','tl-density-relaxed')
        document.documentElement.classList.add(`tl-density-${e.newValue}`)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  /* ── Roles ───────────────────────────────────── */
  useEffect(() => {
    loadRoles()
    const ch = supabase.channel('roles-watch')
      .on('postgres_changes', { event:'*', schema:'public', table:'roles' }, loadRoles)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  async function loadRoles() {
    const { data } = await supabase.from('roles').select('*').order('name')
    setRoles(data || [])
  }

  /* ── Agents ──────────────────────────────────── */
  useEffect(() => {
    loadAllAgents()
    const ch = supabase.channel('agents-watch')
      .on('postgres_changes', { event:'UPDATE', schema:'public', table:'agents' }, loadAllAgents)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, []) // eslint-disable-line

  // Team-Conv-Partners erst laden wenn agent.id verfügbar ist
  useEffect(() => {
    if (agent?.id) loadTeamConvPartners()
  }, [agent?.id]) // eslint-disable-line

  async function loadAllAgents() {
    const { data } = await supabase.from('agents').select('id,name,avatar_url,is_online,role,role_ids,email,is_admin,is_owner').order('name')
    const seen = new Set()
    const unique = (data||[]).filter(a => { if (seen.has(a.id)) return false; seen.add(a.id); return true })
    setAllAgents(unique)
    setOnlineAgents(unique.filter(a => a.is_online))
  }

  async function updateAgentRoleIds(agentId, newRoleIds, allRolesData) {
    // Check if Agent being modified is owner — owner can't lose admin
    const target = allAgents.find(a => a.id === agentId)
    if (target?.is_owner && !newRoleIds.includes(allRolesData.find(r => r.name === 'Admin')?.id)) {
      // Owner always keeps admin — silently add Admin back
      const adminRole = allRolesData.find(r => r.name.toLowerCase() === 'admin')
      if (adminRole && !newRoleIds.includes(adminRole.id)) newRoleIds = [...newRoleIds, adminRole.id]
    }
    // Cascade: if "Admin" role in newRoleIds → is_admin = true, else false (unless owner)
    const adminRole = allRolesData.find(r => r.name.toLowerCase() === 'admin')
    const hasAdminRole = adminRole && newRoleIds.includes(adminRole.id)
    const newIsAdmin = hasAdminRole || target?.is_owner
    await supabase.from('agents').update({ role_ids: newRoleIds, is_admin: newIsAdmin }).eq('id', agentId)
    setAllAgents(prev => prev.map(a => a.id===agentId ? {...a, role_ids:newRoleIds, is_admin:newIsAdmin} : a))
    setContactInfo(prev => prev?.id===agentId ? {...prev, role_ids:newRoleIds, is_admin:newIsAdmin} : prev)
  }

  /* ── Own status ──────────────────────────────── */
  useEffect(() => {
    if (agent?.id) supabase.from('agents').update({ is_online:true }).eq('id', agent.id)
    const off = () => { if (agent?.id) supabase.from('agents').update({ is_online:false }).eq('id', agent.id) }
    window.addEventListener('beforeunload', off)
    return () => { window.removeEventListener('beforeunload', off); off() }
  }, [agent?.id])

  /* ── DSGVO auto-cleanup on login ────────────── */
  useEffect(() => {
    if (!agent?.is_admin) return
    const retentionDays = Number(localStorage.getItem('tl_retention_days') || 90)
    async function runAutoCleanup() {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - retentionDays)
      const { data: oldConvs } = await supabase
        .from('conversations').select('id').eq('status','closed')
        .lt('last_message_at', cutoff.toISOString())
      if (!oldConvs?.length) return
      // localStorage-basiert — zuverlässig unabhängig von RLS
      const ids = oldConvs.map(c => c.id)
      const existing = getDeletedConvIds()
      const merged = [...new Set([...existing, ...ids])]
      localStorage.setItem('tl_deleted_convs', JSON.stringify(merged))
    }
    runAutoCleanup()
  }, [agent?.is_admin]) // eslint-disable-line

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
          // If the agent didn't close this themselves, it was the customer leaving
          if (!closedByMeRef.current.has(payload.new.id)) {
            const name = payload.new.user_name || 'Besucher'
            if (agent?.notify_sound!==false) playSound()
            if (agent?.notify_browser!==false) showBrowserNotification('Chat beendet 👋', `${name} hat den Chat verlassen`)
          }
        }
      }).subscribe()
    return () => supabase.removeChannel(ch)
  }, [agent]) // eslint-disable-line

  /* ── Global unread message tracker ───────────── */
  useEffect(() => {
    if (!agent?.id) return
    const ch = supabase.channel('global-msgs-unread')
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages' }, (payload) => {
        const msg = payload.new
        if (msg.sender_type === 'agent' || msg.sender_type === 'note' || msg.sender_type === 'system') return
        // Only count if not currently viewing this conversation
        setUnreadCounts(prev => {
          const convId = msg.conversation_id
          // activeConv ref is stale in closures, so use functional update
          return prev
        })
        // Use a custom event to check active conv from outside closure
        window.dispatchEvent(new CustomEvent('new-customer-msg', { detail: { convId: msg.conversation_id } }))
      }).subscribe()
    return () => supabase.removeChannel(ch)
  }, [agent?.id])

  useEffect(() => {
    function handleNewMsg(e) {
      const { convId } = e.detail
      setUnreadCounts(prev => {
        if (activeConv?.id === convId) return prev
        return { ...prev, [convId]: (prev[convId] || 0) + 1 }
      })
    }
    window.addEventListener('new-customer-msg', handleNewMsg)
    return () => window.removeEventListener('new-customer-msg', handleNewMsg)
  }, [activeConv?.id])

  async function loadConversations() {
    const { data } = await supabase.from('conversations').select('*, agents(*)')
      .in('status',['waiting','active','hold']).order('last_message_at',{ascending:false})
    const deletedIds = getDeletedConvIds()
    setConversations((data||[]).filter(c => !deletedIds.includes(c.id)))
  }
  async function loadHistory() {
    const { data } = await supabase.from('conversations').select('*, agents(*)')
      .eq('status','closed').order('last_message_at',{ascending:false}).limit(50)
    const deletedIds = getDeletedConvIds()
    setHistory((data||[]).filter(c => !deletedIds.includes(c.id)))
  }
  async function loadQuickReplies() {
    const { data } = await supabase.from('quick_replies').select('*').order('sort_order')
    setQuickReplies(data||[])
  }

  /* ── Select conv ─────────────────────────────── */
  const selectConv = useCallback(async (conv) => {
    setActiveConv(conv); setTeamChatWith(null)
    setMobileShowChat(true); setReplyInput(''); setShowQR(false); setShowNotes(false)
    setCustomerTyping(false)
    const { data:msgs } = await supabase.from('messages').select('*')
      .eq('conversation_id', conv.id).order('created_at',{ascending:true})
    setMessages(msgs||[])
    setUnreadCounts(prev => ({...prev, [conv.id]:0}))
    setTimeout(() => endRef.current?.scrollIntoView({behavior:'instant'}), 60)
    if (channelRef.current) supabase.removeChannel(channelRef.current)
    if (typingChanRef.current) supabase.removeChannel(typingChanRef.current)
    // Messages channel
    const ch = supabase.channel('dash-msgs-'+conv.id)
      .on('postgres_changes', {event:'INSERT',schema:'public',table:'messages',filter:`conversation_id=eq.${conv.id}`},
        (payload) => {
          setMessages(prev => prev.find(m=>m.id===payload.new.id) ? prev : [...prev, payload.new])
          setCustomerTyping(false)
          setTimeout(() => endRef.current?.scrollIntoView({behavior:'smooth'}), 60)
        }).subscribe()
    channelRef.current = ch
    // Typing broadcast channel + customer-left detection
    let customerTypingTimer = null
    const tch = supabase.channel('typing-conv-'+conv.id)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload?.from === 'customer') {
          if (payload?.stop) { setCustomerTyping(false); return }
          setCustomerTyping(true)
          clearTimeout(customerTypingTimer)
          customerTypingTimer = setTimeout(() => setCustomerTyping(false), 3000)
          setTimeout(() => endRef.current?.scrollIntoView({behavior:'smooth'}), 60)
        }
      })
      .on('broadcast', { event: 'customer-left' }, ({ payload }) => {
        // Kunde hat den Chat beendet — zuverlässig über Broadcast statt postgres_changes!
        setCustomerTyping(false)
        setActiveConv(prev => prev?.id === payload?.convId ? { ...prev, status: 'closed' } : prev)
        // System-Nachricht lokal hinzufügen damit der Agent es sofort im Chat sieht
        setMessages(prev => [
          ...prev,
          {
            id: 'customer-left-' + Date.now(),
            conversation_id: payload?.convId,
            sender_type: 'system',
            sender_name: 'System',
            content: (payload?.userName || 'Kunde') + ' hat den Chat verlassen.',
            created_at: new Date().toISOString()
          }
        ])
        setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
        // Sound + Browser-Notification
        if (agent?.notify_sound !== false) playSound()
        if (agent?.notify_browser !== false) showBrowserNotification('Chat beendet 👋', (payload?.userName || 'Kunde') + ' hat den Chat verlassen')
        loadConversations()
        loadHistory()
      })
      .subscribe()
    typingChanRef.current = tch
  }, []) // eslint-disable-line

  async function claimConv(conv) {
    if (!agent) return
    await supabase.from('conversations').update({status:'active',assigned_agent_id:agent.id}).eq('id',conv.id)
    const updated = {...conv, status:'active', assigned_agent_id:agent.id, agents:agent}
    setActiveConv(updated)
    setConversations(prev => prev.map(c => c.id===conv.id ? updated : c))
  }

  async function closeConv(convId) {
    closedByMeRef.current.add(convId)
    await supabase.from('conversations').update({status:'closed'}).eq('id',convId)
    setActiveConv(prev => prev?.id===convId ? {...prev,status:'closed'} : prev)
    setMobileShowChat(false)
    if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current=null }
    loadConversations(); loadHistory()
    setTimeout(() => closedByMeRef.current.delete(convId), 5000)
  }

  async function holdConv(convId) {
    await supabase.from('conversations').update({status:'hold'}).eq('id',convId)
    await supabase.from('messages').insert({
      conversation_id:convId, sender_type:'system', sender_name:'System',
      content:'Kunde wurde in die Warteschleife gesetzt.'
    })
    // Broadcast an den Kunden — zuverlässig ohne postgres_changes
    if (typingChanRef.current) {
      typingChanRef.current.send({ type:'broadcast', event:'conv-hold', payload:{ convId } })
    }
    setActiveConv(prev => prev?.id===convId ? {...prev, status:'hold'} : prev)
    setConversations(prev => prev.map(c => c.id===convId ? {...c, status:'hold'} : c))
  }

  async function unholdConv(convId) {
    await supabase.from('conversations').update({status:'active'}).eq('id',convId)
    await supabase.from('messages').insert({
      conversation_id:convId, sender_type:'system', sender_name:'System',
      content:'Warteschleife beendet — Chat wieder aktiv.'
    })
    // Broadcast an den Kunden — zuverlässig ohne postgres_changes
    if (typingChanRef.current) {
      typingChanRef.current.send({ type:'broadcast', event:'conv-unhold', payload:{ convId } })
    }
    setActiveConv(prev => prev?.id===convId ? {...prev, status:'active'} : prev)
    setConversations(prev => prev.map(c => c.id===convId ? {...c, status:'active'} : c))
  }

  async function transferConv(targetAgent) {
    if (!activeConv) return
    // Auto-hold: put into hold state while transferring, then reassign
    await supabase.from('conversations').update({status:'hold', assigned_agent_id:targetAgent.id}).eq('id',activeConv.id)
    await supabase.from('messages').insert({
      conversation_id:activeConv.id, sender_type:'system', sender_name:'System',
      content:`Chat von ${agent.name} an ${targetAgent.name} übergeben — kurze Wartezeit.`
    })
    // Broadcast hold an Kunden
    if (typingChanRef.current) {
      typingChanRef.current.send({ type:'broadcast', event:'conv-hold', payload:{ convId: activeConv.id } })
    }
    setActiveConv(prev => ({...prev, status:'hold', assigned_agent_id:targetAgent.id, agents:targetAgent}))
    setConversations(prev => prev.map(c => c.id===activeConv.id ? {...c, status:'hold', assigned_agent_id:targetAgent.id, agents:targetAgent} : c))
    setShowTransfer(false)
  }

  // Helper: gelöschte Kunden-Chat-IDs in localStorage verwalten
  function getDeletedConvIds() {
    try { return JSON.parse(localStorage.getItem('tl_deleted_convs') || '[]') } catch { return [] }
  }
  function addDeletedConvId(convId) {
    const ids = getDeletedConvIds()
    if (!ids.includes(convId)) { ids.push(convId); localStorage.setItem('tl_deleted_convs', JSON.stringify(ids)) }
  }

  async function deleteConv(convId) {
    // localStorage-basiert: 100% zuverlässig, unabhängig von DB/RLS.
    // DB-Delete und soft-delete scheitern beide an Supabase RLS/Constraints.
    addDeletedConvId(convId)

    setHistory(prev => prev.filter(c => c.id !== convId))
    setConversations(prev => prev.filter(c => c.id !== convId))
    if (activeConv?.id === convId) { setActiveConv(null); setMessages([]) }
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

  /* ── Image upload ────────────────────────────── */
  async function handleImageSend(e) {
    const file = e.target.files?.[0]
    if (!file || !activeConv || !agent) return
    e.target.value = ''
    setImageUploading(true)
    const ext = file.name.split('.').pop().toLowerCase()
    const path = `messages/${activeConv.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('chat-images').upload(path, file)
    if (error) { setImageUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('chat-images').getPublicUrl(path)
    await supabase.from('messages').insert({
      conversation_id: activeConv.id, sender_type: 'agent',
      sender_name: agent.name, sender_avatar: agent.avatar_url,
      content: `[img]${publicUrl}`
    })
    setImageUploading(false)
  }

  /* ── Team DMs ────────────────────────────────── */
  // Helper: liest/schreibt Team-Chat-Clear-Timestamps aus localStorage
  function getTeamClears() {
    try { return JSON.parse(localStorage.getItem('tl_team_clears') || '{}') } catch { return {} }
  }
  function setTeamClear(partnerId) {
    const clears = getTeamClears()
    clears[partnerId] = new Date().toISOString()
    localStorage.setItem('tl_team_clears', JSON.stringify(clears))
  }

  async function loadTeamConvPartners() {
    if (!agent?.id) return
    const { data } = await supabase.from('team_messages')
      .select('sender_id, receiver_id, created_at')
      .or(`sender_id.eq.${agent.id},receiver_id.eq.${agent.id}`)
    if (!data?.length) { setTeamConvPartners([]); return }

    const clears = getTeamClears()
    const partnerIds = new Set()
    data.forEach(m => {
      const partnerId = m.sender_id !== agent.id ? m.sender_id : m.receiver_id
      const clearTs = clears[partnerId]
      // Nur anzeigen wenn es Nachrichten NACH dem Clear-Zeitstempel gibt
      if (!clearTs || new Date(m.created_at) > new Date(clearTs)) {
        partnerIds.add(partnerId)
      }
    })
    setTeamConvPartners([...partnerIds])
  }

  function deleteTeamChat(targetAgentId) {
    if (!agent?.id) return
    // WhatsApp-Style: Clear-Zeitstempel setzen statt DB-Delete
    // Nachrichten bleiben in DB, werden aber nicht mehr geladen
    // Chat taucht erst wieder auf wenn neue Nachricht gesendet/empfangen wird
    setTeamClear(targetAgentId)
    if (teamChatWith?.id === targetAgentId) {
      setTeamChatWith(null); setTeamMsgs([]); setMobileShowChat(false)
      if (teamChanRef.current) { supabase.removeChannel(teamChanRef.current); teamChanRef.current = null }
    }
    setTeamConvPartners(prev => prev.filter(id => id !== targetAgentId))
  }

  async function openTeamChat(targetAgent) {
    setTeamChatWith(targetAgent); setActiveConv(null)
    setMobileShowChat(true); setTeamInput(''); setContactInfo(null)
    setUnreadTeam(prev => ({...prev, [targetAgent.id]:0}))
    const clearTs = getTeamClears()[targetAgent.id]
    let query = supabase.from('team_messages')
      .select('*')
      .or(`and(sender_id.eq.${agent.id},receiver_id.eq.${targetAgent.id}),and(sender_id.eq.${targetAgent.id},receiver_id.eq.${agent.id})`)
    if (clearTs) query = query.gt('created_at', clearTs)
    const { data } = await query.order('created_at',{ascending:true})
    setTeamMsgs(data||[])
    setTimeout(() => teamEndRef.current?.scrollIntoView({behavior:'instant'}), 60)
    await supabase.from('team_messages')
      .update({is_read:true}).eq('sender_id',targetAgent.id).eq('receiver_id',agent.id).eq('is_read',false)
    if (teamChanRef.current) supabase.removeChannel(teamChanRef.current)
    setTeamPartnerTyping(false)
    let partnerTypingTimer = null
    const ch = supabase.channel(`team-dm-${[agent.id,targetAgent.id].sort().join('-')}`)
      .on('postgres_changes', {event:'INSERT',schema:'public',table:'team_messages'}, (payload) => {
        const msg = payload.new
        const ok = (msg.sender_id===agent.id&&msg.receiver_id===targetAgent.id) ||
                   (msg.sender_id===targetAgent.id&&msg.receiver_id===agent.id)
        if (!ok) return
        setTeamMsgs(prev => prev.find(m=>m.id===msg.id) ? prev : [...prev, msg])
        setTeamPartnerTyping(false)
        if (msg.sender_id!==agent.id) supabase.from('team_messages').update({is_read:true}).eq('id',msg.id)
        setTimeout(() => teamEndRef.current?.scrollIntoView({behavior:'smooth'}), 60)
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload?.from !== agent.id) {
          if (payload?.stop) { setTeamPartnerTyping(false); return }
          setTeamPartnerTyping(true)
          clearTimeout(partnerTypingTimer)
          partnerTypingTimer = setTimeout(() => setTeamPartnerTyping(false), 3000)
          setTimeout(() => teamEndRef.current?.scrollIntoView({behavior:'smooth'}), 60)
        }
      })
      .subscribe()
    teamChanRef.current = ch
  }

  async function sendTeamMessage(e) {
    e?.preventDefault()
    const text = teamInput.trim(); if (!text||!teamChatWith||!agent) return
    setTeamInput('')
    // Add to conv partners if new
    setTeamConvPartners(prev => prev.includes(teamChatWith.id) ? prev : [...prev, teamChatWith.id])
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
          // Add to conv partners if new
          setTeamConvPartners(prev => prev.includes(sid) ? prev : [...prev, sid])
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
  const holdList      = conversations.filter(c => c.status==='hold')
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
          <NavBtn icon="headset" label="Support" active={navSection==='chats'}
            badge={totalUnread+waitingList.length}
            onClick={() => { setNavSection('chats'); setMobileShowChat(false) }} />
          <NavBtn icon="comments" label="Intern" active={navSection==='team'}
            badge={totalTeamUnread}
            onClick={() => { setNavSection('team'); setMobileShowChat(false) }} />
          <NavBtn icon="address-book" label="Kontakte" active={navSection==='contacts'}
            onClick={() => { setNavSection('contacts'); setMobileShowChat(false) }} />
        </div>
        <div className="db-rail-bottom">
          <div className="db-rail-agent" onClick={() => setShowProfileModal(true)} title="Profil bearbeiten">
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
              {holdList.length > 0 && (
                <Section title="Warteschleife" count={holdList.length} accent="hold"
                  open={sectionsOpen.hold} onToggle={() => setSectionsOpen(p=>({...p,hold:!p.hold}))}>
                  {holdList.map(conv => <ConvItem key={conv.id} conv={conv} accent="hold"
                    active={activeConv?.id===conv.id} unread={unreadCounts[conv.id]||0} onSelect={selectConv} />)}
                </Section>
              )}
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
              {(() => {
                const partners = allAgents.filter(a => a.id !== agent?.id && teamConvPartners.includes(a.id))
                return partners.length === 0
                  ? <div className="db-panel-empty"><i className="fas fa-comments"/><p>Noch keine Chats</p><p style={{fontSize:'0.72rem',opacity:0.5,marginTop:4}}>Starte einen Chat über Kontakte</p></div>
                  : partners.map(a => (
                      <motion.div key={a.id} className={`db-team-item-wrap ${teamChatWith?.id===a.id?'selected':''}`}
                        initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}}>
                        <button className="db-team-item" style={{flex:1}}
                          onClick={() => { openTeamChat(a); setNavSection('team') }}>
                          <div className="db-team-av-wrap">
                            <Avatar agent={a} size={38} />
                            <span className={`db-online-dot-sm ${a.is_online?'online':''}`} />
                          </div>
                          <div className="db-team-info">
                            <strong>
                              {a.name}
                              {a.is_admin && <span className="db-admin-crown" title="Admin"><i className="fas fa-shield-alt" /></span>}
                            </strong>
                            <span className={a.is_online?'text-online':'text-offline'}>{a.is_online?'● Online':'○ Offline'}</span>
                          </div>
                          {unreadTeam[a.id]>0 && <span className="db-team-unread">{unreadTeam[a.id]}</span>}
                        </button>
                        <button className="db-team-delete-btn" onClick={(e) => {e.stopPropagation(); deleteTeamChat(a.id)}} title="Chat löschen">
                          <i className="fas fa-trash" />
                        </button>
                      </motion.div>
                    ))
              })()}
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {navSection === 'contacts' && (
          <div className="db-panel-content">
            <div className="db-panel-header">
              <h2>Kontakte</h2>
              <p className="db-panel-sub">{onlineAgents.filter(a=>a.id!==agent?.id).length} online</p>
            </div>
            <div className="db-panel-list">
              {onlineAgents.filter(a=>a.id!==agent?.id).length>0 && (
                <p className="db-contacts-section-lbl">● Online</p>
              )}
              {onlineAgents.filter(a=>a.id!==agent?.id).map(a => (
                <ContactItem key={a.id} agent={a} selected={contactInfo?.id===a.id}
                  unread={unreadTeam[a.id]||0} allRoles={roles}
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
                    <Avatar agent={contactInfo} size={56} />
                    <h3>
                      {contactInfo.name}
                      {contactInfo.is_admin && <span className="db-admin-crown" title="Admin"><i className="fas fa-shield-alt" /></span>}
                    </h3>
                    {contactInfo.role_ids?.length > 0
                      ? <RoleChips roleIds={contactInfo.role_ids} allRoles={roles} />
                      : contactInfo.role && (
                          <span className={`db-contact-role-chip ${contactInfo.is_admin?'admin':''}`}>
                            {contactInfo.is_admin && <i className="fas fa-shield-alt" />}
                            {!contactInfo.is_admin && <i className="fas fa-tag" />}
                            {contactInfo.role}
                          </span>
                        )
                    }
                    <span className={`db-contact-status-badge ${contactInfo.is_online?'online':'offline'}`}>
                      {contactInfo.is_online ? '● Online' : '○ Offline'}
                    </span>
                    {contactInfo.email && (
                      <a href={`mailto:${contactInfo.email}`} className="db-contact-email">
                        <i className="fas fa-envelope" /> {contactInfo.email}
                      </a>
                    )}
                    {/* Admin: Multi-select role assignment */}
                    {agent?.is_admin && roles.length > 0 && (
                      <div className="db-contact-role-assign">
                        <label><i className="fas fa-shield-alt" /> Rollen vergeben</label>
                        <div className="db-role-chips-select">
                          {roles.map(r => {
                            const isActive = (contactInfo.role_ids || []).includes(r.id)
                            const isOwnerProtected = contactInfo.is_owner && r.name.toLowerCase() === 'admin'
                            return (
                              <button key={r.id}
                                className={`db-role-chip-btn ${isActive ? 'active' : ''} ${isOwnerProtected ? 'protected' : ''}`}
                                style={isActive ? { background: r.color + '33', color: r.color, borderColor: r.color } : {}}
                                title={isOwnerProtected ? 'Owner — kann Admin-Rolle nicht verlieren' : r.name}
                                onClick={async () => {
                                  if (isOwnerProtected) return
                                  const currentIds = contactInfo.role_ids || []
                                  const newIds = isActive
                                    ? currentIds.filter(id => id !== r.id)
                                    : [...currentIds, r.id]
                                  await updateAgentRoleIds(contactInfo.id, newIds, roles)
                                }}>
                                {isOwnerProtected && <i className="fas fa-lock" style={{marginRight:4,fontSize:'0.7rem'}} />}
                                {r.name}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
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
                    {activeConv.status==='waiting'?'Wartend':activeConv.status==='active'?'Aktiv':activeConv.status==='hold'?'Pausiert':'Beendet'}
                  </span>
                  {activeConv.user_topic && (
                    <span className="db-conv-topic-tag"><i className="fas fa-tag" /> {activeConv.user_topic}</span>
                  )}
                  {activeConv.agents && (
                    <span className="db-assigned"><Avatar agent={activeConv.agents} size={14} /> {activeConv.agents.name}</span>
                  )}
                  <span className="db-chat-since">{fmtTime(activeConv.created_at)}</span>
                  {activeConv.status !== 'closed' && activeConv.created_at && (() => {
                    const sec = Math.max(0, Math.floor((headerNow - new Date(activeConv.created_at).getTime()) / 1000))
                    const h = Math.floor(sec / 3600)
                    const m = Math.floor((sec % 3600) / 60)
                    const s = sec % 60
                    const t = h > 0 ? `${h}h ${String(m).padStart(2,'0')}m` : `${m}:${String(s).padStart(2,'0')}`
                    return <span className={`db-conv-timer accent-${activeConv.status}`}><i className="fas fa-clock" /> {t}</span>
                  })()}
                  {activeConv.status === 'closed' && activeConv.created_at && activeConv.last_message_at && (
                    <span className="db-conv-timer accent-closed">
                      <i className="fas fa-hourglass-end" /> {formatDuration(activeConv.created_at, activeConv.last_message_at)}
                    </span>
                  )}
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
                {activeConv.status==='active' && activeConv.assigned_agent_id===agent?.id && (
                  <button className="icon-btn db-hold-btn" onClick={() => holdConv(activeConv.id)} title="In Warteschleife setzen">
                    <i className="fas fa-pause-circle" />
                  </button>
                )}
                {activeConv.status==='hold' && activeConv.assigned_agent_id===agent?.id && (
                  <button className="db-claim-btn db-unhold-btn" onClick={() => unholdConv(activeConv.id)}>
                    <i className="fas fa-play-circle" /> Fortsetzen
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
                    <i className="fas fa-times-circle" /><span> Beenden</span>
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
                          <div className={`db-msg-bubble ${isOut?'out':'in'}`}>{renderContent(msg.content)}</div>
                        </div>
                        {isOut && <div className="db-msg-avatar-sm"><Avatar agent={agent} size={26} /></div>}
                      </motion.div>
                    )}
                  </div>
                )
              })}
              {/* Customer typing indicator */}
              <AnimatePresence>
                {customerTyping && (
                  <motion.div className="db-typing-row incoming"
                    initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}}>
                    <div className="db-msg-avatar-sm"><div className="db-msg-user-dot">{(activeConv?.user_name?.[0]||'?').toUpperCase()}</div></div>
                    <div className="db-typing-bubble"><span/><span/><span/></div>
                  </motion.div>
                )}
              </AnimatePresence>
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

            {activeConv.status==='active' && (activeConv.assigned_agent_id===agent?.id || agent?.is_admin) ? (
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
                  {/* Image upload */}
                  <input ref={fileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleImageSend} />
                  <button type="button" className="qr-toggle-btn" onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading} title="Bild senden">
                    {imageUploading ? <span className="btn-spinner" style={{width:14,height:14}} /> : <i className="fas fa-image" />}
                  </button>
                  <input ref={inputRef} type="text" placeholder={`Antworten als ${agent?.name}…`} value={replyInput}
                    onChange={e => {
                      setReplyInput(e.target.value)
                      // Broadcast typing to customer
                      if (typingChanRef.current) {
                        typingChanRef.current.send({ type:'broadcast', event:'typing', payload:{ from:'agent' } })
                        clearTimeout(agentTypingTimer.current)
                        agentTypingTimer.current = setTimeout(() => {
                          typingChanRef.current?.send({ type:'broadcast', event:'typing', payload:{ from:'agent', stop:true } })
                        }, 2500)
                      }
                    }}
                    className="db-reply-input" />
                  <button type="submit" className="db-send-btn" disabled={!replyInput.trim()}><i className="fas fa-paper-plane" /></button>
                </form>
              </div>
            ) : activeConv.status==='waiting' ? (
              <div className="db-claim-bar"><p><i className="fas fa-clock" /> Wartet</p>
                <button className="db-claim-btn large" onClick={() => claimConv(activeConv)}><i className="fas fa-headset" /> Übernehmen</button>
              </div>
            ) : activeConv.status==='hold' ? (
              <div className="db-claim-bar" style={{background:'rgba(37,99,235,0.08)',borderColor:'rgba(96,165,250,0.2)'}}>
                <p><i className="fas fa-pause-circle" style={{color:'#60a5fa'}} /> <span style={{color:'#93c5fd'}}>Warteschleife aktiv</span></p>
                {(activeConv.assigned_agent_id===agent?.id || agent?.is_admin) && (
                  <button className="db-claim-btn db-unhold-btn" onClick={() => unholdConv(activeConv.id)}>
                    <i className="fas fa-play-circle" /> Fortsetzen
                  </button>
                )}
              </div>
            ) : activeConv.status==='closed' ? (
              <div className="db-claim-bar muted"><p><i className="fas fa-lock" /> Chat beendet</p>
                {agent?.is_admin && (
                  <button className="db-end-btn" onClick={() => deleteConv(activeConv.id)} title="Chat löschen">
                    <i className="fas fa-trash" /> Löschen
                  </button>
                )}
              </div>
            ) : (
              <div className="db-claim-bar muted"><p><i className="fas fa-info-circle" /> Wird von <strong>{activeConv.agents?.name}</strong> bearbeitet</p>
                {agent?.is_admin && (
                  <button className="db-claim-btn" onClick={() => claimConv(activeConv)} title="Als Admin übernehmen">
                    <i className="fas fa-shield-alt" /> Übernehmen
                  </button>
                )}
              </div>
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
              {/* Partner typing indicator */}
              <AnimatePresence>
                {teamPartnerTyping && (
                  <motion.div className="db-typing-row incoming"
                    initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}}>
                    <div className="db-msg-avatar-sm"><Avatar agent={teamChatWith} size={26} /></div>
                    <div className="db-typing-bubble"><span/><span/><span/></div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={teamEndRef} />
            </div>

            <div className="db-input-area">
              <form className="db-reply-bar" onSubmit={sendTeamMessage}>
                <input ref={teamInputRef} type="text" placeholder={`Nachricht an ${teamChatWith.name}…`}
                  value={teamInput}
                  onChange={e => {
                    setTeamInput(e.target.value)
                    if (teamChanRef.current) {
                      teamChanRef.current.send({ type:'broadcast', event:'typing', payload:{ from: agent.id } })
                      clearTimeout(teamTypingTimer.current)
                      teamTypingTimer.current = setTimeout(() => {
                        teamChanRef.current?.send({ type:'broadcast', event:'typing', payload:{ from: agent.id, stop: true } })
                      }, 2500)
                    }
                  }}
                  className="db-reply-input" />
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
                  {activeConv.status==='waiting'?'Wartend':activeConv.status==='active'?'Aktiv':activeConv.status==='hold'?'Warteschleife':'Beendet'}
                </span>
                {activeConv.status === 'closed' && activeConv.created_at && activeConv.last_message_at && (
                  <span className="db-conv-timer accent-closed" style={{marginTop:4}}>
                    <i className="fas fa-hourglass-end" /> Dauer: {formatDuration(activeConv.created_at, activeConv.last_message_at)}
                  </span>
                )}
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
          <div className="db-nav-icon-wrap"><i className="fas fa-headset" />{(totalUnread+waitingList.length)>0&&<span className="db-nav-badge">{totalUnread+waitingList.length}</span>}</div>
          <span>Support</span>
        </button>
        <button className={mobileTab==='team'&&!mobileShowChat?'active':''} onClick={() => {setMobileTab('team');setNavSection('team');setMobileShowChat(false)}}>
          <div className="db-nav-icon-wrap"><i className="fas fa-comments" />{totalTeamUnread>0&&<span className="db-nav-badge">{totalTeamUnread}</span>}</div>
          <span>Intern</span>
        </button>
        <button className={mobileTab==='contacts'&&!mobileShowChat?'active':''} onClick={() => {setMobileTab('contacts');setNavSection('contacts');setMobileShowChat(false)}}>
          <div className="db-nav-icon-wrap"><i className="fas fa-address-book" /></div>
          <span>Kontakte</span>
        </button>
        <button onClick={() => setShowProfileModal(true)}>
          <div className="db-nav-icon-wrap" style={{position:'relative'}}>
            <Avatar agent={agent} size={22} />
            <span style={{position:'absolute',bottom:-1,right:-3,width:7,height:7,borderRadius:'50%',background:isOnline?'#4ade80':'#555',border:'1.5px solid #070310'}} />
          </div>
          <span>Profil</span>
        </button>
        <button onClick={() => navigate('/settings')}>
          <div className="db-nav-icon-wrap"><i className="fas fa-cog" /></div>
          <span>Einst.</span>
        </button>
        <button className="db-mobile-nav-danger" onClick={logout}>
          <div className="db-nav-icon-wrap"><i className="fas fa-sign-out-alt" /></div>
          <span>Logout</span>
        </button>
      </nav>

      {/* PROFILE MODAL */}
      <AnimatePresence>
        {showProfileModal && (
          <ProfileModal
            agent={agent}
            roles={roles}
            onSave={(updated) => { onAgentUpdate(updated); setIsOnline(updated.is_online) }}
            onClose={() => setShowProfileModal(false)}
            onUpdateRoleIds={async (id, newIds, allRoles) => {
              await updateAgentRoleIds(id, newIds, allRoles)
              onAgentUpdate({ ...agent, role_ids: newIds })
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
