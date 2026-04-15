import { motion } from 'framer-motion'
import { useSEO } from '../lib/seo'

const legalStyle = `
  .legal-body{max-width:760px;margin:0 auto;}
  .legal-date{font-size:.78rem;color:var(--muted);margin-bottom:32px;letter-spacing:.5px;}
  .legal-body h2{font-family:'Rajdhani',sans-serif;font-size:1.1rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:.5px;margin:32px 0 10px;padding-top:24px;border-top:1px solid var(--border);}
  .legal-body h2:first-of-type{margin-top:0;padding-top:0;border-top:none;}
  .legal-body p{color:var(--muted);line-height:1.8;font-size:.9rem;white-space:pre-wrap;}
  .legal-body a{color:var(--primary);}
`

export default function Impressum() {
  useSEO({ title: 'Impressum | TEAM LAZER', description: 'Impressum von TEAM LAZER – Jon Wagner, Scheibenmühlenstr. 20, 01833 Stolpen.' })
  return (
    <div className="page-wrapper">
      <style>{legalStyle}</style>
      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">RECHTLICHES</span>
            <h1>Impressum</h1>
          </motion.div>
        </div>
      </section>
      <section className="section-pad">
        <div className="container">
          <motion.div className="legal-body" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
            <div className="legal-date">Stand: März 2026</div>
            <h2>Angaben gemäß § 5 DDG</h2>
            <p>{`TEAM LAZER\nJon Wagner\nScheibenmühlenstr. 20\n01833 Stolpen\nDeutschland`}</p>
            <h2>Kontakt</h2>
            <p>{`E-Mail: kontakt@team-lazer.de`}</p>
            <h2>Haftungsausschluss</h2>
            <p>Für eigene Inhalte gelten die allgemeinen Gesetze gemäß § 7 Abs. 1 DDG. Für externe Links übernehmen wir keine Haftung – die Verantwortung liegt beim jeweiligen Betreiber. Bei Kenntnis von Rechtsverstößen werden entsprechende Inhalte umgehend entfernt.</p>
            <h2>Urheberrecht</h2>
            <p>Die auf dieser Website veröffentlichten Inhalte unterliegen dem deutschen Urheberrecht. Eine Vervielfältigung oder Verwendung ohne ausdrückliche Genehmigung ist nicht gestattet.</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
