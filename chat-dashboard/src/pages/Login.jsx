import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, setRememberMe } from '../lib/supabase'

function translateError(err) {
  const m = (err?.message || '').toLowerCase()
  if (m.includes('invalid login')) return 'E-Mail oder Passwort ist falsch.'
  if (m.includes('email not confirmed')) return 'Diese E-Mail-Adresse wurde noch nicht bestätigt.'
  if (m.includes('rate limit') || m.includes('too many')) return 'Zu viele Versuche. Bitte warte kurz und versuche es erneut.'
  if (m.includes('network') || m.includes('fetch')) return 'Keine Verbindung. Bitte prüfe dein Internet.'
  return 'Aktion fehlgeschlagen. Bitte versuche es erneut.'
}

export default function Login() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setRememberMe(rememberMe)
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (err) setError(translateError(err))
    setLoading(false)
  }

  async function handleForgotPassword(e) {
    e.preventDefault()
    if (!email.trim()) { setError('Bitte gib zuerst oben deine E-Mail-Adresse ein.'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin,
    })
    setLoading(false)
    if (err) { setError(translateError(err)); return }
    setForgotSent(true)
  }

  return (
    <div className="login-page">
      <motion.div className="login-card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}>

        <div className="login-logo">
          <i className="fas fa-bolt" />
        </div>
        <h1 className="login-title">TEAM LAZER</h1>
        <p className="login-sub">Chat Dashboard — Team Login</p>

        {forgotSent ? (
          <motion.div className="login-forgot-msg"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <i className="fas fa-info-circle" />
            <p>Wir haben dir einen Link zum Zurücksetzen an <strong>{email}</strong> geschickt. Prüfe auch deinen Spam-Ordner.</p>
            <button className="login-link-btn" onClick={() => setForgotSent(false)}>
              Zurück zum Login
            </button>
          </motion.div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label>E-Mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="deine@email.de" required autoFocus />
            </div>
            <div className="login-field">
              <label>Passwort</label>
              <div className="login-pw-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required />
                <button type="button" className="login-pw-toggle"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}>
                  <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`} />
                </button>
              </div>
            </div>

            <div className="login-options-row">
              <label className="login-remember">
                <input type="checkbox" checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)} />
                <span>Angemeldet bleiben</span>
              </label>
              <button type="button" className="login-link-btn"
                onClick={handleForgotPassword}>
                Passwort vergessen?
              </button>
            </div>

            {error && <p className="login-error"><i className="fas fa-exclamation-circle" /> {error}</p>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : <><i className="fas fa-sign-in-alt" /> Einloggen</>}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}
