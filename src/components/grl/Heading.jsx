import { Fragment } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Abschnitts-Überschrift: Tag scannt ein, Wörter steigen einzeln aus einer Maske auf.
export default function Heading({ tag, before, highlight, sub, left = false }) {
  const reduce = useReducedMotion()
  const words = [...before.split(' ').map(w => ({ w })), { w: highlight, hl: true }]
  return (
    <div className={`grl-head${left ? ' left' : ''}`}>
      <motion.span
        className="section-tag grl-tag"
        initial={reduce ? false : { opacity: 0, letterSpacing: '8px' }}
        whileInView={{ opacity: 1, letterSpacing: '2.5px' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {tag}
      </motion.span>
      <h2 className="grl-h2">
        {words.map(({ w, hl }, i) => (
          <Fragment key={w + i}>
          <span className="grl-mask">
            <motion.span
              className={hl ? 'grl-hl' : undefined}
              initial={reduce ? false : { y: '115%', rotate: 4 }}
              whileInView={{ y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}
            </motion.span>
          </span>{' '}
          </Fragment>
        ))}
      </h2>
      {sub && (
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  )
}
