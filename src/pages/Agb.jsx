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
            <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen TEAM LAZER (Jon Wagner, Scheibenmühlenstr. 20, 01833 Stolpen) und dem Auftraggeber bezüglich der Entwicklung von Websites, Web-Apps, Automatisierungen und verwandten digitalen Dienstleistungen.</p>
            <h2>§ 2 Vertragsschluss</h2>
            <p>Ein Vertrag kommt zustande, wenn TEAM LAZER ein schriftliches Angebot unterbreitet und der Auftraggeber dieses schriftlich (per E-Mail) annimmt. Mündliche Absprachen sind nur bindend, wenn sie schriftlich bestätigt werden.</p>
            <h2>§ 3 Leistungsumfang</h2>
            <p>Der genaue Leistungsumfang ergibt sich aus dem individuellen Angebot. Änderungen am vereinbarten Leistungsumfang bedürfen der schriftlichen Zustimmung beider Parteien und können zu Anpassungen des Preises und des Liefertermins führen.</p>
            <h2>§ 4 Preise und Zahlung</h2>
            <p>Alle Preise werden individuell nach Projektbriefing angeboten und im Angebot schriftlich festgehalten. Alle angegebenen Preise sind Endpreise. Gemäß § 19 UStG wird keine Umsatzsteuer erhoben und daher nicht ausgewiesen. Dabei werden alle anfallenden Kosten transparent aufgeführt – einschließlich einmaliger Entwicklungskosten sowie laufender Kosten für Hosting oder Domains, sofern diese Teil des Auftrags sind. Hosting- und Domain-Kosten können monatlich oder jährlich anfallen und sind abhängig von Anbieter und Laufzeit. Domains können Mindestlaufzeiten haben und sind ggf. erst zum Ablauf der jeweiligen Periode kündbar. Bei Projekten über 200 € kann eine Anzahlung von 50 % bei Auftragserteilung vereinbart werden. Der Restbetrag ist bei Projektabschluss fällig.</p>
            <h2>§ 5 Liefertermine</h2>
            <p>Genannte Liefertermine sind Richtwerte und gelten vorbehaltlich rechtzeitiger Zulieferung von Inhalten und Materialien durch den Auftraggeber. TEAM LAZER haftet nicht für Verzögerungen, die durch den Auftraggeber verursacht werden.</p>
            <h2>§ 6 Abnahme und Übergabe</h2>
            <p>Nach Fertigstellung wird das Projekt zur Abnahme übergeben. Der Auftraggeber hat 7 Werktage Zeit, festgestellte Mängel schriftlich zu melden. Nach Ablauf dieser Frist gilt das Projekt als abgenommen.</p>
            <h2>§ 7 Gewährleistung</h2>
            <p>TEAM LAZER gewährt eine 14-tägige Bugfix-Garantie ab Übergabe für Fehler, die auf die Entwicklungsleistung zurückzuführen sind. Nicht enthalten sind Fehler durch Drittdienste, Hosting-Probleme oder Änderungen durch den Auftraggeber.</p>
            <h2>§ 8 Urheberrecht und Nutzungsrechte</h2>
            <p>Nach vollständiger Bezahlung erhält der Auftraggeber alle Nutzungsrechte am erstellten Werk inklusive vollständigem Source-Code. TEAM LAZER behält das Recht, das Projekt im Portfolio zu nennen, sofern nicht ausdrücklich anders vereinbart.</p>
            <h2>§ 9 Haftungsbeschränkung</h2>
            <p>TEAM LAZER haftet nur für Schäden, die durch grobe Fahrlässigkeit oder Vorsatz entstanden sind. Die Haftung ist auf den Auftragswert begrenzt. Für indirekte Schäden oder Folgeschäden wird keine Haftung übernommen.</p>
            <h2>§ 10 Datenschutz</h2>
            <p>Personenbezogene Daten werden ausschließlich zur Vertragserfüllung und zur Kommunikation mit dem Auftraggeber verarbeitet. Die Verarbeitung erfolgt gemäß unserer Datenschutzerklärung, die Bestandteil dieser AGB ist.</p>
            <h2>§ 11 Widerrufsrecht für Verbraucher</h2>
            <p>Verbraucher haben bei Fernabsatzverträgen grundsätzlich ein Widerrufsrecht von 14 Tagen. Da es sich bei unseren Leistungen um individuell angefertigte digitale Produkte handelt, kann das Widerrufsrecht erlöschen, sobald mit der Ausführung der Leistung begonnen wurde und der Verbraucher dem zuvor ausdrücklich zugestimmt hat (§ 356 Abs. 5 BGB).</p>
            <h2>§ 12 Schlussbestimmungen</h2>
            <p>Es gilt das Recht der Bundesrepublik Deutschland. Ist der Auftraggeber Verbraucher, gilt der gesetzliche Gerichtsstand. Ist der Auftraggeber Unternehmer, ist Gerichtsstand Dresden. Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
