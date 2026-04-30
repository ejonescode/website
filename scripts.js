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
