import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSEO } from '../lib/seo'
import { DOWNLOADS } from '../data/downloads'
import { DownloadCard, pageStyle as dlStyle } from './Downloads'

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0 } } }
const fadeItem = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }

// Infos stammen aus dem GRL-Discord (Regeln, First-Steps, Modi-Erklärungen) – bei Änderungen dort hier nachziehen.
const STEPS = [
  ['Server beitreten', 'Regeln lesen und akzeptieren – dann sind alle Kanäle für dich offen.'],
  ['Ranking beantragen', 'Im Ticket-System einen Ranking-Antrag stellen. Dort reichst du deine Activision ID und deinen Twitch-Link ein.'],
  ['Zum Turnier anmelden', 'Mit Ranking kannst du dich für die Turniere anmelden. Das Ranking sorgt für faire Teams.'],
  ['Spielen & Ergebnis einreichen', 'Nach der Runde reicht dein Team Scoreboard und Placement ein.'],
]

const TURNIERE = [
  ['fa-solid fa-diagram-project', 'Turniersysteme', ['Single Elimination', 'Double Elimination', 'Schweizer System', 'Round Robin']],
  ['fa-solid fa-gamepad', 'Spielmodi', ['TKR (Time Killrace)', 'Killrace', 'Total Of', 'Matchpoint', 'David vs Goliath']],
  ['fa-solid fa-people-group', 'Teamformate', ['Fair Wheel', 'Normal Wheel', 'Regular', 'Draft', 'Draft mit Cap', 'Trio Oddmann Killrace']],
]

const COMMUNITY = [
  ['fa-solid fa-ranking-star', 'Leaderboard', 'Die Rangliste der gerankten Spieler.'],
  ['fa-solid fa-user-group', 'Spielersuche', 'Mitspieler und Teams finden.'],
  ['fa-solid fa-microphone', 'Eigene Voice-Räume', 'Sprachräume per Klick erstellen.'],
  ['fa-solid fa-headset', 'Support per Ticket', 'Bei Fragen, Feedback und Anträgen hilft das Team.'],
]

const GAME = [
  ['fa-solid fa-cube', 'Map Shipment-Mini', 'Kleine Container-Arena mit schnellen Gefechten.'],
  ['fa-solid fa-users', '1v1 bis 6v6', 'Private Lobbys mit Freunden oder Spielsuche.'],
  ['fa-brands fa-discord', 'Discord Activity', 'Läuft direkt im Browser, mitten im Voice-Chat.'],
  ['fa-solid fa-lock', 'Bald mehr', 'Battle Pass, Events und Karriere sind in Planung.'],
]

const pageStyle = `
  .grl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
  .grl-tile { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 24px; height: 100%; transition: .3s; }
  .grl-tile:hover { border-color: rgba(34,211,238,.35); transform: translateY(-4px); }
  .grl-tile > i { font-size: 1.5rem; color: #67e8f9; margin-bottom: 14px; display: block; }
  .grl-tile h3 { font-family: 'Rajdhani', sans-serif; font-size: 1.25rem; font-weight: 800; margin-bottom: 6px; }
  .grl-tile p { font-size: .86rem; color: var(--muted); line-height: 1.7; }
  .grl-tile ul { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
  .grl-tile li { font-size: .86rem; color: rgba(255,255,255,.6); display: flex; align-items: center; gap: 8px; }
  .grl-tile li::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #22d3ee; flex-shrink: 0; }
  .grl-cta { text-align: center; margin-top: 32px; }
  .grl-logos { display: flex; align-items: center; justify-content: center; gap: 22px; margin-bottom: 22px; }
  .grl-logos img { height: 96px; width: auto; object-fit: contain; }
  .grl-logos img:last-child { filter: drop-shadow(0 0 28px rgba(34,211,238,.35)); }
  .grl-logos span { font-family: 'Rajdhani', sans-serif; font-size: 2.2rem; font-weight: 800; color: rgba(255,255,255,.35); }
  .grl-tl-note { display: inline-flex; align-items: center; gap: 10px; margin-top: 22px; padding: 9px 18px; border-radius: 99px; background: var(--surface); border: 1px solid var(--border); font-size: .82rem; color: var(--muted); text-align: left; }
  .grl-tl-note img { width: 20px; height: 20px; object-fit: contain; flex-shrink: 0; }
  .grl-tl-note strong { color: #fff; font-weight: 600; }
  .grl-split { display: grid; grid-template-columns: minmax(280px, 380px) 1fr; gap: 40px; align-items: center; }
  .grl-about h3 { font-family: 'Rajdhani', sans-serif; font-size: 1.7rem; font-weight: 800; margin-bottom: 12px; }
  .grl-about p { font-size: .95rem; color: var(--muted); line-height: 1.8; margin-bottom: 12px; }
  .grl-facts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .grl-facts span { font-size: .78rem; padding: 5px 12px; border-radius: 99px; background: rgba(34,211,238,.08); border: 1px solid rgba(34,211,238,.25); color: #67e8f9; }
  .grl-step-num { font-family: 'Rajdhani', sans-serif; font-size: .8rem; font-weight: 800; letter-spacing: 2px; color: #22d3ee; margin-bottom: 10px; display: block; }
  @media (max-width: 860px) { .grl-split { grid-template-columns: 1fr; gap: 24px; } }
  @media (max-width: 600px) { .grl-grid { grid-template-columns: 1fr; gap: 12px; } .grl-logos img { height: 72px; } }
`

