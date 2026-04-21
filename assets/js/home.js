/* ============================================================
   HOME.JS — Hero SVG Animation, Chapter Cards
   ============================================================ */

(function () {
  'use strict';

  /* ==================== HERO FOG ANIMATION ==================== */
  // Fog is now 100% pure CSS (fog-layer system in home.css).
  // No JS needed — browser handles all keyframe animations via GPU.
  function initHeroSVGAnimation() {
    // intentionally empty — see .fog-layer CSS animation in home.css
  }

  /* ==================== CHAPTER CARDS HOVER COLOR ==================== */

  function initChapterCards() {
    const cards = document.querySelectorAll('.chapter-card[data-chapter]');

    const chapterColors = {
      dawn: '#f5d7b5',
      chasing: '#3a5fc8',
      gray: '#8a8a8a',
      void: '#3d2b6e',
      golden: '#d4832a',
      newdawn: '#c9e8d4'
    };

    cards.forEach(card => {
      const chapter = card.getAttribute('data-chapter');
      const color = chapterColors[chapter] || '#c9a84c';

      card.style.setProperty('--chapter-accent', color);

      // Hover: glow effect
      card.addEventListener('mouseenter', () => {
        card.style.boxShadow = `0 24px 60px rgba(0,0,0,0.5), 0 0 30px ${color}18`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
      });
    });
  }

  /* ==================== PHILOSOPHY SVG ANIMATION ==================== */

  function initPhilosophySVG() {
    const svg = document.querySelector('.philosophy__svg-wrap svg');
    if (!svg) return;

    const paths = svg.querySelectorAll('path, circle, ellipse');
    let t = 0;

    function animate() {
      t += 0.008;
      paths.forEach((el, i) => {
        const phase = i * (Math.PI / paths.length);
        const scale = 1 + Math.sin(t + phase) * 0.04;
        const opacity = 0.5 + Math.sin(t * 0.7 + phase) * 0.25;
        el.style.transform = `scale(${scale})`;
        el.style.opacity = opacity;
        el.style.transformOrigin = 'center';
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ==================== FEATURED PRODUCTS ==================== */

  function initFeaturedProducts() {
    // Add-to-cart handler is in cart.js
    // Here we just handle the card hover SVG breathing effect
    const productCards = document.querySelectorAll('.featured__grid .card');

    productCards.forEach(card => {
      const svg = card.querySelector('.card__image svg');
      if (!svg) return;

      card.addEventListener('mouseenter', () => {
        svg.style.transition = 'transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease';
        svg.style.transform = 'scale(1.08)';
        svg.style.opacity = '0.85';
      });

      card.addEventListener('mouseleave', () => {
        svg.style.transform = 'scale(1)';
        svg.style.opacity = '0.55';
      });
    });
  }

  /* ==================== HERO PARALLAX ==================== */

  function initHeroParallax() {
    const heroContent = document.querySelector('.hero__content');
    const heroBg = document.querySelector('.hero__bg');
    if (!heroContent || !heroBg) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > window.innerHeight) return;

      heroContent.style.transform = `translateY(${scrollY * 0.35}px)`;
      heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.6));
    }, { passive: true });
  }

  /* ==================== CHAPTERS HORIZONTAL SCROLL INDICATOR ==================== */

  function initChaptersScrollIndicator() {
    const track = document.querySelector('.chapters__track');
    if (!track) return;

    // Keyboard navigation support
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        track.scrollBy({ left: 300, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        track.scrollBy({ left: -300, behavior: 'smooth' });
      }
    });
  }

  /* ==================== STORY TEASER PARALLAX TEXT ==================== */

  function initStoryTeaser() {
    const quote = document.querySelector('.story-teaser__quote');
    if (!quote) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            quote.style.transition = 'opacity 1.2s ease, transform 1.2s var(--ease-out)';
            quote.style.opacity = '1';
            quote.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.3 }
    );

    quote.style.opacity = '0';
    quote.style.transform = 'translateY(20px)';
    observer.observe(quote);
  }

  /* ==================== INIT ==================== */

  function init() {
    initHeroSVGAnimation();
    initChapterCards();
    initPhilosophySVG();
    initFeaturedProducts();
    initHeroParallax();
    initChaptersScrollIndicator();
    initStoryTeaser();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
