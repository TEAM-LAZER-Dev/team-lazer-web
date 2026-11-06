import { motion } from 'framer-motion'
import { useSEO } from '../lib/seo'
import { DownloadsSection } from './Downloads'
import { BotsSection } from './Bots'

export default function Software() {
  useSEO({
    title: 'Software | TEAM LAZER',
    description: 'Die Discord-Bots von TEAM LAZER und der German Rising League.',
  })

  return (
    <div className="page-wrapper">
      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">SOFTWARE</span>
            <h1><span className="highlight">Software</span></h1>
            <p>Unsere Discord-Bots – handgemacht von TEAM LAZER.</p>
          </motion.div>
        </div>
      </section>

      <DownloadsSection />
      <BotsSection />
    </div>
  )
}
