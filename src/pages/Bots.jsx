import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSEO } from '../lib/seo'
import { BOTS } from '../data/bots'

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } }
const fadeItem = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }

const STATUS_MAP = {
  online: { label: 'Online', color: '#4ade80', dot: '#22c55e' },
  beta: { label: 'Beta', color: '#f59e0b', dot: '#d97706' },
  maintenance: { label: 'Wartung', color: '#94a3b8', dot: '#64748b' },
}

const pageStyle = `
  .bots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
  .bot-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; transition: .3s; display: flex; flex-direction: column; }
  .bot-card:hover { border-color: rgba(255,255,255,.12); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,.3); }
  .bot-card-header { padding: 24px 24px 20px; display: flex; align-items: flex-start; gap: 16px; }
  .bot-icon { width: 60px; height: 60px; border-radius: 16px; background: rgba(255,255,255,.06); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; flex-shrink: 0; overflow: hidden; }
  .bot-icon img { width: 100%; height: 100%; object-fit: cover; border-radius: 14px; }
  .bot-meta { flex: 1; min-width: 0; }
  .bot-name-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
  .bot-name { font-family: 'Rajdhani', sans-serif; font-size: 1.2rem; font-weight: 800; color: #fff; }
  .bot-status-badge { display: flex; align-items: center; gap: 5px; font-size: .7rem; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; padding: 2px 8px; border-radius: 6px; }
  .bot-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .bot-short-desc { font-size: .83rem; color: var(--muted); }
  .bot-tags { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 24px 16px; }
  .bot-tag { font-size: .74rem; font-weight: 500; padding: 3px 10px; border-radius: 6px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); color: rgba(255,255,255,.5); }
  .bot-desc { padding: 0 24px 20px; font-size: .86rem; color: rgba(255,255,255,.5); line-height: 1.7; }
  .bot-stats-bar { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .bot-stat { padding: 14px 8px; text-align: center; position: relative; }
  .bot-stat:not(:last-child)::after { content:''; position: absolute; right: 0; top: 20%; height: 60%; width: 1px; background: var(--border); }
  .bot-stat-val { display: block; font-family: 'Rajdhani', sans-serif; font-size: 1.2rem; font-weight: 800; color: #fff; line-height: 1; }
  .bot-stat-label { display: block; font-size: .7rem; color: var(--muted); margin-top: 3px; }
  .bot-actions { padding: 18px 24px; display: flex; gap: 10px; flex-wrap: wrap; margin-top: auto; }
  .bot-actions .btn { flex: 1; min-width: 120px; justify-content: center; padding: 10px 16px; font-size: .85rem; }
  .bots-hero-strip { display: flex; gap: 32px; flex-wrap: wrap; margin-top: 20px; }
  .bhs-item { display: flex; flex-direction: column; gap: 2px; }
  .bhs-num { font-family: 'Rajdhani', sans-serif; font-size: 2rem; font-weight: 800; color: #fff; line-height: 1; }
  .bhs-num span { color: var(--primary); }
  .bhs-label { font-size: .78rem; color: var(--muted); }
  .bot-dev { display: flex; align-items: center; gap: 6px; padding: 0 24px 14px; font-size: .78rem; color: var(--muted); }
  .bot-dev i { color: var(--primary); font-size: .8rem; }
  @media(max-width:600px){ .bots-grid { grid-template-columns: 1fr; } .bot-stats-bar { grid-template-columns: repeat(2,1fr); } .bot-stat:nth-child(2)::after { display: none; } .bot-stat:nth-child(3)::after { display: none; } }
`

