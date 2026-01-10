/* =========================================
   LADDER.JS - STABLE CENTER LOGIC
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.scroll-ladder');
  const indicator = document.getElementById('scrollIndicator');
  
  if (!container || !indicator) return;

  // --- 1. LEITER AUFBAUEN ---
  const dynamicSections = document.querySelectorAll('section[data-ladder-title]');

  if (dynamicSections.length > 0) {
    container.innerHTML = `
      <div class="ladder-line"></div>
      <div class="ladder-indicator" id="scrollIndicator"></div>
    `;
    const newIndicator = document.getElementById('scrollIndicator');

    dynamicSections.forEach((sec, index) => {
      const dot = document.createElement('div');
      dot.classList.add('ladder-dot');
      if (index === 0) dot.classList.add('active');
      
      dot.setAttribute('data-target', '#' + sec.id);
      dot.setAttribute('title', sec.getAttribute('data-ladder-title'));
      
      dot.addEventListener('click', () => {
        const targetSection = document.getElementById(sec.id);
        if (targetSection) {
          const y = targetSection.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
      container.appendChild(dot);
    });
  }

  // --- 2. INTELLIGENTE SCROLL LOGIK ---
  const dots = document.querySelectorAll('.ladder-dot');
  const scrollIndicator = document.getElementById('scrollIndicator');

  const updateLadder = () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.body.offsetHeight;
    const viewportCenter = scrollY + (viewportHeight / 2);

    let currentId = "";
    let minDistance = Infinity;

    // A) Spezialfall: Ganz unten -> Letzten Punkt erzwingen
    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 50) {
       const lastDot = dots[dots.length - 1];
       if(lastDot) currentId = lastDot.getAttribute('data-target').substring(1);
    } 
    // B) Spezialfall: Ganz oben -> Ersten Punkt erzwingen
    else if (scrollY < 100 && dots.length > 0) {
       currentId = dots[0].getAttribute('data-target').substring(1);
    } 
    // C) Normalfall: Finde Sektion am nächsten zur Mitte
    else {
      document.querySelectorAll('section[data-ladder-title]').forEach(sec => {
        const rect = sec.getBoundingClientRect();
        // Absolute Position der Sektion-Mitte im Dokument
        const secCenter = rect.top + scrollY + (rect.height / 2);
        // Abstand zur Viewport-Mitte
        const distance = Math.abs(viewportCenter - secCenter);

        if (distance < minDistance) {
          minDistance = distance;
          currentId = sec.getAttribute('id');
        }
      });
    }

    // --- VISUAL UPDATE ---
    dots.forEach(dot => {
      const target = dot.getAttribute('data-target').substring(1);
      if (target === currentId) {
        dot.classList.add('active');
        if (scrollIndicator) {
          // Soft-Transition für den Punkt
          scrollIndicator.style.top = (dot.offsetTop + 7) + 'px';
        }
      } else {
        dot.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateLadder);
  window.addEventListener('resize', updateLadder);
  setTimeout(updateLadder, 200);
});