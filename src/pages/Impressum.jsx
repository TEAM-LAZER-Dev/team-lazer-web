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
            <p>{`E-Mail: kontakt@team-lazer.de\nKontaktformular: team-lazer.de/kontakt`}</p>
            <h2>Inhaltlich Verantwortlicher gemäß § 18 Abs. 2 MStV</h2>
            <p>{`Jon Wagner\nScheibenmühlenstr. 20\n01833 Stolpen`}</p>
            <h2>Haftung für Inhalte</h2>
            <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
            <h2>Haftung für Links</h2>
            <p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
            <h2>Urheberrecht</h2>
            <p>Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
