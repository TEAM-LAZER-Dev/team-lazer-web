import { useEffect, useRef } from 'react'

// Aufsteigende Funken (Canvas). Pausiert, wenn nicht sichtbar oder Tab im Hintergrund.
// Reagiert leicht auf die Mausposition. Farben: überwiegend GRL-Türkis, wenige TEAM-LAZER-Lila.
const COLORS = ['34,211,238', '34,211,238', '34,211,238', '103,232,249', '200,250,255', '167,139,250']

export default function RisingParticles({ className }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let raf = 0
    let last = performance.now()
    let visible = true
    let mx = 0.5
    const parts = []

    const spawn = initial => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 12,
      r: Math.random() * 2.1 + 0.6,
      v: Math.random() * 0.7 + 0.25,
      ph: Math.random() * Math.PI * 2,
      a: Math.random() * 0.6 + 0.35,
      c: COLORS[(Math.random() * COLORS.length) | 0],
    })

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round(Math.min(110, Math.max(28, w / 13)))
      while (parts.length < n) parts.push(spawn(true))
      parts.length = n
    }

    const frame = now => {
      raf = requestAnimationFrame(frame)
      if (!visible || document.hidden) { last = now; return }
      const dt = Math.min(48, now - last) / 16.67
      last = now
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      for (const p of parts) {
        p.y -= p.v * dt * 1.1
        p.x += (Math.sin(now * 0.001 + p.ph) * 0.35 + (mx - 0.5) * 0.7) * dt
        if (p.y < -12 || p.x < -20 || p.x > w + 20) Object.assign(p, spawn(false), { x: Math.random() * w })
        const edge = Math.min(1, p.y / (h * 0.3), (h - p.y + 12) / 40)
        const alpha = Math.max(0, p.a * edge)
        if (alpha <= 0.01) continue
        if (p.r > 1.6) { ctx.shadowBlur = 10; ctx.shadowColor = `rgba(${p.c},.9)` } else { ctx.shadowBlur = 0 }
        ctx.fillStyle = `rgba(${p.c},${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const onMove = e => {
      const r = canvas.getBoundingClientRect()
      mx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    }

    resize()
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting }, { threshold: 0 })
    io.observe(canvas)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
