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

      <nav className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        <NavLink to="/" end><i className="fa-solid fa-house" /> Home</NavLink>
        <NavLink to="/about"><i className="fa-solid fa-users" /> Über uns</NavLink>
        <NavLink to="/services"><i className="fa-solid fa-briefcase" /> Leistungen</NavLink>
        <NavLink to="/contact"><i className="fa-solid fa-envelope" /> Kontakt</NavLink>
        <div className="mobile-nav-footer">
          <Link to="/contact" className="btn btn-primary">
            <i className="fa-solid fa-paper-plane" /> Projekt anfragen
          </Link>
        </div>
      </nav>
    </>
  )
}
