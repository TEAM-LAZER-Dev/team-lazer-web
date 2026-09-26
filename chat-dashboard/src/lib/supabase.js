import { createClient } from '@supabase/supabase-js'

// "Angemeldet bleiben": Session in localStorage (dauerhaft) oder sessionStorage (nur bis Tab-Ende)
const REMEMBER_KEY = 'tl_remember_me'
const safe = (fn, fallback = null) => { try { return fn() } catch { return fallback } }
const store = () => (safe(() => localStorage.getItem(REMEMBER_KEY)) === '0' ? sessionStorage : localStorage)

export function setRememberMe(remember) {
  safe(() => localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0'))
}

const storage = {
  getItem: k => safe(() => sessionStorage.getItem(k)) ?? safe(() => localStorage.getItem(k)),
  setItem: (k, v) => {
    const s = store()
    safe(() => s.setItem(k, v))
    safe(() => (s === localStorage ? sessionStorage : localStorage).removeItem(k))
  },
  removeItem: k => { safe(() => sessionStorage.removeItem(k)); safe(() => localStorage.removeItem(k)) },
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { storage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
)
