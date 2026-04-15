import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/images/tl-logo-nobg.webp" alt="TEAM LAZER" />
            <p>Excellence in Gaming<br />& Development.</p>
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
