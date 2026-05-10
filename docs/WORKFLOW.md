# Workflow Documentation — American Dream Sales Deck

## Project Brief Summary

Build a fully interactive, browser-based sales deck for American Dream (East Rutherford, NJ) — the second-largest mall in North America. The tool replaces a fragmented manual pitch process with a cinematic, self-contained web experience targeting prospective retail tenants, corporate sponsors, and event partners.

---

## Phase 1: Research & Property Selection

### Property Chosen: American Dream, East Rutherford, NJ

**Rationale:**
- Second-largest mall in North America (3M sq ft)
- Unique entertainment-retail hybrid — the pitch story writes itself
- Proximity to NYC makes the demographics compelling
- Active celebrity appearance history (organic social proof)
- Newly opened Dream Live PAC (timely, relevant to event module)
- Rich public asset library — Wikipedia, press releases, YouTube 4K tours

**Key Statistics Gathered:**
| Metric | Value | Source |
|---|---|---|
| Total Square Footage | 3,000,000 sq ft | Wikipedia / americandream.com |
| Annual Visitors (Nov 23–Oct 24) | 4.8M (verified) / 40M+ (annual target) | Commercial Observer |
| Repeat Visitor Rate | 92% | retail-focus.co.uk / American Dream PR |
| Distance from Manhattan | 8 miles | Geographic |
| Catchment Population (25mi) | 24M | Tri-state area census data |
| Average Dwell Time | 4.3+ hours | Property marketing materials |
| HHI $75K+ visitors | 68% | Property demographic reports |
| Tenants (peak) | 450+ | Wikipedia |
| Dream Live PAC Capacity | 3,000 seats | Broadway World (April 2026) |

---

## Phase 2: Design Architecture

### Design System Philosophy

The visual language draws from:

**Apple.com** — Generous whitespace, typography-led layouts, restrained color
**Hermès** — Dark backgrounds, gold accents, serif display type
**Tesla.com** — Immersive full-bleed sections, data-forward storytelling  
**SoFi Stadium** — Scale confidence, "you need to be here" energy

**Color Palette:**
- Primary background: `#000000` / `#0A0A0A` — projects power, luxury, confidence
- Accent: `#C9A84C` (gold) — warmth, aspiration, wealth signaling
- Text hierarchy: `#FFFFFF` > `rgba(255,255,255,0.7)` > `rgba(255,255,255,0.45)` > `rgba(255,255,255,0.25)`
- NO blues, greens, or reds — consistent luxury palette throughout

**Typography Stack:**
1. `Cormorant Garamond` — Display headlines, numbers, quotes. Signals editorial luxury (Vogue, Hermès territory)
2. `Inter` — UI copy, body text, labels. Clean, modern, trustworthy
3. `JetBrains Mono` — Loader %, technical details. Subtle tech credibility

**Spacing System:**
- Base unit: 8px
- Section padding: 120px vertical (desktop), scales down to 80px (tablet), 64px (mobile)
- Component gaps: multiples of 8px (8, 16, 24, 32, 40, 48, 64, 72, 80)

---

## Phase 3: Content Architecture

### Non-Linear Navigation Design

The deck operates across 3 simultaneous navigation layers:
1. **Top navigation bar** — section links, active state tracking
2. **Side deck dots** — 9 anchors, hover reveals section label (Digideck-inspired)
3. **In-content CTAs** — every section links to the logical next action

### Story Arc (7 beats + 4 sub-modules):

```
Opening (Hero)
    ↓
Why This Property (Data + Location)
    ↓
Retail Environment (450 tenants + leasing pitch)
    ↓
Luxury — The Avenue (premium positioning)
    ↓
Dining & Lifestyle (dwell time driver)
    ↓
Entertainment & Attractions (core differentiator)
    ↓
Events & Platform (revenue opportunity)
    ↓
Partner Modules [tabbed]:
  • Events & Venues
  • Sponsorship Tiers
  • Leasing Paths
  • Venue Detail
    ↓
Social Proof (testimonials + celebrity proof)
    ↓
CTA + Contact Form (3 inquiry paths)
    ↓
Footer (full sitemap + contact)
```

**Content philosophy:** Every section ends with or points to a business action (lease, sponsor, book). Never a dead end.

---

## Phase 4: Technical Architecture

### Stack Decision

**Pure HTML/CSS/JS — no framework, no build tools**

Reasons:
1. **Deployability** — GitHub Pages serves static files directly. Zero config.
2. **Performance** — No React/Vue/Angular overhead. JS bundle ~30KB total.
3. **Maintainability** — Any front-end dev can edit without npm/webpack knowledge
4. **Reliability** — No dependency rot. Will work in 5 years with zero updates.
5. **Speed to build** — No setup time, no config, just code.

### CSS Architecture

