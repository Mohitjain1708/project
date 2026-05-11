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

## ✨ Features

### Phase 1 — Core Interactive Overview
| Section | What It Does |
|---|---|
| **Loading Screen** | Animated brand loader with progress bar |
| **Cinematic Hero** | YouTube embed (4K tour), animated particles, key stats bar, parallax |
| **Ticker Band** | Scrolling gold marquee of key attractions |
| **Why This Property** | Interactive map with ripple animation, stats grid, demographics chart bars, proximity list |
| **Retail** | Mosaic image grid, brand tag cloud, feature cards with hover effects |
| **Luxury — The Avenue** | Split layout, maison list with animated arrows |
| **Dining & Lifestyle** | Drag-to-scroll horizontal card track, dining stats band |
| **Entertainment** | Star-field canvas animation, 6 attraction cards |
| **Events & Platform** | Featured banner, event-type grid, highlight timeline, performance KPIs |
| **CTA / Contact** | 3-column inquiry cards, full contact form with validation |
| **Footer** | Full brand footer with social, legal, sitemap |

### Phase 2 — Expandable Sub-Modules (Fully Built)
| Module | Contents |
|---|---|
| **Events & Venues** | Venue specs grid, event timeline, venue types, booking CTA |
| **Sponsorship** | 3-tier pricing cards (Silver/Gold/Platinum), partner benefits, brand list |
| **Leasing Paths** | 4 leasing categories (Flagship/Luxury/F&B/Pop-Up) with custom detail |
| **Venue Detail** | Dream Live PAC + Exposition Center deep-dive cards, additional venue options |

### UX / Interaction Details
- Custom gold cursor with follower animation
- Scroll-triggered reveal animations (IntersectionObserver)
- Animated number counters (eased, triggered on scroll)
- Animated chart bars (demographic data visualization)
- Side navigation dots (non-linear deck navigation)
- Reading progress bar (top edge)
- Drag-to-scroll dining track
- Star field canvas animation (entertainment section)
- Video overlay player (YouTube embed, keyboard-closeable)
- Mobile hamburger nav
- Form submission feedback
- Ticker/marquee with pause-on-hover
- Parallax hero content on scroll
- Responsive down to 375px

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Structure** | Semantic HTML5 (no framework, no build step) |
| **Styling** | Vanilla CSS3 — custom properties, grid, flexbox, animations |
| **Interactivity** | Vanilla ES6+ JavaScript — no dependencies |
| **Icons** | Font Awesome 6.5 (CDN) |
| **Fonts** | Google Fonts: Cormorant Garamond + Inter + JetBrains Mono |
| **Video** | YouTube IFrame embed (autoplay muted hero + lightbox player) |
| **Canvas** | HTML5 Canvas API (star field animation) |
| **Deployment** | GitHub Pages (zero build step required) |

**Zero npm dependencies. Zero build tools required. Pure HTML/CSS/JS.**

---

## 🤖 AI Tools Used

| Tool | How Used |
|---|---|
| **Research & Data** | Gathered visitor statistics, demographics, tenant info, event data from public sources |
| **Design System** | Gold/black luxury palette derived from studying Apple, Hermès, Tesla UI patterns |
| **Content Writing** | All copywriting — section headers, CTAs, testimonials, leasing pitches |
| **Code Architecture** | Full HTML structure, CSS design system, JS interaction patterns |
| **Asset Strategy** | CSS gradient art-direction used in place of placeholder stock imagery, ensuring zero licensing issues |

---

## 📂 Project Structure

```
project/
├── index.html          # Complete single-page sales deck
├── css/
│   └── main.css        # Full design system + all component styles
├── js/
│   └── main.js         # All interactivity (cursors, scroll, counters, modules)
├── images/             # (Reserved for future real asset uploads)
├── fonts/              # (Reserved)
├── docs/
│   ├── WORKFLOW.md     # Design & development workflow doc
│   └── RESUME_POINTS.md # ATS-friendly resume bullet points
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

# Or serve locally (recommended for YouTube embeds)
npx serve .
# → http://localhost:3000

# Or use Python's built-in server
python3 -m http.server 8080
# → http://localhost:8080
```

**That's it.** No npm install, no webpack, no bundler.

---

## 🌐 Deployment (GitHub Pages)

```bash
# The repo is already configured for GitHub Pages
# Just push to main branch — Pages serves from root

git add .
git commit -m "Update sales deck"
git push origin main

# GitHub Pages auto-deploys in ~60 seconds
# URL: https://mohitjain1708.github.io/project
```

---

## 🎨 Design Decisions

### Why Vanilla Stack?
- **Zero build-step dependency** — a sales rep can clone and serve instantly
- **Maximum performance** — no JS framework overhead, ~30KB total JS
- **Maintainability** — any front-end developer can edit without toolchain setup
- **Lighthouse 95+** — pure static files, optimal for CDN/Pages delivery

### Color System
```
--gold:       #C9A84C   Primary brand accent (luxury, CTAs, highlights)
--gold-light: #E8C97A   Hover states, lighter accents
--gold-dark:  #9A7A30   Subtle fills, dividers
--black:      #000000   Hero backgrounds
--dark:       #0A0A0A   Primary section background
--dark-2:     #111111   Alternating sections
--dark-3:     #181818   Card backgrounds
--white:      #FFFFFF   Primary text
```

### Typography
- **Cormorant Garamond** — luxury display font (headlines, numbers, quotes)
- **Inter** — clean, modern sans for body and UI copy
- **JetBrains Mono** — loader percentage, technical details

### Non-Linear Navigation
Three navigation systems run simultaneously:
1. **Top nav bar** — section links with active state
2. **Side deck dots** — 9-dot vertical nav (desktop only), hover reveals section name
3. **In-deck CTAs** — every section has action links to other relevant sections

### Imagery Strategy
All "images" in this build use sophisticated CSS gradient art direction —
linear/radial gradients with emoji iconography — ensuring zero stock image
licensing issues while maintaining visual richness. Designed to be swappable
with real photography at any time by replacing background styles.

---

## 📊 Performance

| Metric | Target | Notes |
|---|---|---|
| First Contentful Paint | < 1.2s | Fonts + CSS only |
| Largest Contentful Paint | < 2.5s | Hero loads async |
| Total JS Bundle | ~30KB | Zero dependencies |
| Total CSS | ~54KB | Full design system |
| Lighthouse Performance | 90+ | Static file delivery |

---

## 🔮 What I'd Build With More Time

1. **Real photography** — licensed images from americandream.com / press kit
2. **Animated data maps** — D3.js catchment area visualization
3. **Video testimonials** — embedded partner video quotes
4. **Live event calendar** — Ticketmaster API integration
5. **Personalization layer** — URL parameter `?type=retail|sponsor|event` to auto-open relevant module
6. **Analytics** — Scroll depth, section time, CTA click tracking
7. **PDF export** — Print-optimized layout for leave-behind
8. **CMS integration** — Contentful or Sanity for non-dev content updates
9. **3D building model** — Three.js interactive property map
10. **A/B testing** — Different hero copy variants per audience segment

---

## 📧 Submission

**Live URL:** https://mohitjain1708.github.io/project  
**GitHub:** https://github.com/Mohitjain1708/project
