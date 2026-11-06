import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useSEO } from '../lib/seo'
import { LINKS, GRL_INVITE_CODE } from '../data/site'
import { STAGES } from '../data/grl'
import { useDiscordInvite } from '../lib/discord'
import CountUp from '../components/grl/CountUp'
import Heading from '../components/grl/Heading'
import Bracket from '../components/grl/Bracket'
import Ladder from '../components/grl/Ladder'
import Arena from '../components/grl/Arena'
import Rules from '../components/grl/Rules'
import Tour from '../components/grl/Tour'
import '../styles/grl.css'

const EASE = [0.16, 1, 0.3, 1]

function Rise({ children, delay = 0, className }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ───────── HERO ───────── */
function Hero() {
  const reduce = useReducedMotion()
  const line = i => (reduce ? {} : {
    initial: { clipPath: 'inset(-30% 100% -30% -30%)', x: -36 },
    animate: { clipPath: 'inset(-30% -30% -30% -30%)', x: 0 },
    transition: { duration: 0.85, delay: 0.25 + i * 0.16, ease: EASE },
  })
  const fade = d => (reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: d } })

  return (
    <section className="grl-hero">
      <div className="container grl-hero-grid">
        <div className="grl-hero-text">
          <motion.div className="grl-kicker" {...fade(0.1)}>
            <i /> GERMAN RISING LEAGUE <b>[GRL]</b>
          </motion.div>

          <h1 className="grl-h1" aria-label="Together we rise">
            {['Together', 'we', 'rise'].map((w, i) => (
              <span className="grl-h1-line" key={w} aria-hidden="true">
                <motion.span className={i === 2 ? 'grl-h1-rise' : undefined} {...line(i)}>{w}</motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="grl-lead" {...fade(1)}>
            Turnier-Community für Warzone – mit eigenem Ranking, TKR- und Killrace-Events, einem Multiplayer-Bereich und der Hall of Fame.
          </motion.p>

          <motion.div className="grl-cta-row" {...fade(1.15)}>
            <a className="btn btn-primary" href={LINKS.grlDiscord} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-discord" /> Server beitreten
            </a>
            <a className="btn btn-secondary" href="#aufstieg">So kommst du rein <i className="fa-solid fa-arrow-down" /></a>
          </motion.div>

          <motion.p className="grl-tl" {...fade(1.3)}>
            <img src="/images/tl-logo-v2.webp" alt="" /> Bots und Technik der GRL laufen über TEAM LAZER.
          </motion.p>
        </div>

        <div className="grl-hero-art">
          <Bracket className="grl-bracket" />
        </div>
      </div>
    </section>
  )
}

/* ───────── LIVE-LEISTE ───────── */
function LiveStrip({ live }) {
  return (
    <div className="container">
      <Rise>
        <div className="grl-hud grl-strip">
          <div className="grl-strip-id">
            <img src={live?.icon || '/images/grl-logo.webp'} alt="Server-Icon der German Rising League" width="44" height="44" />
            <div>
              <strong>{live?.name || 'German Rising League [GRL]'}</strong>
              <span><i className="grl-dot" /> LIVE</span>
            </div>
          </div>
          <div className="grl-strip-n"><b><CountUp value={live?.online} /></b><span>online</span></div>
          <div className="grl-strip-n"><b><CountUp value={live?.members} /></b><span>Mitglieder</span></div>
          <a className="btn btn-primary" href={LINKS.grlDiscord} target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-discord" /> Beitreten
          </a>
        </div>
      </Rise>
    </div>
  )
}

/* ───────── PROJEKTE ───────── */
function Projects() {
  const items = [
    {
      icon: 'fa-solid fa-gamepad', tag: "Jump 'n' Run", title: 'GRL Rising',
      text: "Das eigene Jump 'n' Run im GRL-Style: 50 Level in 5 Welten nach Warzone-Orten – Downtown, Port, Prison, Airport und Stadium. Am Ende jeder Welt wartet ein Endboss, für Profis gibt es einen Speedrun-Modus mit Medaillen.",
      chips: ['50 Level', '5 Welten', 'Endbosse', 'Bestenliste'],
    },
    {
      icon: 'fa-solid fa-crosshairs', tag: 'In Entwicklung', title: 'GRL Discord Shooter',
      text: 'Ein Browser-Multiplayer-Shooter im Stil von Call of Duty, der direkt als Discord Activity im Voice-Chat läuft. Gebaut mit Babylon.js und Nakama.',
      chips: ['Map Shipment-Mini', '1v1 bis 6v6', 'Discord Activity'],
    },
  ]
  return (
    <div className="grl-projects">
      {items.map((p, i) => (
        <Rise key={p.title} delay={i * 0.1}>
          <article className="grl-hud grl-project">
            <div className="grl-project-top"><i className={p.icon} /><span>{p.tag}</span></div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <div className="grl-project-chips">{p.chips.map(c => <span key={c}>{c}</span>)}</div>
          </article>
        </Rise>
      ))}
    </div>
  )
}

/* ───────── SEITE ───────── */
export default function GRL() {
  useSEO({
    title: 'German Rising League [GRL] | TEAM LAZER',
    description: 'German Rising League: Turnier-Community für Warzone mit eigenem Ranking, TKR- und Killrace-Events, Multiplayer-Bereich und Hall of Fame.',
  })
  const live = useDiscordInvite(GRL_INVITE_CODE)

  // position: sticky (Leiter) braucht einen Body ohne eigenen Scroll-Container -> overflow-x: clip nur auf dieser Seite
  useEffect(() => {
    document.body.classList.add('grl-sticky')
    return () => document.body.classList.remove('grl-sticky')
  }, [])

  return (
    <div className="page-wrapper grl-page">
      <Hero />
      <LiveStrip live={live} />

      <section className="section-pad" id="aufstieg">
        <div className="container">
          <Heading n="01" tag="DER AUFSTIEG" before="Dein Weg nach" highlight="oben" sub="Vom Beitritt bis zu den Champs – so läuft es bei der GRL." />
          <Ladder stages={STAGES} />
        </div>
      </section>

      <section className="section-pad grl-alt">
        <div className="container">
          <Heading n="02" tag="TURNIERE" before="Systeme, Modi &" highlight="Teams" sub="Warzone-Turniere in verschiedenen Formaten – dazu TKR- und Killrace-Events und der neue Multiplayer-Bereich." />
          <Arena />
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <Heading n="03" tag="REGELWERKE" before="Faire Turniere," highlight="klare Regeln" sub="Für TKR, Killrace und Custom-Lobby gibt es jeweils ein eigenes Regelwerk. Karte anklicken für die wichtigsten Punkte." />
          <Rules />
        </div>
      </section>

      <section className="section-pad grl-alt">
        <div className="container">
          <Heading n="04" tag="DER SERVER" before="Ein Blick in den" highlight="Discord" sub="So sieht der GRL-Server von innen aus. Klick dich durch die Kanäle." />
          <Rise><Tour inviteUrl={LINKS.grlDiscord} /></Rise>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <Heading n="05" tag="PROJEKTE" before="Mehr als" highlight="Turniere" />
          <Projects />
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <Rise>
            <div className="grl-hud grl-final">
              <img src="/images/grl-logo.webp" alt="" />
              <div>
                <h2>Bereit aufzusteigen?</h2>
                <p>
                  {live?.online ? <>Gerade sind <strong>{new Intl.NumberFormat('de-DE').format(live.online)}</strong> Spieler online. </> : null}
                  Hol dir dein Ranking und kämpf dich mit deinem Team an die Spitze.
                </p>
              </div>
              <a className="btn btn-primary" href={LINKS.grlDiscord} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-discord" /> Server beitreten
              </a>
            </div>
          </Rise>
        </div>
      </section>
    </div>
  )
}
