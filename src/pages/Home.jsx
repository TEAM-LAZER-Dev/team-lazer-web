import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/home.css'

const WORDS = ['Websites', 'Landing Pages', 'Automatisierungen', 'Skripte', 'Web-Apps']

function Typewriter() {
  const [wi, setWi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)
  const [word, setWord] = useState('')

  useEffect(() => {
    const target = WORDS[wi]
    let t
    if (!del) {
      t = setTimeout(() => {
        setWord(target.slice(0, ci + 1))
        if (ci + 1 === target.length) { setTimeout(() => setDel(true), 2000) }
        else setCi(c => c + 1)
      }, 80)
    } else {
      t = setTimeout(() => {
        setWord(target.slice(0, ci - 1))
        if (ci - 1 === 0) { setDel(false); setWi(i => (i + 1) % WORDS.length); setCi(0) }
        else setCi(c => c - 1)
      }, 45)
    }
    return () => clearTimeout(t)
  }, [ci, del, wi])

  return (
    <div className="hero-tw-row">
      Wir bauen <span className="tw-word">{word}</span>
      <span className="tw-cursor">|</span>
    </div>
  )
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
  viewport: { once: true, margin: '-60px' },
})

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}
const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Home() {
  return (
    <div className="page-wrapper">
      {/* ── HERO ── */}
      <section className="hero" id="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="container hero-inner">
          <div className="hero-text">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="hero-pill">
                <span className="hero-pill-dot" />
                Development aus Deutschland
              </div>
              <h1>
                Professionelle<br />
                <span className="highlight">Entwicklung</span>.<br />
                Ohne Umwege.
              </h1>
              <Typewriter />
              <p className="hero-sub">
                Von der Landing Page bis zur komplexen Automatisierung –
                sauberer Code, individuelle Angebote nach Briefing und Hosting auf Wunsch.
              </p>
              <div className="hero-btns">
                <Link to="/contact" className="btn btn-primary">
                  <i className="fa-solid fa-paper-plane" /> Kostenloses Erstgespräch
                </Link>
                <Link to="/services" className="btn btn-secondary">
                  <i className="fa-solid fa-briefcase" /> Alle Leistungen
                </Link>
              </div>
              <div className="hero-trust">
                {['Individuelles Angebot', 'Hosting auf Wunsch', 'Source-Code Übergabe', '14 Tage Bugfix-Garantie'].map(t => (
                  <div key={t} className="trust-pill">
                    <i className="fa-solid fa-check" /> {t}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          >
            {[
              { icon: 'fa-solid fa-globe', cls: 'c-blue', title: 'Business Website', sub: 'Responsiv · Schnell · Individuell', status: 'Live' },
              { icon: 'fa-solid fa-code', cls: 'c-purple', title: 'Custom Web-App', sub: 'React · Node.js · API', status: 'Aktiv' },
              { icon: 'fa-solid fa-gears', cls: 'c-green', title: 'Automatisierung', sub: 'Webhooks · APIs · Skripte', status: 'Läuft' },
            ].map(({ icon, cls, title, sub, status }) => (
              <div key={title} className="hv-card">
                <div className={`hv-icon ${cls}`}><i className={icon} /></div>
                <div className="hv-info">
                  <strong>{title}</strong>
                  <span>{sub}</span>
                </div>
                <div className="hv-status">
                  <span className="hv-status-dot" />{status}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LEISTUNGEN ── */}
      <section className="section-pad" id="leistungen">
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <span className="section-tag">LEISTUNGEN</span>
            <h2>Was wir für dich <span className="highlight">entwickeln</span></h2>
            <p>Drei Kernbereiche – alles aus einer Hand, mit Hosting-Option.</p>
          </motion.div>
          <motion.div
            className="services-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {[
              { to: '/services', sc: '#2563eb', icon: 'fa-solid fa-globe', tag: 'Hosting inklusive', title: 'Website Entwicklung', desc: 'Landing Pages, Business-Websites und Community-Sites – responsiv, ohne Baukastensystem.', items: ['Landing Pages & Business Sites', 'Individuelles Design', 'Hosting auf Wunsch'] },
              { to: '/services', sc: '#7c3aed', icon: 'fa-solid fa-code', tag: 'Individuell nach Maß', title: 'Custom Web-Apps', desc: 'Komplexe Webanwendungen, Dashboards und Portale – individuell entwickelt, ohne Baukastensystem.', items: ['React & Node.js', 'Datenbank & API-Integration', 'Hosting auf Wunsch'] },
              { to: '/services', sc: '#10b981', icon: 'fa-solid fa-gears', tag: 'Schnelle Umsetzung', title: 'Automation & Skripte', desc: 'Webhooks, API-Integrationen und Skripte – wir automatisieren repetitive Aufgaben.', items: ['Webhooks & APIs', 'Python & JavaScript', 'Datenverarbeitung'] },
            ].map(({ to, sc, icon, tag, title, desc, items }) => (
              <motion.div key={title} variants={staggerItem}>
                <Link to={to} className="svc-card" style={{ '--sc': sc }}>
                  <div className="svc-icon"><i className={icon} /></div>
                  <span className="svc-tag">{tag}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <ul className="svc-list">
                    {items.map(i => <li key={i}><i className="fa-solid fa-check" /> {i}</li>)}
                  </ul>
                  <div className="svc-link">Ansehen <i className="fa-solid fa-arrow-right" /></div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROZESS ── */}
      <section className="section-pad bg-alt" id="prozess">
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <span className="section-tag">SO LÄUFT'S</span>
            <h2>Von der Anfrage zur <span className="highlight">fertigen Lieferung</span></h2>
            <p>Transparent, unkompliziert, ohne Überraschungen.</p>
          </motion.div>
          <div className="process-row">
            {[
              { num: '01', icon: 'fa-solid fa-comments', title: 'Anfrage stellen', desc: 'Kontaktformular ausfüllen oder E-Mail schicken. Kurze Beschreibung genügt – wir melden uns innerhalb von 24 Stunden.' },
              { num: '02', icon: 'fa-solid fa-file-invoice', title: 'Angebot erhalten', desc: 'Nach einem kurzen Briefing erhältst du ein individuelles Angebot – was wir liefern, bis wann und zu welchem Preis. Ohne Kleingedrucktes.' },
              { num: '03', icon: 'fa-solid fa-code', title: 'Wir entwickeln', desc: 'Nach Freigabe legen wir los. Du bekommst Updates und kannst jederzeit Feedback geben – keine Blackbox.' },
              { num: '04', icon: 'fa-solid fa-rocket', title: 'Übergabe & Launch', desc: 'Vollständiger Source-Code, Deployment oder Hosting nach Wunsch. Fertig in vereinbarter Zeit.' },
            ].map(({ num, icon, title, desc }, idx) => (
              <>
                <motion.div key={title} className="process-step" {...fadeUp(idx * 0.12)}>
                  <div className="ps-num">{num}</div>
                  <div className="ps-icon"><i className={icon} /></div>
                  <div><h4>{title}</h4><p>{desc}</p></div>
                </motion.div>
                {idx < 3 && <div key={`line-${idx}`} className="process-line" />}
              </>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-pad" id="anfrage">
        <div className="container">
          <motion.div className="cta-box" {...fadeUp()}>
            <h2>Bereit dein Projekt <span className="highlight">zu starten?</span></h2>
            <p>Beschreib uns kurz dein Projekt – wir melden uns innerhalb von 24 Stunden und erstellen nach einem kurzen Briefing ein individuelles Angebot.</p>
            <div className="cta-btns">
              <Link to="/contact" className="btn btn-primary">
                <i className="fa-solid fa-paper-plane" /> Jetzt anfragen
              </Link>
              <Link to="/services" className="btn btn-secondary">
                <i className="fa-solid fa-briefcase" /> Alle Leistungen
              </Link>
            </div>
            <div className="cta-pills">
              {['24h Reaktionszeit', 'Hosting auf Wunsch', 'Bugfix-Garantie', 'Source-Code Übergabe'].map(p => (
                <div key={p} className="cta-pill"><i className="fa-solid fa-check" /> {p}</div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
