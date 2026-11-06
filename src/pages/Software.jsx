import { motion } from 'framer-motion'
import { useSEO } from '../lib/seo'
import { DownloadsSection } from './Downloads'
import { BotsSection } from './Bots'
import { DOWNLOADS } from '../data/downloads'
import { BOTS } from '../data/bots'

export default function Software() {
  const empty = DOWNLOADS.length === 0 && BOTS.length === 0

  useSEO({
    title: 'Software | TEAM LAZER',
    description: 'Software von TEAM LAZER für die Community: Programme, Tools und Discord-Bots.',
  })

  return (
    <div className="page-wrapper">
      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">SOFTWARE</span>
            <h1><span className="highlight">Software</span></h1>
            <p>Programme, Tools und Discord-Bots von TEAM LAZER – für die Community.</p>
          </motion.div>
        </div>
      </section>

      {empty && (
        <section className="section-pad">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', padding: '48px 32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20 }}
            >
              <i className="fa-solid fa-box-open" style={{ fontSize: '2.4rem', color: 'var(--primary)', marginBottom: 18 }} />
              <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>Noch nichts hier</h2>
              <p style={{ color: 'var(--muted)', fontSize: '.95rem', lineHeight: 1.7 }}>
                Aktuell gibt es noch keine Software für die Community. Sobald es Programme, Tools oder Bots zum Nutzen gibt, findest du sie hier.
              </p>
            </motion.div>
          </div>
        </section>
      )}
      <DownloadsSection />
      <BotsSection />
    </div>
  )
}
