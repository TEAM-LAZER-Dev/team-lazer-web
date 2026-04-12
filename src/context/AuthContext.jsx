import { createContext, useContext, useState, useEffect } from 'react'
import { AUTH_CREDENTIALS, MEMBERS } from '../data/members'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('tl_auth')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [error, setError] = useState('')

  function login(username, password) {
    setError('')
    const cred = AUTH_CREDENTIALS[username.toLowerCase()]
    if (!cred || cred.password !== password) {
      setError('Benutzername oder Passwort falsch.')
      return false
    }
    const member = MEMBERS.find(m => m.id === cred.memberId)
    if (!member) {
      setError('Mitglied nicht gefunden.')
      return false
    }
    const session = { id: cred.memberId, name: member.name, role: cred.role, username: username.toLowerCase() }
    localStorage.setItem('tl_auth', JSON.stringify(session))
    setUser(session)
    return true
  }

  function logout() {
    localStorage.removeItem('tl_auth')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
