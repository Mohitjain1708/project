/* ============================================================
   AMERICAN DREAM — SALES DECK
   Main JavaScript
   ============================================================ */

'use strict';

/* ============================================================
   LOADING SCREEN
   ============================================================ */
(function initLoader() {
  const screen = document.getElementById('loadingScreen');
  const bar    = document.getElementById('loadingBar');
  const pct    = document.getElementById('loadingPct');
  if (!screen) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        screen.classList.add('hidden');
        document.body.style.overflow = '';
        initParticles();
        initCounters();
        initChartBars();
        initStarField();
      }, 400);
    }
    bar.style.width  = progress + '%';
    pct.textContent  = Math.floor(progress) + '%';
  }, 60);

  document.body.style.overflow = 'hidden';
})();

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  // Skip on touch-only devices
  if (window.matchMedia('(hover: none)').matches) {
    cursor.style.display   = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states on interactive elements
  const hoverTargets = 'a, button, .deck-nav-dot, .modules-tab, .luxury-brand-item, .ent-card, .dining-card';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('is-hovering');
      follower.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('is-hovering');
      follower.classList.remove('is-hovering');
    }
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
  });
})();

/* ============================================================
   NAVIGATION
   ============================================================ */
(function initNav() {
  const nav        = document.getElementById('mainNav');
  const progressBar = document.getElementById('progressBar');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.querySelectorAll('.nav-links a');
  const deckDots   = document.querySelectorAll('.deck-nav-dot');

  // Scroll effects
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY  = window.scrollY;
    const docH     = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / docH) * 100;

    // Progress bar
    if (progressBar) progressBar.style.width = progress + '%';

    // Nav background
    if (nav) {
      if (scrollY > 80) nav.classList.add('scrolled');
      else              nav.classList.remove('scrolled');
    }

    lastScroll = scrollY;
    updateActiveSections(scrollY);
  }, { passive: true });

  // Hamburger
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
    });
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Deck nav dots click
  deckDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = dot.getAttribute('data-section');
      const section   = document.getElementById(sectionId);
      if (section) {
        const top = section.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  function updateActiveSections(scrollY) {
    const sections = ['hero', 'why', 'retail', 'luxury', 'dining', 'entertainment', 'events', 'modules', 'cta'];
    let current = '';

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + scrollY;
      if (scrollY >= top - 200) current = id;
    });

    // Update nav links
    navLinks.forEach(link => {
      const section = link.getAttribute('data-section');
      link.classList.toggle('active', section === current);
    });

    // Update deck dots
    deckDots.forEach(dot => {
      const section = dot.getAttribute('data-section');
      dot.classList.toggle('active', section === current);
    });
  }
})();

/* ============================================================
   MOBILE NAV CLOSE
   ============================================================ */
function closeMobileNav() {
  document.body.classList.remove('nav-open');
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));
})();

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.getAttribute('data-target'));
      const isInt  = Number.isInteger(target);
      const duration = 1800;
      const start    = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const val      = target * eased;
        el.textContent = isInt ? Math.round(val) : val.toFixed(1);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = isInt ? target : target.toFixed(1);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

/* ============================================================
   CHART BAR ANIMATION
   ============================================================ */
