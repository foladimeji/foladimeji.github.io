/* ============================================================
   OLADIMEJI FARRI — Site Script
   oladimejifarri.com
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll behavior ---- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  /* ---- Scroll animations ---- */
  const animatedElements = document.querySelectorAll('[data-animate]');

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = entry.target.closest('.timeline-item, .expertise-grid, .impact-grid')
          ? getGroupDelay(entry.target)
          : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        animationObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  animatedElements.forEach(el => animationObserver.observe(el));

  function getGroupDelay(element) {
    const parent = element.parentElement;
    if (!parent) return 0;
    const siblings = Array.from(parent.children).filter(
      child => child.hasAttribute('data-animate')
    );
    const index = siblings.indexOf(element);
    return Math.min(index * 80, 400);
  }

  /* ---- Staggered card animations ---- */
  const gridCards = document.querySelectorAll(
    '.expertise-card, .impact-card, .domain-tag'
  );

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll
          ? Array.from(entry.target.querySelectorAll('[data-animate]'))
          : [];
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 80);
        });
      }
    });
  }, { threshold: 0.1 });

  /* ---- Counter animation ---- */
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      element.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Parallax on hero photo ---- */
  const heroPhoto = document.querySelector('.hero-photo-container');
  const heroSection = document.getElementById('home');

  if (heroPhoto && heroSection) {
    window.addEventListener('scroll', () => {
      const heroHeight = heroSection.offsetHeight;
      const scrolled = window.scrollY;
      if (scrolled < heroHeight) {
        const parallax = scrolled * 0.15;
        heroPhoto.style.transform = `translateY(${parallax}px)`;
      }
    }, { passive: true });
  }

  /* ---- Typing effect for hero tagline ---- */
  const taglineHighlight = document.querySelector('.tagline-highlight');
  if (taglineHighlight) {
    const originalText = taglineHighlight.textContent;
    taglineHighlight.textContent = '';
    taglineHighlight.style.borderRight = '2px solid #e8c96c';

    let i = 0;
    const delay = 800;

    setTimeout(() => {
      const typing = setInterval(() => {
        if (i < originalText.length) {
          taglineHighlight.textContent += originalText[i];
          i++;
        } else {
          clearInterval(typing);
          setTimeout(() => {
            taglineHighlight.style.borderRight = 'none';
          }, 800);
        }
      }, 45);
    }, delay);
  }

  /* ---- Domain tags hover ripple ---- */
  const domainTags = document.querySelectorAll('.domain-tag');
  domainTags.forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.2s ease';
    });
  });

  /* ---- Timeline card entrance ---- */
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.querySelector('[data-animate]')?.classList.add('visible');
        }, idx * 120);
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  timelineItems.forEach(item => timelineObserver.observe(item));

  /* ---- Initial page load animation ---- */
  setTimeout(() => {
    const heroContent = document.querySelector('.hero-content');
    const heroPhotoWrap = document.querySelector('.hero-photo-wrap');
    if (heroContent) heroContent.classList.add('visible');
    if (heroPhotoWrap) {
      setTimeout(() => heroPhotoWrap.classList.add('visible'), 200);
    }
  }, 100);

});
