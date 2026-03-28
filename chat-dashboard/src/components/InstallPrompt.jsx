import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Platform detection ──────────────────────────── */
function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}
function isAndroid() {
  return /android/i.test(navigator.userAgent)
}
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
}

/* ══════════════════════════════════════════════════
   INSTALL PROMPT BANNER
══════════════════════════════════════════════════ */
export default function InstallPrompt() {
  const [show, setShow]             = useState(false)
  const [isIOSDevice, setIsIOS]     = useState(false)
  const [deferredPrompt, setDeferred] = useState(null)
  const [installed, setInstalled]   = useState(false)

  useEffect(() => {
    // Schon installiert oder dismissed → nicht anzeigen
    if (isStandalone()) return
    if (sessionStorage.getItem('tl_install_dismissed')) return

    const ios = isIOS()
    setIsIOS(ios)

    if (ios) {
      // iOS: immer anzeigen wenn nicht standalone
      setTimeout(() => setShow(true), 1500)
      return
    }

    // Android / Chrome: auf beforeinstallprompt warten
    const handler = (e) => {
      e.preventDefault()
      setDeferred(e)
      setTimeout(() => setShow(true), 1500)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Falls App bereits installiert wird
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setTimeout(() => setShow(false), 2000)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    sessionStorage.setItem('tl_install_dismissed', '1')
    setShow(false)
  }

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setTimeout(() => setShow(false), 2000)
    }
    setDeferred(null)
    sessionStorage.setItem('tl_install_dismissed', '1')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="install-prompt"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <div className="install-prompt-icon">
            <img src="/icon-192.png" alt="TEAM LAZER" />
          </div>

          <div className="install-prompt-body">
            {installed ? (
              <>
                <strong>✅ Installiert!</strong>
                <span>Die App wurde zum Startbildschirm hinzugefügt.</span>
              </>
            ) : isIOSDevice ? (
              <>
                <strong>App installieren</strong>
                <span>
                  Tippe auf{' '}
                  <span className="install-share-icon">
                    <i className="fas fa-arrow-up-from-bracket" />
                  </span>
                  {' '}und dann{' '}
                  <em>„Zum Home-Bildschirm"</em>
                </span>
              </>
            ) : (
              <>
                <strong>App installieren</strong>
                <span>Zum Startbildschirm hinzufügen für schnellen Zugriff & Push-Benachrichtigungen.</span>
              </>
            )}
          </div>

          <div className="install-prompt-actions">
            {!installed && !isIOSDevice && deferredPrompt && (
              <button className="install-btn-primary" onClick={install}>
                <i className="fas fa-download" /> Installieren
              </button>
            )}
            {!installed && (
              <button className="install-btn-dismiss" onClick={dismiss}>
                {isIOSDevice ? 'OK' : 'Später'}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