function initChartBars() {
  const bars = document.querySelectorAll('.chart-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill  = entry.target;
      const width = fill.getAttribute('data-width');
      requestAnimationFrame(() => {
        fill.style.width = width + '%';
      });
      observer.unobserve(fill);
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
}

/* ============================================================
   HERO PARTICLES
   ============================================================ */
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = 28;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      --duration: ${4 + Math.random() * 6}s;
      --delay: ${Math.random() * 8}s;
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
    `;
    container.appendChild(p);
  }
}

/* ============================================================
   STAR FIELD (Entertainment Section)
   ============================================================ */
function initStarField() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars  = [];
  let animId;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 4000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.005 + 0.002,
        phase: Math.random() * Math.PI * 2,
        gold:  Math.random() < 0.15,
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const a = (Math.sin(t * s.speed + s.phase) * 0.4 + 0.6) * s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.gold ? `rgba(201,168,76,${a})` : `rgba(255,255,255,${a * 0.7})`;
      ctx.fill();
    });
    animId = requestAnimationFrame(draw);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();
  requestAnimationFrame(draw);
}

/* ============================================================
   MODULE TABS
   ============================================================ */
(function initModuleTabs() {
  const tabs   = document.querySelectorAll('.modules-tab');
  const panels = document.querySelectorAll('.module-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      tabs.forEach(t   => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById(targetId);
      if (panel) {
        panel.classList.add('active');
        // Re-trigger reveals in this panel
        panel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
          el.classList.add('visible');
        });
      }
    });
  });
})();

/* ============================================================
   OPEN MODULE (from other sections)
   ============================================================ */
function openModule(moduleId) {
  const section  = document.getElementById('modules');
  const tab      = document.querySelector(`[data-tab="${moduleId}-module"]`);
  const tabs     = document.querySelectorAll('.modules-tab');
  const panels   = document.querySelectorAll('.module-panel');

  if (section) {
    const top = section.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  if (tab) {
    tabs.forEach(t   => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(`${moduleId}-module`);
    if (panel) {
      panel.classList.add('active');
      panel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        el.classList.add('visible');
      });
    }
  }
}

/* ============================================================
   SWITCH TAB (from footer links)
   ============================================================ */
function switchTab(tabId) {
  setTimeout(() => {
    const tabs   = document.querySelectorAll('.modules-tab');
    const panels = document.querySelectorAll('.module-panel');
    const tab    = document.querySelector(`[data-tab="${tabId}"]`);
    if (!tab) return;
    tabs.forEach(t   => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(tabId);
    if (panel) panel.classList.add('active');
  }, 600);
}

/* ============================================================
   VIDEO OVERLAY
   ============================================================ */
function openVideo(videoId) {
  const overlay = document.getElementById('videoOverlay');
  const frame   = document.getElementById('videoFrame');
  if (!overlay || !frame) return;

  frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideo() {
  const overlay = document.getElementById('videoOverlay');
  const frame   = document.getElementById('videoFrame');
  if (!overlay || !frame) return;

  overlay.classList.remove('open');
  frame.src = '';
  document.body.style.overflow = '';
}

// Close on overlay click
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('videoOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeVideo();
    });
  }
});

/* ============================================================
   CONTACT FORM
   ============================================================ */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn     = e.target.querySelector('.form-submit');
  const success = document.getElementById('formSuccess');

  btn.textContent = 'Sending…';
  btn.disabled    = true;

  // Simulate submission (replace with real endpoint if needed)
  setTimeout(() => {
    e.target.style.display = 'none';
    if (success) success.style.display = 'block';
  }, 1200);
}

/* ============================================================
   SCROLL TO CONTACT
   ============================================================ */
function scrollToContact() {
  const form = document.getElementById('contact-form');
  if (form) {
    const top = form.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/* ============================================================
   KEYBOARD ACCESSIBILITY
   ============================================================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeVideo();
    document.body.classList.remove('nav-open');
  }
});

/* ============================================================
   PARALLAX — subtle on hero
   ============================================================ */
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.18}px)`;
      heroContent.style.opacity   = 1 - (scrollY / (window.innerHeight * 0.8));
    }
  }, { passive: true });
})();

/* ============================================================
   DINING SCROLLTRACK — drag to scroll
   ============================================================ */
(function initDragScroll() {
  const slider = document.querySelector('.dining-scrolltrack');
  if (!slider) return;

  let isDown   = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown     = true;
    startX     = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    slider.style.cursor = 'grabbing';
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.style.cursor = 'grab';
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.cursor = 'grab';
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });

  slider.style.cursor = 'grab';
})();

/* ============================================================
   LAZY BACKGROUND IMAGES (using IntersectionObserver)
   ============================================================ */
(function initLazyBg() {
  const lazies = document.querySelectorAll('[data-bg]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = `url(${el.getAttribute('data-bg')})`;
        observer.unobserve(el);
      }
    });
  });

  lazies.forEach(el => observer.observe(el));
})();

/* ============================================================
   NUMBER TICKER — hero stats
   ============================================================ */
(function initHeroCounters() {
  // Hero counters start after loader dismisses, handled by initCounters()
  // This sets a fallback in case the loader is already gone
  setTimeout(() => {
    initCounters();
    initChartBars();
  }, 100);
})();

/* ============================================================
   SMOOTH SECTION TRANSITIONS
   ============================================================ */
(function initSectionHighlight() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.dataset.entered = 'true';
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(s => observer.observe(s));
})();

/* ============================================================
   TICKER CLONE (ensure seamless loop)
   ============================================================ */
(function ensureTicker() {
  const inner = document.querySelector('.ticker-inner');
  if (!inner) return;

  // Already has cloned items in HTML, just ensure animation is running
  // Pause on hover
  const wrap = document.querySelector('.ticker-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => {
      inner.style.animationPlayState = 'paused';
    });
    wrap.addEventListener('mouseleave', () => {
      inner.style.animationPlayState = 'running';
    });
  }
})();

/* ============================================================
   PRINT / EXPORT HANDLER (for sales deck use)
   ============================================================ */
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
});

/* ============================================================
   PERFORMANCE — preload critical fonts
   ============================================================ */
(function preloadAssets() {
  const link = document.createElement('link');
  link.rel   = 'preload';
  link.as    = 'style';
  link.href  = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap';
  document.head.appendChild(link);
})();

/* ============================================================
   EXPOSE GLOBALS (for inline HTML handlers)
   ============================================================ */
window.openVideo    = openVideo;
window.closeVideo   = closeVideo;
window.openModule   = openModule;
window.switchTab    = switchTab;
window.scrollToContact = scrollToContact;
window.closeMobileNav  = closeMobileNav;
window.handleFormSubmit = handleFormSubmit;
