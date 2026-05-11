/* ============================================================
   AMERICAN DREAM — SALES DECK · main.js
   Matches actual index.html IDs / classes / inline handlers exactly
   ============================================================ */

'use strict';

/* ── ELEMENT CACHE ──────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ── PRELOADER ──────────────────────────────────────────── */
(function initPreloader() {
  const loader  = $('preloader');
  const ring    = $('preRing');
  const numEl   = $('preNum');
  const starEl  = $('preStar');

  if (!loader) return;

  const circumference = 2 * Math.PI * 42; // r=42
  ring.style.strokeDasharray  = circumference;
  ring.style.strokeDashoffset = circumference;

  let pct = 0;
  const tick = setInterval(() => {
    pct += Math.random() * 14 + 4;
    if (pct >= 100) { pct = 100; clearInterval(tick); }
    const offset = circumference * (1 - pct / 100);
    ring.style.strokeDashoffset = offset;
    numEl.textContent = Math.floor(pct) + '%';
    if (pct >= 100) {
      setTimeout(() => {
        loader.classList.add('done');
        document.body.style.overflow = '';
        setTimeout(() => loader.remove(), 700);
        kickoffHeroAnimations();
      }, 350);
    }
  }, 60);

  document.body.style.overflow = 'hidden';
})();

/* ── HERO ENTRY ANIMATIONS ──────────────────────────────── */
function kickoffHeroAnimations() {
  // Eyebrow
  const eye = $('hEye');
  if (eye) { requestAnimationFrame(() => eye.classList.add('visible')); }

  // H1 words
  $$('.h1w').forEach((w, i) => {
    setTimeout(() => w.classList.add('visible'), i * 150 + 100);
  });

  // Desc + btns
  const hDesc = $('hDesc');
  const hBtns = $('hBtns');
  if (hDesc) setTimeout(() => hDesc.classList.add('visible'), 600);
  if (hBtns) setTimeout(() => hBtns.classList.add('visible'), 800);

  // Stat pills
  $$('.hstat').forEach(el => {
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), 1000 + delay);
  });

  // Animate stat counters
  $$('.hstat-n[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const sfx    = el.dataset.sfx || '';
    const dec    = parseInt(el.dataset.dec || 0);
    const delay  = parseInt(el.closest('.hstat')?.dataset.delay || 0);
    setTimeout(() => animateCounter(el, 0, target, 1400, sfx, dec), 1200 + delay);
  });
}

/* ── CUSTOM CURSOR ──────────────────────────────────────── */
(function initCursor() {
  const dot    = $('curDot');
  const circle = $('curCircle');
  const text   = $('curText');

  if (!dot || !circle || !text) return;
  if (window.matchMedia('(hover:none)').matches) return;

  let mx = -200, my = -200, cx = -200, cy = -200;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    text.style.left = mx + 'px';
    text.style.top  = my + 'px';
  });

  function loop() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    circle.style.left = cx + 'px';
    circle.style.top  = cy + 'px';
    raf = requestAnimationFrame(loop);
  }
  loop();

  // Hover detection
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('a, button, .fcard, .maison, .am-card, .tier, .path, .vtab, .dc, .tf, .tc, .pr, .hstat, .bento, [onclick]');
    if (t) {
      document.body.classList.add('cursor-hover');
      const label = t.dataset.curLabel || t.title || '';
      text.textContent = label || '✦';
    }
  });
  document.addEventListener('mouseout', e => {
    const t = e.target.closest('a, button, .fcard, .maison, .am-card, .tier, .path, .vtab, .dc, .tf, .tc, .pr, .hstat, .bento, [onclick]');
    if (t) document.body.classList.remove('cursor-hover');
  });
})();

/* ── SCROLL PROGRESS BAR ────────────────────────────────── */
(function initScrollBar() {
  const bar = $('scrollBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

/* ── NAV: scrolled state + active link + hamburger ─────── */
(function initNav() {
  const nav  = $('mainNav');
  const ham  = $('ham');
  const drawer = $('drawer');
  if (!nav) return;

  // Scrolled class
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveDot();
  }, { passive: true });
  nav.classList.toggle('scrolled', window.scrollY > 40);

  // Hamburger toggle
  if (ham && drawer) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      drawer.classList.toggle('open');
    });
  }

  // Click outside drawer closes it
  document.addEventListener('click', e => {
    if (drawer && drawer.classList.contains('open')) {
      if (!drawer.contains(e.target) && e.target !== ham && !ham.contains(e.target)) {
        closeDrawer();
      }
    }
  });
})();

