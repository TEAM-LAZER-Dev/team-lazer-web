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

/* ── VAPID public key (Base64URL → Uint8Array) ───── */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

/* ── Preset colors ───────────────────────────────── */
const PRESET_COLORS = [
  '#7c3aed','#2563eb','#0891b2','#059669','#16a34a',
  '#ca8a04','#ea580c','#dc2626','#db2777','#9333ea',
  '#fbbf24','#34d399','#60a5fa','#f472b6','#a78bfa',
]

export default function Settings({ agent, onAgentUpdate }) {
  const navigate = useNavigate()

  /* ── Notification state ──────────────────────────── */
  const [notifySound, setNotifySound]   = useState(agent?.notify_sound ?? true)
  const [notifyBrowser, setNotifyBrowser] = useState(agent?.notify_browser ?? true)
  const [browserPerm, setBrowserPerm]   = useState(Notification?.permission || 'default')
  const [notifySaving, setNotifySaving] = useState(false)
  const [notifyMsg, setNotifyMsg]       = useState('')

  /* ── Web Push state ──────────────────────────────── */
  const [pushStatus, setPushStatus] = useState('idle')
  const [pushMsg, setPushMsg]       = useState('')

  /* ── Quick replies state ─────────────────────────── */
  const [quickReplies, setQuickReplies] = useState([])
  const [newTitle, setNewTitle]         = useState('')
  const [newContent, setNewContent]     = useState('')
  const [editingId, setEditingId]       = useState(null)
  const [editTitle, setEditTitle]       = useState('')
  const [editContent, setEditContent]   = useState('')

  /* ── Roles state (admin only) ────────────────────── */
  const [roles, setRoles]           = useState([])
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleColor, setNewRoleColor] = useState('#7c3aed')
  const [rolesSaving, setRolesSaving] = useState(false)
  const [rolesMsg, setRolesMsg]       = useState('')
  const [editRoleId, setEditRoleId]   = useState(null)
  const [editRoleName, setEditRoleName] = useState('')
  const [editRoleColor, setEditRoleColor] = useState('#7c3aed')

  useEffect(() => {
    loadQuickReplies()
    checkPushStatus()
    if (agent?.is_admin) loadRoles()
  }, []) // eslint-disable-line

  /* ── Push ───────────────────────────────────────── */
  async function checkPushStatus() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPushStatus('unsupported'); return
    }
    setPushStatus(agent?.push_subscription ? 'subscribed' : 'idle')
  }

  async function subscribePush() {
    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
    if (!vapidKey) {
      setPushMsg('⚠️ VAPID-Key fehlt im Build! Bitte Netlify neu deployen.')
      return
    }
    setPushStatus('loading'); setPushMsg('')
    try {
      const perm = await Notification.requestPermission()
      setBrowserPerm(perm)
      if (perm !== 'granted') { setPushStatus('idle'); setPushMsg('Nicht erlaubt.'); return }
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      })
      const subJson = sub.toJSON()
      await supabase.from('agents').update({ push_subscription: subJson }).eq('id', agent.id)
      onAgentUpdate({ ...agent, push_subscription: subJson })
      setPushStatus('subscribed'); setPushMsg('✓ Push aktiviert!')
      setTimeout(() => setPushMsg(''), 4000)
    } catch(e) {
      setPushStatus('idle'); setPushMsg('Fehler: ' + (e.message || 'Unbekannt'))
    }
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
    } catch(e) {
      setPushStatus('subscribed'); setPushMsg('Fehler beim Deaktivieren.')
    }
  }

  /* ── Notifications save ─────────────────────────── */
  async function saveNotifications() {
    setNotifySaving(true); setNotifyMsg('')
    const { data: updated, error } = await supabase
      .from('agents')
      .update({ notify_sound: notifySound, notify_browser: notifyBrowser })
      .eq('id', agent.id).select().single()
    setNotifySaving(false)
    if (error) { setNotifyMsg('Fehler: ' + error.message); return }
    onAgentUpdate(updated)
    setNotifyMsg('✓ Gespeichert!')
    setTimeout(() => setNotifyMsg(''), 3000)
  }

  async function requestBrowserPerm() {
    const perm = await Notification.requestPermission()
    setBrowserPerm(perm)
    setNotifyBrowser(perm === 'granted')
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
      .insert({ title: newTitle.trim(), content: newContent.trim(), sort_order: maxOrder + 1 })
      .select().single()
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

  /* ── Roles (admin only) ─────────────────────────── */
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

  /* ── Render ──────────────────────────────────────── */
  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="settings-back" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left" /> Zurück
        </button>
        <h1><i className="fas fa-cog" /> Einstellungen</h1>
      </div>

      <div className="settings-body">

        {/* ── Benachrichtigungen ───────────────────── */}
        <div className="settings-card">
          <h2 className="settings-section-title"><i className="fas fa-bell" /> Benachrichtigungen</h2>

          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <strong>Sound</strong>
              <span>Ton wenn neuer Chat eingeht</span>
            </div>
            <div className="settings-toggle-right">
              <button className="preview-btn" onClick={playBeep} title="Vorschau">
                <i className="fas fa-play" />
              </button>
              <label className="toggle-switch">
                <input type="checkbox" checked={notifySound} onChange={e => setNotifySound(e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <strong>Tab-Benachrichtigungen</strong>
              <span>Popup wenn Tab aktiv aber im Hintergrund</span>
            </div>
            <div className="settings-toggle-right">
              {browserPerm === 'denied' && <span className="perm-denied">Blockiert im Browser</span>}
              {browserPerm !== 'granted' && browserPerm !== 'denied' && (
                <button className="btn-secondary-sm" onClick={requestBrowserPerm}>Erlauben</button>
              )}
              {browserPerm === 'granted' && (
                <label className="toggle-switch">
                  <input type="checkbox" checked={notifyBrowser} onChange={e => setNotifyBrowser(e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              )}
            </div>
          </div>

          <div className="settings-save-row" style={{ marginBottom: 20 }}>
            <button className="btn-primary" onClick={saveNotifications} disabled={notifySaving}>
              {notifySaving ? <span className="btn-spinner" /> : <><i className="fas fa-save" /> Speichern</>}
            </button>
            {notifyMsg && <span className={`save-msg ${notifyMsg.startsWith('✓') ? 'ok' : 'err'}`}>{notifyMsg}</span>}
          </div>

          {/* Web Push */}
          <div className="push-section">
            <div className="push-section-header">
              <div>
                <strong><i className="fas fa-mobile-alt" /> Push-Benachrichtigungen</strong>
                <p>Bekomme eine Benachrichtigung egal ob das Dashboard offen ist — auch auf dem Handy.</p>
                {!import.meta.env.VITE_VAPID_PUBLIC_KEY && (
                  <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: 6 }}>
                    <i className="fas fa-exclamation-triangle" /> VAPID-Key fehlt im Build!
                    Gehe zu Netlify → Deploys → "Trigger deploy" → "Deploy site".
                  </p>
                )}
              </div>
              <div>
                {pushStatus === 'subscribed' && <span className="push-badge on"><i className="fas fa-check" /> Aktiv</span>}
                {pushStatus === 'unsupported' && <span className="push-badge off">Nicht unterstützt</span>}
              </div>
            </div>
            {pushStatus === 'unsupported' ? (
              <p className="push-unsupported">Dein Browser unterstützt keine Push-Benachrichtigungen.</p>
            ) : pushStatus === 'subscribed' ? (
              <div className="push-actions">
                <div className="push-active-info">
                  <i className="fas fa-bell" />
                  <span>Push-Benachrichtigungen sind auf diesem Gerät aktiviert.</span>
                </div>
                <button className="btn-secondary-sm" onClick={unsubscribePush} disabled={pushStatus === 'loading'}>
                  <i className="fas fa-bell-slash" /> Deaktivieren
                </button>
              </div>
            ) : (
              <button className="btn-push-activate" onClick={subscribePush} disabled={pushStatus === 'loading'}>
                {pushStatus === 'loading'
                  ? <><span className="btn-spinner" /> Aktiviere…</>
                  : <><i className="fas fa-bell" /> Push-Benachrichtigungen aktivieren</>}
              </button>
            )}
            {pushMsg && <p className={`push-msg ${pushMsg.startsWith('✓') ? 'ok' : ''}`}>{pushMsg}</p>}
          </div>
        </div>

        {/* ── Schnellantworten ─────────────────────── */}
        <div className="settings-card">
          <h2 className="settings-section-title"><i className="fas fa-bolt" /> Schnellantworten</h2>
          <p className="settings-desc">Stehen im Chat-Dashboard für alle Mitarbeiter zur Verfügung.</p>
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
          <div className="qr-add-form">
            <h3>Neue Schnellantwort</h3>
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Titel (z.B. Begrüßung)" className="qr-input" />
            <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Text der Schnellantwort..." className="qr-textarea" rows={3} />
            <button className="btn-primary" onClick={addQuickReply} disabled={!newTitle.trim() || !newContent.trim()}>
              <i className="fas fa-plus" /> Hinzufügen
            </button>
          </div>
        </div>

        {/* ── Rollen verwalten (nur Admin) ─────────── */}
        {agent?.is_admin && (
          <div className="settings-card">
            <h2 className="settings-section-title">
              <i className="fas fa-shield-alt" /> Rollen verwalten
              <span className="admin-only-badge">Admin</span>
            </h2>
            <p className="settings-desc">Erstelle und bearbeite Rollen für dein Team. Rollen können Teammitgliedern in den Kontakten zugewiesen werden.</p>

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
              {roles.length === 0 && <p className="qr-item-content" style={{ color: 'var(--muted)', fontSize: '0.82rem', padding: '8px 0' }}>Noch keine Rollen erstellt.</p>}
            </div>

            <div className="role-add-form">
              <h3>Neue Rolle</h3>
              <div className="role-add-row">
                <input type="text" value={newRoleName} onChange={e => setNewRoleName(e.target.value)}
                  placeholder="Rollenname (z.B. Design, HR…)" className="qr-input" style={{ flex:1 }} />
                <div className="role-preview-chip" style={{ background: newRoleColor + '22', color: newRoleColor, borderColor: newRoleColor + '55' }}>
                  {newRoleName || 'Vorschau'}
                </div>
              </div>
              <div className="color-picker-row">
                {PRESET_COLORS.map(c => (
                  <button key={c} className={`color-dot ${newRoleColor===c?'selected':''}`}
                    style={{ background: c }} onClick={() => setNewRoleColor(c)} />
                ))}
                <input type="color" value={newRoleColor} onChange={e => setNewRoleColor(e.target.value)}
                  className="color-input-custom" title="Eigene Farbe" />
              </div>
              {rolesMsg && <span className={`save-msg ${rolesMsg.startsWith('✓')?'ok':'err'}`}>{rolesMsg}</span>}
              <button className="btn-primary" onClick={addRole} disabled={!newRoleName.trim() || rolesSaving}>
                <i className="fas fa-plus" /> Rolle erstellen
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
