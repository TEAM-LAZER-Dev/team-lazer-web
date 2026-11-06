import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

// Zahl, die beim Sichtbarwerden hochzählt. Ändert sich der Wert (z. B. Live-Daten), zählt sie von der alten Zahl weiter.
export default function CountUp({ value, duration = 1.8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const from = useRef(0)
  const [text, setText] = useState('–')
  const fmt = n => new Intl.NumberFormat('de-DE').format(Math.round(n))

  useEffect(() => {
    if (value == null || !inView) return undefined
    if (reduce) { setText(fmt(value)); from.current = value; return undefined }
    const ctl = animate(from.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => { from.current = v; setText(fmt(v)) },
    })
    return () => ctl.stop()
  }, [value, inView, reduce, duration])

  return <span ref={ref}>{text}</span>
}
