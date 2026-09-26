import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('tl_cookie_consent')) {
      const t = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = (choice) => {
    localStorage.setItem('tl_cookie_consent', choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={`cookie-banner${visible ? ' visible' : ''}`}>
      <div className="cookie-text">
        Diese Website nutzt nur <strong>technisch notwendige</strong> Speicherfunktionen (kein Tracking, keine Werbung). <Link to="/privacy">Datenschutzerklärung</Link>
      </div>
      <div className="cookie-actions">
        <button className="btn-cookie-accept" onClick={() => dismiss('ok')}>
          Verstanden
        </button>
      </div>
    </div>
  )
}
