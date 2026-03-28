import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
  viewport: { once: true, margin: '-60px' },
})

const pageStyle = `
  .contact-layout{display:grid;grid-template-columns:1fr 380px;gap:48px;align-items:start;}
  .contact-form-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:36px;}
  .contact-form-card h2{font-family:'Rajdhani',sans-serif;font-size:1.5rem;font-weight:800;text-transform:uppercase;margin-bottom:22px;}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .form-submit{margin-top:4px;}
  .form-submit .btn{width:100%;justify-content:center;padding:14px;font-size:.92rem;}
  .contact-info{display:flex;flex-direction:column;gap:14px;}
  .info-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:22px;display:flex;align-items:flex-start;gap:16px;transition:.3s;}
  .info-card:hover{border-color:rgba(255,255,255,.12);background:rgba(255,255,255,.04);}
  .info-icon{width:40px;height:40px;border-radius:10px;flex-shrink:0;background:var(--primary-dim);border:1px solid var(--primary-border);display:flex;align-items:center;justify-content:center;color:var(--primary);font-size:1rem;}
  .info-text strong{display:block;font-size:.88rem;font-weight:600;color:#fff;margin-bottom:3px;}
  .info-text span{font-size:.82rem;color:var(--muted);}
  .info-text a{color:var(--primary);}
  .form-success{padding:20px;border-radius:12px;background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.2);text-align:center;color:#4ade80;font-size:.9rem;margin-bottom:18px;}
  @media(max-width:900px){
    .contact-layout{grid-template-columns:1fr;gap:20px;}
    /* Form first on mobile — info cards go below */
    .contact-form-card{order:1;}
    .contact-info{order:2;flex-direction:column;}
    .info-card{flex:none;}
  }
  @media(max-width:600px){
    .form-row{grid-template-columns:1fr;}
    .contact-form-card{padding:22px 16px;}
    .contact-form-card h2{font-size:1.25rem;margin-bottom:16px;}
    .info-card{padding:16px;}
    .info-icon{width:36px;height:36px;font-size:.9rem;}
    .info-text strong{font-size:.84rem;}
    .info-text span{font-size:.78rem;}
  }
`

const PROJECT_MAP = {
  'landing-page': 'Landing Page',
  'business-website': 'Business Website',
  'custom-website': 'Custom Website',
  'basic-bot': 'Discord Bot (Basic)',
  'advanced-bot': 'Discord Bot (Advanced)',
  'bot-anpassung': 'Bot Anpassung',
  'server-setup': 'Discord Server Setup',
  'webhook-api': 'Webhook / API Integration',
  'custom-skript': 'Custom Skript / Automation',
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const prefill = PROJECT_MAP[searchParams.get('projekt')] || ''

  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>

      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">KOSTENLOSE ERSTBERATUNG</span>
            <h1>Kontakt</h1>
            <p>Stell uns dein Projekt vor. Wir melden uns innerhalb von 24 Stunden – nach einem kurzen Briefing erhältst du ein individuelles, unverbindliches Angebot.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad bg-alt">
        <div className="container">
          <div className="contact-layout">
            <motion.div className="contact-form-card" {...fadeUp()}>
              <h2>Projektanfrage</h2>
              {submitted && (
                <div className="form-success">
                  <i className="fa-solid fa-circle-check" style={{ fontSize: '1.4rem', marginBottom: '8px', display: 'block' }} />
                  Danke für deine Anfrage! Wir melden uns innerhalb von 24 Stunden.
                </div>
              )}
              <form
                action="https://formsubmit.co/kontakt@team-lazer.de"
                method="POST"
                onSubmit={() => setSubmitted(true)}
              >
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_subject" value="Neue Projektanfrage – TEAM LAZER" />
                <input type="text" name="_honey" style={{ display: 'none' }} />
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fname">Name *</label>
                    <input type="text" id="fname" name="name" placeholder="Max Mustermann" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="femail">E-Mail *</label>
                    <input type="email" id="femail" name="email" placeholder="deine@email.de" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="ftyp">Art des Projekts *</label>
                  <select id="ftyp" name="projekttyp" required defaultValue={prefill}>
                    <option value="" disabled>– Bitte wählen –</option>
                    {Object.values(PROJECT_MAP).map(v => <option key={v} value={v}>{v}</option>)}
                    <option>Sonstiges</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="fmsg">Beschreibung *</label>
                  <textarea id="fmsg" name="nachricht" placeholder="Beschreib kurz dein Projekt oder was du brauchst..." required />
                </div>
                <div className="form-submit">
                  <button type="submit" className="btn btn-primary">
                    <i className="fa-solid fa-paper-plane" /> Anfrage abschicken
                  </button>
                </div>
              </form>
            </motion.div>

            <div className="contact-info">
              {[
                { icon: 'fa-solid fa-envelope', title: 'E-Mail', content: <a href="mailto:kontakt@team-lazer.de">kontakt@team-lazer.de</a>, delay: 0 },
                { icon: 'fa-solid fa-clock', title: 'Reaktionszeit', content: 'Wir antworten innerhalb von 24 Stunden.', delay: 0.1 },
                { icon: 'fa-solid fa-server', title: 'Hosting auf Wunsch', content: 'Websites und Bots können bei uns gehostet werden. Monatliche Kosten werden transparent im Angebot aufgeführt.', delay: 0.2 },
                { icon: 'fa-solid fa-receipt', title: 'Individuelles Angebot', content: 'Nach einem kurzen Briefing bekommst du ein klares Angebot – alle Kosten inkl. Domain & Hosting offen aufgelistet.', delay: 0.3 },
              ].map(({ icon, title, content, delay }) => (
                <motion.div key={title} className="info-card" {...fadeUp(delay)}>
                  <div className="info-icon"><i className={icon} /></div>
                  <div className="info-text">
                    <strong>{title}</strong>
                    <span>{content}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
