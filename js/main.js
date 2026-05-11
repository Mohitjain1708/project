/* ═══════════════════════════════════════════════════════════════
   AMERICAN DREAM — PITCH DECK  ·  js/main.js  v3
   Complete interactive layer: canvas · cursors · counters · forms
═══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ─────────────────────────────────────────────────────────────
   0.  UTILS
───────────────────────────────────────────────────────────── */
const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const clamp = (v,lo,hi) => Math.min(hi, Math.max(lo, v));
const lerp  = (a, b, t)  => a + (b - a) * t;
const map   = (v,i0,i1,o0,o1) => o0 + (v-i0)/(i1-i0)*(o1-o0);

/* ─────────────────────────────────────────────────────────────
   1.  PRELOADER
───────────────────────────────────────────────────────────── */
const preloader = $('#preloader');
const preNum    = $('#preNum');
const preRing   = $('#preRing');           // SVG circle

const CIRC = 2 * Math.PI * 42;            // r=42 → 263.9
let pct = 0;
const preTimer = setInterval(() => {
  pct += Math.random() * 12 + 5;
  if (pct >= 100) { pct = 100; clearInterval(preTimer); setTimeout(killPre, 380); }
  preNum.textContent = Math.floor(pct);
  preRing.style.strokeDashoffset = CIRC * (1 - pct / 100);
}, 75);

function killPre () {
  preloader.classList.add('gone');
  setTimeout(heroIn, 500);
}

/* ─────────────────────────────────────────────────────────────
   2.  CUSTOM CURSOR
───────────────────────────────────────────────────────────── */
const curDot    = $('#curDot');
const curCircle = $('#curCircle');
const curText   = $('#curText');
let mx = -200, my = -200, cx = -200, cy = -200;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
document.addEventListener('mouseleave', () => { curDot.style.opacity = '0'; curCircle.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { curDot.style.opacity = '1'; curCircle.style.opacity = '1'; });

(function curLoop () {
  cx = lerp(cx, mx, 0.18);
  cy = lerp(cy, my, 0.18);
  curDot.style.left    = mx + 'px';
  curDot.style.top     = my + 'px';
  curCircle.style.left = cx + 'px';
  curCircle.style.top  = cy + 'px';
  curText.style.left   = mx + 'px';
  curText.style.top    = my + 'px';
  requestAnimationFrame(curLoop);
})();

/* hover labels */
$$('[data-cursor]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    document.body.classList.add('cur-hover');
    curText.textContent = el.dataset.cursor;
  });
  el.addEventListener('mouseleave', () => {
    document.body.classList.remove('cur-hover');
  });
});

/* generic hover enlarge */
$$('a, button, .fcard, .am-card, .dc, .tier, .path, .vtab, .maison, .bento').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
});

/* ─────────────────────────────────────────────────────────────
   3.  SCROLL PROGRESS BAR
───────────────────────────────────────────────────────────── */
const scrollBar = $('#scrollBar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - innerHeight) * 100;
  scrollBar.style.width = pct + '%';
}, { passive: true });

/* ─────────────────────────────────────────────────────────────
   4.  NAV — scroll state + active link
───────────────────────────────────────────────────────────── */
const mainNav = $('#mainNav');
const navLinks = $$('.nl');
const sections = $$('section[id]');

window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 60);
  highlightNav();
  updateSideDots();
}, { passive: true });

function highlightNav () {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}

/* ─────────────────────────────────────────────────────────────
   5.  HAMBURGER + DRAWER
───────────────────────────────────────────────────────────── */
const ham    = $('#ham');
const drawer = $('#drawer');

ham.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  ham.classList.toggle('open', open);
  document.body.classList.toggle('no-scroll', open);
});

window.closeDrawer = function () {
  drawer.classList.remove('open');
  ham.classList.remove('open');
  document.body.classList.remove('no-scroll');
};

/* ─────────────────────────────────────────────────────────────
   6.  SIDE DOTS — highlight on scroll
───────────────────────────────────────────────────────────── */
const sideDots = $$('.sd');
const dotTargets = sideDots.map(d => d.getAttribute('href').slice(1));

