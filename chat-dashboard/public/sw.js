/* =====================================================
   TEAM LAZER — Chat Dashboard Service Worker
   Web Push Notifications
   ===================================================== */

const DASHBOARD_URL = self.location.origin

/* ── Push Event: Notification anzeigen ─────────── */
self.addEventListener('push', event => {
  let data = {}
  try { data = event.data?.json() } catch(e) {}

  const title = data.title || 'Neuer Chat! 💬'
  const options = {
    body:    data.body  || 'Jemand wartet auf eine Antwort.',
    icon:    '/favicon.ico',
    badge:   '/favicon.ico',
    vibrate: [200, 100, 200],
    tag:     'new-chat',           // Replaces previous notification
    renotify: true,
    data: { url: data.url || DASHBOARD_URL },
    actions: [
      { action: 'open',    title: '💬 Chat öffnen' },
      { action: 'dismiss', title: 'Schließen'       }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

/* ── Notification Click: Dashboard öffnen ────────── */
self.addEventListener('notificationclick', event => {
  event.notification.close()

  if (event.action === 'dismiss') return

  const targetUrl = event.notification.data?.url || DASHBOARD_URL

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Existing dashboard window? Focus it
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    })
  )
})

/* ── Activate: Old caches aufräumen ─────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim())
})