/* exposed so inline onclick="closeDrawer()" works */
function closeDrawer() {
  const ham    = $('ham');
  const drawer = $('drawer');
  if (ham)    ham.classList.remove('open');
  if (drawer) drawer.classList.remove('open');
}
window.closeDrawer = closeDrawer;

/* ── SIDE DOTS active state ─────────────────────────────── */
function updateActiveDot() {
  const sections = $$('section[id], footer[id]');
  const scrollY  = window.scrollY + window.innerHeight * 0.4;
  let active = null;
  sections.forEach(s => { if (s.offsetTop <= scrollY) active = s.id; });
  $$('.sd').forEach(d => {
    d.classList.toggle('active', d.getAttribute('href') === '#' + active);
  });
  $$('.nl').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + active);
  });
}

/* ── INTERSECTION OBSERVER — scroll reveals ─────────────── */
(function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      // Fire counter if applicable
      entry.target.querySelectorAll('.counter[data-target]').forEach(el => {
        if (!el.dataset.animated) {
          el.dataset.animated = '1';
          const target = parseFloat(el.dataset.target);
          const sfx    = el.dataset.sfx || '';
          const dec    = parseInt(el.dataset.dec || 0);
          animateCounter(el, 0, target, 1600, sfx, dec);
        }
      });
      // Animate SVG rings if inside
      entry.target.querySelectorAll('.ring-arc').forEach(arc => animateRing(arc));
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  // Also observe rv-bar individually
  const barIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      barIo.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  $$('.rv').forEach(el => io.observe(el));
  $$('.rv-bar').forEach(el => barIo.observe(el));

  // Ring rows observed separately
  $$('.ring-wrap').forEach(rw => {
    const rwIo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('.ring-arc').forEach(arc => animateRing(arc));
        e.target.querySelectorAll('.counter[data-target]').forEach(el => {
          if (!el.dataset.animated) {
            el.dataset.animated = '1';
            const target = parseFloat(el.dataset.target);
            const sfx    = el.dataset.sfx || '';
            const dec    = parseInt(el.dataset.dec || 0);
            animateCounter(el, 0, target, 1800, sfx, dec);
          }
        });
        rwIo.unobserve(e.target);
      });
    }, { threshold: 0.3 });
    rwIo.observe(rw);
  });
})();

/* ── COUNTER ANIMATION ──────────────────────────────────── */
function animateCounter(el, from, to, dur, sfx, dec) {
  const start = performance.now();
  function frame(now) {
    const t   = Math.min((now - start) / dur, 1);
    const val = from + (to - from) * easeOutExpo(t);
    el.textContent = (dec > 0 ? val.toFixed(dec) : Math.floor(val)) + sfx;
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = (dec > 0 ? to.toFixed(dec) : to) + sfx;
  }
  requestAnimationFrame(frame);
}
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* ── SVG RING ANIMATION ─────────────────────────────────── */
function animateRing(arc) {
  const total  = parseFloat(arc.getAttribute('stroke-dasharray') || 314);
  // Map ring ID to fill pct
  const pcts   = { ra1: 0.80, ra2: 0.60, ra3: 0.90, ra4: 1.00 };
  const id     = arc.id;
  const pct    = pcts[id] !== undefined ? pcts[id] : 0.75;
  const target = total * (1 - pct);
  arc.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      arc.style.strokeDashoffset = target;
    });
  });
}

/* ── HERO CANVAS — particle field ───────────────────────── */
(function initHeroCanvas() {
  const canvas = $('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const N = Math.min(120, Math.floor(window.innerWidth / 12));
  for (let i = 0; i < N; i++) {
    particles.push({
      x: Math.random() * (W || 1200),
      y: Math.random() * (H || 800),
      r: Math.random() * 1.5 + 0.2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.6 + 0.1,
    });
  }

  let mouse = { x: -9999, y: -9999 };
  canvas.closest('section')?.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });

  function drawFrame() {
    if (!canvas.isConnected) return;
    W = canvas.width; H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Gentle mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 80) {
        p.x += dx / dist * 0.5;
        p.y += dy / dist * 0.5;
      }

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.a})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${0.08 * (1 - d/90)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawFrame);
  }
  requestAnimationFrame(drawFrame);
})();

