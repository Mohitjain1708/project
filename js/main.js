/* ═══════════════════════════════════════════════════════════════
   AMERICAN DREAM — SALES DECK V2
   Complete Interactive JavaScript
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════
     1. PRELOADER
  ════════════════════════════════════════════════════════════ */
  const preloader  = document.getElementById('preloader');
  const preBar     = document.getElementById('preBar');
  const preCounter = document.getElementById('preCounter');

  let preProgress = 0;
  const preInterval = setInterval(() => {
    preProgress += Math.random() * 14 + 4;
    if (preProgress >= 100) {
      preProgress = 100;
      clearInterval(preInterval);
      setTimeout(hidePreloader, 400);
    }
    preBar.style.width = preProgress + '%';
    preCounter.textContent = Math.floor(preProgress);
  }, 80);

  function hidePreloader() {
    preloader.classList.add('gone');
    // Trigger hero animations after preloader exits
    setTimeout(initHeroAnimations, 600);
  }

  /* ════════════════════════════════════════════════════════════
     2. CUSTOM CURSOR
  ════════════════════════════════════════════════════════════ */
  const cur      = document.getElementById('cur');
  const curRing  = document.getElementById('curRing');
  const curLabel = document.getElementById('curLabel');

  // Only activate on pointer devices
  if (window.matchMedia('(hover: hover)').matches) {
    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let rafCursor;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
      curLabel.style.left = (mx + 22) + 'px';
      curLabel.style.top  = my + 'px';
    });

    // Lagging ring via rAF
    function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      curRing.style.left = rx + 'px';
      curRing.style.top  = ry + 'px';
      rafCursor = requestAnimationFrame(animRing);
    }
    animRing();

    // Hover states on interactive elements
    const hoverEls = 'a, button, [data-hover], .flip-card, .maison-item, .ent-card, .venue-card, .cta-path, .s-tier, .d-card, .pp-logo, .cw-names span, input, select, textarea';
    document.addEventListener('mouseover', e => {
      const el = e.target.closest(hoverEls);
      if (el) {
        cur.classList.add('hover');
        curRing.classList.add('hover');
        const label = el.dataset.cursorLabel;
        if (label) {
          curLabel.textContent = label;
          curLabel.classList.add('show');
        }
      }
    });
    document.addEventListener('mouseout', e => {
      const el = e.target.closest(hoverEls);
      if (el) {
        cur.classList.remove('hover');
        curRing.classList.remove('hover');
        curLabel.classList.remove('show');
      }
    });
    document.addEventListener('mousedown', () => curRing.classList.add('click'));
    document.addEventListener('mouseup',   () => curRing.classList.remove('click'));
  }

  /* ════════════════════════════════════════════════════════════
     3. SCROLL PROGRESS + NAV SCROLL STATE
  ════════════════════════════════════════════════════════════ */
  const progressLine = document.getElementById('progressLine');
  const nav          = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressLine.style.width = (scrolled / total * 100) + '%';
    nav.classList.toggle('scrolled', scrolled > 60);
    updateSideDots();
  }, { passive: true });

  /* ════════════════════════════════════════════════════════════
     4. SIDE DOTS — ACTIVE TRACKING
  ════════════════════════════════════════════════════════════ */
  const dots    = document.querySelectorAll('.side-dots .dot');
  const sections = ['hero','why','retail','luxury','dining','entertainment','events','partners','contact'];

  function updateSideDots() {
    const mid = window.scrollY + window.innerHeight * 0.4;
    let active = 'hero';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= mid) active = id;
    });
    dots.forEach(d => {
      const href = d.getAttribute('href').replace('#','');
      d.classList.toggle('active', href === active);
    });
    // Also highlight nav links
    document.querySelectorAll('.nav-links a[data-s]').forEach(a => {
      a.classList.toggle('active', a.dataset.s === active);
    });
  }

  /* ════════════════════════════════════════════════════════════
     5. HERO ANIMATIONS (staggered text reveal)
  ════════════════════════════════════════════════════════════ */
  function initHeroAnimations() {
    const delays = [
      { sel: '.hero-eyebrow', delay: 0   },
      { sel: '.h1-line:nth-child(1)', delay: 200 },
      { sel: '.h1-line:nth-child(2)', delay: 350 },
      { sel: '.h1-line:nth-child(3)', delay: 500 },
      { sel: '.hero-sub',     delay: 700 },
      { sel: '.hero-actions', delay: 900 },
    ];
    delays.forEach(({ sel, delay }) => {
      const el = document.querySelector(sel);
      if (el) setTimeout(() => el.classList.add('in'), delay);
    });

    // Pills
    document.querySelectorAll('.pill').forEach((p, i) => {
      setTimeout(() => p.classList.add('in'), 1100 + i * 100);
    });
  }

  /* ════════════════════════════════════════════════════════════
     6. HERO CANVAS — PARTICLE SYSTEM
  ════════════════════════════════════════════════════════════ */
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    const hctx = heroCanvas.getContext('2d');
    let hW, hH, hParticles = [];

    function resizeHero() {
      hW = heroCanvas.width  = heroCanvas.offsetWidth;
      hH = heroCanvas.height = heroCanvas.offsetHeight;
    }
    resizeHero();
    window.addEventListener('resize', resizeHero, { passive: true });

    // Particle class
    class HParticle {
      constructor() { this.reset(); }
      reset() {
        this.x    = Math.random() * hW;
        this.y    = Math.random() * hH;
        this.r    = Math.random() * 1.5 + 0.3;
        this.vx   = (Math.random() - 0.5) * 0.3;
        this.vy   = -Math.random() * 0.5 - 0.1;
        this.life = 0;
        this.maxL = Math.random() * 180 + 80;
        this.gold = Math.random() > 0.7;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (this.life > this.maxL || this.y < -10) this.reset();
      }
      draw() {
        const alpha = Math.sin((this.life / this.maxL) * Math.PI) * 0.6;
        hctx.beginPath();
        hctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        hctx.fillStyle = this.gold
          ? `rgba(201,168,76,${alpha})`
          : `rgba(255,255,255,${alpha * 0.4})`;
        hctx.fill();
      }
    }

    // Init particles
    for (let i = 0; i < 120; i++) {
      const p = new HParticle();
      p.life = Math.random() * p.maxL; // stagger
      hParticles.push(p);
    }

    function animHero() {
      hctx.clearRect(0, 0, hW, hH);
      hParticles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animHero);
    }
    animHero();
  }

  /* ════════════════════════════════════════════════════════════
     7. INTERSECTION OBSERVER — REVEAL + COUNTERS + BARS + RINGS
  ════════════════════════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Counter animation
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter, .pill-num').forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target  = parseFloat(el.dataset.target || el.dataset.count || 0);
    const suffix  = el.dataset.suffix || '';
    const decimal = parseInt(el.dataset.decimal || 0);
    const dur     = 1800;
    const start   = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / dur, 1);
      const ease     = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const val      = target * ease;
      el.textContent = (decimal ? val.toFixed(decimal) : Math.floor(val)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Demo bar animation
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.demo-bar-row').forEach(el => barObserver.observe(el));

  // SVG ring animation
  const ringObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = '1';
        animateRings();
      }
    });
  }, { threshold: 0.3 });

  const ringSection = document.querySelector('.event-kpi-row');
  if (ringSection) ringObserver.observe(ringSection);

  function animateRings() {
    // Circumference = 2 * PI * 52 ≈ 327
    const circumference = 327;
    const rings = [
      { id: 'ring1', pct: 0.85 },
      { id: 'ring2', pct: 0.72 },
      { id: 'ring3', pct: 0.90 },
      { id: 'ring4', pct: 0.60 },
    ];
    rings.forEach(({ id, pct }, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      setTimeout(() => {
        el.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)';
        el.style.strokeDashoffset = circumference * (1 - pct);
      }, i * 150);
    });
  }

  /* ════════════════════════════════════════════════════════════
     8. RADAR CANVAS — LOCATION CHART
  ════════════════════════════════════════════════════════════ */
  const radarCanvas = document.getElementById('radarCanvas');
  if (radarCanvas) {
    const rctx = radarCanvas.getContext('2d');
    const rW   = radarCanvas.width;
    const rH   = radarCanvas.height;
    const cx   = rW / 2;
    const cy   = rH / 2;
    const maxR = Math.min(cx, cy) - 30;

    let radarAnimFrame = 0;
    let radarStarted   = false;

    const radarObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !radarStarted) {
          radarStarted = true;
          animRadar();
        }
      });
    }, { threshold: 0.3 });
    radarObserver.observe(radarCanvas);

    // Data points — 5 axes at equal angles
    const points = [
      { label: 'NYC',        val: 0.88, angle: -90  },
      { label: 'Airport',   val: 0.72, angle: -18  },
      { label: 'JFK',        val: 0.55, angle:  54  },
      { label: 'Stadium',   val: 1.00, angle: 126  },
      { label: 'Population',val: 0.82, angle: 198  },
    ];

    function toRad(deg) { return deg * Math.PI / 180; }

    function drawRadar(progress) {
      rctx.clearRect(0, 0, rW, rH);

      // Grid rings
      [0.2, 0.4, 0.6, 0.8, 1.0].forEach(r => {
        rctx.beginPath();
        points.forEach((p, i) => {
          const a = toRad(p.angle);
          const x = cx + Math.cos(a) * maxR * r;
          const y = cy + Math.sin(a) * maxR * r;
          i === 0 ? rctx.moveTo(x, y) : rctx.lineTo(x, y);
        });
        rctx.closePath();
        rctx.strokeStyle = 'rgba(201,168,76,0.10)';
        rctx.lineWidth   = 1;
        rctx.stroke();
      });

      // Axis lines
      points.forEach(p => {
        const a = toRad(p.angle);
        rctx.beginPath();
        rctx.moveTo(cx, cy);
        rctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
        rctx.strokeStyle = 'rgba(201,168,76,0.12)';
        rctx.lineWidth   = 1;
        rctx.stroke();
      });

      // Filled polygon (animated)
      rctx.beginPath();
      points.forEach((p, i) => {
        const a = toRad(p.angle);
        const r = p.val * maxR * progress;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        i === 0 ? rctx.moveTo(x, y) : rctx.lineTo(x, y);
      });
      rctx.closePath();
      const grad = rctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grad.addColorStop(0, 'rgba(201,168,76,0.35)');
      grad.addColorStop(1, 'rgba(201,168,76,0.05)');
      rctx.fillStyle = grad;
      rctx.fill();
      rctx.strokeStyle = 'rgba(201,168,76,0.7)';
      rctx.lineWidth   = 2;
      rctx.stroke();

      // Dots on vertices
      points.forEach(p => {
        const a = toRad(p.angle);
        const r = p.val * maxR * progress;
        rctx.beginPath();
        rctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 5, 0, Math.PI * 2);
        rctx.fillStyle = '#C9A84C';
        rctx.fill();
      });

      // Center dot
      rctx.beginPath();
      rctx.arc(cx, cy, 8, 0, Math.PI * 2);
      rctx.fillStyle = 'rgba(201,168,76,0.9)';
      rctx.fill();
    }

    function animRadar() {
      radarAnimFrame++;
      const progress = Math.min(radarAnimFrame / 60, 1);
      drawRadar(easeOutQuart(progress));
      if (progress < 1) requestAnimationFrame(animRadar);
    }

    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
  }

  /* ════════════════════════════════════════════════════════════
     9. ENTERTAINMENT CANVAS — STAR FIELD
  ════════════════════════════════════════════════════════════ */
  const entCanvas = document.getElementById('entCanvas');
  if (entCanvas) {
    const ectx  = entCanvas.getContext('2d');
    let eW, eH, eStars = [];

    function resizeEnt() {
      eW = entCanvas.width  = entCanvas.offsetWidth;
      eH = entCanvas.height = entCanvas.offsetHeight;
    }
    resizeEnt();
    window.addEventListener('resize', resizeEnt, { passive: true });

    class EStar {
      constructor() { this.reset(); }
      reset() {
        this.x    = Math.random() * eW;
        this.y    = Math.random() * eH;
        this.r    = Math.random() * 1.2 + 0.1;
        this.speed = Math.random() * 0.3 + 0.05;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.twinkle = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.speed;
        this.twinkle += 0.025;
        if (this.y > eH + 5) this.reset(), this.y = -5;
      }
      draw() {
        const a = this.opacity * (0.6 + 0.4 * Math.sin(this.twinkle));
        ectx.beginPath();
        ectx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ectx.fillStyle = `rgba(255,255,255,${a})`;
        ectx.fill();
      }
    }

    for (let i = 0; i < 200; i++) eStars.push(new EStar());

    let entVisible = false;
    const entObserver = new IntersectionObserver(e => {
      entVisible = e[0].isIntersecting;
    });
    entObserver.observe(entCanvas);

    function animEnt() {
      requestAnimationFrame(animEnt);
      if (!entVisible) return;
      ectx.clearRect(0, 0, eW, eH);
      eStars.forEach(s => { s.update(); s.draw(); });
    }
    animEnt();
  }

  /* ════════════════════════════════════════════════════════════
     10. 3D TILT EFFECT
  ════════════════════════════════════════════════════════════ */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-hover="tilt"]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const midX   = rect.width  / 2;
        const midY   = rect.height / 2;
        const rotY   =  ((x - midX) / midX) * 8;
        const rotX   = -((y - midY) / midY) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     11. MOBILE NAV
  ════════════════════════════════════════════════════════════ */
  const navHam  = document.getElementById('navHam');
  const mobMenu = document.getElementById('mobMenu');

  navHam.addEventListener('click', () => {
    const open = mobMenu.classList.toggle('open');
    navHam.classList.toggle('open', open);
    document.body.classList.toggle('modal-open', open);
  });

  window.closeMob = function () {
    mobMenu.classList.remove('open');
    navHam.classList.remove('open');
    document.body.classList.remove('modal-open');
  };

  /* ════════════════════════════════════════════════════════════
     12. TENANT FILTER
  ════════════════════════════════════════════════════════════ */
  window.filterTenants = function (cat) {
    document.querySelectorAll('.tbtn').forEach(b => {
      b.classList.toggle('active', b.dataset.cat === cat);
    });
    document.querySelectorAll('.ttag').forEach(tag => {
      if (cat === 'all') {
        tag.classList.remove('hidden');
      } else {
        tag.classList.toggle('hidden', tag.dataset.cat !== cat && tag.dataset.cat !== 'all');
      }
    });
  };

  /* ════════════════════════════════════════════════════════════
     13. LEASING ROI CALCULATOR
  ════════════════════════════════════════════════════════════ */
  let calcTier = 1;   // 1=Prime, 2=Standard, 3=Pop-Up
  let calcCatMult = 1.3; // multiplier by category

  const tierBaseRent  = { 1: 180, 2: 120, 3: 80 };  // $/sqft/yr
  const tierTrafficPct = { 1: 0.06, 2: 0.04, 3: 0.025 }; // % of 40M

  window.updateCalc = function () {
    const sizeEl = document.getElementById('calcSize');
    const size   = parseInt(sizeEl.value);
    document.getElementById('calcSizeVal').textContent = size.toLocaleString() + ' sq ft';

    const annualTraffic = 40_000_000;
    const visitorExposure = Math.round(annualTraffic * tierTrafficPct[calcTier] * (size / 2000));
    const revenuePerSqFt  = tierBaseRent[calcTier] * calcCatMult;
    const annualRevenue   = size * revenuePerSqFt;
    const roiMultiple     = (calcCatMult * (4 - calcTier * 0.5)).toFixed(1);

    const fmt = n => n >= 1_000_000
      ? '$' + (n / 1_000_000).toFixed(1) + 'M'
      : '$' + Math.round(n / 1000) + 'K';

    const visitorFmt = visitorExposure >= 1_000_000
      ? (visitorExposure / 1_000_000).toFixed(1) + 'M'
      : (visitorExposure / 1000).toFixed(0) + 'K';

    animateVal('coVisitors', visitorFmt);
    animateVal('coRevenue',  fmt(annualRevenue));
    animateVal('coRoi',      roiMultiple + '×');
  };

  function animateVal(id, newVal) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transform = 'scale(1.1)';
    el.style.color     = '#F0D080';
    el.textContent     = newVal;
    setTimeout(() => {
      el.style.transform = '';
      el.style.color     = '';
    }, 300);
  }

  window.selectTier = function (btn, tier) {
    document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    calcTier = tier;
    updateCalc();
  };

  window.selectCat = function (btn, mult) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    calcCatMult = mult;
    updateCalc();
  };

  // Init calc display
  if (document.getElementById('calcSize')) updateCalc();

  /* ════════════════════════════════════════════════════════════
     14. LUXURY MAISON ACCORDION
  ════════════════════════════════════════════════════════════ */
  window.toggleMaison = function (item) {
    // Close others
    document.querySelectorAll('.maison-item.active').forEach(el => {
      if (el !== item) el.classList.remove('active');
    });
    item.classList.toggle('active');
  };

  /* ════════════════════════════════════════════════════════════
     15. DINING SLIDER — PREV/NEXT + DRAG
  ════════════════════════════════════════════════════════════ */
  const dSlider = document.getElementById('diningSlider');
  const dPrev   = document.getElementById('dPrev');
  const dNext   = document.getElementById('dNext');

  if (dSlider && dPrev && dNext) {
    const CARD_W = () => {
      const c = dSlider.querySelector('.d-card');
      return c ? c.offsetWidth + 20 : 300;
    };

    dPrev.addEventListener('click', () => {
      dSlider.scrollBy({ left: -CARD_W(), behavior: 'smooth' });
    });
    dNext.addEventListener('click', () => {
      dSlider.scrollBy({ left:  CARD_W(), behavior: 'smooth' });
    });

    // Drag to scroll
    let isDragging = false, startX = 0, scrollStart = 0;

    dSlider.addEventListener('mousedown', e => {
      isDragging  = true;
      startX      = e.pageX;
      scrollStart = dSlider.scrollLeft;
      dSlider.style.userSelect = 'none';
    });
    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.pageX - startX;
      dSlider.scrollLeft = scrollStart - dx;
    });
    window.addEventListener('mouseup', () => {
      isDragging = false;
      dSlider.style.userSelect = '';
    });

    // Touch drag
    dSlider.addEventListener('touchstart', e => {
      startX      = e.touches[0].pageX;
      scrollStart = dSlider.scrollLeft;
    }, { passive: true });
    dSlider.addEventListener('touchmove', e => {
      dSlider.scrollLeft = scrollStart - (e.touches[0].pageX - startX);
    }, { passive: true });
  }

  /* ════════════════════════════════════════════════════════════
     16. ENTERTAINMENT ATTRACTION MODAL
  ════════════════════════════════════════════════════════════ */
  const attractions = {
    nick: {
      icon:  '🎢',
      tag:   'Indoor Theme Park',
      title: 'Nickelodeon Universe',
      claim: 'Largest Indoor Theme Park in the Western Hemisphere',
      body:  'Covering 8 acres inside American Dream, Nickelodeon Universe is home to 35+ rides and attractions across multiple Nickelodeon IPs — SpongeBob, Teenage Mutant Ninja Turtles, Paw Patrol and more. Open 365 days a year with weather-proof operation. An unrivaled anchor for family foot traffic with exclusive co-branding and sponsorship opportunities for select partners.',
      facts: [
        { val: '35+',    key: 'Rides & Attractions' },
        { val: '8 Acres',key: 'Floor Space' },
        { val: '365',    key: 'Days/Year Open' },
      ],
    },
    water: {
      icon:  '🌊',
      tag:   'Indoor Water Park',
      title: 'DreamWorks Water Park',
      claim: "North America's Largest Indoor Water Park",
      body:  'DreamWorks Water Park at American Dream is North America\'s largest indoor water park — 40 slides, wave pools, lazy rivers, and a retractable roof system for year-round operation. Exclusive IP-branded activation zones create unmatched opportunities for entertainment and FMCG sponsors seeking deeply engaged family audiences.',
      facts: [
        { val: '40',         key: 'Water Slides' },
        { val: 'Year-Round', key: 'Operation' },
        { val: '#1 in NA',   key: 'Largest Indoor' },
      ],
    },
    snow: {
      icon:  '⛷️',
      tag:   'Indoor Ski Resort',
      title: 'Big SNOW American Dream',
      claim: "America's Only Real Indoor Snow Mountain",
      body:  "Big SNOW is America's only real indoor ski resort — six slopes of real snow maintained at 28°F year-round, regardless of weather outside. Serving first-time skiers through advanced level with lessons, gear rental, and a ski school. An irreplaceable winter lifestyle anchor that drives wealthy suburban demographics and adventurous millennial shoppers.",
      facts: [
        { val: '6',         key: 'Snow Slopes' },
        { val: '28°F',      key: 'Year-Round Temp' },
        { val: 'Only One',  key: 'In America' },
      ],
    },
    wheel: {
      icon:  '🎡',
      tag:   'Observation Wheel',
      title: 'The Observation Wheel',
      claim: '300 Feet High · Panoramic NYC Skyline Views',
      body:  'Standing 300 feet tall, The Observation Wheel at American Dream delivers stunning 360-degree views of the New York City skyline and New Jersey coastline. Climate-controlled gondolas operate year-round. Premium naming rights and digital wrap sponsorship packages available. One of the most photographed and shared landmarks in the tri-state area.',
      facts: [
        { val: '300 ft',    key: 'Height' },
        { val: 'NYC Views', key: 'Skyline Panorama' },
        { val: 'Year-Round',key: 'Operation' },
      ],
    },
    ice: {
      icon:  '🏒',
      tag:   'Ice Rink',
      title: 'The Rink at American Dream',
      claim: 'NHL-Regulation · Converts to Event Floor',
      body:  "The Rink is an NHL-regulation ice rink open for public skating, hockey leagues, and private events year-round. With a retractable event floor system, The Rink converts to a 5,000-capacity standing venue for concerts, esports tournaments, galas, and product launches. Located at the heart of the mall — surrounded by daily visitor foot traffic before your event even begins.",
      facts: [
        { val: 'NHL Size',  key: 'Regulation Rink' },
        { val: '5,000',     key: 'Standing Capacity' },
        { val: 'Converts',  key: 'To Event Floor' },
      ],
    },
  };

  window.openAttr = function (key) {
    const a = attractions[key];
    if (!a) return;
    const html = `
      <div class="attr-icon">${a.icon}</div>
      <div class="attr-tag">${a.tag}</div>
      <div class="attr-title">${a.title}</div>
      <div class="attr-claim">${a.claim}</div>
      <div class="attr-facts">
        ${a.facts.map(f => `<div><div class="af-val">${f.val}</div><div class="af-key">${f.key}</div></div>`).join('')}
      </div>
      <p class="attr-body">${a.body}</p>
      <a href="#contact" class="btn-gold" onclick="closeModal('attrModal');presetInquiry('${a.title} sponsorship/partnership inquiry')">
        <span>Inquire About This Attraction</span>
        <i class="fas fa-arrow-right"></i>
      </a>
    `;
    document.getElementById('attrContent').innerHTML = html;
    openModal('attrModal');
  };

  /* ════════════════════════════════════════════════════════════
     17. VENUE SWITCHER
  ════════════════════════════════════════════════════════════ */
  window.switchVenue = function (key, card) {
    // Update cards
    document.querySelectorAll('.venue-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    // Update panels
    document.querySelectorAll('.vd-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('vd-' + key);
    if (panel) {
      panel.classList.add('active');
      // Replay tilt/reveal on new panel
      panel.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), 50);
      });
    }
  };

  /* ════════════════════════════════════════════════════════════
     18. SPONSORSHIP TIER SELECTION (visual highlight)
  ════════════════════════════════════════════════════════════ */
  window.selectSponsor = function (el, tier) {
    document.querySelectorAll('.s-tier').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
  };

  /* ════════════════════════════════════════════════════════════
     19. CELEBRITY WALL ANIMATION
  ════════════════════════════════════════════════════════════ */
  const cwNames = document.getElementById('cwNames');
  if (cwNames) {
    const spans = cwNames.querySelectorAll('span');
    let cwIdx   = 0;

    function litNext() {
      spans.forEach(s => s.classList.remove('lit'));
      spans[cwIdx % spans.length].classList.add('lit');
      cwIdx++;
    }
    litNext();

    const cwObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (!cwNames.dataset.interval) {
          cwNames.dataset.interval = '1';
          setInterval(litNext, 1200);
        }
      }
    }, { threshold: 0.5 });
    cwObs.observe(cwNames);
  }

  /* ════════════════════════════════════════════════════════════
     20. MODAL SYSTEM
  ════════════════════════════════════════════════════════════ */
  window.openModal = function (id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add('open');
    document.body.classList.add('modal-open');
  };

  window.closeModal = function (id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('open');
    document.body.classList.remove('modal-open');
    // Stop video if reel
    if (id === 'reelModal') {
      const f = document.getElementById('reelFrame');
      if (f) f.src = '';
    }
  };

  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) closeModal(m.id);
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
      closeMob();
    }
  });

  /* ════════════════════════════════════════════════════════════
     21. VIDEO REEL MODAL
  ════════════════════════════════════════════════════════════ */
  window.openReel = function () {
    const frame = document.getElementById('reelFrame');
    if (frame) {
      frame.src = 'https://www.youtube.com/embed/YEKsgfP5-s8?autoplay=1&rel=0&modestbranding=1';
    }
    openModal('reelModal');
  };

  /* ════════════════════════════════════════════════════════════
     22. LUXURY INQUIRY MODAL
  ════════════════════════════════════════════════════════════ */
  window.openLuxInquiry = function () {
    openModal('luxModal');
  };

  /* ════════════════════════════════════════════════════════════
     23. CONTACT FORM — PATH SELECTION + SUBMISSION
  ════════════════════════════════════════════════════════════ */
  window.selectPath = function (el, type) {
    document.querySelectorAll('.cta-path').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    presetInquiry(type);
    // Smooth scroll to form
    const form = document.getElementById('formWrap');
    if (form) {
      setTimeout(() => form.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
    }
  };

  window.presetInquiry = function (type) {
    const sel = document.getElementById('fType');
    if (!sel) return;
    // Try to find a matching option
    const opts = Array.from(sel.options);
    const match = opts.find(o => o.text.toLowerCase().includes(type.split(' ')[0].toLowerCase()));
    if (match) sel.value = match.value;
    // Fallback — set first option that is non-empty
    else sel.value = opts[1] ? opts[1].value : '';
  };

  window.submitForm = function (e) {
    e.preventDefault();

    const btn    = document.getElementById('formSubmit');
    const form   = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');

    // Validation
    const required = ['fFirst', 'fLast', 'fEmail', 'fType'];
    let valid = true;
    required.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) {
        el.style.borderBottomColor = '#ef4444';
        valid = false;
        setTimeout(() => el.style.borderBottomColor = '', 2000);
      }
    });
    if (!valid) return;

    // Loading state
    btn.classList.add('loading');
    btn.disabled = true;

    // Simulate async submission
    setTimeout(() => {
      form.style.display      = 'none';
      success.classList.add('show');
      btn.classList.remove('loading');
      btn.disabled = false;
    }, 1800);
  };

  window.resetForm = function () {
    const form   = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (form)    { form.reset(); form.style.display = ''; }
    if (success) success.classList.remove('show');
    document.querySelectorAll('.cta-path').forEach(p => p.classList.remove('active'));
  };

  /* ════════════════════════════════════════════════════════════
     24. SMOOTH ANCHOR SCROLLING (override default)
  ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ════════════════════════════════════════════════════════════
     25. FLIP CARD — TOUCH TOGGLE (mobile)
  ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      // On touch devices, toggle flip on click
      if (window.matchMedia('(hover: none)').matches) {
        card.classList.toggle('flipped');
        // CSS companion: .flip-card.flipped .flip-front { transform: rotateY(-180deg); }
      }
    });
  });

  /* ════════════════════════════════════════════════════════════
     26. NAV BACKGROUND ON HERO SCROLL
  ════════════════════════════════════════════════════════════ */
  // Initial check
  nav.classList.toggle('scrolled', window.scrollY > 60);
  updateSideDots();

  /* ════════════════════════════════════════════════════════════
     27. RESIZE HANDLER (debounced)
  ════════════════════════════════════════════════════════════ */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Re-init any size-dependent items
      updateSideDots();
    }, 200);
  }, { passive: true });

  /* ════════════════════════════════════════════════════════════
     28. MAGNETIC HOVER EFFECT for lux pills
  ════════════════════════════════════════════════════════════ */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-hover="magnetic"]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const dx   = e.clientX - (rect.left + rect.width  / 2);
        const dy   = e.clientY - (rect.top  + rect.height / 2);
        el.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px) scale(1.06)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     29. SECTION HEAD STAGGER (children)
  ════════════════════════════════════════════════════════════ */
  const headObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('.tag, .section-title, .section-desc');
        children.forEach((c, i) => {
          setTimeout(() => {
            c.style.opacity   = '1';
            c.style.transform = 'translateY(0)';
          }, i * 120);
        });
        headObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section-head').forEach(h => {
    // Set initial state
    h.querySelectorAll('.tag, .section-title, .section-desc').forEach(c => {
      c.style.opacity   = '0';
      c.style.transform = 'translateY(24px)';
      c.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
    });
    headObserver.observe(h);
  });

  /* ════════════════════════════════════════════════════════════
     30. TOUCH: FLIP CARD CSS COMPANION (inject rule)
  ════════════════════════════════════════════════════════════ */
  const touchStyle = document.createElement('style');
  touchStyle.textContent = `
    .flip-card.flipped .flip-front { transform: rotateY(-180deg); }
    .flip-card.flipped .flip-back  { transform: rotateY(0deg); }
  `;
  document.head.appendChild(touchStyle);

  /* ════════════════════════════════════════════════════════════
     INIT — run once DOM settled
  ════════════════════════════════════════════════════════════ */
  // Ensure calc initial render
  window.addEventListener('load', () => {
    if (document.getElementById('calcSize')) updateCalc();
    // Trigger initial scroll state
    window.dispatchEvent(new Event('scroll'));
  });

})();
