# Specification

## Summary
**Goal:** Remove all black/near-black colours from the UI, apply a warm bright palette (sandy/beige/terracotta or sky blue/white), and fix SparkParticles distribution across the full viewport.

**Planned changes:**
- Audit and remove all black and near-black colours (#000–#222, dark OKLCH values) from `index.css`, `tailwind.config.js`, and any dark-mode rules throughout the frontend
- Redesign the global colour palette to a warm brown/skin-tone (sandy #F5CBA7, beige #FAE5D3, terracotta #E8956D) or blue/white (sky blue #60A5FA, white #FFFFFF, soft blue-grey #EFF6FF) theme, applied consistently to header, footer, navigation, cards, buttons, badges, modals, dot-grid, and SparkParticles
- Update Tailwind config colour tokens and CSS custom properties to reflect the new warm palette
- Fix `SparkParticles.tsx` so the 16 floating year-label pills are distributed evenly across the full viewport (0–95% width, 0–90% height) using a stratified/grid-like layout instead of the current clustered seeded-random positions
- Update SparkParticles pill colours to match the new warm palette (no dark or purple tones)

**User-visible outcome:** The entire app displays in a warm, bright, readable colour scheme with no black surfaces or text anywhere, and the floating year-label particles appear spread across the whole screen on all pages.
