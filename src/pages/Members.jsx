import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSEO } from '../lib/seo'
import { MEMBERS } from '../data/members'

const TIER_CONFIG = {
  'owner':    { label: 'Owner',          badge: 'OWNER',    color: '#a78bfa', glow: 'rgba(124,58,237,0.3)',  border: 'rgba(124,58,237,0.5)', bg: 'rgba(124,58,237,0.07)', icon: 'fa-crown'   },
  'co-owner': { label: 'Co-Owner',       badge: 'CO-OWNER', color: '#38bdf8', glow: 'rgba(14,165,233,0.25)', border: 'rgba(14,165,233,0.4)',  bg: 'rgba(14,165,233,0.06)', icon: 'fa-star'    },
  'co-dev':   { label: 'Co-Developer',   badge: 'CO-DEV',   color: '#4ade80', glow: 'rgba(74,222,128,0.2)',  border: 'rgba(74,222,128,0.3)',  bg: 'rgba(74,222,128,0.05)', icon: 'fa-code'    },
}

const pageStyle = `
  /* ─── PAGE ─── */
  .members-page-inner { padding-bottom: 80px; }

  /* ─── TREE WRAPPER ─── */
  .org-tree { display: flex; flex-direction: column; align-items: center; width: 100%; }

  /* ─── ROW ─── */
  .org-row { display: flex; align-items: flex-start; justify-content: center; position: relative; width: 100%; }

  /* Horizontal connector bar that spans between first and last card in a row */
  .org-row-connector {
    position: absolute;
    top: 56px;           /* vertically centered on avatar */
    left: 50%;
    transform: translateX(-50%);
    height: 1px;
    pointer-events: none;
  }

  /* Vertical line between rows */
  .org-vline {
    width: 1px;
    height: 44px;
    flex-shrink: 0;
  }

  /* ─── CARD ─── */
  .org-card {
    width: 200px;
    border-radius: 18px;
    padding: 28px 18px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    transition: transform .3s, box-shadow .3s;
    flex-shrink: 0;
  }
  .org-card:hover { transform: translateY(-5px); }
  .org-card.is-owner { width: 220px; }
  .org-card.is-placeholder { opacity: .38; pointer-events: none; }

  /* glow behind card */
  .org-card-glow {
    position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
    width: 160px; height: 160px; border-radius: 50%;
    opacity: .22; filter: blur(40px); pointer-events: none;
  }

  /* ─── AVATAR ─── */
  .org-avatar {
    width: 80px; height: 80px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border-width: 2px; border-style: solid;
    margin-bottom: 14px; overflow: hidden; position: relative;
    flex-shrink: 0;
  }
  .org-avatar.is-owner { width: 92px; height: 92px; }
  .org-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .org-avatar-initial { font-family:'Rajdhani',sans-serif; font-size: 2.2rem; font-weight: 900; }
  .org-avatar.is-owner .org-avatar-initial { font-size: 2.6rem; }

  /* spinning dashed ring */
  .org-ring {
    position: absolute; inset: -7px; border-radius: 50%;
    border-width: 1px; border-style: dashed;
    opacity: .3; animation: org-spin 18s linear infinite;
    pointer-events: none;
  }
  @keyframes org-spin { to { transform: rotate(360deg); } }

  /* ─── BADGE ─── */
  .org-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: .62rem; font-weight: 800; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 2px 9px; border-radius: 7px;
    border-width: 1px; border-style: solid; margin-bottom: 8px;
  }

  /* ─── TEXT ─── */
  .org-name { font-family:'Rajdhani',sans-serif; font-size: 1.1rem; font-weight: 900; color: #fff; margin-bottom: 2px; line-height: 1.2; }
  .org-name.is-owner { font-size: 1.25rem; }
  .org-role { font-size: .76rem; color: var(--muted); margin-bottom: 12px; }
  .org-skills { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; }
  .org-skill { font-size: .68rem; font-weight: 500; padding: 2px 8px; border-radius: 5px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); color: rgba(255,255,255,.45); }

  /* ─── PLACEHOLDER SLOT ─── */
  .org-placeholder-label {
    font-family:'Rajdhani',sans-serif; font-size: .65rem; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: rgba(255,255,255,.18); margin-top: 12px;
  }

  /* ─── TIER LABEL ─── */
  .org-tier-label {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 24px; width: 100%;
  }
  .org-tier-label-line { flex:1; height:1px; }
  .org-tier-label-text {
    font-family:'Rajdhani',sans-serif; font-size: .68rem; font-weight: 800;
    letter-spacing: 2px; text-transform: uppercase; white-space: nowrap;
    padding: 3px 12px; border-radius: 7px;
    border-width: 1px; border-style: solid;
  }

  /* ─── CTA ─── */
  .members-cta { background: rgba(124,58,237,.06); border: 1px solid rgba(124,58,237,.18); border-radius: 22px; padding: 52px 40px; text-align: center; margin-top: 80px; }
  .members-cta h3 { font-family:'Rajdhani',sans-serif; font-size: clamp(1.4rem,3vw,2rem); font-weight:800; text-transform:uppercase; margin-bottom: 10px; }
  .members-cta p { color: var(--muted); font-size: .93rem; margin-bottom: 28px; max-width: 480px; margin-left: auto; margin-right: auto; }

  /* ─── RESPONSIVE ─── */
  @media(max-width: 768px) {
    .org-card { width: 100%; max-width: 280px; }
    .org-card.is-owner { width: 100%; max-width: 280px; }
    .org-row { flex-direction: column; align-items: center; gap: 16px; }
    .org-row-connector { display: none; }
    .org-hline-between { display: none; }
  }
`

