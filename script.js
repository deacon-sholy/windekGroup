/* ===========================
   WINDEK GROUP — script.js
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL BEHAVIOR =====
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const backToTop = document.getElementById('backToTop');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky + scrolled state
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link based on section
    highlightActiveNav();

    lastScroll = scrollY;
  });

  // ===== HAMBURGER MENU =====
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when nav link clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ===== ACTIVE NAV LINK =====
  function highlightActiveNav() {
    const sections = ['home', 'about', 'subsidiaries', 'projects', 'industries', 'investors', 'contact'];
    const scrollPos = window.scrollY + 120;

    sections.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < bottom) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  // ===== BACK TO TOP =====
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ===== SCROLL REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== ANIMATED COUNTERS =====
  const counters = document.querySelectorAll('.hero-stat__num[data-target]');
  let countersStarted = false;

  const countObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(update);
          } else {
            counter.textContent = target.toLocaleString();
          }
        };
        requestAnimationFrame(update);
      });
    }
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) countObserver.observe(heroStats);

  // ===== DIVISIONS TAB NAVIGATION =====
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById(`tab-${targetTab}`);
      if (panel) panel.classList.add('active');
    });
  });

  // ===== HERO SLIDER =====
  const heroSliderTrack = document.getElementById('heroSliderTrack');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-slider__dot');
  const heroPrev = document.getElementById('heroPrev');
  const heroNext = document.getElementById('heroNext');
  let heroSlideIndex = 0;
  let heroSliderTimer;

  function setHeroSlide(index) {
    if (!heroSliderTrack || !heroSlides.length) return;

    heroSlideIndex = (index + heroSlides.length) % heroSlides.length;
    heroSliderTrack.style.transform = `translateX(-${heroSlideIndex * 100}%)`;

    heroSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === heroSlideIndex);
    });

    heroDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === heroSlideIndex);
      dot.setAttribute('aria-current', idx === heroSlideIndex ? 'true' : 'false');
    });
  }

  function startHeroSlider() {
    if (!heroSlides.length) return;
    clearInterval(heroSliderTimer);
    heroSliderTimer = setInterval(() => {
      setHeroSlide(heroSlideIndex + 1);
    }, 5500);
  }

  if (heroSlides.length) {
    setHeroSlide(0);
    startHeroSlider();

    heroPrev?.addEventListener('click', () => {
      setHeroSlide(heroSlideIndex - 1);
      startHeroSlider();
    });

    heroNext?.addEventListener('click', () => {
      setHeroSlide(heroSlideIndex + 1);
      startHeroSlider();
    });

    heroDots.forEach(dot => {
      dot.addEventListener('click', () => {
        setHeroSlide(parseInt(dot.getAttribute('data-slide'), 10));
        startHeroSlider();
      });
    });
  }

  // ===== PROJECT FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          setTimeout(() => { card.style.animation = 'fadeUp 0.4s ease forwards'; }, 10);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ===== PROJECT MODAL =====
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTag = document.getElementById('modalTag');
  const modalTags = document.getElementById('modalTags');

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');
      const tags = card.getAttribute('data-tags');
      const category = card.getAttribute('data-category');

      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalTag.textContent = category.charAt(0).toUpperCase() + category.slice(1);

      modalTags.innerHTML = '';
      if (tags) {
        tags.split(',').forEach(tag => {
          const span = document.createElement('span');
          span.textContent = tag.trim();
          modalTags.appendChild(span);
        });
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ===== CONTACT FORM VALIDATION =====
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formNextUrl = document.getElementById('formNextUrl');
  const formSuccessModal = document.getElementById('formSuccessModal');

  if (formNextUrl) {
    formNextUrl.value = `${window.location.origin}${window.location.pathname}?submitted=1`;
  }

  handleSuccessfulSubmission();

  if (form) {
    form.addEventListener('submit', (e) => {
      if (!validateForm()) {
        e.preventDefault();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }
    });

    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => clearError(field));
    });
  }

  function validateForm() {
    let valid = true;
    const fields = [
      { id: 'fname', min: 2, label: 'First name' },
      { id: 'lname', min: 2, label: 'Last name' },
      { id: 'email', type: 'email', label: 'Email address' },
      { id: 'subject', type: 'select', label: 'Subject' },
      { id: 'message', min: 20, label: 'Message' },
    ];

    fields.forEach(f => {
      const el = document.getElementById(f.id);
      if (!el) return;
      if (!validateField(el, f)) valid = false;
    });

    return valid;
  }

  function validateField(el, config) {
    const val = el.value.trim();
    const errEl = document.getElementById(el.id + 'Error');

    clearError(el);

    if (el.type === 'email' || (config && config.type === 'email')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) {
        setError(el, errEl, 'Email address is required.');
        return false;
      }
      if (!emailRegex.test(val)) {
        setError(el, errEl, 'Please enter a valid email address.');
        return false;
      }
    } else if (el.tagName === 'SELECT' || (config && config.type === 'select')) {
      if (!val) {
        setError(el, errEl, 'Please select a subject.');
        return false;
      }
    } else {
      const minLen = config ? config.min : 2;
      if (!val) {
        setError(el, errEl, `This field is required.`);
        return false;
      }
      if (val.length < minLen) {
        setError(el, errEl, `Please enter at least ${minLen} characters.`);
        return false;
      }
    }
    return true;
  }

  function setError(el, errEl, msg) {
    el.classList.add('error');
    if (errEl) errEl.textContent = msg;
  }

  function clearError(el) {
    el.classList.remove('error');
    const errEl = document.getElementById(el.id + 'Error');
    if (errEl) errEl.textContent = '';
  }

  function handleSuccessfulSubmission() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('submitted') !== '1' || !formSuccessModal) return;

    formSuccessModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      window.location.replace(`${window.location.pathname}#home`);
    }, 3000);
  }

  // ===== HERO PARALLAX =====
  const hero = document.querySelector('.subsidiary-slider');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const orb1 = document.querySelector('.hero-orb--1');
      const orb2 = document.querySelector('.hero-orb--2');
      if (orb1) orb1.style.transform = `translateY(${scrollY * 0.15}px)`;
      if (orb2) orb2.style.transform = `translateY(${scrollY * 0.08}px)`;
    });
  }

});

// Make closeModal globally accessible
function closeModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}
