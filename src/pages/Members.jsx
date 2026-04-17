import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSEO } from '../lib/seo'
import { MEMBERS } from '../data/members'

const TIER_CONFIG = {
  'owner':    { label: 'Owner',    color: '#a78bfa', border: 'rgba(124,58,237,0.55)', bg: 'rgba(124,58,237,0.07)', glow: 'rgba(124,58,237,0.25)', icon: 'fa-crown'   },
  'co-owner': { label: 'Co-Owner', color: '#b197fc', border: 'rgba(140,70,245,0.5)',  bg: 'rgba(140,70,245,0.07)',  glow: 'rgba(140,70,245,0.22)', icon: 'fa-star'    },
  'co-dev':   { label: 'Co-Dev',   color: '#4ade80', border: 'rgba(74,222,128,0.35)',  bg: 'rgba(74,222,128,0.05)',  glow: 'rgba(74,222,128,0.15)', icon: 'fa-code'    },
  'supporter':{ label: 'Supporter',color: '#fb923c', border: 'rgba(251,146,60,0.4)',  bg: 'rgba(251,146,60,0.06)',  glow: 'rgba(251,146,60,0.15)', icon: 'fa-heart'   },
  'mod':      { label: 'Moderator',color: '#4ade80', border: 'rgba(74,222,128,0.4)',  bg: 'rgba(74,222,128,0.06)',  glow: 'rgba(74,222,128,0.15)', icon: 'fa-shield'  },
  'partner':  { label: 'Partner',  color: '#38bdf8', border: 'rgba(14,165,233,0.4)',  bg: 'rgba(14,165,233,0.06)',  glow: 'rgba(14,165,233,0.15)', icon: 'fa-handshake'},
}

