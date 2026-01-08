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

  document.querySelectorAll('.scroll-reveal, .slide-left, .slide-right, .stats-card').forEach(el => observer.observe(el));

  // --- INTELLIGENT COUNTER ANIMATION ---
  let countersStarted = false;
  function startCounters() {
    if(countersStarted) return;
    countersStarted = true;
    
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target')); // Kann auch Float sein
      const suffix = counter.getAttribute('data-suffix') || "";
      const decimals = parseInt(counter.getAttribute('data-decimals')) || 0; // Wie viele Nachkommastellen?
      
      const duration = 2000; // Animation dauert immer 2 Sekunden
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
        
        // Formatierung: Punkt zu Komma für deutsche Ausgabe
        let formattedNumber = current.toFixed(decimals).replace('.', ',');
        counter.innerText = formattedNumber + suffix;
        
      }, stepTime);
    });
  }

  // --- SMOOTH SCROLL ---
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