/* ── ENTERTAINMENT CANVAS — star field ──────────────────── */
(function initEntCanvas() {
  const canvas = $('entCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], shootings = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const N = Math.min(200, Math.floor(window.innerWidth / 7));
  for (let i = 0; i < N; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.1,
      a: Math.random() * 0.5 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    });
  }

  function spawnShoot() {
    shootings.push({
      x: Math.random() * W,
      y: Math.random() * H * 0.4,
      len: Math.random() * 80 + 40,
      speed: Math.random() * 8 + 4,
      angle: Math.PI / 6 + Math.random() * 0.2,
      life: 1,
    });
  }
  setInterval(spawnShoot, 3000);

  function drawEnt() {
    if (!canvas.isConnected) return;
    W = canvas.width; H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    stars.forEach(s => {
      s.twinkle += s.speed;
      const a = s.a * (0.5 + 0.5 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${a})`;
      ctx.fill();
    });

    shootings = shootings.filter(s => s.life > 0);
    shootings.forEach(s => {
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life -= 0.025;
      const grad = ctx.createLinearGradient(
        s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len,
        s.x, s.y
      );
      grad.addColorStop(0, `rgba(201,168,76,0)`);
      grad.addColorStop(1, `rgba(201,168,76,${s.life * 0.8})`);
      ctx.beginPath();
      ctx.moveTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    requestAnimationFrame(drawEnt);
  }
  requestAnimationFrame(drawEnt);
})();

/* ── RADAR CANVAS ───────────────────────────────────────── */
(function initRadarCanvas() {
  const canvas = $('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, angle = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const rings = 4;
  const pointData = [
    { label: 'NYC',           dist: 0.28, angle: 0.35 },
    { label: 'Newark EWR',    dist: 0.35, angle: 1.1  },
    { label: 'JFK',           dist: 0.55, angle: 1.8  },
    { label: 'MetLife',       dist: 0.15, angle: 3.5  },
    { label: '24M radius',    dist: 0.45, angle: 4.2  },
  ];

  function drawRadar() {
    if (!canvas.isConnected) return;
    W = canvas.width; H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const maxR = Math.min(cx, cy) * 0.9;
    ctx.clearRect(0, 0, W, H);

    // Background
    const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    bgGrad.addColorStop(0, 'rgba(14,10,3,0.9)');
    bgGrad.addColorStop(1, 'rgba(5,5,5,0.95)');
    ctx.beginPath(); ctx.arc(cx, cy, maxR, 0, Math.PI*2);
    ctx.fillStyle = bgGrad; ctx.fill();

    // Rings
    for (let i = 1; i <= rings; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * i / rings, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(201,168,76,${0.06 + i*0.01})`;
      ctx.lineWidth = 1; ctx.stroke();
    }

    // Cross hairs
    ctx.strokeStyle = 'rgba(201,168,76,0.06)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy); ctx.stroke();

    // Sweep
    angle = (angle + 0.008) % (Math.PI * 2);
    const sweepGrad = ctx.createConicalGradient
      ? ctx.createConicalGradient(cx, cy, angle)
      : null;
    if (!sweepGrad) {
      // Fallback triangle wedge
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const wGrad = ctx.createLinearGradient(0, 0, maxR, 0);
      wGrad.addColorStop(0, 'rgba(201,168,76,0.25)');
      wGrad.addColorStop(1, 'rgba(201,168,76,0)');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxR, -0.4, 0, false);
      ctx.closePath();
      ctx.fillStyle = wGrad; ctx.fill();
      ctx.restore();
    }

    // Points
    pointData.forEach((pt, i) => {
      const r = maxR * pt.dist;
      const px = cx + Math.cos(pt.angle) * r;
      const py = cy + Math.sin(pt.angle) * r;
      // Pulse
      const pulsePct = (Math.sin(Date.now() * 0.002 + i) + 1) / 2;
      ctx.beginPath();
      ctx.arc(px, py, 2 + pulsePct * 2, 0, Math.PI*2);
      ctx.fillStyle = `rgba(201,168,76,${0.6 + pulsePct * 0.4})`;
      ctx.fill();
    });

    // Center dot
    const dotGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
    dotGrad.addColorStop(0, 'rgba(201,168,76,0.9)');
    dotGrad.addColorStop(1, 'rgba(201,168,76,0)');
    ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI*2);
    ctx.fillStyle = dotGrad; ctx.fill();

    requestAnimationFrame(drawRadar);
  }
  requestAnimationFrame(drawRadar);
})();

