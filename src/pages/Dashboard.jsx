import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { MEMBERS } from '../data/members'
import { useSEO } from '../lib/seo'

const pageStyle = `
  .dash-wrap { padding: calc(var(--nav-h) + 40px) 0 80px; min-height: 100vh; }
  .dash-header { display: flex; align-items: center; gap: 16px; margin-bottom: 36px; padding-bottom: 28px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
  .dash-avatar { width: 56px; height: 56px; border-radius: 50%; background: var(--primary-dim); border: 2px solid var(--primary-border); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-family: 'Rajdhani', sans-serif; font-weight: 800; color: var(--primary); flex-shrink: 0; overflow: hidden; }
  .dash-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .dash-welcome { flex: 1; min-width: 0; }
  .dash-welcome h2 { font-family: 'Rajdhani', sans-serif; font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 2px; }
  .dash-welcome span { font-size: .84rem; color: var(--muted); }
  .dash-grid { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }
  .dash-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; }
  .dash-card-head { padding: 20px 24px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .dash-card-head h3 { font-family: 'Rajdhani', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: #fff; }
  .dash-card-body { padding: 22px 24px; }
  .dash-sidebar { display: flex; flex-direction: column; gap: 16px; }
  .dash-info-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.05); font-size: .85rem; }
  .dash-info-row:last-child { border-bottom: none; padding-bottom: 0; }
  .dash-info-label { color: var(--muted); }
  .dash-info-val { color: #fff; font-weight: 500; }
  .dash-badge { font-size: .7rem; font-weight: 700; letter-spacing: .4px; text-transform: uppercase; padding: 2px 8px; border-radius: 6px; }
  .dash-badge.owner { background: rgba(124,58,237,.18); color: #a78bfa; border: 1px solid rgba(124,58,237,.3); }
  .dash-badge.member { background: rgba(255,255,255,.06); color: rgba(255,255,255,.5); border: 1px solid rgba(255,255,255,.1); }
  .project-empty { text-align: center; padding: 48px 24px; }
  .project-empty i { font-size: 2.5rem; color: rgba(255,255,255,.08); margin-bottom: 12px; display: block; }
  .project-empty p { font-size: .88rem; color: var(--muted); margin-bottom: 20px; }
  .dash-logout-btn { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 10px; background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2); color: #f87171; font-size: .85rem; font-weight: 600; cursor: pointer; width: 100%; justify-content: center; transition: .2s; }
  .dash-logout-btn:hover { background: rgba(239,68,68,.15); }
  .skills-edit-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .skills-edit-tag { display: flex; align-items: center; gap: 6px; font-size: .8rem; font-weight: 500; padding: 4px 10px; border-radius: 8px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); color: rgba(255,255,255,.7); }
  .coming-soon-overlay { text-align: center; padding: 32px; background: rgba(255,255,255,.02); border-radius: 12px; }
  .coming-soon-overlay i { font-size: 2rem; color: rgba(255,255,255,.1); margin-bottom: 10px; display: block; }
  .coming-soon-overlay p { font-size: .85rem; color: var(--muted); }
  @media(max-width:900px){ .dash-grid { grid-template-columns: 1fr; } .dash-sidebar { order: -1; } }
  @media(max-width:600px){ .dash-card-body { padding: 16px; } .dash-card-head { padding: 16px; } }
`

