import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useSEO } from '../lib/seo'
import { CATEGORIES, DOWNLOADS } from '../data/downloads'

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0 } } }
const fadeItem = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }

export const pageStyle = `
  .dl-filters { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; margin-bottom: 32px; }
  .dl-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .dl-chip { padding: 8px 16px; border-radius: 99px; border: 1px solid var(--border); background: var(--surface); font-size: .85rem; color: var(--muted); transition: .2s; }
  .dl-chip:hover { color: #fff; }
  .dl-chip.on { background: var(--primary-dim); border-color: var(--primary-border); color: #fff; }
  .dl-chip i { margin-right: 6px; }
  .dl-search { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); margin-left: auto; color: var(--muted); }
  .dl-search input { background: none; border: 0; outline: 0; color: #fff; font: inherit; font-size: .88rem; width: 160px; }
  .dl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
  .dl-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 10px; height: 100%; transition: .3s; }
  .dl-card:hover { border-color: rgba(255,255,255,.12); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,.3); }
  .dl-top { display: flex; justify-content: space-between; align-items: center; }
  .dl-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; background: var(--primary-dim); border: 1px solid var(--primary-border); color: var(--primary); }
  .dl-brand { font-size: .68rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 10px; border-radius: 6px; }
  .dl-brand.tl { background: var(--primary-dim); color: #c4b5fd; }
  .dl-brand.grl { background: rgba(34,211,238,.12); color: #67e8f9; }
  .dl-brand.beide { background: rgba(245,158,11,.14); color: #fcd34d; }
  .dl-title { font-family: 'Rajdhani', sans-serif; font-size: 1.3rem; font-weight: 800; color: #fff; }
  .dl-desc { font-size: .86rem; color: rgba(255,255,255,.5); line-height: 1.7; flex: 1; }
  .dl-meta { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: .78rem; color: var(--muted); }
  .dl-card .btn { width: 100%; margin-top: 6px; }
  .dl-card .btn:disabled { opacity: .4; cursor: not-allowed; }
  .dl-empty { text-align: center; color: var(--muted); padding: 60px 0; }
  .dl-note { margin-top: 32px; font-size: .84rem; color: var(--muted); }
  .dl-note i { color: #4ade80; margin-right: 6px; }
  @media (max-width: 600px) { .dl-grid { grid-template-columns: 1fr; gap: 12px; } .dl-search { margin-left: 0; width: 100%; } .dl-search input { width: 100%; } }
`

export function DownloadCard({ item }) {
  const ready = !!item.url
  const isFile = item.type === 'file'
  const external = /^https?:/.test(item.url)
  return (
    <motion.div variants={fadeItem} style={{ height: '100%' }}>
    <div className="dl-card">
      <div className="dl-top">
        <div className="dl-icon"><i className={item.icon} /></div>
        <span className={`dl-brand ${item.brand.toLowerCase()}`}>{item.brand === 'BEIDE' ? 'TL × GRL' : item.brand}</span>
      </div>
      <div className="dl-title">{item.title}</div>
      <p className="dl-desc">{item.desc}</p>
      {isFile && (
        <div className="dl-meta">
          <span><i className="fa-brands fa-windows" /> {item.platform}</span>
          <span>{item.version}</span>
          <span>{item.size}</span>
        </div>
      )}
      {ready ? (
        <a
          className="btn btn-primary"
          href={item.url}
          target={external ? '_blank' : undefined}
          rel="noopener noreferrer"
          {...(isFile && !external ? { download: '' } : {})}
        >
          <i className={isFile ? 'fa-solid fa-download' : 'fa-solid fa-arrow-up-right-from-square'} />
          {isFile ? 'Herunterladen' : 'Beitreten'}
        </a>
      ) : (
        <button className="btn btn-secondary" disabled>
          <i className="fa-solid fa-clock" /> Bald verfügbar
        </button>
      )}
    </div>
    </motion.div>
  )
}

export default function Downloads() {
  useSEO({
    title: 'Downloads | TEAM LAZER × GRL',
    description: 'PC-Programme, Tools, Discord-Links und weitere Downloads von TEAM LAZER und der German Rising League.',
  })

  const [cat, setCat] = useState('alle')
  const [brand, setBrand] = useState('ALLE')
  const [q, setQ] = useState('')

  const list = useMemo(
    () =>
      DOWNLOADS.filter(
        d =>
          (cat === 'alle' || d.category === cat) &&
          (brand === 'ALLE' || d.brand === brand || d.brand === 'BEIDE') &&
          (d.title + ' ' + d.desc).toLowerCase().includes(q.toLowerCase())
      ),
    [cat, brand, q]
  )

  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>

      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">DOWNLOADS</span>
            <h1>Downloads &amp; <span className="highlight">Links</span></h1>
            <p>PC-Programme, Tools und Discord-Einladungen von TEAM LAZER und der German Rising League.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="dl-filters">
            <div className="dl-chips">
              {CATEGORIES.map(c => (
                <button key={c.id} className={`dl-chip${cat === c.id ? ' on' : ''}`} onClick={() => setCat(c.id)}>
                  <i className={c.icon} />{c.label}
                </button>
              ))}
            </div>
            <div className="dl-chips">
              {['ALLE', 'TL', 'GRL'].map(b => (
                <button key={b} className={`dl-chip${brand === b ? ' on' : ''}`} onClick={() => setBrand(b)}>
                  {b === 'ALLE' ? 'Beide' : b}
                </button>
              ))}
            </div>
            <label className="dl-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Suchen …" />
            </label>
          </div>

          {list.length ? (
            <motion.div key={cat + brand + q} className="dl-grid" variants={stagger} initial="hidden" animate="show">
              {list.map(d => <DownloadCard key={d.id} item={d} />)}
            </motion.div>
          ) : (
            <p className="dl-empty">Nichts gefunden. Versuch einen anderen Filter.</p>
          )}

          <p className="dl-note">
            <i className="fa-solid fa-shield-halved" />
            Lade Dateien nur von dieser Seite oder unseren offiziellen Discords herunter.
          </p>
        </div>
      </section>
    </div>
  )
}