function BotCard({ bot }) {
  const statusInfo = STATUS_MAP[bot.status] || STATUS_MAP.online
  return (
    <motion.div className="bot-card" variants={fadeItem}>
      <div className="bot-card-header">
        <div className="bot-icon" style={{ borderColor: `${bot.color}33` }}>
          {bot.icon
            ? <img src={bot.icon} alt={bot.name} />
            : <i className="fa-brands fa-discord" style={{ color: bot.color }} />
          }
        </div>
        <div className="bot-meta">
          <div className="bot-name-row">
            <span className="bot-name">{bot.name}</span>
            <span className="bot-status-badge" style={{ background: `${statusInfo.dot}18`, color: statusInfo.color }}>
              <span className="bot-status-dot" style={{ background: statusInfo.dot }} />
              {statusInfo.label}
            </span>
          </div>
          <div className="bot-short-desc">{bot.shortDesc}</div>
        </div>
      </div>

      <div className="bot-tags">
        {bot.tags.map(t => <span key={t} className="bot-tag">{t}</span>)}
      </div>

      <p className="bot-desc">{bot.description}</p>

      <div className="bot-stats-bar">
        <div className="bot-stat">
          <span className="bot-stat-val" style={{ color: bot.color }}>{bot.stats.servers}</span>
          <span className="bot-stat-label">Server</span>
        </div>
        <div className="bot-stat">
          <span className="bot-stat-val">{bot.stats.commands}</span>
          <span className="bot-stat-label">Commands</span>
        </div>
        <div className="bot-stat">
          <span className="bot-stat-val">{bot.stats.uptime}</span>
          <span className="bot-stat-label">Uptime</span>
        </div>
        <div className="bot-stat">
          <span className="bot-stat-val">{bot.stats.version}</span>
          <span className="bot-stat-label">Version</span>
        </div>
      </div>

      <div className="bot-dev">
        <i className="fa-solid fa-code" />
        Entwickelt von <strong style={{ color: 'rgba(255,255,255,.7)', marginLeft: '4px' }}>{bot.developer}</strong>
      </div>

      <div className="bot-actions">
        <a
          href={bot.inviteUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
          style={{ background: bot.status === 'maintenance' ? 'rgba(255,255,255,.06)' : undefined, pointerEvents: bot.status === 'maintenance' ? 'none' : undefined }}
        >
          <i className="fa-solid fa-plus" /> Bot einladen
        </a>
        {bot.hasDashboard && bot.dashboardUrl && (
          <a href={bot.dashboardUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
            <i className="fa-solid fa-gauge-high" /> Dashboard
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default function Bots() {
  useSEO({
    title: 'Discord Bots | TEAM LAZER',
    description: 'Alle Discord Bots von TEAM LAZER – einladen, Statistiken einsehen und Dashboards nutzen.',
  })

  const totalServers = BOTS.reduce((s, b) => s + b.stats.servers, 0)
  const totalCommands = BOTS.reduce((s, b) => s + b.stats.commands, 0)

  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>

      {/* HERO */}
      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">DISCORD BOTS</span>
            <h1>Unsere Bots</h1>
            <p>Handgemachte Discord Bots von TEAM LAZER – lade sie auf deinen Server ein oder nutze die Dashboards.</p>
            <div className="bots-hero-strip">
              <div className="bhs-item"><span className="bhs-num"><span>{BOTS.length}</span></span><span className="bhs-label">Bots</span></div>
              <div className="bhs-item"><span className="bhs-num"><span>{totalServers}</span></span><span className="bhs-label">Server gesamt</span></div>
              <div className="bhs-item"><span className="bhs-num"><span>{totalCommands}</span></span><span className="bhs-label">Slash Commands</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BOT GRID */}
      <section className="section-pad">
        <div className="container">
          <motion.div className="bots-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {BOTS.map(bot => <BotCard key={bot.id} bot={bot} />)}
          </motion.div>
        </div>
      </section>

      {/* INFO BANNER */}
      <section className="bg-alt section-pad">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px 32px' }}
          >
            <i className="fa-brands fa-discord" style={{ fontSize: '2.5rem', color: '#5865F2' }} />
            <div>
              <strong style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '5px' }}>Bot einladen – wie funktioniert das?</strong>
              <span style={{ fontSize: '.86rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                Klick auf "Bot einladen" – du wirst zu Discord weitergeleitet. Wähle deinen Server aus und bestätige die Berechtigungen. Der Bot ist dann sofort einsatzbereit. Bei Fragen oder Problemen schreib uns einfach.
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
