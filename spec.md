# Specification

## Summary
**Goal:** Rebrand the platform as "Memu Nerchukunnam" (మేము నేర్చుకున్నాం), make it publicly accessible without login barriers, and add easy sharing features.

**Planned changes:**
- Update all instances of the old platform name to "Memu Nerchukunnam" across the frontend (browser tab title, navbar, About page hero, translation strings)
- Update Home and About page taglines/descriptions to emphasize open, community-shared learning for all students
- Add a "Share This Website" section/button on the Home and About pages with WhatsApp share, copy link to clipboard, and native Web Share API support
- Make the year-selection onboarding modal non-blocking so new visitors can browse posts immediately without being forced to select a year; keep year selection available as an optional step
- Ensure backend query functions (getAllPosts, getPostsByCategory, getStats, getAllCollegeConnects) are publicly accessible without requiring Internet Identity login

**User-visible outcome:** Anyone can open the site via a shared link and immediately browse all posts without a login or modal gate; the platform is consistently branded as "Memu Nerchukunnam"; visitors can easily share the site via WhatsApp or clipboard.