/* Horizontal connecting line between cards (shown between each pair) */
function HLine({ color }) {
  return (
    <div style={{
      width: '32px', height: '1px', flexShrink: 0, alignSelf: 'center',
      marginTop: '-60px', /* nudge up to avatar center */
      background: `linear-gradient(90deg, ${color}55, ${color}55)`,
    }}
    className="org-hline-between"
    />
  )
}

function TierLabel({ label, color }) {
  return (
    <div className="org-tier-label">
      <div className="org-tier-label-line" style={{ background: `linear-gradient(90deg, transparent, ${color}35)` }} />
      <span className="org-tier-label-text" style={{ color, background: `${color}10`, borderColor: `${color}28` }}>
        {label}
      </span>
      <div className="org-tier-label-line" style={{ background: `linear-gradient(90deg, ${color}35, transparent)` }} />
    </div>
  )
}

function OrgCard({ member, isFirst = false }) {
  const tier = TIER_CONFIG[member.tier] || TIER_CONFIG['co-dev']
  const isOwner = member.tier === 'owner'
  const isPlaceholder = member.placeholder

  return (
    <motion.div
      className={`org-card${isOwner ? ' is-owner' : ''}${isPlaceholder ? ' is-placeholder' : ''}`}
      style={{
        background: isPlaceholder
          ? 'rgba(255,255,255,.02)'
          : `linear-gradient(160deg, ${tier.bg}, rgba(255,255,255,.01))`,
        border: `1px solid ${isPlaceholder ? 'rgba(255,255,255,.08)' : tier.border}`,
        boxShadow: isPlaceholder ? 'none' : `0 6px 28px rgba(0,0,0,.22)`,
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: isPlaceholder ? .38 : 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: isFirst ? 0 : 0.1 }}
    >
      {/* Glow */}
      {!isPlaceholder && <div className="org-card-glow" style={{ background: tier.glow }} />}

      {/* Avatar */}
      <div
        className={`org-avatar${isOwner ? ' is-owner' : ''}`}
        style={{
          borderColor: isPlaceholder ? 'rgba(255,255,255,.1)' : tier.border,
          background: isPlaceholder ? 'rgba(255,255,255,.03)' : `${tier.color}15`,
          boxShadow: isPlaceholder ? 'none' : `0 0 18px ${tier.glow}`,
        }}
      >
        {member.avatar
          ? <img src={member.avatar} alt={member.name} />
          : <span className="org-avatar-initial" style={{ color: isPlaceholder ? 'rgba(255,255,255,.15)' : tier.color }}>
              {member.name[0].toUpperCase()}
            </span>
        }
        {!isPlaceholder && <div className="org-ring" style={{ borderColor: tier.color }} />}
      </div>

      {/* Badge */}
      {!isPlaceholder && (
        <div className="org-badge" style={{ color: tier.color, background: `${tier.color}12`, borderColor: `${tier.color}28` }}>
          <i className={`fa-solid ${tier.icon}`} style={{ fontSize: '.55rem' }} />
          {tier.badge}
        </div>
      )}

      {/* Name & Role */}
      {isPlaceholder ? (
        <div className="org-placeholder-label">Offen</div>
      ) : (
        <>
          <div className={`org-name${isOwner ? ' is-owner' : ''}`}>{member.name}</div>
          <div className="org-role">{member.role}</div>
          {member.skills.length > 0 && (
            <div className="org-skills">
              {member.skills.slice(0, 3).map(s => (
                <span key={s} className="org-skill" style={{ borderColor: `${tier.color}20`, color: `${tier.color}99` }}>{s}</span>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

/* A row of cards connected by horizontal lines */
function OrgRow({ members, connectorColor }) {
  return (
    <div className="org-row" style={{ gap: '0' }}>
      {members.map((m, i) => (
        <>
          <OrgCard key={m.id} member={m} isFirst={i === 0} />
          {i < members.length - 1 && <HLine key={`line-${i}`} color={connectorColor} />}
        </>
      ))}
    </div>
  )
}

/* Vertical connector between tiers */
function VLine({ fromColor, toColor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0' }}>
      <div className="org-vline" style={{ background: `linear-gradient(to bottom, ${fromColor}88, ${toColor}88)` }} />
    </div>
  )
}

export default function Members() {
  useSEO({
    title: 'Mitglieder | TEAM LAZER',
    description: 'Das Team hinter TEAM LAZER – Gaming, Entwicklung und Community aus Deutschland.',
  })

  // Split by tier, real members first, then placeholders for lower tiers
  const owners   = MEMBERS.filter(m => m.tier === 'owner')
  const coOwners = MEMBERS.filter(m => m.tier === 'co-owner')
  const coDevs   = MEMBERS.filter(m => m.tier === 'co-dev')

  // Pad co-dev row with extra placeholder slots up to 4 total
  const coDevPadded = [...coDevs]
  while (coDevPadded.length < 4) {
    coDevPadded.push({ id: `ph-${coDevPadded.length}`, name: '?', tier: 'co-dev', skills: [], placeholder: true })
  }

  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>

      {/* ── HERO ── */}
      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">DAS TEAM</span>
            <h1>Mitglieder</h1>
            <p>Gaming · Entwicklung · Community – die Köpfe hinter TEAM LAZER.</p>
          </motion.div>
        </div>
      </section>

      {/* ── ORG TREE ── */}
      <section className="section-pad members-page-inner">
        <div className="container">
          <div className="org-tree">

            {/* TIER 1: OWNER */}
            <TierLabel label="Owner" color={TIER_CONFIG.owner.color} />
            <OrgRow members={owners} connectorColor={TIER_CONFIG.owner.color} />

            {/* ▼ */}
            <VLine fromColor={TIER_CONFIG.owner.color} toColor={TIER_CONFIG['co-owner'].color} />

            {/* TIER 2: CO-OWNER */}
            <TierLabel label="Co-Owner" color={TIER_CONFIG['co-owner'].color} />
            <OrgRow members={coOwners} connectorColor={TIER_CONFIG['co-owner'].color} />

            {/* ▼ */}
            <VLine fromColor={TIER_CONFIG['co-owner'].color} toColor={TIER_CONFIG['co-dev'].color} />

            {/* TIER 3: CO-DEV (+ placeholders) */}
            <TierLabel label="Co-Developer" color={TIER_CONFIG['co-dev'].color} />
            <OrgRow members={coDevPadded} connectorColor={TIER_CONFIG['co-dev'].color} />

          </div>

          {/* ── CTA ── */}
          <motion.div
            className="members-cta"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <h3>Werde Teil des Teams</h3>
            <p>Du gamst, codest, designst oder willst einfach dabei sein? Melde dich – wir freuen uns.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary">
                <i className="fa-solid fa-paper-plane" /> Kontakt aufnehmen
              </Link>
              <Link to="/bots" className="btn btn-secondary">
                <i className="fa-brands fa-discord" /> Unsere Bots
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
