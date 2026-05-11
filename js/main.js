/* ═══════════════════════════════════════════════════════════
   AMERICAN DREAM — SALES DECK  |  js/main.js  v2
   All interactive systems: preloader, custom cursor, canvas,
   counters, scroll reveals, flip cards, calculator, modals,
   venue switcher, sponsorship tiers, contact form, drag-scroll
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── GLOBALS ─────────────────────────────────────────────── */
let calcTier   = 1;
let calcCatMult = 1.3;
let selectedPath = null;
let heroParticles = [];
let entParticles  = [];
let radarAnimDone = false;
let animFrameHero, animFrameEnt, animFrameRadar;
let mouseX = 0, mouseY = 0;
let curX = 0,  curY = 0;
let curRingX = 0, curRingY = 0;
let isDragging = false;
let dragStart = 0;
let scrollStart = 0;

const GOLD = '#C9A84C';
const GOLD_DARK = '#9A7A2E';
const GOLD_LIGHT = '#F0D080';

/* ═══════════════════════════════════════════════════════════
   PRELOADER
═══════════════════════════════════════════════════════════ */
(function initPreloader() {
  const pre    = document.getElementById('preloader');
  const bar    = document.getElementById('preBar');
  const ctr    = document.getElementById('preCounter');
  if (!pre) return;

  let pct = 0;
  const resources = [
    'https://fonts.googleapis.com',
    'https://cdnjs.cloudflare.com'
  ];

  const step = () => {
    pct = Math.min(100, pct + Math.random() * 8 + 2);
    bar.style.width = pct + '%';
    ctr.textContent = Math.floor(pct) + '%';
    if (pct < 100) {
      setTimeout(step, 60 + Math.random() * 60);
    } else {
      bar.style.width = '100%';
      ctr.textContent = '100%';
      setTimeout(() => {
        pre.classList.add('hidden');
        document.body.classList.add('loaded');
        initHeroAnimations();
      }, 400);
    }
  };
  setTimeout(step, 200);
})();

/* ═══════════════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════════════ */
(function initCursor() {
  const cur      = document.getElementById('cur');
  const curRing  = document.getElementById('curRing');
  const curLabel = document.getElementById('curLabel');
  if (!cur) return;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor follow
  function animateCursor() {
    curX   += (mouseX - curX)   * 0.18;
    curY   += (mouseY - curY)   * 0.18;
    curRingX += (mouseX - curRingX) * 0.10;
    curRingY += (mouseY - curRingY) * 0.10;

    cur.style.left     = curX + 'px';
    cur.style.top      = curY + 'px';
    curRing.style.left = curRingX + 'px';
    curRing.style.top  = curRingY + 'px';
    curLabel.style.left = curRingX + 'px';
    curLabel.style.top  = curRingY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover labels
  document.querySelectorAll('[data-hover="tilt"], .flip-card, .ent-card, .cta-path, .s-tier').forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      curLabel.textContent = el.dataset.label || 'Explore';
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
      curLabel.textContent = '';
    });
  });

  document.querySelectorAll('a, button, [onclick]').forEach(el => {
    el.addEventListener('mouseenter', () => cur.style.transform = 'translate(-50%,-50%) scale(1.6)');
    el.addEventListener('mouseleave', () => cur.style.transform = 'translate(-50%,-50%) scale(1)');
  });
})();

/* ═══════════════════════════════════════════════════════════
   NAVIGATION — SCROLL EFFECTS
═══════════════════════════════════════════════════════════ */
(function initNav() {
  const nav  = document.getElementById('nav');
  const line = document.getElementById('progressLine');
  const ham  = document.getElementById('navHam');
  const mob  = document.getElementById('mobMenu');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? (scrolled / total) * 100 : 0;

    // Scrolled state
    nav.classList.toggle('scrolled', scrolled > 60);

    // Progress line
    if (line) line.style.width = pct + '%';

    // Active nav links
    updateActiveNav();

    // Side dots
    updateSideDots();
  }, { passive: true });

  // Hamburger
  if (ham && mob) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mob.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });
  }
})();

