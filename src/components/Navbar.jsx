import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile nav on route change
  useEffect(() => {
    setMenuOpen(false)
    document.body.style.overflow = ''
    document.body.classList.remove('nav-open')
  }, [location])

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
    document.body.classList.toggle('nav-open', next)
  }

  const navLinkClass = ({ isActive }) => isActive ? 'active' : ''

  return (
    <>
      <header className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
        <div className="container nav-container">
          <Link className="nav-logo" to="/">
            <img src="/images/tl-logo-nobg.webp" alt="TEAM LAZER" />
            TEAM LAZER
          </Link>
          <nav className="nav-links">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>
            <NavLink to="/members" className={navLinkClass}>Mitglieder</NavLink>
            <NavLink to="/bots" className={navLinkClass}>Bots</NavLink>
            <NavLink to="/skills" className={navLinkClass}>Skills</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Kontakt</NavLink>
          </nav>
          <div className="nav-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-sm">
                <i className="fa-solid fa-gauge-high" /> Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn btn-secondary btn-sm">
                <i className="fa-solid fa-right-to-bracket" /> Login
              </Link>
            )}
            <button
              className={`burger${menuOpen ? ' open' : ''}`}
              onClick={toggleMenu}
              aria-label="Menü"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Dimmed backdrop */}
      <div
        className={`mobile-nav-backdrop${menuOpen ? ' open' : ''}`}
        onClick={toggleMenu}
        aria-hidden="true"
      />

      {/* Full-screen slide-in nav */}
      <nav className={`mobile-nav${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-nav-head">
          <Link className="nav-logo" to="/">
            <img src="/images/tl-logo-nobg.webp" alt="TEAM LAZER" />
            TEAM LAZER
          </Link>
          <button className="mobile-nav-close" onClick={toggleMenu} aria-label="Schließen">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="mobile-nav-body">
          <NavLink to="/" end className={navLinkClass}>
            <span className="mnav-num">01</span>
            <span className="mnav-label">Home</span>
            <i className="fa-solid fa-arrow-right mnav-arrow" />
          </NavLink>
          <NavLink to="/members" className={navLinkClass}>
            <span className="mnav-num">02</span>
            <span className="mnav-label">Mitglieder</span>
            <i className="fa-solid fa-arrow-right mnav-arrow" />
          </NavLink>
          <NavLink to="/bots" className={navLinkClass}>
            <span className="mnav-num">03</span>
            <span className="mnav-label">Bots</span>
            <i className="fa-solid fa-arrow-right mnav-arrow" />
          </NavLink>
          <NavLink to="/skills" className={navLinkClass}>
            <span className="mnav-num">04</span>
            <span className="mnav-label">Skills</span>
            <i className="fa-solid fa-arrow-right mnav-arrow" />
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            <span className="mnav-num">05</span>
            <span className="mnav-label">Über uns</span>
            <i className="fa-solid fa-arrow-right mnav-arrow" />
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            <span className="mnav-num">06</span>
            <span className="mnav-label">Kontakt</span>
            <i className="fa-solid fa-arrow-right mnav-arrow" />
          </NavLink>
        </div>

        <div className="mobile-nav-footer">
          {user ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/dashboard" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <i className="fa-solid fa-gauge-high" /> Dashboard
              </Link>
              <button
                onClick={logout}
                style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171', cursor: 'pointer', fontSize: '.84rem' }}
              >
                <i className="fa-solid fa-right-from-bracket" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              <i className="fa-solid fa-right-to-bracket" /> Mitglieder-Login
            </Link>
          )}
          <div className="mnav-social">
            <a href="https://www.instagram.com/team_lazer.de" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram" />
            </a>
            <a href="mailto:kontakt@team-lazer.de" aria-label="E-Mail">
              <i className="fa-solid fa-envelope" />
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}
