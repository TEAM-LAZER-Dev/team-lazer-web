import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
    setLoading(false)
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
        <h1 className="login-title">Team Lazer</h1>
        <p className="login-sub">Chat Dashboard — Team Login</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label>E-Mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="deine@email.de" required autoFocus />
          </div>
          <div className="login-field">
            <label>Passwort</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required />
          </div>
          {error && <p className="login-error"><i className="fas fa-exclamation-circle" /> {error}</p>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : <><i className="fas fa-sign-in-alt" /> Einloggen</>}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
