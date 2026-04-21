/* ============================================================
   JOURNAL.JS — Journal Card Interactions
   ============================================================ */

(function () {
  'use strict';

  /* ==================== JOURNAL CARD HOVER ==================== */

  function initJournalCards() {
    const journalCards = document.querySelectorAll('.journal-card');

    journalCards.forEach(card => {
      const svg = card.querySelector('.journal-card__visual svg');
      const accentBar = card.querySelector('.journal-card__accent-bar');

      // SVG hover animation
      card.addEventListener('mouseenter', () => {
        if (svg) {
          svg.style.transition = 'transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease';
          svg.style.transform = 'scale(1.08) rotate(-2deg)';
          svg.style.opacity = '0.65';
        }
      });

      card.addEventListener('mouseleave', () => {
        if (svg) {
          svg.style.transform = 'scale(1) rotate(0deg)';
          svg.style.opacity = '0.4';
        }
      });

      // Make entire card clickable (link to article placeholder)
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        // In a real site, this would navigate to the article
        // For demo, we show a soft toast
        if (window.DD && window.DD.showToast) {
          window.DD.showToast('Artikel ini sedang dalam penulisan — nantikan.');
        }
      });
    });
  }

  /* ==================== FEATURED CARD ==================== */

  function initFeaturedCard() {
    const featuredCard = document.querySelector('.journal-featured__card');
    if (!featuredCard) return;

    featuredCard.style.cursor = 'pointer';
    featuredCard.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      if (window.DD && window.DD.showToast) {
        window.DD.showToast('Artikel ini sedang dalam penulisan — nantikan.');
      }
    });
  }

  /* ==================== READ TIME PROGRESS ==================== */

  /**
   * Show animated read time label when hovering article cards.
   * A playful micro-interaction for engagement.
   */
  function initReadTimeHover() {
    const cards = document.querySelectorAll('.journal-card');

    cards.forEach(card => {
      const readTime = card.querySelector('.journal-card__read-time');
      if (!readTime) return;

      const originalText = readTime.textContent;
      const minutes = parseInt(originalText);

      card.addEventListener('mouseenter', () => {
        readTime.style.transition = 'color 0.3s ease';
        readTime.style.color = 'var(--gold)';
      });

      card.addEventListener('mouseleave', () => {
        readTime.style.color = '';
      });
    });
  }

  /* ==================== STAGGER CARD ENTRANCE ==================== */

  function initCardStagger() {
    const grid = document.querySelector('.journal-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.journal-card');
    cards.forEach((card, i) => {
      if (!card.getAttribute('data-reveal')) {
        card.setAttribute('data-reveal', '');
        card.style.transitionDelay = (i * 80) + 'ms';
      }
    });
  }

  /* ==================== CHAPTER COLOR BADGE GLOW ==================== */

  function initBadgeGlow() {
    const badges = document.querySelectorAll('.journal-card .badge');

    badges.forEach(badge => {
      const card = badge.closest('.journal-card');
      if (!card) return;

      card.addEventListener('mouseenter', () => {
        badge.style.transition = 'box-shadow 0.4s ease, opacity 0.4s ease';
        badge.style.opacity = '1';
        badge.style.boxShadow = `0 0 12px currentColor`;
      });

      card.addEventListener('mouseleave', () => {
        badge.style.opacity = '';
        badge.style.boxShadow = '';
      });
    });
  }

  /* ==================== INIT ==================== */

  function init() {
    initJournalCards();
    initFeaturedCard();
    initReadTimeHover();
    initCardStagger();
    initBadgeGlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