/* ── FLIP CARDS ─────────────────────────────────────────── */
function flipCard(el) {
  el.classList.toggle('flipped');
}
window.flipCard = flipCard;

/* ── TENANT FILTER ──────────────────────────────────────── */
function filterTenants(cat, btn) {
  // Update active button
  $$('.tf').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // Filter tenant chips
  $$('.tc').forEach(chip => {
    if (cat === 'all') {
      chip.classList.remove('hidden');
    } else {
      const match = chip.dataset.cat === cat || chip.classList.contains('tc-more');
      chip.classList.toggle('hidden', !match);
    }
  });
}
window.filterTenants = filterTenants;

/* ── ROI CALCULATOR ─────────────────────────────────────── */
let calcState = {
  size: 2000,
  tierMult: 1.0,    // prime=1.0, standard=0.8, popup=0.5
  catMult:  1.3,    // fashion=1.3, luxury=1.5, fb=1.1, popup=0.9
};

function calcUpdate() {
  const slider = $('szSlider');
  if (!slider) return;

  calcState.size = parseInt(slider.value) || 2000;

  // Update label
  const label = $('szLabel');
  if (label) label.textContent = Number(calcState.size).toLocaleString() + ' sq ft';

  // Update fill bar
  const fill = $('szFill');
  if (fill) {
    const min = parseInt(slider.min), max = parseInt(slider.max);
    const pct = ((calcState.size - min) / (max - min)) * 100;
    fill.style.width = pct + '%';
  }

  updateCalcResults();
}
window.calcUpdate = calcUpdate;

function setTier(btn, tier) {
  $$('#tierRow .pr').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const mults = { prime: 1.0, standard: 0.75, popup: 0.45 };
  calcState.tierMult = mults[tier] || 1.0;
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
  const BASE_VISITOR_RATE = 1200;  // visitors per sqft per year
  const BASE_CONVERSION   = 0.0022; // revenue per visitor per sqft

  const visitors = Math.round(calcState.size * BASE_VISITOR_RATE * calcState.tierMult * 0.001) * 1000;
  const revenue  = calcState.size * calcState.catMult * BASE_CONVERSION * visitors / 1000;
  const roi      = (revenue / (calcState.size * 80)) ; // 80 $/sqft baseline cost

  // Visitors
  const crV = $('crVisitors');
  if (crV) {
    crV.textContent = visitors >= 1000000
      ? (visitors / 1000000).toFixed(1) + 'M'
      : (visitors / 1000).toFixed(0) + 'K';
  }
  const crVbar = $('crVbar');
  if (crVbar) crVbar.style.width = Math.min(visitors / 40000000 * 100, 100) + '%';

  // Revenue
  const crR = $('crRevenue');
  if (crR) {
    const rev = revenue * 1000;
    crR.textContent = rev >= 1000000
      ? '$' + (rev / 1000000).toFixed(1) + 'M'
      : '$' + (rev / 1000).toFixed(0) + 'K';
  }
  const crRbar = $('crRbar');
  if (crRbar) crRbar.style.width = Math.min(revenue / 50 * 100, 100) + '%';

  // ROI
  const crO = $('crROI');
  if (crO) crO.textContent = roi.toFixed(1) + '×';
  const crObar = $('crObar');
  if (crObar) crObar.style.width = Math.min(roi / 8 * 100, 100) + '%';
}

// Init calculator
(function initCalc() {
  const slider = $('szSlider');
  if (!slider) return;
  // Set initial fill
  const fill = $('szFill');
  if (fill) {
    const min = parseInt(slider.min), max = parseInt(slider.max);
    const pct = ((parseInt(slider.value) - min) / (max - min)) * 100;
    fill.style.width = pct + '%';
  }
  updateCalcResults();
})();

