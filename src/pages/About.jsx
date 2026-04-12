import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useSEO } from '../lib/seo'

function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          setCount(Math.floor(ease * target))
          if (p < 1) requestAnimationFrame(tick)
          else setCount(target)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])
  return [count, ref]
}

function AnimatedStat({ target, suffix, label }) {
  const [count, ref] = useCounter(target)
  return (
    <div className="about-stat" ref={ref}>
      <strong><span className="stat-color">{count}{suffix}</span></strong>
      <span>{label}</span>
    </div>
  )
}
function StatFixed({ value, label }) {
  return (
    <div className="about-stat">
      <strong><span className="stat-color">{value}</span></strong>
      <span>{label}</span>
    </div>
  )
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
  viewport: { once: true, margin: '-60px' },
})

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } }
const staggerItem = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }

const pageStyle = `
  .about-intro { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; padding:0 0 80px; }
  .about-intro-text h2 { font-family:'Rajdhani',sans-serif; font-size:clamp(1.6rem,4vw,2.2rem); font-weight:800; text-transform:uppercase; margin-bottom:18px; line-height:1.15; }
  .about-intro-text p { color:var(--muted); font-size:.95rem; line-height:1.8; margin-bottom:14px; }
  .about-intro-text p strong { color:#fff; font-weight:600; }
  .about-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border); border:1px solid var(--border); border-radius:16px; overflow:hidden; }
  .about-stat { background:rgba(255,255,255,.02); padding:28px 20px; text-align:center; }
  .about-stat strong { display:block; font-family:'Rajdhani',sans-serif; font-size:2.2rem; font-weight:800; color:#fff; line-height:1; }
  .stat-color { color:var(--primary); }
  .about-stat span { font-size:.8rem; color:var(--muted); margin-top:5px; display:block; }
  .skills-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .skill-group h4 { font-family:'Rajdhani',sans-serif; font-size:.75rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.3); margin-bottom:12px; }
  .skill-tags { display:flex; gap:8px; flex-wrap:wrap; }
  .skill-tag { font-size:.8rem; font-weight:500; color:rgba(255,255,255,.6); background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:5px 12px; }
  .skill-tag.pri { color:#a78bfa; background:rgba(124,58,237,.1); border-color:rgba(124,58,237,.2); }
  .values-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .value-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:28px 22px; transition:.3s; }
  .value-card:hover { background:rgba(255,255,255,.04); border-color:rgba(255,255,255,.12); transform:translateY(-4px); }
  .value-icon { font-size:1.6rem; color:var(--primary); margin-bottom:14px; }
  .value-card h4 { font-family:'Rajdhani',sans-serif; font-size:1.05rem; font-weight:700; color:#fff; margin-bottom:8px; }
  .value-card p { font-size:.85rem; color:var(--muted); line-height:1.6; }
  .about-cta { background:rgba(124,58,237,.08); border:1px solid rgba(124,58,237,.2); border-radius:18px; padding:48px; text-align:center; }
  .about-cta h3 { font-family:'Rajdhani',sans-serif; font-size:clamp(1.4rem,3vw,1.9rem); font-weight:800; text-transform:uppercase; margin-bottom:10px; }
  .about-cta p { color:var(--muted); margin-bottom:24px; font-size:.93rem; }
  .about-cta-btns { display:flex; justify-content:center; gap:12px; flex-wrap:wrap; }
  @media(max-width:900px){
    .about-intro{grid-template-columns:1fr;gap:36px;text-align:center;}
    .skills-grid{grid-template-columns:1fr;}
    .values-grid{grid-template-columns:1fr;gap:12px;}
  }
  @media(max-width:600px){
    /* Keep stats as 3 columns — compact pill layout */
    .about-stats{grid-template-columns:repeat(3,1fr);}
    .about-stat{padding:18px 10px;}
    .about-stat strong{font-size:1.6rem;}
    .about-stat span{font-size:.72rem;}
    /* Intro: tighter spacing */
    .about-intro{padding:0 0 40px;gap:28px;}
    .about-intro-text h2{font-size:1.55rem;}
    .about-intro-text p{font-size:.88rem;}
    /* Skills: compact tags */
    .skill-tag{font-size:.76rem;padding:4px 10px;}
    /* Values: single col already, just tighter */
    .value-card{padding:20px 16px;}
    .value-card h4{font-size:.95rem;}
    .value-card p{font-size:.82rem;}
    /* CTA */
    .about-cta{padding:28px 18px;}
    .about-cta h3{font-size:1.35rem;}
    .about-cta-btns{flex-direction:column;gap:10px;}
    .about-cta-btns .btn{width:100%;justify-content:center;}
  }
`

