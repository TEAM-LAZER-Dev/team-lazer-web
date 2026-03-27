/* =========================================
   CART.JS – TEAM LAZER Shop Warenkorb-Logik
   ========================================= */

const CART_KEY = 'tl_cart';

/* ── Cart CRUD ── */
function cartGet() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function cartSave(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  cartUpdateBadge();
}

function cartAdd(productId, qty = 1) {
  const items = cartGet();
  const existing = items.find(i => i.id === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, 10);
  } else {
    items.push({ id: productId, qty });
  }
  cartSave(items);
  cartShowToast('Zum Warenkorb hinzugefügt ✓');
}

function cartRemove(productId) {
  const items = cartGet().filter(i => i.id !== productId);
  cartSave(items);
}

function cartSetQty(productId, qty) {
  const items = cartGet();
  const item = items.find(i => i.id === productId);
  if (item) {
    item.qty = Math.max(1, Math.min(parseInt(qty) || 1, 10));
    cartSave(items);
  }
}

function cartClear() {
  cartSave([]);
}

function cartCount() {
  return cartGet().reduce((sum, i) => sum + i.qty, 0);
}

function cartTotal() {
  const items = cartGet();
  return items.reduce((sum, i) => {
    const product = getProductById(i.id);
    return product ? sum + product.price * i.qty : sum;
  }, 0);
}

/* ── Badge-Update ── */
function cartUpdateBadge() {
  const count = cartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ── Toast Notification ── */
function cartShowToast(msg) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.style.cssText = `
      position: fixed; bottom: 100px; right: 24px; z-index: 99999;
      background: rgba(20,20,30,0.95); border: 1px solid var(--primary);
      color: #fff; padding: 14px 20px; border-radius: 10px;
      font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600;
      backdrop-filter: blur(20px); box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      transform: translateY(20px); opacity: 0; transition: all 0.3s ease;
      display: flex; align-items: center; gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-check" style="color:var(--primary);"></i> ${msg}`;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 2500);
}

/* ── Init auf jeder Seite ── */
document.addEventListener('DOMContentLoaded', () => {
  cartUpdateBadge();
});