export default function Dashboard() {
  useSEO({ title: 'Dashboard | TEAM LAZER', description: 'Mitglieder-Dashboard von TEAM LAZER.' })
  const { user, logout } = useAuth()
  const member = MEMBERS.find(m => m.id === user?.id)
  const [bio, setBio] = useState(member?.bio || '')
  const [saved, setSaved] = useState(false)

  if (!member) return null

  function handleSave(e) {
    e.preventDefault()
    // In production: POST to backend API
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="page-wrapper">
      <style>{pageStyle}</style>
      <div className="dash-wrap">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            {/* Header */}
            <div className="dash-header">
              <div className="dash-avatar" style={{ borderColor: `${member.color}55`, color: member.color }}>
                {member.avatar
                  ? <img src={member.avatar} alt={member.name} />
                  : member.name[0].toUpperCase()
                }
              </div>
              <div className="dash-welcome">
                <h2>Hallo, {member.name}!</h2>
                <span>Hier kannst du dein Profil auf team-lazer.de verwalten.</span>
              </div>
              <Link to="/members" className="btn btn-secondary" style={{ fontSize: '.84rem' }}>
                <i className="fa-solid fa-arrow-up-right-from-square" /> Öffentliches Profil
              </Link>
            </div>

            <div className="dash-grid">
              {/* MAIN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Bio bearbeiten */}
                <div className="dash-card">
                  <div className="dash-card-head">
                    <h3><i className="fa-solid fa-pen" style={{ marginRight: '8px', color: 'var(--primary)' }} />Bio bearbeiten</h3>
                  </div>
                  <div className="dash-card-body">
                    <form onSubmit={handleSave}>
                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label>Dein angezeigter Name</label>
                        <input type="text" defaultValue={member.name} placeholder="Angezeigter Name" />
                      </div>
                      <div className="form-group">
                        <label>Kurzbeschreibung</label>
                        <textarea
                          value={bio}
                          onChange={e => setBio(e.target.value)}
                          placeholder="Schreib etwas über dich..."
                          style={{ minHeight: '100px' }}
                        />
                      </div>
                      <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '.88rem' }}>
                          <i className="fa-solid fa-floppy-disk" /> Speichern
                        </button>
                        {saved && (
                          <motion.span
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ color: '#4ade80', fontSize: '.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <i className="fa-solid fa-circle-check" /> Gespeichert!
                          </motion.span>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                {/* Projekte */}
                <div className="dash-card">
                  <div className="dash-card-head">
                    <h3><i className="fa-solid fa-folder-open" style={{ marginRight: '8px', color: 'var(--primary)' }} />Meine Projekte</h3>
                    <span style={{ fontSize: '.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="fa-solid fa-clock" /> Bald verfügbar
                    </span>
                  </div>
                  <div className="dash-card-body">
                    <div className="coming-soon-overlay">
                      <i className="fa-solid fa-folder-plus" />
                      <p>Eigene Portfolio-Projekte hinzufügen – kommt bald.</p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="dash-card">
                  <div className="dash-card-head">
                    <h3><i className="fa-solid fa-code" style={{ marginRight: '8px', color: 'var(--primary)' }} />Skills</h3>
                  </div>
                  <div className="dash-card-body">
                    <div className="skills-edit-tags">
                      {member.skills.map(s => (
                        <span key={s} className="skills-edit-tag">
                          {s}
                          <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', color: 'rgba(255,255,255,.3)', fontSize: '.75rem' }} />
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" placeholder="Skill hinzufügen..." style={{ flex: 1 }} />
                      <button className="btn btn-secondary" style={{ padding: '10px 16px', fontSize: '.84rem', whiteSpace: 'nowrap' }}>
                        <i className="fa-solid fa-plus" /> Add
                      </button>
                    </div>
                    <p style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: '10px' }}>
                      Skill-Speicherung kommt mit dem Backend-Update.
                    </p>
                  </div>
                </div>
              </div>

              {/* SIDEBAR */}
              <div className="dash-sidebar">
                {/* Account Info */}
                <div className="dash-card">
                  <div className="dash-card-head">
                    <h3>Account</h3>
                  </div>
                  <div className="dash-card-body" style={{ padding: '16px 20px' }}>
                    <div className="dash-info-row">
                      <span className="dash-info-label">Username</span>
                      <span className="dash-info-val">{user?.username}</span>
                    </div>
                    <div className="dash-info-row">
                      <span className="dash-info-label">Rolle</span>
                      <span className={`dash-badge ${user?.role === 'owner' ? 'owner' : 'member'}`}>
                        {user?.role === 'owner' ? 'Owner' : 'Member'}
                      </span>
                    </div>
                    <div className="dash-info-row">
                      <span className="dash-info-label">Profil-ID</span>
                      <span className="dash-info-val" style={{ fontFamily: 'monospace', fontSize: '.8rem' }}>{member.id}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="dash-card">
                  <div className="dash-card-head">
                    <h3>Quick Links</h3>
                  </div>
                  <div className="dash-card-body" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link to="/members" className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '.84rem', padding: '9px 14px' }}>
                      <i className="fa-solid fa-users" /> Mitglieder-Seite
                    </Link>
                    <Link to="/bots" className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '.84rem', padding: '9px 14px' }}>
                      <i className="fa-brands fa-discord" /> Unsere Bots
                    </Link>
                    <Link to="/members" className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '.84rem', padding: '9px 14px' }}>
                      <i className="fa-solid fa-users" /> Mitglieder
                    </Link>
                  </div>
                </div>

                {/* Passwort ändern (Coming soon) */}
                <div className="dash-card">
                  <div className="dash-card-head">
                    <h3>Sicherheit</h3>
                  </div>
                  <div className="dash-card-body">
                    <div className="coming-soon-overlay" style={{ padding: '20px 16px' }}>
                      <i className="fa-solid fa-lock" style={{ fontSize: '1.4rem' }} />
                      <p style={{ fontSize: '.82rem' }}>Passwort ändern – bald verfügbar.</p>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <button className="dash-logout-btn" onClick={logout}>
                  <i className="fa-solid fa-right-from-bracket" /> Abmelden
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
