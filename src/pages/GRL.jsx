import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSEO } from '../lib/seo'
import { DOWNLOADS } from '../data/downloads'
import { DownloadCard, pageStyle as dlStyle } from './Downloads'

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const fadeItem = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }

const FEATURES = [
  ['fa-solid fa-microphone', 'Temp-Voice', 'Eigene Sprachräume per Klick – automatisch wieder weg.'],
  ['fa-solid fa-ranking-star', 'Ranking', 'Geranked spielen und Rollen verdienen.'],
  ['fa-solid fa-gift', 'Giveaways', 'Regelmäßige Verlosungen für die Community.'],
  ['fa-solid fa-headset', 'Support', 'Hilfe vom Team per Ticket.'],
]

const GAME = [
  ['fa-solid fa-cube', 'Map Shipment-Mini', 'Kleine Container-Arena mit schnellen Gefechten.'],
  ['fa-solid fa-users', '1v1 bis 6v6', 'Private Lobbys mit Freunden oder Spielsuche.'],
  ['fa-brands fa-discord', 'Discord Activity', 'Läuft direkt im Browser, mitten im Voice-Chat.'],
  ['fa-solid fa-lock', 'Bald mehr', 'Battle Pass, Events und Karriere sind in Planung.'],
]

const pageStyle = `
  .grl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
  .grl-grid.two { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
  .grl-tile { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 24px; height: 100%; transition: .3s; }
  .grl-tile:hover { border-color: rgba(34,211,238,.35); transform: translateY(-4px); }
  .grl-tile > i { font-size: 1.5rem; color: #67e8f9; margin-bottom: 14px; display: block; }
  .grl-tile h3 { font-family: 'Rajdhani', sans-serif; font-size: 1.25rem; font-weight: 800; margin-bottom: 6px; }
  .grl-tile p { font-size: .86rem; color: var(--muted); line-height: 1.7; }
  .grl-cta { text-align: center; margin-top: 32px; }
  @media (max-width: 600px) { .grl-grid, .grl-grid.two { grid-template-columns: 1fr; gap: 12px; } }
`

function Tiles({ items }) {
  return (
    <motion.div className="grl-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
      {items.map(([icon, t, s]) => (
        <motion.div key={t} variants={fadeItem}>
          <div className="grl-tile"><i className={icon} /><h3>{t}</h3><p>{s}</p></div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function GRL() {
  useSEO({
    title: 'German Rising League [GRL] | TEAM LAZER',
    description: 'TEAM LAZER × German Rising League: Community, Discord-Bots und der GRL Discord Shooter.',
  })

  return (
    <div className="page-wrapper">
      <style>{dlStyle}</style>
      <style>{pageStyle}</style>

      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">TEAM LAZER × GRL</span>
            <h1>German Rising <span className="highlight">League</span></h1>
            <p>Die GRL-Community, gebaut und betreut von TEAM LAZER – mit eigenen Bots, Ranking und einem Shooter direkt in Discord.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">DISCORDS</span>
            <h2>Zwei Server, <span className="highlight">ein Team</span></h2>
          </div>
          <motion.div className="dl-grid grl-grid two" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {DOWNLOADS.filter(d => d.category === 'discord').map(d => <DownloadCard key={d.id} item={d} />)}
          </motion.div>
        </div>
      </section>

      <section className="bg-alt section-pad">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">COMMUNITY</span>
            <h2>Das erwartet <span className="highlight">dich</span></h2>
          </div>
          <Tiles items={FEATURES} />
          <div className="grl-cta">
            <Link to="/bots" className="btn btn-secondary"><i className="fa-solid fa-robot" /> GRL-Bots ansehen</Link>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">IN ENTWICKLUNG</span>
            <h2>GRL <span className="highlight">Discord Shooter</span></h2>
            <p>Ein Browser-Multiplayer-Shooter im Stil von Call of Duty – gebaut mit Babylon.js und Nakama.</p>
          </div>
          <Tiles items={GAME} />
        </div>
      </section>
    </div>
  )
}
