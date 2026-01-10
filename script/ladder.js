document.addEventListener('DOMContentLoaded', () => {
  const indicator = document.getElementById('scrollIndicator');
  const dots = document.querySelectorAll('.ladder-dot');
  if(!indicator) return;

  const updateLadder = () => {
    const scrollY = window.scrollY;
    let currentId = dots[0]?.getAttribute('data-target').substring(1) || "intro";

    // Prüfe, welche Sektion gerade sichtbar ist
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 300; // Offset für früheres Aktivieren
      if (scrollY >= secTop) {
        currentId = sec.getAttribute('id');
      }
    });

    dots.forEach(dot => {
      const target = dot.getAttribute('data-target').substring(1);
      if(target === currentId) {
        dot.classList.add('active');
        // Berechne die Position des Indikators relativ zum ersten Punkt
        const dotPos = dot.offsetTop;
        indicator.style.top = (dotPos + 7) + 'px'; 
      } else {
        dot.classList.remove('active');
      }
    });
  };

  // Event Listener
  window.addEventListener('scroll', updateLadder);
  // Einmal beim Laden ausführen
  setTimeout(updateLadder, 200);

  // Smooth Scroll beim Klicken auf einen Punkt
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.querySelector(dot.getAttribute('data-target'));
      if(target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
});