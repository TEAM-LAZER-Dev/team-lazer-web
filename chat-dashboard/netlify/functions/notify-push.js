/* =====================================================
   TEAM LAZER — Web Push Notification Function
   Triggered by Supabase Database Webhook
   (conversations table → INSERT)
   ===================================================== */

const webpush = require('web-push')
const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event) => {
  // Only handle POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let body
  try { body = JSON.parse(event.body || '{}') } catch(e) {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const record = body.record

  // Only fire for new waiting conversations
  if (!record || record.status !== 'waiting') {
    return { statusCode: 200, body: JSON.stringify({ skipped: true }) }
  }

  // Validate env vars
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL,
          SUPABASE_URL, SUPABASE_SERVICE_KEY, DASHBOARD_URL } = process.env

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_EMAIL) {
    console.error('Missing VAPID env vars')
    return { statusCode: 500, body: 'VAPID not configured' }
  }

  webpush.setVapidDetails(
    `mailto:${VAPID_EMAIL}`,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  )

  // Load all agent push subscriptions
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  const { data: agents, error } = await supabase
    .from('agents')
    .select('id, name, push_subscription')
    .not('push_subscription', 'is', null)

  if (error) {
    console.error('Supabase error:', error)
    return { statusCode: 500, body: error.message }
  }

  if (!agents || agents.length === 0) {
    return { statusCode: 200, body: JSON.stringify({ sent: 0, reason: 'no subscriptions' }) }
  }

  const userName = record.user_name || 'Ein Besucher'
  const topic    = record.user_topic ? ` · "${record.user_topic.slice(0,60)}"` : ''
  const dashUrl  = DASHBOARD_URL || 'https://chat.team-lazer.de'

  const payload = JSON.stringify({
    title: `💬 Kunde wartet — ${userName}`,
    body:  `Wartet auf Antwort${topic}`,
    url:   dashUrl
  })

  let sent = 0
  let failed = 0

  await Promise.all(agents.map(async (agent) => {
    try {
      const sub = typeof agent.push_subscription === 'string'
        ? JSON.parse(agent.push_subscription)
        : agent.push_subscription

      await webpush.sendNotification(sub, payload)
      sent++
    } catch(e) {
      console.warn(`Push failed for agent ${agent.id}:`, e.statusCode, e.body)
      // If subscription is expired/invalid, remove it
      if (e.statusCode === 410 || e.statusCode === 404) {
        await supabase
          .from('agents')
          .update({ push_subscription: null })
          .eq('id', agent.id)
      }
      failed++
    }
  }))

  console.log(`Push sent: ${sent}, failed: ${failed}`)
  return {
    statusCode: 200,
    body: JSON.stringify({ sent, failed })
  }
}
