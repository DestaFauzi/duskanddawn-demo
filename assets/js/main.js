/* ============================================================
   MAIN.JS — Navbar, Scroll Behavior, Page Transitions, Global Utils
   ============================================================ */

(function () {
  'use strict';

  /* ==================== NAVBAR ==================== */

  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  let lastScrollY = window.scrollY;

  function updateNavbar() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }

  if (navbar) {
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar(); // Run on load
  }

  /* ==================== HAMBURGER / MOBILE NAV ==================== */

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ==================== ACTIVE NAV LINK ==================== */

  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll('.navbar__link, .mobile-nav__link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const isHome = (currentFile === '' || currentFile === 'index.html') && href === 'index.html';
      const isMatch = href === currentFile;

      if (isHome || isMatch) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setActiveNavLink();

  /* ==================== CART BADGE ==================== */

  function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;

    try {
      const cart = JSON.parse(localStorage.getItem('dd_cart') || '[]');
      const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

      if (total > 0) {
        badge.textContent = total > 9 ? '9+' : total;
        badge.classList.add('visible');
      } else {
        badge.classList.remove('visible');
      }
    } catch (e) {
      // Fail silently
    }
  }

  updateCartBadge();

  // Listen for cart updates from other tabs/pages
  window.addEventListener('storage', (e) => {
    if (e.key === 'dd_cart') {
      updateCartBadge();
    }
  });

  // Custom event for same-page updates
  window.addEventListener('cartUpdated', updateCartBadge);

  /* ==================== PAGE TRANSITIONS ==================== */

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.classList.add('page-transition-overlay');
  document.body.appendChild(overlay);

  function pageExit(href) {
    overlay.classList.add('active');
    setTimeout(() => {
      window.location.href = href;
    }, 220);
  }

  // Page enter animation
  window.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.35s ease';
      document.body.style.opacity = '1';
    }, 30);
  });

  // Intercept nav link clicks for smooth transition
  document.querySelectorAll('a[href]').forEach(link => {
    // Only intercept internal links
    const href = link.getAttribute('href');
    if (!href) return;
    if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    if (href.startsWith('#')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      pageExit(href);
    });
  });

  /* ==================== SMOOTH SCROLL FOR HASH LINKS ==================== */

  // Handle hash-only anchor links within the page
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ==================== FOOTER NEWSLETTER FORM ==================== */

  const newsletterForm = document.querySelector('.footer__newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.footer__newsletter-input');
      const btn = newsletterForm.querySelector('.footer__newsletter-btn');

      if (!input.value.includes('@')) {
        input.style.borderColor = '#c87474';
        setTimeout(() => { input.style.borderColor = ''; }, 1500);
        return;
      }

      btn.textContent = '✓';
      btn.style.background = 'var(--newdawn-color)';
      btn.style.color = '#1a3a2a';
      input.value = '';
      input.placeholder = 'Terima kasih!';
      setTimeout(() => {
        btn.textContent = 'Daftar';
        btn.style.background = '';
        btn.style.color = '';
        input.placeholder = 'emailmu@...';
      }, 3000);
    });
  }

  /* ==================== EXPOSE GLOBAL UTILS ==================== */

  window.DD = window.DD || {};

  window.DD.formatPrice = function (amount) {
    return 'Rp ' + amount.toLocaleString('id-ID').replace(/,/g, '.');
  };

  window.DD.getCart = function () {
    try {
      return JSON.parse(localStorage.getItem('dd_cart') || '[]');
    } catch {
      return [];
    }
  };

  window.DD.saveCart = function (cart) {
    localStorage.setItem('dd_cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    updateCartBadge();
  };

  window.DD.addToCart = function (product) {
    const cart = window.DD.getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    window.DD.saveCart(cart);
    window.DD.showToast('"' + product.name + '" ditambahkan ke keranjang.');
  };

  window.DD.showToast = function (message) {
    let toast = document.querySelector('.dd-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'dd-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%) translateY(80px);
        background: var(--surface-2);
        color: var(--text);
        padding: 0.85rem 1.75rem;
        border-radius: 4px;
        font-size: 0.85rem;
        font-family: var(--font-body, sans-serif);
        border: 1px solid rgba(240,235,224,0.1);
        z-index: 9000;
        transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease;
        opacity: 0;
        white-space: nowrap;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    }, 10);

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(80px)';
      toast.style.opacity = '0';
    }, 3000);
  };

})();
