import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/home.css'
import { useSEO } from '../lib/seo'

const WORDS = ['Gaming', 'Discord', 'Code', 'Hosting', 'Events', 'Bots', 'Server']


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
        if (ci + 1 === target.length) { setTimeout(() => setDel(true), 2500) }
        else setCi(c => c + 1)
      }, 150)
    } else {
      t = setTimeout(() => {
        setWord(target.slice(0, ci - 1))
        if (ci - 1 === 0) { setDel(false); setWi(i => (i + 1) % WORDS.length); setCi(0) }
        else setCi(c => c - 1)
      }, 60)
    }
    return () => clearTimeout(t)
  }, [ci, del, wi])

  return (
    <div className="hero-tw-row">
      Wir lieben <span className="tw-word">{word}</span>
      <span className="tw-cursor">|</span>
    </div>
  )
}

const FAQ_ITEMS = [
  {
    q: 'Was ist TEAM LAZER?',
    a: 'TEAM LAZER ist eine Dev- und Gaming-Community aus Deutschland. Wir zocken zusammen, entwickeln eigene Bots und Websites – und bauen eine Community auf die wir selbst gerne nutzen.',
  },
  {
    q: 'Wer steckt hinter TEAM LAZER?',
    a: 'Gegründet von fivozo und Wizzard Gaming als Co-Owner. Was als kleines Projekt begann ist heute eine wachsende Community die gemeinsam baut, hostet und zockt.',
  },
  {
    q: 'Habt ihr Discord Bots?',
    a: 'Ja! Wir entwickeln kostenlose, öffentlich nutzbare Discord Bots – direkt einladbar für jeden. Daneben gibt es private Bots, die exklusiv für unsere Community gebaut sind.',
  },
  {
    q: 'Kann ich Teil von TEAM LAZER werden?',
    a: 'Auf jeden Fall. Komm einfach auf unseren Discord, schau dich um und werde Teil der Community. Kein Bewerbungsprozess, keine Hürden – einfach dabei sein.',
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

function useDiscordStats() {
  const [count, setCount] = useState(null)
  useEffect(() => {
    fetch('/discord-stats')
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setCount(d.member_count))
      .catch(() => {})
  }, [])
  return count
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
  const memberCount = useDiscordStats()
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
                Eine Community. Zwei Welten.
              </div>
              <h1>
                {[
                  'Community.',
                  <><span className="highlight">Hosting.</span></>,
                  'Development.',
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
                Code. Gaming. Community. Drei Welten. Ein Team. Willkommen bei TEAM LAZER. Gegründet auf Discord. Angetrieben von Leidenschaft. Wir hosten, entwickeln und wachsen – zusammen.
              </p>
              <div className="hero-btns">
                <Link to="/skills" className="btn btn-primary">
                  Mehr erfahren
                </Link>
                <a href="https://discord.gg/teamlazer" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <i className="fa-brands fa-discord" /> Discord
                </a>
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
                {memberCount !== null && (
                  <div className="trust-pill trust-pill--live">
                    <span className="trust-pill-dot" />
                    {memberCount.toLocaleString('de-DE')} Mitglieder
                  </div>
                )}
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
            <span className="section-tag">WER WIR SIND</span>
            <h2>Was uns <span className="highlight">ausmacht</span></h2>
            <p>Drei Dinge die TEAM LAZER definieren – und die uns jeden Tag zusammenbringen.</p>
          </motion.div>
          <motion.div
            className="services-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {[
              { to: '/about', sc: '#7c3aed', icon: 'fa-brands fa-discord', tag: 'Unsere Basis', title: 'Community', desc: 'Der Kern von TEAM LAZER. Ein Ort wo Menschen zusammenkommen die dieselbe Leidenschaft teilen – egal ob Coder, Gamer oder beides.', items: ['Discord Server', 'Aktive Mitglieder', 'Zusammen wachsen'] },
              { to: '/bots', sc: '#2563eb', icon: 'fa-solid fa-code', tag: 'Was wir bauen', title: 'Entwicklung', desc: 'Von Discord Bots bis zur eigenen Website – wir entwickeln Dinge die wir selbst brauchen und nutzen. Aus Interesse, nicht auf Bestellung.', items: ['Discord Bots', 'Websites & Tools', 'Eigene Projekte'] },
              { to: '/about', sc: '#10b981', icon: 'fa-solid fa-gamepad', tag: 'Was wir lieben', title: 'Gaming', desc: 'Neben dem ganzen Code-Kram zocken wir zusammen. Verschiedene Games, verschiedene Plattformen – Hauptsache zusammen.', items: ['Gemeinsam zocken', 'Gaming Events', 'Verschiedene Plattformen'] },
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
              <a href="https://discord.gg/teamlazer" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                <i className="fa-brands fa-discord" /> Discord
              </a>
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
