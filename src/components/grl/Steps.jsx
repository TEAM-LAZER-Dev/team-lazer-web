import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'

// Timeline: Die Linie zeichnet sich beim Scrollen, jeder Schritt "zündet", wenn sie ihn erreicht.
function Step({ i, n, title, text, progress, reduce }) {
  const start = (i - 0.35) / n
  const lit = useTransform(progress, [Math.max(0, start), Math.max(0.01, start + 0.14)], [0, 1])
  const cardOpacity = useTransform(lit, [0, 1], [0.35, 1])
  const cardY = useTransform(lit, [0, 1], [22, 0])
  const scale = useTransform(lit, [0, 1], [0.86, 1])
  return (
    <li className="grl-step">
      <motion.div className="grl-step-dot" style={reduce ? undefined : { scale }}>
        <motion.span className="grl-step-glow" style={reduce ? { opacity: 1 } : { opacity: lit }} />
        <span className="grl-step-n">{i + 1}</span>
      </motion.div>
      <motion.div className="grl-step-card" style={reduce ? undefined : { opacity: cardOpacity, y: cardY }}>
        <h3>{title}</h3>
        <p>{text}</p>
      </motion.div>
    </li>
  )
}

export default function Steps({ steps }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const clipX = useTransform(p, v => `inset(0 ${(1 - v) * 100}% 0 0)`)
  const clipY = useTransform(p, v => `inset(0 0 ${(1 - v) * 100}% 0)`)

  return (
    <div className="grl-steps" ref={ref}>
      <div className="grl-steps-rail rail-x"><motion.div className="grl-steps-fill" style={reduce ? undefined : { clipPath: clipX }} /></div>
      <div className="grl-steps-rail rail-y"><motion.div className="grl-steps-fill" style={reduce ? undefined : { clipPath: clipY }} /></div>
      <ol className="grl-steps-list">
        {steps.map(([title, text], i) => (
          <Step key={title} i={i} n={steps.length} title={title} text={text} progress={p} reduce={reduce} />
        ))}
      </ol>
    </div>
  )
}
