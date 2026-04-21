/* ============================================================
   CART.JS — Cart Logic, localStorage, UI Updates
   ============================================================ */

(function () {
  'use strict';

  /* ==================== CART STATE ==================== */

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('dd_cart') || '[]');
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('dd_cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }

  /* ==================== CART PAGE RENDERING ==================== */

  const cartEmpty = document.querySelector('.cart-empty');
  const cartItems = document.querySelector('.cart-items');
  const orderSummary = document.querySelector('.order-summary');
  const cartHeroCount = document.querySelector('.cart-hero__count');

  function formatPrice(amount) {
    return 'Rp ' + Number(amount).toLocaleString('id-ID').replace(/,/g, '.');
  }

  function getChapterClass(chapter) {
    const map = {
      'dawn': 'dawn',
      'chasing': 'chasing',
      'gray': 'gray',
      'void': 'void',
      'golden': 'golden',
      'newdawn': 'newdawn'
    };
    return map[chapter] || 'dawn';
  }

  function getChapterLabel(chapter) {
    const map = {
      'dawn': 'Dawn',
      'chasing': 'Chasing',
      'gray': 'Gray Area',
      'void': 'Midnight',
      'golden': 'Golden Hour',
      'newdawn': 'New Dawn'
    };
    return map[chapter] || chapter;
  }

  // Per-chapter abstract SVG art for cart items
  function getCartItemSVG(chapter) {
    const svgs = {
      dawn: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="70" r="35" fill="#f5d7b5" opacity="0.15"/>
        <ellipse cx="50" cy="55" rx="22" ry="28" fill="#f5d7b5" opacity="0.2"/>
        <circle cx="50" cy="40" r="12" fill="#f5d7b5" opacity="0.3"/>
        <path d="M30 65 Q50 35 70 65" stroke="#f5d7b5" stroke-width="1" fill="none" opacity="0.4"/>
      </svg>`,
      chasing: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="30" x2="90" y2="70" stroke="#3a5fc8" stroke-width="1.5" opacity="0.5"/>
        <line x1="10" y1="50" x2="90" y2="30" stroke="#3a5fc8" stroke-width="1" opacity="0.3"/>
        <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="#3a5fc8" stroke-width="1" opacity="0.3"/>
        <circle cx="70" cy="35" r="8" fill="#3a5fc8" opacity="0.25"/>
      </svg>`,
      gray: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="15" width="70" height="70" fill="none" stroke="#8a8a8a" stroke-width="0.8" opacity="0.3"/>
        <rect x="25" y="25" width="50" height="50" fill="#8a8a8a" opacity="0.06"/>
        <rect x="35" y="35" width="30" height="30" fill="none" stroke="#8a8a8a" stroke-width="1" opacity="0.35"/>
        <circle cx="50" cy="50" r="8" fill="#8a8a8a" opacity="0.2"/>
      </svg>`,
      void: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="#1a1030" opacity="0.8"/>
        <circle cx="50" cy="50" r="25" fill="none" stroke="#6b5b95" stroke-width="0.8" opacity="0.4"/>
        <circle cx="50" cy="50" r="10" fill="#6b5b95" opacity="0.2"/>
        <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50" stroke="#6b5b95" stroke-width="0.8" opacity="0.3"/>
      </svg>`,
      golden: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="20" fill="#d4832a" opacity="0.25"/>
        <path d="M50 5 L50 95 M5 50 L95 50 M20 20 L80 80 M80 20 L20 80" stroke="#d4832a" stroke-width="0.8" opacity="0.15"/>
        <circle cx="50" cy="50" r="35" fill="none" stroke="#d4832a" stroke-width="0.5" opacity="0.2"/>
        <ellipse cx="50" cy="50" rx="15" ry="35" fill="#d4832a" opacity="0.1"/>
      </svg>`,
      newdawn: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 60 Q30 20 50 50 Q70 80 90 40" stroke="#c9e8d4" stroke-width="1.5" fill="none" opacity="0.4"/>
        <circle cx="50" cy="50" r="20" fill="#c9e8d4" opacity="0.1"/>
        <path d="M20 80 Q50 30 80 60" stroke="#c9e8d4" stroke-width="1" fill="none" opacity="0.25"/>
        <circle cx="75" cy="30" r="10" fill="#c9e8d4" opacity="0.2"/>
      </svg>`
    };
    return svgs[chapter] || svgs.dawn;
  }

  function renderCartItem(item) {
    const chapterClass = getChapterClass(item.chapter);
    const chapterLabel = getChapterLabel(item.chapter);
    const totalPrice = (item.price * (item.qty || 1));

    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__image">
          ${getCartItemSVG(item.chapter)}
        </div>
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <span class="badge badge--${chapterClass}">${chapterLabel}</span>
          <div class="cart-item__size">Ukuran: ${item.size || 'M'}</div>
          <div class="cart-item__qty">
            <button class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Kurangi">−</button>
            <span class="qty-value">${item.qty || 1}</span>
            <button class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Tambah">+</button>
          </div>
        </div>
        <div class="cart-item__actions">
          <div class="cart-item__price">${formatPrice(totalPrice)}</div>
          <button class="cart-item__remove" data-id="${item.id}" aria-label="Hapus item">
            <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
            Hapus
          </button>
        </div>
      </div>
    `;
  }

  function renderOrderSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

    if (orderSummary) {
      const subtotalEl = orderSummary.querySelector('[data-summary="subtotal"]');
      const totalEl = orderSummary.querySelector('[data-summary="total"]');
      if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
      if (totalEl) totalEl.textContent = formatPrice(subtotal);
    }
  }

  function updateCartCount(cart) {
    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    if (cartHeroCount) {
      cartHeroCount.textContent = totalItems === 0
        ? 'Keranjangmu kosong'
        : `${totalItems} item${totalItems > 1 ? '' : ''}`;
    }
  }

  function renderCart() {
    if (!cartEmpty || !cartItems || !orderSummary) return;

    const cart = getCart();

    if (cart.length === 0) {
      cartEmpty.classList.add('visible');
      cartItems.classList.remove('visible');
      orderSummary.classList.remove('visible');
    } else {
      cartEmpty.classList.remove('visible');
      cartItems.classList.add('visible');
      orderSummary.classList.add('visible');

      // Render items
      const itemsContainer = cartItems.querySelector('[data-cart-items]');
      if (itemsContainer) {
        itemsContainer.innerHTML = cart.map(renderCartItem).join('');
      }

      renderOrderSummary(cart);
    }

    updateCartCount(cart);
  }

  /* ==================== CART INTERACTIONS ==================== */

  function handleCartInteraction(e) {
    const btn = e.target.closest('[data-action], .cart-item__remove, .cart-clear-btn');
    if (!btn) return;

    const cart = getCart();

    // Qty controls
    if (btn.dataset.action) {
      const id = btn.dataset.id;
      const item = cart.find(i => i.id === id);
      if (!item) return;

      if (btn.dataset.action === 'increase') {
        item.qty = (item.qty || 1) + 1;
      } else if (btn.dataset.action === 'decrease') {
        item.qty = (item.qty || 1) - 1;
        if (item.qty <= 0) {
          removeItem(id, cart);
          return;
        }
      }

      saveCart(cart);
      renderCart();
      return;
    }

    // Remove button
    if (btn.classList.contains('cart-item__remove')) {
      const id = btn.dataset.id;
      const cartItemEl = document.querySelector(`.cart-item[data-id="${id}"]`);
      if (cartItemEl) {
        cartItemEl.classList.add('removing');
        setTimeout(() => {
          removeItem(id, getCart());
        }, 300);
      } else {
        removeItem(id, cart);
      }
      return;
    }

    // Clear all
    if (btn.classList.contains('cart-clear-btn')) {
      if (confirm('Yakin ingin mengosongkan keranjang?')) {
        saveCart([]);
        renderCart();
      }
    }
  }

  function removeItem(id, cart) {
    const updated = cart.filter(i => i.id !== id);
    saveCart(updated);
    renderCart();
  }

  /* ==================== ADD TO CART BUTTONS ==================== */

  function handleAddToCart(e) {
    const btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;

    const productData = btn.dataset.addToCart;
    try {
      const product = JSON.parse(productData);
      if (window.DD && window.DD.addToCart) {
        window.DD.addToCart(product);
        // Visual feedback on button
        const original = btn.textContent;
        btn.textContent = '✓ Ditambahkan';
        btn.style.background = 'rgba(201,232,212,0.15)';
        btn.style.color = 'var(--newdawn-color)';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.style.color = '';
        }, 1500);
      }
    } catch (err) {
      console.warn('Invalid product data:', productData);
    }
  }

  /* ==================== INIT ==================== */

  function init() {
    // Render cart page if we're on cart.html
    if (document.querySelector('.cart-section')) {
      renderCart();

      // Event delegation for cart interactions
      document.addEventListener('click', handleCartInteraction);
    }

    // Handle add-to-cart buttons on any page
    document.addEventListener('click', handleAddToCart);

    // Sync cart on storage events
    window.addEventListener('storage', (e) => {
      if (e.key === 'dd_cart' && document.querySelector('.cart-section')) {
        renderCart();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
