import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/home.css'
import { useSEO } from '../lib/seo'

const WORDS = ['Websites', 'Landing Pages', 'Automatisierungen', 'Skripte', 'Web-Apps', 'Discord Bots']

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

const FAQ_ITEMS = [
  {
    q: 'Was kostet eine Website bei euch?',
    a: 'Preise gibt es erst nach einem kurzen Briefing – weil jedes Projekt anders ist. Eine einfache Landing Page startet ab 149 €, eine Business-Website ab 349 €. Danach kommt ein individuelles Angebot mit allen Kosten transparent aufgelistet – keine Überraschungen.',
  },
  {
    q: 'Wie läuft ein Projekt ab?',
    a: 'Du schickst uns eine kurze Projektbeschreibung. Wir melden uns innerhalb von 24 Stunden, besprechen die Details und schicken dir ein Angebot. Nach Freigabe legen wir los – mit regelmäßigen Updates und direktem Kontakt. Kein Zwischenhändler, kein Ticket-System.',
  },
  {
    q: 'Bekomme ich den Source-Code?',
    a: 'Ja, immer. Nach vollständiger Bezahlung gehört dir der vollständige Quellcode – sauber, kommentiert, ohne Lock-in. Du kannst ihn danach selbst verwalten, erweitern oder woanders hosten.',
  },
  {
    q: 'Kann ich die Website danach selbst bearbeiten?',
    a: 'Das kommt auf das Projekt an. Wir können dir eine einfach pflegbare Lösung bauen oder dir nach Übergabe eine kurze Einweisung geben. Auf Wunsch richten wir auch ein CMS ein.',
  },
  {
    q: 'Bietet ihr Hosting an?',
    a: 'Ja. Wir können Websites direkt bei uns hosten – rund um die Uhr, auf deutschem Server. Hosting-Kosten werden transparent im Angebot aufgelistet, separat von den Entwicklungskosten.',
  },
  {
    q: 'Was ist die Bugfix-Garantie?',
    a: 'Fehler, die auf unsere Entwicklung zurückgehen, beheben wir kostenlos – 14 Tage lang nach Übergabe. Nicht enthalten: Fehler durch Drittanbieter, Hosting oder Änderungen durch dich.',
  },
  {
    q: 'Warum kein Baukastensystem wie Wix oder Squarespace?',
    a: 'Baukastensysteme sehen auf den ersten Blick günstig aus, binden dich aber langfristig. Du zahlst monatlich, bekommst keinen Code, bist in Design und Funktionen eingeschränkt und kannst nicht wirklich skalieren. Wir liefern dir eine echte Website – dein Eigentum, dein Code.',
  },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section className="section-pad bg-alt" id="faq">
      <div className="container">
        <motion.div className="section-header" {...fadeUp()}>
          <span className="section-tag">FAQ</span>
          <h2>Häufige <span className="highlight">Fragen</span></h2>
          <p>Alles, was du vor einer Anfrage wissen möchtest.</p>
        </motion.div>
        <motion.div className="faq-list" {...fadeUp(0.1)}>
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`faq-item${open === i ? ' faq-open' : ''}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="faq-q">
                <span>{item.q}</span>
                <i className={`fa-solid fa-chevron-down faq-icon`} />
              </div>
              <div className="faq-a"><p>{item.a}</p></div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
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

function useParallaxOrbs() {
  useEffect(() => {
    const orb1 = document.querySelector('.hero-orb-1')
    const orb2 = document.querySelector('.hero-orb-2')
    const onScroll = () => {
      const y = window.scrollY
      if (orb1) orb1.style.transform = `translateY(${y * 0.18}px)`
      if (orb2) orb2.style.transform = `translateY(${y * 0.1}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

export default function Home() {
  useParallaxOrbs()
  useSEO({
    title: 'TEAM LAZER | Websites · Discord Bots · Entwicklung',
    description: 'TEAM LAZER – professionelle Websites, Discord Bots und Automatisierungen aus Deutschland. Individuelle Angebote nach Briefing, Source-Code Übergabe, Hosting auf Wunsch.',
  })
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
                Bereits 50+ Projekte abgeschlossen
              </div>
              <h1>
                {[
                  'Professionelle',
                  <><span className="highlight">Entwicklung</span>.</>,
                  'Ohne Umwege.',
                ].map((line, i) => (
                  <motion.span
                    key={i}
                    className="hero-h1-line"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 + i * 0.16 }}
                  >
                    {line}
                  </motion.span>
                ))}
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
              { icon: 'fa-brands fa-discord', cls: 'c-purple', title: 'Discord Bot', sub: 'discord.js · Slash Commands · DB', status: 'Aktiv' },
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
              { to: '/services', sc: '#7c3aed', icon: 'fa-brands fa-discord', tag: 'Einfach bis Komplex', title: 'Discord Bots', desc: 'Von Moderations-Bots bis zu komplexen Systemen mit Datenbank – alles individuell entwickelt.', items: ['Slash Commands & Events', 'Datenbank & Leveling', 'Hosting auf Wunsch'] },
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

      {/* ── FAQ ── */}
      <FAQ />

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
