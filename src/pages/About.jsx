import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
  viewport: { once: true, margin: '-60px' },
})

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } }
const staggerItem = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }

const pageStyle = `
  .about-intro { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; padding:0 0 80px; }
  .about-intro-text h2 { font-family:'Rajdhani',sans-serif; font-size:clamp(1.6rem,4vw,2.2rem); font-weight:800; text-transform:uppercase; margin-bottom:18px; line-height:1.15; }
  .about-intro-text p { color:var(--muted); font-size:.95rem; line-height:1.8; margin-bottom:14px; }
  .about-intro-text p strong { color:#fff; font-weight:600; }
  .about-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border); border:1px solid var(--border); border-radius:16px; overflow:hidden; }
  .about-stat { background:rgba(255,255,255,.02); padding:28px 20px; text-align:center; }
  .about-stat strong { display:block; font-family:'Rajdhani',sans-serif; font-size:2.2rem; font-weight:800; color:#fff; line-height:1; }
  .stat-color { color:var(--primary); }
  .about-stat span { font-size:.8rem; color:var(--muted); margin-top:5px; display:block; }
  .skills-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .skill-group h4 { font-family:'Rajdhani',sans-serif; font-size:.75rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.3); margin-bottom:12px; }
  .skill-tags { display:flex; gap:8px; flex-wrap:wrap; }
  .skill-tag { font-size:.8rem; font-weight:500; color:rgba(255,255,255,.6); background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:5px 12px; }
  .skill-tag.pri { color:#a78bfa; background:rgba(124,58,237,.1); border-color:rgba(124,58,237,.2); }
  .values-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .value-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:28px 22px; transition:.3s; }
  .value-card:hover { background:rgba(255,255,255,.04); border-color:rgba(255,255,255,.12); transform:translateY(-4px); }
  .value-icon { font-size:1.6rem; color:var(--primary); margin-bottom:14px; }
  .value-card h4 { font-family:'Rajdhani',sans-serif; font-size:1.05rem; font-weight:700; color:#fff; margin-bottom:8px; }
  .value-card p { font-size:.85rem; color:var(--muted); line-height:1.6; }
  .about-cta { background:rgba(124,58,237,.08); border:1px solid rgba(124,58,237,.2); border-radius:18px; padding:48px; text-align:center; }
  .about-cta h3 { font-family:'Rajdhani',sans-serif; font-size:clamp(1.4rem,3vw,1.9rem); font-weight:800; text-transform:uppercase; margin-bottom:10px; }
  .about-cta p { color:var(--muted); margin-bottom:24px; font-size:.93rem; }
  .about-cta-btns { display:flex; justify-content:center; gap:12px; flex-wrap:wrap; }
  @media(max-width:900px){
    .about-intro{grid-template-columns:1fr;gap:36px;text-align:center;}
    .skills-grid{grid-template-columns:1fr;}
    .values-grid{grid-template-columns:1fr;gap:12px;}
  }
  @media(max-width:600px){
    /* Keep stats as 3 columns — compact pill layout */
    .about-stats{grid-template-columns:repeat(3,1fr);}
    .about-stat{padding:18px 10px;}
    .about-stat strong{font-size:1.6rem;}
    .about-stat span{font-size:.72rem;}
    /* Intro: tighter spacing */
    .about-intro{padding:0 0 40px;gap:28px;}
    .about-intro-text h2{font-size:1.55rem;}
    .about-intro-text p{font-size:.88rem;}
    /* Skills: compact tags */
    .skill-tag{font-size:.76rem;padding:4px 10px;}
    /* Values: single col already, just tighter */
    .value-card{padding:20px 16px;}
    .value-card h4{font-size:.95rem;}
    .value-card p{font-size:.82rem;}
    /* CTA */
    .about-cta{padding:28px 18px;}
    .about-cta h3{font-size:1.35rem;}
    .about-cta-btns{flex-direction:column;gap:10px;}
    .about-cta-btns .btn{width:100%;justify-content:center;}
  }
`

