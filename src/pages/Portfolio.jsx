import { motion } from 'framer-motion'
import '../styles/portfolio.css'
import { useSEO } from '../lib/seo'

/* ── Projektdaten ─────────────────────────────────────────────── */
export const PROJECTS = []

/* ── Hauptseite ───────────────────────────────────────────────── */
export default function Portfolio() {
  useSEO({
    title: 'Portfolio | TEAM LAZER',
    description: 'Abgeschlossene Projekte von TEAM LAZER – Websites, Discord Bots und Automatisierungen.',
  })

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

      {/* ── LEER ── */}
      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div
            className="portfolio-empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <i className="fa-solid fa-folder-open portfolio-empty-icon" />
            <h3>Projekte folgen in Kürze</h3>
            <p>Wir arbeiten gerade an unseren Referenzen. Schau bald wieder vorbei!</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