function closeMob() {
  const ham = document.getElementById('navHam');
  const mob = document.getElementById('mobMenu');
  if (ham) ham.classList.remove('open');
  if (mob) mob.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const h   = sec.offsetHeight;
    const id  = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[data-s="${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + h);
    }
  });
}

function updateSideDots() {
  const sections = document.querySelectorAll('section[id], #hero');
  const scrollY  = window.scrollY + window.innerHeight / 2;
  sections.forEach(sec => {
    const id  = sec.getAttribute('id');
    const dot = document.querySelector(`.side-dots .dot[href="#${id}"]`);
    if (!dot) return;
    const top = sec.offsetTop;
    const h   = sec.offsetHeight;
    dot.classList.toggle('active', scrollY >= top && scrollY < top + h);
  });
}

/* ═══════════════════════════════════════════════════════════
   HERO CANVAS — PARTICLE SYSTEM
═══════════════════════════════════════════════════════════ */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Create particles
  const COUNT = 80;
  heroParticles = [];
  for (let i = 0; i < COUNT; i++) {
    heroParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.1,
      alpha: Math.random() * 0.6 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.7
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    heroParticles.forEach(p => {
      p.pulse += 0.015;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(201,168,76,${a})`
        : `rgba(255,255,255,${a * 0.4})`;
      ctx.fill();
    });

    // Draw connecting lines for nearby particles
    for (let i = 0; i < heroParticles.length; i++) {
      for (let j = i + 1; j < heroParticles.length; j++) {
        const dx = heroParticles[i].x - heroParticles[j].x;
        const dy = heroParticles[i].y - heroParticles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(heroParticles[i].x, heroParticles[i].y);
          ctx.lineTo(heroParticles[j].x, heroParticles[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animFrameHero = requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════════════════════════════════════════════════════════
   ENTERTAINMENT CANVAS — STAR FIELD
═══════════════════════════════════════════════════════════ */
function initEntCanvas() {
  const canvas = document.getElementById('entCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('entertainment');

  function resize() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const STARS = 120;
  entParticles = [];
  for (let i = 0; i < STARS; i++) {
    entParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      speed: Math.random() * 0.2 + 0.05,
      alpha: Math.random() * 0.5 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005
    });
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    entParticles.forEach(s => {
      s.twinkle += s.twinkleSpeed;
      s.y -= s.speed;
      if (s.y < -5) { s.y = canvas.height + 5; s.x = Math.random() * canvas.width; }

      const a = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();
    });
    animFrameEnt = requestAnimationFrame(drawStars);
  }
  drawStars();
}

/* ═══════════════════════════════════════════════════════════
   RADAR CANVAS — LOCATION CHART
═══════════════════════════════════════════════════════════ */
function initRadarCanvas() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const maxR = Math.min(W, H) * 0.42;

  const points = [
    { label:'NYC',         angle:-90, dist:0.72, color:GOLD },
    { label:'Newark AP',   angle:-18, dist:0.58, color:'#66aaff' },
    { label:'JFK',         angle: 54, dist:0.65, color:'#66aaff' },
    { label:'MetLife',     angle:126, dist:0.30, color:GOLD },
    { label:'24M People',  angle:198, dist:0.88, color:GOLD_LIGHT }
  ];

  let progress = 0;

  function drawRadar(prog) {
    ctx.clearRect(0, 0, W, H);

    // Rings
    for (let i = 1; i <= 4; i++) {
      const r = (i / 4) * maxR;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(201,168,76,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Spokes
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.strokeStyle = 'rgba(201,168,76,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Center glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.3);
    grd.addColorStop(0, 'rgba(201,168,76,0.15)');
    grd.addColorStop(1, 'rgba(201,168,76,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, maxR * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Data polygon
    if (prog > 0) {
      ctx.beginPath();
      points.forEach((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const r   = p.dist * maxR * Math.min(prog, 1);
        const x   = cx + Math.cos(rad) * r;
        const y   = cy + Math.sin(rad) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle   = 'rgba(201,168,76,0.06)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(201,168,76,0.4)';
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }

    // Points
    points.forEach(p => {
      const rad = (p.angle * Math.PI) / 180;
      const r   = p.dist * maxR * Math.min(prog, 1);
      const x   = cx + Math.cos(rad) * r;
      const y   = cy + Math.sin(rad) * r;

      // Pulse ring
      const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.002 + p.angle);
      ctx.beginPath();
      ctx.arc(x, y, 8 + pulse * 6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201,168,76,${0.15 * prog})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Dot
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Line from center
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = `rgba(201,168,76,${0.2 * prog})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = GOLD;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(201,168,76,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function animateRadar() {
    progress += 0.018;
    drawRadar(progress);
    if (progress < 1) {
      animFrameRadar = requestAnimationFrame(animateRadar);
    } else {
      // Keep redrawing for pulse animation
      function pulseLoop() {
        drawRadar(1);
        animFrameRadar = requestAnimationFrame(pulseLoop);
      }
      pulseLoop();
    }
  }
  animateRadar();
}

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
═══════════════════════════════════════════════════════════ */
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger demo bars
        if (entry.target.classList.contains('reveal-bar')) {
          const fill = entry.target.querySelector('.db-fill');
          if (fill) {
            setTimeout(() => fill.classList.add('animated'), 100);
          }
        }
        // Init canvas when section in view
        const id = entry.target.closest('section')?.id;
        if (id === 'why' && !radarAnimDone) {
          radarAnimDone = true;
          setTimeout(initRadarCanvas, 400);
        }
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-bar').forEach(el => observer.observe(el));

  // Counter observer
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter, .stat-num.counter').forEach(el => counterObs.observe(el));

  // Ring observer
  const ringObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateRings();
        ringObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const ringRow = document.querySelector('.event-kpi-row');
  if (ringRow) ringObs.observe(ringRow);
})();

/* ── COUNTER ANIMATION ────────────────────────────────────── */
function animateCounter(el) {
  const target  = parseFloat(el.dataset.target || el.closest('[data-target]')?.dataset.target || 0);
  const suffix  = el.dataset.suffix || '';
  const decimal = parseInt(el.dataset.decimal || 0);
  const duration = 2000;
  const start   = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = decimal
      ? current.toFixed(decimal) + suffix
      : Math.floor(current) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = (decimal ? target.toFixed(decimal) : target) + suffix;
  }
  requestAnimationFrame(update);
}

