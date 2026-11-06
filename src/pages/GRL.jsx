import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  motion, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion,
} from 'framer-motion'
import { useSEO } from '../lib/seo'
import { LINKS, GRL_INVITE_CODE } from '../data/site'
import { useDiscordInvite } from '../lib/discord'
import RisingParticles from '../components/grl/RisingParticles'
import TiltCard from '../components/grl/TiltCard'
import CountUp from '../components/grl/CountUp'
import Marquee from '../components/grl/Marquee'
import Heading from '../components/grl/Heading'
import Steps from '../components/grl/Steps'
import '../styles/grl.css'

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
const fadeItem = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } }
const listVar = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }
const liVar = { hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.4 } } }

// Infos stammen aus dem GRL-Discord (Regeln, First-Steps, Modi-Erklärungen) – bei Änderungen dort hier nachziehen.
const STEPS = [
  ['Server beitreten', 'Regeln lesen und akzeptieren – dann sind alle Kanäle für dich offen.'],
  ['Ranking beantragen', 'Im Ticket-System einen Ranking-Antrag stellen. Dort reichst du deine Activision ID und deinen Twitch-Link ein.'],
  ['Zum Turnier anmelden', 'Mit Ranking kannst du dich für die Turniere anmelden. Das Ranking sorgt für faire Teams.'],
  ['Spielen & Ergebnis einreichen', 'Nach der Runde reicht dein Team Scoreboard und Placement ein.'],
]

const TURNIERE = [
  ['fa-solid fa-diagram-project', 'Turniersysteme', ['Single Elimination', 'Double Elimination', 'Schweizer System', 'Round Robin']],
  ['fa-solid fa-gamepad', 'Spielmodi', ['TKR (Time Killrace)', 'Killrace', 'Total Of', 'Matchpoint', 'David vs Goliath']],
  ['fa-solid fa-people-group', 'Teamformate', ['Fair Wheel', 'Normal Wheel', 'Regular', 'Draft', 'Draft mit Cap', 'Trio Oddmann Killrace']],
]

const COMMUNITY = [
  ['fa-solid fa-ranking-star', 'Leaderboard', 'Die Rangliste der gerankten Spieler.'],
  ['fa-solid fa-user-group', 'Spielersuche', 'Mitspieler und Teams finden.'],
  ['fa-solid fa-microphone', 'Eigene Voice-Räume', 'Sprachräume per Klick erstellen.'],
  ['fa-solid fa-headset', 'Support per Ticket', 'Bei Fragen, Feedback und Anträgen hilft das Team.'],
]

const GAME = [
  ['fa-solid fa-cube', 'Map Shipment-Mini', 'Kleine Container-Arena mit schnellen Gefechten.'],
  ['fa-solid fa-users', '1v1 bis 6v6', 'Private Lobbys mit Freunden oder Spielsuche.'],
  ['fa-brands fa-discord', 'Discord Activity', 'Läuft direkt im Browser, mitten im Voice-Chat.'],
  ['fa-solid fa-lock', 'Bald mehr', 'Battle Pass, Events und Karriere sind in Planung.'],
]

const MODES_A = ['TKR', 'Killrace', 'Total Of', 'Matchpoint', 'David vs Goliath', 'Fair Wheel', 'Draft']
const MODES_B = ['Single Elimination', 'Double Elimination', 'Schweizer System', 'Round Robin', 'Custom Lobby', 'Public Lobby']

