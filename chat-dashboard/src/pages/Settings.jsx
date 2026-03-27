import { useState, useEffect, useRef } from 'react'
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

export default function Settings({ agent, onAgentUpdate }) {
  const navigate = useNavigate()

  /* ── Profile state ───────────────────────────── */
  const [name, setName]                     = useState(agent?.name || '')
  const [avatarFile, setAvatarFile]         = useState(null)
  const [avatarPreview, setAvatarPreview]   = useState(agent?.avatar_url || null)
  const [saving, setSaving]                 = useState(false)
  const [saveMsg, setSaveMsg]               = useState('')

  /* ── Notification state ──────────────────────── */
  const [notifySound, setNotifySound]       = useState(agent?.notify_sound ?? true)
  const [notifyBrowser, setNotifyBrowser]   = useState(agent?.notify_browser ?? true)
  const [browserPerm, setBrowserPerm]       = useState(Notification?.permission || 'default')

  /* ── Web Push state ──────────────────────────── */
  const [pushStatus, setPushStatus]         = useState('idle') // idle | loading | subscribed | unsupported
  const [pushMsg, setPushMsg]               = useState('')

  /* ── Quick replies state ─────────────────────── */
  const [quickReplies, setQuickReplies]     = useState([])
  const [newTitle, setNewTitle]             = useState('')
  const [newContent, setNewContent]         = useState('')
  const [editingId, setEditingId]           = useState(null)
  const [editTitle, setEditTitle]           = useState('')
  const [editContent, setEditContent]       = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    loadQuickReplies()
    checkPushStatus()
  }, []) // eslint-disable-line

  /* ── Check if already subscribed ─────────────── */
  async function checkPushStatus() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPushStatus('unsupported')
      return
    }
    // Check if agent already has a subscription saved
    if (agent?.push_subscription) {
      setPushStatus('subscribed')
    } else {
      setPushStatus('idle')
    }
  }

  /* ── Subscribe to Web Push ───────────────────── */
  async function subscribePush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPushMsg('Dein Browser unterstützt keine Push-Benachrichtigungen.')
      return
    }

    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
    if (!vapidKey) {
      setPushMsg('VITE_VAPID_PUBLIC_KEY nicht gesetzt. Siehe Setup-Anleitung.')
      return
    }

    setPushStatus('loading')
    setPushMsg('')

    try {
      // Request notification permission
      const perm = await Notification.requestPermission()
      setBrowserPerm(perm)
      if (perm !== 'granted') {
        setPushStatus('idle')
        setPushMsg('Benachrichtigungen wurden nicht erlaubt.')
        return
      }

      // Register / get SW
      const reg = await navigator.serviceWorker.ready

      // Subscribe
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      })

      // Save to Supabase
      const subJson = sub.toJSON()
      const { error } = await supabase
        .from('agents')
        .update({ push_subscription: subJson })
        .eq('id', agent.id)

      if (error) throw error

      onAgentUpdate({ ...agent, push_subscription: subJson })
      setPushStatus('subscribed')
      setPushMsg('✓ Push-Benachrichtigungen aktiviert!')
      setTimeout(() => setPushMsg(''), 4000)

    } catch(e) {
      console.error('Push subscribe error:', e)
      setPushStatus('idle')
      setPushMsg('Fehler: ' + (e.message || 'Unbekannt'))
    }
  }

  /* ── Unsubscribe from Web Push ───────────────── */
  async function unsubscribePush() {
    setPushStatus('loading')
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) await sub.unsubscribe()

      await supabase
        .from('agents')
        .update({ push_subscription: null })
        .eq('id', agent.id)

      onAgentUpdate({ ...agent, push_subscription: null })
      setPushStatus('idle')
      setPushMsg('Push-Benachrichtigungen deaktiviert.')
      setTimeout(() => setPushMsg(''), 3000)
    } catch(e) {
      setPushStatus('subscribed')
      setPushMsg('Fehler beim Deaktivieren.')
    }
  }

  async function loadQuickReplies() {
    const { data } = await supabase
      .from('quick_replies').select('*').order('sort_order')
    setQuickReplies(data || [])
  }

  /* ── Avatar select ───────────────────────────── */
  function handleAvatarSelect(e) {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  /* ── Save profile ────────────────────────────── */
  async function saveProfile() {
    if (!agent) return
    setSaving(true)
    setSaveMsg('')

    let avatarUrl = agent.avatar_url

    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${agent.id}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type })

      if (upErr) {
        setSaveMsg('Fehler beim Hochladen: ' + upErr.message)
        setSaving(false)
        return
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      avatarUrl = urlData.publicUrl + '?t=' + Date.now()
    }

    const { data: updated, error } = await supabase
      .from('agents')
      .update({ name, avatar_url: avatarUrl, notify_sound: notifySound, notify_browser: notifyBrowser })
      .eq('id', agent.id)
      .select()
      .single()

    if (error) {
      setSaveMsg('Fehler: ' + error.message)
    } else {
      setSaveMsg('✓ Gespeichert!')
      onAgentUpdate(updated)
      setTimeout(() => setSaveMsg(''), 3000)
    }
    setSaving(false)
  }

  /* ── Browser notification permission ────────── */
  async function requestBrowserPerm() {
    const perm = await Notification.requestPermission()
    setBrowserPerm(perm)
    setNotifyBrowser(perm === 'granted')
  }

  /* ── Quick replies CRUD ──────────────────────── */
  async function addQuickReply() {
    if (!newTitle.trim() || !newContent.trim()) return
    const maxOrder = quickReplies.reduce((m, r) => Math.max(m, r.sort_order), 0)
    const { data } = await supabase
      .from('quick_replies')
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
    const { data } = await supabase
      .from('quick_replies')
      .update({ title: editTitle, content: editContent })
      .eq('id', id).select().single()
    if (data) setQuickReplies(prev => prev.map(r => r.id === id ? data : r))
    setEditingId(null)
  }

  function startEdit(r) {
    setEditingId(r.id)
    setEditTitle(r.title)
    setEditContent(r.content)
  }

  /* ── Render ──────────────────────────────────── */
  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="settings-back" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left" /> Zurück
        </button>
        <h1><i className="fas fa-cog" /> Einstellungen</h1>
      </div>

      <div className="settings-body">

        {/* ── Profil ──────────────────────────── */}
        <div className="settings-card">
          <h2 className="settings-section-title"><i className="fas fa-user" /> Profil</h2>

          <div className="avatar-upload-row">
            <div className="avatar-upload-preview" onClick={() => fileRef.current?.click()}>
              {avatarPreview
                ? <img src={avatarPreview} alt="Avatar" />
                : <div className="avatar-placeholder-lg">{(name[0] || '?').toUpperCase()}</div>
              }
              <div className="avatar-upload-overlay"><i className="fas fa-camera" /></div>
            </div>
            <div className="avatar-upload-info">
              <p>Profilbild</p>
              <span>Wird im Chat-Widget beim User angezeigt</span>
              <button className="btn-secondary-sm" onClick={() => fileRef.current?.click()}>
                <i className="fas fa-upload" /> Bild wählen
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={handleAvatarSelect} />
          </div>

          <div className="settings-field">
            <label>Anzeigename</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Dein Name" />
          </div>

          <div className="settings-save-row">
            <button className="btn-primary" onClick={saveProfile} disabled={saving}>
              {saving ? <span className="btn-spinner" /> : <><i className="fas fa-save" /> Speichern</>}
            </button>
            {saveMsg && <span className={`save-msg ${saveMsg.startsWith('✓') ? 'ok' : 'err'}`}>{saveMsg}</span>}
          </div>
        </div>

        {/* ── Benachrichtigungen ───────────────── */}
        <div className="settings-card">
          <h2 className="settings-section-title"><i className="fas fa-bell" /> Benachrichtigungen</h2>

          {/* Sound */}
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
                <input type="checkbox" checked={notifySound}
                  onChange={e => setNotifySound(e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {/* Browser notifications (in-tab) */}
          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <strong>Tab-Benachrichtigungen</strong>
              <span>Popup wenn Tab aktiv aber im Hintergrund</span>
            </div>
            <div className="settings-toggle-right">
              {browserPerm === 'denied' && (
                <span className="perm-denied">Blockiert im Browser</span>
              )}
              {browserPerm !== 'granted' && browserPerm !== 'denied' && (
                <button className="btn-secondary-sm" onClick={requestBrowserPerm}>
                  Erlauben
                </button>
              )}
              {browserPerm === 'granted' && (
                <label className="toggle-switch">
                  <input type="checkbox" checked={notifyBrowser}
                    onChange={e => setNotifyBrowser(e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              )}
            </div>
          </div>

          <div className="settings-save-row" style={{ marginBottom: '20px' }}>
            <button className="btn-primary" onClick={saveProfile} disabled={saving}>
              {saving ? <span className="btn-spinner" /> : <><i className="fas fa-save" /> Speichern</>}
            </button>
            {saveMsg && <span className={`save-msg ${saveMsg.startsWith('✓') ? 'ok' : 'err'}`}>{saveMsg}</span>}
          </div>

          {/* ── Web Push ───────────────────────── */}
          <div className="push-section">
            <div className="push-section-header">
              <div>
                <strong><i className="fas fa-mobile-alt" /> Push-Benachrichtigungen</strong>
                <p>Bekomme eine Benachrichtigung egal ob das Dashboard offen ist —
                  auch auf dem Handy. Klick öffnet direkt den Chat.</p>
              </div>
              <div className="push-status-badge">
                {pushStatus === 'subscribed'
                  ? <span className="push-badge on"><i className="fas fa-check" /> Aktiv</span>
                  : pushStatus === 'unsupported'
                  ? <span className="push-badge off">Nicht unterstützt</span>
                  : null
                }
              </div>
            </div>

            {pushStatus === 'unsupported' ? (
              <p className="push-unsupported">Dein Browser unterstützt leider keine Push-Benachrichtigungen.</p>
            ) : pushStatus === 'subscribed' ? (
              <div className="push-actions">
                <div className="push-active-info">
                  <i className="fas fa-bell" />
                  <span>Push-Benachrichtigungen sind auf diesem Gerät aktiviert.</span>
                </div>
                <button className="btn-secondary-sm" onClick={unsubscribePush}
                  disabled={pushStatus === 'loading'}>
                  <i className="fas fa-bell-slash" /> Deaktivieren
                </button>
              </div>
            ) : (
              <button className="btn-push-activate" onClick={subscribePush}
                disabled={pushStatus === 'loading'}>
                {pushStatus === 'loading'
                  ? <><span className="btn-spinner" /> Aktiviere…</>
                  : <><i className="fas fa-bell" /> Push-Benachrichtigungen aktivieren</>
                }
              </button>
            )}

            {pushMsg && (
              <p className={`push-msg ${pushMsg.startsWith('✓') ? 'ok' : ''}`}>{pushMsg}</p>
            )}

            <div className="settings-info-box" style={{ marginTop: '14px', marginBottom: 0 }}>
              <i className="fas fa-info-circle" />
              <div>
                <strong>Setup erforderlich</strong>
                <p>
                  Einmalig VAPID-Keys generieren und als Netlify Env Vars setzen:<br />
                  <code>VAPID_PUBLIC_KEY</code>, <code>VAPID_PRIVATE_KEY</code>, <code>VAPID_EMAIL</code>, <code>DASHBOARD_URL</code><br />
                  Außerdem <code>VITE_VAPID_PUBLIC_KEY</code> für den Build.<br />
                  Dann Supabase Webhook auf <code>/api/notify-push</code> zeigen lassen.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Schnellantworten ─────────────────── */}
        <div className="settings-card">
          <h2 className="settings-section-title"><i className="fas fa-bolt" /> Schnellantworten</h2>
          <p className="settings-desc">Stehen im Chat-Dashboard für alle Mitarbeiter zur Verfügung.</p>

          <div className="qr-list">
            <AnimatePresence initial={false}>
              {quickReplies.map(r => (
                <motion.div key={r.id} className="qr-item"
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }} layout>
                  {editingId === r.id ? (
                    <div className="qr-edit-form">
                      <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                        placeholder="Titel" className="qr-input-sm" />
                      <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                        placeholder="Inhalt" className="qr-textarea" rows={3} />
                      <div className="qr-edit-actions">
                        <button className="btn-primary-sm" onClick={() => saveEdit(r.id)}>
                          <i className="fas fa-check" /> Speichern
                        </button>
                        <button className="btn-ghost-sm" onClick={() => setEditingId(null)}>
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="qr-item-content">
                        <strong>{r.title}</strong>
                        <p>{r.content}</p>
                      </div>
                      <div className="qr-item-actions">
                        <button onClick={() => startEdit(r)} title="Bearbeiten">
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
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
              placeholder="Titel (z.B. Begrüßung)" className="qr-input" />
            <textarea value={newContent} onChange={e => setNewContent(e.target.value)}
              placeholder="Text der Schnellantwort..." className="qr-textarea" rows={3} />
            <button className="btn-primary" onClick={addQuickReply}
              disabled={!newTitle.trim() || !newContent.trim()}>
              <i className="fas fa-plus" /> Hinzufügen
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
