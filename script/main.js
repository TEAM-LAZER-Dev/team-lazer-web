document.addEventListener('DOMContentLoaded', () => {
  
  // --- MOBILE MENU ---
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  burgerBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = burgerBtn.querySelector('i');
    if (mobileMenu.classList.contains('active')) {
      icon.classList.remove('fa-bars'); icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark'); icon.classList.add('fa-bars');
    }
  });

  // --- SCROLL ANIMATIONS ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if(entry.target.querySelector('.counter')) startCounters();
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.scroll-reveal, .slide-left, .slide-right, .stats-card, .universe-card, .feature-box').forEach(el => observer.observe(el));

  // --- COUNTER ---
  let countersStarted = false;
  function startCounters() {
    if(countersStarted) return; countersStarted = true;
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || "";
      const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
      const duration = 2000; const stepTime = 20; const steps = duration / stepTime; const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if(current >= target) { current = target; clearInterval(timer); }
        let formattedNumber = current.toFixed(decimals).replace('.', ',');
        counter.innerText = formattedNumber + suffix;
      }, stepTime);
    });
  }

  // --- SCROLL LADDER & AI MAN ---
  const ladderEnergy = document.getElementById('ladderEnergy');
  const ladderDots = document.querySelectorAll('.ladder-dot');
  
  if (ladderEnergy && window.innerWidth > 900) {
    let lastSectionId = "";
    let idleTimer = null;
    let behaviorInterval = null;
    let isManActive = false;

    // --- MAN BUILDER ---
    const buildMan = () => {
      ladderEnergy.innerHTML = `
        <div class="man-wrapper">
          <div class="man-head"></div>
          <div class="man-torso"></div>
          <div class="man-arm left"></div><div class="man-arm right"></div>
          <div class="man-leg left"></div><div class="man-leg right"></div>
        </div>`;
    };

    const clearMan = () => {
      ladderEnergy.innerHTML = ''; // Leeren
    };

    // --- BEHAVIOR AI ---
    const startBehavior = () => {
      if (!isManActive) return;
      const wrapper = ladderEnergy.querySelector('.man-wrapper');
      
      const actions = [
        () => { // WALK LEFT
          ladderEnergy.classList.add('walking');
          ladderEnergy.classList.remove('sitting');
          wrapper.style.transform = 'translateX(-50%) scaleX(1)'; // Look Left
          ladderEnergy.style.left = '20%';
        },
        () => { // WALK RIGHT
          ladderEnergy.classList.add('walking');
          ladderEnergy.classList.remove('sitting');
          wrapper.style.transform = 'translateX(-50%) scaleX(-1)'; // Look Right
          ladderEnergy.style.left = '80%';
        },
        () => { // SIT CENTER
          ladderEnergy.classList.remove('walking');
          ladderEnergy.classList.add('sitting');
          ladderEnergy.style.left = '50%';
          createThoughtBubble();
        },
        () => { // SIT CURRENT
          ladderEnergy.classList.remove('walking');
          ladderEnergy.classList.add('sitting');
          createThoughtBubble();
        }
      ];

      // Random action every 3-5 seconds
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      randomAction();
      
      behaviorInterval = setTimeout(startBehavior, Math.random() * 2000 + 3000);
    };

    const createThoughtBubble = () => {
      if(!ladderEnergy.classList.contains('sitting')) return;
      const bubble = document.createElement('div');
      bubble.className = 'thought-bubble';
      ladderEnergy.appendChild(bubble);
      setTimeout(() => bubble.remove(), 2000);
    };

    // --- STATE MANAGER ---
    const spawnMan = () => {
      if (isManActive) return;
      isManActive = true;
      buildMan();
      ladderEnergy.classList.add('man-active');
      startBehavior();
    };

    const despawnMan = () => {
      if (!isManActive) return;
      
      clearTimeout(behaviorInterval);
      ladderEnergy.classList.add('exiting'); // Trigger fade out
      
      setTimeout(() => {
        isManActive = false;
        ladderEnergy.classList.remove('man-active', 'exiting', 'walking', 'sitting');
        ladderEnergy.style.left = '50%'; // Reset pos
        clearMan();
        ladderEnergy.classList.add('pulsing'); // Back to normal dot
      }, 400);
    };

    const updateLadder = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // 1. User Action -> Kill Man
      despawnMan();
      
      // 2. Set Idle Timer
      clearTimeout(idleTimer);
      idleTimer = setTimeout(spawnMan, 5000);

      // 3. Ladder Logic
      let currentSectionId = "home"; 
      document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - windowHeight/2)) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId !== lastSectionId) {
        lastSectionId = currentSectionId;
        ladderDots.forEach(dot => {
          const target = dot.getAttribute('data-target').substring(1);
          if (target === currentSectionId) {
            dot.classList.add('active');
            const centerPos = dot.offsetTop + (dot.offsetHeight / 2);
            
            // Jump
            ladderEnergy.classList.remove('pulsing', 'landed');
            void ladderEnergy.offsetWidth; 
            ladderEnergy.classList.add('jumping');
            ladderEnergy.style.top = centerPos + 'px';

            setTimeout(() => {
              ladderEnergy.classList.remove('jumping');
              ladderEnergy.classList.add('landed');
              if(!isManActive) ladderEnergy.classList.add('pulsing');
            }, 600);
          } else {
            dot.classList.remove('active');
          }
        });
      }
    };

    setTimeout(() => updateLadder(), 100);
    window.addEventListener('scroll', updateLadder);
    
    // Dot Click
    ladderDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetSection = document.querySelector(dot.getAttribute('data-target'));
        if(targetSection) window.scrollTo({ top: targetSection.offsetTop - 100, behavior: 'smooth' });
      });
    });
  }

  // --- SMOOTH SCROLL ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      mobileMenu.classList.remove('active');
      const targetSection = document.querySelector(this.getAttribute('href'));
      if(targetSection) window.scrollTo({ top: targetSection.offsetTop - 80, behavior: 'smooth' });
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // ... (Dein existierender Mobile Menu & Scroll Animation Code bleibt hier) ...
  // ... (Füge hier den Code für Mobile Menu, Observer, Counter ein, wie im vorigen Schritt) ...

  // --- SCROLL LADDER (Nur der Punkt links) ---
  const scrollIndicator = document.getElementById('scrollIndicator');
  const ladderDots = document.querySelectorAll('.ladder-dot');
  
  if (scrollIndicator && window.innerWidth > 900) {
    // Einfache Logik: Punkt springt mit Sektionen (wie vorher, nur ohne Männchen-Logik)
    const updateScrollDot = () => {
      let currentId = "home";
      const midLine = window.scrollY + window.innerHeight/2;
      document.querySelectorAll('section').forEach(sec => {
        if(midLine >= sec.offsetTop) currentId = sec.getAttribute('id');
      });
      
      ladderDots.forEach(dot => {
        const target = dot.getAttribute('data-target').substring(1);
        if(target === currentId) {
          dot.classList.add('active');
          const topPos = dot.offsetTop + dot.offsetHeight/2;
          scrollIndicator.style.top = topPos + 'px';
        } else {
          dot.classList.remove('active');
        }
      });
    };
    window.addEventListener('scroll', updateScrollDot);
    setTimeout(updateScrollDot, 100);
  }

  // --- FREE ROAMING STICK MAN (Die AI) ---
  const stickMan = document.getElementById('freeStickMan');
  const wrapper = stickMan?.querySelector('.man-wrapper');
  
  if (stickMan && window.innerWidth > 900) {
    let isIdle = false;
    let idleTimer = null;
    let aiLoop = null;

    // Startposition (Mitte Screen)
    let posX = window.innerWidth / 2;
    let posY = window.innerHeight / 2;
    
    // Gedanken (Random Texte)
    const thoughts = ["?", "Zzz...", "Hunger", "Wo hin?", "Laufen...", "Team Lazer", "Code?", "Bug?", "Kaffee?"];

    // Update Funktion für Position
    const updatePos = (x, y, speed) => {
      stickMan.style.transition = `top ${speed}s linear, left ${speed}s linear`;
      stickMan.style.left = x + 'px';
      stickMan.style.top = y + 'px';
      posX = x; 
      posY = y;
    };

    const showThought = () => {
      const bubble = document.createElement('div');
      bubble.className = 'thought-bubble';
      bubble.innerText = thoughts[Math.floor(Math.random() * thoughts.length)];
      
      // Position über dem Kopf
      bubble.style.left = posX + 'px';
      bubble.style.top = (posY - 60) + 'px';
      
      document.body.appendChild(bubble);
      setTimeout(() => bubble.remove(), 3000);
    };

    // Die "Intelligenz"
    const decideNextMove = () => {
      if (!isIdle) return; // Wenn User scrollt, mach nix

      const action = Math.random(); // Zufallszahl 0.0 - 1.0

      if (action < 0.6) { 
        // --- LAUFEN (60% Chance) ---
        stickMan.classList.remove('sitting');
        stickMan.classList.add('walking');

        // Neues zufälliges Ziel im Fenster (mit Randabstand)
        const targetX = Math.random() * (window.innerWidth - 100) + 50;
        const targetY = Math.random() * (window.innerHeight - 100) + 50;
        
        // Blickrichtung setzen
        if (targetX > posX) wrapper.style.transform = "scaleX(-1)"; // Nach rechts schauen
        else wrapper.style.transform = "scaleX(1)"; // Nach links schauen

        // Distanz berechnen für Geschwindigkeit
        const dist = Math.hypot(targetX - posX, targetY - posY);
        const duration = dist / 100; // Pixel pro Sekunde (Speed)

        updatePos(targetX, targetY, duration);

        // Nächste Entscheidung nach Ankunft
        aiLoop = setTimeout(decideNextMove, duration * 1000);

      } else if (action < 0.9) {
        // --- SITZEN / WARTEN (30% Chance) ---
        stickMan.classList.remove('walking');
        stickMan.classList.add('sitting');
        
        // Vielleicht denken?
        if(Math.random() > 0.5) showThought();

        // Warten
        aiLoop = setTimeout(decideNextMove, Math.random() * 3000 + 2000); // 2-5 Sek warten

      } else {
        // --- STEHEN (10% Chance) ---
        stickMan.classList.remove('walking');
        stickMan.classList.remove('sitting');
        
        // Kurz warten
        aiLoop = setTimeout(decideNextMove, 1000);
      }
    };

    // --- IDLE CHECKER ---
    // Prüft, ob der User interagiert
    const resetIdle = () => {
      clearTimeout(idleTimer);
      clearTimeout(aiLoop);
      
      // Wenn er gerade aktiv war, verschwinden lassen
      if (isIdle) {
        isIdle = false;
        stickMan.classList.remove('active'); // Fade out
        stickMan.classList.remove('walking', 'sitting');
      }

      // Timer neu starten (nach 4 Sekunden Inaktivität -> Start)
      idleTimer = setTimeout(() => {
        isIdle = true;
        stickMan.classList.add('active'); // Fade in
        
        // Startposition auf aktuelle Mausposition oder Mitte setzen? 
        // Wir nehmen einfach eine zufällige Position in der Nähe, damit er nicht aufploppt
        posX = Math.random() * (window.innerWidth - 100) + 50;
        posY = Math.random() * (window.innerHeight - 100) + 50;
        stickMan.style.transition = 'none'; // Sofort springen
        stickMan.style.left = posX + 'px';
        stickMan.style.top = posY + 'px';

        decideNextMove(); // Start AI
      }, 4000);
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('scroll', resetIdle);
    window.addEventListener('click', resetIdle);
    
    resetIdle(); // Init
  }
});