/* ── MAISON ACCORDION ───────────────────────────────────── */
function toggleMaison(el) {
  const wasOpen = el.classList.contains('expanded');
  $$('.maison').forEach(m => m.classList.remove('expanded'));
  if (!wasOpen) el.classList.add('expanded');
}
window.toggleMaison = toggleMaison;

/* ── LUXURY MODAL ───────────────────────────────────────── */
function openLuxModal() { openModal('luxModal'); }
window.openLuxModal = openLuxModal;

/* ── DINING SLIDER ──────────────────────────────────────── */
(function initDiningSlider() {
  const slider = $('dslider');
  const prev   = $('dprev');
  const next   = $('dnext');
  if (!slider) return;

  const CARD_W = 300; // 280px + 20px gap

  function slide(dir) {
    slider.scrollBy({ left: dir * CARD_W * 2, behavior: 'smooth' });
  }

  if (prev) prev.addEventListener('click', () => slide(-1));
  if (next) next.addEventListener('click', () => slide(1));

  // Also update btn states
  function updateArrows() {
    if (prev) prev.disabled = slider.scrollLeft < 10;
    if (next) next.disabled = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10;
  }
  slider.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows();

  // Drag-to-scroll
  let isDown = false, startX, startScroll;
  slider.addEventListener('mousedown', e => {
    isDown = true; startX = e.pageX; startScroll = slider.scrollLeft;
    slider.style.cursor = 'grabbing'; e.preventDefault();
  });
  document.addEventListener('mouseup', () => {
    isDown = false; slider.style.cursor = '';
  });
  document.addEventListener('mousemove', e => {
    if (!isDown) return;
    slider.scrollLeft = startScroll - (e.pageX - startX);
  });
})();

// Expose for inline onclick
function dSlide(dir) {
  const slider = $('dslider');
  if (slider) slider.scrollBy({ left: dir * 600, behavior: 'smooth' });
}
window.dSlide = dSlide;

/* ── VENUE SWITCHER TABS ────────────────────────────────── */
function switchVenue(id, btn) {
  $$('.vtab').forEach(t => t.classList.remove('active'));
  $$('.vp').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const panel = $('vp-' + id);
  if (panel) panel.classList.add('active');
}
window.switchVenue = switchVenue;

/* ── SPONSORSHIP TIER SELECT ────────────────────────────── */
function selectTier(el, name) {
  $$('.tier').forEach(t => t.classList.remove('selected'));
  el.classList.add('selected');
  // Pre-fill the inquiry
  presetInquiry(name + ' Sponsorship');
}
window.selectTier = selectTier;

