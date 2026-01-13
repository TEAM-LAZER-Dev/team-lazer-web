/* =========================================
   MAIN.JS - MOBILE OPTIMIZED & CHAT FIX
   ========================================= */

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => window.scrollTo(0, 0), 10);

  // Mobile Menu Logic
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if(burgerBtn) {
    burgerBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Burger Button Animation (optional, einfach halten)
        burgerBtn.innerHTML = mobileMenu.classList.contains('active') 
            ? '<i class="fa-solid fa-xmark"></i>' 
            : '<i class="fa-solid fa-bars"></i>';
    });
  }

  // Scroll Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.scroll-reveal, .slide-left, .slide-right, .stats-card, .universe-card, .feature-box, .bento-box, .member-card').forEach(el => observer.observe(el));

  // Counter
  document.querySelectorAll('.counter').forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || "";
    let count = 0;
    const update = () => {
      count += target / 60;
      if(count < target) {
        counter.innerText = Math.floor(count) + suffix;
        requestAnimationFrame(update);
      } else {
        counter.innerText = target + suffix;
      }
    };
    update();
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

  initLiveChat();
});


/* CHAT LOGIC */
function initLiveChat() {
  const isPagesDir = window.location.pathname.includes('/pages/');
  const imgPrefix = isPagesDir ? '../images/' : './images/';
  const logoUrl = imgPrefix + 'tl-logo-nobg.webp';

  const chatHTML = `
    <div id="tl-chat-container">
      <div class="chat-window" id="chatWindow">
        <div class="chat-header" id="chatHeader">
          <div class="chat-partner">
            <div class="chat-partner-avatar" id="chatAvatar"><img src="${logoUrl}"></div>
            <div class="chat-partner-info"><h4 id="chatName">TEAM LAZER BOT</h4><span id="chatStatus">Online</span></div>
          </div>
          <button class="chat-close" id="chatCloseBtn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="chat-body" id="chatBody">
          <div class="chat-msg bot">Willkommen im Chat von <b>TEAM LAZER</b>. ⚡</div>
          <div class="chat-msg bot">Wie kann ich dir helfen?</div>
        </div>
        <div class="typing-indicator" id="typingIndicator"><i class="fa-solid fa-circle-notch fa-spin"></i> schreibt...</div>
        <div class="chat-footer">
          <input type="text" class="chat-input" id="chatInput" placeholder="Nachricht..." autocomplete="off">
          <button class="chat-send" id="chatSendBtn"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>
      <button class="chat-toggle-btn" id="chatToggleBtn"><i class="fa-solid fa-comment-dots"></i></button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', chatHTML);

  const toggleBtn = document.getElementById('chatToggleBtn');
  const windowEl = document.getElementById('chatWindow');
  const inputEl = document.getElementById('chatInput');
  const closeBtn = document.getElementById('chatCloseBtn');
  const sendBtn = document.getElementById('chatSendBtn');
  const bodyEl = document.getElementById('chatBody');
  const typingEl = document.getElementById('typingIndicator');
  
  // FIX: Chat per JS öffnen & Tastatur Logik
  window.openTeamLazerChat = function() {
    windowEl.classList.add('active');
    // NUR AM PC FOKUSSIEREN (Breite > 900px)
    if(window.innerWidth > 900) {
        setTimeout(() => inputEl.focus(), 300);
    }
  };

  toggleBtn.addEventListener('click', () => {
    windowEl.classList.toggle('active');
    if(windowEl.classList.contains('active') && window.innerWidth > 900) {
        inputEl.focus();
    }
  });
  
  closeBtn.addEventListener('click', () => windowEl.classList.remove('active'));

  const sendMessage = () => {
    const text = inputEl.value.trim();
    if(!text) return;
    addMessage(text, 'user');
    inputEl.value = '';
    handleBotLogic(text);
  };

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('chat-msg', sender);
    div.innerHTML = text;
    bodyEl.appendChild(div);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function handleBotLogic(text) {
    typingEl.classList.add('visible');
    setTimeout(() => {
      typingEl.classList.remove('visible');
      let reply = "Das habe ich nicht verstanden. Schreib 'Support' für Hilfe.";
      const lower = text.toLowerCase();
      if(lower.includes('hallo')) reply = "Hey! 👋 Wie geht's?";
      if(lower.includes('support')) reply = "Ich verbinde dich... (Demo)";
      addMessage(reply, 'bot');
    }, 1000);
  }
}