import { motion } from 'framer-motion'

const legalStyle = `
  .legal-body{max-width:760px;margin:0 auto;}
  .legal-date{font-size:.78rem;color:var(--muted);margin-bottom:32px;letter-spacing:.5px;}
  .legal-body h2{font-family:'Rajdhani',sans-serif;font-size:1.1rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:.5px;margin:32px 0 10px;padding-top:24px;border-top:1px solid var(--border);}
  .legal-body h2:first-of-type{margin-top:0;padding-top:0;border-top:none;}
  .legal-body p{color:var(--muted);line-height:1.8;font-size:.9rem;margin-bottom:10px;}
  .legal-body a{color:var(--primary);}
`

export default function Privacy() {
  return (
    <div className="page-wrapper">
      <style>{legalStyle}</style>
      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">RECHTLICHES</span>
            <h1>Datenschutz</h1>
          </motion.div>
        </div>
      </section>
      <section className="section-pad">
        <div className="container">
          <motion.div className="legal-body" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
            <div className="legal-date">Stand: März 2026</div>
            <h2>1. Datenschutz auf einen Blick</h2>
            <p>Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten auf der Website team-lazer.de. Verantwortlicher ist Jon Wagner, TEAM LAZER, Scheibenmühlenstr. 20, 01833 Stolpen.</p>
            <h2>2. Hosting</h2>
            <p>Diese Website wird bei Netlify Inc. gehostet. Beim Aufruf der Website werden automatisch Verbindungsdaten (IP-Adresse, Browser, Betriebssystem, Referrer-URL, Datum und Uhrzeit) in Server-Logfiles gespeichert. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.</p>
            <h2>3. Kontaktformular</h2>
            <p>Wenn Sie uns über das Kontaktformular eine Anfrage zukommen lassen, werden Ihre Angaben zur Bearbeitung der Anfrage und für eventuelle Anschlussfragen gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Zur Übermittlung nutzen wir den Dienst FormSubmit (formsubmit.co). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.</p>
            <h2>4. Live-Chat</h2>
            <p>Unsere Website bietet einen Live-Chat zur direkten Kommunikation. Die Chat-Nachrichten werden über Supabase (Supabase Inc., USA) in Echtzeit verarbeitet und gespeichert. Dabei werden keine personenbezogenen Daten erhoben, es sei denn, Sie geben diese freiwillig im Chat an. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an effizienter Kundenkommunikation).</p>
            <h2>5. Cookies</h2>
            <p>Diese Website verwendet ausschließlich technisch notwendige Cookies, die für den Betrieb der Website erforderlich sind. Es werden keine Analyse- oder Tracking-Cookies eingesetzt.</p>
            <h2>6. Ihre Rechte</h2>
            <p>Sie haben das Recht auf Auskunft über Ihre gespeicherten personenbezogenen Daten, auf Berichtigung, Löschung und Einschränkung der Verarbeitung sowie das Recht auf Datenübertragbarkeit. Zur Geltendmachung Ihrer Rechte wenden Sie sich an: <a href="mailto:kontakt@team-lazer.de">kontakt@team-lazer.de</a></p>
            <h2>7. Beschwerderecht</h2>
            <p>Sie haben das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren. Zuständig ist der Sächsische Datenschutzbeauftragte.</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
