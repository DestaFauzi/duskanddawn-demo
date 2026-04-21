/* ============================================================
   ANIMATIONS.JS — Scroll-Triggered Reveal, IntersectionObserver
   ============================================================ */

(function () {
  'use strict';

  /* ==================== INTERSECTION OBSERVER REVEAL ==================== */

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-delay') || 0;

          // Delay is set via data-delay attribute and CSS custom property
          // but we also handle it via JS for stagger groups
          el.classList.add('is-visible');

          // Unobserve after reveal (one-time animation)
          revealObserver.unobserve(el);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  function initReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  /* ==================== STAGGER GROUPS ==================== */

  /**
   * Stagger children of a parent element with data-stagger attribute.
   * Each child gets an increasing animation-delay.
   */
  function initStagger() {
    const staggerGroups = document.querySelectorAll('[data-stagger]');
    staggerGroups.forEach(group => {
      const children = group.querySelectorAll('[data-reveal]');
      const baseDelay = parseInt(group.getAttribute('data-stagger') || '100');

      children.forEach((child, index) => {
        if (!child.getAttribute('data-delay')) {
          child.style.transitionDelay = (index * baseDelay) + 'ms';
        }
      });
    });
  }

  /* ==================== PARALLAX ==================== */

  /**
   * Subtle parallax on elements with data-parallax attribute.
   * Value is a float speed multiplier (e.g., data-parallax="0.3")
   */
  const parallaxElements = [];

  function initParallax() {
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax') || 0.3);
      parallaxElements.push({ el, speed });
    });
  }

  function updateParallax() {
    if (parallaxElements.length === 0) return;
    const scrollY = window.scrollY;

    parallaxElements.forEach(({ el, speed }) => {
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2 + scrollY;
      const viewportCenter = scrollY + window.innerHeight / 2;
      const offset = (viewportCenter - centerY) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  /* ==================== SECTION ENTRANCE ==================== */

  /**
   * Track active section for potential nav highlighting or UI effects.
   */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-active');
        }
      });
    },
    { threshold: 0.1 }
  );

  function initSectionTracking() {
    document.querySelectorAll('section[id]').forEach(section => {
      sectionObserver.observe(section);
    });
  }

  /* ==================== CHAPTER CARD DRAG SCROLL ==================== */

  function initDragScroll() {
    const tracks = document.querySelectorAll('.chapters__track');

    tracks.forEach(track => {
      let isDown = false;
      let startX;
      let scrollLeft;

      track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.style.userSelect = 'none';
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });

      track.addEventListener('mouseleave', () => {
        isDown = false;
        track.style.userSelect = '';
      });

      track.addEventListener('mouseup', () => {
        isDown = false;
        track.style.userSelect = '';
      });

      track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
      });
    });
  }

  /* ==================== COUNTER ANIMATION ==================== */

  /**
   * Animate numbers from 0 to target value.
   * Used on stat elements with data-count attribute.
   */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count') || 0);
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out
      el.textContent = Math.round(eased * target).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  function initCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      counterObserver.observe(el);
    });
  }

  /* ==================== GOLD LINE DRAW ==================== */

  function initGoldLines() {
    const lines = document.querySelectorAll('.gold-line--animated');
    const lineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'expandWidth 1.2s var(--ease-out) forwards';
            lineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    lines.forEach(line => {
      line.style.width = '0';
      lineObserver.observe(line);
    });
  }

  /* ==================== INIT ==================== */

  function init() {
    initReveal();
    initStagger();
    initParallax();
    initSectionTracking();
    initDragScroll();
    initCounters();
    initGoldLines();

    // Passive scroll listener for parallax
    if (parallaxElements.length > 0) {
      window.addEventListener('scroll', updateParallax, { passive: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
