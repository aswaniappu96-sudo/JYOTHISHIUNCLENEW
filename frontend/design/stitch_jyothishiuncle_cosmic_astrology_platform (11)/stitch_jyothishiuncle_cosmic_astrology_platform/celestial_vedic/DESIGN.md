---
name: Celestial Vedic
colors:
  surface: '#141121'
  surface-dim: '#141121'
  surface-bright: '#3a3749'
  surface-container-lowest: '#0f0c1c'
  surface-container-low: '#1c192a'
  surface-container: '#211d2e'
  surface-container-high: '#2b2839'
  surface-container-highest: '#363244'
  on-surface: '#e6dff6'
  on-surface-variant: '#d0c5b4'
  inverse-surface: '#e6dff6'
  inverse-on-surface: '#322e3f'
  outline: '#999080'
  outline-variant: '#4d4639'
  surface-tint: '#e4c277'
  primary: '#ffe09d'
  on-primary: '#3f2e00'
  primary-container: '#e5c378'
  on-primary-container: '#684f0f'
  inverse-primary: '#745b1a'
  secondary: '#cabeff'
  on-secondary: '#31009a'
  secondary-container: '#4829b3'
  on-secondary-container: '#b8aaff'
  tertiary: '#ffdeb8'
  on-tertiary: '#462a00'
  tertiary-container: '#ffba5d'
  on-tertiary-container: '#754a00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf9b'
  primary-fixed-dim: '#e4c277'
  on-primary-fixed: '#251a00'
  on-primary-fixed-variant: '#5a4302'
  secondary-fixed: '#e6deff'
  secondary-fixed-dim: '#cabeff'
  on-secondary-fixed: '#1c0062'
  on-secondary-fixed-variant: '#4829b3'
  tertiary-fixed: '#ffddb6'
  tertiary-fixed-dim: '#ffb95a'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#643f00'
  background: '#141121'
  on-background: '#e6dff6'
  surface-variant: '#363244'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 68px
    letterSpacing: -0.01em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 38px
    fontWeight: '400'
    lineHeight: 46px
    letterSpacing: 0em
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: 0em
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 30px
    fontWeight: '400'
    lineHeight: 38px
    letterSpacing: 0em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: 0.01em
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0.02em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0.015em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.18em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

## Brand & Style

This design system establishes an atmospheric intersection between ancient Vedic cosmological wisdom and futuristic digital luxury. The aesthetic bridges sacred geometries, stellar cartography, and high-fidelity interactive design. 

### Visual Archetype & Mood
- **Spiritual Regalism:** Evokes the feeling of consulting a timeless sage within an ultra-modern celestial observatory.
- **Cinematic Depth:** Deep obsidian voids layered with soft stellar nebulae, dynamic luminescent rings, and crystalline glass strata.
- **Precision Mysticism:** Sacred alignments, ethereal constellation traces, and refined metadata juxtaposed with sweeping editorial serifs.
- **Emotional Resonance:** Introspective, reverent, intellectually grounded, and majestic. The interface never feels cartoonish or generic-mystical; it behaves like an elite instrument of destiny.

## Colors

The palette derives from the deep reaches of space pierced by warm Vedic starlight and sacred metal accents.

- **Primary (`#E5C378` - Sacred Gold):** Radiates astral wisdom, planetary orbits, high-value actions, and illuminated astrological houses.
- **Secondary (`#8A72F8` - Celestial Starlight Glow):** Represents spiritual insight, intuition, and nebular energy fields. Used for subtle glow states, active aura rings, and interactive feedback.
- **Tertiary (`#FFB347` - Glowing Amber Surya):** Evokes the solar core, vital energy (Prana), and ascendant points. Used sparingly for peak emphasis, planetary transits, and high-priority cosmic alerts.
- **Neutral Surface (`#060412` / `#03020A` - Obsidian Abyss):** An immersive infinite-space backdrop that allows pure light and golden filaments to breathe without visual noise.

### Color Governance
- Never render flat, solid white backgrounds. Text illumination peaks at `#F7F5FF` with varying alpha channels (0.9 to 0.4) to represent starlight luminance.
- Surfaces rely on dark cosmic violet (`rgba(30, 18, 56, 0.4)`) and midnight indigo (`rgba(13, 11, 36, 0.6)`) to create atmospheric volume instead of flat opaque greys.
- Gold accents must always be balanced by violet-indigo undertones to prevent an oversaturated or brassy aesthetic.

## Typography

The typography couples classical esoteric stature with clean humanistic geometry.

- **Headlines & Display (Playfair Display):** Conveys the sacred lineage of Vedic texts, royal edicts, and cosmic manifestations. Used with measured line-heights and slight italics for auspicious nomenclature (e.g., *Kundali*, *Nakshatra*, *Mahadasha*).
- **Body & Structural UI (Plus Jakarta Sans):** Grounded, hyper-legible, and balanced. Provides modern technical clarity to balance the romantic weight of the serif display.
- **Esoteric Labels (`label-caps`):** Rendered in uppercase with generous tracking (`0.18em`) to act as cosmic coordinate markers, planetary degrees, and architectural anchors.

