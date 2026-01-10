/* =========================================
   LADDER.JS - SMART & STABLE
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.scroll-ladder');
  const indicator = document.getElementById('scrollIndicator');
  
  // Abbruch, wenn keine Leiter im HTML ist (z.B. Impressum)
  if (!container || !indicator) return;

  /* --- 1. AUFBAU DER LEITER (Smart Mode) --- */
  // Wir suchen alle Sektionen mit dem Attribut 'data-ladder-title'
  // Das erlaubt uns, auf "About" 10 Punkte zu haben und auf "Home" nur 4, ohne Chaos.
  const dynamicSections = document.querySelectorAll('section[data-ladder-title]');

  if (dynamicSections.length > 0) {
    // Alte Punkte löschen, aber Line & Indicator behalten
    container.innerHTML = `
      <div class="ladder-line"></div>
      <div class="ladder-indicator" id="scrollIndicator"></div>
    `;

    // Indicator neu holen, da DOM überschrieben wurde
    const newIndicator = document.getElementById('scrollIndicator');

    dynamicSections.forEach((sec, index) => {
      const dot = document.createElement('div');
      dot.classList.add('ladder-dot');
      if (index === 0) dot.classList.add('active'); // Erster Punkt aktiv
      
      // Verknüpfung via ID
      dot.setAttribute('data-target', '#' + sec.id);
      dot.setAttribute('title', sec.getAttribute('data-ladder-title'));
      
      // Klick-Event direkt hier anhängen
      dot.addEventListener('click', () => {
        const targetSection = document.getElementById(sec.id);
        if (targetSection) {
          // Soft Scroll mit Offset für Navbar
          const y = targetSection.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });

      container.appendChild(dot);
    });
  }

  /* --- 2. UPDATE BEIM SCROLLEN --- */
  const dots = document.querySelectorAll('.ladder-dot');
  const scrollIndicator = document.getElementById('scrollIndicator');

  const updateLadder = () => {
    const scrollY = window.scrollY;
    // Mitte des Bildschirms als Trigger-Punkt nutzen (besser als Top)
    const triggerPoint = scrollY + (window.innerHeight / 3);

    let currentId = "";

    // Finde die Sektion, die gerade am relevantesten ist
    document.querySelectorAll('section[id]').forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.offsetHeight;
      
      if (triggerPoint >= secTop && triggerPoint < secTop + secHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    // Wenn ganz oben, nimm immer den ersten Punkt
    if(scrollY < 100 && dots.length > 0) {
       currentId = dots[0].getAttribute('data-target').substring(1);
    }

    dots.forEach(dot => {
      const target = dot.getAttribute('data-target').substring(1);
      if (target === currentId) {
        dot.classList.add('active');
        if (scrollIndicator) {
          // Indikator exakt auf den Punkt schieben
          scrollIndicator.style.top = (dot.offsetTop + 7) + 'px';
        }
      } else {
        dot.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateLadder);
  // Initialer Aufruf um Position zu setzen
  setTimeout(updateLadder, 100);
});