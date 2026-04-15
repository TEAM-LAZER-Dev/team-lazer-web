import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSEO } from '../lib/seo'

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

export default function Contact() {
  useSEO({
    title: 'Kontakt | TEAM LAZER',
    description: 'Schreib uns – Fragen, Ideen, Teil werden oder einfach Hallo. TEAM LAZER antwortet zeitnah.',
  })
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>

      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">SCHREIB UNS</span>
            <h1>Kontakt</h1>
            <p>Fragen, coole Ideen, Teil von TEAM LAZER werden oder einfach Hallo – wir antworten so schnell wir können.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad bg-alt">
        <div className="container">
          <div className="contact-layout">
            <motion.div className="contact-form-card" {...fadeUp()}>
              <h2>Kontaktformular</h2>
              {submitted && (
                <div className="form-success">
                  <i className="fa-solid fa-circle-check" style={{ fontSize: '1.4rem', marginBottom: '8px', display: 'block' }} />
                  Danke für deine Nachricht! Wir melden uns so schnell wir können.
                </div>
              )}
              <form
                action="https://formsubmit.co/kontakt@team-lazer.de"
                method="POST"
                onSubmit={() => setSubmitted(true)}
              >
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_subject" value="Neue Anfrage – TEAM LAZER" />
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
                  <label htmlFor="fthema">Thema</label>
                  <select id="fthema" name="thema" defaultValue="">
                    <option value="">– Bitte wählen –</option>
                    <option>Bot-Frage / Problem</option>
                    <option>Website-Frage</option>
                    <option>Discord Server</option>
                    <option>Austausch / Zusammenarbeit</option>
                    <option>Feedback</option>
                    <option>Allgemeine Frage</option>
                    <option>Sonstiges</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="fmsg">Nachricht *</label>
                  <textarea id="fmsg" name="nachricht" placeholder="Was liegt dir auf dem Herzen?" required />
                </div>
                <div className="form-submit">
                  <button type="submit" className="btn btn-primary">
                    <i className="fa-solid fa-paper-plane" /> Nachricht senden
                  </button>
                </div>
              </form>
            </motion.div>

            <div className="contact-info">
              {[
                { icon: 'fa-solid fa-envelope', title: 'E-Mail', content: <a href="mailto:kontakt@team-lazer.de">kontakt@team-lazer.de</a>, delay: 0 },
                { icon: 'fa-solid fa-clock', title: 'Reaktionszeit', content: 'Ich antworte so schnell ich kann – meistens innerhalb weniger Tage.', delay: 0.1 },
                { icon: 'fa-brands fa-discord', title: 'Discord', content: 'Du findest mich auch auf Discord – einfach über das Kontaktformular fragen.', delay: 0.2 },
                { icon: 'fa-solid fa-code', title: 'Hobby-Projekt', content: 'TEAM LAZER ist ein privates Hobby-Projekt. Ich freue mich über jeden Austausch.', delay: 0.3 },
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
