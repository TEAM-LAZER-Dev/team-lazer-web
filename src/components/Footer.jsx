import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/images/tl-logo-nobg.webp" alt="TEAM LAZER" />
            <p>Websites · Discord Bots · Automatisierung.<br />Entwickelt in Deutschland.</p>
            <div className="footer-social">
              <a href="https://discord.gg/dCxU6KqWFz" title="Discord" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-discord" />
              </a>
              <a href="https://www.tiktok.com/@team.lazer.de" title="TikTok" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-tiktok" />
              </a>
              <a href="https://www.instagram.com/team_lazer.de" title="Instagram" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-instagram" />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Leistungen</h5>
            <Link to="/services">Alle Leistungen</Link>
            <Link to="/services">Website Entwicklung</Link>
            <Link to="/services">Discord Bots</Link>
            <Link to="/services">Automation</Link>
          </div>
          <div className="footer-col">
            <h5>Unternehmen</h5>
            <Link to="/about">Über uns</Link>
            <Link to="/contact">Kontakt</Link>
          </div>
          <div className="footer-col">
            <h5>Rechtliches</h5>
            <Link to="/impressum">Impressum</Link>
            <Link to="/agb">AGB</Link>
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
