/**
 * SolarVision Energy — Main JavaScript
 * Features: sticky nav, mobile menu, scroll reveal, counter animation,
 *           testimonial slider, back-to-top, active nav link
 */

'use strict';

/* ============================================================
   1. STICKY HEADER
   ============================================================ */
const header = document.getElementById('header');

function handleScroll() {
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  handleBackToTop();
}
window.addEventListener('scroll', handleScroll, { passive: true });

/* ============================================================
   2. MOBILE MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   3. ACTIVE NAV LINK (highlight current page)
   ============================================================ */
(function setActiveLink() {
  const parts   = window.location.pathname.split('/');
  const current = parts[parts.length - 1] || 'index.html';

  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    // Match exact filename, or treat '' / '/' as index.html
    const isActive = href === current ||
      (current === 'index.html' && (href === '' || href === '/'));
    link.classList.toggle('active', isActive);
  });
})();

/* ============================================================
   4. SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling reveals
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((el, idx) => {
          if (el === entry.target) {
            setTimeout(() => el.classList.add('visible'), idx * 120);
          }
        });
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   5. COUNTER ANIMATION
   ============================================================ */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const startTime = performance.now();

  function update(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    start = Math.round(eased * target);
    el.textContent = start.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const count = card.getAttribute('data-count');
        const el    = card.querySelector('.counter');
        if (el && count) animateCounter(el, parseInt(count));
        counterObserver.unobserve(card);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-card[data-count]').forEach(el => counterObserver.observe(el));

/* ============================================================
   6. TESTIMONIAL SLIDER
   ============================================================ */
(function testimonialSlider() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  let current = 0;
  let autoplay;

  // Determine cards per view based on viewport
  function getPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 4;
  }

  function totalSlides() {
    return Math.ceil(cards.length / getPerView());
  }

  // Build dots
  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides(); i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    const total   = totalSlides();
    const perView = getPerView();
    current = (index + total) % total;

    // On desktop (all cards visible), never hide any card
    if (perView >= cards.length) {
      cards.forEach(c => (c.style.display = ''));
      updateDots();
      return;
    }

    const offset = current * perView;
    cards.forEach((card, i) => {
      card.style.display = (i >= offset && i < offset + perView) ? '' : 'none';
    });
    updateDots();
  }

  // For desktop, show all cards (CSS grid handles layout)
  function init() {
    buildDots();
    if (getPerView() >= cards.length) {
      cards.forEach(c => (c.style.display = ''));
      updateDots();
    } else {
      goTo(current);
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  function startAutoplay() {
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }
  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  window.addEventListener('resize', init);
  init();
  startAutoplay();
})();

/* ============================================================
   7. BACK TO TOP
   ============================================================ */
const backToTop = document.getElementById('backToTop');

function handleBackToTop() {
  if (!backToTop) return;
  backToTop.classList.toggle('visible', window.scrollY > 400);
}

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   8. SMOOTH SCROLL for anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
