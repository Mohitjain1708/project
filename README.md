# American Dream — Interactive Sales Deck

> A cinematic, browser-based sales deck for American Dream — North America's second-largest mall and most ambitious mixed-use destination. Built for commercial teams to pitch retail tenants, corporate sponsors, and event partners.

---

## 🔗 Live Demo

**GitHub Repository:** [https://github.com/Mohitjain1708/project](https://github.com/Mohitjain1708/project)

**GitHub Pages URL:** [https://mohitjain1708.github.io/project](https://mohitjain1708.github.io/project)

---

## 🏛️ Property: American Dream, East Rutherford NJ

Selected as the subject for this deck — the most compelling pitch candidate in North America:

- **3 million sq ft** of retail, entertainment, dining, and live events
- **40M+ annual visitors** with 4.3-hour average dwell time
- **8 miles from Midtown Manhattan** — largest consumer market on Earth
- **24M people** within a 25-mile catchment
- Nickelodeon Universe (largest indoor theme park, Western Hemisphere)
- DreamWorks Water Park (largest indoor water park, North America)
- Big SNOW (America's only indoor real-snow ski resort)
- Dream Live Performing Arts Center (3,000-seat, opened April 2026)
- The Avenue luxury wing: Hermès, Tiffany, Dolce & Gabbana

---

## ✨ Features (v4)

### Core Sections
| Section | What It Does |
|---|---|
| **Loading Screen** | Animated brand loader with SVG progress ring + percentage counter |
| **Cinematic Hero** | YouTube embed (4K tour), animated particles, key stats bar, parallax |
| **Ticker Band** | Scrolling gold marquee of key attractions (pauses on hover) |
| **Why This Property** | Animated radar canvas, stats grid, demographic bars, proximity list |
| **Retail** | Mosaic image grid, brand tag cloud, feature cards with hover effects |
| **Luxury — The Avenue** | Split layout, maison accordion with animated arrows |
| **Dining & Lifestyle** | Drag-to-scroll card track, animated dining stat counters |
| **Entertainment** | Star-field + shooting-star canvas, 5 attraction cards with detail modals |
| **Events & Platform** | Featured banner, event-type grid, highlight timeline, KPIs |
| **CTA / Contact** | Inquiry path cards, full contact form with floating labels + validation |
| **Footer** | Full brand footer with social links, legal, sitemap |

### v4 New Visual Systems
| System | Description |
|---|---|
| **Film Grain Overlay** | SVG `feTurbulence` noise at `opacity:.028` — subtle tactile texture across all sections |
| **Hero Ambient Orbs** | 3 blurred gold glow orbs with independent CSS keyframe float animations |
| **Typewriter Eyebrow** | Character-by-character text reveal on hero eyebrow with blinking cursor |
| **Blur-in H1 Words** | Each word enters with `filter:blur(8px)→0` + translateY stagger |
| **Stat Pulse Rings** | Expanding border animation on each hero stat pill (`@keyframes statPulse`) |
| **Sparkle Burst** | 8-dot radial particle explosion triggered when any counter completes |
| **Back-to-Top Button** | Fixed position, SVG ring tracks scroll progress (stroke-dashoffset), smooth-scrolls to top |
| **Section Dividers** | Gradient gold line dividers with `✦` center mark between every section pair |
| **Bento Shimmer** | Shine sweep across bento cards on hover (`translateX -100%→100%`) |
| **Glowing Card Borders** | CSS `background-clip: padding-box + border-box` gradient border trace on attraction cards |
| **Floating Label Form** | Labels float above input on focus/fill via pure CSS `:not(:placeholder-shown)` — zero JS |
| **Real-time Validation** | Blur-triggered `.fg.invalid` class with shake animation on submit attempt |
| **Dining Stat Counters** | IntersectionObserver + `data-pfx` prefix support (e.g. `$42`) with sparkle on completion |
| **Data-Cursor Labels** | `data-cursor="Explore"` on attraction cards renders in custom cursor |
| **Btn Shine Sweep** | `::before` gradient sweep on `.btn-g` and submit button hover |

### All UX Interactions
- Lerp-interpolated custom gold cursor with `data-cursor` label system
- Scroll-triggered reveal animations (IntersectionObserver)
- Animated number counters with `easeOutExpo` + sparkle completion burst
- Animated SVG rings (demographics / stats visualization)
- Side navigation dots + top nav with active state tracking
- Reading progress bar (top edge)
- Drag-to-scroll + arrow-control dining track
- Radar canvas with sweep animation + location pings
- Star field + shooting star canvas (entertainment)
- Video lightbox (YouTube embed, ESC-closeable)
- Attraction detail modals (data-driven content injection)
- Flip cards (ROI section)
- Tenant filter chips (retail section)
- ROI calculator (slider + tier/category multipliers)
- Maison accordion (luxury section)
- Venue switcher tabs (events section)
- Sponsorship tier selector → pre-fills form
- Leasing path selector → pre-fills form + smooth scrolls
- 3D perspective tilt on bento/attraction/tier/dining cards
- Celebrity grid staggered entrance animation
- Brand logo hover glow
- Magnetic hover on luxury pills
- Mobile hamburger nav + click-outside-to-close drawer
- Keyboard navigation (Arrow/PageUp/PageDown between sections)
- Form submit guard — validates all required fields before submission

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Structure** | Semantic HTML5 (no framework, no build step) |
| **Styling** | Vanilla CSS3 — custom properties, grid, flexbox, keyframe animations |
| **Interactivity** | Vanilla ES6+ JavaScript — zero dependencies |
| **Icons** | Font Awesome 6.5 (CDN) |
| **Fonts** | Google Fonts: Cormorant Garamond + Inter + JetBrains Mono |
| **Video** | YouTube IFrame embed (autoplay muted hero + lightbox player) |
| **Canvas** | HTML5 Canvas API (particle field, star field, radar sweep) |
| **Server** | Node.js static file server via PM2 (development) |
| **Deployment** | GitHub Pages (zero build step required) |

**Zero npm dependencies. Zero build tools required. Pure HTML/CSS/JS.**

---

## 📂 Project Structure

```
project/
├── index.html          # Complete single-page sales deck (v4)
├── css/
│   └── main.css        # Full design system + all component styles (v4)
├── js/
│   └── main.js         # All interactivity — 22 global fns + 32+ systems (v4)
├── images/
│   └── favicon.svg     # Gold ✦ SVG favicon
├── server.js           # Static file server (Node.js, port 3000)
├── ecosystem.config.cjs # PM2 config (process: american-dream)
└── README.md
```

---

## 🚀 Setup & Local Development

```bash
# Clone the repository
git clone https://github.com/Mohitjain1708/project.git
cd project

# No build step required — open directly
open index.html

# Or serve locally (recommended for YouTube embeds + module paths)
node server.js
# → http://localhost:3000

# Or with PM2
pm2 start ecosystem.config.cjs
# → http://localhost:3000
```

---

## 🌐 Deployment (GitHub Pages)

```bash
# Already configured for GitHub Pages
# Push to main branch — Pages serves from root

git add .
git commit -m "Update sales deck"
git push origin main

# GitHub Pages auto-deploys in ~60 seconds
# URL: https://mohitjain1708.github.io/project
```

---

## 🎨 Design Language

### Color System
```
--g  / --gold:    #C9A84C   Primary brand accent (luxury, CTAs, highlights)
--blk:            #080808   Base dark background
--d1:             #0e0e0e   Section alternate background
--d2:             #141414   Card backgrounds
--w10…w70:        rgba white at varying opacity levels
```

### Typography
- **Cormorant Garamond** — luxury display (headlines, numbers, quotes)
- **Inter** — clean modern sans (body, UI copy, labels)
- **JetBrains Mono** — loader percentage, technical callouts

### Design Philosophy
- **Dark luxury** aesthetic: obsidian base, gold as the only accent
- **Film grain overlay** at 2.8% opacity — adds tactile, printed-material quality
- **Ambient lighting** via blurred radial glow orbs in the hero
- **Motion hierarchy**: macro (canvas), meso (section reveals), micro (hover states)
- All "images" use CSS gradient art direction — zero stock image licensing issues

---

## 📊 Performance

| Metric | Target | Notes |
|---|---|---|
| First Contentful Paint | < 1.2s | Fonts + CSS only |
| Largest Contentful Paint | < 2.5s | Hero loads async |
| Total JS | ~42KB | Zero dependencies |
| Total CSS | ~59KB | Full v4 design system |
| Lighthouse Performance | 90+ | Static file delivery |

---

## 📋 Version History

| Version | Commit | Highlights |
|---|---|---|
| **v4** | `cd45dbb` | Typewriter, back-to-top ring, sparkle burst, film grain, hero orbs, blur-in H1, dstat counters, floating label form, glowing borders, section dividers |
| **v3** | `5dc2131` | Full rebuild — particle canvas, radar, ROI calc, flip cards, attraction modals, luxury modal, star field, shooting stars, 3D tilt |
| **v2** | *(earlier)* | Interactive systems, custom cursor, counter animations |
| **v1** | *(earlier)* | Core layout, design system, sections |

---

## 🔮 What I'd Build With More Time

1. **Real photography** — licensed images from americandream.com press kit
2. **Animated data maps** — D3.js catchment area visualization
3. **Video testimonials** — embedded partner video quotes
4. **Live event calendar** — Ticketmaster API integration
5. **Personalization layer** — `?type=retail|sponsor|event` URL params to auto-open relevant module
6. **Analytics** — Scroll depth, section dwell time, CTA click tracking
7. **PDF export** — Print-optimized layout for leave-behind
8. **CMS integration** — Contentful or Sanity for non-dev content updates
9. **3D building model** — Three.js interactive property map
10. **A/B testing** — Different hero copy variants per audience segment

---

## 📧 Contact

**Live URL:** https://mohitjain1708.github.io/project  
**GitHub:** https://github.com/Mohitjain1708/project
