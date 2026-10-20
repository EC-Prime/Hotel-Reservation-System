# 🏛 The Grand Reserve Boutique & Spa — Official Design System & Style Guide

> **Document Version:** 1.0.0  
> **Classification:** Architectural Standards & Engineering Brief  
> **Brand Identity:** Obsidian Black & Radiant Champagne Gold (`#0B0E14` & `#C5A869`)  
> **Target Platform:** Hybrid Web Portal (HTML5, Modular CSS3, ES6 JavaScript)

---

## 1. Design Philosophy & Aesthetic Vision

The visual language of **The Grand Reserve Boutique & Spa** embodies an atmosphere of nocturnal intimacy, understated opulence, and architectural prestige. 

Every component is governed by three foundational tenets:
1. **Nocturnal Intimacy (Obsidian & Deep Charcoal Navy):** Rather than harsh pure blacks, the backgrounds leverage deep blue-black hues (`#0B0E14` and `#080B11`) that absorb light while creating exceptional contrast for gold accents and crisp typography.
2. **Champagne Gold Brilliance:** Gold is not applied gratuitously. It is reserved for high-value affordances: active badges, primary rates, reservation actions, and subtle borders with soft ambient drop-shadows.
3. **Architectural Restraint:** Thin 1px subtle borders (`rgba(255, 255, 255, 0.08)` or `rgba(212, 175, 55, 0.35)`), generous white space, and refined serif typography inspired by luxury heritage properties.

---

## 2. Color Palette & Token Matrix

All values are declared as CSS Custom Properties in [`web/css/global.css`](../web/css/global.css).

### 2.1 Backgrounds & Surfaces

| Token Variable | Hex / RGBA | Role & Application | Contrast Target |
| :--- | :--- | :--- | :--- |
| `--bg-deep` | `#080B11` | Deepest root background, top micro-bar, copyright sub-footer | Baseline 0 |
| `--bg-primary` | `#0B0E14` | Primary viewport background across all 5 pages | Baseline 1 |
| `--bg-secondary` | `#0F1420` | Alternating section backgrounds (Amenities, Story) | Elevation +1 |
| `--bg-card` | `#131A29` | Room cards, trip summary sidebar, form containers | Elevation +2 |
| `--bg-card-hover` | `#172134` | Interactive state for hovered cards and pill tags | Elevation +3 |
| `--bg-surface` | `#182236` | Secondary button containers, input backgrounds | Form Fill |
| `--bg-glass` | `rgba(14, 18, 27, 0.85)` | Sticky header blur (`backdrop-filter: blur(14px)`) | Translucent Layer |

### 2.2 Gold Accents & Highlights

| Token Variable | Hex / RGBA | Role & Application | Usage Rule |
| :--- | :--- | :--- | :--- |
| `--gold-primary` | `#C5A869` | Refined champagne gold; icons, active borders, labels | Default accent |
| `--gold-bright` | `#D4AF37` | Vibrant royal gold; live room rate amounts, active pills | High-emphasis |
| `--gold-amber` | `#E5A93C` | Warm amber gradient endpoint in `.btn-primary` | Gradient stops |
| `--gold-light` | `#F3D995` | Soft champagne text on dark cards, breadcrumbs | Legibility text |
| `--gold-glow` | `rgba(212, 175, 55, 0.25)` | Ambient box shadows for selected cards & buttons | Interactive glow |
| `--gold-subtle` | `rgba(212, 175, 55, 0.12)` | Circular icon backgrounds, badge backdrops | Soft fills |

### 2.3 Typography & Foreground

| Token Variable | Hex Code | Visual Hierarchy | Target Elements |
| :--- | :--- | :--- | :--- |
| `--text-white` | `#FFFFFF` | Primary Emphasis | Page titles, suite names, total pricing |
| `--text-primary` | `#F8FAFC` | Standard Body | Content descriptions, input values |
| `--text-secondary` | `#94A3B8` | Secondary Body | Room specs, subtitles, amenities |
| `--text-muted` | `#64748B` | Tertiary / Dim | Legal notes, comparison rates, captions |
| `--text-gold` | `#D4AF37` | Accent Emphasis | Live pricing, member perks |

### 2.4 Status & Operational Badges

| Status Token | Background Fill | Foreground Text | Border Tone | Application |
| :--- | :--- | :--- | :--- | :--- |
| **Available** | `rgba(34, 197, 94, 0.12)` | `#4ADE80` (Emerald) | `rgba(34, 197, 94, 0.3)` | Guaranteed live inventory |
| **Occupied** | `rgba(148, 163, 184, 0.12)` | `#94A3B8` (Slate) | `rgba(148, 163, 184, 0.3)` | Unavailable sanctuaries |
| **Maintenance** | `rgba(245, 158, 11, 0.12)` | `#FBBF24` (Amber) | `rgba(245, 158, 11, 0.3)` | Scheduled refurbishing |
| **Urgent** | `rgba(239, 68, 68, 0.16)` | `#F87171` (Crimson) | `rgba(239, 68, 68, 0.35)` | "Only 1 Left", "Only 2 Left" |
| **Recommended** | `rgba(212, 175, 55, 0.18)` | `#F3D995` (Gold) | `rgba(212, 175, 55, 0.35)` | Featured suite badges |

---

## 3. Typography Hierarchy & Font Scales

