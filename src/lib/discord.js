import { useEffect, useState } from 'react'

// Live-Daten eines Discord-Servers über die öffentliche Einladungs-Schnittstelle
// (kein Token nötig, kein eigener Server). Ergebnis wird 5 Minuten im Browser zwischengespeichert.
const TTL = 5 * 60 * 1000

export function useDiscordInvite(code) {
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!code) return undefined
    const key = `discord-invite-${code}`

    try {
      const cached = JSON.parse(sessionStorage.getItem(key) || 'null')
      if (cached && Date.now() - cached.t < TTL) {
        setData(cached.d)
        return undefined
      }
    } catch { /* Speicher nicht verfügbar – egal */ }

    const ctrl = new AbortController()
    fetch(`https://discord.com/api/v10/invites/${code}?with_counts=true`, { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then(j => {
        const d = {
          name: j.guild?.name,
          members: j.approximate_member_count,
          online: j.approximate_presence_count,
          icon: j.guild?.icon ? `https://cdn.discordapp.com/icons/${j.guild.id}/${j.guild.icon}.webp?size=128` : null,
        }
        setData(d)
        try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d })) } catch { /* ignorieren */ }
      })
      .catch(() => { /* Bei Fehler bleibt die Karte ohne Live-Zahlen */ })

    return () => ctrl.abort()
  }, [code])

  return data
}
