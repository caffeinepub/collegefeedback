# Specification

## Summary
**Goal:** Automatically retry and recover data loading on the Dashboard page when the backend actor is not yet available, eliminating any manual reload prompt.

**Planned changes:**
- Update the `useGetStats` hook to use automatic retry logic (e.g. `retry` and `refetchInterval` options) so the stats fetch retries without user interaction.
- Replace any manual "Reload" or "Retry" button/prompt on the Dashboard with a loading spinner or skeleton shown during retries.
- Show a non-crashing fallback error UI if the fetch ultimately fails after all retries.

**User-visible outcome:** The Dashboard page automatically retries loading stats when the backend is unavailable, showing a loading indicator until data is ready — no manual refresh or reload button required.
