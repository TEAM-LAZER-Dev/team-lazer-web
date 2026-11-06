import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CHANNELS } from '../../data/grl'

/* Server-Rundgang: Nachbau der Kanalliste. Kanäle mit Beschreibung lassen sich anklicken. */
const FIRST = CHANNELS.flatMap(c => c.list).find(ch => ch.desc)

export default function Tour({ inviteUrl }) {
  const [sel, setSel] = useState(FIRST)
  const reduce = useReducedMotion()

  return (
    <div className="grl-hud grl-tour">
      <div className="grl-tour-chrome" aria-hidden="true"><i /><i /><i /><span>German Rising League [GRL]</span></div>
      <div className="grl-tour-grid">
        <nav className="grl-tour-side" aria-label="Kanäle des GRL-Servers">
          {CHANNELS.map(c => (
            <div key={c.cat} className="grl-tour-cat">
              <div className="grl-tour-catname"><i className="fa-solid fa-chevron-down" /> {c.cat}</div>
              {c.list.map(ch => {
                const on = !!ch.desc
                const cur = sel && sel.n === ch.n
                return (
                  <button
                    key={ch.n}
                    type="button"
                    disabled={!on}
                    aria-current={cur ? 'true' : undefined}
                    className={`grl-ch${cur ? ' cur' : ''}${on ? '' : ' off'}`}
                    onClick={() => on && setSel(ch)}
                  >
                    <span className="e">{ch.e}</span>
                    <span className="t">{ch.voice ? ch.n.replace(/-/g, ' ') : ch.n}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="grl-tour-main">
          <div className="grl-tour-title"><i className="fa-solid fa-hashtag" /> {sel.n}</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={sel.n}
              className="grl-msg"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <img src="/images/grl-logo.webp" alt="" />
              <div>
                <div className="grl-msg-who">GRL <span>Server-Info</span></div>
                <p>{sel.desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <p className="grl-tour-hint">Anklickbare Kanäle sind hervorgehoben – der Rest ist im Server zu entdecken.</p>
          <a className="btn btn-primary" href={inviteUrl} target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-discord" /> Selbst reinschauen
          </a>
        </div>
      </div>
    </div>
  )
}
