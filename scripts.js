/* ============================================
   Jones Career Consulting — Scripts
   ============================================ */

// Nav scroll effect
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// Scroll reveal animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Testimonial Slider — shows 3 cards on desktop, 2 on tablet, 1 on mobile
(function() {
  const inner = document.getElementById('sliderInner');
  const dotsWrap = document.getElementById('sliderDots');
  if (!inner || !dotsWrap) return;
  const cards = Array.from(inner.querySelectorAll('.test-card'));
  const GAP = 32;
  let current = 0;
  let visibleCount = 3;
  let autoTimer;

  function getMetrics() {
    const trackW = inner.parentElement.offsetWidth;
    if (trackW < 680) visibleCount = 1;
    else if (trackW < 1000) visibleCount = 2;
    else visibleCount = 3;
    const cardW = Math.floor((trackW - GAP * (visibleCount - 1)) / visibleCount);
    return { trackW, cardW };
  }

  function setCardWidths() {
    const { cardW } = getMetrics();
    cards.forEach(c => {
      c.style.width = cardW + 'px';
      c.style.minWidth = cardW + 'px';
    });
  }

  function maxStep() {
    return Math.max(0, cards.length - visibleCount);
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const steps = maxStep() + 1;
    for (let i = 0; i < steps; i++) {
      const d = document.createElement('button');
      d.className = 'slider-dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxStep()));
    const { cardW } = getMetrics();
    inner.style.transform = 'translateX(-' + (current * (cardW + GAP)) + 'px)';
    dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      goTo(current < maxStep() ? current + 1 : 0);
    }, 6000);
  }

  function init() {
    setCardWidths();
    buildDots();
    if (current > maxStep()) current = 0;
    goTo(current);
  }

  document.getElementById('sliderPrev').addEventListener('click', () => {
    goTo(current > 0 ? current - 1 : maxStep());
  });
  document.getElementById('sliderNext').addEventListener('click', () => {
    goTo(current < maxStep() ? current + 1 : 0);
  });

  // Touch swipe
  let startX = 0;
  inner.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  inner.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? (current < maxStep() ? current + 1 : 0) : (current > 0 ? current - 1 : maxStep()));
    }
  });

  // Pause autoplay on hover
  inner.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
  inner.parentElement.addEventListener('mouseleave', resetAuto);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });

  init();
})();

// Contact form — Formspree async submission
const form = document.getElementById('contactFormEl');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        document.getElementById('contactForm').innerHTML =
          '<div class="form-success"><div class="check">&#10003;</div><h3>Message sent!</h3><p>I\'ll get back to you within 24 hours.</p></div>';
      } else {
        alert('Something went wrong. Please try again or email me directly.');
      }
    } catch (err) {
      alert('Something went wrong. Please try again or email me directly.');
    }
  });
}
