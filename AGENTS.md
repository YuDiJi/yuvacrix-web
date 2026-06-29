# AGENTS.md — YuvaCrix Web

**YuvaCrix** (`yuvacrix-web`) is a mobile-first cricket scoring and tournament platform built with **Next.js 14 App Router**, **React 18**, **Redux Toolkit + RTK Query**, **Tailwind v4**, and **TypeScript (strict)**.

## Critical rule

All server data must flow through **RTK Query** in `src/store/api/` (`baseApi.injectEndpoints`). Do not add raw `fetch`, `axios`, React Query, SWR, or Next.js API route handlers. The backend is an external REST API configured via `NEXT_PUBLIC_API_URL`.

## Where to read more

Full architecture documentation for AI agents and contributors:

**[/docs/ai-context/00-START-HERE.md](./docs/ai-context/00-START-HERE.md)**

That index covers routing, state, components, API patterns, testing gaps, and step-by-step workflows. Update those docs in the same PR when architecture changes.

## Quick commands

```bash
npm run dev      # local development
npm run lint     # ESLint (next/core-web-vitals)
npm run build    # production build + type check
```

No automated tests are configured yet.
