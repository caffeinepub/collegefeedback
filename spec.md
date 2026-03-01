# Specification

## Summary
**Goal:** Add an optional college/platform name customisation feature so users can personalise the app with their college name during the year selection flow.

**Planned changes:**
- Add an optional text input labelled "Your College Name (optional)" to the Year Selection modal, beneath the year selection buttons
- Store the entered college name in sessionStorage alongside the selected year via the existing `useYearSelection` hook
- Display the college name as a small subtitle beneath the "Memu Nerchunnavi" platform name in the sticky header on all pages, only when a value was provided
- Style the subtitle in a smaller, muted font consistent with the pastel violet/DM Sans theme
- If no college name is entered, the subtitle is not rendered and the header layout remains unchanged

**User-visible outcome:** Users can optionally enter their college name during the initial year selection modal; if provided, it appears as a subtitle under the platform name in the header throughout the session.
