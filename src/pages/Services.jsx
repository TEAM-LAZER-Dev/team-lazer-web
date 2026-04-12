import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSEO } from '../lib/seo'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
  viewport: { once: true, margin: '-60px' },
})
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const staggerItem = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }

const pageStyle = `
  .skills-section{padding:60px 0 80px;}
  .cat-header{display:flex;align-items:center;gap:16px;margin-bottom:28px;padding-bottom:16px;border-bottom:1px solid var(--border);}
  .cat-icon{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
  .cat-icon.ci-blue{background:rgba(37,99,235,.15);color:#60a5fa;border:1px solid rgba(37,99,235,.25);}
  .cat-icon.ci-purple{background:rgba(124,58,237,.15);color:#a78bfa;border:1px solid rgba(124,58,237,.25);}
  .cat-icon.ci-green{background:rgba(16,185,129,.15);color:#34d399;border:1px solid rgba(16,185,129,.25);}
  .cat-title h2{font-family:'Rajdhani',sans-serif;font-size:1.6rem;font-weight:800;text-transform:uppercase;margin-bottom:2px;}
  .cat-title p{font-size:.85rem;color:var(--muted);}
  .skill-cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
  .skill-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px 24px;display:flex;flex-direction:column;gap:12px;transition:.3s;}
  .skill-card:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12);transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.35);}
  .skill-card h3{font-family:'Rajdhani',sans-serif;font-size:1.15rem;font-weight:700;color:#fff;margin:0;}
  .skill-card p{font-size:.86rem;color:var(--muted);line-height:1.65;flex:1;}
  .skill-features{display:flex;flex-direction:column;gap:6px;}
  .skill-features li{font-size:.82rem;color:rgba(255,255,255,.45);display:flex;align-items:center;gap:8px;}
  .skill-features li i{font-size:.7rem;color:var(--primary);}
  .tech-bar{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:56px;}
  .tech-item{display:flex;align-items:center;gap:8px;padding:10px 18px;background:var(--surface);border:1px solid var(--border);border-radius:10px;font-size:.82rem;font-weight:500;color:rgba(255,255,255,.55);}
  .tech-item i{color:var(--primary);font-size:.85rem;}
  @media(max-width:900px){.skill-cards-grid{grid-template-columns:1fr;gap:12px;}}
  @media(max-width:600px){.cat-header{flex-direction:column;align-items:flex-start;gap:10px;}.tech-bar{display:none;}}
`

function SkillCard({ title, desc, features }) {
  return (
    <motion.div className="skill-card" variants={staggerItem} whileHover={{ y: -4 }}>
      <h3>{title}</h3>
      <p>{desc}</p>
      <ul className="skill-features">
        {features.map(f => <li key={f}><i className="fa-solid fa-check" />{f}</li>)}
      </ul>
    </motion.div>
  )
}

const CATEGORIES = [
  {
    icon: 'fa-solid fa-globe', cls: 'ci-blue', title: 'Websites & Web-Apps',
    sub: 'Responsiv, selbst entwickelt – kein Baukastensystem',
    cards: [
      { title: 'Landing Page', desc: 'Eine einzelne, fokussierte Seite für ein Produkt, Event oder Projekt. Klar und modern.', features: ['1 Seite, vollständig responsiv', 'Kontaktformular', 'Individuelles Design'] },
      { title: 'Mehrseitige Website', desc: 'Mehrere Unterseiten mit gemeinsamer Navigation – z. B. Startseite, Über-uns, Kontakt.', features: ['Mehrere Seiten', 'Einheitliches Design', 'Eigene Struktur'] },
      { title: 'Web-App / Custom', desc: 'Portfolio, Community-Site, interaktives Tool oder eine individuelle Idee – ich setze es um.', features: ['React / Vite', 'API-Anbindung möglich', 'Animationen & Interaktion'] },
    ],
  },
  {
    icon: 'fa-brands fa-discord', cls: 'ci-purple', title: 'Discord Bots',
    sub: 'Von simplen Utility-Bots bis zu komplexen Systemen',
    cards: [
      { title: 'Utility Bot', desc: 'Grundlegende Funktionen: eigene Slash Commands, Willkommensnachrichten, Rollen-Verwaltung.', features: ['Slash Commands', 'Basis-Funktionen', 'Einfache Konfiguration'] },
      { title: 'Komplexes System', desc: 'Leveling, Ticket-System, Moderation, Musik oder alles kombiniert – mit eigener Datenbank.', features: ['Datenbank (SQLite / PostgreSQL)', 'Leveling & Tickets', 'Moderation & Logs'] },
      { title: 'Bot-Erweiterung', desc: 'Bereits einen Bot? Ich schaue mir den Code an und füge neue Funktionen hinzu oder fixe Bugs.', features: ['Code-Analyse', 'Feature-Erweiterung', 'Bug-Behebung'] },
    ],
  },
  {
    icon: 'fa-solid fa-gears', cls: 'ci-green', title: 'Skripte & Automatisierungen',
    sub: 'Python und JavaScript für nützliche kleine Tools',
    cards: [
      { title: 'API & Webhooks', desc: 'Verbindungen zwischen Diensten, automatische Benachrichtigungen oder Datenübertragungen.', features: ['Webhook-Integration', 'API-Anbindung', 'Python / Node.js'] },
      { title: 'Utility-Skript', desc: 'Datenverarbeitung, Scheduler, Scraper oder ein eigenes Automatisierungstool für den Alltag.', features: ['Python oder JavaScript', 'Vollständiger Code', 'Nach eigener Idee'] },
    ],
  },
]

export default function Skills() {
  useSEO({
    title: 'Skills | TEAM LAZER',
    description: 'Was ich kann – Websites, Discord Bots und Automatisierungen als Hobby-Entwickler.',
  })
  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>

      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">WHAT I DO</span>
            <h1>Skills</h1>
            <p>Was ich als Hobby entwickle – Websites, Discord Bots und kleine Automatisierungen. Alles selbst beigebracht, alles aus Leidenschaft.</p>
          </motion.div>
        </div>
      </section>

      {CATEGORIES.map(({ icon, cls, title, sub, cards }) => (
        <section key={title} className="skills-section" style={{ padding: '60px 0' }}>
          <div className="container">
            <motion.div className="cat-header" {...fadeUp()}>
              <div className={`cat-icon ${cls}`}><i className={icon} /></div>
              <div className="cat-title"><h2>{title}</h2><p>{sub}</p></div>
            </motion.div>
            <motion.div className="skill-cards-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>
              {cards.map((card) => <SkillCard key={card.title} {...card} />)}
            </motion.div>
          </div>
        </section>
      ))}

      {/* Tech bar */}
      <section className="section-pad">
        <div className="container">
          <motion.div className="tech-bar" {...fadeUp()}>
            {[
              ['fa-brands fa-html5', 'HTML5'],
              ['fa-brands fa-css3-alt', 'CSS3'],
              ['fa-brands fa-js', 'JavaScript'],
              ['fa-brands fa-react', 'React'],
              ['fa-brands fa-python', 'Python'],
              ['fa-brands fa-discord', 'discord.js'],
              ['fa-solid fa-database', 'SQLite / PostgreSQL'],
              ['fa-brands fa-git-alt', 'Git'],
            ].map(([icon, label]) => (
              <div key={label} className="tech-item"><i className={icon} /> {label}</div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
