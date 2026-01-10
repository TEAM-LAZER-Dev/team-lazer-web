/* =========================================
   LADDER.JS - SMART NAVIGATION
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.scroll-ladder');
  const indicator = document.getElementById('scrollIndicator');
  
  if (!container || !indicator) return;

  // 1. LOGIK: Dynamische Generierung
  // Suche nach Sektionen, die in die Leiter sollen (haben das Attribut data-ladder-title)
  const dynamicSections = document.querySelectorAll('section[data-ladder-title]');

  if (dynamicSections.length > 0) {
    // Wenn solche Sektionen gefunden werden, baue die Leiter neu auf
    // Wir behalten die Line und den Indicator, löschen aber alte Dots
    container.innerHTML = `
      <div class="ladder-line"></div>
      <div class="ladder-indicator" id="scrollIndicator"></div>
    `;

    // Neu referenzieren nach innerHTML Tausch
    const newIndicator = document.getElementById('scrollIndicator');

    dynamicSections.forEach((sec, index) => {
      const dot = document.createElement('div');
      dot.classList.add('ladder-dot');
      if (index === 0) dot.classList.add('active');
      
      // Target ID und Titel aus dem HTML der Section holen
      dot.setAttribute('data-target', '#' + sec.id);
      dot.setAttribute('title', sec.getAttribute('data-ladder-title'));
      
      container.appendChild(dot);
    });
  }

  // 2. FUNKTIONALITÄT (Für dynamische UND statische Leitern)
  const dots = document.querySelectorAll('.ladder-dot');
  const scrollIndicator = document.getElementById('scrollIndicator'); // Sicherheitshalber neu holen

  const updateLadder = () => {
    const scrollY = window.scrollY;
    // Standardmäßig den ersten Dot nehmen
    let currentId = dots[0]?.getAttribute('data-target').substring(1);

    // Prüfen, welche Sektion im Fokus ist
    document.querySelectorAll('section[id]').forEach(sec => {
      const secTop = sec.offsetTop - 300; // Trigger-Punkt etwas oberhalb
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight + 300) {
        currentId = sec.getAttribute('id');
      }
    });

    dots.forEach(dot => {
      const target = dot.getAttribute('data-target').substring(1);
      if (target === currentId) {
        dot.classList.add('active');
        // Indikator Position berechnen
        if(scrollIndicator) {
            scrollIndicator.style.top = (dot.offsetTop + 7) + 'px';
        }
      } else {
        dot.classList.remove('active');
      }
    });
  };

  // Click Events für Smooth Scroll
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetId = dot.getAttribute('data-target');
      const targetSec = document.querySelector(targetId);
      if (targetSec) {
        window.scrollTo({
          top: targetSec.offsetTop - 80, // Bisserl Platz für Header lassen
          behavior: 'smooth'
        });
      }
    });
  });

  // Init
  window.addEventListener('scroll', updateLadder);
  setTimeout(updateLadder, 100); // Kurz warten für Layout
});