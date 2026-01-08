document.addEventListener('DOMContentLoaded', () => {
  
  // --- MOBILE MENU ---
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  burgerBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = burgerBtn.querySelector('i');
    if (mobileMenu.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  // --- SCROLL ANIMATIONS ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if(entry.target.querySelector('.counter')) {
            startCounters();
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.scroll-reveal, .slide-left, .slide-right, .stats-card, .universe-card, .feature-box').forEach(el => observer.observe(el));

  // --- COUNTER ANIMATION ---
  let countersStarted = false;
  function startCounters() {
    if(countersStarted) return;
    countersStarted = true;
    
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || "";
      const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
      
      const duration = 2000; 
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if(current >= target) {
          current = target;
          clearInterval(timer);
        }
        let formattedNumber = current.toFixed(decimals).replace('.', ',');
        counter.innerText = formattedNumber + suffix;
      }, stepTime);
    });
  }

  // --- SCROLL LADDER LOGIC (PC) ---
  const ladderEnergy = document.getElementById('ladderEnergy');
  const ladderDots = document.querySelectorAll('.ladder-dot');
  
  if (ladderEnergy && window.innerWidth > 900) {
    window.addEventListener('scroll', () => {
      // 1. Energieball bewegen (Relativ zur gesamten Seitenhöhe)
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      
      // Begrenzung zwischen 0% und 100% der Leiter-Höhe
      const ladderHeight = document.querySelector('.ladder-line').offsetHeight;
      const movePos = Math.min(Math.max(scrollPercent * ladderHeight, 0), ladderHeight);
      
      ladderEnergy.style.top = movePos + 'px';

      // 2. Aktive Sektion highlighten
      let currentSectionId = "";
      
      document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollTop >= (sectionTop - 300)) {
          currentSectionId = section.getAttribute('id');
        }
      });

      ladderDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-target') === '#' + currentSectionId) {
          dot.classList.add('active');
        }
      });
    });

    // Klick auf Dots
    ladderDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetId = dot.getAttribute('data-target');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // --- SMOOTH SCROLL (Allgemein) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      mobileMenu.classList.remove('active');
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if(targetSection){
          window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
          });
      }
    });
  });

});