const pageStyle = `
  /* ═══════════════════════════════════
     OWNER HERO – full-width spotlight
     ═══════════════════════════════════ */
  .owner-spotlight {
    position: relative;
    border-radius: 24px;
    padding: 48px 40px 40px;
    background: linear-gradient(160deg, rgba(124,58,237,0.16), rgba(124,58,237,0.04) 60%, rgba(0,0,0,0));
    border: 1px solid rgba(124,58,237,0.35);
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 40px;
    margin-bottom: 48px;
  }
  .owner-spotlight::before {
    content: '';
    position: absolute;
    top: -80px; left: 50%; transform: translateX(-50%);
    width: 500px; height: 400px;
    background: radial-gradient(ellipse, rgba(124,58,237,0.2), transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  .owner-spotlight::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(124,58,237,0.5), transparent 50%, rgba(124,58,237,0.3));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 1;
  }

  /* animated shimmer on the owner card border */
  @keyframes owner-shimmer {
    0% { opacity: 0.3; transform: translateX(-50%) scale(1); }
    50% { opacity: 0.6; transform: translateX(-50%) scale(1.15); }
    100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
  }
  .owner-spotlight-glow {
    position: absolute;
    bottom: -60px; left: 50%; transform: translateX(-50%);
    width: 70%; height: 120px;
    background: radial-gradient(ellipse, rgba(124,58,237,0.25), transparent 70%);
    filter: blur(30px);
    pointer-events: none;
    animation: owner-shimmer 4s ease-in-out infinite;
    z-index: 0;
  }

  .owner-avatar-wrap {
    position: relative;
    flex-shrink: 0;
    z-index: 2;
  }
  .owner-avatar {
    width: 120px; height: 120px;
    border-radius: 50%;
    border: 3px solid rgba(124,58,237,0.7);
    overflow: hidden;
    box-shadow: 0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(124,58,237,0.15);
    position: relative;
  }
  .owner-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .owner-ring {
    position: absolute; inset: -10px;
    border-radius: 50%;
    border: 1.5px dashed rgba(124,58,237,0.35);
    animation: mt-spin 18s linear infinite;
    pointer-events: none;
  }
  @keyframes mt-spin { to { transform: rotate(360deg); } }

  .owner-info { position: relative; z-index: 2; flex: 1; min-width: 0; }
  .owner-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: .65rem; font-weight: 800; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 3px 10px; border-radius: 7px;
    color: #a78bfa; background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.25);
    margin-bottom: 10px;
  }
  .owner-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    font-weight: 900; color: #fff; line-height: 1.1;
    margin-bottom: 4px;
  }
  .owner-role {
    font-size: .9rem; color: var(--muted); margin-bottom: 14px;
  }
  .owner-bio {
    font-size: .86rem; color: rgba(255,255,255,.45); line-height: 1.7;
    margin-bottom: 18px; max-width: 440px;
  }
  .owner-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .owner-actions .btn { font-size: .82rem; padding: 9px 18px; }

  /* ═══════════════════════════════
     CO-OWNER ROW – side by side
     ═══════════════════════════════ */
  .co-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  /* ═══════════════════════════
     MEMBER CARDS (shared)
     ═══════════════════════════ */
  .mt-card {
    border-radius: 20px;
    padding: 28px 18px 22px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
    position: relative; overflow: hidden;
    transition: transform .3s, box-shadow .3s;
    min-height: 260px;
  }
  .mt-card:hover { transform: translateY(-5px); }

  .mt-card-glow {
    position: absolute; top: -40px; left: 50%; transform: translateX(-50%);
    width: 180px; height: 180px; border-radius: 50%;
    filter: blur(48px); opacity: .18; pointer-events: none;
  }

  /* avatar */
  .mt-avatar {
    width: 76px; height: 76px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border-width: 2px; border-style: solid;
    margin-bottom: 14px; overflow: hidden; position: relative; flex-shrink: 0;
  }
  .mt-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .mt-initial { font-family:'Rajdhani',sans-serif; font-size: 2rem; font-weight: 900; }
  .mt-ring {
    position: absolute; inset: -7px; border-radius: 50%;
    border: 1px dashed currentColor; opacity: .28;
    animation: mt-spin 20s linear infinite; pointer-events: none;
  }

  /* badge */
  .mt-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: .6rem; font-weight: 800; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 2px 9px; border-radius: 7px;
    border-width: 1px; border-style: solid; margin-bottom: 9px;
    min-height: 22px;
  }

  /* text */
  .mt-name {
    font-family:'Rajdhani',sans-serif; font-size: 1.15rem; font-weight: 900;
    color:#fff; margin-bottom: 2px; min-height: 28px;
    display:flex; align-items:center; justify-content:center;
  }
  .mt-role {
    font-size: .76rem; color: var(--muted); margin-bottom: 0;
    min-height: 36px; display:flex; align-items:center; justify-content:center;
    line-height:1.4; text-align:center; padding: 0 4px;
  }
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
  .mt-skills { display:flex; flex-wrap:wrap; gap:5px; justify-content:center; margin-top: 8px; }
  .mt-skill { font-size:.66rem; font-weight:500; padding:2px 7px; border-radius:5px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); color:rgba(255,255,255,.45); }

  /* ═══════════════════════════
     SEPARATOR
     ═══════════════════════════ */
  .mt-separator {
    display: flex; align-items: center; gap: 16px;
    margin: 40px 0 36px; width: 100%;
  }
  .mt-separator-line { flex: 1; height: 1px; background: var(--border); }
  .mt-separator-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--primary); flex-shrink: 0;
  }
  .mt-sep-label {
    font-size: .68rem; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: rgba(255,255,255,.25);
    white-space: nowrap;
  }

  /* ═══════════════════════════
     CREW GRID – 2-col staggered
     ═══════════════════════════ */
  .crew-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .crew-grid > :nth-child(even) {
    transform: translateY(20px);
  }

  /* ═══════════════════════════
     PLACEHOLDER (compact)
     ═══════════════════════════ */
  .mt-placeholder {
    border-radius: 20px;
    border: 1px dashed rgba(255,255,255,.1);
    background: rgba(255,255,255,.015);
    display: flex; align-items: center; justify-content: center;
    min-height: 200px;
  }
  .mt-placeholder-inner {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .mt-placeholder-circle {
    width: 52px; height: 52px; border-radius: 50%;
    border: 1px dashed rgba(255,255,255,.12);
    display: flex; align-items: center; justify-content: center;
  }
  .mt-placeholder-circle i { font-size: 1rem; color: rgba(255,255,255,.1); }
  .mt-placeholder-text { font-size: .62rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.15); }

  /* ═══════════════════════════
     CTA
     ═══════════════════════════ */
  .mt-cta {
    background:rgba(124,58,237,.06);
    border:1px solid rgba(124,58,237,.18);
    border-radius:22px; padding:52px 40px;
    text-align:center; margin-top:60px;
  }
  .mt-cta h3 {
    font-family:'Rajdhani',sans-serif;
    font-size:clamp(1.4rem,3vw,2rem);
    font-weight:800; text-transform:uppercase; margin-bottom:10px;
  }
  .mt-cta p {
    color:var(--muted); font-size:.93rem;
    margin-bottom:28px; max-width:480px; margin-left:auto; margin-right:auto;
  }

  /* ═══════════════════════════════════
     DESKTOP (>768) – horizontal layout
     ═══════════════════════════════════ */
  @media(min-width:769px) {
    /* On desktop: owner spotlight stays horizontal, co-owners side by side, crew grid */
    .owner-spotlight { max-width: 680px; margin-left: auto; margin-right: auto; }
    .co-row { max-width: 520px; margin-left: auto; margin-right: auto; }
    .crew-grid { max-width: 520px; margin-left: auto; margin-right: auto; }
    .crew-grid > :nth-child(even) { transform: translateY(24px); }
  }

  /* ═══════════════════════════════
     MOBILE – the good stuff
     ═══════════════════════════════ */
  @media(max-width:768px) {
    /* Owner spotlight: stack vertically, center everything */
    .owner-spotlight {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 36px 24px 32px;
      gap: 24px;
    }
    .owner-info { text-align: center; }
    .owner-bio { margin-left: auto; margin-right: auto; }
    .owner-actions { justify-content: center; }
    .owner-name { font-size: 1.8rem; }

    /* Co-owners: keep 2-col but tighter */
    .co-row { gap: 12px; }
    .mt-card { padding: 22px 14px 18px; min-height: 230px; }
    .mt-avatar { width: 66px; height: 66px; margin-bottom: 12px; }

    /* Crew: staggered 2-col */
    .crew-grid { gap: 12px; }
    .crew-grid > :nth-child(even) { transform: translateY(16px); }

    /* Placeholder smaller */
    .mt-placeholder { min-height: 160px; }
    .mt-placeholder-circle { width: 44px; height: 44px; }

    /* CTA */
    .mt-cta { padding: 32px 20px; margin-top: 40px; }
  }

  @media(max-width:480px) {
    .owner-spotlight { padding: 28px 18px 26px; border-radius: 18px; }
    .owner-avatar { width: 96px; height: 96px; }
    .owner-ring { inset: -8px; }
    .owner-name { font-size: 1.6rem; }
    .owner-bio { font-size: .82rem; }
    .owner-actions .btn { font-size: .78rem; padding: 8px 14px; }

    .co-row { gap: 10px; }
    .mt-card { padding: 18px 10px 16px; min-height: 210px; border-radius: 16px; }
    .mt-avatar { width: 56px; height: 56px; margin-bottom: 10px; }
    .mt-badge { font-size: .55rem; padding: 2px 7px; letter-spacing: 1px; }
    .mt-name { font-size: 1rem; }
    .mt-role { font-size: .7rem; min-height: 30px; }

    .crew-grid { gap: 10px; }
    .crew-grid > :nth-child(even) { transform: translateY(12px); }
    .mt-placeholder { min-height: 140px; border-radius: 16px; }

    .mt-cta { padding: 24px 16px; margin-top: 32px; border-radius: 16px; }
    .mt-cta h3 { font-size: 1.3rem; }
    .mt-cta p { font-size: .86rem; }
  }

  @media(max-width:360px) {
    .owner-avatar { width: 80px; height: 80px; }
    .owner-name { font-size: 1.4rem; }
    .mt-card { padding: 16px 8px 14px; }
    .mt-avatar { width: 48px; height: 48px; }
    .mt-name { font-size: .92rem; }
    .mt-role { font-size: .66rem; }
    .mt-badge { font-size: .5rem; }
  }
`

