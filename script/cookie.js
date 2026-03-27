/* =========================================
   COOKIE.JS – TEAM LAZER Cookie Consent
   ========================================= */

(function() {
  'use strict';

  // Determine privacy link path
  const isInPagesDir = window.location.pathname.includes('/pages/');
  const privacyLink = isInPagesDir ? './privacy.html' : './pages/privacy.html';

  // Check if consent already exists
  const existingConsent = localStorage.getItem('tl_cookie_consent');
  if (existingConsent) {
    return; // Don't show banner if already decided
  }

  // Create banner HTML
  const bannerHTML = `
    <div id="cookie-banner" class="cookie-banner">
      <div class="cookie-text">
        Wir verwenden <strong>Cookies</strong>, um die Nutzererfahrung zu verbessern und Inhalte zu personalisieren. Notwendige Cookies sind für den Betrieb der Website erforderlich. Mit Klick auf <strong>„Alle akzeptieren"</strong> stimmst du auch optionalen Analyse-Cookies zu. Weitere Informationen findest du in unserer <a href="${privacyLink}">Datenschutzerklärung</a>.
      </div>
      <div class="cookie-actions">
        <button class="btn-cookie-decline">Nur notwendige</button>
        <button class="btn-cookie-accept">Alle akzeptieren</button>
      </div>
    </div>
  `;

  // Inject banner into DOM after a delay
  setTimeout(function() {
    const bodyElement = document.body;
    if (bodyElement) {
      bodyElement.insertAdjacentHTML('beforeend', bannerHTML);

      // Get banner element
      const banner = document.getElementById('cookie-banner');

      // Show banner with animation
      setTimeout(function() {
        if (banner) {
          banner.classList.add('visible');
        }
      }, 10);

      // Handle accept button
      const acceptBtn = document.querySelector('.btn-cookie-accept');
      if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
          localStorage.setItem('tl_cookie_consent', 'accepted');
          if (banner) {
            banner.style.transform = 'translateY(120%)';
            setTimeout(function() {
              banner.remove();
            }, 400);
          }
        });
      }

      // Handle decline button
      const declineBtn = document.querySelector('.btn-cookie-decline');
      if (declineBtn) {
        declineBtn.addEventListener('click', function() {
          localStorage.setItem('tl_cookie_consent', 'declined');
          if (banner) {
            banner.style.transform = 'translateY(120%)';
            setTimeout(function() {
              banner.remove();
            }, 400);
          }
        });
      }
    }
  }, 1000);
})();
