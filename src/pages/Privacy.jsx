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
            <div className="legal-date">Stand: September 2026</div>

            <h2>1. Verantwortlicher</h2>
            <p>{`Jon Wagner (TEAM LAZER)
Scheibenmühlenstr. 20
01833 Stolpen
Deutschland

E-Mail: kontakt@team-lazer.de`}</p>

            <h2>2. Hosting</h2>
            <p>Die Website wird bei Netlify Inc. (San Francisco, USA) gehostet. Beim Aufruf werden technisch bedingt Verbindungsdaten (u. a. IP-Adresse, Browser, Datum und Uhrzeit) in Server-Logfiles verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (sicherer und stabiler Betrieb). Die Übermittlung in die USA erfolgt auf Basis des EU-US Data Privacy Framework.</p>

            <h2>3. Schriftarten und Icons</h2>
            <p>Zur Darstellung laden wir Google Fonts (Google Ireland Limited, Irland) und Font Awesome über das Cloudflare-CDN (Cloudflare Inc., USA). Dabei wird deine IP-Adresse an die Anbieter übermittelt. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>

            <h2>4. Kontaktformular</h2>
            <p>Bei Nutzung des Kontaktformulars werden deine Angaben (Name, E-Mail, Thema, Nachricht) zur Bearbeitung deiner Anfrage verarbeitet und über FormSubmit (formsubmit.co, USA) per E-Mail an uns weitergeleitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. b bzw. f DSGVO. Die Daten werden gelöscht, sobald die Anfrage erledigt ist.</p>

            <h2>5. Live-Chat</h2>
            <p>Im Live-Chat werden dein Name, optional deine E-Mail-Adresse, das gewählte Thema sowie deine Nachrichten verarbeitet und über Supabase (Datenbank-Dienstleister) gespeichert, damit wir dir antworten können. Zur Wiedererkennung deiner Sitzung wird eine zufällige Chat-ID in deinem Browser gespeichert (localStorage). Rechtsgrundlage: Art. 6 Abs. 1 lit. b bzw. f DSGVO. Nach Freigabe durch unser Team kannst du im Chat auch Bilder oder Dateien senden; diese werden ebenfalls bei Supabase gespeichert. Chat-Daten und Anhänge werden gelöscht, sobald sie für die Bearbeitung nicht mehr erforderlich sind.</p>

            <h2>6. Cookies und lokale Speicherung</h2>
            <p>Wir setzen ausschließlich technisch notwendige Speicherfunktionen ein (z. B. Chat-ID, Merken der Cookie-Hinweis-Bestätigung). Es gibt kein Tracking und keine Werbung.</p>

            <h2>7. Deine Rechte</h2>
            <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Schreibe dazu an <a href="mailto:kontakt@team-lazer.de">kontakt@team-lazer.de</a>. Außerdem kannst du dich bei einer Aufsichtsbehörde beschweren, z. B. beim Sächsischen Datenschutz- und Transparenzbeauftragten, Devrientstraße 5, 01067 Dresden.</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
