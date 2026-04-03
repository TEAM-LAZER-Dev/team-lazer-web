import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/portfolio.css'
import { useSEO } from '../lib/seo'



/* ── Projektdaten ─────────────────────────────────────────────── */
export const PROJECTS = [
  {
    id: 1,
    title: 'Zahnarztpraxis Dr. Berger',
    category: 'website',
    tags: ['HTML', 'CSS', 'JS', 'Responsive'],
    desc: 'Vollständige Praxis-Website mit Leistungsübersicht, Online-Terminbuchung, Teamprofilen und Sprechzeiten.',
    url: '/projects/zahnarztpraxis-berger/',
    color: '#0f766e',
    icon: 'fa-solid fa-tooth',
    status: 'live',
    featured: true,
  },
  {
    id: 2,
    title: 'Goldkruste Bäckerei & Café',
    category: 'website',
    tags: ['HTML', 'CSS', 'JS', 'Responsive'],
    desc: 'Warme, einladende Website für eine Hamburger Traditionsbäckerei – mit Sortiment, Café-Karte und Tagesangeboten.',
    url: '/projects/goldkruste-baeckerei/',
    color: '#d97706',
    icon: 'fa-solid fa-bread-slice',
    status: 'live',
    featured: true,
  },
  {
    id: 3,
    title: 'FitZone Studio',
    category: 'website',
    tags: ['HTML', 'CSS', 'JS', 'Responsive'],
    desc: 'Landing Page für ein Fitnessstudio mit Kursübersicht, Preistabelle, Trainerprofilen und Stundenplan.',
    url: '/projects/fitzone-studio/',
    color: '#10b981',
    icon: 'fa-solid fa-dumbbell',
    status: 'live',
    featured: true,
  },
  {
    id: 4,
    title: 'TEAM LAZER Website',
    category: 'website',
    tags: ['React', 'Vite', 'Supabase', 'Live-Chat'],
    desc: 'Unsere eigene Firmenwebsite – responsive, mit eigenem Live-Chat-System und modernem Dark-Design.',
    url: 'https://team-lazer.de',
    color: '#7c3aed',
    icon: 'fa-solid fa-globe',
    status: 'live',
    featured: false,
  },
  {
    id: 5,
    title: 'ServerGuard',
    category: 'bot',
    tags: ['discord.js', 'Node.js', 'MongoDB'],
    desc: 'Modularer Moderationsbot mit Auto-Mod, Leveling-System, Warn-Logs und vollständigen Slash Commands.',
    url: '/projects/serverguard-bot/',
    color: '#5865f2',
    icon: 'fa-brands fa-discord',
    status: 'live',
    featured: false,
  },
  {
    id: 6,
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
]

const FILTERS = [
  { key: 'all',        label: 'Alle' },
  { key: 'website',   label: 'Websites' },
  { key: 'bot',       label: 'Discord Bots' },
  { key: 'automation', label: 'Automatisierungen' },
]

/* ── Projekt-Karte ────────────────────────────────────────────── */
function ProjectCard({ project }) {
  const [iframeErr, setIframeErr] = useState(false)
  // Only show iframe for our own local project pages (no X-Frame-Options issues)
  const canPreview = project.status === 'live' && project.url?.startsWith('/projects/')

  const handleClick = () => {
    if (project.url) window.open(project.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      className={`pcard${project.status === 'soon' ? ' pcard-soon' : ''}`}
      style={{ '--pc': project.color }}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onClick={handleClick}
    >
      {/* Preview area */}
      <div className="pcard-preview">
        <div className="pcard-browser-bar">
          <span className="pcard-dot" /><span className="pcard-dot" /><span className="pcard-dot" />
          <div className="pcard-fake-url">{project.url ?? 'demnächst.verfügbar'}</div>
        </div>
        <div className="pcard-screen">
          {canPreview && !iframeErr ? (
            <iframe
              src={project.url}
              title={project.title}
              tabIndex="-1"
              aria-hidden="true"
              scrolling="no"
              onError={() => setIframeErr(true)}
            />
          ) : (
            <div className="pcard-icon-wrap">
              <i className={project.icon} />
            </div>
          )}
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

      {project.url && (
        <div className="pcard-hover-cta">
          <i className="fa-solid fa-arrow-up-right-from-square" /> Website öffnen
        </div>
      )}
    </motion.div>
  )
}

/* ── Hauptseite ───────────────────────────────────────────────── */
export default function Portfolio() {
  const [filter, setFilter] = useState('all')

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
                <ProjectCard key={p.id} project={p} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
