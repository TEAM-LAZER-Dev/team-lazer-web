import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/images/tl-logo-v2.webp" alt="TEAM LAZER" />
            <p>Excellence in Gaming<br />& Development.</p>
            <Link to="/grl" className="footer-grl">
              <img src="/images/grl-logo.webp" alt="" />
              <span>Zuhause der <strong>German Rising League</strong></span>
            </Link>
            <div className="footer-social">
              <a href="https://www.instagram.com/team_lazer.de" title="Instagram" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="mailto:kontakt@team-lazer.de" title="E-Mail">
                <i className="fa-solid fa-envelope" />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Entwicklung</h5>
            <Link to="/bots">Discord Bots</Link>
            <Link to="/skills">Über uns</Link>
            <Link to="/contact">Kontakt</Link>
          </div>
          <div className="footer-col">
            <h5>Community</h5>
            <Link to="/members">Team</Link>
            <Link to="/downloads">Downloads</Link>
            <Link to="/grl">German Rising League</Link>
          </div>
          <div className="footer-col">
            <h5>Rechtliches</h5>
            <Link to="/impressum">Impressum</Link>
            <Link to="/privacy">Datenschutz</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 TEAM LAZER · Alle Rechte vorbehalten</span>
          <div className="footer-bottom-links">
            <Link to="/impressum">Impressum</Link>
            <Link to="/privacy">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
