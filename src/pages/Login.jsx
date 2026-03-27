import { motion } from 'framer-motion'

const pageStyle = `
  .login-card{max-width:420px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:40px 36px;}
  .login-card h2{font-family:'Rajdhani',sans-serif;font-size:1.6rem;font-weight:800;text-transform:uppercase;margin-bottom:6px;}
  .login-card p{color:var(--muted);font-size:.87rem;margin-bottom:28px;}
  .login-submit .btn{width:100%;justify-content:center;padding:14px;}
  .login-footer{text-align:center;margin-top:18px;font-size:.82rem;color:var(--muted);}
`

export default function Login() {
  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>
      <section className="small-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-tag">TEAM LAZER</span>
            <h1>Login</h1>
            <p>Interner Bereich für TEAM LAZER Mitglieder.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-pad bg-alt">
        <div className="container">
          <motion.div className="login-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
            <h2>Anmelden</h2>
            <p>Nur für autorisierte Teammitglieder.</p>
            <div className="form-group">
              <label htmlFor="lemail">E-Mail</label>
              <input type="email" id="lemail" name="email" placeholder="deine@email.de" />
            </div>
            <div className="form-group">
              <label htmlFor="lpw">Passwort</label>
              <input type="password" id="lpw" name="password" placeholder="••••••••" />
            </div>
            <div className="login-submit">
              <button className="btn btn-primary" type="button">
                <i className="fa-solid fa-right-to-bracket" /> Anmelden
              </button>
            </div>
            <div className="login-footer">
              Kein Zugang? <a href="mailto:kontakt@team-lazer.de" style={{ color: 'var(--primary)' }}>Kontaktiere uns</a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
