/* ============================================================
   OLADIMEJI FARRI — Site Script
   oladimejifarri.com
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll ---- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNavLink();
  }, { passive: true });

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    const [s0, s1, s2] = navToggle.querySelectorAll('span');
    s0.style.transform = open ? 'translateY(7px) rotate(45deg)'  : '';
    s1.style.opacity   = open ? '0' : '';
    s2.style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      ['', '', ''].forEach((_, i) => {
        const s = navToggle.querySelectorAll('span')[i];
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });

  /* ---- Smooth scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  /* ---- Scroll-reveal animations ---- */
  const animated = document.querySelectorAll('[data-animate]');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(
        (entry.target.parentElement?.children || [])
      ).filter(el => el.hasAttribute('data-animate'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 80, 320));
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animated.forEach(el => revealObserver.observe(el));

  /* ---- Stat counters ---- */
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const start  = performance.now();
    const dur    = 1800;
    const tick   = now => {
      const t = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(easeOutExpo(t) * target);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  /* ---- Parallax on landing photo ---- */
  const photoFrame = document.querySelector('.landing-photo-frame');
  if (photoFrame) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        photoFrame.style.transform = `translateY(${window.scrollY * 0.1}px)`;
      }
    }, { passive: true });
  }

  /* ---- Initial animation ---- */
  setTimeout(() => {
    document.querySelector('.landing-content')?.classList.add('visible');
    setTimeout(() => {
      document.querySelector('.landing-photo-wrap')?.classList.add('visible');
      document.querySelector('.landing-stats')?.classList.add('visible');
    }, 200);
  }, 100);

});

/* ============================================================
   INTERACTIVE TIMELINE — global function (called via onclick)
   ============================================================ */
function toggleTimeline(headerEl) {
  const card    = headerEl.closest('.timeline-card');
  const details = card.querySelector('.timeline-details');
  const dot     = headerEl.closest('.timeline-item')?.querySelector('.node-dot');
  const isOpen  = headerEl.classList.contains('open');

  /* Close all items */
  document.querySelectorAll('.timeline-header.open').forEach(h => {
    h.classList.remove('open');
    h.setAttribute('aria-expanded', 'false');
    h.closest('.timeline-card')
      ?.querySelector('.timeline-details')
      ?.classList.remove('open');
    h.closest('.timeline-item')
      ?.querySelector('.node-dot')
      ?.classList.remove('active');
  });

  /* Open this item if it was closed */
  if (!isOpen) {
    headerEl.classList.add('open');
    headerEl.setAttribute('aria-expanded', 'true');
    details.classList.add('open');
    if (dot) dot.classList.add('active');

    /* Smooth scroll so the opened card is visible */
    setTimeout(() => {
      const rect = card.getBoundingClientRect();
      if (rect.top < 100 || rect.bottom > window.innerHeight) {
        window.scrollTo({
          top: window.scrollY + rect.top - 110,
          behavior: 'smooth'
        });
      }
    }, 80);
  }
}
