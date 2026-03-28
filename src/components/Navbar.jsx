import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile nav on route change
  useEffect(() => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }, [location])

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
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
            <NavLink to="/about" className={navLinkClass}>Über uns</NavLink>
            <NavLink to="/services" className={navLinkClass}>Leistungen</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Kontakt</NavLink>
          </nav>
          <div className="nav-actions">
            <Link to="/contact" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-paper-plane" /> Projekt anfragen
            </Link>
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
          <NavLink to="/about" className={navLinkClass}>
            <span className="mnav-num">02</span>
            <span className="mnav-label">Über uns</span>
            <i className="fa-solid fa-arrow-right mnav-arrow" />
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            <span className="mnav-num">03</span>
            <span className="mnav-label">Leistungen</span>
            <i className="fa-solid fa-arrow-right mnav-arrow" />
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            <span className="mnav-num">04</span>
            <span className="mnav-label">Kontakt</span>
            <i className="fa-solid fa-arrow-right mnav-arrow" />
          </NavLink>
        </div>

        <div className="mobile-nav-footer">
          <Link to="/contact" className="btn btn-primary">
            <i className="fa-solid fa-paper-plane" /> Projekt anfragen
          </Link>
          <div className="mnav-social">
            <a href="https://instagram.com/teamlazer" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram" />
            </a>
            <a href="https://linkedin.com/company/teamlazer" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in" />
            </a>
            <a href="mailto:hallo@team-lazer.de" aria-label="E-Mail">
              <i className="fa-solid fa-envelope" />
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}
