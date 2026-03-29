import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
  viewport: { once: true, margin: '-60px' },
})
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const staggerItem = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }

const pageStyle = `
  .leistungen-section{padding:60px 0 80px;}
  .leistungen-section+.leistungen-section{padding-top:0;}
  .cat-header{display:flex;align-items:center;gap:16px;margin-bottom:28px;padding-bottom:16px;border-bottom:1px solid var(--border);}
  .cat-icon{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
  .cat-icon.ci-blue{background:rgba(37,99,235,.15);color:#60a5fa;border:1px solid rgba(37,99,235,.25);}
  .cat-icon.ci-purple{background:rgba(124,58,237,.15);color:#a78bfa;border:1px solid rgba(124,58,237,.25);}
  .cat-icon.ci-green{background:rgba(16,185,129,.15);color:#34d399;border:1px solid rgba(16,185,129,.25);}
  .cat-title h2{font-family:'Rajdhani',sans-serif;font-size:1.6rem;font-weight:800;text-transform:uppercase;margin-bottom:2px;}
  .cat-title p{font-size:.85rem;color:var(--muted);}
  .pkg-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
  .pkg-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px 24px;display:flex;flex-direction:column;gap:12px;transition:.3s;}
  .pkg-card:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12);transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.35);}
  .pkg-card h3{font-family:'Rajdhani',sans-serif;font-size:1.15rem;font-weight:700;color:#fff;margin:0;}
  .pkg-card p{font-size:.86rem;color:var(--muted);line-height:1.65;flex:1;}
  .pkg-features{display:flex;flex-direction:column;gap:6px;}
  .pkg-features li{font-size:.82rem;color:rgba(255,255,255,.45);display:flex;align-items:center;gap:8px;}
  .pkg-features li i{font-size:.7rem;color:var(--primary);}
  .pkg-footer{display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(255,255,255,.05);margin-top:4px;}
  .pkg-price-block{display:flex;flex-direction:column;gap:1px;}
  .pkg-price-from{font-size:.68rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;}
  .pkg-price{font-family:'Rajdhani',sans-serif;font-size:1.2rem;font-weight:800;color:var(--primary);line-height:1.1;}
  .pkg-footer .btn{font-size:.78rem;padding:7px 16px;border-radius:8px;}
  .trust-bar{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:56px;}
  .trust-item{display:flex;align-items:center;gap:8px;padding:10px 18px;background:var(--surface);border:1px solid var(--border);border-radius:10px;font-size:.82rem;font-weight:500;color:rgba(255,255,255,.55);}
  .trust-item i{color:var(--primary);font-size:.85rem;}
  @media(max-width:900px){.pkg-grid{grid-template-columns:1fr;gap:12px;}}
  @media(max-width:600px){.cat-header{flex-direction:column;align-items:flex-start;gap:10px;}.trust-bar{display:none;}}
`

function PkgCard({ title, desc, features, slug, price }) {
  return (
    <motion.div className="pkg-card" variants={staggerItem} whileHover={{ y: -4 }}>
      <h3>{title}</h3>
      <p>{desc}</p>
      <ul className="pkg-features">
        {features.map(f => <li key={f}><i className="fa-solid fa-check" />{f}</li>)}
      </ul>
      <div className="pkg-footer">
        <div className="pkg-price-block">
          <span className="pkg-price-from">schon ab</span>
          <span className="pkg-price">{price}</span>
        </div>
        <Link to={`/contact?projekt=${slug}`} className="btn btn-primary">Anfragen</Link>
      </div>
    </motion.div>
  )
}