function Tiles({ items }) {
  return (
    <motion.div className="grl-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
      {items.map(([icon, t, s]) => (
        <motion.div key={t} variants={fadeItem} style={{ height: '100%' }}>
          <div className="grl-tile"><i className={icon} /><h3>{t}</h3><p>{s}</p></div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function GRL() {
  useSEO({
    title: 'German Rising League [GRL] | TEAM LAZER',
    description: 'German Rising League: Turnier-Community für Call of Duty mit Ranking, fairen Teams und eigenen Regelwerken.',
  })

  const grlDiscord = DOWNLOADS.find(d => d.id === 'grl-discord')

  return (
    <div className="page-wrapper">
      <style>{dlStyle}</style>
      <style>{pageStyle}</style>

      {/* HERO */}
      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="grl-logos">
              <img src="/images/tl-logo-v2.webp" alt="TEAM LAZER" />
              <span>×</span>
              <img src="/images/grl-logo.webp" alt="German Rising League" />
            </div>
            <span className="section-tag">GERMAN RISING LEAGUE</span>
            <h1>Together we <span className="highlight">rise</span></h1>
            <p>Die German Rising League ist eine Turnier-Community für Call of Duty – mit Ranking, fairen Teams und klaren Regelwerken.</p>
            <div className="grl-tl-note">
              <img src="/images/tl-logo-v2.webp" alt="" />
              <span><strong>TEAM LAZER</strong> hostet die GRL-Bots, stellt die Technik bereit und hilft bei der Verwaltung.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DER SERVER */}
      <section className="section-pad">
        <div className="container">
          <div className="grl-split">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <DownloadCard item={grlDiscord} />
            </motion.div>
            <motion.div className="grl-about" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <motion.div variants={fadeItem}>
              <h3>Der GRL-Discord</h3>
              <p>
                Hier findet die GRL statt: Turnier-Infos, Anmeldungen, Leaderboard und Spielersuche an einem Ort.
                Wer mitspielen will, bekommt zuerst ein Ranking – damit die Teams später möglichst fair zusammengestellt werden können.
              </p>
              <p>Fairplay, Transparenz und gleiche Bedingungen für alle stehen an erster Stelle.</p>
              <div className="grl-facts">
                <span>Über 100 Mitglieder</span>
                <span>Turniere in mehreren Formaten</span>
                <span>Teilnahme ab 18 Jahren</span>
              </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EINSTIEG */}
      <section className="bg-alt section-pad">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">EINSTIEG</span>
            <h2>So kommst du <span className="highlight">rein</span></h2>
            <p>In vier Schritten vom Beitritt zum ersten Turnier.</p>
          </div>
          <motion.div className="grl-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {STEPS.map(([t, s], i) => (
              <motion.div key={t} variants={fadeItem} style={{ height: '100%' }}>
                <div className="grl-tile">
                  <span className="grl-step-num">SCHRITT {i + 1}</span>
                  <h3>{t}</h3>
                  <p>{s}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TURNIERE */}
      <section className="section-pad">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">TURNIERE</span>
            <h2>Systeme, Modi &amp; <span className="highlight">Teams</span></h2>
            <p>Gespielt wird in Public Lobbys und Custom Lobbys. Für Killrace, TKR und Custom-Lobby gibt es jeweils ein eigenes Regelwerk.</p>
          </div>
          <motion.div className="grl-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {TURNIERE.map(([icon, t, list]) => (
              <motion.div key={t} variants={fadeItem} style={{ height: '100%' }}>
                <div className="grl-tile">
                  <i className={icon} />
                  <h3>{t}</h3>
                  <ul>{list.map(x => <li key={x}>{x}</li>)}</ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="bg-alt section-pad">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">COMMUNITY</span>
            <h2>Mehr als <span className="highlight">Turniere</span></h2>
          </div>
          <Tiles items={COMMUNITY} />
          <div className="grl-cta">
            <Link to="/software" className="btn btn-secondary"><i className="fa-solid fa-robot" /> GRL-Bots ansehen</Link>
          </div>
        </div>
      </section>

      {/* SHOOTER */}
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
