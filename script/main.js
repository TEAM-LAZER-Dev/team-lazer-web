/* =========================================
   MAIN.JS - SCROLL FIX & LOGIC
   ========================================= */

// --- FIX: BEI RELOAD SOFORT NACH OBEN ---
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'; // Verbietet dem Browser, die Position zu merken
}
// Hartes Scrollen nach oben (bevor der Rest lädt)
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  // Sicherheitshalber nochmal kurz nach dem Laden
  setTimeout(() => window.scrollTo(0, 0), 10);

  // Mobile Menu
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if(burgerBtn) {
    burgerBtn.addEventListener('click', () => mobileMenu.classList.toggle('active'));
  }

  // Scroll Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.scroll-reveal, .slide-left, .slide-right, .stats-card, .universe-card, .feature-box').forEach(el => observer.observe(el));

  // Counter
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || "";
    const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
    let count = 0;
    const update = () => {
      count += target / 60;
      if(count < target) {
        counter.innerText = count.toFixed(decimals).replace('.', ',') + suffix;
        requestAnimationFrame(update);
      } else {
        counter.innerText = target + suffix;
      }
    };
    update();
  });
  
  // Accordion (About Page)
  const accHeaders = document.querySelectorAll('.accordion-header');
  accHeaders.forEach(header => {
    header.addEventListener('click', () => header.parentElement.classList.toggle('active'));
  });

  // Tile Spawner (Hintergrund Animation)
  const tileContainer = document.getElementById('tileContainer');
  if(tileContainer) {
    setInterval(() => {
      const tile = document.createElement('div');
      tile.className = 'bg-tile';
      const size = Math.random() * 40 + 20;
      tile.style.width = size + 'px'; tile.style.height = size + 'px';
      tile.style.left = Math.random() * 100 + 'vw';
      tile.style.animationDuration = (Math.random() * 10 + 15) + 's';
      tileContainer.appendChild(tile);
      setTimeout(() => tile.remove(), 25000);
    }, 2000);
  }
});

/* =========================================
   MAIN.JS - SCROLL FIX, LOGIC & LIVE CHAT
   ========================================= */

// --- FIX: BEI RELOAD SOFORT NACH OBEN ---
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => window.scrollTo(0, 0), 10);

  // Mobile Menu
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if(burgerBtn) {
    burgerBtn.addEventListener('click', () => mobileMenu.classList.toggle('active'));
  }

  // Scroll Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.scroll-reveal, .slide-left, .slide-right, .stats-card, .universe-card, .feature-box, .bento-box, .member-card').forEach(el => observer.observe(el));

  // Counter
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || "";
    const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
    let count = 0;
    const update = () => {
      count += target / 60;
      if(count < target) {
        counter.innerText = count.toFixed(decimals).replace('.', ',') + suffix;
        requestAnimationFrame(update);
      } else {
        counter.innerText = target + suffix;
      }
    };
    update();
  });
  
  // Accordion
  const accHeaders = document.querySelectorAll('.accordion-header');
  accHeaders.forEach(header => {
    header.addEventListener('click', () => header.parentElement.classList.toggle('active'));
  });

  // Tile Spawner
  const tileContainer = document.getElementById('tileContainer');
  if(tileContainer) {
    setInterval(() => {
      const tile = document.createElement('div');
      tile.className = 'bg-tile';
      const size = Math.random() * 40 + 20;
      tile.style.width = size + 'px'; tile.style.height = size + 'px';
      tile.style.left = Math.random() * 100 + 'vw';
      tile.style.animationDuration = (Math.random() * 10 + 15) + 's';
      tileContainer.appendChild(tile);
      setTimeout(() => tile.remove(), 25000);
    }, 2000);
  }

  // --- LIVE CHAT START ---
  initLiveChat();
});

/* =========================================
   LIVE CHAT LOGIC (IMPROVED TEXTS & IMAGE)
   ========================================= */
