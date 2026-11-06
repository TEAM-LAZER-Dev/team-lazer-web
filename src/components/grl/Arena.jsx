import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import CountUp from './CountUp'
import { ARENA, MULTIPLAYER, WEEK } from '../../data/grl'

const TABS = [...Object.keys(ARENA), 'Multiplayer']

/* Reiter: Systeme · Modi · Teamformate · Multiplayer – Inhalt wechselt nur auf Klick. */
export default function Arena() {
  const [tab, setTab] = useState(TABS[0])
  const reduce = useReducedMotion()
  const pop = i => (reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: i * 0.045 } })

  return (
    <div className="grl-arena">
      <div className="grl-tabs" role="tablist" aria-label="Turniere und Modi">
        {TABS.map(t => (
          <button key={t} role="tab" aria-selected={tab === t} className={`grl-tab${tab === t ? ' on' : ''}`} onClick={() => setTab(t)}>
            {t}
            {tab === t && !reduce && <motion.i layoutId="grl-tab-line" className="grl-tab-line" />}
            {tab === t && reduce && <i className="grl-tab-line" />}
          </button>
        ))}
      </div>

      <div className="grl-arena-body" role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {tab === 'Multiplayer' ? (
              <>
                <p className="grl-arena-note">
                  Der Multiplayer-Bereich ist live: Challs rund um die Uhr, ein privater Match-Channel mit Voice und gelosten Maps –
                  nach dem Match trägst du Ergebnis und Screenshot ein, der Gegner bestätigt.
                </p>
                <div className="grl-mp">
                  {MULTIPLAYER.map((m, i) => (
                    <motion.div className="grl-hud grl-mp-card" key={m.big} {...pop(i)}>
                      <span className="grl-mp-big">{m.big}</span>
                      <h4>{m.title}</h4>
                      <p>{m.text}</p>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="grl-chips">
                {ARENA[tab].map((x, i) => (
                  <motion.span className="grl-chip" key={x} {...pop(i)}>{x}</motion.span>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grl-hud grl-week">
        <div className="grl-week-label">{WEEK.label}</div>
        <div className="grl-week-grid">
          {WEEK.items.map(w => (
            <div key={w.l}>
              <div className="grl-week-n"><CountUp value={w.v} duration={1.4} /></div>
              <div className="grl-week-l">{w.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
