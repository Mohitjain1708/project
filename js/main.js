/* ============================================================
   AMERICAN DREAM — SALES DECK · main.js  v4
   Matches actual index.html IDs / classes / inline handlers exactly
   Enhanced: parallax, typewriter, toast, magnetic btns, tilt, trails
   ============================================================ */

'use strict';

/* ── ELEMENT CACHE ──────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ══════════════════════════════════════════════════════════
   PRELOADER
══════════════════════════════════════════════════════════ */
(function initPreloader() {
  const loader = $('preloader');
  const ring   = $('preRing');
  const numEl  = $('preNum');
  if (!loader) return;

  const circumference = 2 * Math.PI * 42; // r=42
  ring.style.strokeDasharray  = circumference;
  ring.style.strokeDashoffset = circumference;

  document.body.style.overflow = 'hidden';

  let pct = 0;
  const tick = setInterval(() => {
    pct = Math.min(pct + Math.random() * 12 + 5, 100);
    ring.style.strokeDashoffset = circumference * (1 - pct / 100);
    numEl.textContent = Math.floor(pct) + '%';
    if (pct >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add('done');
        document.body.style.overflow = '';
        setTimeout(() => loader.remove(), 750);
        kickoffHeroAnimations();
      }, 300);
    }
  }, 55);
})();

/* ══════════════════════════════════════════════════════════
   HERO ENTRY ANIMATIONS
══════════════════════════════════════════════════════════ */
function kickoffHeroAnimations() {
  const eye   = $('hEye');
  const hDesc = $('hDesc');
  const hBtns = $('hBtns');

  if (eye)   requestAnimationFrame(() => eye.classList.add('visible'));

  $$('.h1w').forEach((w, i) =>
    setTimeout(() => w.classList.add('visible'), i * 160 + 80));

  if (hDesc) setTimeout(() => {
    hDesc.classList.add('visible');
    startTypewriter(hDesc, hDesc.textContent);
  }, 560);

  if (hBtns) setTimeout(() => hBtns.classList.add('visible'), 780);

  $$('.hstat').forEach(el => {
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), 1050 + delay);
  });

  $$('.hstat-n[data-count]').forEach(el => {
    const delay = parseInt(el.closest('.hstat')?.dataset.delay || 0);
    setTimeout(() => {
      animateCounter(el, 0,
        parseFloat(el.dataset.count),
        1600,
        el.dataset.sfx || '',
        parseInt(el.dataset.dec || 0));
    }, 1200 + delay);
  });
}

/* ══════════════════════════════════════════════════════════
   TYPEWRITER — hero description
══════════════════════════════════════════════════════════ */
function startTypewriter(el, text) {
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 28);
}

/* ══════════════════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════════════════ */
(function initCursor() {
  const dot    = $('curDot');
  const circle = $('curCircle');
  const text   = $('curText');
  if (!dot || !circle || !text) return;
  if (window.matchMedia('(hover:none)').matches) return;

  let mx = -300, my = -300, cx = -300, cy = -300;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    text.style.left = mx + 'px';
    text.style.top  = my + 'px';
  });

  (function loop() {
    cx += (mx - cx) * 0.11;
    cy += (my - cy) * 0.11;
    circle.style.left = cx + 'px';
    circle.style.top  = cy + 'px';
    requestAnimationFrame(loop);
  })();

  // Click ripple
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
    setTimeout(() => document.body.classList.remove('cursor-click'), 180);
  });

  // Interactive targets
  const HOVER_SEL = 'a,button,.fcard,.maison,.am-card,.tier,.path,.vtab,.dc,.tf,.tc,.pr,.hstat,.bento,[onclick],.darr,.m-close,.lux-pill,.cw-grid span,.br,.ft-social a,.flip-cta';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(HOVER_SEL)) {
      document.body.classList.add('cursor-hover');
      const label = e.target.closest('[data-cur]')?.dataset.cur || '';
      text.textContent = label || '✦';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(HOVER_SEL)) document.body.classList.remove('cursor-hover');
  });
})();