/* ───────────────────────── HERO ───────────────────────── */
function Hero() {
  const reduce = useReducedMotion()
  const rx = useSpring(useMotionValue(0), { stiffness: 90, damping: 14 })
  const ry = useSpring(useMotionValue(0), { stiffness: 90, damping: 14 })
  const { scrollY } = useScroll()
  const emblemY = useTransform(scrollY, [0, 600], [0, -60])

  useEffect(() => {
    if (reduce) return undefined
    const onMove = e => {
      if (e.pointerType === 'touch') return
      ry.set((e.clientX / window.innerWidth - 0.5) * 24)
      rx.set(-(e.clientY / window.innerHeight - 0.5) * 20)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, rx, ry])

  let idx = 0
  return (
    <section className="grl-hero">
      <div className="grl-aurora" aria-hidden="true"><i /><i /><i /></div>
      {!reduce && <RisingParticles className="grl-canvas" />}

      <div className="container grl-hero-in">
        <motion.div className="grl-emblem-wrap" style={reduce ? undefined : { y: emblemY }}>
          <motion.div
            className="grl-emblem"
            style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grl-pulse" />
            <div className="grl-ring" />
            <div className="grl-ring b" />
            <img className="grl-emblem-img" src="/images/grl-logo.webp" alt="German Rising League" />
            <div className="grl-orbit"><img src="/images/tl-logo-v2.webp" alt="TEAM LAZER" /></div>
          </motion.div>
        </motion.div>

        <motion.span
          className="section-tag"
          initial={reduce ? false : { opacity: 0, letterSpacing: '10px' }}
          animate={{ opacity: 1, letterSpacing: '2.5px' }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          GERMAN RISING LEAGUE
        </motion.span>

        <h1 className="grl-title" aria-label="Together we rise">
          <span aria-hidden="true">
            {['Together', 'we', 'rise'].map(word => (
              <span key={word} className={`grl-word${word === 'rise' ? ' grl-rise' : ''}`}>
                {[...word].map(ch => {
                  const i = idx++
                  return (
                    <motion.span
                      key={i}
                      className="grl-letter"
                      initial={reduce ? false : { opacity: 0, y: 60, filter: 'blur(12px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.7, delay: 0.5 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {word === 'rise' ? <span className="grl-bob" style={{ animationDelay: `${i * 0.12}s` }}>{ch}</span> : ch}
                    </motion.span>
                  )
                })}
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          className="grl-sub"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.5 }}
        >
          Die German Rising League ist eine Turnier-Community für Call of Duty – mit Ranking, fairen Teams und klaren Regelwerken.
        </motion.p>

        <motion.div
          className="grl-tl-note"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.7 }}
        >
          <img src="/images/tl-logo-v2.webp" alt="" />
          <span><strong>TEAM LAZER</strong> hostet die GRL-Bots, stellt die Technik bereit und hilft bei der Verwaltung.</span>
        </motion.div>

        <div className="grl-scroll" aria-hidden="true">
          <i className="fa-solid fa-chevron-down" />
          <i className="fa-solid fa-chevron-down" />
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── ZAHLEN ───────────────────────── */
function StatsBand({ live }) {
  const stats = [
    { label: 'online', value: live?.online, live: true },
    { label: 'Mitglieder', value: live?.members },
    { label: 'Turniersysteme', value: TURNIERE[0][2].length },
    { label: 'Spielmodi', value: TURNIERE[1][2].length },
  ]
  return (
    <div className="container" style={{ position: 'relative', zIndex: 3, marginTop: -46 }}>
      <motion.div
        className="grl-stats"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {stats.map(s => (
          <div className="grl-stat" key={s.label}>
            <div className="grl-stat-num"><CountUp value={s.value} /></div>
            <div className="grl-stat-label">{s.live && <i className="grl-live" />}{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ───────────────────────── DISCORD ───────────────────────── */
function GrlDiscordCard({ live }) {
  const fmt = n => new Intl.NumberFormat('de-DE').format(n)
  return (
    <TiltCard className="grl-dc" max={6}>
      <div className="grl-dc-head">
        <img className="grl-dc-icon" src={live?.icon || '/images/grl-logo.webp'} alt="Server-Icon der German Rising League" width="68" height="68" />
        <div>
          <div className="grl-dc-name">{live?.name || 'German Rising League [GRL]'}</div>
          <div className="grl-dc-sub"><i className="fa-brands fa-discord" /> Discord-Server</div>
        </div>
      </div>
      {live && live.members ? (
        <div className="grl-dc-stats">
          <span><i className="grl-dc-dot on" /><strong>{fmt(live.online)}</strong> online</span>
          <span><i className="grl-dc-dot" /><strong>{fmt(live.members)}</strong> Mitglieder</span>
        </div>
      ) : null}
      <a className="btn btn-primary" href={LINKS.grlDiscord} target="_blank" rel="noopener noreferrer">
        <i className="fa-brands fa-discord" /> Server beitreten
      </a>
    </TiltCard>
  )
}

/* ───────────────────────── KACHELN ───────────────────────── */
function Tiles({ items }) {
  return (
    <motion.div className="grl-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
      {items.map(([icon, t, s]) => (
        <motion.div key={t} variants={fadeItem} style={{ height: '100%' }}>
          <TiltCard className="grl-tile"><i className={icon} /><h3>{t}</h3><p>{s}</p></TiltCard>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ───────────────────────── FADENKREUZ ───────────────────────── */
function Crosshair() {
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 110, damping: 14 })
  const y = useSpring(useMotionValue(0), { stiffness: 110, damping: 14 })
  const onMove = e => {
    if (reduce || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set(Math.max(-320, Math.min(320, (e.clientX - (r.left + r.width / 2)) * 0.7)))
    y.set(Math.max(-30, Math.min(30, (e.clientY - (r.top + r.height / 2)) * 0.12)))
  }
  const onLeave = () => { x.set(0); y.set(0) }
  return (
    <div className="grl-aim" onPointerMove={onMove} onPointerLeave={onLeave} aria-hidden="true">
      <motion.svg className="grl-cross" viewBox="0 0 200 200" fill="none" stroke="#22d3ee" strokeWidth="2" style={{ x, y }}>
        <g className="rot"><circle cx="100" cy="100" r="84" strokeDasharray="6 10" opacity=".7" /></g>
        <g className="rot2"><circle cx="100" cy="100" r="62" strokeDasharray="30 12" /></g>
        <circle className="ping" cx="100" cy="100" r="40" strokeWidth="1.5" />
        <path d="M100 4v38M100 158v38M4 100h38M158 100h38" strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="100" r="4" fill="#22d3ee" stroke="none" />
      </motion.svg>
    </div>
  )
}

/* ───────────────────────── SEITE ───────────────────────── */
export default function GRL() {
  useSEO({
    title: 'German Rising League [GRL] | TEAM LAZER',
    description: 'German Rising League: Turnier-Community für Call of Duty mit Ranking, fairen Teams und eigenen Regelwerken.',
  })
  const live = useDiscordInvite(GRL_INVITE_CODE)

  return (
    <div className="page-wrapper grl-page">
      <Hero />
      <StatsBand live={live} />

      <div className="grl-mq-stack" aria-hidden="true">
        <Marquee items={MODES_A} />
        <Marquee items={MODES_B} reverse outline />
      </div>

      {/* DER SERVER */}
      <section className="section-pad">
        <div className="container">
          <div className="grl-split">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              <motion.div variants={fadeItem}><GrlDiscordCard live={live} /></motion.div>
            </motion.div>
            <motion.div className="grl-about" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              <motion.div variants={fadeItem}>
                <h3>Der GRL-Discord</h3>
                <p>
                  Hier findet die GRL statt: Turnier-Infos, Anmeldungen, Leaderboard und Spielersuche an einem Ort.
                  Wer mitspielen will, bekommt zuerst ein Ranking – damit die Teams später möglichst fair zusammengestellt werden können.
                </p>
                <p>Fairplay, Transparenz und gleiche Bedingungen für alle stehen an erster Stelle.</p>
                <div className="grl-facts">
                  <span>Turniere in mehreren Formaten</span>
                  <span>Teilnahme ab 18 Jahren</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EINSTIEG */}
      <section className="bg-alt section-pad">
        <div className="container">
          <Heading tag="EINSTIEG" before="So kommst du" highlight="rein" sub="In vier Schritten vom Beitritt zum ersten Turnier." />
          <Steps steps={STEPS} />
        </div>
      </section>

      {/* TURNIERE */}
      <section className="section-pad">
        <div className="container">
          <Heading
            tag="TURNIERE"
            before="Systeme, Modi &"
            highlight="Teams"
            sub="Gespielt wird in Public Lobbys und Custom Lobbys. Für Killrace, TKR und Custom-Lobby gibt es jeweils ein eigenes Regelwerk."
          />
          <motion.div className="grl-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
            {TURNIERE.map(([icon, t, list]) => (
              <motion.div key={t} variants={fadeItem} style={{ height: '100%' }}>
                <TiltCard className="grl-tile">
                  <i className={icon} />
                  <h3>{t}</h3>
                  <motion.ul variants={listVar} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    {list.map(x => <motion.li key={x} variants={liVar}>{x}</motion.li>)}
                  </motion.ul>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="bg-alt section-pad">
        <div className="container">
          <Heading tag="COMMUNITY" before="Mehr als" highlight="Turniere" />
          <Tiles items={COMMUNITY} />
          <div className="grl-cta">
            <Link to="/software" className="btn btn-secondary"><i className="fa-solid fa-robot" /> GRL-Bots ansehen</Link>
          </div>
        </div>
      </section>

      {/* SHOOTER */}
      <section className="section-pad">
        <div className="container">
          <Crosshair />
          <Heading
            tag="IN ENTWICKLUNG"
            before="GRL Discord"
            highlight="Shooter"
            sub="Ein Browser-Multiplayer-Shooter im Stil von Call of Duty – gebaut mit Babylon.js und Nakama."
          />
          <Tiles items={GAME} />
        </div>
      </section>
    </div>
  )
}
