/* ================================================
   MAIN.JS — TEAM LAZER · 2026
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll state ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Burger / Mobile Nav ── */
  const burger    = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!burger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.g-reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  /* ── Cart badge (legacy, keep count at 0 if element exists) ── */
  document.querySelectorAll('.cart-badge').forEach(b => { b.textContent = '0'; });

});
