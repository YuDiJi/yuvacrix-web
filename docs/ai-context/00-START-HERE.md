# YuvaCrix AI Context — Start Here

This folder is the authoritative architecture reference for AI agents working on **yuvacrix-web**. Every fact here was verified against the repo. Update these docs in the same PR whenever architecture, patterns, or tooling change.

## Index

| File | Description |
|------|-------------|
| [01-PROJECT-OVERVIEW.md](./01-PROJECT-OVERVIEW.md) | Product purpose, feature list from routes, domain-to-folder map |
| [02-TECH-STACK.md](./02-TECH-STACK.md) | Locked dependency versions and "do not introduce" list |
| [03-ARCHITECTURE-AND-FILE-STRUCTURE.md](./03-ARCHITECTURE-AND-FILE-STRUCTURE.md) | Folder tree, Server/Client conventions, how to add a feature |
| [04-STATE-MANAGEMENT.md](./04-STATE-MANAGEMENT.md) | Redux slices, RTK Query, Context, form state, known inconsistencies |
| [05-COMPONENT-PATTERNS-AND-CODING-STANDARDS.md](./05-COMPONENT-PATTERNS-AND-CODING-STANDARDS.md) | Props typing, exports, naming, styling, accessibility |
| [06-API-AND-DATA-FETCHING.md](./06-API-AND-DATA-FETCHING.md) | RTK Query API layer, auth, error/loading patterns |
| [07-TESTING-STRATEGY.md](./07-TESTING-STRATEGY.md) | Current test coverage (minimal) and conventions for new tests |
| [08-AI-AGENT-RULES-AND-WORKFLOW.md](./08-AI-AGENT-RULES-AND-WORKFLOW.md) | Step-by-step playbooks and pre-completion checklist |

Also see lightweight Cursor rules in `/.cursor/rules/` and root `AGENTS.md`.

## Non-Negotiable Rules for AI Agents

1. **Verify before you claim.** If something is not in this doc set or the code, mark it `UNCONFIRMED — verify with team` — do not guess.
2. **Do not modify architecture casually.** No new global state libraries (Redux Toolkit + RTK Query is the standard). No Next.js API route handlers — all data goes to the external backend via RTK Query in `src/store/api/`.
3. **Use existing API endpoints.** Add new endpoints by `injectEndpoints` into `baseApi`, not raw `fetch`/`axios`. (`axios` is in `package.json` but has zero imports in `src/`.)
4. **Respect the mobile-first shell.** Authenticated routes render inside `AppShell` (430px phone frame on desktop). Match existing layout patterns in `(app)/layout.tsx`.
5. **Follow established styling.** Tailwind v4 with CSS custom properties in `globals.css`. Use `cn()` from `@/lib/cn`. Do not add CSS Modules, styled-components, or a component library without team approval.
6. **Persist only whitelisted slices.** `redux-persist` whitelists `auth` and `startMatch` only — do not add `scoring` or RTK Query cache to persist without explicit decision.
7. **Do not put secrets in code or docs.** Reference env var names only (`NEXT_PUBLIC_API_URL`).
8. **Match local conventions over generic best practice.** Mixed export styles and file naming exist — follow the nearest neighbor file in the same folder.
9. **Flag inconsistencies; do not silently "fix" them** unless the ticket explicitly asks. Document competing patterns under Known Inconsistencies.
10. **Update docs when architecture changes.** Same PR as the code change.

## Required Environment Variable

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL for all RTK Query requests (`src/store/api/baseApi.ts`) |

`.env*` files are gitignored. No `.env.example` exists in the repo.
