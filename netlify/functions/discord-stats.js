/**
 * Netlify Function: discord-stats
 * Gibt Mitglieder- und Online-Zahlen für einen Discord-Server zurück.
 *
 * Aufruf: /discord-stats?invite=dCxU6KqWFz
 *
 * Für den eigenen Server (mit Bot-Token): exakte Zahlen via Bot-API
 * Für externe Server: approximierte Zahlen via öffentlicher Invite-API (kein Token nötig)
 *
 * Env-Variable (optional, nur für genauere Zahlen):
 *   DISCORD_BOT_TOKEN  – Bot-Token des tl-hub Bots
 *   TL_GUILD_ID        – Guild ID des TEAM LAZER Servers
 */

const TL_GUILD_ID  = process.env.TL_GUILD_ID  || "1466808002920185909"
const BOT_TOKEN    = process.env.DISCORD_BOT_TOKEN

export default async (req) => {
  const url    = new URL(req.url)
  const invite = url.searchParams.get("invite")

  if (!invite) {
    return json({ error: "invite parameter fehlt" }, 400)
  }

  // ── Für den eigenen Server: Bot-API (exakter) ──────────────────────────────
  if (BOT_TOKEN) {
    try {
      // Invite auflösen → Guild ID ermitteln
      const inviteRes = await fetch(
        `https://discord.com/api/v10/invites/${invite}`,
        { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
      )
      if (inviteRes.ok) {
        const inviteData = await inviteRes.json()
        const guildId = inviteData?.guild?.id

        // Wenn es unser eigener Server ist → exakte Zahlen via Bot-API
        if (guildId === TL_GUILD_ID) {
          const guildRes = await fetch(
            `https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
            { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
          )
          if (guildRes.ok) {
            const g = await guildRes.json()
            return json({
              member_count: g.approximate_member_count ?? 0,
              online_count: g.approximate_presence_count ?? 0,
            })
          }
        }
      }
    } catch (_) {}
  }

  // ── Fallback: öffentliche Invite-API (keine Auth nötig) ───────────────────
  try {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${invite}?with_counts=true`,
    )
    if (!res.ok) return json({ error: "Invite nicht gefunden" }, 404)

    const data = await res.json()
    return json({
      member_count: data.approximate_member_count ?? 0,
      online_count: data.approximate_presence_count ?? 0,
    })
  } catch (e) {
    return json({ error: "Fetch fehlgeschlagen" }, 500)
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=300",
    },
  })
}

export const config = { path: "/discord-stats" }
