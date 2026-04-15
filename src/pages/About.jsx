import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useSEO } from '../lib/seo'

/* ── Mouse glow effect ── */
function MouseGlow() {
  const glowRef = useRef(null)
  useEffect(() => {
    const el = glowRef.current
    if (!el) return
    const onMove = (e) => {
      el.style.left = e.clientX + 'px'
      el.style.top = e.clientY + 'px'
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return <div ref={glowRef} className="au-mouse-glow" />
}

/* ── Word-reveal line component ── */
function RevealLine({ children, delay = 0, className = '' }) {
  return (
    <div style={{ overflow: 'hidden', display: 'block' }}>
      <motion.div
        className={className}
        initial={{ y: '110%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ── Timeline item ── */
function TimelineItem({ year, title, desc, side, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <div ref={ref} className={`tl-item tl-${side}`}>
      <motion.div
        className="tl-card"
        initial={{ opacity: 0, x: side === 'left' ? -80 : 80, scale: 0.92 }}
        animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <span className="tl-year">{year}</span>
        <h3>{title}</h3>
        <p>{desc}</p>
      </motion.div>
      <motion.div
        className="tl-dot"
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.25, type: 'spring', stiffness: 260, damping: 18 }}
      />
    </div>
  )
}

/* ── Animated timeline line ── */
function TimelineLine() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  return (
    <div ref={ref} className="tl-line-track">
      <motion.div className="tl-line-fill" style={{ scaleY, originY: 0 }} />
    </div>
  )
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
  viewport: { once: true, margin: '-60px' },
})

const pageStyle = `
  /* ── MOUSE GLOW ── */
  .au-mouse-glow {
    position: fixed; pointer-events: none; z-index: 0;
    width: 100px; height: 100px; border-radius: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, rgba(124,58,237,0.02) 50%, transparent 70%);
    transition: left 0.08s ease, top 0.08s ease;
    mix-blend-mode: screen;
  }

  /* ── HERO ── */
  .au-hero {
    min-height: 80vh;
    display: flex; align-items: center;
    padding: calc(var(--nav-h) + 90px) 0 110px;
    position: relative;
  }
  .au-hero-glow {
    position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
    width: 900px; height: 600px; border-radius: 50%;
    background: radial-gradient(ellipse at center, rgba(124,58,237,0.13) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }
  .au-hero-glow-2 {
    position: absolute; bottom: -100px; left: 10%;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(96,165,250,0.06) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .au-hero-inner {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; position: relative; z-index: 1;
  }
  .au-hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    margin-bottom: 32px; overflow: visible;
  }
  .au-hero-tag-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--primary);
    box-shadow: 0 0 10px rgba(124,58,237,0.8);
    animation: dotPulse 2s ease-in-out infinite;
  }
  @keyframes dotPulse {
    0%,100% { box-shadow: 0 0 6px rgba(124,58,237,0.8); transform: scale(1); }
    50% { box-shadow: 0 0 18px rgba(124,58,237,1); transform: scale(1.3); }
  }
  .au-hero-h1 {
    font-family: 'Rajdhani', sans-serif;
    font-size: clamp(3.4rem, 7.5vw, 6rem);
    font-weight: 800; text-transform: uppercase;
    line-height: 1.0; margin-bottom: 32px;
    letter-spacing: -0.5px;
  }
  .au-hero-h1 .line-wrap {
    display: block;
    overflow: hidden;
    padding-bottom: 0.12em;
    margin-bottom: -0.12em;
  }
  .au-hero-sub {
    color: var(--muted); font-size: 1.05rem; line-height: 1.9;
    max-width: 540px; margin-bottom: 44px;
  }
  .au-hero-pills {
    display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;
  }
  .au-hero-pill {
    display: flex; align-items: center; gap: 8px;
    background: rgba(124,58,237,0.08);
    border: 1px solid rgba(124,58,237,0.22);
    border-radius: 100px; padding: 8px 18px;
    font-size: 0.84rem; font-weight: 600;
    color: rgba(255,255,255,0.72); letter-spacing: 0.3px;
    transition: background 0.25s, border-color 0.25s, transform 0.2s;
  }
  .au-hero-pill:hover {
    background: rgba(124,58,237,0.16);
    border-color: rgba(124,58,237,0.45);
    transform: translateY(-2px);
  }
  .au-hero-pill i { color: var(--primary); font-size: 0.8rem; }

  /* ── TIMELINE ── */
  .au-timeline-wrap { position: relative; }
  .tl-line-track {
    position: absolute; left: 50%; top: 0; bottom: 0;
    width: 1px; transform: translateX(-50%); z-index: 0;
    background: rgba(124,58,237,0.12);
  }
  .tl-line-fill {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent, var(--primary) 15%, var(--primary) 85%, transparent);
    transform-origin: top;
  }
  .au-timeline { position: relative; padding: 20px 0; z-index: 1; }
  .tl-item {
    display: flex; align-items: center; margin-bottom: 56px;
    position: relative;
  }
  .tl-left { flex-direction: row; }
  .tl-right { flex-direction: row-reverse; }
  .tl-card {
    width: calc(50% - 48px);
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; padding: 28px 30px;
    position: relative; cursor: default;
    transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
  }
  .tl-card:hover {
    border-color: rgba(124,58,237,0.4);
    background: rgba(124,58,237,0.04);
    box-shadow: 0 8px 40px rgba(124,58,237,0.1);
  }
  .tl-card::after {
    content: ''; position: absolute; top: 50%; width: 48px; height: 1px;
    background: linear-gradient(to right, rgba(124,58,237,0.5), rgba(124,58,237,0.1));
    transform: translateY(-50%);
  }
  .tl-left .tl-card { margin-right: auto; }
  .tl-left .tl-card::after { right: -48px; background: linear-gradient(to right, rgba(124,58,237,0.1), rgba(124,58,237,0.5)); }
  .tl-right .tl-card { margin-left: auto; }
  .tl-right .tl-card::after { left: -48px; }
  .tl-year {
    font-family: 'Rajdhani', sans-serif; font-size: 0.72rem;
    font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
    color: var(--primary); display: block; margin-bottom: 8px;
  }
  .tl-card h3 {
    font-family: 'Rajdhani', sans-serif; font-size: 1.18rem;
    font-weight: 700; color: #fff; margin-bottom: 8px;
  }
  .tl-card p { color: var(--muted); font-size: 0.875rem; line-height: 1.7; margin: 0; }
  .tl-dot {
    position: absolute; left: 50%; transform: translateX(-50%);
    width: 14px; height: 14px; border-radius: 50%;
    background: var(--primary);
    box-shadow: 0 0 0 4px rgba(124,58,237,0.15), 0 0 20px rgba(124,58,237,0.6);
    z-index: 3; flex-shrink: 0;
    animation: dotGlow 3s ease-in-out infinite;
  }
  @keyframes dotGlow {
    0%,100% { box-shadow: 0 0 0 4px rgba(124,58,237,0.15), 0 0 16px rgba(124,58,237,0.5); }
    50% { box-shadow: 0 0 0 6px rgba(124,58,237,0.2), 0 0 28px rgba(124,58,237,0.8); }
  }

  /* ── SERVER ── */
  .au-servers-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .au-server-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; padding: 24px 24px 20px;
    display: flex; flex-direction: column; gap: 0;
    position: relative; overflow: hidden;
    transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
  }
  .au-server-card:hover {
    border-color: rgba(88,101,242,0.4);
    background: rgba(88,101,242,0.04);
    box-shadow: 0 10px 40px rgba(88,101,242,0.1);
  }
  .au-server-head { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
  .au-server-icon {
    width: 56px; height: 56px; border-radius: 14px; flex-shrink: 0;
    overflow: hidden; background: none; border: none;
  }
  .au-server-meta { flex: 1; min-width: 0; }
  .au-server-meta strong {
    display: block; font-family: 'Rajdhani', sans-serif;
    font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 4px;
  }
  .au-server-members {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.8rem; color: var(--muted); font-weight: 500;
  }
  .au-server-members-item { display: flex; align-items: center; gap: 5px; }
  .au-server-members-dot {
    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
  }
  .au-server-members-dot.online  { background: #3ba55c; box-shadow: 0 0 6px rgba(59,165,92,0.7); }
  .au-server-members-dot.offline { background: rgba(255,255,255,0.25); }
  .au-server-tags {
    display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;
  }
  .au-server-tag {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 1.2px;
    text-transform: uppercase; padding: 3px 9px; border-radius: 5px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.45);
  }
  .au-server-desc {
    color: var(--muted); font-size: 0.85rem; line-height: 1.7;
    margin-bottom: 10px;
  }
  .au-server-list {
    list-style: none; padding: 0; margin: 0 0 20px;
    display: flex; flex-direction: column; gap: 6px; flex: 1;
  }
  .au-server-list li {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.84rem; color: rgba(255,255,255,0.7);
  }
  .au-server-list li i { color: #3ba55c; font-size: 0.8rem; flex-shrink: 0; }
  .au-server-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06);
  }
  .au-server-hosted { font-size: 0.75rem; color: rgba(255,255,255,0.3); }
  .au-server-hosted span { color: rgba(255,255,255,0.55); font-weight: 600; }
  .au-server-join {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(88,101,242,0.15); border: 1px solid rgba(88,101,242,0.35);
    color: #7289da; font-size: 0.82rem; font-weight: 700;
    letter-spacing: 0.5px; text-transform: uppercase;
    padding: 7px 16px; border-radius: 8px; text-decoration: none;
    transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
  }
  .au-server-join:hover {
    background: rgba(88,101,242,0.28); border-color: rgba(88,101,242,0.6);
    color: #fff; transform: translateY(-1px);
  }
  .au-server-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; padding: 3px 10px; border-radius: 100px;
  }
  .au-server-badge.private { background: rgba(124,58,237,0.12); color: #a78bfa; border: 1px solid rgba(124,58,237,0.25); }
  .au-server-badge.public  { background: rgba(52,211,153,0.1);  color: #34d399;  border: 1px solid rgba(52,211,153,0.25); }

  /* ── BOTS TEASER ── */
  .au-bots-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 32px; }
  .au-bot-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; padding: 28px 26px;
    position: relative; overflow: hidden;
    transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
    cursor: default;
  }
  .au-bot-card:hover {
    border-color: rgba(124,58,237,0.4);
    background: rgba(124,58,237,0.04);
    box-shadow: 0 8px 36px rgba(124,58,237,0.1);
  }
  .au-bot-header { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
  .au-bot-avatar {
    width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
    background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; color: var(--primary);
  }
  .au-bot-name { font-family: 'Rajdhani', sans-serif; font-size: 1.05rem; font-weight: 700; color: #fff; }
  .au-bot-tag {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; padding: 2px 9px; border-radius: 100px; margin-top: 4px;
  }
  .au-bot-tag.exclusive { background: rgba(167,139,250,0.12); color: #a78bfa; border: 1px solid rgba(167,139,250,0.25); }
  .au-bot-tag.open      { background: rgba(52,211,153,0.1);   color: #34d399;  border: 1px solid rgba(52,211,153,0.25); }
  .au-bot-desc { color: var(--muted); font-size: 0.85rem; line-height: 1.65; }
  .au-bots-cta { text-align: center; }

  @media(max-width:700px){
    .au-servers-grid, .au-bots-grid { grid-template-columns: 1fr; }
  }

  /* ── VALUES ── */
  .au-values-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
  .au-value-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 18px; padding: 34px 26px;
    position: relative; overflow: hidden; cursor: default;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .au-value-card::before {
    content: ''; position: absolute; inset: 0;
    background: var(--vc, rgba(124,58,237,0.06));
    opacity: 0; transition: opacity 0.35s;
  }
  .au-value-card::after {
    content: ''; position: absolute;
    top: -60px; right: -60px;
    width: 140px; height: 140px; border-radius: 50%;
    background: radial-gradient(circle, var(--vci-raw, rgba(124,58,237,0.25)) 0%, transparent 70%);
    opacity: 0; transition: opacity 0.35s, transform 0.5s;
    transform: scale(0.5);
  }
  .au-value-card:hover::before { opacity: 1; }
  .au-value-card:hover::after { opacity: 1; transform: scale(1); }
  .au-value-card:hover { border-color: var(--vcb, rgba(124,58,237,0.35)); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
  .au-value-icon { font-size: 1.9rem; color: var(--vci, var(--primary)); margin-bottom: 18px; position: relative; z-index: 1; }
  .au-value-card h4 { font-family: 'Rajdhani', sans-serif; font-size: 1.12rem; font-weight: 700; color: #fff; margin-bottom: 10px; position: relative; z-index: 1; }
  .au-value-card p { font-size: 0.86rem; color: var(--muted); line-height: 1.7; margin: 0; position: relative; z-index: 1; }

  /* ── CTA ── */
  .au-cta {
    background: rgba(124,58,237,0.07);
    border: 1px solid rgba(124,58,237,0.2);
    border-radius: 24px; padding: 64px 48px;
    text-align: center; position: relative; overflow: hidden;
  }
  .au-cta::before {
    content: ''; position: absolute; top: -80px; right: -80px;
    width: 320px; height: 320px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%);
    pointer-events: none;
  }
  .au-cta::after {
    content: ''; position: absolute; bottom: -60px; left: -60px;
    width: 240px; height: 240px; border-radius: 50%;
    background: radial-gradient(circle, rgba(96,165,250,0.1), transparent 70%);
    pointer-events: none;
  }
  .au-cta h3 { font-family: 'Rajdhani', sans-serif; font-size: clamp(1.6rem,3vw,2.2rem); font-weight: 800; text-transform: uppercase; margin-bottom: 14px; position: relative; z-index: 1; }
  .au-cta p { color: var(--muted); font-size: 0.97rem; margin-bottom: 30px; position: relative; z-index: 1; }
  .au-cta-btns { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; position: relative; z-index: 1; }

  /* ── RESPONSIVE ── */
  @media(max-width:900px){
    .au-hero-h1 { font-size: clamp(2.6rem, 10vw, 3.8rem); }
    .au-values-grid { grid-template-columns: 1fr; }
    .tl-line-track { left: 20px; }
    .au-timeline-wrap .tl-line-track { left: 20px; }
    .tl-item, .tl-right { flex-direction: row; }
    .tl-card { width: calc(100% - 60px); margin-left: 60px !important; margin-right: 0 !important; }
    .tl-left .tl-card::after, .tl-right .tl-card::after { left: -40px; right: auto; width: 40px; background: linear-gradient(to right, rgba(124,58,237,0.5), rgba(124,58,237,0.1)); }
    .tl-dot { left: 20px; }
    .au-cta { padding: 40px 24px; }
    .au-cta-btns { flex-direction: column; }
    .au-cta-btns .btn { width: 100%; justify-content: center; }
  }
`

const HERO_LINES = [
  { text: 'Drei Dudes.', highlight: false },
  { text: 'Eine Community.', highlight: true },
  { text: 'Seit 2021.', highlight: false },
]

const TIMELINE = [
  {
    year: '2021',
    title: 'Ein Clantag. Mehr nicht.',
    desc: 'TEAM LAZER war ursprünglich nichts weiter als ein Gaming-Tag. Kein Plan, kein Konzept – einfach ein Name für die Lobby.',
    side: 'left',
  },
  {
    year: '2021 – 2022',
    title: 'Der Anfang.',
    desc: 'Was als Spielerei anfing, wurde zu einer Idee. Aus einem wurden zwei – und plötzlich wollten wir etwas aufbauen. Erste Discord-Server entstehen. Nicht perfekt, aber ein Anfang.',
    side: 'right',
  },
  {
    year: '2023 – 2024',
    title: 'Erste Website geht live.',
    desc: 'fivozo gab TEAM LAZER eine echte Heimat im Netz. Erste eigene Website, erste Gehversuche mit HTML, CSS und JavaScript – alles selbst beigebracht. Kein Kurs, kein Lehrer.',
    side: 'left',
  },
  {
    year: '2025',
    title: 'Zu dritt.',
    desc: 'Eine dritte Person stößt dazu – und bringt nicht nur Energie, sondern auch Code mit. Erste eigene Bots gehen live, Discord-Server werden professioneller. Was vorher Idee war, wird real.',
    side: 'right',
  },
  {
    year: '2026',
    title: 'TEAM LAZER steht.',
    desc: 'Drei Leute. Eine Community. Eine Plattform. Was als Clantag begann, ist heute ein echtes Projekt – und wir sind längst nicht fertig.',
    side: 'left',
  },
]

const PILLS = [
  { icon: 'fa-solid fa-gamepad', label: 'Dev & Gaming' },
  { icon: 'fa-brands fa-discord', label: 'Discord Community' },
  { icon: 'fa-solid fa-code', label: 'Selbst beigebracht' },
  { icon: 'fa-solid fa-calendar', label: 'Seit 2021' },
]

const VALUES = [
  {
    icon: 'fa-solid fa-gamepad', title: 'Gamer zuerst.',
    desc: 'Wir zocken. Das ist der Ursprung. Alles andere – Coden, Projekte, Community – kam danach. Gaming ist kein Hobby, es ist ein Teil von uns.',
    color: '#a78bfa', bg: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.3)',
  },
  {
    icon: 'fa-solid fa-terminal', title: 'Selbst beigebracht.',
    desc: 'HTML, CSS, JavaScript, React, discord.js – alles durch Trial & Error, Docs und schlaflosen Nächten. Kein Studium. Kein Kurs. Einfach machen.',
    color: '#60a5fa', bg: 'rgba(96,165,250,0.06)', border: 'rgba(96,165,250,0.3)',
  },
  {
    icon: 'fa-solid fa-bolt', title: 'Wir erschaffen.',
    desc: 'Wenn uns eine Idee nicht loslässt, setzen wir sie um. Bots, Websites, Setups – nicht weil wir müssen, sondern weil das Erschaffen das Beste daran ist.',
    color: '#34d399', bg: 'rgba(52,211,153,0.06)', border: 'rgba(52,211,153,0.3)',
  },
]

export default function About() {
  useSEO({
    title: 'Über uns | TEAM LAZER',
    description: 'TEAM LAZER – von einem Gaming-Clantag zu einer Dev- und Gaming-Community. Unsere Geschichte seit 2021.',
  })

  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>
      <MouseGlow />

      {/* ── HERO ── */}
      <section className="au-hero">
        <div className="au-hero-glow" />
        <div className="au-hero-glow-2" />
        <div className="container au-hero-inner">

          {/* Tag */}
          <motion.div
            className="au-hero-tag section-tag"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className="au-hero-tag-dot" />
            TEAM LAZER
          </motion.div>

          {/* Headline — line-by-line reveal */}
          <h1 className="au-hero-h1">
            {HERO_LINES.map(({ text, highlight }, i) => (
              <span key={i} className="line-wrap">
                <motion.span
                  style={{ display: 'block' }}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.13 }}
                >
                  {highlight ? <span className="highlight">{text}</span> : text}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Sub */}
          <motion.p
            className="au-hero-sub"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.58 }}
          >
            Was als Gaming-Clantag begann, wurde zu echten Projekten, echtem Code und einer Community, die zusammen wächst. Kein Studium. Keine Agentur. Einfach machen.
          </motion.p>

          {/* Pills — staggered */}
          <motion.div
            className="au-hero-pills"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.72 } },
            }}
          >
            {PILLS.map(({ icon, label }) => (
              <motion.div
                key={label}
                className="au-hero-pill"
                variants={{
                  hidden: { opacity: 0, scale: 0.85, y: 12 },
                  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <i className={icon} /> {label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="section-pad">
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <span className="section-tag">DIE GESCHICHTE</span>
            <h2>Von 2021 bis <span className="highlight">heute</span></h2>
            <p>Wie aus einem Clantag eine Dev-Community wurde.</p>
          </motion.div>
          <div className="au-timeline-wrap">
            <TimelineLine />
            <div className="au-timeline">
              {TIMELINE.map((item, i) => (
                <TimelineItem key={i} {...item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVER ── */}
      <section className="section-pad bg-alt">
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <span className="section-tag">COMMUNITY</span>
            <h2>Unsere <span className="highlight">Server</span></h2>
            <p>Zwei Discord-Server – einer für uns, einer für alle.</p>
          </motion.div>
          <motion.div
            className="au-servers-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          >
            {[
              {
                name: 'TEAM LAZER',
                badge: 'Hauptserver', badgeType: 'private',
                members: 15, online: 3,
                tags: ['TEAM-LAZER', 'DEUTSCH', 'COMMUNITY', 'GAMING'],
                desc: 'Unser Zuhause. Hier trifft sich die Community und alles rund um TEAM LAZER passiert.',
                list: ['Regelmäßige Giveaways', 'Dev & Gaming Community', 'Direkter Kontakt zum Team'],
                img: '/images/discord-server/TL-Logo-steel-nobg.webp',
                invite: 'https://discord.gg/dCxU6KqWFz',
              },
              {
                name: 'The Forest | Deutschland',
                badge: 'Spielserver', badgeType: 'public',
                members: 240, online: 11,
                tags: ['THE-FOREST', 'DEUTSCH', 'GAMING'],
                desc: 'Du suchst nach neuen Mitspielern oder möchtest dich mit anderen Nutzern austauschen? Dann bist du bei uns genau richtig.',
                list: ['Aktive Spieler', 'Freundlicher Support', 'Stetige Weiterentwicklung'],
                img: '/images/discord-server/TheForestDE.webp',
                invite: 'https://discord.gg/znyXupmuK2',
              },
            ].map(({ name, badge, badgeType, members, online, tags, desc, list, img, invite }) => (
              <motion.div
                key={name}
                className="au-server-card"
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="au-server-head">
                  <div className="au-server-icon">
                    <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                  </div>
                  <div className="au-server-meta">
                    <strong>{name}</strong>
                    <div className="au-server-members">
                      <span className="au-server-members-item">
                        <span className="au-server-members-dot online" />
                        {online} Online
                      </span>
                      <span className="au-server-members-item">
                        <span className="au-server-members-dot offline" />
                        {members} Gesamt
                      </span>
                    </div>
                  </div>
                  <span className={`au-server-badge ${badgeType}`}>{badge}</span>
                </div>
                <div className="au-server-tags">
                  {tags.map(t => <span key={t} className="au-server-tag">{t}</span>)}
                </div>
                <p className="au-server-desc">{desc}</p>
                {list && (
                  <ul className="au-server-list">
                    {list.map(item => (
                      <li key={item}><i className="fa-solid fa-check" /> {item}</li>
                    ))}
                  </ul>
                )}
                <div className="au-server-footer">
                  <span className="au-server-hosted">hosted by <span>TEAM LAZER</span></span>
                  <a href={invite} target="_blank" rel="noopener noreferrer" className="au-server-join">
                    <i className="fa-brands fa-discord" /> Beitreten
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BOTS TEASER ── */}
      <section className="section-pad">
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <span className="section-tag">BOTS</span>
            <h2>Was wir <span className="highlight">gebaut haben</span></h2>
            <p>Zwei Bots – einer für uns, einer für alle.</p>
          </motion.div>
          <motion.div
            className="au-bots-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          >
            {[
              {
                name: 'TEAM LAZER Hub',
                tag: 'Exklusiv', tagType: 'exclusive',
                desc: 'Unser offizieller Moderationsbot. Entwickelt speziell für unsere Server – nicht öffentlich, aber genau das was wir brauchen.',
                img: '/images/discord-server/TL-Logo-steel-nobg.webp',
              },
              {
                name: 'Nexus',
                tag: 'Open & kostenlos', tagType: 'open',
                desc: 'Ein vollständiger Discord Bot – komplett kostenlos, öffentlich einladbar und mit allem was man braucht.',
                img: null,
                icon: 'fa-solid fa-robot',
              },
            ].map(({ name, tag, tagType, desc, img, icon }) => (
              <motion.div
                key={name}
                className="au-bot-card"
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="au-bot-header">
                  <div className="au-bot-avatar">
                    {img ? <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : <i className={icon} />}
                  </div>
                  <div>
                    <div className="au-bot-name">{name}</div>
                    <span className={`au-bot-tag ${tagType}`}>{tag}</span>
                  </div>
                </div>
                <p className="au-bot-desc">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="au-bots-cta" {...fadeUp(0.1)}>
            <Link to="/bots" className="btn btn-secondary">
              <i className="fa-brands fa-discord" /> Alle Bots ansehen
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section-pad bg-alt">
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <span className="section-tag">WAS UNS AUSMACHT</span>
            <h2>Wie wir <span className="highlight">ticken</span></h2>
          </motion.div>
          <motion.div
            className="au-values-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
          >
            {VALUES.map(({ icon, title, desc, color, bg, border }, i) => (
              <motion.div
                key={title}
                className="au-value-card"
                style={{ '--vc': bg, '--vcb': border, '--vci': color }}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.94 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
                }}
                whileHover={{ y: -6, transition: { duration: 0.22 } }}
              >
                <div className="au-value-icon"><i className={icon} /></div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-pad">
        <div className="container">
          <motion.div
            className="au-cta"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <h3>Neugierig auf das <span className="highlight">Team?</span></h3>
            <p>Schau wer hinter TEAM LAZER steckt – oder schreib uns direkt.</p>
            <div className="au-cta-btns">
              <Link to="/members" className="btn btn-primary">
                <i className="fa-solid fa-users" /> Das Team
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                <i className="fa-solid fa-envelope" /> Kontakt
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
