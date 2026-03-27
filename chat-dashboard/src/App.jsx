import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return (
    <div className="splash"><div className="splash-spinner" /></div>
  )

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
      <Route path="/*"     element={session ? <Dashboard session={session} /> : <Navigate to="/login" />} />
    </Routes>
  )
}
