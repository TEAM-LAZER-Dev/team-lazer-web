document.addEventListener('DOMContentLoaded', () => {
  const indicator = document.getElementById('scrollIndicator');
  const dots = document.querySelectorAll('.ladder-dot');
  if(!indicator) return;

  const updateLadder = () => {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    let currentId = dots[0]?.getAttribute('data-target').substring(1) || "home";

    document.querySelectorAll('section').forEach(sec => {
      if(scrollY >= (sec.offsetTop - windowH/2)) {
        currentId = sec.getAttribute('id');
      }
    });

    dots.forEach(dot => {
      const target = dot.getAttribute('data-target').substring(1);
      if(target === currentId) {
        dot.classList.add('active');
        const centerPos = dot.offsetTop + (dot.offsetHeight/2);
        indicator.style.top = centerPos + 'px';
        indicator.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateLadder);
  setTimeout(updateLadder, 100);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.querySelector(dot.getAttribute('data-target'));
      if(target) window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
    });
  });
});