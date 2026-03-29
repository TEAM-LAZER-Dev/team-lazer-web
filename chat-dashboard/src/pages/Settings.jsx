import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/* ── Notification sound preview ─────────────────── */
function playBeep() {
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

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

const PRESET_COLORS = [
  '#7c3aed','#2563eb','#0891b2','#059669','#16a34a',
  '#ca8a04','#ea580c','#dc2626','#db2777','#9333ea',
  '#fbbf24','#34d399','#60a5fa','#f472b6','#a78bfa',
]

const NAV_ITEMS = [
  { id: 'notifications', icon: 'bell',         label: 'Benachrichtigungen' },
  { id: 'chat',          icon: 'comments',      label: 'Chat-Verhalten'     },
  { id: 'appearance',    icon: 'palette',       label: 'Darstellung'        },
  { id: 'dsgvo',         icon: 'shield-alt',    label: 'DSGVO & Daten',  adminOnly: true },
  { id: 'quickreplies',  icon: 'bolt',          label: 'Schnellantworten'   },
  { id: 'roles',         icon: 'shield-alt',    label: 'Rollen',  adminOnly: true },
]

/* ── Toggle Row ─────────────────────────────────── */
function ToggleRow({ label, desc, checked, onChange, action }) {
  return (
    <div className="st2-toggle-row">
      <div className="st2-toggle-info">
        <strong>{label}</strong>
        {desc && <span>{desc}</span>}
      </div>
      <div className="st2-toggle-right">
        {action}
        {onChange !== undefined && (
          <label className="toggle-switch">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        )}
      </div>
    </div>
  )
}

/* ── Section card ────────────────────────────────── */
function Card({ title, icon, children, badge }) {
  return (
    <div className="st2-card">
      <div className="st2-card-title">
        <i className={`fas fa-${icon}`} />
        <span>{title}</span>
        {badge && <span className="admin-only-badge">{badge}</span>}
      </div>
      {children}
    </div>
  )
}

export default function Settings({ agent, onAgentUpdate }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('notifications')

  /* ── Notification state ──────────────────────────── */
  const [notifySound,   setNotifySound]   = useState(agent?.notify_sound ?? true)
  const [notifyBrowser, setNotifyBrowser] = useState(agent?.notify_browser ?? true)
  const [browserPerm,   setBrowserPerm]   = useState(Notification?.permission || 'default')
  const [notifySaving,  setNotifySaving]  = useState(false)
  const [notifyMsg,     setNotifyMsg]     = useState('')

  /* ── Push state ──────────────────────────────────── */
  const [pushStatus, setPushStatus] = useState('idle')
  const [pushMsg,    setPushMsg]    = useState('')

  /* ── Chat behavior state ─────────────────────────── */
  const [autoClaimWaiting, setAutoClaimWaiting] = useState(
    () => localStorage.getItem('tl_auto_claim') === 'true'
  )
  const [showClosedCount, setShowClosedCount] = useState(
    () => Number(localStorage.getItem('tl_closed_limit') || 50)
  )
  const [chatSaving, setChatSaving] = useState(false)
  const [chatMsg,    setChatMsg]    = useState('')

  /* ── Appearance state ────────────────────────────── */
  const [compactMode, setCompactMode] = useState(
    () => localStorage.getItem('tl_compact') === 'true'
  )
  const [showAvatarsInList, setShowAvatarsInList] = useState(
    () => localStorage.getItem('tl_show_avatars') !== 'false'
  )
  const [msgDensity, setMsgDensity] = useState(
    () => localStorage.getItem('tl_msg_density') || 'normal'
  )
  const [appearanceMsg, setAppearanceMsg] = useState('')

  /* ── Quick replies state ─────────────────────────── */
  const [quickReplies, setQuickReplies] = useState([])
  const [newTitle,     setNewTitle]     = useState('')
  const [newContent,   setNewContent]   = useState('')
  const [editingId,    setEditingId]    = useState(null)
  const [editTitle,    setEditTitle]    = useState('')
  const [editContent,  setEditContent]  = useState('')

  /* ── Roles state ─────────────────────────────────── */
  const [roles,         setRoles]         = useState([])
  const [newRoleName,   setNewRoleName]   = useState('')
  const [newRoleColor,  setNewRoleColor]  = useState('#7c3aed')
  const [rolesSaving,   setRolesSaving]   = useState(false)
  const [rolesMsg,      setRolesMsg]      = useState('')
  const [editRoleId,    setEditRoleId]    = useState(null)
  const [editRoleName,  setEditRoleName]  = useState('')
  const [editRoleColor, setEditRoleColor] = useState('#7c3aed')

  /* ── DSGVO state ─────────────────────────────────── */
  const [retentionDays, setRetentionDays] = useState(
    () => Number(localStorage.getItem('tl_retention_days') || 90)
  )
  const [dsgvoSaving,   setDsgvoSaving]   = useState(false)
  const [dsgvoMsg,      setDsgvoMsg]      = useState('')
  const [deleteCount,   setDeleteCount]   = useState(null)

  useEffect(() => {
    loadQuickReplies()
    checkPushStatus()
    if (agent?.is_admin) loadRoles()
    // Apply saved appearance on load
    const compact = localStorage.getItem('tl_compact') === 'true'
    const density = localStorage.getItem('tl_msg_density') || 'normal'
    document.documentElement.classList.toggle('tl-compact', compact)
    document.documentElement.classList.remove('tl-density-compact','tl-density-normal','tl-density-relaxed')
    document.documentElement.classList.add(`tl-density-${density}`)
  }, []) // eslint-disable-line

  // Live preview: apply immediately when toggles change
  useEffect(() => {
    document.documentElement.classList.toggle('tl-compact', compactMode)
  }, [compactMode])

  useEffect(() => {
    document.documentElement.classList.remove('tl-density-compact','tl-density-normal','tl-density-relaxed')
    document.documentElement.classList.add(`tl-density-${msgDensity}`)
  }, [msgDensity])

  /* ── Push ───────────────────────────────────────── */
  async function checkPushStatus() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) { setPushStatus('unsupported'); return }
    setPushStatus(agent?.push_subscription ? 'subscribed' : 'idle')
  }
  async function subscribePush() {
    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
    if (!vapidKey) { setPushMsg('⚠️ VAPID-Key fehlt. Netlify neu deployen.'); return }
    setPushStatus('loading'); setPushMsg('')
    try {
      const perm = await Notification.requestPermission()
      setBrowserPerm(perm)
      if (perm !== 'granted') { setPushStatus('idle'); setPushMsg('Nicht erlaubt.'); return }
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapidKey) })
      const subJson = sub.toJSON()
      await supabase.from('agents').update({ push_subscription: subJson }).eq('id', agent.id)
      onAgentUpdate({ ...agent, push_subscription: subJson })
      setPushStatus('subscribed'); setPushMsg('✓ Aktiviert!')
      setTimeout(() => setPushMsg(''), 3000)
    } catch(e) { setPushStatus('idle'); setPushMsg('Fehler: ' + (e.message || 'Unbekannt')) }
  }
  async function unsubscribePush() {
    setPushStatus('loading')
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) await sub.unsubscribe()
      await supabase.from('agents').update({ push_subscription: null }).eq('id', agent.id)
      onAgentUpdate({ ...agent, push_subscription: null })
      setPushStatus('idle'); setPushMsg('Deaktiviert.')
      setTimeout(() => setPushMsg(''), 3000)
    } catch(e) { setPushStatus('subscribed'); setPushMsg('Fehler.') }
  }

  /* ── Notifications save ─────────────────────────── */
  async function saveNotifications() {
    setNotifySaving(true); setNotifyMsg('')
    const { data: updated, error } = await supabase.from('agents')
      .update({ notify_sound: notifySound, notify_browser: notifyBrowser })
      .eq('id', agent.id).select().single()
    setNotifySaving(false)
    if (error) { setNotifyMsg('Fehler: ' + error.message); return }
    onAgentUpdate(updated)
    setNotifyMsg('✓ Gespeichert!'); setTimeout(() => setNotifyMsg(''), 3000)
  }
  async function requestBrowserPerm() {
    const perm = await Notification.requestPermission()
    setBrowserPerm(perm)
    setNotifyBrowser(perm === 'granted')
  }

  /* ── Chat behavior save (localStorage) ─────────── */
  function saveChatSettings() {
    setChatSaving(true); setChatMsg('')
    localStorage.setItem('tl_auto_claim', autoClaimWaiting)
    localStorage.setItem('tl_closed_limit', showClosedCount)
    setChatSaving(false)
    setChatMsg('✓ Gespeichert!'); setTimeout(() => setChatMsg(''), 3000)
  }

  /* ── Appearance save (localStorage) ─────────────── */
  function saveAppearance() {
    localStorage.setItem('tl_compact', compactMode)
    localStorage.setItem('tl_show_avatars', showAvatarsInList)
    localStorage.setItem('tl_msg_density', msgDensity)
    // Apply immediately
    applyAppearanceSettings(compactMode, msgDensity)
    setAppearanceMsg('✓ Angewendet!'); setTimeout(() => setAppearanceMsg(''), 2500)
  }

  function applyAppearanceSettings(compact, density) {
    document.documentElement.classList.toggle('tl-compact', compact)
    document.documentElement.classList.remove('tl-density-compact','tl-density-normal','tl-density-relaxed')
    document.documentElement.classList.add(`tl-density-${density}`)
  }

  /* ── Quick replies ──────────────────────────────── */
  async function loadQuickReplies() {
    const { data } = await supabase.from('quick_replies').select('*').order('sort_order')
    setQuickReplies(data || [])
  }
  async function addQuickReply() {
    if (!newTitle.trim() || !newContent.trim()) return
    const maxOrder = quickReplies.reduce((m, r) => Math.max(m, r.sort_order), 0)
    const { data } = await supabase.from('quick_replies')
      .insert({ title: newTitle.trim(), content: newContent.trim(), sort_order: maxOrder + 1 }).select().single()
    if (data) setQuickReplies(prev => [...prev, data])
    setNewTitle(''); setNewContent('')
  }
  async function deleteQuickReply(id) {
    await supabase.from('quick_replies').delete().eq('id', id)
    setQuickReplies(prev => prev.filter(r => r.id !== id))
  }
  async function saveEdit(id) {
    const { data } = await supabase.from('quick_replies')
      .update({ title: editTitle, content: editContent }).eq('id', id).select().single()
    if (data) setQuickReplies(prev => prev.map(r => r.id === id ? data : r))
    setEditingId(null)
  }

  /* ── Roles ──────────────────────────────────────── */
  async function loadRoles() {
    const { data } = await supabase.from('roles').select('*').order('name')
    setRoles(data || [])
  }
  async function addRole() {
    if (!newRoleName.trim()) return
    setRolesSaving(true); setRolesMsg('')
    const { data, error } = await supabase.from('roles')
      .insert({ name: newRoleName.trim(), color: newRoleColor }).select().single()
    setRolesSaving(false)
    if (error) { setRolesMsg('Fehler: Name bereits vergeben?'); return }
    setRoles(prev => [...prev, data].sort((a,b) => a.name.localeCompare(b.name)))
    setNewRoleName(''); setNewRoleColor('#7c3aed')
    setRolesMsg('✓ Rolle erstellt!'); setTimeout(() => setRolesMsg(''), 2000)
  }
  async function deleteRole(id) {
    await supabase.from('roles').delete().eq('id', id)
    setRoles(prev => prev.filter(r => r.id !== id))
  }
  async function saveRoleEdit(id) {
    const { data, error } = await supabase.from('roles')
      .update({ name: editRoleName.trim(), color: editRoleColor }).eq('id', id).select().single()
    if (!error && data) setRoles(prev => prev.map(r => r.id === id ? data : r))
    setEditRoleId(null)
  }

  /* ── DSGVO functions ─────────────────────────────── */
  function saveDsgvoSettings() {
    setDsgvoSaving(true)
    localStorage.setItem('tl_retention_days', retentionDays)
    setDsgvoSaving(false)
    setDsgvoMsg('✓ Gespeichert!'); setTimeout(() => setDsgvoMsg(''), 3000)
  }

  async function runManualCleanup() {
    setDsgvoSaving(true); setDsgvoMsg(''); setDeleteCount(null)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - retentionDays)
    const cutoffStr = cutoff.toISOString()
    // Get old closed conversations
    const { data: oldConvs } = await supabase
      .from('conversations').select('id').eq('status', 'closed')
      .lt('last_message_at', cutoffStr)
    if (!oldConvs?.length) {
      setDsgvoMsg('Keine alten Chats gefunden.'); setDsgvoSaving(false); return
    }
    const ids = oldConvs.map(c => c.id)
    await supabase.from('messages').delete().in('conversation_id', ids)
    await supabase.from('conversations').delete().in('id', ids)
    setDeleteCount(ids.length)
    setDsgvoMsg(`✓ ${ids.length} Chat${ids.length>1?'s':''} dauerhaft gelöscht.`)
    setDsgvoSaving(false)
    setTimeout(() => { setDsgvoMsg(''); setDeleteCount(null) }, 6000)
  }

  const visibleTabs = NAV_ITEMS.filter(t => !t.adminOnly || agent?.is_admin)

  /* ── Render ──────────────────────────────────────── */
  return (
    <div className="st2-root">
      <div className="st2-topbar">
        <button className="st2-back" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left" />
        </button>
        <h1><i className="fas fa-cog" /> Einstellungen</h1>
        <div className="st2-topbar-agent">
          <div className="st2-agent-dot" style={{ background: agent?.is_online ? '#4ade80' : '#555' }} />
          <span>{agent?.name}</span>
        </div>
      </div>

      <div className="st2-layout">
        {/* ── Sidebar nav ──────────────────── */}
        <nav className="st2-sidebar">
          {visibleTabs.map(tab => (
            <button key={tab.id}
              className={`st2-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>
              <i className={`fas fa-${tab.icon}`} />
              <span>{tab.label}</span>
              {tab.adminOnly && <span className="st2-admin-dot" title="Admin" />}
            </button>
          ))}
        </nav>

        {/* ── Content ──────────────────────── */}
        <div className="st2-content">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>

              {/* ════ BENACHRICHTIGUNGEN ════ */}
              {activeTab === 'notifications' && (
                <div className="st2-section">
                  <div className="st2-section-intro">
                    <h2><i className="fas fa-bell" /> Benachrichtigungen</h2>
                    <p>Steuere, wie und wann du über neue Chats informiert wirst.</p>
                  </div>

                  <Card title="Sound & Browser" icon="volume-up">
                    <ToggleRow
                      label="Benachrichtigungston"
                      desc="Spielt einen Ton ab, wenn ein neuer Chat eingeht"
                      checked={notifySound}
                      onChange={setNotifySound}
                      action={
                        <button className="st2-preview-btn" onClick={playBeep} title="Ton testen">
                          <i className="fas fa-play" />
                        </button>
                      }
                    />
                    <ToggleRow
                      label="Browser-Benachrichtigungen"
                      desc="Popup-Benachrichtigung im Browser-Tab"
                      checked={notifyBrowser}
                      onChange={browserPerm === 'granted' ? setNotifyBrowser : undefined}
                      action={
                        browserPerm === 'denied'
                          ? <span className="st2-perm-denied"><i className="fas fa-ban" /> Blockiert</span>
                          : browserPerm !== 'granted'
                            ? <button className="btn-secondary-sm" onClick={requestBrowserPerm}>Erlauben</button>
                            : null
                      }
                    />
                    <div className="st2-save-row">
                      <button className="btn-primary" onClick={saveNotifications} disabled={notifySaving}>
                        {notifySaving ? <span className="btn-spinner" /> : <><i className="fas fa-save" /> Speichern</>}
                      </button>
                      {notifyMsg && <span className={`save-msg ${notifyMsg.startsWith('✓')?'ok':'err'}`}>{notifyMsg}</span>}
                    </div>
                  </Card>

                  <Card title="Push-Benachrichtigungen" icon="mobile-alt">
                    <div className="st2-push-desc">
                      <p>Erhalte Benachrichtigungen auch wenn das Dashboard geschlossen ist — auch auf dem Handy.</p>
                      {!import.meta.env.VITE_VAPID_PUBLIC_KEY && (
                        <div className="st2-warning-box">
                          <i className="fas fa-exclamation-triangle" />
                          <span>VAPID-Key fehlt. Netlify → Deploys → "Trigger deploy".</span>
                        </div>
                      )}
                    </div>
                    {pushStatus === 'unsupported' ? (
                      <div className="st2-info-box"><i className="fas fa-info-circle" /> Dein Browser unterstützt keine Push-Benachrichtigungen.</div>
                    ) : pushStatus === 'subscribed' ? (
                      <div className="st2-push-active">
                        <div className="st2-push-active-status">
                          <span className="st2-push-dot" /><span>Auf diesem Gerät aktiviert</span>
                        </div>
                        <button className="btn-secondary-sm" onClick={unsubscribePush} disabled={pushStatus==='loading'}>
                          <i className="fas fa-bell-slash" /> Deaktivieren
                        </button>
                      </div>
                    ) : (
                      <button className="btn-push-activate" onClick={subscribePush} disabled={pushStatus==='loading'}>
                        {pushStatus === 'loading'
                          ? <><span className="btn-spinner" /> Aktiviere…</>
                          : <><i className="fas fa-bell" /> Push aktivieren</>}
                      </button>
                    )}
                    {pushMsg && <p className={`push-msg ${pushMsg.startsWith('✓')?'ok':''}`}>{pushMsg}</p>}
                  </Card>
                </div>
              )}

              {/* ════ CHAT-VERHALTEN ════ */}
              {activeTab === 'chat' && (
                <div className="st2-section">
                  <div className="st2-section-intro">
                    <h2><i className="fas fa-comments" /> Chat-Verhalten</h2>
                    <p>Passe an, wie das Dashboard Kunden-Chats für dich handhabt.</p>
                  </div>

                  <Card title="Wartende Chats" icon="clock">
                    <ToggleRow
                      label="Wartende Chats automatisch öffnen"
                      desc="Öffnet den nächsten wartenden Chat automatisch beim Login"
                      checked={autoClaimWaiting}
                      onChange={setAutoClaimWaiting}
                    />
                  </Card>

                  <Card title="Verlauf" icon="history">
                    <div className="st2-field-row">
                      <div className="st2-toggle-info">
                        <strong>Beendete Chats anzeigen</strong>
                        <span>Maximale Anzahl beendeter Chats in der Liste</span>
                      </div>
                      <div className="st2-select-wrap">
                        <select className="st2-select" value={showClosedCount}
                          onChange={e => setShowClosedCount(Number(e.target.value))}>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                          <option value={0}>Alle</option>
                        </select>
                      </div>
                    </div>
                  </Card>

                  <div className="st2-save-row" style={{marginTop:0}}>
                    <button className="btn-primary" onClick={saveChatSettings} disabled={chatSaving}>
                      {chatSaving ? <span className="btn-spinner" /> : <><i className="fas fa-save" /> Speichern</>}
                    </button>
                    {chatMsg && <span className={`save-msg ${chatMsg.startsWith('✓')?'ok':'err'}`}>{chatMsg}</span>}
                  </div>
                </div>
              )}

              {/* ════ DARSTELLUNG ════ */}
              {activeTab === 'appearance' && (
                <div className="st2-section">
                  <div className="st2-section-intro">
                    <h2><i className="fas fa-palette" /> Darstellung</h2>
                    <p>Passe das visuelle Layout des Dashboards an.</p>
                  </div>

                  <Card title="Layout" icon="th-large">
                    <ToggleRow
                      label="Kompakter Modus"
                      desc="Kleinere Abstände und dichtere Darstellung"
                      checked={compactMode}
                      onChange={setCompactMode}
                    />
                    <ToggleRow
                      label="Avatare in Listen anzeigen"
                      desc="Profilbilder in der Team- und Kontaktliste"
                      checked={showAvatarsInList}
                      onChange={setShowAvatarsInList}
                    />
                  </Card>

                  <Card title="Nachrichtendichte" icon="align-justify">
                    <div className="st2-density-row">
                      {[
                        { val: 'compact', label: 'Kompakt', icon: 'compress-alt' },
                        { val: 'normal',  label: 'Normal',  icon: 'minus'        },
                        { val: 'relaxed', label: 'Luftig',  icon: 'expand-alt'   },
                      ].map(opt => (
                        <button key={opt.val}
                          className={`st2-density-btn ${msgDensity===opt.val?'active':''}`}
                          onClick={() => setMsgDensity(opt.val)}>
                          <i className={`fas fa-${opt.icon}`} />
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </Card>

                  <div className="st2-save-row" style={{marginTop:0}}>
                    <button className="btn-primary" onClick={saveAppearance}>
                      <i className="fas fa-save" /> Anwenden
                    </button>
                    {appearanceMsg && <span className="save-msg ok">{appearanceMsg}</span>}
                  </div>
                </div>
              )}

              {/* ════ SCHNELLANTWORTEN ════ */}
              {activeTab === 'quickreplies' && (
                <div className="st2-section">
                  <div className="st2-section-intro">
                    <h2><i className="fas fa-bolt" /> Schnellantworten</h2>
                    <p>Vordefinierte Texte für schnellere Antworten im Chat. Sichtbar für alle Mitarbeiter.</p>
                  </div>

                  <Card title="Vorhandene Schnellantworten" icon="list">
                    {quickReplies.length === 0 && (
                      <p className="st2-empty-hint">Noch keine Schnellantworten erstellt.</p>
                    )}
                    <div className="qr-list">
                      <AnimatePresence initial={false}>
                        {quickReplies.map(r => (
                          <motion.div key={r.id} className="qr-item"
                            initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
                            exit={{ opacity:0, height:0, marginBottom:0 }} layout>
                            {editingId === r.id ? (
                              <div className="qr-edit-form">
                                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Titel" className="qr-input-sm" />
                                <textarea value={editContent} onChange={e => setEditContent(e.target.value)} placeholder="Inhalt" className="qr-textarea" rows={3} />
                                <div className="qr-edit-actions">
                                  <button className="btn-primary-sm" onClick={() => saveEdit(r.id)}><i className="fas fa-check" /> Speichern</button>
                                  <button className="btn-ghost-sm" onClick={() => setEditingId(null)}>Abbrechen</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="qr-item-content">
                                  <strong>{r.title}</strong>
                                  <p>{r.content}</p>
                                </div>
                                <div className="qr-item-actions">
                                  <button onClick={() => { setEditingId(r.id); setEditTitle(r.title); setEditContent(r.content) }} title="Bearbeiten">
                                    <i className="fas fa-pen" />
                                  </button>
                                  <button onClick={() => deleteQuickReply(r.id)} title="Löschen" className="del">
                                    <i className="fas fa-trash" />
                                  </button>
                                </div>
                              </>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </Card>

                  <Card title="Neue Schnellantwort" icon="plus">
                    <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                      placeholder="Titel (z.B. Begrüßung)" className="qr-input" />
                    <textarea value={newContent} onChange={e => setNewContent(e.target.value)}
                      placeholder="Text der Schnellantwort..." className="qr-textarea" rows={3} />
                    <button className="btn-primary" onClick={addQuickReply} disabled={!newTitle.trim() || !newContent.trim()}>
                      <i className="fas fa-plus" /> Hinzufügen
                    </button>
                  </Card>
                </div>
              )}

              {/* ════ DSGVO & DATEN (Admin) ════ */}
              {activeTab === 'dsgvo' && agent?.is_admin && (
                <div className="st2-section">
                  <div className="st2-section-intro">
                    <h2><i className="fas fa-shield-alt" /> DSGVO & Datenschutz</h2>
                    <p>Verwalte die automatische Löschung alter Chat-Daten gemäß DSGVO-Anforderungen.</p>
                  </div>

                  <Card title="Aufbewahrungsfrist" icon="clock">
                    <div className="st2-field-row">
                      <div className="st2-toggle-info">
                        <strong>Chat-Daten löschen nach</strong>
                        <span>Abgeschlossene Chats werden nach dieser Zeit dauerhaft aus der Datenbank entfernt</span>
                      </div>
                      <div className="st2-select-wrap">
                        <select className="st2-select" value={retentionDays}
                          onChange={e => setRetentionDays(Number(e.target.value))}>
                          <option value={30}>30 Tage</option>
                          <option value={60}>60 Tage</option>
                          <option value={90}>90 Tage</option>
                          <option value={180}>180 Tage</option>
                          <option value={365}>1 Jahr</option>
                        </select>
                      </div>
                    </div>
                    <div className="st2-info-box" style={{marginTop: '12px'}}>
                      <i className="fas fa-info-circle" />
                      <span>Die Aufbewahrungsfrist wird bei jedem Dashboard-Login automatisch angewendet. Chats, die älter als die eingestellte Frist sind, werden dauerhaft gelöscht.</span>
                    </div>
                    <div className="st2-save-row">
                      <button className="btn-primary" onClick={saveDsgvoSettings} disabled={dsgvoSaving}>
                        <i className="fas fa-save" /> Speichern
                      </button>
                      {dsgvoMsg && !deleteCount && <span className={`save-msg ${dsgvoMsg.startsWith('✓')?'ok':'err'}`}>{dsgvoMsg}</span>}
                    </div>
                  </Card>

                  <Card title="Manuelle Bereinigung" icon="trash-alt">
                    <div className="st2-toggle-info" style={{marginBottom:'14px'}}>
                      <span>Führe die DSGVO-Bereinigung sofort durch und lösche alle abgeschlossenen Chats, die älter als <strong>{retentionDays} Tage</strong> sind, dauerhaft aus der Datenbank.</span>
                    </div>
                    {deleteCount !== null && (
                      <div className="st2-info-box" style={{marginBottom:'12px',borderColor:'rgba(74,222,128,0.3)',background:'rgba(74,222,128,0.06)'}}>
                        <i className="fas fa-check-circle" style={{color:'#4ade80'}} />
                        <span style={{color:'#4ade80'}}>{dsgvoMsg}</span>
                      </div>
                    )}
                    <button className="btn-danger" onClick={runManualCleanup} disabled={dsgvoSaving}
                      style={{background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.3)',color:'#f87171',
                        borderRadius:'10px',padding:'10px 18px',fontFamily:'Inter,sans-serif',fontWeight:600,
                        fontSize:'0.85rem',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px',transition:'0.15s'}}>
                      {dsgvoSaving ? <><span className="btn-spinner" /> Lösche…</> : <><i className="fas fa-trash-alt" /> Jetzt bereinigen</>}
                    </button>
                  </Card>
                </div>
              )}

              {/* ════ ROLLEN (Admin) ════ */}
              {activeTab === 'roles' && agent?.is_admin && (
                <div className="st2-section">
                  <div className="st2-section-intro">
                    <h2><i className="fas fa-shield-alt" /> Rollen verwalten <span className="admin-only-badge">Admin</span></h2>
                    <p>Erstelle farbige Rollen und weise sie Teammitgliedern in den Kontakten zu.</p>
                  </div>

                  <Card title="Vorhandene Rollen" icon="tags">
                    {roles.length === 0 && <p className="st2-empty-hint">Noch keine Rollen erstellt.</p>}
                    <div className="roles-list">
                      <AnimatePresence initial={false}>
                        {roles.map(role => (
                          <motion.div key={role.id} className="role-item"
                            initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
                            exit={{ opacity:0, height:0 }} layout>
                            {editRoleId === role.id ? (
                              <div className="role-edit-form">
                                <input value={editRoleName} onChange={e => setEditRoleName(e.target.value)}
                                  placeholder="Rollenname" className="qr-input-sm" style={{ flex:1 }} />
                                <div className="color-picker-row">
                                  {PRESET_COLORS.map(c => (
                                    <button key={c} className={`color-dot ${editRoleColor===c?'selected':''}`}
                                      style={{ background: c }} onClick={() => setEditRoleColor(c)} />
                                  ))}
                                  <input type="color" value={editRoleColor} onChange={e => setEditRoleColor(e.target.value)}
                                    className="color-input-custom" title="Eigene Farbe" />
                                </div>
                                <div className="qr-edit-actions">
                                  <button className="btn-primary-sm" onClick={() => saveRoleEdit(role.id)}><i className="fas fa-check" /> Speichern</button>
                                  <button className="btn-ghost-sm" onClick={() => setEditRoleId(null)}>Abbrechen</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span className="role-chip-preview" style={{ background: role.color + '22', color: role.color, borderColor: role.color + '55' }}>
                                  {role.name}
                                </span>
                                <div className="role-item-actions">
                                  <button onClick={() => { setEditRoleId(role.id); setEditRoleName(role.name); setEditRoleColor(role.color) }} title="Bearbeiten">
                                    <i className="fas fa-pen" />
                                  </button>
                                  <button onClick={() => deleteRole(role.id)} title="Löschen" className="del">
                                    <i className="fas fa-trash" />
                                  </button>
                                </div>
                              </>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </Card>

                  <Card title="Neue Rolle erstellen" icon="plus">
                    <div className="role-add-row" style={{marginBottom:12}}>
                      <input type="text" value={newRoleName} onChange={e => setNewRoleName(e.target.value)}
                        placeholder="Rollenname (z.B. Design, HR…)" className="qr-input" style={{ flex:1, marginBottom:0 }} />
                      <div className="role-preview-chip" style={{ background: newRoleColor + '22', color: newRoleColor, borderColor: newRoleColor + '55' }}>
                        {newRoleName || 'Vorschau'}
                      </div>
                    </div>
                    <div className="color-picker-row" style={{marginBottom:12}}>
                      {PRESET_COLORS.map(c => (
                        <button key={c} className={`color-dot ${newRoleColor===c?'selected':''}`}
                          style={{ background: c }} onClick={() => setNewRoleColor(c)} />
                      ))}
                      <input type="color" value={newRoleColor} onChange={e => setNewRoleColor(e.target.value)}
                        className="color-input-custom" title="Eigene Farbe" />
                    </div>
                    {rolesMsg && <span className={`save-msg ${rolesMsg.startsWith('✓')?'ok':'err'}`} style={{display:'block',marginBottom:8}}>{rolesMsg}</span>}
                    <button className="btn-primary" onClick={addRole} disabled={!newRoleName.trim() || rolesSaving}>
                      {rolesSaving ? <span className="btn-spinner" /> : <><i className="fas fa-plus" /> Rolle erstellen</>}
                    </button>
                  </Card>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
