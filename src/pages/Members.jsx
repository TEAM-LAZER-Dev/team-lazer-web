import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSEO } from '../lib/seo'
import { MEMBERS } from '../data/members'

const TIER_CONFIG = {
  'owner':    { label: 'Owner',    color: '#a78bfa', border: 'rgba(124,58,237,0.55)', bg: 'rgba(124,58,237,0.07)', glow: 'rgba(124,58,237,0.25)', icon: 'fa-crown'   },
  'co-owner': { label: 'Co-Owner', color: '#38bdf8', border: 'rgba(14,165,233,0.45)',  bg: 'rgba(14,165,233,0.07)',  glow: 'rgba(14,165,233,0.2)',  icon: 'fa-star'    },
  'co-dev':   { label: 'Co-Dev',   color: '#4ade80', border: 'rgba(74,222,128,0.35)',  bg: 'rgba(74,222,128,0.05)',  glow: 'rgba(74,222,128,0.15)', icon: 'fa-code'    },
}

const pageStyle = `
  /* ── cards ── */
  .mt-row { display: flex; align-items: flex-start; justify-content: center; gap: 0; }

  .mt-card {
    width: 210px; min-height: 260px;
    border-radius: 20px;
    padding: 28px 18px 22px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
    position: relative; overflow: hidden;
    transition: transform .3s, box-shadow .3s;
    flex-shrink: 0;
  }
  .mt-card:hover { transform: translateY(-5px); }
  .mt-card.is-featured { transform: translateY(-10px) !important; }
  .mt-card.is-featured:hover { transform: translateY(-14px) !important; }
  .mt-card.is-owner { width: 210px; }

  .mt-card-glow {
    position: absolute; top: -40px; left: 50%; transform: translateX(-50%);
    width: 180px; height: 180px; border-radius: 50%;
    filter: blur(48px); opacity: .18; pointer-events: none;
  }

  /* ── connector between two cards ── */
  .mt-hline {
    width: 32px; flex-shrink: 0;
    height: 1px; align-self: flex-start;
    margin-top: 71px; /* center on avatar (28px padding + 86px/2 avatar) */
  }

  /* ── avatar ── */
  .mt-avatar {
    width: 86px; height: 86px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border-width: 2px; border-style: solid;
    margin-bottom: 16px; overflow: hidden; position: relative; flex-shrink: 0;
  }
  .mt-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .mt-initial { font-family:'Rajdhani',sans-serif; font-size: 2.3rem; font-weight: 900; }
  .mt-ring {
    position: absolute; inset: -7px; border-radius: 50%;
    border: 1px dashed currentColor; opacity: .28;
    animation: mt-spin 20s linear infinite; pointer-events: none;
  }
  @keyframes mt-spin { to { transform: rotate(360deg); } }

  /* ── badge ── */
  .mt-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: .6rem; font-weight: 800; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 2px 9px; border-radius: 7px;
    border-width: 1px; border-style: solid; margin-bottom: 9px;
    min-height: 22px;
  }

  /* ── text ── */
  .mt-name { font-family:'Rajdhani',sans-serif; font-size: 1.2rem; font-weight: 900; color:#fff; margin-bottom: 2px; min-height: 30px; display:flex; align-items:center; justify-content:center; }
  .mt-name.lg { font-size: 1.2rem; min-height: 30px; }
  .mt-role { font-size: .76rem; color: var(--muted); margin-bottom: 0; min-height: 40px; display:flex; align-items:center; justify-content:center; line-height:1.4; text-align:center; padding: 0 4px; }
  .mt-portfolio-link {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: .7rem; font-weight: 600;
    color: var(--primary); opacity: .75;
    text-decoration: none; margin-top: 8px;
    padding: 3px 10px; border-radius: 6px;
    border: 1px solid rgba(124,58,237,.2);
    background: rgba(124,58,237,.06);
    transition: opacity .2s, border-color .2s;
  }
  .mt-portfolio-link:hover { opacity: 1; border-color: rgba(124,58,237,.45); }
  .mt-skills { display:flex; flex-wrap:wrap; gap:5px; justify-content:center; }
  .mt-skill { font-size:.68rem; font-weight:500; padding:2px 8px; border-radius:5px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); color:rgba(255,255,255,.45); }

  /* ── separator ── */
  .mt-separator {
    display: flex; align-items: center; gap: 16px;
    margin: 40px 0 36px; width: 100%;
  }
  .mt-separator-line { flex: 1; height: 1px; background: var(--border); }
  .mt-separator-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--primary); flex-shrink: 0;
  }

  /* ── placeholder ── */
  .mt-placeholder {
    width: 200px; min-height: 240px;
    border-radius: 20px; flex-shrink: 0;
    border: 1px dashed rgba(255,255,255,.1);
    background: rgba(255,255,255,.015);
    display: flex; align-items: center; justify-content: center;
  }
  .mt-placeholder-inner {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .mt-placeholder-circle {
    width: 64px; height: 64px; border-radius: 50%;
    border: 1px dashed rgba(255,255,255,.12);
    display: flex; align-items: center; justify-content: center;
  }
  .mt-placeholder-circle i { font-size: 1.2rem; color: rgba(255,255,255,.1); }
  .mt-placeholder-text { font-size: .68rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.15); }

  /* ── between placeholder ── */
  .mt-ph-gap { width: 20px; flex-shrink: 0; }

  /* ── featured border beam ── */
  .featured-wrap {
    position: relative;
    border-radius: 22px;
    z-index: 2;
    transform: translateY(-10px);
    flex-shrink: 0;
    transition: transform .3s;
  }
  .featured-wrap:hover { transform: translateY(-14px); }
  .featured-wrap > .mt-card {
    position: relative;
    z-index: 1;
    border: 1px solid rgba(124,58,237,0.3) !important;
    transform: none !important;
    box-shadow: 0 8px 40px rgba(124,58,237,0.3), 0 2px 12px rgba(0,0,0,0.4) !important;
  }
  .featured-wrap > .mt-card:hover { transform: none !important; }

  /* ── cta ── */
  .mt-cta { background:rgba(124,58,237,.06); border:1px solid rgba(124,58,237,.18); border-radius:22px; padding:52px 40px; text-align:center; margin-top:70px; }
  .mt-cta h3 { font-family:'Rajdhani',sans-serif; font-size:clamp(1.4rem,3vw,2rem); font-weight:800; text-transform:uppercase; margin-bottom:10px; }
  .mt-cta p { color:var(--muted); font-size:.93rem; margin-bottom:28px; max-width:480px; margin-left:auto; margin-right:auto; }

  /* ── responsive ── */
  @media(max-width:768px) {
    .mt-row { flex-direction: column; align-items: center; gap: 16px; }
    .mt-hline { display: none; }
    .mt-card, .mt-card.is-owner { width: 100%; max-width: 300px; }
    .mt-placeholder { width: 100%; max-width: 300px; }
    .mt-ph-gap { display: none; }
    .mt-cta { padding: 32px 20px; }
  }
`

