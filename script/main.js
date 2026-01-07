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
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

  // --- FAQ ACCORDION ---
  const accHeaders = document.querySelectorAll('.accordion-header');
  accHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      // Close others (optional)
      document.querySelectorAll('.accordion-item').forEach(i => {
        if(i !== item) i.classList.remove('active');
      });
      item.classList.toggle('active');
    });
  });

  // --- CART SLIDEBOARD ---
  const cartTrigger = document.getElementById('cartTrigger');
  const closeCart = document.getElementById('closeCart');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');

  function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
  }

  cartTrigger?.addEventListener('click', toggleCart);
  closeCart?.addEventListener('click', toggleCart);
  cartOverlay?.addEventListener('click', toggleCart);


  // --- CHATBOT ---
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatMessages = document.getElementById('chatMessages');

  chatToggle?.addEventListener('click', () => chatWindow.classList.add('active'));
  chatClose?.addEventListener('click', () => chatWindow.classList.remove('active'));

  window.sendQuickReply = (type) => {
    let reply = "";
    if(type === 'lieferzeit') reply = "Die Bearbeitungszeit variiert zwischen 30 Minuten (kleine Boosts) und bis zu 5 Tagen (große Account-Pakete).";
    if(type === 'sicherheit') reply = "Unsere Methoden sind 'undetected'. Wir testen jeden Patch umfangreich, bevor wir Accounts ausliefern.";
    if(type === 'human') reply = "Verstanden. Bitte komm auf unseren Discord und öffne ein Ticket, ein Mitarbeiter kümmert sich sofort um dich.";
    
    // User Msg
    const userDiv = document.createElement('div');
    userDiv.className = 'msg user';
    let userText = "Frage";
    if(type === 'lieferzeit') userText = "Lieferzeit?";
    if(type === 'sicherheit') userText = "Sicherheit?";
    if(type === 'human') userText = "Mensch?";
    userDiv.innerText = userText;
    chatMessages.appendChild(userDiv);

    // Bot Reply
    setTimeout(() => {
      const botDiv = document.createElement('div');
      botDiv.className = 'msg bot';
      botDiv.innerText = reply;
      chatMessages.appendChild(botDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
  };
});