function updateSideDots () {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 300) current = s.id;
  });
  sideDots.forEach((d, i) => d.classList.toggle('active', dotTargets[i] === current));
}

/* ─────────────────────────────────────────────────────────────
   7.  HERO ENTRANCE ANIMATIONS
───────────────────────────────────────────────────────────── */
function heroIn () {
  const eye   = $('#hEye');
  const words = $$('.h1w');
  const desc  = $('#hDesc');
  const btns  = $('#hBtns');
  const stats = $$('.hstat');

  if (eye) { eye.classList.add('in'); }
  words.forEach((w, i) => setTimeout(() => w.classList.add('in'), 160 + i * 160));
  setTimeout(() => desc && desc.classList.add('in'), 700);
  setTimeout(() => btns && btns.classList.add('in'), 900);
  stats.forEach(s => {
    const delay = parseInt(s.dataset.delay || 0);
    setTimeout(() => s.classList.add('in'), 1100 + delay);
  });
}

/* ─────────────────────────────────────────────────────────────
   8.  HERO CANVAS — particle system
───────────────────────────────────────────────────────────── */
(function heroCanvas () {
  const cv = $('#heroCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, particles = [];

  function resize () {
    W = cv.width  = cv.offsetWidth  || innerWidth;
    H = cv.height = cv.offsetHeight || innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor () { this.reset(true); }
    reset (initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.vx = (Math.random() - .5) * .3;
      this.vy = -(Math.random() * .6 + .2);
      this.r  = Math.random() * 1.4 + .3;
      this.a  = Math.random() * .6 + .1;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
    }
    update () {
      this.x += this.vx; this.y += this.vy; this.life++;
      const f = this.life / this.maxLife;
      this.alpha = this.a * (1 - f);
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  (function loop () {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
})();

/* ─────────────────────────────────────────────────────────────
   9.  INTERSECTION OBSERVER — reveal on scroll
───────────────────────────────────────────────────────────── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    revObs.unobserve(e.target);
  });
}, { threshold: 0.12 });

$$('.rv').forEach(el => revObs.observe(el));

/* bar reveals */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.dbar-fill').forEach(f => f.classList.add('in'));
    e.target.querySelectorAll('.bb-fill').forEach(f => f.classList.add('in'));
    barObs.unobserve(e.target);
  });
}, { threshold: 0.2 });

$$('.rv-bar, .bento').forEach(el => barObs.observe(el));

/* section-head child stagger */
const headObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    $$('.stag, .s-title, .s-desc', e.target).forEach((c, i) => {
      c.style.transition = 'opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)';
      c.style.transitionDelay = (i * .12) + 's';
      setTimeout(() => { c.style.opacity = '1'; c.style.transform = 'none'; }, 20);
    });
    headObs.unobserve(e.target);
  });
}, { threshold: 0.18 });

$$('.s-head').forEach(h => {
  $$('.stag, .s-title, .s-desc', h).forEach(c => {
    c.style.opacity = '0'; c.style.transform = 'translateY(22px)';
  });
  headObs.observe(h);
});

/* ─────────────────────────────────────────────────────────────
   10.  ANIMATED COUNTERS
───────────────────────────────────────────────────────────── */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    animateCounter(e.target);
    counterObs.unobserve(e.target);
  });
}, { threshold: 0.4 });

$$('.counter').forEach(el => counterObs.observe(el));

/* hero pill counters */
$$('.hstat-n').forEach(el => {
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    animateCounterEl(el);
    obs.unobserve(el);
  }, { threshold: 0.5 });
  obs.observe(el);
});