/* ── OWNER SPOTLIGHT ── */
function OwnerSpotlight({ member }) {
  const t = TIER_CONFIG.owner
  return (
    <motion.div
      className="owner-spotlight"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="owner-spotlight-glow" />

      <div className="owner-avatar-wrap">
        <div className="owner-avatar">
          {member.avatar
            ? <img src={member.avatar} alt={member.name} />
            : <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: '3rem', fontWeight: 900, color: t.color }}>{member.name[0]}</span>
          }
        </div>
        <div className="owner-ring" />
      </div>

      <div className="owner-info">
        <div className="owner-badge">
          <i className="fa-solid fa-crown" style={{ fontSize: '.55rem' }} />
          OWNER & GRÜNDER
        </div>
        <div className="owner-name">{member.name}</div>
        <div className="owner-role">{member.role}</div>
        {member.bio && <p className="owner-bio">{member.bio}</p>}
        <div className="owner-actions">
          {member.portfolio && (
            <Link to={member.portfolio} className="btn btn-primary" style={{ fontSize: '.82rem' }}>
              <i className="fa-solid fa-folder-open" /> Portfolio
            </Link>
          )}
          {member.discord && (
            <span className="btn btn-secondary" style={{ fontSize: '.82rem', cursor: 'default' }}>
              <i className="fa-brands fa-discord" /> {member.discord}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ── MEMBER CARD (co-owners & crew) ── */
function MemberCard({ member, delay = 0 }) {
  const t = TIER_CONFIG[member.tier] || TIER_CONFIG['co-dev']
  return (
    <motion.div
      className="mt-card"
      style={{
        background: `linear-gradient(160deg,${t.bg},rgba(255,255,255,.01))`,
        border: `1px solid ${t.border}`,
        boxShadow: `0 6px 28px rgba(0,0,0,.22)`,
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="mt-card-glow" style={{ background: t.glow }} />

      <div className="mt-avatar" style={{
        borderColor: t.border,
        background: `${t.color}18`,
        boxShadow: `0 0 20px ${t.glow}`,
      }}>
        {member.avatar
          ? <img src={member.avatar} alt={member.name} />
          : <span className="mt-initial" style={{ color: t.color }}>{member.name[0].toUpperCase()}</span>
        }
        <span className="mt-ring" style={{ color: t.color }} />
      </div>

      <div className="mt-badge" style={{ color: t.color, background: `${t.color}12`, borderColor: `${t.color}28` }}>
        <i className={`fa-solid ${t.icon}`} style={{ fontSize: '.55rem' }} />
        {t.label}
      </div>

      <div className="mt-name">{member.name}</div>
      <div className="mt-role">{member.role}</div>

      {member.portfolio && (
        <Link to={member.portfolio} className="mt-portfolio-link">
          zum Portfolio <i className="fa-solid fa-arrow-right" style={{ fontSize: '.6rem' }} />
        </Link>
      )}
      {member.skills && member.skills.length > 0 && (
        <div className="mt-skills">
          {member.skills.slice(0, 3).map(s => (
            <span key={s} className="mt-skill" style={{ borderColor: `${t.color}20`, color: `${t.color}99` }}>{s}</span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function PlaceholderCard({ delay = 0 }) {
  return (
    <motion.div
      className="mt-placeholder"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
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
  useSEO({
    title: 'Mitglieder | TEAM LAZER',
    description: 'Das Team hinter TEAM LAZER – Gaming, Entwicklung und Community aus Deutschland.',
  })

  const real = MEMBERS.filter(m => !m.placeholder)
  const fivozo = real.find(m => m.id === 'fivozo')
  const coOwners = real.filter(m => m.tier === 'co-owner')
  const crew = real.filter(m => m.tier === 'supporter' || m.tier === 'mod' || m.tier === 'partner')
  const placeholderCount = Math.max(0, 4 - crew.length)

  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>

      {/* ── HERO ── */}
      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">DAS TEAM</span>
            <h1>Mitglieder</h1>
            <p>Entwicklung · Gaming · Community – die Köpfe hinter TEAM LAZER.</p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="container">

          {/* OWNER SPOTLIGHT – fivozo, full width, hero-style */}
          {fivozo && <OwnerSpotlight member={fivozo} />}

          {/* SEPARATOR: Co-Owner */}
          <div className="mt-separator">
            <div className="mt-separator-line" />
            <span className="mt-sep-label">Co-Owner</span>
            <div className="mt-separator-line" />
          </div>

          {/* CO-OWNERS – 2 columns */}
          <div className="co-row">
            {coOwners.map((m, i) => (
              <MemberCard key={m.id} member={m} delay={i * 0.1} />
            ))}
          </div>

          {/* SEPARATOR: Community */}
          <div className="mt-separator">
            <div className="mt-separator-line" />
            <span className="mt-sep-label">Community</span>
            <div className="mt-separator-line" />
          </div>

          {/* CREW GRID – staggered 2-col */}
          <div className="crew-grid">
            {crew.map((m, i) => (
              <MemberCard key={m.id} member={m} delay={i * 0.08} />
            ))}
            {Array.from({ length: placeholderCount }).map((_, i) => (
              <PlaceholderCard key={`ph-${i}`} delay={(crew.length + i) * 0.08} />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className="mt-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3>Werde Teil des Teams</h3>
            <p>Du zockst, codest, designst oder willst einfach dabei sein?<br />Melde dich – wir freuen uns.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary"><i className="fa-solid fa-paper-plane" /> Kontakt aufnehmen</Link>
              <Link to="/bots" className="btn btn-secondary"><i className="fa-brands fa-discord" /> Unsere Bots</Link>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  )
}
