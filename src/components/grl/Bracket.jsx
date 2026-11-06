import { motion, useReducedMotion } from 'framer-motion'

// Turnierbaum (8 Teams -> Sieger). Zeichnet sich einmal, dann leuchtet der Weg des Siegers auf
// und das GRL-Logo steht am Ende. Danach ruht alles.
const SLOT_W = 92
const SLOT_H = 26
const COL_GAP = 150
const ROW_GAP = 50
const TOP = 46
const WINNER = 2 // Index des Siegers in der ersten Runde

function build() {
  const cols = []
  let ys = Array.from({ length: 8 }, (_, i) => TOP + i * ROW_GAP)
  for (let c = 0; c < 4; c++) {
    cols.push({ x: c * COL_GAP, ys })
    ys = ys.reduce((acc, _, i) => (i % 2 === 0 ? [...acc, (ys[i] + ys[i + 1]) / 2] : acc), [])
  }
  const lines = []
  const win = []
  let idx = WINNER
  for (let c = 0; c < 3; c++) {
    const { x, ys: cy } = cols[c]
    const nx = cols[c + 1].x
    const xm = x + SLOT_W + (COL_GAP - SLOT_W) / 2
    for (let m = 0; m < cy.length / 2; m++) {
      const ya = cy[m * 2]
      const yb = cy[m * 2 + 1]
      const yp = cols[c + 1].ys[m]
      lines.push({ c, d: `M${x + SLOT_W} ${ya} H${xm} V${yb} H${x + SLOT_W} M${xm} ${yp} H${nx}` })
    }
    const m = Math.floor(idx / 2)
    const yp = cols[c + 1].ys[m]
    win.push(`M${x + SLOT_W} ${cy[idx]} H${xm} V${yp} H${nx}`)
    idx = m
  }
  return { cols, lines, winD: win.join(' ') }
}

const { cols, lines, winD } = build()
const W = 3 * COL_GAP + 120
const H = TOP * 2 + 7 * ROW_GAP

export default function Bracket({ className }) {
  const reduce = useReducedMotion()
  const vp = { once: true, margin: '-40px' }
  const dur = reduce ? 0 : 0.7
  const champ = cols[3]

  return (
    <svg className={className} viewBox={`-10 0 ${W + 20} ${H}`} role="img" aria-label="Turnierbaum: acht Teams, ein Sieger">
      {/* Linien: Runde für Runde */}
      {lines.map((l, i) => (
        <motion.path
          key={i}
          d={l.d}
          fill="none"
          stroke="rgba(34,211,238,.28)"
          strokeWidth="1.5"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={vp}
          transition={{ duration: dur, delay: reduce ? 0 : 0.5 + l.c * 0.55 + (i % 4) * 0.05, ease: 'easeOut' }}
        />
      ))}

      {/* Plätze der ersten Runde */}
      {cols[0].ys.map((y, i) => (
        <motion.g
          key={i}
          initial={reduce ? false : { opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={vp}
          transition={{ duration: 0.45, delay: reduce ? 0 : 0.1 + i * 0.06 }}
        >
          <rect x="0" y={y - SLOT_H / 2} width={SLOT_W} height={SLOT_H} rx="3" fill="rgba(255,255,255,.035)" stroke={i === WINNER ? 'rgba(34,211,238,.7)' : 'rgba(255,255,255,.12)'} />
          <rect x="9" y={y - 3} width={i % 2 ? 42 : 56} height="6" rx="3" fill={i === WINNER ? 'rgba(34,211,238,.9)' : 'rgba(255,255,255,.28)'} />
        </motion.g>
      ))}

      {/* Plätze der Folgerunden */}
      {[1, 2].map(c => cols[c].ys.map((y, i) => (
        <motion.rect
          key={`${c}-${i}`}
          x={cols[c].x}
          y={y - SLOT_H / 2}
          width={SLOT_W}
          height={SLOT_H}
          rx="3"
          fill="rgba(255,255,255,.03)"
          stroke="rgba(255,255,255,.12)"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={vp}
          transition={{ duration: 0.4, delay: reduce ? 0 : 0.7 + c * 0.55 }}
        />
      )))}

      {/* Weg des Siegers */}
      <motion.path
        d={winD}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,.9))' }}
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={vp}
        transition={{ duration: reduce ? 0 : 1.5, delay: reduce ? 0 : 2.3, ease: 'easeInOut' }}
      />

      {/* Sieger */}
      <motion.g
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={vp}
        transition={{ duration: 0.8, delay: reduce ? 0 : 3.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <rect x={champ.x - 6} y={champ.ys[0] - 52} width="116" height="104" rx="6" fill="rgba(34,211,238,.08)" stroke="#22d3ee" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 14px rgba(34,211,238,.55))' }} />
        <image href="/images/grl-logo.webp" x={champ.x + 8} y={champ.ys[0] - 44} width="88" height="88" />
      </motion.g>
    </svg>
  )
}
