import { motion } from 'framer-motion'

const legalStyle = `
  .legal-body{max-width:760px;margin:0 auto;}
  .legal-date{font-size:.78rem;color:var(--muted);margin-bottom:32px;letter-spacing:.5px;}
  .legal-body h2{font-family:'Rajdhani',sans-serif;font-size:1.1rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:.5px;margin:32px 0 10px;padding-top:24px;border-top:1px solid var(--border);}
  .legal-body h2:first-of-type{margin-top:0;padding-top:0;border-top:none;}
  .legal-body p{color:var(--muted);line-height:1.8;font-size:.9rem;}
  .legal-body ol{list-style:decimal;padding-left:20px;color:var(--muted);font-size:.9rem;line-height:1.8;}
`

export default function Agb() {
  return (
    <div className="page-wrapper">
      <style>{legalStyle}</style>
      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">RECHTLICHES</span>
            <h1>AGB</h1>
          </motion.div>
        </div>
      </section>
      <section className="section-pad">
        <div className="container">
          <motion.div className="legal-body" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
            <div className="legal-date">Stand: März 2026</div>
            <h2>§ 1 Geltungsbereich</h2>
            <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen TEAM LAZER (Jon Wagner, Scheibenmühlenstr. 20, 01833 Stolpen) und dem Auftraggeber bezüglich der Entwicklung von Websites, Discord Bots und verwandten digitalen Dienstleistungen.</p>
            <h2>§ 2 Vertragsschluss</h2>
            <p>Ein Vertrag kommt zustande, wenn TEAM LAZER ein schriftliches Angebot unterbreitet und der Auftraggeber dieses schriftlich (per E-Mail) annimmt. Mündliche Absprachen sind nur bindend, wenn sie schriftlich bestätigt werden.</p>
            <h2>§ 3 Leistungsumfang</h2>
            <p>Der genaue Leistungsumfang ergibt sich aus dem individuellen Angebot. Änderungen am vereinbarten Leistungsumfang bedürfen der schriftlichen Zustimmung beider Parteien und können zu Anpassungen des Preises und des Liefertermins führen.</p>
            <h2>§ 4 Preise und Zahlung</h2>
            <p>Alle Preise sind Nettopreise. Die Zahlung erfolgt gemäß den im Angebot festgelegten Konditionen. Bei Projekten über 200 € kann eine Anzahlung von 50 % bei Auftragserteilung vereinbart werden. Der Restbetrag ist bei Projektabschluss fällig.</p>
            <h2>§ 5 Liefertermine</h2>
            <p>Genannte Liefertermine sind Richtwerte und gelten vorbehaltlich rechtzeitiger Zulieferung von Inhalten und Materialien durch den Auftraggeber. TEAM LAZER haftet nicht für Verzögerungen, die durch den Auftraggeber verursacht werden.</p>
            <h2>§ 6 Abnahme und Übergabe</h2>
            <p>Nach Fertigstellung wird das Projekt zur Abnahme übergeben. Der Auftraggeber hat 7 Werktage Zeit, festgestellte Mängel schriftlich zu melden. Nach Ablauf dieser Frist gilt das Projekt als abgenommen.</p>
            <h2>§ 7 Gewährleistung</h2>
            <p>TEAM LAZER gewährt eine 30-tägige Bugfix-Garantie ab Übergabe für Fehler, die auf die Entwicklungsleistung zurückzuführen sind. Nicht enthalten sind Fehler durch Drittdienste, Hosting-Probleme oder Änderungen durch den Auftraggeber.</p>
            <h2>§ 8 Urheberrecht und Nutzungsrechte</h2>
            <p>Nach vollständiger Bezahlung erhält der Auftraggeber alle Nutzungsrechte am erstellten Werk inklusive vollständigem Source-Code. TEAM LAZER behält das Recht, das Projekt im Portfolio zu nennen, sofern nicht ausdrücklich anders vereinbart.</p>
            <h2>§ 9 Haftungsbeschränkung</h2>
            <p>TEAM LAZER haftet nur für Schäden, die durch grobe Fahrlässigkeit oder Vorsatz entstanden sind. Die Haftung ist auf den Auftragswert begrenzt. Für indirekte Schäden oder Folgeschäden wird keine Haftung übernommen.</p>
            <h2>§ 10 Datenschutz</h2>
            <p>Personenbezogene Daten werden ausschließlich zur Vertragserfüllung verwendet. Weitere Informationen finden sich in unserer Datenschutzerklärung.</p>
            <h2>§ 11 Schlussbestimmungen</h2>
            <p>Es gilt deutsches Recht. Gerichtsstand ist Dresden, sofern gesetzlich zulässig. Sollten einzelne Bestimmungen unwirksam sein, bleibt der Vertrag im Übrigen wirksam.</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