function MemberCard({ member, featured = false }) {
  const t = TIER_CONFIG[member.tier] || TIER_CONFIG['co-dev']
  const isOwner = member.tier === 'owner'
  return (
    <motion.div
      className={`mt-card${isOwner ? ' is-owner' : ''}${featured ? ' is-featured' : ''}`}
      style={featured ? {
        background: `linear-gradient(160deg, rgba(124,58,237,0.18), rgba(124,58,237,0.06))`,
        border: `2px solid rgba(124,58,237,0.7)`,
        boxShadow: `0 0 0 1px rgba(124,58,237,0.2), 0 8px 40px rgba(124,58,237,0.35), 0 2px 12px rgba(0,0,0,0.4)`,
        transform: 'translateY(-10px)',
        zIndex: 2,
      } : { background: `linear-gradient(160deg,${t.bg},rgba(255,255,255,.01))`, border:`1px solid ${t.border}`, boxShadow:`0 6px 28px rgba(0,0,0,.22)` }}
      initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.5 }}
    >
      <div className="mt-card-glow" style={{ background: t.glow }} />

      {/* Avatar */}
      <div className="mt-avatar" style={{ borderColor: featured ? 'rgba(124,58,237,0.8)' : t.border, background:`${t.color}18`, boxShadow: featured ? `0 0 32px rgba(124,58,237,0.5)` : `0 0 20px ${t.glow}` }}>
        {member.avatar
          ? <img src={member.avatar} alt={member.name} />
          : <span className="mt-initial" style={{ color: t.color }}>{member.name[0].toUpperCase()}</span>
        }
        <span className="mt-ring" style={{ color: t.color }} />
      </div>

      {/* Badge */}
      <div className="mt-badge" style={{ color:t.color, background:`${t.color}12`, borderColor:`${t.color}28` }}>
        <i className={`fa-solid ${t.icon}`} style={{ fontSize:'.55rem' }} />
        {t.label}
      </div>

      {/* Text */}
      <div className="mt-name">{member.name}</div>
      <div className="mt-role">{member.role}</div>
      {member.portfolio && (
        <Link to={member.portfolio} className="mt-portfolio-link">
          zum Portfolio <i className="fa-solid fa-arrow-right" style={{ fontSize: '.6rem' }} />
        </Link>
      )}
      {member.skills.length > 0 && (
        <div className="mt-skills">
          {member.skills.slice(0,3).map(s => (
            <span key={s} className="mt-skill" style={{ borderColor:`${t.color}20`, color:`${t.color}99` }}>{s}</span>
          ))}
        </div>
      )}
    </motion.div>
  )
}