/* ── SVG RING ANIMATIONS ──────────────────────────────────── */
function animateRings() {
  const rings = document.querySelectorAll('.ring-prog');
  const pcts  = [0.80, 0.92, 0.70, 0.65]; // visual fill percentages

  rings.forEach((ring, i) => {
    const circumference = 327;
    const targetOffset  = circumference * (1 - pcts[i]);
    const duration      = 1600;
    const start         = performance.now();
    const startOffset   = circumference;

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      const offset   = startOffset - (startOffset - targetOffset) * ease;
      ring.style.strokeDashoffset = offset;
      if (progress < 1) requestAnimationFrame(step);
    }

    setTimeout(() => requestAnimationFrame(step), i * 150);
  });

  // Also trigger counters inside rings
  document.querySelectorAll('.ekpi-center .counter').forEach(el => {
    setTimeout(() => animateCounter(el), 200);
  });
}

/* ═══════════════════════════════════════════════════════════
   HERO ANIMATIONS
═══════════════════════════════════════════════════════════ */
function initHeroAnimations() {
  initHeroCanvas();
  initEntCanvas();

  // Staggered fade-in
  const eyebrow = document.querySelector('.hero-eyebrow');
  const lines   = document.querySelectorAll('.h1-line');
  const sub     = document.querySelector('.hero-sub');
  const actions = document.querySelector('.hero-actions');
  const pills   = document.querySelectorAll('.pill');

  const delays = [200, 400, 600, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500];

  if (eyebrow) setTimeout(() => eyebrow.classList.add('in'), 200);
  lines.forEach((l, i) => setTimeout(() => l.classList.add('in'), 400 + i * 150));
  if (sub) setTimeout(() => sub.classList.add('in'), 700);
  if (actions) setTimeout(() => actions.classList.add('in'), 900);
  pills.forEach((p, i) => setTimeout(() => p.classList.add('in'), 1100 + i * 100));

  // Pill counter animations
  setTimeout(() => {
    document.querySelectorAll('.pill-num').forEach(el => {
      const count  = parseInt(el.dataset.count || 0);
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = Math.ceil(count / 40);
      const t = setInterval(() => {
        cur = Math.min(cur + step, count);
        el.textContent = cur + suffix;
        if (cur >= count) clearInterval(t);
      }, 40);
    });
  }, 1200);
}