export default function About() {
  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>

      {/* HERO */}
      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">TEAM LAZER</span>
            <h1>Über uns</h1>
            <p>Das Team hinter TEAM LAZER – leidenschaftliche Entwickler aus Deutschland, die sauberen Code und ehrliche Arbeit liefern.</p>
          </motion.div>
        </div>
      </section>

      {/* INTRO */}
      <section className="section-pad">
        <div className="container">
          <div className="about-intro">
            <motion.div className="about-intro-text" {...fadeUp()}>
              <h2>Entwicklung,<br />auf die du dich <span className="highlight">verlassen kannst</span></h2>
              <p>TEAM LAZER ist ein kleines, spezialisiertes Entwicklungsstudio aus Deutschland. Wir bauen <strong>Websites, Web-Apps und Automatisierungen</strong> – individuell, sauber im Code und mit transparenten Preisen.</p>
              <p>Was uns unterscheidet: Kein Lock-in, kein Baukastensystem, keine versteckten Kosten. Du bekommst deinen <strong>vollständigen Source-Code</strong>, ein klares individuelles Angebot nach Briefing und direkten Kontakt – ohne Umwege über Agenturen.</p>
              <p>Wir betreiben eigene Server-Infrastruktur und können Websites sowie Web-Apps direkt bei uns hosten – <strong>zuverlässig, rund um die Uhr</strong>. Hosting- und Domain-Kosten werden transparent im Angebot ausgewiesen.</p>
            </motion.div>
            <motion.div {...fadeUp(0.15)}>
              <div className="about-stats">
                {[['50+', 'Projekte'], ['3+', 'Jahre Erfahrung'], ['24h', 'Reaktionszeit']].map(([val, label]) => (
                  <div key={label} className="about-stat">
                    <strong><span className="stat-color">{val}</span></strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="bg-alt section-pad">
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <span className="section-tag">TECH STACK</span>
            <h2>Womit wir <span className="highlight">arbeiten</span></h2>
            <p>Unsere Kernkompetenzen im Überblick.</p>
          </motion.div>
          <motion.div className="skills-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {[
              { title: 'Frontend', tags: [['HTML / CSS / JS', true], ['Responsive Design', false], ['Animations', false], ['React', false]] },
              { title: 'Backend & Scripting', tags: [['Python', true], ['Node.js', true], ['REST APIs', false], ['Datenbanken', false]] },
              { title: 'APIs & Integration', tags: [['REST APIs', true], ['Webhooks', true], ['Datenbanken', false], ['Node.js', false]] },
              { title: 'Hosting & Tools', tags: [['Linux Server', false], ['Netlify', false], ['Git', false], ['VS Code', false]] },
            ].map(({ title, tags }) => (
              <motion.div key={title} className="skill-group" variants={staggerItem}>
                <h4>{title}</h4>
                <div className="skill-tags">
                  {tags.map(([name, pri]) => (
                    <span key={name} className={`skill-tag${pri ? ' pri' : ''}`}>{name}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section-pad">
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <span className="section-tag">UNSERE WERTE</span>
            <h2>Wie wir <span className="highlight">arbeiten</span></h2>
          </motion.div>
          <motion.div className="values-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {[
              { icon: 'fa-solid fa-file-code', title: 'Source-Code gehört dir', desc: 'Kein Lock-in, kein "nur bei uns erweiterbar". Du erhältst vollständigen, sauber dokumentierten Code.' },
              { icon: 'fa-solid fa-receipt', title: 'Transparente Preise', desc: 'Nach einem kurzen Briefing bekommst du ein individuelles Angebot – alle Kosten klar aufgelistet, inkl. möglicher Hosting- oder Domain-Gebühren.' },
              { icon: 'fa-solid fa-shield-halved', title: '14 Tage Bugfix-Garantie', desc: 'Fehler auf unserer Seite beheben wir kostenlos. 14 Tage nach Übergabe ist das Projekt in sicheren Händen.' },
            ].map(({ icon, title, desc }, i) => (
              <motion.div key={title} className="value-card" variants={staggerItem}>
                <div className="value-icon"><i className={icon} /></div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-alt">
        <div className="container">
          <motion.div className="about-cta" {...fadeUp()}>
            <h3>Bereit zusammenzuarbeiten?</h3>
            <p>Stell uns dein Projekt vor – wir melden uns innerhalb von 24 Stunden und besprechen alle Details für ein individuelles Angebot.</p>
            <div className="about-cta-btns">
              <Link to="/contact" className="btn btn-primary"><i className="fa-solid fa-paper-plane" /> Projekt anfragen</Link>
              <Link to="/services" className="btn btn-secondary"><i className="fa-solid fa-briefcase" /> Leistungen ansehen</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
