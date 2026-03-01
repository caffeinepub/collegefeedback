# Specification

## Summary
**Goal:** Enhance the visual identity of the app with a cursive brand font, a more visible dot-grid background, and floating year-label spark animations.

**Planned changes:**
- Import a script/cursive Google Font (Dancing Script or Pacifico) and add a `fontFamily.brand` token in `tailwind.config.js`; apply it via a `font-brand` CSS class to all instances of the "Memu Nerchukunnavi" brand name (Layout header, YearSelectionModal title, About page hero heading)
- Increase dot-grid background visibility by raising dot opacity to ~0.35–0.45, enlarging dots to ~2px, and tightening grid spacing; keep the pattern fixed and below all content z-indices
- Create a `SparkParticles` React component that renders 12–20 floating pill/badge sparks across the full viewport, each displaying one of "I'm 1st Year", "I'm 2nd Year", "I'm 3rd Year", "I'm 4th Year" with a sparkle prefix icon, randomized positions and animation durations (6s–14s), soft lavender/violet styling, and `pointer-events: none`; mount it inside `Layout.tsx`

**User-visible outcome:** The brand name appears in a decorative cursive font, the dot-grid background is clearly visible across all pages, and soft floating year-label sparks drift upward in the background without interfering with any interactive elements.