/* ── CONTACT PATH SELECT ────────────────────────────────── */
function selectPath(el, inquiry) {
  $$('.path').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  presetInquiry(inquiry);
  // Smooth scroll to form
  const form = $('formWrap');
  if (form) form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
window.selectPath = selectPath;

/* ── PRESET INQUIRY (form pre-fill) ────────────────────── */
function presetInquiry(text) {
  const sel = $('fType');
  if (!sel) return;
  // Find best match in options
  const opts = Array.from(sel.options);
  const match = opts.find(o => o.text.toLowerCase().includes(text.toLowerCase().split(' ')[0]));
  if (match) sel.value = match.value || match.text;
  // Add to message
  const msg = $('fMsg');
  if (msg && !msg.value) {
    msg.value = 'Re: ' + text + '\n\nI would like to learn more about this opportunity at American Dream.';
  }
}
window.presetInquiry = presetInquiry;

/* ── CONTACT FORM SUBMIT ────────────────────────────────── */
function submitForm(e) {
  e.preventDefault();
  const btn  = $('formSub');
  const form = $('contactForm');
  const ok   = $('formOK');

  if (!btn) return;
  btn.classList.add('loading');
  btn.disabled = true;

  // Simulate async submission
  setTimeout(() => {
    btn.classList.remove('loading');
    if (form) form.style.display = 'none';
    if (ok) ok.classList.add('visible');
  }, 1800);
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

/* ── VIDEO REEL MODAL ───────────────────────────────────── */
function openReel() {
  const frame = $('reelFrame');
  if (frame) frame.src = 'https://www.youtube.com/embed/YEKsgfP5-s8?autoplay=1&rel=0';
  openModal('reelModal');
}
window.openReel = openReel;

/* ── ATTRACTION MODALS ──────────────────────────────────── */
const ATTR_DATA = {
  nick: {
    ico: '🎢',
    tag: 'INDOOR THEME PARK · WESTERN HEMISPHERE\'S LARGEST',
    name: 'Nickelodeon Universe',
    desc: 'The Western Hemisphere\'s largest indoor theme park, spanning 8 themed acres inside American Dream. 35+ rides and attractions, including the tallest indoor roller coaster in North America. Open 365 days a year — fully weather-proof, climate-controlled, and powered by the most recognizable youth entertainment brand on Earth.',
    stats: [
      { val: '35+', lbl: 'Rides & Attractions' },
      { val: '8', lbl: 'Themed Acres' },
      { val: '365', lbl: 'Days/Year' },
      { val: '#1', lbl: 'Indoor Coaster in NA' },
    ]
  },
  water: {
    ico: '🌊',
    tag: 'INDOOR WATER PARK · YEAR-ROUND',
    name: 'DreamWorks Water Park',
    desc: 'North America\'s largest indoor water park, bringing the DreamWorks universe to life across 40 world-class slides and attractions. Fully climate-controlled at 84°F year-round — eliminating the seasonal limitation that defines every outdoor water park competitor.',
    stats: [
      { val: '40', lbl: 'Water Slides' },
      { val: '84°F', lbl: 'Year-Round Temp' },
      { val: 'NA\'s Largest', lbl: 'Indoor Water Park' },
      { val: 'DreamWorks', lbl: 'IP Partnership' },
    ]
  },
  snow: {
    ico: '⛷️',
    tag: 'INDOOR SKI RESORT · REAL SNOW',
    name: 'Big SNOW',
    desc: 'America\'s first and only indoor real-snow ski and snowboard slope. Six slopes for all skill levels — beginners to advanced — with real snow, ski school, full rental packages and seasonal events. The only place in the New York metro area where you can ski in July.',
    stats: [
      { val: '6', lbl: 'Slopes' },
      { val: 'Real', lbl: 'Snow (not fake)' },
      { val: '100%', lbl: 'Climate Controlled' },
      { val: 'First', lbl: 'Indoor Ski in USA' },
    ]
  },
  wheel: {
    ico: '🎡',
    tag: 'OBSERVATION WHEEL · 300 FT',
    name: 'The Wheel',
    desc: 'A 300-foot observation wheel with sweeping views of the NYC skyline and the New Jersey meadowlands. Each air-conditioned gondola carries up to 8 passengers for a 20-minute journey. Private gondola buyouts available for proposals, celebrations, and brand activations.',
    stats: [
      { val: '300 ft', lbl: 'Height' },
      { val: 'NYC', lbl: 'Skyline Views' },
      { val: '8', lbl: 'Guests/Gondola' },
      { val: 'Private', lbl: 'Buyout Available' },
    ]
  },
  ice: {
    ico: '🏒',
    tag: 'NHL ICE RINK · EVENT CONVERSIONS',
    name: 'The Rink',
    desc: 'An NHL-regulation ice rink at the heart of American Dream, doubling as a 5,000-capacity concert and event venue. When the ice is out, The Rink becomes the most visited indoor event floor in the New York metro area — with a built-in daily audience walking past before doors even open.',
    stats: [
      { val: 'NHL', lbl: 'Regulation Size' },
      { val: '5,000', lbl: 'Standing Capacity' },
      { val: 'Converts', lbl: 'To Event Floor' },
      { val: 'Built-in', lbl: '40M Annual Traffic' },
    ]
  },
};

function openAttr(id) {
  const data = ATTR_DATA[id];
  if (!data) return;
  const body = $('attrBody');
  if (!body) return;
  body.innerHTML = `
    <div class="attr-detail-grid">
      <div class="attr-ico-lg">${data.ico}</div>
      <div>
        <div class="attr-info-tag">${data.tag}</div>
        <div class="attr-info-title">${data.name}</div>
        <div class="attr-info-desc">${data.desc}</div>
        <div class="attr-stats">
          ${data.stats.map(s => `
            <div class="attr-stat">
              <strong>${s.val}</strong>
              <span>${s.lbl}</span>
            </div>`).join('')}
        </div>
        <a href="#contact" class="btn-g" onclick="closeModal('attrModal');presetInquiry('${data.name} partnership')">
          Discuss Partnership <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>`;
  openModal('attrModal');
}
window.openAttr = openAttr;

/* ── MODAL SYSTEM ───────────────────────────────────────── */
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
  // Stop video if it's the reel modal
  if (id === 'reelModal') {
    const frame = $('reelFrame');
    if (frame) frame.src = '';
  }
}
window.openModal  = openModal;
window.closeModal = closeModal;

// ESC closes any open modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    $$('.modal.open').forEach(m => closeModal(m.id));
  }
});

