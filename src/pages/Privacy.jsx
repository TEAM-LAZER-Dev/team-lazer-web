import { motion } from 'framer-motion'
import { useSEO } from '../lib/seo'

const legalStyle = `
  .legal-body{max-width:760px;margin:0 auto;}
  .legal-date{font-size:.78rem;color:var(--muted);margin-bottom:32px;letter-spacing:.5px;}
  .legal-body h2{font-family:'Rajdhani',sans-serif;font-size:1.1rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:.5px;margin:32px 0 10px;padding-top:24px;border-top:1px solid var(--border);}
  .legal-body h2:first-of-type{margin-top:0;padding-top:0;border-top:none;}
  .legal-body p{color:var(--muted);line-height:1.8;font-size:.9rem;margin-bottom:10px;}
  .legal-body a{color:var(--primary);}
`

export default function Privacy() {
  useSEO({ title: 'Datenschutz | TEAM LAZER', description: 'Datenschutzerklärung von TEAM LAZER – Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.' })
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

            <h2>1. Verantwortlicher</h2>
            <p>{`Verantwortlicher im Sinne der DSGVO:\n\nJon Wagner\nTEAM LAZER\nScheibenmühlenstr. 20\n01833 Stolpen\nDeutschland\n\nE-Mail: kontakt@team-lazer.de`}</p>

            <h2>2. Allgemeines zur Datenverarbeitung</h2>
            <p>Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Personenbezogene Daten werden gelöscht, sobald der Zweck der Speicherung entfällt und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>

            <h2>3. Hosting</h2>
            <p>Diese Website wird bei Netlify Inc. (44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA) gehostet. Beim Aufruf der Website werden automatisch Verbindungsdaten (IP-Adresse, Browser-Typ und -Version, Betriebssystem, Referrer-URL, Datum und Uhrzeit des Zugriffs) in Server-Logfiles gespeichert. Diese Daten sind technisch erforderlich und werden nicht mit anderen Datenquellen zusammengeführt. Die Speicherung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Die Logfiles werden nach 30 Tagen automatisch gelöscht. Die Datenübertragung in die USA erfolgt auf Basis des EU-US Data Privacy Framework.</p>

            <h2>4. SSL-/TLS-Verschlüsselung</h2>
            <p>Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.</p>

            <h2>5. Kontaktformular</h2>
            <p>Wenn Sie uns über das Kontaktformular eine Anfrage zukommen lassen, werden Ihre Angaben (Name, E-Mail-Adresse, Nachricht, gewähltes Thema) zur Bearbeitung der Anfrage und für eventuelle Rückfragen gespeichert. Diese Daten geben wir nicht weiter. Zur Übermittlung nutzen wir den Dienst FormSubmit (formsubmit.co, Spring Monkey LLC, USA). Da TEAM LAZER ein nicht-kommerzielles Hobby-Projekt ist, erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen). Ihre Daten werden nach abgeschlossener Bearbeitung gelöscht.</p>

            <h2>6. Live-Chat</h2>
            <p>Unsere Website bietet einen Live-Chat zur direkten Kommunikation. Die Chat-Nachrichten werden über Supabase (Supabase Inc., 970 Toa Payoh North #07-04, Singapore 318992) in Echtzeit verarbeitet und gespeichert. Dabei werden keine personenbezogenen Daten automatisch erhoben, es sei denn, Sie geben diese freiwillig im Chat an. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO. Die Datenübertragung in Drittländer erfolgt auf Basis von Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO). Chat-Verläufe werden nach 90 Tagen automatisch gelöscht.</p>

            <h2>7. Cookies und lokale Speicherung</h2>

            <p>Diese Website verwendet ausschließlich technisch notwendige Cookies bzw. lokale Speichereinträge (localStorage), die für den Betrieb der Website erforderlich sind. Es werden keine Analyse-, Tracking- oder Marketing-Cookies eingesetzt. Die Rechtsgrundlage für die Verwendung technisch notwendiger Cookies ist Art. 6 Abs. 1 lit. f DSGVO.</p>

            <h2>8. Ihre Rechte</h2>
            <p>Sie haben gegenüber dem Verantwortlichen folgende Rechte hinsichtlich Ihrer personenbezogenen Daten: Recht auf Auskunft (Art. 15 DSGVO), Recht auf Berichtigung (Art. 16 DSGVO), Recht auf Löschung (Art. 17 DSGVO), Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO), Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO) sowie das Recht auf Datenübertragbarkeit (Art. 20 DSGVO). Zur Geltendmachung Ihrer Rechte wenden Sie sich an: <a href="mailto:kontakt@team-lazer.de">kontakt@team-lazer.de</a></p>

            <h2>9. Beschwerderecht bei einer Aufsichtsbehörde</h2>
            <p>{`Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt.\n\nZuständige Aufsichtsbehörde:\nSächsischer Datenschutz- und Transparenzbeauftragter\nDevrientstraße 5\n01067 Dresden\nhttps://www.saechsdsb.de`}</p>

            <h2>10. Aktualität und Änderung dieser Datenschutzerklärung</h2>
            <p>Diese Datenschutzerklärung ist aktuell gültig und hat den Stand März 2026. Durch die Weiterentwicklung unserer Website oder aufgrund geänderter gesetzlicher bzw. behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung anzupassen.</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