function Connector({ color }) {
  return <div className="mt-hline" style={{ background:`${color}60` }} />
}

function PlaceholderCard() {
  return (
    <motion.div
      className="mt-placeholder"
      initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.5 }}
    >
      <div className="mt-placeholder-inner">
        <div className="mt-placeholder-circle">
          <i className="fa-solid fa-user-plus" />
        </div>
        <span className="mt-placeholder-text">Offen</span>
      </div>
    </motion.div>
  )
}

export default function Members() {
  useSEO({ title:'Mitglieder | TEAM LAZER', description:'Das Team hinter TEAM LAZER – Gaming, Entwicklung und Community aus Deutschland.' })

  // Top row: Wizzard – fivozo (center, featured) – Nico
  const raw = MEMBERS.filter(m => !m.placeholder)
  const fivozo  = raw.find(m => m.id === 'fivozo')
  const others  = raw.filter(m => m.id !== 'fivozo')
  const left    = others.slice(0, Math.floor(others.length / 2))
  const right   = others.slice(Math.floor(others.length / 2))
  const named   = [...left, fivozo, ...right]

  // Bottom row: 4 placeholder slots
  const placeholders = [0,1,2,3]

  // connector color = blend between adjacent members
  const connColor = 'rgba(255,255,255,0.18)'

  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>

      {/* ── HERO ── */}
      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.55 }}>
            <span className="section-tag">DAS TEAM</span>
            <h1>Mitglieder</h1>
            <p>Entwicklung · Gaming · Community – die Köpfe hinter TEAM LAZER.</p>
          </motion.div>
        </div>
      </section>

      {/* ── TREE ── */}
      <section className="section-pad" style={{ paddingTop:0 }}>
        <div className="container">

          {/* ROW 1 – named members */}
          <div className="mt-row">
            {named.map((m, i) => (
              <>
                {m.id === 'fivozo' ? (
                  <div key={m.id} className="featured-wrap">
                    <MemberCard member={m} featured />
                  </div>
                ) : (
                  <MemberCard key={m.id} member={m} />
                )}
                {i < named.length - 1 && <Connector key={`c${i}`} color={connColor} />}
              </>
            ))}
          </div>

          {/* SEPARATOR */}
          <div className="mt-separator">
            <div className="mt-separator-line" />
            <div className="mt-separator-dot" />
            <div className="mt-separator-line" />
          </div>

          {/* ROW 2 – placeholder slots */}
          <div className="mt-row" style={{ gap:'20px' }}>
            {placeholders.map(i => <PlaceholderCard key={i} />)}
          </div>

          {/* CTA */}
          <motion.div className="mt-cta" initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ duration:.5 }}>
            <h3>Werde Teil des Teams</h3>
            <p>Du zockst, codest, designst oder willst einfach dabei sein?<br />Melde dich – wir freuen uns.</p>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/contact" className="btn btn-primary"><i className="fa-solid fa-paper-plane" /> Kontakt aufnehmen</Link>
              <Link to="/bots" className="btn btn-secondary"><i className="fa-brands fa-discord" /> Unsere Bots</Link>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  )
}
