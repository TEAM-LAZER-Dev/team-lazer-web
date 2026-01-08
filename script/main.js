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

  // --- SCROLL LADDER LOGIC (Clean & Jumping) ---
  const scrollIndicator = document.getElementById('scrollIndicator');
  const ladderDots = document.querySelectorAll('.ladder-dot');
  
  if (scrollIndicator && window.innerWidth > 900) {
    
    let lastSectionId = "";

    const updateLadder = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Finde aktive Sektion
      let currentSectionId = "home"; 
      
      document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        // Wenn Sektion sichtbar ist (mitte des screens)
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
            
            // Position berechnen
            const dotTop = dot.offsetTop;
            const dotHeight = dot.offsetHeight;
            const centerPos = dotTop + (dotHeight / 2);

            // Animation Reset
            scrollIndicator.classList.remove('pulsing');
            scrollIndicator.classList.remove('landed');
            
            // Sprung starten
            void scrollIndicator.offsetWidth; // Reflow Trigger
            scrollIndicator.classList.add('jumping');
            
            // Bewegen
            scrollIndicator.style.top = centerPos + 'px';

            // Landung
            setTimeout(() => {
              scrollIndicator.classList.remove('jumping');
              scrollIndicator.classList.add('landed');
              scrollIndicator.classList.add('pulsing');
            }, 600); // Entspricht CSS Transition Zeit

          } else {
            dot.classList.remove('active');
          }
        });
      }
    };

    // Init
    setTimeout(() => updateLadder(), 100);
    window.addEventListener('scroll', updateLadder);

    // Dot Click Navigation
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

  // --- SMOOTH SCROLL (General) ---
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