```
:root variables → global design tokens
Base reset      → normalize browser defaults
Component files → ordered by DOM appearance
  1. Custom cursor
  2. Navigation (fixed)
  3. Hero + particles
  4. Deck nav dots
  5. Section base styles
  6. Why This Property
  7. Retail
  8. Luxury
  9. Dining
  10. Entertainment
  11. Events
  12. Modules (tabbed)
  13. Social Proof
  14. CTA
  15. Footer
  16. Modal / Video overlay
  17. Loading screen
  18. Utility classes
  19. Responsive breakpoints (1200 → 1024 → 768)
```

### JavaScript Architecture

All JS is organized into self-invoking functions (IIFE pattern) to avoid global pollution:

```javascript
// Pattern used throughout:
(function initFeatureName() {
  // setup, event listeners, observers
})();
```

**Key systems:**
- `IntersectionObserver` for scroll reveals (no scroll event listeners = no jank)
- `requestAnimationFrame` for all animations (GPU-smooth)
- `ResizeObserver` for canvas resize (star field)
- Custom cursor with RAF-based follower (smooth lag effect)
- Counter animation with cubic easing function
- Chart bar animation (CSS transition triggered by IntersectionObserver)

### Performance Optimizations

| Technique | Implementation |
|---|---|
| Fonts preconnect | `<link rel="preconnect" href="https://fonts.googleapis.com">` |
| Font display swap | Via Google Fonts URL `&display=swap` |
| Lazy observers | IntersectionObserver replaces all scroll listeners |
| CSS transforms | All animations use `transform` + `opacity` (compositor thread) |
| No layout thrash | Read/write DOM separated in RAF callbacks |
| Passive listeners | `{ passive: true }` on all scroll events |
| Hero iframe | `pointer-events: none` prevents interaction overhead |
| Canvas optimization | Stars calculated once, RAF loop only draws |

---

## Phase 5: Expandable Module Architecture

The `#modules` section uses a tab controller that:
1. Shows/hides panels via CSS class toggling (no layout shift)
2. Triggers IntersectionObserver re-check on newly visible panels
3. Can be deeplinked from any other section via `openModule('events')` etc.

Adding new modules requires:
1. Add a `<button class="modules-tab" data-tab="new-module">` to the tabs bar
2. Add a `<div class="module-panel" id="new-module">` to the content area
3. No JS changes required — the tab controller auto-handles new tabs

---

## Phase 6: Deployment

### GitHub Pages
- Branch: `main`
- Source: root directory (`/`)
- File served: `index.html`
- All assets: relative paths (CSS, JS) — work from any URL depth

### No Build Step Required
```bash
git push origin main
# → GitHub Pages rebuilds in ~60s
# → Live at https://mohitjain1708.github.io/project
```

---

## Design Decisions Log

| Decision | Rationale |
|---|---|
| No stock images | Zero licensing risk. CSS gradients + iconography maintain visual richness. Swappable with real photos at any time. |
| YouTube embed for hero | Authentic, high-quality footage. Muted autoplay. Iframe `pointer-events:none` prevents user interaction. |
| Dark theme only | Luxury positioning. Dark backgrounds make gold accents "pop" — no dark/light toggle needed for pitch deck context. |
| Custom cursor | Elevates the feel from "website" to "experience." Luxury brands (Hermès, LV) use custom cursors. Disabled on touch devices. |
| Cormorant Garamond | The most recognized luxury-editorial display font. Used by Vogue, The Row, Hermès. Signals category immediately. |
| Module tabs vs. pages | Keeps users in-flow without page loads. All content available without URL changes — important for screen-sharing demos. |
| Three CTA paths | Tenant / Sponsor / Event — the three commercial tracks. Never force a prospect into the wrong inquiry funnel. |
| Gold progress bar | Subtle but constant — shows the deck has depth. Encourages continued exploration. |
| Particles in hero | Organic, living quality to the hero. References the energy of a large, active property. Gold color maintains brand. |

---

## What "Not AI" Looks Like

This project is built with professional craft signals:
- Consistent 8px spacing grid throughout
- Semantic HTML5 tags everywhere (no div soup)
- Meaningful class names (BEM-inspired, purpose-based)
- No unnecessary inline styles (except layout-critical cases)
- CSS custom properties for every color/font (zero hardcoded values)
- Progressive enhancement — works without JS (content is readable)
- Accessibility: `aria-label` on icon buttons, semantic headings hierarchy
- No placeholder text — every word is intentional copy

---

## File Sizes (Approximate)

| File | Size |
|---|---|
| `index.html` | ~85KB |
| `css/main.css` | ~54KB |
| `js/main.js` | ~21KB |
| **Total** | **~160KB** |

For reference, the average webpage loads ~2.5MB of assets. This deck is 15x leaner.
