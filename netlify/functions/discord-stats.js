/**
 * Netlify Function: discord-stats
 * Ruft die Mitgliederzahl des Discord-Servers ab.
 *
 * Benötigt: DISCORD_BOT_TOKEN als Umgebungsvariable in Netlify
 * Endpunkt: /.netlify/functions/discord-stats
 */

const GUILD_ID = "1466808002920185909";

export default async (req, context) => {
  const token = process.env.DISCORD_BOT_TOKEN;

  if (!token) {
    return new Response(JSON.stringify({ error: "Token fehlt" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}?with_counts=true`,
      {
        headers: {
          Authorization: `Bot ${token}`,
          "User-Agent": "TeamLazerWebsite/1.0",
        },
      }
    );

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Discord API Fehler", status: res.status }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();

    return new Response(
      JSON.stringify({
        member_count: data.approximate_member_count ?? 0,
        online_count: data.approximate_presence_count ?? 0,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=300", // 5 Min cachen
        },
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: "Fetch fehlgeschlagen" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/discord-stats",
};
