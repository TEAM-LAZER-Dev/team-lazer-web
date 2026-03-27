// =====================================================
//  Telegram Benachrichtigung bei neuem Chat
//  Wird von Supabase Database Webhook aufgerufen
//  Env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
// =====================================================

export default async (req) => {
  // Nur POST erlauben
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const body = await req.json()

    // Supabase sendet das neue Record unter body.record
    const record = body.record || body

    // Nur bei neuen Wartenden Chats benachrichtigen
    if (record.status !== 'waiting') {
      return new Response('OK - not a new waiting chat', { status: 200 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId   = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      console.error('TELEGRAM_BOT_TOKEN oder TELEGRAM_CHAT_ID fehlen')
      return new Response('Config missing', { status: 500 })
    }

    const userName = record.user_name || 'Besucher'
    const time = new Date().toLocaleTimeString('de-DE', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin'
    })

    const message =
      `💬 <b>Neuer Chat!</b>\n\n` +
      `👤 <b>Von:</b> ${userName}\n` +
      `🕐 <b>Zeit:</b> ${time}\n\n` +
      `➡️ <a href="https://chat.team-lazer.de">Dashboard öffnen</a>`

    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('Telegram API Error:', err)
      return new Response('Telegram error: ' + err, { status: 500 })
    }

    return new Response('Notification sent', { status: 200 })
  } catch (err) {
    console.error('Function error:', err)
    return new Response('Internal error', { status: 500 })
  }
}

export const config = { path: '/api/notify-telegram' }