function animateCounter (el) {
  const target  = parseFloat(el.dataset.target || el.dataset.count || 0);
  const sfx     = el.dataset.sfx || el.dataset.suffix || '';
  const dec     = parseInt(el.dataset.dec || 0);
  const dur     = 1800;
  const start   = performance.now();
  (function tick (now) {
    const t   = clamp((now - start) / dur, 0, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val  = target * ease;
    el.textContent = (dec ? val.toFixed(dec) : Math.floor(val)) + sfx;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = (dec ? target.toFixed(dec) : target) + sfx;
  })(start);
}

function animateCounterEl (el) {
  const target = parseFloat(el.dataset.count || el.dataset.target || 0);
  const sfx    = el.dataset.sfx || '';
  const dec    = parseInt(el.dataset.dec || 0);
  const dur    = 1600;
  const start  = performance.now();
  (function tick (now) {
    const t    = clamp((now - start) / dur, 0, 1);
    const ease = 1 - Math.pow(1 - t, 4);
    const val  = target * ease;
    el.textContent = (dec ? val.toFixed(dec) : Math.floor(val)) + sfx;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = (dec ? target.toFixed(dec) : target) + sfx;
  })(start);
}

/* ─────────────────────────────────────────────────────────────
   11.  RADAR CANVAS
───────────────────────────────────────────────────────────── */
(function radar () {
  const cv = $('#radarCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let drawn = false;

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || drawn) return;
    drawn = true;
    drawRadar();
    obs.disconnect();
  }, { threshold: 0.3 });
  obs.observe(cv);

  function drawRadar () {
    const W = cv.offsetWidth || 460;
    cv.width  = W * devicePixelRatio;
    cv.height = W * devicePixelRatio;
    cv.style.width  = W + 'px';
    cv.style.height = W + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const cx = W / 2, cy = W / 2, maxR = W * .42;
    const points = [
      { angle:-90, dist:.72, label:'NYC' },
      { angle:-18, dist:.68, label:'EWR' },
      { angle: 54, dist:.60, label:'JFK' },
      { angle:126, dist:.55, label:'Stadium' },
      { angle:198, dist:.65, label:'24M Zone' },
    ];

    /* rings */
    [.25,.50,.75,1].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(201,168,76,' + (.05 + r * .06) + ')';
      ctx.lineWidth   = 1;
      ctx.stroke();
    });

    /* axes */
    points.forEach(p => {
      const rad = p.angle * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(rad) * maxR, cy + Math.sin(rad) * maxR);
      ctx.strokeStyle = 'rgba(201,168,76,.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    /* filled polygon — animate */
    let prog = 0;
    (function anim () {
      ctx.clearRect(0, 0, W, W);

      /* re-draw rings */
      [.25,.50,.75,1].forEach(r => {
        ctx.beginPath(); ctx.arc(cx, cy, maxR * r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(201,168,76,' + (.05 + r * .06) + ')';
        ctx.lineWidth = 1; ctx.stroke();
      });
      points.forEach(p => {
        const rad = p.angle * Math.PI / 180;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(rad) * maxR, cy + Math.sin(rad) * maxR);
        ctx.strokeStyle = 'rgba(201,168,76,.08)'; ctx.lineWidth = 1; ctx.stroke();
      });

      prog = Math.min(1, prog + .016);
      const ease = 1 - Math.pow(1 - prog, 3);

      /* polygon fill */
      ctx.beginPath();
      points.forEach((p, i) => {
        const rad = p.angle * Math.PI / 180;
        const r   = maxR * p.dist * ease;
        const x   = cx + Math.cos(rad) * r;
        const y   = cy + Math.sin(rad) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grad.addColorStop(0, 'rgba(201,168,76,.22)');
      grad.addColorStop(1, 'rgba(201,168,76,.04)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(201,168,76,.55)';
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      /* dots */
      points.forEach(p => {
        const rad = p.angle * Math.PI / 180;
        const r   = maxR * p.dist * ease;
        const x   = cx + Math.cos(rad) * r;
        const y   = cy + Math.sin(rad) * r;
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#C9A84C'; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201,168,76,.2)'; ctx.fill();
      });

      /* center dot */
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#C9A84C'; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,168,76,.25)'; ctx.fill();

      if (prog < 1) requestAnimationFrame(anim);
    })();
  }
})();

/* ─────────────────────────────────────────────────────────────
   12.  ENTERTAINMENT CANVAS — star field
───────────────────────────────────────────────────────────── */
(function entCanvas () {
  const cv = $('#entCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, stars = [];

  function resize () {
    W = cv.width  = cv.offsetWidth  || innerWidth;
    H = cv.height = cv.offsetHeight || 600;
  }
  resize();
  window.addEventListener('resize', resize);

  class Star {
    constructor () { this.reset(); }
    reset () {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.2 + .2;
      this.a  = Math.random() * .5 + .1;
      this.sp = Math.random() * .4 + .05;
      this.phase = Math.random() * Math.PI * 2;
    }
    draw (t) {
      const alpha = this.a * (.5 + .5 * Math.sin(t * this.sp + this.phase));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 180; i++) stars.push(new Star());

  let t = 0;
  (function loop () {
    ctx.clearRect(0, 0, W, H);
    t += .02;
    stars.forEach(s => s.draw(t));
    requestAnimationFrame(loop);
  })();
})();

/* ─────────────────────────────────────────────────────────────
   13.  SVG RING ANIMATIONS
───────────────────────────────────────────────────────────── */
const RING_CIRC = 2 * Math.PI * 50;   // r=50

const ringDefs = [
  { wrap: '#rw1', arc: '#ra1', fill: .92 },
  { wrap: '#rw2', arc: '#ra2', fill: .78 },
  { wrap: '#rw3', arc: '#ra3', fill: .85 },
  { wrap: '#rw4', arc: '#ra4', fill: .65 },
];

ringDefs.forEach(def => {
  const wrap = $(def.wrap);
  const arc  = $(def.arc);
  if (!wrap || !arc) return;

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    animateRing(arc, def.fill);
    obs.disconnect();
  }, { threshold: 0.4 });
  obs.observe(wrap);
});

function animateRing (arc, fillFraction) {
  const target  = RING_CIRC * (1 - fillFraction);
  const dur     = 1600;
  const start   = performance.now();
  arc.style.strokeDashoffset = RING_CIRC;
  (function tick (now) {
    const t    = clamp((now - start) / dur, 0, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    arc.style.strokeDashoffset = RING_CIRC - (RING_CIRC - target) * ease;
    if (t < 1) requestAnimationFrame(tick);
    else arc.style.strokeDashoffset = target;
  })(start);
}

/* ─────────────────────────────────────────────────────────────
   14.  TILT EFFECT — bento cards, flip cards, etc.
───────────────────────────────────────────────────────────── */
$$('.bento, .fcard, .tier, .path, .dc').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const xPct = (e.clientX - r.left) / r.width  - .5;
    const yPct = (e.clientY - r.top)  / r.height - .5;
    card.style.transform = `perspective(900px) rotateY(${xPct*10}deg) rotateX(${-yPct*8}deg) translateZ(4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─────────────────────────────────────────────────────────────
   15.  FLIP CARDS
───────────────────────────────────────────────────────────── */
window.flipCard = function (card) {
  /* on mobile — toggle; desktop already uses CSS :hover */
  card.classList.toggle('flipped');
};

/* touch devices: tap-to-flip */
$$('.fcard').forEach(c => {
  c.addEventListener('touchend', e => {
    e.preventDefault();
    c.classList.toggle('flipped');
  });
});

/* ─────────────────────────────────────────────────────────────
   16.  TENANT FILTER
───────────────────────────────────────────────────────────── */
window.filterTenants = function (cat, btn) {
  /* update buttons */
  $$('.tf').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  $$('.tc').forEach(tc => {
    const show = cat === 'all' || tc.dataset.cat === cat;
    tc.classList.toggle('hide', !show);
  });
};

/* ─────────────────────────────────────────────────────────────
   17.  ROI CALCULATOR
───────────────────────────────────────────────────────────── */
let calcState = { size: 2000, tierMult: 1.8, catMult: 1.3 };

const tierMultipliers = { prime: 1.8, standard: 1.3, popup: 0.7 };
const szSlider  = $('#szSlider');
const szLabel   = $('#szLabel');
const szFill    = $('#szFill');

if (szSlider) {
  szSlider.addEventListener('input', () => {
    calcState.size = parseInt(szSlider.value);
    szLabel.textContent = Number(calcState.size).toLocaleString() + ' sq ft';
    updateSliderFill();
    calcUpdate();
  });
  updateSliderFill();
}

function updateSliderFill () {
  if (!szSlider || !szFill) return;
  const pct = (szSlider.value - szSlider.min) / (szSlider.max - szSlider.min) * 100;
  szFill.style.width = pct + '%';
}

window.setTier = function (btn, tier) {
  $$('#tierRow .pr').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  calcState.tierMult = tierMultipliers[tier] || 1.3;
  calcUpdate();
};

window.setCat = function (btn, mult) {
  $$('#catRow .pr').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  calcState.catMult = mult;
  calcUpdate();
};

window.calcUpdate = function () {
  const { size, tierMult, catMult } = calcState;
  const visitors  = Math.round((size / 20000) * 40e6 * tierMult * .003) / 10;
  const revenue   = Math.round(size * tierMult * catMult * 130);
  const roi       = +(tierMult * catMult * 1.8).toFixed(1);

  animateValue('#crVisitors', visitors >= 1 ? visitors.toFixed(1) + 'M' : Math.round(visitors * 1000) + 'K');
  animateValue('#crRevenue',  '$' + formatMoney(revenue));
  animateValue('#crROI',      roi + '×');

  /* bar widths */
  const vPct = clamp(visitors / 5 * 100, 10, 100);
  const rPct = clamp(revenue / 5e6 * 100, 10, 100);
  const oPct = clamp(roi / 6 * 100, 10, 100);
  const vb = $('#crVbar'), rb = $('#crRbar'), ob = $('#crObar');
  if (vb) vb.style.width = vPct + '%';
  if (rb) rb.style.width = rPct + '%';
  if (ob) ob.style.width = oPct + '%';
};

function animateValue (sel, newVal) {
  const el = $(sel);
  if (!el) return;
  el.style.transform = 'translateY(-6px)';
  el.style.opacity   = '0';
  setTimeout(() => {
    el.textContent     = newVal;
    el.style.transform = 'translateY(6px)';
    requestAnimationFrame(() => {
      el.style.transition = 'transform .35s cubic-bezier(.16,1,.3,1), opacity .35s';
      el.style.transform  = 'none';
      el.style.opacity    = '1';
    });
  }, 120);
}

function formatMoney (n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
  return n.toString();
}

/* initial calc render */
setTimeout(() => calcUpdate(), 600);

/* ─────────────────────────────────────────────────────────────
   18.  DINING SLIDER — drag + arrow
───────────────────────────────────────────────────────────── */
const dslider = $('#dslider');
if (dslider) {
  let isDown = false, startX = 0, scrollL = 0;

  dslider.addEventListener('mousedown', e => {
    isDown = true; startX = e.pageX - dslider.offsetLeft;
    scrollL = dslider.scrollLeft; dslider.classList.add('dragging');
  });
  window.addEventListener('mouseup', () => { isDown = false; dslider.classList.remove('dragging'); });
  dslider.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - dslider.offsetLeft;
    dslider.scrollLeft = scrollL - (x - startX) * 1.2;
  });

  /* touch */
  let tStart = 0, tScroll = 0;
  dslider.addEventListener('touchstart', e => { tStart = e.touches[0].pageX; tScroll = dslider.scrollLeft; }, { passive: true });
  dslider.addEventListener('touchmove',  e => {
    dslider.scrollLeft = tScroll - (e.touches[0].pageX - tStart);
  }, { passive: true });
}

window.dSlide = function (dir) {
  if (!dslider) return;
  dslider.scrollBy({ left: dir * 290, behavior: 'smooth' });
};

/* ─────────────────────────────────────────────────────────────
   19.  MAISON ACCORDION
───────────────────────────────────────────────────────────── */
window.toggleMaison = function (el) {
  const wasActive = el.classList.contains('active');
  $$('.maison').forEach(m => m.classList.remove('active'));
  if (!wasActive) el.classList.add('active');
};

/* ─────────────────────────────────────────────────────────────
   20.  VENUE SWITCHER
───────────────────────────────────────────────────────────── */
window.switchVenue = function (id, tabEl) {
  $$('.vtab').forEach(t => t.classList.remove('active'));
  $$('.vp').forEach(p => p.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  const panel = $('#vp-' + id);
  if (panel) {
    panel.classList.add('active');
    panel.style.animation = 'none';
    requestAnimationFrame(() => { panel.style.animation = ''; });
  }
};

/* ─────────────────────────────────────────────────────────────
   21.  SPONSORSHIP TIERS
───────────────────────────────────────────────────────────── */
window.selectTier = function (el, tierName) {
  $$('.tier').forEach(t => t.classList.remove('sel'));
  el.classList.add('sel');
  /* ripple */
  const rip = document.createElement('span');
  rip.style.cssText = `
    position:absolute;border-radius:50%;
    background:rgba(201,168,76,.15);
    width:200%;padding-bottom:200%;
    left:50%;top:50%;transform:translate(-50%,-50%) scale(0);
    animation:ripple .6s ease-out forwards;pointer-events:none;z-index:0;
  `;
  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(rip);
  setTimeout(() => rip.remove(), 700);
};

/* inject ripple keyframe once */
const ripStyle = document.createElement('style');
ripStyle.textContent = '@keyframes ripple{to{transform:translate(-50%,-50%) scale(1);opacity:0}}';
document.head.appendChild(ripStyle);

/* ─────────────────────────────────────────────────────────────
   22.  CONTACT PATHS
───────────────────────────────────────────────────────────── */
window.selectPath = function (el, type) {
  $$('.path').forEach(p => p.classList.remove('sel'));
  el.classList.add('sel');
  presetInquiry(type);
};

/* ─────────────────────────────────────────────────────────────
   23.  FORM — preset + submit
───────────────────────────────────────────────────────────── */
window.presetInquiry = function (type) {
  const sel = $('#fType');
  if (!sel) return;
  const opts = $$('option', sel);
  for (const o of opts) {
    if (o.textContent.toLowerCase().includes(type.toLowerCase().slice(0, 10))) {
      sel.value = o.value; break;
    }
  }
};

window.submitForm = function (e) {
  e.preventDefault();
  const btn    = $('#formSub');
  const txt    = $('#subTxt');
  const ico    = $('#subIco');
  const spin   = $('#subSpin');
  const form   = $('#contactForm');
  const ok     = $('#formOK');

  btn.disabled = true;
  txt.style.opacity = '0'; ico.style.opacity = '0';
  spin.classList.add('show');

  setTimeout(() => {
    spin.classList.remove('show');
    form.style.transition = 'opacity .4s, transform .4s';
    form.style.opacity    = '0';
    form.style.transform  = 'translateY(-12px)';
    setTimeout(() => {
      form.style.display = 'none';
      ok.classList.add('show');
    }, 400);
  }, 1600);
};

window.resetForm = function () {
  const form = $('#contactForm');
  const ok   = $('#formOK');
  const btn  = $('#formSub');
  const txt  = $('#subTxt');
  const ico  = $('#subIco');

  ok.classList.remove('show');
  form.style.display   = '';
  form.style.opacity   = '1';
  form.style.transform = 'none';
  form.reset();
  btn.disabled         = false;
  txt.style.opacity    = '1';
  ico.style.opacity    = '1';
};

/* helper: scroll to section */
window.scrollTo = function (id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

/* ─────────────────────────────────────────────────────────────
   24.  MODALS
───────────────────────────────────────────────────────────── */
window.openReel = function () {
  const modal = $('#reelModal');
  const frame = $('#reelFrame');
  frame.src = 'https://www.youtube.com/embed/YEKsgfP5-s8?autoplay=1&rel=0&modestbranding=1';
  modal.classList.add('open');
  document.body.classList.add('no-scroll');
};

window.openLuxModal = function () {
  $('#luxModal').classList.add('open');
  document.body.classList.add('no-scroll');
};

const ATTRACTIONS = {
  nick: {
    ico: '🎢',
    tag: 'INDOOR THEME PARK · WESTERN HEMISPHERE\'S LARGEST',
    name: 'Nickelodeon Universe',
    desc: 'The largest indoor theme park in the Western Hemisphere, spanning 8 themed acres with 35+ rides and attractions. All-weather, all year-round, anchored by beloved Nickelodeon IP including SpongeBob, PAW Patrol, and Avatar. Generates over 8M park visits annually — a standalone destination that fills the mall with captive, extended-stay visitors.',
    stats: [
      { v:'35+',  l:'Rides' },
      { v:'8',    l:'Themed Acres' },
      { v:'365',  l:'Days/Year' },
      { v:'8M+',  l:'Park Visits/Yr' },
    ],
  },
  water: {
    ico: '🌊',
    tag: 'NORTH AMERICA\'S LARGEST INDOOR WATER PARK',
    name: 'DreamWorks Water Park',
    desc: 'North America\'s largest indoor water park — themed around beloved DreamWorks IP including Shrek, How to Train Your Dragon, and Trolls. 40 slides and attractions, a wave pool, and fully climate-controlled year-round operation. Draws destination visitors from across the Eastern Seaboard.',
    stats: [
      { v:'40',       l:'Slides' },
      { v:'Year-Round', l:'Operation' },
      { v:'1.1M+',    l:'Visits/Yr' },
      { v:'DreamWorks', l:'IP' },
    ],
  },
  snow: {
    ico: '⛷️',
    tag: 'AMERICA\'S ONLY REAL INDOOR SNOW',
    name: 'Big SNOW',
    desc: 'America\'s only real snow indoor ski and snowboard resort. Six slopes of varying difficulty, a terrain park, and a dedicated learning center — all at 28°F regardless of the season outside. Attracts skiing enthusiasts from the entire NY metro area who previously traveled to Vermont or Colorado.',
    stats: [
      { v:'6',      l:'Slopes' },
      { v:'28°F',   l:'Year-Round' },
      { v:'Real',   l:'Snow' },
      { v:'All Ages', l:'Skill Levels' },
    ],
  },
  wheel: {
    ico: '🎡',
    tag: 'OBSERVATION WHEEL · 300 FEET HIGH',
    name: 'The Wheel',
    desc: 'A 300-foot observation wheel offering panoramic views of the New York City skyline, MetLife Stadium, and the surrounding New Jersey landscape. Private gondola experiences available for events and brand activations. A natural gathering point visible from miles away — an iconic architectural beacon for the entire property.',
    stats: [
      { v:'300 ft', l:'Height' },
      { v:'NYC',    l:'Skyline Views' },
      { v:'Private', l:'Gondola Hire' },
      { v:'Iconic',  l:'Landmark' },
    ],
  },
  ice: {
    ico: '🏒',
    tag: 'NHL-REGULATION ICE RINK',
    name: 'The Rink',
    desc: 'An NHL-regulation ice rink at the heart of the mall — convertible to a 5,000-standing-capacity event floor for concerts, esports, and brand experiences. Surrounded by the property\'s daily foot traffic, every event here enjoys pre-built audience exposure before doors even open. Private buyout available year-round.',
    stats: [
      { v:'NHL',     l:'Regulation' },
      { v:'5,000',   l:'Event Standing' },
      { v:'Convert', l:'To Event Floor' },
      { v:'Private', l:'Buyout Avail.' },
    ],
  },
};

window.openAttr = function (id) {
  const a = ATTRACTIONS[id];
  if (!a) return;
  const body = $('#attrBody');
  body.innerHTML = `
    <div class="ab-ico">${a.ico}</div>
    <span class="ab-tag">${a.tag}</span>
    <h3>${a.name}</h3>
    <p>${a.desc}</p>
    <div class="ab-stats">
      ${a.stats.map(s => `<div class="abs"><div class="abs-v">${s.v}</div><div class="abs-l">${s.l}</div></div>`).join('')}
    </div>
    <a href="#contact" class="btn-g" onclick="closeModal('attrModal');presetInquiry('${a.name}')">
      Partner Inquiry <i class="fas fa-arrow-right"></i>
    </a>
  `;
  $('#attrModal').classList.add('open');
  document.body.classList.add('no-scroll');
};

window.closeModal = function (id) {
  const modal = $('#' + id);
  modal.classList.remove('open');
  document.body.classList.remove('no-scroll');
  /* stop reel video */
  if (id === 'reelModal') {
    setTimeout(() => { $('#reelFrame').src = ''; }, 400);
  }
};

/* close on Escape */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    $$('.modal.open').forEach(m => closeModal(m.id));
  }
});

/* ─────────────────────────────────────────────────────────────
   25.  TICKER — pause on hover (CSS handles, ensure dup)
───────────────────────────────────────────────────────────── */
/* already duplicated in HTML for seamless loop — no extra JS needed */

/* ─────────────────────────────────────────────────────────────
   26.  LUXURY PILLS — magnetic hover
───────────────────────────────────────────────────────────── */
$$('.lux-pill').forEach(pill => {
  pill.addEventListener('mousemove', e => {
    const r  = pill.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) * .35;
    const dy = (e.clientY - (r.top  + r.height / 2)) * .35;
    pill.style.transform = `translate(${dx}px,${dy}px) scale(1.05)`;
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.transform = '';
  });
});

/* ─────────────────────────────────────────────────────────────
   27.  PARALLAX — subtle on scroll
───────────────────────────────────────────────────────────── */
const luxFrame = $('#luxFrame');
window.addEventListener('scroll', () => {
  if (!luxFrame) return;
  const rect = luxFrame.getBoundingClientRect();
  if (rect.top > innerHeight || rect.bottom < 0) return;
  const yPct  = (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight;
  luxFrame.style.transform = `translateY(${yPct * 24}px)`;
}, { passive: true });

/* ─────────────────────────────────────────────────────────────
   28.  BRAND LOGO ROW — stagger on scroll
───────────────────────────────────────────────────────────── */
const brandObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    $$('.br', e.target).forEach((br, i) => {
      setTimeout(() => {
        br.style.transition = 'opacity .5s ease, transform .5s cubic-bezier(.16,1,.3,1)';
        br.style.opacity    = '1';
        br.style.transform  = 'none';
      }, i * 60);
    });
    brandObs.unobserve(e.target);
  });
}, { threshold: 0.2 });

const brandRow = $('#brandLogos');
if (brandRow) {
  $$('.br', brandRow).forEach(br => {
    br.style.opacity = '0'; br.style.transform = 'translateY(14px)';
  });
  brandObs.observe(brandRow);
}

/* ─────────────────────────────────────────────────────────────
   29.  CELEBRITY WALL — random shimmer
───────────────────────────────────────────────────────────── */
const celebGrid = $('#celebGrid');
if (celebGrid) {
  setInterval(() => {
    const spans = $$('span', celebGrid);
    const pick  = spans[Math.floor(Math.random() * spans.length)];
    pick.style.transition = 'color .4s, border-color .4s';
    pick.style.color       = 'var(--g)';
    pick.style.borderColor = 'var(--g25)';
    setTimeout(() => {
      pick.style.color       = '';
      pick.style.borderColor = '';
    }, 900);
  }, 1400);
}

/* ─────────────────────────────────────────────────────────────
   30.  SMOOTH ANCHOR SCROLL (override browser default)
───────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    closeDrawer();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─────────────────────────────────────────────────────────────
   31.  VENUE PANEL FADE-IN ANIMATION (inject CSS)
───────────────────────────────────────────────────────────── */
const vpStyle = document.createElement('style');
vpStyle.textContent = `
  .vp.active { animation: vpFadeIn .5s cubic-bezier(.16,1,.3,1) both; }
  @keyframes vpFadeIn { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
  .fcard.flipped .fcard-f { transform: rotateY(-180deg); }
  .fcard.flipped .fcard-b { transform: rotateY(0deg); }
`;
document.head.appendChild(vpStyle);

/* ─────────────────────────────────────────────────────────────
   32.  INIT SEQUENCE
───────────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  /* trigger scroll state */
  window.dispatchEvent(new Event('scroll'));
  /* initial slider fill */
  updateSliderFill();
  /* ensure first calc render */
  calcUpdate();
});

})();
