# Specification

## Summary
**Goal:** Create a single self-contained HTML file that is a fully functional static duplicate of the entire Mem Nerchukunnavi application, runnable in any browser without a build step or backend.

**Planned changes:**
- Create `frontend/public/standalone.html` as a single file containing all HTML, CSS (Tailwind via CDN), and JavaScript (React via CDN UMD builds) inlined
- Implement all pages and in-page/hash-based routing: Home, About, Share Experience, Dashboard, Community Chat, Available Students, Wishlist, and Post Detail
- Hardcode sample/mock data for posts, college connect tips, feedback, community chat messages, and student profiles
- Inline all translations, UI content, and application logic so no backend canister calls are made (in-memory state only)
- Load fonts and icons via CDN links
- Include year selection modal on first load with year badges for all four years (1st–4th)
- Add Open Graph meta tags and page title `Mem Nerchukunnavi | మేము నేర్చుకున్నవి` in the `<head>`
- Apply the existing violet/neutral color palette and theme

**User-visible outcome:** Users can open `standalone.html` directly in a browser to see a fully populated, navigable demo of the application with no server, build tools, or backend required.
