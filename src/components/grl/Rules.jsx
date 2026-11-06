import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { RULES } from '../../data/grl'

/* Regelwerk-Karten: Klick (oder Enter) dreht sie um und zeigt die wichtigsten Punkte. */
function Card({ r, i }) {
  const [flipped, setFlipped] = useState(false)
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="grl-flip-wrap"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        className="grl-flip"
        aria-pressed={flipped}
        aria-label={`${r.full}: ${flipped ? 'Vorderseite zeigen' : 'wichtige Punkte zeigen'}`}
        onClick={() => setFlipped(f => !f)}
      >
        <motion.span
          className="grl-flip-in"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="grl-flip-face front grl-hud">
            <i className={r.icon} />
            <strong>{r.name}</strong>
            <em>{r.full}</em>
            <small><i className="fa-solid fa-rotate" /> Umdrehen</small>
          </span>
          <span className="grl-flip-face back grl-hud">
            <strong>{r.name}</strong>
            <ul>{r.points.map(p => <li key={p}>{p}</li>)}</ul>
          </span>
        </motion.span>
      </button>
    </motion.div>
  )
}

export default function Rules() {
  return (
    <div className="grl-rules">
      {RULES.map((r, i) => <Card key={r.id} r={r} i={i} />)}
    </div>
  )
}
