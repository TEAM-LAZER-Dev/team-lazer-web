import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

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
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
    setLoading(false)
  }

  function handleForgotPassword(e) {
    e.preventDefault()
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
            <p>Bitte wende dich an den Administrator, um dein Passwort zurückzusetzen.</p>
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