/* ══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════════════════════ */
(function initScrollBar() {
  const bar = $('scrollBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════════════
   NAV: scrolled + active + hamburger
══════════════════════════════════════════════════════════ */
(function initNav() {
  const nav    = $('mainNav');
  const ham    = $('ham');
  const drawer = $('drawer');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveDot();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (ham && drawer) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      drawer.classList.toggle('open');
    });
  }

  document.addEventListener('click', e => {
    if (!drawer || !drawer.classList.contains('open')) return;
    if (!drawer.contains(e.target) && !ham?.contains(e.target)) closeDrawer();
  });
})();

function closeDrawer() {
  $('ham')?.classList.remove('open');
  $('drawer')?.classList.remove('open');
}
window.closeDrawer = closeDrawer;

/* ══════════════════════════════════════════════════════════
   SIDE DOTS + NAV ACTIVE
══════════════════════════════════════════════════════════ */
function updateActiveDot() {
  const sections = $$('section[id], footer[id]');
  const trigger  = window.scrollY + window.innerHeight * 0.38;
  let activeId   = null;

  sections.forEach(s => { if (s.offsetTop <= trigger) activeId = s.id; });

  $$('.sd').forEach(d =>
    d.classList.toggle('active', d.getAttribute('href') === '#' + activeId));
  $$('.nl').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + activeId));
}

/* ══════════════════════════════════════════════════════════
   INTERSECTION OBSERVER — scroll reveals + counters + rings
══════════════════════════════════════════════════════════ */
(function initReveal() {
  // Generic reveal
  const rvIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');

      // Counters inside revealed blocks
      entry.target.querySelectorAll('.counter[data-target]:not([data-animated])').forEach(el => {
        el.dataset.animated = '1';
        animateCounter(el, 0,
          parseFloat(el.dataset.target),
          1700, el.dataset.sfx || '',
          parseInt(el.dataset.dec || 0));
      });
      rvIO.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  $$('.rv').forEach(el => rvIO.observe(el));

  // Bar reveals
  const barIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      barIO.unobserve(entry.target);
    });
  }, { threshold: 0.28 });

  $$('.rv-bar').forEach(el => barIO.observe(el));

  // Ring wraps
  const ringIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.ring-arc').forEach(arc => animateRing(arc));
      entry.target.querySelectorAll('.counter[data-target]:not([data-animated])').forEach(el => {
        el.dataset.animated = '1';
        animateCounter(el, 0,
          parseFloat(el.dataset.target),
          2000, el.dataset.sfx || '',
          parseInt(el.dataset.dec || 0));
      });
      ringIO.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  $$('.ring-wrap').forEach(el => ringIO.observe(el));
})();

/* ══════════════════════════════════════════════════════════
   COUNTER ANIMATION  (easeOutExpo)
══════════════════════════════════════════════════════════ */
function animateCounter(el, from, to, dur, sfx, dec) {
  const start = performance.now();
  const step  = now => {
    const t   = Math.min((now - start) / dur, 1);
    const val = from + (to - from) * easeOutExpo(t);
    el.textContent = (dec > 0 ? val.toFixed(dec) : Math.floor(val)) + sfx;
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = (dec > 0 ? to.toFixed(dec) : to) + sfx;
  };
  requestAnimationFrame(step);
}
function easeOutExpo(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }

/* ══════════════════════════════════════════════════════════
   SVG RING ANIMATION
══════════════════════════════════════════════════════════ */
function animateRing(arc) {
  const total  = parseFloat(arc.getAttribute('stroke-dasharray') || 314);
  const PCTS   = { ra1: 0.80, ra2: 0.60, ra3: 0.90, ra4: 1.00 };
  const pct    = PCTS[arc.id] ?? 0.75;
  const target = total * (1 - pct);
  arc.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1)';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    arc.style.strokeDashoffset = target;
  }));
}

