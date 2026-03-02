# Specification

## Summary
**Goal:** Update the application's color scheme to a violet/black combination with a pink background and yellow grid lines.

**Planned changes:**
- Update global CSS custom properties in `index.css` to use violet for primary/accent colors, pink for the main background, yellow for grid background utilities, and black for text/foreground contrast tokens
- Update `tailwind.config.js` color tokens to align with the new violet/black/pink/yellow palette so all Tailwind utility classes (badges, cards, buttons, year badges, navigation) reflect the updated theme
- Update `SparkParticles.tsx` to use violet, pink, and yellow color variants for floating pill particles, replacing existing warm brown/skin-tone colors

**User-visible outcome:** All pages and components display the new violet/black/pink/yellow color scheme, with pink backgrounds, violet accents, yellow grid lines, and updated particle animations — without any layout or functionality changes.
