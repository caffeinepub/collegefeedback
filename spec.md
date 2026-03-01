# Specification

## Summary
**Goal:** Fix the Dashboard page (`/dashboard`) so it loads correctly without crashing or showing a blank page.

**Planned changes:**
- Audit and fix the `useGetStats` hook in `frontend/src/hooks/useQueries.ts` to guard against undefined actor on first render, enable the query only when the actor is available (`enabled: !!actor`), and prevent unhandled promise rejections
- Ensure `useGetStats` returns a stable `{ data, isLoading, isError }` shape compatible with React Query
- Add a loading spinner to the Dashboard while stats data is being fetched
- Add an error fallback UI to the Dashboard when the `getStats` backend call fails
- Handle undefined/empty stats data gracefully with zero-state messaging so the page never crashes

**User-visible outcome:** Navigating to `/dashboard` always renders the page — showing a loading state while fetching, a friendly error message on failure, and all stat cards/sections correctly once data is available.