/* ══════════════════════════════════════════════════════════
   HERO CANVAS — gold particle network
══════════════════════════════════════════════════════════ */
(function initHeroCanvas() {
  const canvas = $('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const N = Math.min(100, Math.floor(window.innerWidth / 14));
  const particles = Array.from({ length: N }, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - .5) * .22,
    vy: (Math.random() - .5) * .22,
    r:  Math.random() * 1.4 + .3,
    a:  Math.random() * .55 + .1,
  }));

  let mouse = { x: -9999, y: -9999 };
  canvas.parentElement?.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });

  (function draw() {
    if (!canvas.isConnected) return;
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      const px = p.x * W, py = p.y * H;
      // Gentle repulsion from cursor
      const dx = px - mouse.x, dy = py - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 6400) { // 80px²
        const d = Math.sqrt(d2);
        p.vx += (dx / d) * .018;
        p.vy += (dy / d) * .018;
      }
      p.vx = Math.max(-0.4, Math.min(0.4, p.vx));
      p.vy = Math.max(-0.4, Math.min(0.4, p.vy));
      p.x  = ((p.x + p.vx / W) + 1) % 1;
      p.y  = ((p.y + p.vy / H) + 1) % 1;

      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.a})`;
      ctx.fill();
    });

    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      const pi = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const pj = particles[j];
        const dx = (pi.x - pj.x) * W;
        const dy = (pi.y - pj.y) * H;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 95) {
          ctx.beginPath();
          ctx.moveTo(pi.x * W, pi.y * H);
          ctx.lineTo(pj.x * W, pj.y * H);
          ctx.strokeStyle = `rgba(201,168,76,${.09 * (1 - d / 95)})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  })();
})();

