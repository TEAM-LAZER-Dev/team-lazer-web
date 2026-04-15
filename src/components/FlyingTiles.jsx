import { useEffect, useRef } from 'react'

export default function FlyingTiles() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const spawnTile = () => {
      const tile = document.createElement('div')
      tile.className = 'bg-tile'

      // Size: 35–75px — not too small, not too large
      const size = Math.random() * 40 + 35
      tile.style.width  = size + 'px'
      tile.style.height = size + 'px'

      // Random X position across the full width, with slight padding
      tile.style.left = (Math.random() * 95) + '%'

      // Duration: 18–32s — slow and smooth
      const dur = Math.random() * 14 + 18
      tile.style.animationDuration = dur + 's'

      // Random rotation direction per tile (positive = right, negative = left)
      const sign = () => Math.random() > 0.5 ? 1 : -1
      tile.style.setProperty('--rx', (Math.random() * 40 + 20) * sign() + 'deg')
      tile.style.setProperty('--ry', (Math.random() * 40 + 20) * sign() + 'deg')

      container.appendChild(tile)
      tile.addEventListener('animationend', () => tile.remove(), { once: true })
    }

    // Staggered initial burst
    for (let i = 0; i < 7; i++) {
      setTimeout(spawnTile, i * 500)
    }

    // Spawn interval — one new tile every ~2s
    const interval = setInterval(spawnTile, 2000)
    return () => clearInterval(interval)
  }, [])

  return <div ref={containerRef} className="tile-container" />
}