function initLiveChat() {
  // 1. PFAD FINDUNG FÜR BILDER (Root vs Pages)
  const isPagesDir = window.location.pathname.includes('/pages/');
  const imgPrefix = isPagesDir ? '../images/' : './images/';
  const logoUrl = imgPrefix + 'tl-logo-nobg.webp';

  // 1. HTML INJECTION
  const chatHTML = `
    <div id="tl-chat-container">
      <div class="chat-window" id="chatWindow">
        <div class="chat-header">
          <div class="chat-partner">
            <div class="chat-partner-avatar" id="chatAvatar">
              <img src="${logoUrl}" alt="TL Bot">
            </div>
            <div class="chat-partner-info">
              <h4 id="chatName">TEAM LAZER BOT</h4>
              <span id="chatStatus">Online & Ready</span>
            </div>
          </div>
          <button class="chat-close" id="chatCloseBtn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        
        <div class="chat-body" id="chatBody">
          <div class="chat-msg bot">
            Willkommen im Core von <b>TEAM LAZER</b>. ⚡
            <br>Ich bin dein digitaler Assistent.
          </div>
          <div class="chat-msg bot">
            Frag mich was zu unseren Services oder schreib <b>"Support"</b>, wenn du direkt mit einem Agenten schreiben willst.
          </div>
        </div>
        
        <div class="typing-indicator" id="typingIndicator">
          <i class="fa-solid fa-circle-notch fa-spin"></i> TEAM LAZER Bot schreibt...
        </div>

        <div class="chat-footer">
          <input type="text" class="chat-input" id="chatInput" placeholder="Deine Nachricht..." autocomplete="off">
          <button class="chat-send" id="chatSendBtn"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>

      <button class="chat-toggle-btn" id="chatToggleBtn">
        <i class="fa-solid fa-comment-dots"></i>
      </button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', chatHTML);

  // 2. ELEMENTS & VARIABLES
  const toggleBtn = document.getElementById('chatToggleBtn');
  const windowEl = document.getElementById('chatWindow');
  const closeBtn = document.getElementById('chatCloseBtn');
  const inputEl = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const bodyEl = document.getElementById('chatBody');
  const typingEl = document.getElementById('typingIndicator');
  
  let isSupportMode = false;

  // 3. EVENTS
  toggleBtn.addEventListener('click', () => {
    windowEl.classList.toggle('active');
    if(windowEl.classList.contains('active')) inputEl.focus();
  });
  
  closeBtn.addEventListener('click', () => windowEl.classList.remove('active'));

  const sendMessage = () => {
    const text = inputEl.value.trim();
    if(!text) return;

    // User Message
    addMessage(text, 'user');
    inputEl.value = '';

    // Logic Handler
    if(isSupportMode) {
      handleSupportLogic(text);
    } else {
      handleBotLogic(text);
    }
  };

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') sendMessage();
  });

  // 4. HELPER FUNCTIONS
  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('chat-msg', sender);
    div.innerHTML = text;
    bodyEl.appendChild(div);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function showTyping(show) {
    if(show) typingEl.classList.add('visible');
    else typingEl.classList.remove('visible');
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  // --- BOT LOGIC ---
  function handleBotLogic(text) {
    showTyping(true);
    
    const lower = text.toLowerCase();
    let reply = "Das liegt außerhalb meiner Datenbank. Schreib <b>'Support'</b> für menschliche Hilfe.";

    if(lower.includes('hallo') || lower.includes('hi') || lower.includes('moin')) {
      reply = "Hey! 👋 Bereit, dein Projekt aufs nächste Level zu heben?";
    } else if(lower.includes('preis') || lower.includes('kosten') || lower.includes('geld')) {
      reply = "Wir machen keine Standard-Preise. Bei <b>TEAM LAZER</b> kriegst du maßgeschneiderte Lösungen. Öffne ein Ticket im Discord für ein Angebot.";
    } else if(lower.includes('discord')) {
      reply = "Join the Elite: <a href='https://discord.gg/DEINLINK' target='_blank' style='color:#4ade80;text-decoration:underline;font-weight:700;'>Hier klicken</a>";
    } else if(lower.includes('bot') || lower.includes('dev')) {
      reply = "Wir coden alles. Python, JS, Web-Dashboards. Was brauchst du?";
    } else if(lower.includes('support') || lower.includes('hilfe') || lower.includes('admin')) {
      reply = "Verstanden. Ich leite dich an unser Staff-Team weiter... 🔄";
      setTimeout(() => switchToSupportMode(), 2000); 
      return; // Stop standard reply
    }

    setTimeout(() => {
      showTyping(false);
      addMessage(reply, 'bot');
    }, 800 + Math.random() * 500); 
  }

  // --- SUPPORT SWITCH ---
  function switchToSupportMode() {
    isSupportMode = true;
    showTyping(true);
    
    setTimeout(() => {
      // Visuelle Änderung am Header
      const avatarEl = document.getElementById('chatAvatar');
      avatarEl.innerHTML = '<i class="fa-solid fa-headset"></i>';
      avatarEl.style.borderColor = '#ef4444'; // Rot für Support
      avatarEl.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.5)';
      
      const nameEl = document.getElementById('chatName');
      nameEl.innerText = "TEAM LAZER STAFF";
      nameEl.style.color = "#ef4444";

      document.getElementById('chatStatus').innerText = "Schreibt...";
      
      showTyping(false);
      addMessage("Hi! Hier ist der Support. Worum geht es?", 'bot');
    }, 2000);
  }

  // --- SUPPORT LOGIC (Simulation) ---
  function handleSupportLogic(text) {
    showTyping(true);
    // Simuliert Antwortzeit
    setTimeout(() => {
      showTyping(false);
      addMessage("Danke für die Info. Ein Admin schaut sich das gleich an. (Dies ist eine Demo-Antwort)", 'bot');
    }, 2500);
  }
}