const CATEGORIES = [
  {
    icon: 'fa-solid fa-globe', cls: 'ci-blue', title: 'Website Entwicklung',
    sub: 'Responsiv, schnell, ohne Baukastensystem – Hosting auf Wunsch möglich',
    alt: false,
    cards: [
      { title: 'Landing Page', desc: 'Eine starke Einzelseite für Produkte, Events oder Dienstleistungen. Klar, überzeugend, conversion-optimiert.', features: ['1 Seite, vollständig responsiv', 'Kontaktformular', 'Lieferung in 3–5 Tagen'], slug: 'landing-page', price: '149 €' },
      { title: 'Business Website', desc: 'Mehrseiter für Unternehmen, Freelancer oder Dienstleister. Mit Über-uns, Leistungen, Kontakt und mehr.', features: ['3–6 Seiten, individuelles Design', 'Kontaktformular + SEO-Basis', 'Lieferung in 7–14 Tagen'], slug: 'business-website', price: '349 €' },
      { title: 'Custom Projekt', desc: 'Portfolio, Community-Site, Event-Seite oder alles andere – wir entwickeln nach Briefing genau was du brauchst.', features: ['Individuell nach Absprache', 'API-Integration möglich', 'Zeitplan nach Projektgröße'], slug: 'custom-website', price: 'Anfrage' },
    ],
  },
  {
    icon: 'fa-brands fa-discord', cls: 'ci-purple', title: 'Discord Bots',
    sub: 'Von simplen Utility-Bots bis zu komplexen Systemen mit Datenbank', alt: false,
    cards: [
      { title: 'Basic Bot', desc: 'Einfacher Bot mit Custom Commands, Slash Commands und grundlegenden Funktionen – ideal als Einstieg.', features: ['Slash Commands', 'Custom Commands', 'Lieferung in 2–4 Tagen'], slug: 'discord-basic', price: '79 €' },
      { title: 'Advanced Bot', desc: 'Komplexe Systeme: Leveling, Ticket-System, Moderations-Bot, Musik oder alles kombiniert – mit Datenbank.', features: ['Datenbank (PostgreSQL/SQLite)', 'Leveling, Tickets, Moderation', 'Hosting auf Wunsch'], slug: 'discord-advanced', price: '199 €' },
      { title: 'Bot Anpassung', desc: 'Du hast bereits einen Bot und willst Funktionen hinzufügen, Bugs fixen oder etwas umbauen? Kein Problem.', features: ['Analyse deines bestehenden Codes', 'Erweiterung nach Absprache', 'Stundenbasiert'], slug: 'discord-anpassung', price: '25 €/h' },
    ],
  },
  {
    icon: 'fa-solid fa-gears', cls: 'ci-green', title: 'Automation & Skripte',
    sub: 'Webhooks, APIs und Skripte – repetitive Aufgaben automatisiert', alt: false,
    cards: [
      { title: 'Webhook & API', desc: 'Automatische Benachrichtigungen, Datenübertragungen zwischen Diensten oder externe API-Anbindungen.', features: ['Webhook-Integration', 'API-Anbindung', 'Python / Node.js'], slug: 'webhook-api', price: '99 €' },
      { title: 'Custom Skript', desc: 'Datenverarbeitung, Scheduler, Scraper oder ein ganz eigenes Automatisierungstool.', features: ['Python oder JavaScript', 'Vollständiger Source-Code', 'Zeitplan nach Absprache'], slug: 'custom-skript', price: '79 €' },
    ],
  },
]

export default function Services() {
  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>

      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">AUF ANFRAGE</span>
            <h1>Leistungen</h1>
            <p>Websites, Discord Bots und Automatisierungen – individuelle Angebote nach Briefing. Hosting und Domains werden separat und transparent aufgeführt.</p>
          </motion.div>
        </div>
      </section>

      {CATEGORIES.map(({ icon, cls, title, sub, alt, cards }) => (
        <section key={title} className={`leistungen-section${alt ? ' bg-alt' : ''}`} style={{ padding: '60px 0' }}>
          <div className="container">
            <motion.div className="cat-header" {...fadeUp()}>
              <div className={`cat-icon ${cls}`}><i className={icon} /></div>
              <div className="cat-title"><h2>{title}</h2><p>{sub}</p></div>
            </motion.div>
            <motion.div className="pkg-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>
              {cards.map((card, i) => <PkgCard key={card.title} {...card} delay={i * 0.1} />)}
            </motion.div>
          </div>
        </section>
      ))}

      {/* Trust bar */}
      <section className="section-pad">
        <div className="container">
          <motion.div className="trust-bar" {...fadeUp()}>
            {[['fa-solid fa-file-code', 'Source-Code Übergabe'], ['fa-solid fa-shield-halved', '14 Tage Bugfix-Garantie'], ['fa-solid fa-receipt', 'Individuelle Angebote'], ['fa-solid fa-server', 'Hosting auf Wunsch'], ['fa-solid fa-clock', '24h Reaktionszeit']].map(([icon, label]) => (
              <div key={label} className="trust-item"><i className={icon} /> {label}</div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