/* ══════════════════════════════════════════════════════════
   ENTERTAINMENT CANVAS — starfield + shooting stars
══════════════════════════════════════════════════════════ */
(function initEntCanvas() {
  const canvas = $('entCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const N = Math.min(180, Math.floor(window.innerWidth / 8));
  const stars = Array.from({ length: N }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.1 + .15,
    a: Math.random() * .45 + .08,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * .025 + .006,
  }));

  let shootings = [];
  setInterval(() => {
    shootings.push({
      x: Math.random() * (W || 1000),
      y: Math.random() * ((H || 600) * .45),
      len: Math.random() * 90 + 50,
      spd: Math.random() * 9 + 4,
      ang: Math.PI / 6 + (Math.random() - .5) * .3,
      life: 1,
    });
  }, 2800);

  (function draw() {
    if (!canvas.isConnected) return;
    ctx.clearRect(0, 0, W, H);

    stars.forEach(s => {
      s.phase += s.speed;
      const alpha = s.a * (.5 + .5 * Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${alpha})`;
      ctx.fill();
    });

    shootings = shootings.filter(s => s.life > 0);
    shootings.forEach(s => {
      s.x    += Math.cos(s.ang) * s.spd;
      s.y    += Math.sin(s.ang) * s.spd;
      s.life -= .022;
      const grad = ctx.createLinearGradient(
        s.x - Math.cos(s.ang) * s.len, s.y - Math.sin(s.ang) * s.len,
        s.x, s.y);
      grad.addColorStop(0, `rgba(201,168,76,0)`);
      grad.addColorStop(1, `rgba(201,168,76,${(s.life * .85).toFixed(2)})`);
      ctx.beginPath();
      ctx.moveTo(s.x - Math.cos(s.ang) * s.len, s.y - Math.sin(s.ang) * s.len);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1.8;
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  })();
})();

/* ══════════════════════════════════════════════════════════
   RADAR CANVAS
══════════════════════════════════════════════════════════ */
(function initRadarCanvas() {
  const canvas = $('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, sweepAngle = 0;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const POINTS = [
    { dist: .28, angle: .35 },
    { dist: .38, angle: 1.10 },
    { dist: .56, angle: 1.82 },
    { dist: .16, angle: 3.50 },
    { dist: .46, angle: 4.22 },
  ];

  (function draw() {
    if (!canvas.isConnected) return;
    W = canvas.width; H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const maxR = Math.min(cx, cy) * .90;
    ctx.clearRect(0, 0, W, H);

    // Background
    const bgG = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    bgG.addColorStop(0, 'rgba(14,10,3,.95)');
    bgG.addColorStop(1, 'rgba(4,4,4,.98)');
    ctx.beginPath(); ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
    ctx.fillStyle = bgG; ctx.fill();

    // Rings
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * i / 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201,168,76,${.05 + i * .012})`;
      ctx.lineWidth = 1; ctx.stroke();
    }

    // Crosshairs
    ctx.strokeStyle = 'rgba(201,168,76,.045)'; ctx.lineWidth = 1;
    [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4].forEach(a => {
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
      ctx.lineTo(cx - Math.cos(a) * maxR, cy - Math.sin(a) * maxR);
      ctx.stroke();
    });

    // Sweep wedge
    sweepAngle = (sweepAngle + .007) % (Math.PI * 2);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(sweepAngle);
    const wGrad = ctx.createLinearGradient(0, 0, maxR, 0);
    wGrad.addColorStop(0,   'rgba(201,168,76,.22)');
    wGrad.addColorStop(.6,  'rgba(201,168,76,.05)');
    wGrad.addColorStop(1,   'rgba(201,168,76,0)');
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.arc(0, 0, maxR, -.45, 0, false); ctx.closePath();
    ctx.fillStyle = wGrad; ctx.fill();
    ctx.restore();

    // Points
    const t = Date.now() * .002;
    POINTS.forEach((pt, i) => {
      const r  = maxR * pt.dist;
      const px = cx + Math.cos(pt.angle) * r;
      const py = cy + Math.sin(pt.angle) * r;
      const pulse = (.5 + .5 * Math.sin(t + i * 1.3)) * .5 + .5;

      // Halo
      const halo = ctx.createRadialGradient(px, py, 0, px, py, 14);
      halo.addColorStop(0,   `rgba(201,168,76,${.25 * pulse})`);
      halo.addColorStop(1,   'rgba(201,168,76,0)');
      ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fillStyle = halo; ctx.fill();

      // Dot
      ctx.beginPath(); ctx.arc(px, py, 2.5 + pulse * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${.7 + .3 * pulse})`; ctx.fill();
    });

    // Center
    const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10);
    cGrad.addColorStop(0, 'rgba(201,168,76,.95)');
    cGrad.addColorStop(1, 'rgba(201,168,76,0)');
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = cGrad; ctx.fill();

    requestAnimationFrame(draw);
  })();
})();

/* ══════════════════════════════════════════════════════════
   PARALLAX — sections scroll parallax
══════════════════════════════════════════════════════════ */
(function initParallax() {
  const targets = [
    { el: $('heroCanvas'),   speed: .15 },
    { el: document.querySelector('.lux-aura'), speed: .08 },
    { el: document.querySelector('.contact-glow'), speed: .06 },
  ];
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    targets.forEach(t => {
      if (!t.el) return;
      t.el.style.transform = `translateY(${y * t.speed}px)`;
    });
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════════════
   MAGNETIC BUTTONS
══════════════════════════════════════════════════════════ */
(function initMagneticButtons() {
  if (window.matchMedia('(hover:none)').matches) return;
  $$('.btn-g, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * .2;
      const dy = (e.clientY - r.top  - r.height / 2) * .2;
      btn.style.transform = `translate(${dx}px,${dy}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ══════════════════════════════════════════════════════════
   BENTO / CARD TILT (3-D perspective)
══════════════════════════════════════════════════════════ */
(function initCardTilt() {
  if (window.matchMedia('(hover:none)').matches) return;
  const TILT_SEL = '.bento,.am-card,.tier,.dc,.path';
  $$(TILT_SEL).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - .5;
      const y  = (e.clientY - r.top)  / r.height - .5;
      card.style.transform =
        `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;

      // Spotlight effect
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ══════════════════════════════════════════════════════════
   LUX PILL MAGNETIC HOVER
══════════════════════════════════════════════════════════ */
(function initLuxPills() {
  if (window.matchMedia('(hover:none)').matches) return;
  $$('.lux-pill').forEach(pill => {
    pill.addEventListener('mousemove', e => {
      const r  = pill.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * .3;
      const dy = (e.clientY - r.top  - r.height / 2) * .3;
      pill.style.transform = `translate(${dx}px,${dy}px) scale(1.08)`;
    });
    pill.addEventListener('mouseleave', () => { pill.style.transform = ''; });
  });
})();

/* ══════════════════════════════════════════════════════════
   CELEBRITY GRID STAGGER ENTRANCE
══════════════════════════════════════════════════════════ */
(function initCelebGrid() {
  const grid = $('celebGrid');
  if (!grid) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      grid.querySelectorAll('span').forEach((s, i) => {
        s.style.opacity   = '0';
        s.style.transform = 'translateY(14px)';
        s.style.transition= `opacity .45s ${i*.06}s ease, transform .45s ${i*.06}s ease`;
        requestAnimationFrame(() => {
          s.style.opacity   = '1';
          s.style.transform = 'translateY(0)';
        });
      });
      io.unobserve(entry.target);
    });
  }, { threshold: .25 });
  io.observe(grid);
})();

/* ══════════════════════════════════════════════════════════
   FLIP CARDS
══════════════════════════════════════════════════════════ */
function flipCard(el) { el.classList.toggle('flipped'); }
window.flipCard = flipCard;

/* ══════════════════════════════════════════════════════════
   TENANT FILTER
══════════════════════════════════════════════════════════ */
function filterTenants(cat, btn) {
  $$('.tf').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  $$('.tc').forEach(chip => {
    if (cat === 'all') {
      chip.classList.remove('hidden');
      chip.style.animation = '';
    } else {
      const show = chip.dataset.cat === cat || chip.classList.contains('tc-more');
      if (show) {
        chip.classList.remove('hidden');
        chip.style.animation = 'tcPop .3s ease';
      } else {
        chip.classList.add('hidden');
      }
    }
  });
}
window.filterTenants = filterTenants;

/* ══════════════════════════════════════════════════════════
   ROI CALCULATOR
══════════════════════════════════════════════════════════ */
const calcState = { size: 2000, tierMult: 1.0, catMult: 1.3 };

function calcUpdate() {
  const slider = $('szSlider');
  if (!slider) return;
  calcState.size = parseInt(slider.value) || 2000;

  const label = $('szLabel');
  if (label) label.textContent = Number(calcState.size).toLocaleString() + ' sq ft';

  const fill = $('szFill');
  if (fill) {
    const min = parseInt(slider.min), max = parseInt(slider.max);
    fill.style.width = ((calcState.size - min) / (max - min) * 100) + '%';
  }
  updateCalcResults();
}
window.calcUpdate = calcUpdate;

function setTier(btn, tier) {
  $$('#tierRow .pr').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  calcState.tierMult = { prime: 1.0, standard: .74, popup: .44 }[tier] ?? 1.0;
  updateCalcResults();
}
window.setTier = setTier;

function setCat(btn, mult) {
  $$('#catRow .pr').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  calcState.catMult = mult;
  updateCalcResults();
}
window.setCat = setCat;

function updateCalcResults() {
  const visitors = Math.round(calcState.size * 1180 * calcState.tierMult / 1000) * 1000;
  const revenue  = calcState.size * calcState.catMult * .0021 * visitors / 1000;
  const roi      = revenue / (calcState.size * .075);

  animateValue('crVisitors', visitors >= 1e6
    ? (visitors / 1e6).toFixed(1) + 'M'
    : (visitors / 1000).toFixed(0) + 'K');
  animateValue('crRevenue', revenue >= 1000
    ? '$' + (revenue * 1000 / 1e6).toFixed(1) + 'M'
    : '$' + (revenue * 1000 / 1000).toFixed(0) + 'K');
  animateValue('crROI', roi.toFixed(1) + '×');

  const vPct = Math.min(visitors / 40e6 * 100, 100);
  const rPct = Math.min(revenue / 50 * 100, 100);
  const oPct = Math.min(roi / 8 * 100, 100);

  setBar('crVbar', vPct);
  setBar('crRbar', rPct);
  setBar('crObar', oPct);
}

function animateValue(id, newVal) {
  const el = $(id);
  if (!el || el.textContent === newVal) return;
  el.style.transform = 'scale(1.1)'; el.style.opacity = '.7';
  setTimeout(() => {
    el.textContent = newVal;
    el.style.transform = ''; el.style.opacity = '';
  }, 120);
}
function setBar(id, pct) {
  const el = $(id);
  if (el) el.style.width = pct + '%';
}

(function initCalc() {
  const slider = $('szSlider');
  if (!slider) return;
  const fill = $('szFill');
  if (fill) {
    const min = parseInt(slider.min), max = parseInt(slider.max);
    fill.style.width = ((parseInt(slider.value) - min) / (max - min) * 100) + '%';
  }
  updateCalcResults();
})();

/* ══════════════════════════════════════════════════════════
   MAISON ACCORDION
══════════════════════════════════════════════════════════ */
function toggleMaison(el) {
  const wasOpen = el.classList.contains('expanded');
  $$('.maison').forEach(m => m.classList.remove('expanded'));
  if (!wasOpen) el.classList.add('expanded');
}
window.toggleMaison = toggleMaison;

/* ══════════════════════════════════════════════════════════
   LUXURY MODAL
══════════════════════════════════════════════════════════ */
function openLuxModal() { openModal('luxModal'); }
window.openLuxModal = openLuxModal;

/* ══════════════════════════════════════════════════════════
   DINING SLIDER
══════════════════════════════════════════════════════════ */
(function initDiningSlider() {
  const slider = $('dslider');
  const prev   = $('dprev');
  const next   = $('dnext');
  if (!slider) return;

  const STEP = 304; // card 284 + gap 20

  const updateArrows = () => {
    if (prev) prev.disabled = slider.scrollLeft < 8;
    if (next) next.disabled = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 8;
  };
  slider.addEventListener('scroll', updateArrows, { passive: true });

  // Smooth programmatic scroll
  const smoothScroll = dir => {
    slider.scrollBy({ left: dir * STEP * 2, behavior: 'smooth' });
  };
  if (prev) prev.addEventListener('click', () => smoothScroll(-1));
  if (next) next.addEventListener('click', () => smoothScroll(1));

  // Drag-to-scroll
  let isDown = false, startX, startScroll;
  slider.addEventListener('pointerdown', e => {
    isDown = true; startX = e.clientX; startScroll = slider.scrollLeft;
    slider.classList.add('dragging'); slider.setPointerCapture(e.pointerId);
  });
  slider.addEventListener('pointermove', e => {
    if (!isDown) return;
    slider.scrollLeft = startScroll - (e.clientX - startX);
  });
  slider.addEventListener('pointerup', () => {
    isDown = false; slider.classList.remove('dragging');
  });

  updateArrows();
})();

function dSlide(dir) {
  const s = $('dslider');
  if (s) s.scrollBy({ left: dir * 600, behavior: 'smooth' });
}
window.dSlide = dSlide;

/* ══════════════════════════════════════════════════════════
   VENUE SWITCHER
══════════════════════════════════════════════════════════ */
function switchVenue(id, btn) {
  $$('.vtab').forEach(t => t.classList.remove('active'));
  $$('.vp').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const panel = $('vp-' + id);
  if (panel) panel.classList.add('active');
}
window.switchVenue = switchVenue;

/* ══════════════════════════════════════════════════════════
   SPONSORSHIP TIER
══════════════════════════════════════════════════════════ */
function selectTier(el, name) {
  $$('.tier').forEach(t => t.classList.remove('selected'));
  el.classList.add('selected');
  presetInquiry(name + ' Sponsorship');
  showToast('✦', '<em>' + name + '</em> tier selected — inquire below');
}
window.selectTier = selectTier;

/* ══════════════════════════════════════════════════════════
   CONTACT PATH SELECT
══════════════════════════════════════════════════════════ */
function selectPath(el, inquiry) {
  $$('.path').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  presetInquiry(inquiry);
  const form = $('formWrap');
  if (form) {
    setTimeout(() => form.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  }
}
window.selectPath = selectPath;

/* ══════════════════════════════════════════════════════════
   PRESET INQUIRY
══════════════════════════════════════════════════════════ */
function presetInquiry(text) {
  const sel = $('fType');
  if (sel) {
    const keyword = text.toLowerCase().split(' ')[0];
    const match   = Array.from(sel.options).find(o =>
      o.text.toLowerCase().includes(keyword));
    if (match) sel.value = match.value || match.text;
  }
  const msg = $('fMsg');
  if (msg && !msg.value.trim()) {
    msg.value = 'Re: ' + text + '\n\nI would like to learn more about this opportunity at American Dream.';
  }
}
window.presetInquiry = presetInquiry;

/* ══════════════════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════════════════ */
function submitForm(e) {
  e.preventDefault();
  const btn  = $('formSub');
  const form = $('contactForm');
  const ok   = $('formOK');
  if (!btn) return;

  btn.classList.add('loading');
  btn.disabled = true;

  setTimeout(() => {
    btn.classList.remove('loading');
    if (form) form.style.display = 'none';
    if (ok)   ok.classList.add('visible');
    showToast('✦', 'Inquiry sent — <em>we\'ll be in touch within 24 hours</em>');
  }, 1900);
}
window.submitForm = submitForm;

function resetForm() {
  const form = $('contactForm');
  const ok   = $('formOK');
  const btn  = $('formSub');
  if (form) { form.reset(); form.style.display = ''; }
  if (ok)   ok.classList.remove('visible');
  if (btn)  { btn.disabled = false; btn.classList.remove('loading'); }
}
window.resetForm = resetForm;

/* ══════════════════════════════════════════════════════════
   VIDEO REEL
══════════════════════════════════════════════════════════ */
function openReel() {
  const frame = $('reelFrame');
  if (frame) frame.src = 'https://www.youtube.com/embed/YEKsgfP5-s8?autoplay=1&rel=0&modestbranding=1';
  openModal('reelModal');
}
window.openReel = openReel;

/* ══════════════════════════════════════════════════════════
   ATTRACTION MODALS
══════════════════════════════════════════════════════════ */
const ATTR_DATA = {
  nick: {
    ico: '🎢', tag: 'INDOOR THEME PARK · WESTERN HEMISPHERE\'S LARGEST',
    name: 'Nickelodeon Universe',
    desc: 'The Western Hemisphere\'s largest indoor theme park, spanning 8 themed acres inside American Dream. 35+ rides and attractions, including the tallest indoor roller coaster in North America. Open 365 days a year — fully weather-proof, climate-controlled, and powered by the most recognizable youth entertainment brand on Earth.',
    stats: [{ val: '35+', lbl: 'Rides' },{ val: '8', lbl: 'Themed Acres' },{ val: '365', lbl: 'Days/Year' },{ val: '#1', lbl: 'NA Indoor Coaster' }],
  },
  water: {
    ico: '🌊', tag: 'INDOOR WATER PARK · YEAR-ROUND',
    name: 'DreamWorks Water Park',
    desc: 'North America\'s largest indoor water park, featuring 40 world-class slides and attractions. Fully climate-controlled at 84°F year-round — eliminating the seasonal limitation that defines every outdoor competitor.',
    stats: [{ val: '40', lbl: 'Water Slides' },{ val: '84°F', lbl: 'Year-Round' },{ val: 'NA\'s #1', lbl: 'Indoor Water Park' },{ val: 'DreamWorks', lbl: 'IP' }],
  },
  snow: {
    ico: '⛷️', tag: 'INDOOR SKI RESORT · REAL SNOW',
    name: 'Big SNOW',
    desc: 'America\'s first and only indoor real-snow ski and snowboard slope. Six slopes for all levels — with real snow, ski school, full rental packages. The only place in the NY metro where you can ski in July.',
    stats: [{ val: '6', lbl: 'Slopes' },{ val: 'Real', lbl: 'Snow' },{ val: '100%', lbl: 'Climate Ctrl' },{ val: 'First', lbl: 'In USA' }],
  },
  wheel: {
    ico: '🎡', tag: 'OBSERVATION WHEEL · 300 FT',
    name: 'The Wheel',
    desc: 'A 300-foot observation wheel with panoramic NYC skyline views. Each air-conditioned gondola carries up to 8 passengers for a 20-minute journey. Private gondola buyouts available for proposals, celebrations, and brand activations.',
    stats: [{ val: '300 ft', lbl: 'Height' },{ val: 'NYC', lbl: 'Skyline Views' },{ val: '8', lbl: 'Guests/Gondola' },{ val: 'Private', lbl: 'Buyout' }],
  },
  ice: {
    ico: '🏒', tag: 'NHL ICE RINK · EVENT FLOOR',
    name: 'The Rink',
    desc: 'NHL-regulation ice rink at the heart of American Dream, converting to a 5,000-capacity concert and event floor. Every event benefits from a built-in daily audience walking past before doors even open.',
    stats: [{ val: 'NHL', lbl: 'Regulation' },{ val: '5,000', lbl: 'Standing Cap.' },{ val: 'Converts', lbl: 'Event Floor' },{ val: '40M', lbl: 'Annual Traffic' }],
  },
};

function openAttr(id) {
  const d = ATTR_DATA[id];
  if (!d) return;
  const body = $('attrBody');
  if (!body) return;
  body.innerHTML = `
    <div class="attr-detail-grid">
      <div class="attr-ico-lg">${d.ico}</div>
      <div>
        <div class="attr-info-tag">${d.tag}</div>
        <div class="attr-info-title">${d.name}</div>
        <div class="attr-info-desc">${d.desc}</div>
        <div class="attr-stats">
          ${d.stats.map(s => `<div class="attr-stat"><strong>${s.val}</strong><span>${s.lbl}</span></div>`).join('')}
        </div>
        <a href="#contact" class="btn-g" onclick="closeModal('attrModal');presetInquiry('${d.name}')">
          Discuss Partnership <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>`;
  openModal('attrModal');
}
window.openAttr = openAttr;

/* ══════════════════════════════════════════════════════════
   MODAL SYSTEM
══════════════════════════════════════════════════════════ */
function openModal(id) {
  const m = $(id);
  if (!m) return;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const m = $(id);
  if (!m) return;
  m.classList.remove('open');
  document.body.style.overflow = '';
  if (id === 'reelModal') {
    const f = $('reelFrame'); if (f) f.src = '';
  }
}
window.openModal  = openModal;
window.closeModal = closeModal;

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') $$('.modal.open').forEach(m => closeModal(m.id));
});

/* ══════════════════════════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════════════════════════ */
let toastTimer = null;
function showToast(ico, msg) {
  // Ensure single toast
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-ico">${ico}</span><span>${msg}</span>`;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3400);
}
window.showToast = showToast;

/* ══════════════════════════════════════════════════════════
   SMOOTH SCROLL (with nav offset)
══════════════════════════════════════════════════════════ */
window.scrollTo = id => {
  if (typeof id !== 'string') { window.scroll(id); return; }
  const el = document.getElementById(id);
  if (!el) return;
  const offset = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: offset, behavior: 'smooth' });
};

/* ══════════════════════════════════════════════════════════
   BRAND LOGOS hover
══════════════════════════════════════════════════════════ */
(function initBrandLogos() {
  $$('.br').forEach(b => {
    b.addEventListener('mouseenter', () => b.style.boxShadow = '0 4px 20px rgba(201,168,76,0.12)');
    b.addEventListener('mouseleave', () => b.style.boxShadow = '');
  });
})();

/* ══════════════════════════════════════════════════════════
   KEYBOARD NAV (arrow keys between sections)
══════════════════════════════════════════════════════════ */
(function initKeyNav() {
  const IDS = ['hero','property','retail','luxury','dining','ent','events','partners','contact'];
  document.addEventListener('keydown', e => {
    if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const idx = IDS.findIndex(id => {
        const el = document.getElementById(id);
        return el && el.getBoundingClientRect().top > -window.innerHeight * .3;
      });
      const next = IDS[Math.min(idx, IDS.length - 1)];
      document.getElementById(next)?.scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const idx = [...IDS].reverse().findIndex(id => {
        const el = document.getElementById(id);
        return el && el.getBoundingClientRect().top < -60;
      });
      if (idx >= 0) document.getElementById(IDS[IDS.length - 1 - idx])?.scrollIntoView({ behavior: 'smooth' });
    }
  });
})();

/* ══════════════════════════════════════════════════════════
   INITIAL VIEWPORT REVEAL PASS
══════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    $$('.rv').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * .92)
        el.classList.add('visible');
    });
  }, 80);
});

/* ── END ───────────────────────────────────────────────── */
