import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useSEO } from '../lib/seo'

const pageStyle = `
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: calc(var(--nav-h) + 40px) 16px 60px; }
  .login-card { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 44px 40px; width: 100%; max-width: 420px; }
  .login-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
  .login-logo img { height: 36px; }
  .login-logo span { font-family: 'Rajdhani', sans-serif; font-size: 1.2rem; font-weight: 800; letter-spacing: 1px; color: #fff; }
  .login-title { font-family: 'Rajdhani', sans-serif; font-size: 1.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 6px; }
  .login-sub { font-size: .88rem; color: var(--muted); margin-bottom: 28px; }
  .login-error { background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.25); color: #f87171; border-radius: 10px; padding: 12px 16px; font-size: .85rem; margin-bottom: 18px; display: flex; align-items: center; gap: 10px; }
  .login-divider { text-align: center; font-size: .8rem; color: var(--muted); margin: 20px 0; position: relative; }
  .login-divider::before, .login-divider::after { content: ''; position: absolute; top: 50%; width: calc(50% - 30px); height: 1px; background: var(--border); }
  .login-divider::before { left: 0; }
  .login-divider::after { right: 0; }
  .login-footer { text-align: center; font-size: .82rem; color: var(--muted); margin-top: 22px; }
  .login-footer a { color: var(--primary); }
  .input-icon-wrap { position: relative; }
  .input-icon-wrap i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: .9rem; pointer-events: none; }
  .input-icon-wrap input { padding-left: 38px; }
  @media(max-width:480px){ .login-card { padding: 30px 20px; } }
`

export default function Login() {
  useSEO({ title: 'Login | TEAM LAZER', description: 'Mitglieder-Login für TEAM LAZER.' })
  const { login, error, setError } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })
  const [show, setShow] = useState(false)

  function handleChange(e) {
    setError('')
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 400)) // small delay for UX
    const ok = login(form.username, form.password)
    setLoading(false)
    if (ok) navigate('/dashboard')
  }

  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>
      <div className="login-wrap">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="login-logo">
            <img src="/images/tl-logo-nobg.webp" alt="TEAM LAZER" />
            <span>TEAM LAZER</span>
          </div>

          <h1 className="login-title">Mitglieder-Login</h1>
          <p className="login-sub">Melde dich an, um dein Profil zu verwalten.</p>

          {error && (
            <div className="login-error">
              <i className="fa-solid fa-circle-exclamation" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="lusername">Benutzername</label>
              <div className="input-icon-wrap">
                <i className="fa-solid fa-user" />
                <input
                  id="lusername"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="dein-username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="lpassword">Passwort</label>
              <div className="input-icon-wrap" style={{ position: 'relative' }}>
                <i className="fa-solid fa-lock" />
                <input
                  id="lpassword"
                  name="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>
            <div className="form-submit" style={{ marginTop: '22px' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} disabled={loading}>
                {loading
                  ? <><i className="fa-solid fa-spinner fa-spin" /> Anmelden...</>
                  : <><i className="fa-solid fa-right-to-bracket" /> Anmelden</>
                }
              </button>
            </div>
          </form>

          <p className="login-footer">
            Noch kein Zugang? <Link to="/contact">Kontaktiere uns</Link> – wir richten dir einen ein.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
