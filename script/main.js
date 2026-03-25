/* =========================================
   MAIN.JS
   ========================================= */

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => window.scrollTo(0, 0), 10);

  // ── Mobile Menu ────────────────────────────────
  const burgerBtn  = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
    burgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      burgerBtn.innerHTML = mobileMenu.classList.contains('active')
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ── Scroll Animations ──────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.scroll-reveal, .slide-left, .slide-right, .stats-card, .universe-card, .feature-box, .bento-box, .member-card'
  ).forEach(el => observer.observe(el));

  // ── Counter Animation ──────────────────────────
  document.querySelectorAll('.counter').forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    let count = 0;
    const update = () => {
      count += target / 60;
      if (count < target) {
        counter.innerText = Math.floor(count) + suffix;
        requestAnimationFrame(update);
      } else {
        counter.innerText = target + suffix;
      }
    };
    update();
  });

  initLiveChat();
});


/* =========================================
   LIVE CHAT – ENHANCED BOT ENGINE
   ========================================= */
function initLiveChat() {
  const isPagesDir  = window.location.pathname.includes('/pages/');
  const imgPrefix   = isPagesDir ? '../images/' : './images/';
  const contactPath = isPagesDir ? './contact.html' : './pages/contact.html';
  const aboutPath   = isPagesDir ? './about.html'   : './pages/about.html';
  const homePath    = isPagesDir ? '../index.html'  : './index.html';
  const logoUrl     = imgPrefix + 'tl-logo-nobg.webp';

  document.body.insertAdjacentHTML('beforeend', `
    <div id="tl-chat-container">
      <div class="chat-window" id="chatWindow">
        <div class="chat-header">
          <div class="chat-partner">
            <div class="chat-partner-avatar"><img src="${logoUrl}" alt="Bot" /></div>
            <div class="chat-partner-info">
              <h4>TEAM LAZER BOT</h4>
              <span id="chatStatus"><i class="fa-solid fa-circle" style="font-size:.45rem;color:#4ade80;vertical-align:middle;margin-right:4px;"></i>Online</span>
            </div>
          </div>
          <button class="chat-close" id="chatCloseBtn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="chat-body" id="chatBody"></div>
        <div class="typing-indicator" id="typingIndicator">
          <span></span><span></span><span></span>
        </div>
        <div class="chat-footer">
          <input type="text" class="chat-input" id="chatInput" placeholder="Nachricht eingeben..." autocomplete="off" />
          <button class="chat-send" id="chatSendBtn"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>
      <button class="chat-toggle-btn" id="chatToggleBtn">
        <i class="fa-solid fa-comment-dots" id="chatToggleIcon"></i>
      </button>
    </div>
  `);

  const toggleBtn  = document.getElementById('chatToggleBtn');
  const windowEl   = document.getElementById('chatWindow');
  const inputEl    = document.getElementById('chatInput');
  const closeBtn   = document.getElementById('chatCloseBtn');
  const sendBtn    = document.getElementById('chatSendBtn');
  const bodyEl     = document.getElementById('chatBody');
  const typingEl   = document.getElementById('typingIndicator');
  const toggleIcon = document.getElementById('chatToggleIcon');

  let chatOpened = false;

  // ── Open / Close ─────────────────────────────────────────────
  function openChat() {
    windowEl.classList.add('active');
    toggleIcon.className = 'fa-solid fa-xmark';
    if (!chatOpened) { chatOpened = true; showWelcome(); }
    if (window.innerWidth > 900) setTimeout(() => inputEl.focus(), 300);
  }
  function closeChat() {
    windowEl.classList.remove('active');
    toggleIcon.className = 'fa-solid fa-comment-dots';
  }

  window.openTeamLazerChat = openChat;
  toggleBtn.addEventListener('click', () => windowEl.classList.contains('active') ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  // ── Messaging ─────────────────────────────────────────────────
  function addMessage(html, sender) {
    // Quick-Replies entfernen sobald Nutzer schreibt
    if (sender === 'user') bodyEl.querySelector('.quick-replies')?.remove();

    const wrap = document.createElement('div');
    wrap.className = 'chat-msg-wrap ' + sender;

    const msg = document.createElement('div');
    msg.className = 'chat-msg ' + sender;
    msg.innerHTML = html;

    const ts = document.createElement('span');
    ts.className = 'chat-ts';
    ts.textContent = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    wrap.appendChild(msg);
    wrap.appendChild(ts);
    bodyEl.appendChild(wrap);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function addQuickReplies(buttons) {
    bodyEl.querySelector('.quick-replies')?.remove();
    const row = document.createElement('div');
    row.className = 'quick-replies';
    buttons.forEach(({ label, trigger }) => {
      const btn = document.createElement('button');
      btn.className = 'qr-btn';
      btn.innerHTML = label;
      btn.addEventListener('click', () => {
        addMessage(label, 'user');
        row.remove();
        handleBotLogic(trigger || label);
      });
      row.appendChild(btn);
    });
    bodyEl.appendChild(row);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function botReply(html, buttons, customDelay) {
    typingEl.classList.add('visible');
    bodyEl.scrollTop = bodyEl.scrollHeight;
    const plain = html.replace(/<[^>]*>/g, '');
    const delay = customDelay ?? Math.min(500 + plain.length * 16, 2400);
    setTimeout(() => {
      typingEl.classList.remove('visible');
      addMessage(html, 'bot');
      if (buttons?.length) addQuickReplies(buttons);
    }, delay);
  }

  const sendMessage = () => {
    const text = inputEl.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    inputEl.value = '';
    handleBotLogic(text);
  };
  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

  // ── Welcome Message ───────────────────────────────────────────
  function showWelcome() {
    botReply(
      `Willkommen bei <b>TEAM LAZER</b>! ⚡<br>Ich bin dein persönlicher Assistent. Was kann ich für dich tun?`,
      [
        { label: '🎮 Discord joinen', trigger: 'discord' },
        { label: '📧 Support',        trigger: 'support' },
        { label: 'ℹ️ Über uns',       trigger: 'über uns' },
        { label: '📞 Kontakt',        trigger: 'kontakt' },
      ],
      700
    );
  }

  // ═══════════════════════════════════════════════════════════════
  //  BOT ENGINE
  // ═══════════════════════════════════════════════════════════════

  // Levenshtein-Distanz für Tippfehler-Toleranz
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i-1] === b[j-1]
          ? dp[i-1][j-1]
          : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
    return dp[m][n];
  }

  // Text normalisieren (Umlaute, Sonderzeichen, Kleinschreibung)
  function norm(text) {
    return text.toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Prüft ob Text ein Keyword enthält – direkt oder per Fuzzy-Match
  function matches(text, keywords) {
    const n = norm(text);
    const words = n.split(' ');
    return keywords.some(kw => {
      const nk = norm(kw);
      if (n.includes(nk)) return true;
      // Fuzzy: Levenshtein auf Wortebene (nur bei Keywords ≥ 4 Zeichen)
      if (nk.length >= 4) {
        const maxDist = Math.floor(nk.length / 4); // ~1 Fehler pro 4 Buchstaben
        return words.some(w => Math.abs(w.length - nk.length) <= 3 && levenshtein(w, nk) <= maxDist);
      }
      return false;
    });
  }

  // Zufällige Antwort aus Liste
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // HTML-Link Helfer
  function a(href, label) {
    return `<a href="${href}" target="_blank" style="color:var(--primary);text-decoration:underline;">${label}</a>`;
  }

  // Wissensdatenbank
  const KB = {
    discord:       'https://discord.gg/dCxU6KqWFz',
    instagram:     'https://www.instagram.com/team_lazer.de',
    tiktok:        'https://www.tiktok.com/@team.lazer.de',
    whatsapp:      'https://wa.me/491794406720',
    mailKontakt:   'kontakt@team-lazer.de',
    mailSupport:   'support@team-lazer.de',
    mailSecurity:  'security@team-lazer.de',
    members:       '457+',
    servers:       '2',
    projects:      '56',
    activeProj:    '5',
    founded:       '2021',
  };

  // ── Intent-Routing ────────────────────────────────────────────
  function handleBotLogic(text) {
    const t = text.toLowerCase();

    // BEGRÜSSUNG
    if (matches(t, ['hallo', 'hi', 'hey', 'servus', 'moin', 'sup', 'guten tag', 'guten abend', 'guten morgen', 'was geht', 'whaddup', 'grüß gott', 'hola', 'yo', 'nabend', 'n abend', 'gude'])) {
      return botReply(pick([
        `Hey! 👋 Schön, dass du da bist. Was kann ich für dich tun?`,
        `Hi! Ich bin der TEAM LAZER Bot – frag mich einfach alles! ⚡`,
        `Moin! Wie kann ich dir weiterhelfen? 😄`,
      ]), [
        { label: '🎮 Discord',    trigger: 'discord' },
        { label: '📧 Support',    trigger: 'support' },
        { label: 'ℹ️ Über uns',  trigger: 'über uns' },
      ]);
    }

    // VERABSCHIEDUNG
    if (matches(t, ['tschüss', 'bye', 'ciao', 'auf wiedersehen', 'bb', 'cya', 'tschau', 'bis dann', 'man', 'tschuss', 'tschues'])) {
      return botReply(pick([
        `Bis dann! 👋 Falls du nochmal Fragen hast – ich bin immer hier.`,
        `Tschüss! War schön mit dir zu chatten. 😊`,
        `Ciao! Du findest uns auch auf ${a(KB.discord, 'Discord')} 💜`,
      ]));
    }

    // DANKE
    if (matches(t, ['danke', 'thx', 'thanks', 'ty', 'dankeschön', 'merci', 'dankö', 'dankee', 'danköön', 'dake', 'besten dank'])) {
      return botReply(pick([
        `Gerne! 😊 Wenn du noch etwas brauchst – immer her damit.`,
        `Kein Problem, dafür bin ich da! 💪`,
        `Sehr gerne! Noch andere Fragen?`,
      ]));
    }

    // POSITIVES FEEDBACK
    if (matches(t, ['gut', 'nice', 'cool', 'krass', 'geil', 'super', 'perfekt', 'top', 'sehr gut', 'genial', 'awesome', 'fire', 'lit', 'hammer', 'geilo', 'ok', 'passt', 'alles klar', 'verstanden'])) {
      return botReply(pick([
        `Das freut mich! 🙌 Noch irgendwas?`,
        `Nice! 😎 Ich bin für weitere Fragen jederzeit da.`,
        `💜 Immer gerne. TEAM LAZER at its best.`,
      ]));
    }

    // NEGATIVES FEEDBACK / FRUSTRATION
    if (matches(t, ['scheiße', 'scheiß', 'mist', 'shit', 'crap', 'fuck', 'idiot', 'dumm', 'blöd', 'nutzlos', 'sucks', 'müll', 'nervig', 'kacke'])) {
      return botReply(pick([
        `Ich verstehe deine Frustration. 😓 Lass mich dir besser helfen – was genau ist das Problem?`,
        `Hm, da läuft was nicht. Was kann ich konkret für dich tun? 💪`,
      ]), [
        { label: '📧 Support kontaktieren', trigger: 'support' },
        { label: '🎮 Discord Ticket',       trigger: 'discord' },
      ]);
    }

    // BOT-IDENTITÄT
    if (matches(t, ['bist du ein bot', 'bist du echt', 'ki', 'ai', 'chatgpt', 'künstliche intelligenz', 'automatisch', 'mensch', 'wer bist du', 'was bist du', 'roboter', 'automat'])) {
      return botReply(pick([
        `Ja, ich bin ein Bot! 🤖 Aber kein gewöhnlicher – ich kenne TEAM LAZER in- und auswendig.<br>Für echten Live-Support: ${a(KB.discord, 'Discord Ticket')} erstellen!`,
        `Ich bin der offizielle TEAM LAZER Bot ⚡<br>Für komplexere Anliegen empfehle ich ein ${a(KB.discord, 'Discord Ticket')}.`,
      ]));
    }

    // DISCORD
    if (matches(t, ['discord', 'server', 'beitreten', 'joinen', 'join', 'discod', 'dircord', 'disocrd', 'discorrd', 'einladen', 'invite', 'community', 'dicord', 'dsicord'])) {
      return botReply(
        `🎮 Unser Discord wartet auf dich!<br><br>` +
        `👉 ${a(KB.discord, 'discord.gg/dCxU6KqWFz')}<br><br>` +
        `Mit über <b>${KB.members} Mitgliedern</b>, einem Ticket-System und regelmäßigen Events – komm dazu! 🔥`
      );
    }

    // SUPPORT / HILFE
    if (matches(t, ['support', 'hilfe', 'help', 'problem', 'issue', 'kaputt', 'funktioniert nicht', 'supprot', 'hilf', 'helfen', 'hilfee', 'ticket', 'suport', 'hilpa'])) {
      return botReply(
        `Für Support stehen dir diese Wege offen:<br><br>` +
        `🎟 <b>Discord Ticket</b> (schnellste Antwort)<br>${a(KB.discord, 'discord.gg/dCxU6KqWFz')}<br><br>` +
        `📧 <b>E-Mail Support</b><br>${a('mailto:' + KB.mailSupport, KB.mailSupport)}<br><br>` +
        `📋 ${a(contactPath, 'Kontaktformular öffnen')}`,
        [
          { label: '📋 Kontaktformular', trigger: 'kontaktformular' },
          { label: '🎮 Discord Ticket',  trigger: 'discord' },
        ]
      );
    }

    // KONTAKT / EMAIL
    if (matches(t, ['kontakt', 'email', 'mail', 'schreiben', 'erreichen', 'melden', 'kontaktieren', 'formular', 'kontak', 'e-mail', 'email adresse'])) {
      return botReply(
        `📬 So erreichst du uns:<br><br>` +
        `📧 Allgemein: ${a('mailto:' + KB.mailKontakt, KB.mailKontakt)}<br>` +
        `🛠 Support: ${a('mailto:' + KB.mailSupport, KB.mailSupport)}<br>` +
        `🛡 Security: ${a('mailto:' + KB.mailSecurity, KB.mailSecurity)}<br><br>` +
        `Oder nutze das: ${a(contactPath, '📋 Kontaktformular')}`,
        [{ label: '📋 Formular öffnen', trigger: 'kontaktformular' }]
      );
    }

    // KONTAKTFORMULAR (direkt weiterleiten)
    if (matches(t, ['kontaktformular', 'formular', 'form öffnen', 'formular öffnen'])) {
      setTimeout(() => { window.location.href = contactPath; }, 1500);
      return botReply(`Ich leite dich gleich zum Kontaktformular weiter... 📋`);
    }

    // ÜBER UNS
    if (matches(t, ['über uns', 'ueber uns', 'wer seid ihr', 'was ist team lazer', 'was macht ihr', 'über euch', 'info', 'about', 'infos', 'stell dich vor', 'beschreib', 'erzähl'])) {
      return botReply(
        `⚡ <b>TEAM LAZER</b> – gegründet <b>${KB.founded}</b> als CoD-Clan, heute ein professionelles Gaming-Netzwerk.<br><br>` +
        `Wir entwickeln eigene Tools & Bots, bauen Communities auf und liefern Qualität, wo andere aufhören.<br><br>` +
        `📊 <b>${KB.members}</b> Nutzer • <b>${KB.servers}</b> Server • <b>${KB.projects}</b> Projekte`,
        [
          { label: '👥 Das Team',   trigger: 'team' },
          { label: '📅 Geschichte', trigger: 'geschichte' },
          { label: '📊 Stats',      trigger: 'stats' },
        ]
      );
    }

    // TEAM / MITGLIEDER
    if (matches(t, ['team', 'mitglieder', 'staff', 'owner', 'leitung', 'roster', 'crew', 'wer macht', 'mitarbeiter', 'besetzung', 'teem', 'tean'])) {
      return botReply(
        `👥 <b>Das TEAM LAZER Roster:</b><br><br>` +
        `👑 <b>fivozo</b> – Owner & Admin<br>` +
        `🥈 <b>wizzard</b> – Co-Owner (Service, Events)<br>` +
        `💻 <b>nico</b> – Developer (Frontend & Backend)<br>` +
        `⚙️ <b>user4</b> – Developer (Backend)<br>` +
        `📋 <b>user1</b> – Management (Team & Events)<br>` +
        `🛡 <b>user3</b> – Cybersecurity<br>` +
        `📦 <b>user2</b> – Service & Product Management`
      );
    }

    // GESCHICHTE
    if (matches(t, ['geschichte', 'history', 'entstehung', 'gegründet', 'wann', 'anfang', 'ursprung', 'wie alles begann', 'timeline', 'vergangenheit', 'gegrundet', 'geshichte'])) {
      return botReply(
        `📅 <b>Die TEAM LAZER Geschichte:</b><br><br>` +
        `🎮 <b>2021</b> – Start als CoD-Clan<br>` +
        `🔥 <b>2022</b> – Erste Schritte in der Entwicklung<br>` +
        `🌍 <b>2023</b> – Expansion & erste eigene Website<br>` +
        `🤖 <b>2024</b> – Discord-Server & eigene Bots live<br>` +
        `🚀 <b>2025</b> – Kompletter Relaunch der Infrastruktur<br>` +
        `⚡ <b>Heute</b> – Das Ökosystem steht!`
      );
    }

    // STATS / ZAHLEN
    if (matches(t, ['stats', 'statistik', 'zahlen', 'wie viele', 'groesse', 'größe', 'how many', 'anzahl', 'wachstum', 'mitglieder anzahl', 'statistiken'])) {
      return botReply(
        `📊 <b>TEAM LAZER in Zahlen:</b><br><br>` +
        `💜 <b>${KB.members}</b> Discord-Mitglieder<br>` +
        `🖥 <b>${KB.servers}</b> aktive Server<br>` +
        `✅ <b>${KB.projects}</b> realisierte Projekte<br>` +
        `🔥 <b>${KB.activeProj}</b> aktive Projekte in Entwicklung`
      );
    }

    // SOCIAL MEDIA (Übersicht)
    if (matches(t, ['social', 'socials', 'social media', 'links', 'alle links', 'wo findet man euch', 'plattformen', 'netzwerke'])) {
      return botReply(
        `📲 <b>Folg uns überall:</b><br><br>` +
        `🎮 Discord: ${a(KB.discord, 'discord.gg/dCxU6KqWFz')}<br>` +
        `📸 Instagram: ${a(KB.instagram, '@team_lazer.de')}<br>` +
        `🎵 TikTok: ${a(KB.tiktok, '@team.lazer.de')}<br>` +
        `💬 WhatsApp: ${a(KB.whatsapp, 'Chat starten')}`
      );
    }

    // INSTAGRAM
    if (matches(t, ['instagram', 'insta', 'instagramm', 'inagram', 'instgram', 'insagram'])) {
      return botReply(`📸 Unser Instagram:<br>${a(KB.instagram, '@team_lazer.de')} – Folg uns!`);
    }

    // TIKTOK
    if (matches(t, ['tiktok', 'tik tok', 'tikток', 'tik-tok', 'videos', 'clips', 'tiktoc', 'tiktuk'])) {
      return botReply(`🎵 Unser TikTok:<br>${a(KB.tiktok, '@team.lazer.de')} – Schau vorbei!`);
    }

    // WHATSAPP
    if (matches(t, ['whatsapp', 'whats app', 'wasap', 'watsapp', 'wattsapp', 'wp'])) {
      return botReply(`💬 WhatsApp-Kontakt:<br>${a(KB.whatsapp, 'Chat starten')} 📱`);
    }

    // PROJEKTE / ENTWICKLUNG
    if (matches(t, ['projekte', 'projekt', 'entwicklung', 'development', 'was habt ihr gebaut', 'bot', 'discord bot', 'tools', 'builds', 'arbeit', 'code', 'software', 'programm', 'projeckte', 'entwickelt'])) {
      return botReply(
        `🔨 <b>Was wir entwickeln:</b><br><br>` +
        `🤖 Eigene Discord-Bots für Automatisierung & Community<br>` +
        `🌐 Web-Infrastruktur & Services<br>` +
        `🎮 Gaming-Server & Community-Tools<br>` +
        `🛡 Security-Systeme<br><br>` +
        `Aktuell laufen <b>${KB.activeProj} aktive Projekte</b>. 🔥`
      );
    }

    // GAMING
    if (matches(t, ['gaming', 'game', 'spielen', 'zocken', 'cod', 'call of duty', 'fps', 'multiplayer', 'ranked', 'lan', 'gameing', 'gaiming', 'spiele'])) {
      return botReply(pick([
        `🎮 Gaming ist unsere DNA! Wir sind aktiv in verschiedenen FPS-Titeln.<br>Für gemeinsame Sessions meld dich ${a(KB.discord, 'im Discord')}!`,
        `🕹 Wir starteten als CoD-Clan und sind seitdem gewachsen.<br>Such dir Mitspieler in unserem ${a(KB.discord, 'Discord Server')}!`,
      ]));
    }

    // EVENTS
    if (matches(t, ['events', 'event', 'turnier', 'tournament', 'veranstaltung', 'wettbewerb', 'eventz', 'turniere', 'wettkampf', 'evnet'])) {
      return botReply(
        `🏆 Events und Turniere kündigen wir in unserem Discord an!<br><br>` +
        `👉 ${a(KB.discord, 'Jetzt joinen und nichts verpassen!')}`,
        [{ label: '🎮 Discord joinen', trigger: 'discord' }]
      );
    }

    // BEWERBUNG / MITMACHEN
    if (matches(t, ['bewerben', 'bewerbung', 'mitmachen', 'einsteigen', 'team werden', 'staff werden', 'apply', 'mitglied werden', 'beitretten', 'bewer', 'aufnehmen'])) {
      return botReply(
        `🙌 Du willst Teil von TEAM LAZER werden?<br><br>` +
        `Am besten meldest du dich in unserem Discord:<br>` +
        `👉 ${a(KB.discord, 'discord.gg/dCxU6KqWFz')}<br><br>` +
        `Oder per Mail: ${a('mailto:' + KB.mailKontakt, KB.mailKontakt)}`,
        [{ label: '🎮 Discord öffnen', trigger: 'discord' }]
      );
    }

    // SECURITY / BUG REPORT
    if (matches(t, ['security', 'sicherheit', 'bug report', 'vulnerability', 'exploit', 'hack', 'sicherheitslücke', 'lücke', 'sekurity', 'sicherheitsproblem', 'gehackt'])) {
      return botReply(
        `🛡 <b>Security-Meldung</b> – Danke, dass du uns informierst!<br><br>` +
        `Melde Sicherheitsprobleme bitte <b>ausschließlich</b> per E-Mail:<br>` +
        `📧 ${a('mailto:' + KB.mailSecurity, KB.mailSecurity)}<br><br>` +
        `⚠️ Bitte keine Details veröffentlichen, bevor wir reagiert haben.`
      );
    }

    // PARTNERSCHAFT
    if (matches(t, ['partner', 'kooperation', 'zusammenarbeit', 'business', 'partnerschaft', 'sponsoring', 'collab', 'kollaboration', 'kooperartion', 'partnerschft'])) {
      return botReply(
        `🤝 Interesse an einer <b>Partnerschaft</b>?<br><br>` +
        `📧 ${a('mailto:' + KB.mailKontakt, KB.mailKontakt)}<br><br>` +
        `Oder im ${a(contactPath, 'Kontaktformular')} das Thema <b>"Partnerschaft & Kooperation"</b> wählen.`,
        [{ label: '📋 Kontaktformular', trigger: 'kontaktformular' }]
      );
    }

    // WEBSITE / SEITEN
    if (matches(t, ['website', 'seite', 'webseite', 'homepage', 'seiten', 'pages', 'navigation', 'websit', 'webseite'])) {
      return botReply(
        `🌐 Die Website hat folgende Seiten:<br><br>` +
        `🏠 ${a(homePath, 'Startseite')}<br>` +
        `👥 ${a(aboutPath, 'Über uns')}<br>` +
        `📋 ${a(contactPath, 'Kontakt & Support')}`
      );
    }

    // IMPRESSUM / DATENSCHUTZ
    if (matches(t, ['impressum', 'datenschutz', 'agb', 'rechtliches', 'legal', 'privacy', 'impresium', 'datenshcutz'])) {
      const basePath = isPagesDir ? './' : './pages/';
      return botReply(
        `📄 Rechtliches:<br><br>` +
        `${a(basePath + 'impressum.html', 'Impressum')}<br>` +
        `${a(basePath + 'privacy.html', 'Datenschutzerklärung')}`
      );
    }

    // ── FALLBACK ─────────────────────────────────────────────────
    return botReply(
      pick([
        `Hmm, das hab ich nicht ganz verstanden. 🤔 Vielleicht hilft eines dieser Themen:`,
        `Das liegt außerhalb meines Wissens – aber ich helfe dir gerne hier weiter:`,
        `Ich bin mir nicht sicher, was du meinst. 😅 Probier's mal damit:`,
      ]),
      [
        { label: '🎮 Discord',   trigger: 'discord' },
        { label: '📧 Support',   trigger: 'support' },
        { label: '👥 Das Team',  trigger: 'team' },
        { label: '📞 Kontakt',   trigger: 'kontakt' },
      ]
    );
  }
}
