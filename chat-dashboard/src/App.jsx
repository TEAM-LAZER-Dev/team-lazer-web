import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'

export default function App() {
  const [session, setSession] = useState(undefined)
  const [agent, setAgent]     = useState(null)

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
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

  return (
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
  )
}
