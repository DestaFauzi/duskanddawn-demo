/* ============================================================
   COLLECTIONS.JS — Chapter Filter Logic, Product Grid
   ============================================================ */

(function () {
  'use strict';

  /* ==================== CHAPTER DATA ==================== */

  const CHAPTER_DATA = {
    all: {
      label: 'Semua',
      color: '#c9a84c',
      description: 'Seluruh chapter dari perjalanan Dusk & Dawn.',
      number: '00'
    },
    dawn: {
      label: 'Dawn',
      color: '#f5d7b5',
      description: 'Kebangkitan. Harapan pertama. Cahaya yang perlahan muncul dari balik cakrawala, lembut dan penuh kemungkinan.',
      number: '01'
    },
    chasing: {
      label: 'Chasing',
      color: '#3a5fc8',
      description: 'Ambisi yang tak bernama. Kecepatan tanpa tujuan yang jelas. Energi yang terus bergerak mencari sesuatu yang belum ditemukan.',
      number: '02'
    },
    gray: {
      label: 'Gray Area',
      color: '#8a8a8a',
      description: 'Zona abu-abu. Di sinilah kebenaran berbaur dengan keraguan, dan kita belajar bahwa tidak semua hal perlu hitam atau putih.',
      number: '03'
    },
    void: {
      label: 'Midnight',
      color: '#3d2b6e',
      description: 'Titik paling gelap. Kekosongan yang bicara. Tapi bahkan di void terdalam, ada fragmen cahaya yang bertahan.',
      number: '04'
    },
    golden: {
      label: 'Golden Hour',
      color: '#d4832a',
      description: 'Kedamaian sebelum gelap. Waktu ketika cahaya paling indah—hangat, amber, penuh penerimaan dan nostalgia.',
      number: '05'
    },
    newdawn: {
      label: 'New Dawn',
      color: '#c9e8d4',
      description: 'Kelahiran kembali. Awal baru yang lebih bijak. Cahaya yang memecah kegelapan dengan harmoni yang telah ditebus.',
      number: '06'
    }
  };

  /* ==================== FILTER PILLS ==================== */

  const filterPills = document.querySelectorAll('.filter-pill');
  const productItems = document.querySelectorAll('.product-item');
  const chapterBanner = document.querySelector('.chapter-banner');

  let currentChapter = 'all';

  function setActiveFilter(chapter) {
    currentChapter = chapter;

    // Update pill styles
    filterPills.forEach(pill => {
      const isActive = pill.getAttribute('data-chapter') === chapter;
      pill.classList.toggle('active', isActive);
    });

    // Filter products
    filterProducts(chapter);

    // Update chapter banner
    updateChapterBanner(chapter);

    // Update page accent color
    updatePageAccent(chapter);

    // Update URL hash (without triggering scroll)
    if (history.replaceState) {
      history.replaceState(null, null, chapter === 'all' ? '#' : `#${chapter}`);
    }
  }

  function filterProducts(chapter) {
    let visibleCount = 0;

    // We need to handle the grid layout for hidden items
    const grid = document.querySelector('.products-grid');

    productItems.forEach((item, index) => {
      const itemChapter = item.getAttribute('data-chapter');
      const shouldShow = chapter === 'all' || itemChapter === chapter;

      if (shouldShow) {
        item.classList.remove('hidden');
        item.style.order = '';
        // Stagger the reveal
        item.style.transitionDelay = (visibleCount * 60) + 'ms';
        visibleCount++;
      } else {
        item.classList.add('hidden');
        item.style.transitionDelay = '0ms';
      }
    });

    // Show/hide empty state
    const emptyState = document.querySelector('.products-empty');
    if (emptyState) {
      emptyState.classList.toggle('visible', visibleCount === 0);
    }
  }

  function updateChapterBanner(chapter) {
    if (!chapterBanner) return;

    if (chapter === 'all') {
      chapterBanner.classList.remove('visible');
      return;
    }

    const data = CHAPTER_DATA[chapter];
    if (!data) return;

    chapterBanner.style.setProperty('--accent-color', data.color);

    const nameEl = chapterBanner.querySelector('.chapter-banner__name');
    const descEl = chapterBanner.querySelector('.chapter-banner__desc');
    const numEl = chapterBanner.querySelector('.chapter-banner__number');

    if (nameEl) nameEl.textContent = data.label;
    if (descEl) descEl.textContent = data.description;
    if (numEl) numEl.textContent = data.number;

    chapterBanner.style.borderLeftColor = data.color;
    chapterBanner.classList.add('visible');
  }

  function updatePageAccent(chapter) {
    const data = CHAPTER_DATA[chapter] || CHAPTER_DATA['all'];
    document.documentElement.style.setProperty('--page-accent', data.color);
  }

  /* ==================== PILL CLICK HANDLERS ==================== */

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const chapter = pill.getAttribute('data-chapter');
      setActiveFilter(chapter);
    });
  });

  /* ==================== READ URL HASH ON LOAD ==================== */

  function initFromHash() {
    const hash = window.location.hash.replace('#', '');
    const validChapters = Object.keys(CHAPTER_DATA);

    if (hash && validChapters.includes(hash)) {
      // Use setTimeout to allow DOM to settle
      setTimeout(() => {
        setActiveFilter(hash);
      }, 100);
    } else {
      setActiveFilter('all');
    }
  }

  /* ==================== PRODUCT CARD HOVER SVG ==================== */

  function initProductCardSVGHover() {
    const productCards = document.querySelectorAll('.product-item .card');

    productCards.forEach(card => {
      const svg = card.querySelector('.card__image svg');
      if (!svg) return;

      card.addEventListener('mouseenter', () => {
        svg.style.transition = 'transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease';
        svg.style.transform = 'scale(1.1) rotate(3deg)';
        svg.style.opacity = '0.8';
      });

      card.addEventListener('mouseleave', () => {
        svg.style.transform = 'scale(1) rotate(0deg)';
        svg.style.opacity = '0.6';
      });
    });
  }

  /* ==================== CHAPTER FILTER SCROLL INTO VIEW ==================== */

  function initFilterStickyBehavior() {
    const filterBar = document.querySelector('.filter-bar');
    if (!filterBar) return;

    // Highlight active pill based on visible products
    // (for advanced scroll-sync — optional enhancement)
  }

  /* ==================== INIT ==================== */

  function init() {
    initFromHash();
    initProductCardSVGHover();
    initFilterStickyBehavior();

    // Handle keyboard navigation on filter pills
    filterPills.forEach(pill => {
      pill.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pill.click();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