/* ── LUX PILL MAGNETIC HOVER ────────────────────────────── */
(function initLuxPills() {
  $$('.lux-pill').forEach(pill => {
    pill.addEventListener('mousemove', e => {
      const rect = pill.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.25;
      const dy   = (e.clientY - cy) * 0.25;
      pill.style.transform = `translate(${dx}px,${dy}px) scale(1.06)`;
    });
    pill.addEventListener('mouseleave', () => {
      pill.style.transform = '';
    });
  });
})();

/* ── SMOOTH SCROLL HELPER ───────────────────────────────── */
function scrollTo(id) {
  const el = $(id) || document.querySelector('#' + id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.scrollTo = (id) => {
  if (typeof id === 'string') {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // Native scrollTo(x,y) passthrough
    window.scroll(id);
  }
};

/* ── BENTO CARD TILT ────────────────────────────────────── */
(function initBentoTilt() {
  $$('.bento, .am-card, .tier, .dc').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── CELEBRITY GRID ENTRANCE ────────────────────────────── */
(function initCelebGrid() {
  const grid = $('celebGrid');
  if (!grid) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const spans = grid.querySelectorAll('span');
      spans.forEach((s, i) => {
        s.style.opacity = '0';
        s.style.transform = 'translateY(12px)';
        s.style.transition = `opacity .4s ${i * 0.05}s, transform .4s ${i * 0.05}s`;
        requestAnimationFrame(() => {
          s.style.opacity   = '1';
          s.style.transform = 'translateY(0)';
        });
      });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  io.observe(grid);
})();

/* ── BRAND LOGOS HOVER GLOW ─────────────────────────────── */
(function initBrandLogos() {
  $$('.br').forEach(b => {
    b.addEventListener('mouseenter', () => {
      b.style.boxShadow = '0 4px 20px rgba(201,168,76,0.12)';
    });
    b.addEventListener('mouseleave', () => {
      b.style.boxShadow = '';
    });
  });
})();

/* ── TICKER PAUSE ON HOVER (handled by CSS) ─────────────── */
// Already in CSS: .ticker:hover .ticker-inner { animation-play-state: paused; }

/* ── WINDOW RESIZE DEBOUNCE ─────────────────────────────── */
(function initResizeHandler() {
  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // Recheck side-dot active state
      updateActiveDot();
    }, 150);
  });
})();

/* ── KEYBOARD NAVIGATION ────────────────────────────────── */
(function initKeyNav() {
  const sections = ['hero','property','retail','luxury','dining','ent','events','partners','contact'];
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const current = sections.findIndex(id => {
        const el = document.getElementById(id);
        return el && el.getBoundingClientRect().top > -window.innerHeight * 0.3;
      });
      const next = sections[Math.min(current, sections.length - 1)];
      if (next) document.getElementById(next)?.scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const current = sections.findLastIndex(id => {
        const el = document.getElementById(id);
        return el && el.getBoundingClientRect().top < -50;
      });
      if (current >= 0) {
        document.getElementById(sections[current])?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
})();

/* ── INITIAL REVEAL PASS (elements already in viewport) ─── */
document.addEventListener('DOMContentLoaded', () => {
  // Trigger visible elements immediately
  setTimeout(() => {
    $$('.rv').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('visible');
      }
    });
  }, 100);
});

/* ── END ─────────────────────────────────────────────────── */
