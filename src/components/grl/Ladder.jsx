import { useRef, useState } from 'react'
import {
  motion, useScroll, useSpring, useTransform, useMotionValueEvent, useReducedMotion,
} from 'framer-motion'

/* Kleine Nachbauten der Oberflächen – bewegen sich einmal, wenn sie ins Bild kommen. */
function Mock({ kind, reduce }) {
  const vp = { once: true, amount: 0.6 }
  const t = (delay = 0) => ({ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : delay })

  if (kind === 'join') {
    return (
      <div className="grl-mock">
        <div className="grl-mock-bar"><i className="fa-solid fa-hashtag" /> regeln</div>
        <div className="grl-mock-row">
          <motion.span className="grl-check" initial={reduce ? false : { scale: 0 }} whileInView={{ scale: 1 }} viewport={vp} transition={{ ...t(0.5), type: 'spring', stiffness: 380, damping: 14 }}>
            <i className="fa-solid fa-check" />
          </motion.span>
          Regeln gelesen und akzeptiert
        </div>
        <motion.div className="grl-mock-pill" initial={reduce ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={t(1)}>
          <i className="fa-solid fa-lock-open" /> Kanäle freigeschaltet
        </motion.div>
      </div>
    )
  }
  if (kind === 'rank') {
    return (
      <div className="grl-mock">
        <div className="grl-mock-bar"><i className="fa-solid fa-ticket" /> Ranking-Antrag</div>
        {['Activision ID', 'Twitch-Link'].map((f, i) => (
          <div className="grl-mock-field" key={f}>
            <span>{f}</span>
            <motion.b initial={reduce ? false : { width: 0 }} whileInView={{ width: i ? '58%' : '44%' }} viewport={vp} transition={{ ...t(0.4 + i * 0.5), ease: 'easeOut', duration: reduce ? 0 : 0.7 }} />
          </div>
        ))}
        <motion.div className="grl-mock-pill ok" initial={reduce ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={t(1.7)}>
          <i className="fa-solid fa-circle-check" /> Ranking vergeben
        </motion.div>
      </div>
    )
  }
  if (kind === 'signup') {
    return (
      <div className="grl-mock">
        <div className="grl-mock-bar"><i className="fa-solid fa-trophy" /> Turnier-Anmeldung</div>
        <div className="grl-mock-row dim">Team · Trio</div>
        <div className="grl-mock-btn">
          <motion.span initial={reduce ? false : { opacity: 1 }} whileInView={{ opacity: 0 }} viewport={vp} transition={t(1.1)}>Anmelden</motion.span>
          <motion.span className="done" initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vp} transition={t(1.1)}>
            <i className="fa-solid fa-check" /> Angemeldet
          </motion.span>
        </div>
      </div>
    )
  }
  if (kind === 'result') {
    return (
      <div className="grl-mock two">
        {['Scoreboard', 'Placement'].map((f, i) => (
          <motion.div className="grl-shot" key={f} initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={t(0.3 + i * 0.35)}>
            <div className="grl-shot-img"><i /><i /><i /><i /></div>
            <span><i className="fa-solid fa-image" /> {f}</span>
          </motion.div>
        ))}
      </div>
    )
  }
  return (
    <div className="grl-mock champs">
      <motion.div initial={reduce ? false : { scale: 0.4, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={vp} transition={{ ...t(0.3), type: 'spring', stiffness: 220, damping: 14 }}>
        <i className="fa-solid fa-crown" />
      </motion.div>
      <b>GRL WINNER</b>
      <span>Champs · Hall of Fame</span>
    </div>
  )
}

function Stage({ s, i, reduce }) {
  return (
    <motion.article
      className="grl-stage"
      initial={reduce ? false : { opacity: 0.25, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ amount: 0.5, margin: '-8% 0px -8% 0px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="grl-stage-n">{String(i + 1).padStart(2, '0')}</div>
      <div className="grl-stage-body">
        <h3>{s.title}</h3>
        <p>{s.text}</p>
        <Mock kind={s.mock} reduce={reduce} />
      </div>
    </motion.article>
  )
}

/* Scroll-Reise: links klettert eine Leiter mit, rechts wechseln die Stationen. */
export default function Ladder({ stages }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const n = stages.length
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 55%', 'end 65%'] })
  useMotionValueEvent(scrollYProgress, 'change', v => setActive(Math.max(0, Math.min(n - 1, Math.floor(v * n)))))
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.5 })
  const frac = useTransform(p, [0.5 / n, 1 - 0.5 / n], [0, 1], { clamp: true })
  const top = useTransform(frac, v => `${v * 100}%`)

  return (
    <div className="grl-ladder" ref={ref}>
      <div className="grl-ladder-side">
        <div className="grl-rail">
          <motion.i className="grl-rail-fill" style={reduce ? { height: '100%' } : { height: top }} />
          {!reduce && <motion.i className="grl-climber" style={{ top }} />}
          {stages.map((s, i) => (
            <div key={s.id} className={`grl-rung${i <= active ? ' on' : ''}${i === active ? ' cur' : ''}`} style={{ top: `${(i / (n - 1)) * 100}%` }}>
              <i />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grl-ladder-main">
        {stages.map((s, i) => <Stage key={s.id} s={s} i={i} reduce={reduce} />)}
      </div>
    </div>
  )
}
