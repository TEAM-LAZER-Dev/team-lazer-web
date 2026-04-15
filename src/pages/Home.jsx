import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/home.css'
import { useSEO } from '../lib/seo'

const WORDS = ['Websites', 'Discord Bots', 'Apps', 'Automatisierungen', 'Landing Pages', 'Discord Server', 'Web-Apps', 'Games']


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
    q: 'Was ist TEAM LAZER?',
    a: 'TEAM LAZER ist eine Dev- und Gaming-Community gegründet von fivozo und Wizzard Gaming. Wir entwickeln und überarbeiten Discord Bots, Websites und Automatisierungen – und richten Discord Server professionell ein.',
  },
  {
    q: 'Wer steckt hinter TEAM LAZER?',
    a: 'Gegründet von fivozo und Wizzard Gaming als Co-Owner. Eine Dev- und Gaming-Community aus Deutschland mit echtem Fokus auf saubere Entwicklung und aktive Gemeinschaft.',
  },
  {
    q: 'Habt ihr Discord Bots?',
    a: 'Ja! Wir entwickeln kostenlose, öffentlich nutzbare Discord Bots – direkt einladbar für jeden. Daneben gibt es private Bots, die exklusiv für unsere Community gebaut sind.',
  },
  {
    q: 'Richtet ihr auch Discord Server ein?',
    a: 'Ja – wir richten Discord Server professionell ein: Strukturierung, Rollen, Kategorien, Bots und alles was dazu gehört. Meld dich einfach über das Kontaktformular.',
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
          <p>Ein paar Dinge, die du vielleicht wissen möchtest.</p>
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
    title: 'TEAM LAZER | Entwicklung · Bots · Community',
    description: 'TEAM LAZER – Dev-Community aus Deutschland. Wir entwickeln Websites, Discord Bots und Tools – aus reiner Leidenschaft.',
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
                Dev-Community aus Deutschland
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
                Tagsüber coden, abends zocken – manchmal beides gleichzeitig. Wir sind eine Community, die Projekte baut, die aus echtem Interesse entstehen. Kein Auftrag. Keine Agentur. Einfach wir.
              </p>
              <div className="hero-btns">
                <Link to="/skills" className="btn btn-primary">
                  Mehr erfahren
                </Link>
                <Link to="/bots" className="btn btn-secondary">
                  <i className="fa-brands fa-discord" /> Unsere Bots
                </Link>
              </div>
              <div className="hero-trust">
                {[
                  { icon: 'fa-solid fa-code', label: 'Entwicklung' },
                  { icon: 'fa-brands fa-discord', label: 'Community' },
                  { icon: 'fa-solid fa-gamepad', label: 'Gaming' },
                ].map(({ icon, label }) => (
                  <div key={label} className="trust-pill">
                    <i className={icon} /> {label}
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
              { icon: 'fa-solid fa-code', cls: 'c-blue', title: 'Entwicklung', sub: 'Websites · Bots · Tools', status: 'Aktiv' },
              { icon: 'fa-brands fa-discord', cls: 'c-green', title: 'Community', sub: 'Discord · Events · Austausch', status: 'Aktiv' },
              { icon: 'fa-solid fa-gamepad', cls: 'c-purple', title: 'Gaming', sub: 'Gemeinsam zocken · Fun', status: 'Aktiv' },
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

      {/* ── SKILLS OVERVIEW ── */}
      <section className="section-pad" id="skills">
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <span className="section-tag">ENTWICKLUNG</span>
            <h2>Was wir <span className="highlight">machen</span></h2>
            <p>Entwicklung, Überarbeitung und Einrichtung – von Discord Bots über Websites bis zu kompletten Discord Servern.</p>
          </motion.div>
          <motion.div
            className="services-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {[
              { to: '/skills', sc: '#2563eb', icon: 'fa-solid fa-globe', tag: 'Frontend & Backend', title: 'Websites', desc: 'Entwicklung und Überarbeitung von Websites – von der Landing Page bis zur mehrseitigen Web-App, responsiv und ohne Baukästen.', items: ['HTML / CSS / JavaScript', 'React & Vite', 'Responsives Design'] },
              { to: '/bots', sc: '#7c3aed', icon: 'fa-brands fa-discord', tag: 'Discord Ökosystem', title: 'Discord Bots', desc: 'Entwicklung und Überarbeitung von Discord Bots – einfache Utility-Bots oder komplexe Systeme mit Datenbank und Dashboard.', items: ['discord.js v14', 'Slash Commands & Events', 'Datenbank-Anbindung'] },
              { to: '/skills', sc: '#10b981', icon: 'fa-brands fa-discord', tag: 'Discord Server', title: 'Server-Einrichtung', desc: 'Professionelle Einrichtung von Discord Servern – Struktur, Rollen, Kategorien, Bots und alles was dein Server braucht.', items: ['Rollen & Berechtigungen', 'Kategorien & Kanäle', 'Bot-Integration'] },
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
                  <div className="svc-link">Mehr ansehen <i className="fa-solid fa-arrow-right" /></div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ── FAQ ── */}
      <FAQ />

      {/* ── CTA ── */}
      <section className="section-pad" id="kontakt">
        <div className="container">
          <motion.div className="cta-box" {...fadeUp()}>
            <h2>Eine Community, die <span className="highlight">Dinge baut.</span></h2>
            <p>Wir sind Entwickler und Gamer aus Leidenschaft. Schau vorbei, tausch dich aus oder wirf einfach einen Blick auf unsere Projekte.</p>
            <div className="cta-btns">
              <Link to="/skills" className="btn btn-primary">
                Mehr erfahren
              </Link>
              <Link to="/bots" className="btn btn-secondary">
                <i className="fa-brands fa-discord" /> Unsere Bots
              </Link>
            </div>
            <div className="cta-pills">
              {['Dev & Gaming Community', 'Discord Bots & Websites', 'Aus Leidenschaft'].map(p => (
                <div key={p} className="cta-pill"><i className="fa-solid fa-check" /> {p}</div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
