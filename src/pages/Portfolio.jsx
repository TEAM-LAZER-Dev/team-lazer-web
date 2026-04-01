import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/portfolio.css'
import { useSEO } from '../lib/seo'

/* ── Projektdaten ─────────────────────────────────────────────── */
export const PROJECTS = [
  {
    id: 1,
    title: 'TEAM LAZER Website',
    category: 'website',
    tags: ['React', 'Vite', 'Supabase', 'Live-Chat'],
    desc: 'Unsere eigene Firmenwebsite – responsive, mit eigenem Live-Chat-System und modernem Dark-Design.',
    url: 'https://team-lazer.de',
    color: '#7c3aed',
    icon: 'fa-solid fa-globe',
    status: 'live',
    featured: true,
  },
  {
    id: 2,
    title: 'ServerGuard',
    category: 'bot',
    tags: ['discord.js', 'Node.js', 'MongoDB'],
    desc: 'Modularer Moderationsbot mit Auto-Mod, Leveling-System, Warn-Logs und vollständigen Slash Commands.',
    url: '/projects/serverguard-bot/',
    color: '#5865f2',
    icon: 'fa-brands fa-discord',
    status: 'live',
    featured: true,
  },
  {
    id: 3,
    title: 'FitZone Studio',
    category: 'website',
    tags: ['HTML', 'CSS', 'JS', 'Responsive'],
    desc: 'Landing Page für ein Fitnessstudio mit Kursübersicht, Buchungssystem, Trainerprofilen und Stundenplan.',
    url: '/projects/fitzone-studio/',
    color: '#10b981',
    icon: 'fa-solid fa-dumbbell',
    status: 'live',
    featured: true,
  },
  {
    id: 4,
    title: 'AutoFlow',
    category: 'automation',
    tags: ['Python', 'Webhooks', 'REST API'],
    desc: 'Automatisierungssystem zur Verarbeitung von Bestelldaten aus mehreren Plattformen in einer Pipeline.',
    url: null,
    color: '#f59e0b',
    icon: 'fa-solid fa-gears',
    status: 'soon',
    featured: false,
  },
  {
    id: 5,
    title: 'CryptoWatch',
    category: 'bot',
    tags: ['discord.js', 'CoinGecko API', 'Cron'],
    desc: 'Discord Bot, der Kursänderungen bei Kryptowährungen überwacht und automatisch Alerts postet.',
    url: null,
    color: '#f59e0b',
    icon: 'fa-solid fa-chart-line',
    status: 'soon',
    featured: false,
  },
  {
    id: 6,
    title: 'NovaTech Agency',
    category: 'website',
    tags: ['HTML', 'CSS', 'JS', 'CMS'],
    desc: 'Moderne Agenturwebsite mit animierten Sektionen, Projekt-Showcase und Kontaktformular.',
    url: '/projects/novatech-agency/',
    color: '#2563eb',
    icon: 'fa-solid fa-laptop-code',
    status: 'live',
    featured: false,
  },
]

const FILTERS = [
  { key: 'all',        label: 'Alle' },
  { key: 'website',   label: 'Websites' },
  { key: 'bot',       label: 'Discord Bots' },
  { key: 'automation', label: 'Automatisierungen' },
]

