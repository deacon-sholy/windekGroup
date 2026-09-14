/* ===========================
   WINDEK GROUP — script.js
   =========================== */

(function () {
  'use strict';

  document.querySelectorAll('link[data-deferred-style]').forEach(link => {
    link.media = 'all';
  });

  // ===== THEME (dark mode) =====
  const storageKey = 'windek-theme';
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function getSavedTheme() {
    try {
      const v = localStorage.getItem(storageKey);
      return v === 'dark' || v === 'light' ? v : null;
    } catch (e) { return null; }
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(storageKey, theme); } catch (e) { /* private mode */ }
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.setAttribute('aria-pressed', theme === 'dark');
  }
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || getSavedTheme() || getSystemTheme();
  }

  document.addEventListener('DOMContentLoaded', () => {

    // Apply saved/system theme for pages loaded without the head inline script
    if (!document.documentElement.hasAttribute('data-theme')) {
      document.documentElement.setAttribute('data-theme', getSavedTheme() || getSystemTheme());
    }

    // ===== TOASTS =====
    const toastStack = document.getElementById('toastStack');
    function showToast(message, type = 'info') {
      if (!toastStack) return;
      const toast = document.createElement('div');
      toast.className = `toast toast--${type}`;
      toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
      const icon = type === 'success' ? '✓' : type === 'error' ? '!' : 'ℹ';
      toast.innerHTML = `<span class="toast__icon" aria-hidden="true">${icon}</span>`;
      const msg = document.createElement('span');
      msg.textContent = message;
      toast.appendChild(msg);
      toastStack.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('toast--show'));
      const remove = () => {
        toast.classList.remove('toast--show');
        setTimeout(() => toast.remove(), 300);
      };
      toast.addEventListener('click', remove);
      setTimeout(remove, 4500);
    }

    // ===== NAVBAR SCROLL BEHAVIOR =====
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.getElementById('scrollProgress');
    const themeToggle = document.getElementById('themeToggle');
    const sectionIds = ['home', 'about', 'subsidiaries', 'projects', 'industries', 'investors', 'contact'];
    const sections = sectionIds
      .map(id => ({ id, section: document.getElementById(id), link: document.querySelector(`.nav-link[href="#${id}"]`) }))
      .filter(item => item.section && item.link);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = document.querySelector('.subsidiary-slider');
    const orb1 = document.querySelector('.hero-orb--1');
    const orb2 = document.querySelector('.hero-orb--2');
    const enableHeroParallax = hero && orb1 && orb2 && !reduceMotion && window.matchMedia('(min-width: 701px)').matches;
    let scrollTicking = false;
    let lastScrollY = 0;

    function updateOnScroll() {
      const scrollY = window.scrollY;

      navbar?.classList.toggle('scrolled', scrollY > 60);
      backToTop?.classList.toggle('visible', scrollY > 400);
      highlightActiveNav(scrollY);

      if (progressBar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      }

      if (enableHeroParallax && scrollY < hero.offsetHeight + 160) {
        orb1.style.transform = `translateY(${scrollY * 0.15}px)`;
        orb2.style.transform = `translateY(${scrollY * 0.08}px)`;
      }

      lastScrollY = scrollY;
      scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(updateOnScroll);
    }, { passive: true });
    updateOnScroll();

    // ===== SCROLL PROGRESS (initial paint before any scroll) =====
    if (progressBar) progressBar.style.transform = 'scaleX(0)';

    // ===== THEME TOGGLE =====
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', currentTheme() === 'dark');
      themeToggle.addEventListener('click', () => {
        applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
      });
    }
    // Keep the toggle in sync if the OS scheme changes while no preference is saved
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
      if (!getSavedTheme()) document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });

    // ===== HAMBURGER MENU =====
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
      });
    }

    // Close menu when nav link clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('open');
        if (navLinks) navLinks.classList.remove('open');
      });
    });

    // ===== ACTIVE NAV LINK =====
    function highlightActiveNav(scrollY = window.scrollY) {
      const scrollPos = scrollY + 120;

      sections.forEach(({ section, link }) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          sections.forEach(item => item.link.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }

    // ===== BACK TO TOP =====
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: targetPos, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
    });

    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('visible'));
    }

    // ===== ANIMATED COUNTERS =====
    const allCounters = document.querySelectorAll('.stat-counter[data-target], .hero-stat__num[data-target]');
    let countersStarted = new Set();

    const startCounters = (container) => {
      const counters = container
        ? container.querySelectorAll('.stat-counter[data-target]')
        : allCounters;

      counters.forEach(counter => {
        if (countersStarted.has(counter)) return;
        countersStarted.add(counter);

        const target = parseInt(counter.getAttribute('data-target'), 10);
        const duration = reduceMotion ? 1 : 2000;
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
    };

    // Observe stat sections for counter animation
    const statSections = document.querySelectorAll('.tab-panel-visual, .inv-card:last-child, .stats-strip');
    if ('IntersectionObserver' in window) {
      const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) startCounters(entry.target);
        });
      }, { threshold: 0.4 });
      statSections.forEach(el => countObserver.observe(el));
    } else {
      startCounters();
    }

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
        const wrapper = panel?.parentElement;
        if (wrapper) wrapper.setAttribute('data-active-tab', btn.textContent.trim());
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
    let heroSliderVisible = true;

    function setHeroSlide(index) {
      if (!heroSliderTrack || !heroSlides.length) return;

      heroSlideIndex = (index + heroSlides.length) % heroSlides.length;
      heroSliderTrack.style.transform = `translateX(-${heroSlideIndex * 100}%)`;

      heroSlides.forEach((slide, idx) => {
        const active = idx === heroSlideIndex;
        slide.classList.toggle('active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        slide.setAttribute('aria-label', `Slide ${idx + 1} of ${heroSlides.length}`);
        slide.querySelectorAll('a, button').forEach(el => {
          el.tabIndex = active ? 0 : -1;
        });
      });

      heroDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === heroSlideIndex);
        dot.setAttribute('aria-current', idx === heroSlideIndex ? 'true' : 'false');
      });
    }

    function startHeroSlider() {
      if (!heroSlides.length || reduceMotion || !heroSliderVisible || document.hidden) return;
      clearInterval(heroSliderTimer);
      heroSliderTimer = setInterval(() => {
        setHeroSlide(heroSlideIndex + 1);
      }, 5500);
    }

    function stopHeroSlider() {
      clearInterval(heroSliderTimer);
    }

    if (heroSlides.length) {
      setHeroSlide(0);

      if ('IntersectionObserver' in window) {
        const sliderObserver = new IntersectionObserver((entries) => {
          heroSliderVisible = entries[0].isIntersecting;
          if (heroSliderVisible) {
            startHeroSlider();
          } else {
            stopHeroSlider();
          }
        }, { threshold: 0.25 });
        sliderObserver.observe(heroSliderTrack);
      } else {
        startHeroSlider();
      }

      // Pause on hover / keyboard focus; resume on leave
      const heroViewport = heroSliderTrack.closest('.hero-slider__viewport');
      if (heroViewport) {
        const pause = () => { if (!reduceMotion) stopHeroSlider(); };
        const resume = () => { if (!reduceMotion) startHeroSlider(); };
        heroViewport.addEventListener('mouseenter', pause);
        heroViewport.addEventListener('mouseleave', resume);
        heroViewport.addEventListener('focusin', pause);
        heroViewport.addEventListener('focusout', resume);
      }

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          stopHeroSlider();
        } else {
          startHeroSlider();
        }
      });

      heroPrev?.addEventListener('click', () => {
        setHeroSlide(heroSlideIndex - 1);
        if (!reduceMotion) startHeroSlider();
      });

      heroNext?.addEventListener('click', () => {
        setHeroSlide(heroSlideIndex + 1);
        if (!reduceMotion) startHeroSlider();
      });

      heroDots.forEach(dot => {
        dot.addEventListener('click', () => {
          setHeroSlide(parseInt(dot.getAttribute('data-slide'), 10));
          if (!reduceMotion) startHeroSlider();
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
    const modalCloseBtn = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalTag = document.getElementById('modalTag');
    const modalTags = document.getElementById('modalTags');
    let lastFocused = null;

    const modalBoxRef = modal ? modal.querySelector('.modal-box') : null;
    const FOCUSABLE_SELECTOR = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function focusableElements(container) {
      if (!container) return [];
      return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
        .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    }

    function openModal() {
      if (!modal) return;
      lastFocused = document.activeElement;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const focusable = focusableElements(modalBoxRef);
      if (modalCloseBtn) modalCloseBtn.focus();
      else if (focusable[0]) focusable[0].focus();
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        const tags = card.getAttribute('data-tags');
        const category = card.getAttribute('data-category');

        if (modalTitle) modalTitle.textContent = title || '';
        if (modalDesc) modalDesc.textContent = desc || '';
        if (modalTag) modalTag.textContent = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';

        if (modalTags) {
          modalTags.innerHTML = '';
          if (tags) {
            tags.split(',').forEach(tag => {
              const span = document.createElement('span');
              span.textContent = tag.trim();
              modalTags.appendChild(span);
            });
          }
        }

        openModal();
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeModal();
          return;
        }
        if (e.key !== 'Tab' || !modal.classList.contains('active')) return;

        const focusable = focusableElements(modalBoxRef);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal();
    });

    // ===== CONTACT FORM =====
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    function setError(el, errEl, msg) {
      el.classList.add('error');
      if (errEl) errEl.textContent = msg;
    }

    function clearError(el) {
      el.classList.remove('error');
      const errEl = document.getElementById(el.id + 'Error');
      if (errEl) errEl.textContent = '';
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
          setError(el, errEl, 'This field is required.');
          return false;
        }
        if (val.length < minLen) {
          setError(el, errEl, `Please enter at least ${minLen} characters.`);
          return false;
        }
      }
      return true;
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

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const honeypot = form.querySelector('input[name="website_confirm"]');
        if (honeypot && honeypot.value.trim()) {
          showToast('Your submission was flagged as spam.', 'error');
          return;
        }

        if (!validateForm()) {
          showToast('Please fix the highlighted fields.', 'error');
          return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalLabel = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }

        try {
          const res = await fetch('https://formsubmit.co/ajax/info@windekgroup.com', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(form),
          });
          const data = await res.json().catch(() => ({}));
          const ok = res.ok || data.success === 'true' || data.success === true;

          if (ok) {
            form.reset();
            if (formSuccess) {
              formSuccess.classList.add('visible');
              formSuccess.setAttribute('role', 'status');
              setTimeout(() => formSuccess.classList.remove('visible'), 8000);
            }
            showToast('Message sent successfully. We will respond within 24 business hours.', 'success');
          } else {
            showToast(data.message || 'Something went wrong. Please try again.', 'error');
          }
        } catch (err) {
          showToast('Network error — please check your connection and try again.', 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        }
      });

      // Real-time validation
      form.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.name === 'website_confirm') return;
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearError(field));
      });
    }

    // ===== COOKIE BANNER =====
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');

    if (cookieBanner) {
      const consent = (() => {
        try { return localStorage.getItem('cookieConsent'); } catch (e) { return null; }
      })();

      if (consent === null) {
        requestAnimationFrame(() => cookieBanner.classList.add('show'));
      }

      const setConsent = (value) => {
        try { localStorage.setItem('cookieConsent', value); } catch (e) { /* ignore */ }
        cookieBanner.classList.remove('show');
        setTimeout(() => { cookieBanner.style.display = 'none'; }, 400);
        showToast(value === 'accepted' ? 'Cookie preferences saved.' : 'Only essential cookies are being used.', 'info');
      };

      cookieAccept?.addEventListener('click', () => setConsent('accepted'));
      cookieDecline?.addEventListener('click', () => setConsent('declined'));
    }

  });

  // Expose for inline handlers
  window.closeModal = function () {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
})();