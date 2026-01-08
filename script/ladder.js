document.addEventListener('DOMContentLoaded', () => {
  const ladder = document.querySelector('.scroll-ladder');
  const indicator = document.getElementById('scrollIndicator');
  const dots = document.querySelectorAll('.ladder-dot');
  
  if(!ladder) return; // Exit if not present

  const updateLadder = () => {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    let currentId = "";

    document.querySelectorAll('section').forEach(sec => {
      if(scrollY >= (sec.offsetTop - windowH/2)) {
        currentId = sec.getAttribute('id');
      }
    });

    if(!currentId && dots.length > 0) currentId = dots[0].getAttribute('data-target').substring(1);

    dots.forEach(dot => {
      const target = dot.getAttribute('data-target').substring(1);
      if(target === currentId) {
        dot.classList.add('active');
        const topPos = dot.offsetTop + (dot.offsetHeight/2);
        indicator.style.top = topPos + 'px';
      } else {
        dot.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateLadder);
  setTimeout(updateLadder, 100); // Init

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.querySelector(dot.getAttribute('data-target'));
      if(target) window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
    });
  });
});