/* ── Browser-Chrome Modal ─────────────────────────────────────── */
function ProjectModal({ project, onClose }) {
  const [iframeError, setIframeError] = useState(false)

  return (
    <motion.div
      className="pm-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="pm-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Browser chrome */}
        <div className="pm-chrome">
          <div className="pm-dots">
            <button className="pm-dot pm-dot-red" onClick={onClose} aria-label="Schließen" />
            <span className="pm-dot pm-dot-yellow" />
            <span className="pm-dot pm-dot-green" />
          </div>
          <div className="pm-urlbar">
            <i className="fa-solid fa-lock" />
            <span>{project.url ?? 'Demnächst verfügbar'}</span>
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pm-external"
              title="In neuem Tab öffnen"
            >
              <i className="fa-solid fa-arrow-up-right-from-square" />
            </a>
          )}
        </div>

        {/* Viewport */}
        <div className="pm-viewport">
          {project.status === 'live' && project.url && !iframeError ? (
            <iframe
              src={project.url}
              title={project.title}
              onError={() => setIframeError(true)}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : (
            <div className="pm-soon-screen" style={{ '--pc': project.color }}>
              <div className="pm-soon-icon">
                <i className={project.icon} />
              </div>
              <h3>{project.title}</h3>
              <p>
                {project.status === 'soon'
                  ? 'Dieses Projekt ist noch in Entwicklung und wird bald hier zu sehen sein.'
                  : 'Vorschau konnte nicht geladen werden.'}
              </p>
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <i className="fa-solid fa-arrow-up-right-from-square" /> Direkt öffnen
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pm-footer">
          <div className="pm-footer-info">
            <span className="pm-footer-title">{project.title}</span>
            <div className="pm-footer-tags">
              {project.tags.map(t => <span key={t} className="ptag">{t}</span>)}
            </div>
          </div>
          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-arrow-up-right-from-square" /> Zur Website
            </a>
          ) : (
            <span className="pm-badge-soon">Demnächst</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Projekt-Karte ────────────────────────────────────────────── */
function ProjectCard({ project, onClick }) {
  return (
    <motion.div
      className={`pcard${project.status === 'soon' ? ' pcard-soon' : ''}`}
      style={{ '--pc': project.color }}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onClick={onClick}
    >
      {/* Preview area */}
      <div className="pcard-preview">
        <div className="pcard-browser-bar">
          <span className="pcard-dot" /><span className="pcard-dot" /><span className="pcard-dot" />
          <div className="pcard-fake-url">{project.url ?? 'demnächst.verfügbar'}</div>
        </div>
        <div className="pcard-screen">
          <div className="pcard-icon-wrap">
            <i className={project.icon} />
          </div>
          {project.status === 'soon' && (
            <div className="pcard-soon-badge">Demnächst</div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="pcard-body">
        <div className="pcard-meta">
          <span className="pcard-cat">
            {project.category === 'website' && 'Website'}
            {project.category === 'bot' && 'Discord Bot'}
            {project.category === 'automation' && 'Automatisierung'}
          </span>
          {project.status === 'live' && <span className="pcard-live"><span className="pcard-live-dot" />Live</span>}
        </div>
        <h3 className="pcard-title">{project.title}</h3>
        <p className="pcard-desc">{project.desc}</p>
        <div className="pcard-tags">
          {project.tags.map(t => <span key={t} className="ptag">{t}</span>)}
        </div>
      </div>

      <div className="pcard-hover-cta">
        <i className="fa-solid fa-eye" /> {project.status === 'live' ? 'Ansehen' : 'Details'}
      </div>
    </motion.div>
  )
}

/* ── Hauptseite ───────────────────────────────────────────────── */
export default function Portfolio() {
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null)

  useSEO({
    title: 'Portfolio | TEAM LAZER',
    description: 'Abgeschlossene Projekte von TEAM LAZER – Websites, Discord Bots und Automatisierungen.',
  })

  const visible = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filter)

  return (
    <div className="page-wrapper">
      {/* ── HERO ── */}
      <section className="small-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <span className="section-tag">PORTFOLIO</span>
            <h1>Unsere <span className="highlight">Referenzen</span></h1>
            <p>Abgeschlossene Projekte – Websites, Discord Bots und Automatisierungen aus einer Hand.</p>
          </motion.div>
        </div>
      </section>

      {/* ── FILTER ── */}
      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="pfilter">
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`pfilter-btn${filter === f.key ? ' active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span className="pfilter-count">
                  {f.key === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.category === f.key).length}
                </span>
              </button>
            ))}
          </div>

          <motion.div className="pgrid" layout>
            <AnimatePresence mode="popLayout">
              {visible.map(p => (
                <ProjectCard key={p.id} project={p} onClick={() => setActive(p)} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  )
}
