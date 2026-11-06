import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

// Karte mit 3D-Neigung zur Maus und mitwanderndem Lichtfleck (Spotlight).
// Auf Touch-Geräten und bei "Bewegung reduzieren" bleibt sie ruhig.
export default function TiltCard({ children, className = '', max = 7, style, ...rest }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 16, mass: 0.6 })
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 16, mass: 0.6 })

  const onMove = e => {
    if (reduce || e.pointerType === 'touch' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2)
    rx.set(-(py - 0.5) * max * 2)
    ref.current.style.setProperty('--mx', `${px * 100}%`)
    ref.current.style.setProperty('--my', `${py * 100}%`)
  }
  const onLeave = () => { rx.set(0); ry.set(0) }

  return (
    <motion.div
      ref={ref}
      className={`grl-tilt ${className}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, ...style }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...rest}
    >
      <span className="grl-spot" aria-hidden="true" />
      {children}
    </motion.div>
  )
}
