import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import InstallPrompt from './components/InstallPrompt'

export default function App() {
  const [session, setSession] = useState(undefined)
  const [agent, setAgent]     = useState(null)
  const [recovery, setRecovery] = useState(false)
  const [newPw, setNewPw]     = useState('')
  const [pwMsg, setPwMsg]     = useState('')

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((e, s) => {
      if (e === 'PASSWORD_RECOVERY') setRecovery(true)
      setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load agent profile whenever session changes
  useEffect(() => {
    if (!session?.user) { setAgent(null); return }
    supabase
      .from('agents')
      .select('*')
      .eq('auth_user_id', session.user.id)
      .single()
      .then(({ data }) => setAgent(data || null))
  }, [session])

  if (session === undefined) return (
    <div className="splash"><div className="splash-spinner" /></div>
  )

  async function savePassword(e) {
    e.preventDefault()
    if (newPw.length < 8) { setPwMsg('Das Passwort muss mindestens 8 Zeichen lang sein.'); return }
    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) { setPwMsg('Speichern fehlgeschlagen. Der Link ist evtl. abgelaufen.'); return }
    setRecovery(false); setNewPw(''); setPwMsg('')
  }

  if (recovery && session) return (
    <div className="login-page">
      <form className="login-card" onSubmit={savePassword}>
        <div className="login-logo"><i className="fas fa-key" /></div>
        <h1 className="login-title">Neues Passwort</h1>
        <p className="login-sub">Lege dein neues Passwort fest</p>
        <div className="login-form">
          <div className="login-field">
            <label>Neues Passwort</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
              placeholder="Mindestens 8 Zeichen" autoFocus required />
          </div>
          {pwMsg && <p className="login-error"><i className="fas fa-exclamation-circle" /> {pwMsg}</p>}
          <button type="submit" className="login-btn"><i className="fas fa-check" /> Speichern</button>
        </div>
      </form>
    </div>
  )

  return (
    <>
      <InstallPrompt />
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
        <Route path="/settings" element={
          session
            ? <Settings agent={agent} onAgentUpdate={setAgent} />
            : <Navigate to="/login" />
        } />
        <Route path="/*" element={
          session
            ? <Dashboard session={session} agent={agent} onAgentUpdate={setAgent} />
            : <Navigate to="/login" />
        } />
      </Routes>
    </>
  )
}