The site relies on three complementary typefaces:
* **Display Serif (`Cinzel`):** For regal hotel brand names, hero headings, and key section titles.
* **Secondary Editorial Serif (`Playfair Display`):** For room card titles, modal headings, and stat counters.
* **Modern Clean Sans (`Plus Jakarta Sans`):** For all UI controls, body text, data points, and inputs.

```css
--font-display: 'Cinzel', 'Playfair Display', Georgia, serif;
--font-serif: 'Playfair Display', Georgia, serif;
--font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Scale & Spacing Matrix

| Semantic Tag | Font Family | Size (Desktop) | Weight | Letter Spacing | Line Height |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title (`H1`)** | `Cinzel` | `clamp(2.4rem, 5vw, 4.2rem)` | 700 (Bold) | `0.5px` | 1.15 |
| **Page Title (`H1`)** | `Cinzel` | `clamp(2.2rem, 3.8vw, 3.2rem)` | 700 (Bold) | `0.5px` | 1.20 |
| **Section Title (`H2`)** | `Cinzel` | `clamp(2.0rem, 3.5vw, 2.8rem)` | 600 (SemiBold) | `0px` | 1.25 |
| **Room Card Title (`H3`)** | `Playfair Display` | `1.35rem` (21.6px) | 600 (SemiBold) | `0px` | 1.30 |
| **Card Header / Price (`H4`)** | `Playfair Display` | `1.6rem - 1.8rem` | 700 (Bold) | `0px` | 1.00 |
| **Micro-Label / Badges** | `Plus Jakarta Sans` | `0.72rem - 0.78rem` | 700 (Bold) | `1.0px - 2.0px` | 1.00 |
| **Body Regular** | `Plus Jakarta Sans` | `0.875rem` (14px) | 400 (Regular) | `0px` | 1.60 |
| **Meta / Small** | `Plus Jakarta Sans` | `0.775rem - 0.825rem` | 500 (Medium) | `0.5px` | 1.40 |

---

## 4. Iconography System (FontAwesome 6 Free)

All icons use FontAwesome 6 icons loaded via CDN:

### Key Icons by Component

* **Brand Emblem:** `fa-moon` (Gold crescent moon inside circular gold emblem).
* **Navigation & Micro-Bar:** `fa-map-marker-alt`, `fa-clock`, `fa-sun`, `fa-clock-rotate-left`, `fa-key`, `fa-bars`, `fa-times`.
* **Room Specifications:**
  * Bed: `fa-bed`
  * Room Area: `fa-vector-square`
  * Guest Capacity: `fa-user-friends` / `fa-users`
  * Aspect / View: `fa-compass`
  * Floor level: `fa-layer-group`
* **Amenities & Checks:** `fa-check`, `fa-check-circle`, `fa-shield-halved`, `fa-wifi`, `fa-utensils`, `fa-spa`, `fa-water`, `fa-car-side`.
* **Trip Summary & Trust:** `fa-certificate`, `fa-shield-halved`, `fa-ribbon`, `fa-award`.
* **Confirmation & Post-Stay:** `fa-circle-check`, `fa-calendar-plus`, `fa-receipt`, `fa-print`, `fa-lock`.
* **Contact & Communication:** `fa-phone`, `fa-envelope`, `fa-location-dot`, `fa-pen`, `fa-bookmark`, `fa-message`.

---

## 5. Component Construction Rules

### 5.1 Primary Button (`.btn-primary`)
```css
background: linear-gradient(135deg, #C5A869, #E5A93C);
color: #0B0E14;
font-weight: 700;
font-size: 0.9rem;
letter-spacing: 0.5px;
padding: 12px 28px;
border-radius: 6px;
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 4px 16px rgba(197, 168, 105, 0.25);
```
*Hover state:* Elevates `-2px` with expanded amber glow `box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4)`.

### 5.2 Filter Tag Pills (`.filter-pill`)
* Default: background `#131A29`, border `#1E293B`, color `#94A3B8`.
* Active: background `#C5A869`, color `#0A0D14`, font-weight `700`, box-shadow `0 4px 14px rgba(212, 175, 55, 0.25)`.

### 5.3 Luxury Input Fields (`.form-input-lux`)
* Dark semi-translucent fill: `rgba(11, 14, 20, 0.70)`.
* Inset left padding of `42px` to accommodate gold icons positioned absolutely at `left: 14px`.
* Focus: `border-color: #D4AF37; box-shadow: 0 0 12px rgba(212, 175, 55, 0.2);`.

---

## 6. Modular CSS Architecture

To maintain maintainability across team members, the styling is segmented into modular files:
1. **`css/global.css`**: Loaded on every page. Declares CSS variables, typography imports, resets, top micro-bar, site header, footer, toast notifications, badges, and modal overlays.
2. **`css/home.css`**: Loaded only on `index.html`. Handles hero banner, booking search widget, feature preview pills, wave SVG, and story layout.
3. **`css/rooms.css`**: Loaded only on `rooms.html`. Handles catalog grid, room cards, filter tags, and the sticky Trip Summary sidebar.
4. **`css/booking.css`**: Loaded on `booking.html`. Handles 2-column checkout grid, payment guarantee box, and input groups.
5. **`css/confirmation.css`**: Loaded on `confirmation.html`. Handles confirmation hero, reservation card, calendar export button, perks cards, and manage booking lookup box.
6. **`css/contact.css`**: Loaded on `contact.html`. Handles contact hero banner, 4 circular info cards, responsive Google Map iframe, and dark contact form.

