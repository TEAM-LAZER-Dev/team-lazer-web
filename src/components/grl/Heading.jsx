import { Fragment } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Abschnitts-Kopf im Übertragungs-Look: "// 01 — LABEL" mit Linie, die sich einmal zieht, darunter die Überschrift.
export default function Heading({ n, tag, before, highlight, sub }) {
  const reduce = useReducedMotion()
  const words = [...before.split(' ').map(w => ({ w })), { w: highlight, hl: true }]
  const vp = { once: true, margin: '-70px' }
  return (
    <div className="grl-head">
      <div className="grl-lab">
        <span className="grl-lab-n">// {n}</span>
        <span className="grl-lab-t">{tag}</span>
        <motion.i
          className="grl-lab-line"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={vp}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <h2 className="grl-h2">
        {words.map(({ w, hl }, i) => (
          <Fragment key={w + i}>
            <span className="grl-mask">
              <motion.span
                className={hl ? 'grl-hl' : undefined}
                initial={reduce ? false : { y: '110%' }}
                whileInView={{ y: 0 }}
                viewport={vp}
                transition={{ duration: 0.6, delay: 0.07 * i, ease: [0.16, 1, 0.3, 1] }}
              >
                {w}
              </motion.span>
            </span>{' '}
          </Fragment>
        ))}
      </h2>
      {sub && (
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  )
}
