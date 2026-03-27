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

export default function Settings({ agent, onAgentUpdate }) {
  const navigate = useNavigate()

  /* ── Profile state ───────────────────────────── */
  const [name, setName]           = useState(agent?.name || '')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(agent?.avatar_url || null)
  const [saving, setSaving]       = useState(false)
  const [saveMsg, setSaveMsg]     = useState('')

  /* ── Notification state ──────────────────────── */
  const [notifySound, setNotifySound]     = useState(agent?.notify_sound ?? true)
  const [notifyBrowser, setNotifyBrowser] = useState(agent?.notify_browser ?? true)
  const [browserPerm, setBrowserPerm]     = useState(Notification?.permission || 'default')

  /* ── Quick replies state ─────────────────────── */
  const [quickReplies, setQuickReplies] = useState([])
  const [newTitle, setNewTitle]   = useState('')
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    loadQuickReplies()
  }, [])

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

    // Upload avatar if new file selected
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
      avatarUrl = urlData.publicUrl + '?t=' + Date.now() // cache bust
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

          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <strong>Browser-Benachrichtigungen</strong>
              <span>Popup auch wenn Tab im Hintergrund</span>
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

          <div className="settings-info-box">
            <i className="fas fa-paper-plane" />
            <div>
              <strong>Telegram-Benachrichtigungen</strong>
              <p>Wird über einen Netlify-Webhook gesendet. Einrichten in den Netlify Environment Variables: <code>TELEGRAM_BOT_TOKEN</code> und <code>TELEGRAM_CHAT_ID</code>. Dann Supabase Database Webhook auf <code>/api/notify-telegram</code> zeigen lassen. Siehe <code>CHAT_SETUP.md</code>.</p>
            </div>
          </div>

          <div className="settings-save-row">
            <button className="btn-primary" onClick={saveProfile} disabled={saving}>
              {saving ? <span className="btn-spinner" /> : <><i className="fas fa-save" /> Speichern</>}
            </button>
            {saveMsg && <span className={`save-msg ${saveMsg.startsWith('✓') ? 'ok' : 'err'}`}>{saveMsg}</span>}
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

          {/* New quick reply form */}
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