export default function About() {
  useSEO({
    title: 'Über uns | TEAM LAZER',
    description: 'Lern TEAM LAZER kennen – eine Dev-Community aus Deutschland, die Websites, Discord Bots und Automatisierungen aus Leidenschaft baut.',
  })
  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>

      {/* HERO */}
      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">TEAM LAZER</span>
            <h1>Über uns</h1>
            <p>Eine Dev-Community aus Deutschland – gegründet von fivozo und Wizzard Gaming. Wir bauen Websites, Discord Bots und Tools aus Leidenschaft für Code.</p>
          </motion.div>
        </div>
      </section>

      {/* INTRO */}
      <section className="section-pad">
        <div className="container">
          <div className="about-intro">
            <motion.div className="about-intro-text" {...fadeUp()}>
              <h2>Code aus<br /><span className="highlight">Leidenschaft</span> – nicht aus Pflicht</h2>
              <p>TEAM LAZER ist eine Dev-Community aus Deutschland, gegründet von <strong>fivozo (Jon Wagner)</strong> und <strong>Wizzard Gaming</strong>. Wir bauen <strong>Websites, Discord Bots und Automatisierungen</strong> weil wir es lieben, Dinge zum Laufen zu bringen.</p>
              <p>Alles selbst beigebracht – HTML, CSS, JavaScript, React, Python, discord.js. Kein Studium, keine Agentur. Nur <strong>echtes Interesse, Ausdauer und eine geile Community</strong>.</p>
              <p>Wenn wir nicht gerade coden, schauen wir uns neue Technologien an und testen aus, was möglich ist – aus Neugier und Spaß.</p>
            </motion.div>
            <motion.div {...fadeUp(0.15)}>
              <div className="about-stats">
                <AnimatedStat target={3} suffix="+ J." label="Coding-Erfahrung" />
                <StatFixed value="100%" label="Selbst beigebracht" />
                <StatFixed value="∞" label="Ideen im Kopf" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="bg-alt section-pad">
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <span className="section-tag">TECH STACK</span>
            <h2>Womit wir <span className="highlight">arbeiten</span></h2>
            <p>Die Kernkompetenzen von TEAM LAZER – alles selbst beigebracht.</p>
          </motion.div>
          <motion.div className="skills-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {[
              { title: 'Frontend', tags: [['HTML / CSS / JS', true], ['Responsive Design', false], ['Animations', false], ['React', false]] },
              { title: 'Backend & Scripting', tags: [['Python', true], ['Node.js', true], ['REST APIs', false], ['Datenbanken', false]] },
              { title: 'Discord & Bots', tags: [['discord.js v14', true], ['Python discord.py', true], ['Slash Commands', false], ['Datenbanken', false]] },
              { title: 'Hosting & Tools', tags: [['Linux Server', false], ['Netlify', false], ['Git', false], ['VS Code', false]] },
            ].map(({ title, tags }) => (
              <motion.div key={title} className="skill-group" variants={staggerItem}>
                <h4>{title}</h4>
                <div className="skill-tags">
                  {tags.map(([name, pri]) => (
                    <span key={name} className={`skill-tag${pri ? ' pri' : ''}`}>{name}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section-pad">
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <span className="section-tag">WARUM WIR CODEN</span>
            <h2>Was uns <span className="highlight">antreibt</span></h2>
          </motion.div>
          <motion.div className="values-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {[
              { icon: 'fa-solid fa-fire', title: 'Leidenschaft für Code', desc: 'Wir coden nicht für Geld – wir coden, weil es uns begeistert. Jedes Projekt ist eine Gelegenheit, etwas Neues zu lernen.' },
              { icon: 'fa-solid fa-users', title: 'Community First', desc: 'TEAM LAZER lebt von der Community. Wir tauschen uns aus, helfen uns gegenseitig und wachsen zusammen.' },
              { icon: 'fa-solid fa-seedling', title: 'Immer am Wachsen', desc: 'Alles selbst beigebracht. Tutorials, Docs, Trial & Error – so haben wir angefangen, so lernen wir weiter.' },
            ].map(({ icon, title, desc }, i) => (
              <motion.div key={title} className="value-card" variants={staggerItem}>
                <div className="value-icon"><i className={icon} /></div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-alt">
        <div className="container">
          <motion.div className="about-cta" {...fadeUp()}>
            <h3>Neugierig oder einfach Hallo?</h3>
            <p>Schreib mir – ob du Fragen hast, selbst coderst oder einfach quatschen willst. Ich freu mich über Nachrichten.</p>
            <div className="about-cta-btns">
              <Link to="/contact" className="btn btn-primary"><i className="fa-solid fa-envelope" /> Schreib mir</Link>
              <Link to="/skills" className="btn btn-secondary"><i className="fa-solid fa-code" /> Skills ansehen</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
