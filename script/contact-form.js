document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("Danke! Deine Nachricht wurde (simuliert) gesendet.");
      form.reset();
    });
  }
});