/* ═══════════════════════════════════════════════════════════
   3D TILT EFFECT
═══════════════════════════════════════════════════════════ */
(function initTilt() {
  document.querySelectorAll('[data-hover="tilt"]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const rx    = ((y / rect.height) - 0.5) * -16;
      const ry    = ((x / rect.width)  - 0.5) *  16;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   FLIP CARDS — Touch support
═══════════════════════════════════════════════════════════ */
(function initFlipCards() {
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   TENANT FILTER
═══════════════════════════════════════════════════════════ */
function filterTenants(cat) {
  const tags = document.querySelectorAll('.ttag');
  const btns = document.querySelectorAll('.tbtn');

  // Update active button
  btns.forEach(b => b.classList.toggle('active', b.dataset.cat === cat));

  // Filter tags
  tags.forEach(tag => {
    const show = cat === 'all' || tag.dataset.cat === cat || tag.classList.contains('ttag-plus');
    if (show) {
      tag.classList.remove('hidden');
      tag.style.position = '';
    } else {
      tag.classList.add('hidden');
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   LEASING CALCULATOR
═══════════════════════════════════════════════════════════ */
function updateCalc() {
  const sizeEl     = document.getElementById('calcSize');
  const sizeValEl  = document.getElementById('calcSizeVal');
  const visEl      = document.getElementById('coVisitors');
  const revEl      = document.getElementById('coRevenue');
  const roiEl      = document.getElementById('coRoi');

  if (!sizeEl) return;
  const size = parseInt(sizeEl.value);

  // Format size
  sizeValEl.textContent = size.toLocaleString() + ' sq ft';

  // Tier multipliers (visitors captured %)
  const tierMults = { 1: 0.08, 2: 0.055, 3: 0.03 };
  const tierRev   = { 1: 320,  2: 240,   3: 160 };  // $/sq ft/yr estimated revenue

  const visitorPct   = tierMults[calcTier];
  const annualVisitors = Math.round(40_000_000 * visitorPct * (size / 20000) * calcCatMult);
  const revenue        = Math.round(size * tierRev[calcTier] * calcCatMult);
  const investment     = size * 85; // rough all-in build cost
  const roi            = (revenue / (investment * 0.15)).toFixed(1);

  // Animate values
  animateValue(visEl, annualVisitors, v => {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
    if (v >= 1_000)     return (v / 1_000).toFixed(0) + 'K';
    return v.toString();
  });
  animateValue(revEl, revenue, v => '$' + (v >= 1_000_000 ? (v / 1_000_000).toFixed(1) + 'M' : (v / 1_000).toFixed(0) + 'K'));
  animateValue(roiEl, parseFloat(roi), v => v.toFixed(1) + '×');
}

function animateValue(el, target, format) {
  if (!el) return;
  const start    = performance.now();
  const duration = 500;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const v = typeof target === 'number' ? target * ease : target;
    el.textContent = format(v);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = format(target);
  }
  requestAnimationFrame(step);
}

function selectTier(el, tier) {
  document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  calcTier = tier;
  updateCalc();
}

function selectCat(el, mult) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  calcCatMult = mult;
  updateCalc();
}

/* ═══════════════════════════════════════════════════════════
   MAISON ACCORDION
═══════════════════════════════════════════════════════════ */
function toggleMaison(el) {
  const isOpen = el.classList.contains('open');
  // Close all
  document.querySelectorAll('.maison-item.open').forEach(m => m.classList.remove('open'));
  // Toggle clicked
  if (!isOpen) el.classList.add('open');
}

/* ═══════════════════════════════════════════════════════════
   LUXURY INQUIRY MODAL
═══════════════════════════════════════════════════════════ */
function openLuxInquiry() {
  openModal('luxModal');
}

/* ═══════════════════════════════════════════════════════════
   ATTRACTION MODAL
═══════════════════════════════════════════════════════════ */
const ATTRACTIONS = {
  nick: {
    icon: '🎢',
    tag: 'Indoor Theme Park',
    name: 'Nickelodeon Universe',
    desc: 'The Western Hemisphere\'s largest indoor theme park. 35+ rides and attractions, 8 acres under a climate-controlled roof. SpongeBob, Dora, Teenage Mutant Ninja Turtles, and more. Open 365 days a year, rain or shine. The nation\'s only major theme park accessible from a shopping mall — driving 12M+ themed visits annually.',
    stats: [
      { v:'35+',   k:'Rides' },
      { v:'8',     k:'Acres' },
      { v:'365',   k:'Days/Year' },
      { v:'12M+',  k:'Annual Visits' }
    ]
  },
  water: {
    icon: '🌊',
    tag: 'Indoor Water Park',
    name: 'DreamWorks Water Park',
    desc: 'North America\'s largest indoor water park. DreamWorks-licensed characters, 40+ slides and attractions, wave pools, lazy rivers — all year-round, regardless of season. The definitive reason families travel from 200+ miles away.',
    stats: [
      { v:'40+',   k:'Slides' },
      { v:'#1',    k:'In North America' },
      { v:'Year-Round', k:'All Weather' },
      { v:'4M+',   k:'Annual Visits' }
    ]
  },
  snow: {
    icon: '⛷️',
    tag: 'Indoor Ski Resort',
    name: 'Big SNOW',
    desc: 'America\'s first and only year-round real indoor snow ski and snowboard resort. Real snow — always 28°F — with 6 slopes ranging from beginner to advanced. Ski rentals, lessons, and après-ski included. The only place in the NYC metro where you can ski in July.',
    stats: [
      { v:'6',      k:'Slopes' },
      { v:'Real',   k:'Snow Always' },
      { v:'28°F',   k:'Year-Round' },
      { v:'NYC',    k:'Metro Exclusive' }
    ]
  },
  wheel: {
    icon: '🎡',
    tag: 'Observation Wheel',
    name: 'The Wheel',
    desc: '300-foot observation wheel with panoramic views of the Manhattan skyline, MetLife Stadium, and the New Jersey horizon. Glass gondolas for groups, couples, and private events. Available for brand activations and sponsored capsule wraps.',
    stats: [
      { v:'300 ft', k:'Height' },
      { v:'NYC',    k:'Skyline Views' },
      { v:'Private', k:'Event Pods' },
      { v:'Branded', k:'Wrap Available' }
    ]
  },
  ice: {
    icon: '🏒',
    tag: 'Ice Rink',
    name: 'The Rink',
    desc: 'NHL-regulation indoor ice rink open for public skating, hockey leagues, lessons, and private events year-round. Converts to event floor for concerts and esports up to 5,000 standing capacity. Full production infrastructure included.',
    stats: [
      { v:'NHL',    k:'Regulation' },
      { v:'5,000',  k:'Standing Events' },
      { v:'365',    k:'Days Available' },
      { v:'Convert', k:'To Event Floor' }
    ]
  }
};

function openAttr(id) {
  const data = ATTRACTIONS[id];
  if (!data) return;

  const statsHTML = data.stats.map(s =>
    `<div class="as-item"><div class="as-v">${s.v}</div><div class="as-k">${s.k}</div></div>`
  ).join('');

  document.getElementById('attrContent').innerHTML = `
    <div class="attr-icon">${data.icon}</div>
    <span class="attr-tag">${data.tag}</span>
    <h3>${data.name}</h3>
    <p>${data.desc}</p>
    <div class="attr-stats">${statsHTML}</div>
    <a href="#contact" class="btn-gold" onclick="closeModal('attrModal');presetInquiry('Sponsorship near ${data.name}')">
      <span>Partner With This Venue</span>
      <i class="fas fa-arrow-right"></i>
    </a>
  `;
  openModal('attrModal');
}

/* ═══════════════════════════════════════════════════════════
   VENUE SWITCHER
═══════════════════════════════════════════════════════════ */
function switchVenue(id, el) {
  // Cards
  document.querySelectorAll('.venue-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');

  // Panels
  document.querySelectorAll('.vd-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('vd-' + id);
  if (panel) {
    panel.classList.add('active');
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(16px)';
    requestAnimationFrame(() => {
      panel.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0)';
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   SPONSORSHIP TIER SELECTOR
═══════════════════════════════════════════════════════════ */
function selectSponsor(el, tier) {
  document.querySelectorAll('.s-tier').forEach(t => t.classList.remove('selected'));
  el.classList.add('selected');
}

/* ═══════════════════════════════════════════════════════════
   CTA PATH SELECTOR
═══════════════════════════════════════════════════════════ */
function selectPath(el, type) {
  document.querySelectorAll('.cta-path').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  presetInquiry(type);
  // Smooth scroll to form
  setTimeout(() => {
    const form = document.getElementById('formWrap');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}

/* ═══════════════════════════════════════════════════════════
   PRESET INQUIRY
═══════════════════════════════════════════════════════════ */
function presetInquiry(type) {
  const sel = document.getElementById('fType');
  if (!sel) return;

  const options = Array.from(sel.options);
  const match   = options.find(o =>
    o.value.toLowerCase().includes(type.toLowerCase()) ||
    type.toLowerCase().includes(o.value.toLowerCase().substring(0, 15))
  );
  if (match) {
    sel.value = match.value;
    // Highlight the field briefly
    sel.closest('.custom-select-wrap').style.transition = 'box-shadow 0.4s';
    sel.closest('.custom-select-wrap').style.boxShadow = '0 0 0 2px rgba(201,168,76,0.5)';
    setTimeout(() => {
      sel.closest('.custom-select-wrap').style.boxShadow = 'none';
    }, 1500);
  } else {
    // Find closest match
    const map = {
      'silver'  : 'Brand Activation / Sponsorship — Silver',
      'gold'    : 'Brand Activation / Sponsorship — Gold',
      'platinum': 'Brand Activation / Sponsorship — Platinum',
      'retail'  : 'Retail Leasing — Flagship',
      'leasing' : 'Retail Leasing — Flagship',
      'luxury'  : 'Retail Leasing — Luxury (The Avenue)',
      'avenue'  : 'Retail Leasing — Luxury (The Avenue)',
      'f&b'     : 'Retail Leasing — Food & Beverage',
      'food'    : 'Retail Leasing — Food & Beverage',
      'pop'     : 'Retail Leasing — Pop-Up / Short-Term',
      'pac'     : 'Event Booking — Dream Live PAC',
      'dream live': 'Event Booking — Dream Live PAC',
      'expo'    : 'Event Booking — Exposition Center',
      'rink'    : 'Event Booking — The Rink',
      'private' : 'Event Booking — Private Dining',
      'sponsor' : 'Brand Activation / Sponsorship — Gold',
      'event'   : 'Event Booking — Dream Live PAC',
    };

    const lower = type.toLowerCase();
    for (const [key, val] of Object.entries(map)) {
      if (lower.includes(key)) {
        const opt = options.find(o => o.value === val);
        if (opt) { sel.value = val; break; }
      }
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM SUBMIT
═══════════════════════════════════════════════════════════ */
function submitForm(e) {
  e.preventDefault();
  const btn       = document.getElementById('formSubmit');
  const submitTxt = document.getElementById('submitText');
  const submitIco = document.getElementById('submitIcon');
  const loader    = document.getElementById('submitLoader');

  if (!btn) return;

  // Loading state
  btn.disabled = true;
  submitTxt.textContent = 'Sending…';
  submitIco.style.display = 'none';
  loader.classList.add('show');

  // Simulate send
  setTimeout(() => {
    loader.classList.remove('show');
    submitIco.style.display = '';
    btn.disabled = false;

    // Show success
    document.getElementById('contactForm').style.display = 'none';
    const success = document.getElementById('formSuccess');
    success.classList.add('show');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1800);
}

function resetForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form)    { form.reset(); form.style.display = ''; }
  if (success) success.classList.remove('show');
  document.getElementById('submitText').textContent = 'Send Inquiry';
  document.getElementById('submitIcon').style.display = '';
}

/* ═══════════════════════════════════════════════════════════
   VIDEO REEL MODAL
═══════════════════════════════════════════════════════════ */
function openReel() {
  const frame = document.getElementById('reelFrame');
  if (frame) {
    frame.src = 'https://www.youtube.com/embed/YEKsgfP5-s8?autoplay=1&rel=0&modestbranding=1';
  }
  openModal('reelModal');
}

/* ═══════════════════════════════════════════════════════════
   MODAL OPEN / CLOSE
═══════════════════════════════════════════════════════════ */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.classList.add('no-scroll');

  // Close on overlay click
  modal.addEventListener('click', function handler(e) {
    if (e.target === modal) {
      closeModal(id);
      modal.removeEventListener('click', handler);
    }
  });
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.classList.remove('no-scroll');

  // Stop video if reel modal
  if (id === 'reelModal') {
    const frame = document.getElementById('reelFrame');
    if (frame) frame.src = '';
  }
}

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      closeModal(m.id);
    });
    closeMob();
  }
});

/* ═══════════════════════════════════════════════════════════
   DINING SLIDER — DRAG SCROLL + ARROWS
═══════════════════════════════════════════════════════════ */
(function initDiningSlider() {
  const slider = document.getElementById('diningSlider');
  const prev   = document.getElementById('dPrev');
  const next   = document.getElementById('dNext');
  if (!slider) return;

  // Arrow buttons
  const SCROLL_AMOUNT = 300;
  if (prev) prev.addEventListener('click', () => {
    slider.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  });
  if (next) next.addEventListener('click', () => {
    slider.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  });

  // Mouse drag scroll
  slider.addEventListener('mousedown', e => {
    isDragging = true;
    dragStart  = e.pageX - slider.offsetLeft;
    scrollStart = slider.scrollLeft;
    slider.classList.add('dragging');
  });
  slider.addEventListener('mouseleave', () => {
    isDragging = false;
    slider.classList.remove('dragging');
  });
  slider.addEventListener('mouseup', () => {
    isDragging = false;
    slider.classList.remove('dragging');
  });
  slider.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const x    = e.pageX - slider.offsetLeft;
    const walk = (x - dragStart) * 1.5;
    slider.scrollLeft = scrollStart - walk;
  });

  // Touch support
  let touchStartX = 0;
  let touchScrollStart = 0;
  slider.addEventListener('touchstart', e => {
    touchStartX    = e.touches[0].pageX;
    touchScrollStart = slider.scrollLeft;
  }, { passive: true });
  slider.addEventListener('touchmove', e => {
    const dx = touchStartX - e.touches[0].pageX;
    slider.scrollLeft = touchScrollStart + dx;
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   PARALLAX SCROLL EFFECTS
═══════════════════════════════════════════════════════════ */
(function initParallax() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Hero content parallax
    const heroContent = document.getElementById('heroContent');
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
    }

    // Hero pills parallax
    const heroPills = document.getElementById('heroPills');
    if (heroPills) {
      heroPills.style.transform = `translateX(-50%) translateY(${scrollY * 0.12}px)`;
    }

    // Lux ambient
    const luxAmb = document.querySelector('.lux-ambient');
    if (luxAmb) {
      const luxSection = document.getElementById('luxury');
      if (luxSection) {
        const rect = luxSection.getBoundingClientRect();
        const prog = -rect.top / window.innerHeight;
        luxAmb.style.transform = `translateY(${prog * 30}px)`;
      }
    }
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   MAGNETIC HOVER for lux pills
═══════════════════════════════════════════════════════════ */
(function initMagnetic() {
  document.querySelectorAll('[data-hover="magnetic"]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const dx   = e.clientX - (rect.left + rect.width  / 2);
      const dy   = e.clientY - (rect.top  + rect.height / 2);
      el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    });
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s ease';
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   FORM INPUT ANIMATIONS
═══════════════════════════════════════════════════════════ */
(function initFormAnimations() {
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.querySelector('.form-line')?.classList.add('active');
    });
    input.addEventListener('blur', () => {
      // Line stays on if value exists
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   CELEBRITY WALL — Random opacity / tilt animation
═══════════════════════════════════════════════════════════ */
(function initCelebrityWall() {
  const names = document.querySelectorAll('.cw-names span');
  names.forEach((span, i) => {
    span.style.animationDelay = `${i * 0.15}s`;
    const tilt = (Math.random() - 0.5) * 4;
    span.style.transform = `rotate(${tilt}deg)`;
  });

  // Subtle random pulse
  setInterval(() => {
    const idx = Math.floor(Math.random() * names.length);
    names[idx].style.color = 'var(--gold)';
    names[idx].style.borderColor = 'rgba(201,168,76,0.4)';
    setTimeout(() => {
      names[idx].style.color = '';
      names[idx].style.borderColor = '';
    }, 800);
  }, 1200);
})();

/* ═══════════════════════════════════════════════════════════
   PAST PARTNER LOGOS — Hover shimmer
═══════════════════════════════════════════════════════════ */
(function initPartnerLogos() {
  document.querySelectorAll('.pp-logo').forEach(logo => {
    logo.addEventListener('mouseenter', () => {
      logo.style.background = 'linear-gradient(135deg, rgba(201,168,76,0.06), rgba(201,168,76,0.02))';
    });
    logo.addEventListener('mouseleave', () => {
      logo.style.background = '';
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   NAV SMOOTH SCROLL + OFFSET
═══════════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const navH   = 72;
        const top    = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   SECTION ENTRANCE CLASSES — add .in-view for extra effects
═══════════════════════════════════════════════════════════ */
(function initSectionObserver() {
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.section').forEach(s => sectionObs.observe(s));
})();

/* ═══════════════════════════════════════════════════════════
   CALCULATOR INIT
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  updateCalc();

  // Keyboard shortcut: Escape closes modals
  // (handled above)

  // Resize debounce for canvases
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Reinit canvases on resize
      const hc = document.getElementById('heroCanvas');
      if (hc) { hc.width = hc.offsetWidth; hc.height = hc.offsetHeight; }
    }, 200);
  }, { passive: true });
});

/* ═══════════════════════════════════════════════════════════
   SECTION TRANSITION — text clip reveal
═══════════════════════════════════════════════════════════ */
(function initTextReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const title = entry.target.querySelector('.section-title');
        if (title && !title.classList.contains('text-revealed')) {
          title.classList.add('text-revealed');
          title.style.transition = 'opacity 1s ease, transform 1s ease';
          title.style.opacity = '1';
          title.style.transform = 'none';
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section-head').forEach(h => {
    const title = h.querySelector('.section-title');
    if (title) {
      title.style.opacity = '0';
      title.style.transform = 'translateY(20px)';
    }
    obs.observe(h);
  });
})();

/* ═══════════════════════════════════════════════════════════
   SPONSORSHIP TIER HOVER GLOW EFFECT
═══════════════════════════════════════════════════════════ */
(function initTierGlow() {
  document.querySelectorAll('.s-tier').forEach(tier => {
    tier.addEventListener('mousemove', e => {
      const rect = tier.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      tier.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(201,168,76,0.06) 0%, transparent 60%), var(--dark2)`;
    });
    tier.addEventListener('mouseleave', () => {
      tier.style.background = '';
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   VENUE CARD HOVER SOUND EFFECT (visual only — shimmer)
═══════════════════════════════════════════════════════════ */
(function initVenueShimmer() {
  document.querySelectorAll('.venue-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.3s ease';
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   SCROLL-BASED NAV HIGHLIGHT (refined)
═══════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  updateActiveNav();
  updateSideDots();
});
