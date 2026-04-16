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
            <div className="legal-date">Stand: April 2026</div>

            <h2>1. Verantwortlicher</h2>
            <p>{`Verantwortlicher im Sinne der DSGVO:\n\nJon Wagner\nTEAM LAZER\nScheibenmühlenstr. 20\n01833 Stolpen\nDeutschland\n\nE-Mail: kontakt@team-lazer.de`}</p>

            <h2>2. Allgemeines zur Datenverarbeitung</h2>
            <p>TEAM LAZER ist ein nicht-kommerzielles Hobby-Projekt. Wir verarbeiten personenbezogene Daten grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website erforderlich ist. Personenbezogene Daten werden gelöscht, sobald der Zweck der Speicherung entfällt.</p>

            <h2>3. Hosting</h2>
            <p>Diese Website wird bei Netlify Inc. (44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA) gehostet. Beim Aufruf werden automatisch Verbindungsdaten (IP-Adresse, Browser-Typ, Betriebssystem, Referrer-URL, Datum und Uhrzeit) in Server-Logfiles gespeichert. Diese Daten sind technisch erforderlich und werden nicht mit anderen Datenquellen zusammengeführt. Die Speicherung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Die Logfiles werden nach 30 Tagen automatisch gelöscht. Die Datenübertragung in die USA erfolgt auf Basis des EU-US Data Privacy Framework (DPF).</p>

            <h2>4. Externe Dienste und CDNs</h2>
            <p>Diese Website nutzt Google Fonts (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) zur Darstellung von Schriftarten. Beim Seitenaufruf wird eine Verbindung zu Google-Servern hergestellt, wobei Ihre IP-Adresse an Google übermittelt wird. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Datenschutzerklärung</a>.</p>
            <p>Zusätzlich wird Font Awesome über das Cloudflare-CDN (Cloudflare Inc., 101 Townsend St, San Francisco, CA 94107, USA) geladen. Dabei wird Ihre IP-Adresse an Cloudflare übermittelt. Die Datenübertragung in die USA erfolgt auf Basis des EU-US Data Privacy Framework (DPF). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.</p>

            <h2>5. SSL-/TLS-Verschlüsselung</h2>
            <p>Diese Website nutzt eine SSL-/TLS-Verschlüsselung zum Schutz der Datenübertragung. Eine verschlüsselte Verbindung erkennen Sie am Schloss-Symbol in Ihrer Browserzeile und am Präfix "https://".</p>

            <h2>6. Kontaktformular</h2>
            <p>Wenn Sie uns über das Kontaktformular kontaktieren, werden Ihre Angaben (Name, E-Mail-Adresse, Thema, Nachricht) zur Bearbeitung der Anfrage gespeichert. Zur Übermittlung nutzen wir FormSubmit (formsubmit.co, Spring Monkey LLC, USA). Die Datenübertragung in die USA erfolgt auf Basis des EU-US Data Privacy Framework (DPF). Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen). Ihre Daten werden nach abgeschlossener Bearbeitung gelöscht.</p>

            <h2>7. Live-Chat</h2>
            <p>Die Website bietet einen Live-Chat zur direkten Kommunikation. Die Chat-Nachrichten werden über Supabase (Supabase Inc., 970 Toa Payoh North #07-04, Singapore 318992) in Echtzeit verarbeitet und gespeichert. Es werden keine personenbezogenen Daten automatisch erhoben, es sei denn, Sie geben diese freiwillig im Chat an. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der direkten Kommunikation). Die Datenübertragung in Drittländer erfolgt auf Basis von Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO). Chat-Verläufe werden nach 90 Tagen automatisch gelöscht.</p>

            <h2>8. Cookies und lokale Speicherung</h2>
            <p>Diese Website verwendet ausschließlich technisch notwendige Cookies bzw. lokale Speichereinträge (localStorage), die für den Betrieb der Website erforderlich sind. Es werden keine Analyse-, Tracking- oder Marketing-Cookies eingesetzt. Die Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.</p>

            <h2>9. Ihre Rechte</h2>
            <p>Sie haben gegenüber dem Verantwortlichen folgende Rechte hinsichtlich Ihrer personenbezogenen Daten: Recht auf Auskunft (Art. 15 DSGVO), Recht auf Berichtigung (Art. 16 DSGVO), Recht auf Löschung (Art. 17 DSGVO), Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO), Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO) sowie das Recht auf Datenübertragbarkeit (Art. 20 DSGVO). Zur Geltendmachung Ihrer Rechte wenden Sie sich an: <a href="mailto:kontakt@team-lazer.de">kontakt@team-lazer.de</a></p>

            <h2>10. Beschwerderecht bei einer Aufsichtsbehörde</h2>
            <p>{`Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt.\n\nZuständige Aufsichtsbehörde:\nSächsischer Datenschutz- und Transparenzbeauftragter\nDevrientstraße 5\n01067 Dresden\nhttps://www.saechsdsb.de`}</p>

            <h2>11. Aktualität</h2>
            <p>Diese Datenschutzerklärung hat den Stand April 2026. Bei Änderungen an der Website oder der Rechtslage wird diese Erklärung entsprechend angepasst.</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
