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