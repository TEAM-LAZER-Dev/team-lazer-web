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
    a: 'TEAM LAZER ist eine Dev-Community gegründet von fivozo und Wizzard Gaming. Wir entwickeln gemeinsam Websites, Discord Bots und Automatisierungen – aus Leidenschaft, nicht als Gewerbe.',
  },
  {
    q: 'Wer steckt hinter TEAM LAZER?',
    a: 'Gegründet von fivozo (Jon Wagner) und Wizzard Gaming als Co-Owner. Die Community wächst – weitere Mitglieder mit verschiedenen Skills kommen dazu. Schau auf der Mitglieder-Seite vorbei.',
  },
  {
    q: 'Habt ihr Discord Bots?',
    a: 'Ja! Wir entwickeln eigene Discord Bots, die du auf unserer Bots-Seite findest. Du kannst sie direkt auf deinen Server einladen oder das Dashboard nutzen.',
  },
  {
    q: 'Kann ich Teil von TEAM LAZER werden?',
    a: 'Wenn du coder, designst oder einfach Bock auf eine Dev-Community hast – melde dich über das Kontaktformular. Wir sind offen für neue Mitglieder.',
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
                Wir entwickeln Websites, Discord Bots und digitale Tools – sauber strukturiert, modern umgesetzt. Getragen von einer aktiven Community, die gemeinsam wächst.
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
            <h2>Was wir <span className="highlight">bauen</span></h2>
            <p>Websites, Discord Bots, Skripte – das ist der Kern von TEAM LAZER. Alles selbst entwickelt, aus Leidenschaft.</p>
          </motion.div>
          <motion.div
            className="services-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {[
              { to: '/skills', sc: '#2563eb', icon: 'fa-solid fa-globe', tag: 'Frontend & Backend', title: 'Websites', desc: 'Von einfachen Landing Pages bis zu Multi-Page-Sites mit eigenem Design – responsiv, ohne Baukästen.', items: ['HTML / CSS / JavaScript', 'React & Vite', 'Responsives Design'] },
              { to: '/skills', sc: '#7c3aed', icon: 'fa-brands fa-discord', tag: 'Discord Ökosystem', title: 'Discord Bots', desc: 'Einfache Utility-Bots oder komplexe Systeme mit Datenbank – alles selbst entwickelt für eigene Server.', items: ['discord.js v14', 'Slash Commands & Events', 'Datenbank-Anbindung'] },
              { to: '/skills', sc: '#10b981', icon: 'fa-solid fa-gears', tag: 'Python & JS', title: 'Skripte & Tools', desc: 'Kleine Automatisierungen, API-Anbindungen und nützliche Tools – für den Alltag und eigene Projekte.', items: ['Python & Node.js', 'REST APIs & Webhooks', 'Datenverarbeitung'] },
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

      {/* ── PROZESS ── */}
      <section className="section-pad bg-alt" id="prozess">
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <span className="section-tag">WIE WIR ARBEITEN</span>
            <h2>Von der Idee zum <span className="highlight">fertigen Projekt</span></h2>
            <p>So geht TEAM LAZER an neue Sachen heran – egal ob Website, Bot oder Skript.</p>
          </motion.div>
          <div className="process-row">
            {[
              { num: '01', icon: 'fa-solid fa-lightbulb', title: 'Idee', desc: 'Alles fängt mit einer Idee an – aus der Community, von uns selbst oder einfach weil es cool wäre. Wir sammeln und priorisieren.' },
              { num: '02', icon: 'fa-solid fa-pencil', title: 'Planung', desc: 'Kurze Überlegung zu Struktur, Design und Technik. Meistens ein schnelles Konzept – kein Overengineering.' },
              { num: '03', icon: 'fa-solid fa-code', title: 'Entwicklung', desc: 'Der eigentliche Spaß beginnt. Wir setzen das Projekt um, testen regelmäßig und verfeinern bis es passt.' },
              { num: '04', icon: 'fa-solid fa-rocket', title: 'Fertig & Live', desc: 'Das Projekt geht live, landet im Portfolio und wenn es ein Bot ist – direkt einladbar. Dann kommt das nächste.' },
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
      <section className="section-pad" id="kontakt">
        <div className="container">
          <motion.div className="cta-box" {...fadeUp()}>
            <h2>Coder? Dann bist du <span className="highlight">richtig hier.</span></h2>
            <p>Wenn du entwickelst, designst oder einfach Bock auf eine echte Dev-Community hast – melde dich. Wir bauen gemeinsam.</p>
            <div className="cta-btns">
              <Link to="/skills" className="btn btn-primary">
                <i className="fa-solid fa-code" /> Skills ansehen
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                <i className="fa-solid fa-envelope" /> Teil werden
              </Link>
            </div>
            <div className="cta-pills">
              {['Kein Gewerbe', 'Open Source Mindset', 'Dev-Community'].map(p => (
                <div key={p} className="cta-pill"><i className="fa-solid fa-check" /> {p}</div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