## Layout & Spacing

The layout model is anchored in spacious, floating orchestrations rather than dense utility tables.

- **Canvas Structure:** A fluid 12-column grid on desktop, scaling to 6 columns on tablet and 4 columns on mobile. Containers emphasize generous margins to give astronomical charts, orbital trajectories, and horoscopic mandalas celestial breathing room.
- **Z-Axis Hierarchy:** Elements do not sit on rigid horizontal shelves. Instead, they cluster around harmonic anchor points, mimicking orbital nodes and stellar arrangements.
- **Vertical Flow:** Spacing between disparate spiritual sections utilizes rhythmic multiples of `space-xl`, allowing transitions between astrological transits and personal readings to feel meditative and uninterrupted.

## Elevation & Depth

Elevation is rendered through luminous celestial physics rather than standard drop shadows.

- **Atmospheric Nebulae & Radial Glows:** Background layers use multi-stop radial color fields (deep indigo `rgba(13, 11, 36, 0.8)` blending into ethereal starlight `rgba(138, 114, 248, 0.08)` and disappearing into obsidian black).
- **Glassmorphic Cartography:** Floating panels employ translucent backdrops (`background: rgba(10, 8, 28, 0.45)`) treated with `backdrop-filter: blur(24px) saturate(160%)`.
- **Gilded Filaments:** Instead of box borders, surfaces are outlined with hairline gradient strokes (`1px solid linear-gradient(135deg, rgba(229, 195, 120, 0.4) 0%, rgba(138, 114, 248, 0.1) 50%, rgba(255, 255, 255, 0.02) 100%)`).
- **Planetary Aura Shadows:** High-tier active elements cast soft, expansive glows: `box-shadow: 0 0 40px -10px rgba(229, 195, 120, 0.25), 0 20px 40px -20px rgba(138, 114, 248, 0.3)`.

## Shapes

The shape vocabulary rejects sterile corporate rectangles and harsh right angles in favor of organic geometry, sacred mandalas, and orbital curvature.

- **Curvature Hierarchy:** Standard panels carry smooth `1rem` to `1.5rem` boundaries, while nested micro-elements feature capsule and full-circle treatments.
- **Sacred Geometries:** Interactive nodes frequently manifest as concentric rings, diamond ascendants, and orbital tracks, reinforcing ancient astronomical instrumentation.
- **Constellation Connectors:** Visual dividers and connecting threads use ultrafine dashed paths adorned with miniature star vertices rather than static divider lines.

## Components

### Buttons & Celestial Triggers
- **Primary Astral Action:** Pill-shaped, bathed in a subtle sacred gold gradient (`linear-gradient(135deg, #F3D99B 0%, #E5C378 50%, #D4AF37 100%)`) with dark obsidian typography (`#060412`). Hover triggers an amber-gold peripheral aura and a subtle inner starlight flare.
- **Secondary Oracle Action:** Translucent cosmic glass with a 1px gilded gradient border. Starlight violet typography that illuminates to warm starlight upon cursor alignment.
- **Orbital Floating Actions:** Perfect circles wrapped in spinning or stationary hairline constellation tracks.

### Cards & Astrological Houses
- Never render opaque cards with abrupt edges. Cards are floating crystalline slates with deep blurred backs, ethereal rim-lighting, and sacred gold accents concentrated on corner nocks or header badges.
- Headers are styled with uppercase esoteric tracking, paired with a miniature gold celestial glyph (Sun, Moon, Jupiter, Rahu, Ketu).

### Chips & Planetary Badges
- Capsule structures featuring glowing planetary symbols accompanied by concise alphanumeric values (e.g., `♃ JUPITER · 12° 41'`).
- Subtle inner glow matching the planetary nature (cool violet for Ketu/Saturn, warm amber for Surya/Mars).

### Inputs & Chart Ingestion Fields
- Minimalist floating fields. No enclosed border boxes—only an illuminated baseline starlight filament that transitions from ethereal violet (`rgba(138, 114, 248, 0.3)`) to radiating gold (`#E5C378`) on focus.
- Micro-labels positioned above inputs in tracked uppercase, accompanied by subtle star-glyph indicators.

### Selection Controls (Checkboxes & Radios)
- **Radios (Orbital Spheres):** Concentric astral rings. Selected state reveals an illuminated golden core with a secondary violet aura ring.
- **Checkboxes (Nakshatra Seals):** Diamond-cut shapes featuring an ancient geometric glyph that manifests with a smooth gold stroke animation when selected.

### Custom Experience Components
- **Kundali Mandala Grid:** Chart overlays rendered via hairline golden pathways with dynamic light pulses traveling through transit channels.
- **Dasha Timeline Bar:** A seamless glass horizon depicting lifetime planetary periods, glowing progressively as the current transit marker slides through time.
- **Starlight Audio/Cosmic Oracle Orb:** A living, interactive 3D particle sphere that reacts to cosmic queries with undulating fluid ribbons of gold and violet light.