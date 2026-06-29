# AI Agent Rules and Workflow

## Before Any Task

1. Read [00-START-HERE.md](./00-START-HERE.md) non-negotiable rules.
2. Identify affected domain in [01-PROJECT-OVERVIEW.md](./01-PROJECT-OVERVIEW.md).
3. Open the nearest existing file in the same folder and match its patterns.

---

## Playbook: Add a Feature

1. **Scope the route** — [01-PROJECT-OVERVIEW.md](./01-PROJECT-OVERVIEW.md): which `(app)` route group? New page or extend existing?
2. **Check stack constraints** — [02-TECH-STACK.md](./02-TECH-STACK.md): do not add conflicting libraries.
3. **Plan files** — [03-ARCHITECTURE-AND-FILE-STRUCTURE.md](./03-ARCHITECTURE-AND-FILE-STRUCTURE.md):
   - Types → `src/types/`
   - API → `src/store/api/{domain}Api.ts`
   - Slice (if wizard state) → `src/store/{domain}/`
   - UI → `src/app/(app)/{route}/` + `_components/` or subfolder
4. **State** — [04-STATE-MANAGEMENT.md](./04-STATE-MANAGEMENT.md): RTK Query for server data; slice only if multi-step client state needed.
5. **Components** — [05-COMPONENT-PATTERNS-AND-CODING-STANDARDS.md](./05-COMPONENT-PATTERNS-AND-CODING-STANDARDS.md): `"use client"`, `cn()`, existing dialog/button primitives.
6. **API wiring** — [06-API-AND-DATA-FETCHING.md](./06-API-AND-DATA-FETCHING.md): `injectEndpoints`, typed hooks, tag invalidation.
7. **Header/routing** — Update `routeConfig.ts` if app header needs new title/back behavior.
8. **Structural template** — Copy shape from:
   - Multi-step UI: `src/app/(app)/scoring/out/` (subfolder + `constant.ts`)
   - Form wizard: `src/app/(app)/start-match/_components/MatchDetails.tsx`
   - List page: `src/app/(app)/my-cricket/page.tsx`
9. **Tests** — [07-TESTING-STRATEGY.md](./07-TESTING-STRATEGY.md): none required today unless team adds runner; run `npm run lint` and `npm run build`.
10. **Docs** — Update ai-context docs if you add routes, store slices, API modules, or change patterns.

---

## Playbook: Fix a Bug

1. **Reproduce path** — identify route and Client component (`page.tsx` vs split component).
2. **Trace data** — [06-API-AND-DATA-FETCHING.md](./06-API-AND-DATA-FETCHING.md): which RTK Query hook or slice selector feeds the broken UI?
3. **Check known inconsistencies** — [04-STATE-MANAGEMENT.md](./04-STATE-MANAGEMENT.md), [06-API-AND-DATA-FETCHING.md](./06-API-AND-DATA-FETCHING.md): e.g. scoring slice vs RTK cache desync.
4. **Minimal fix** — change only the affected hook, slice reducer, or component; do not refactor unrelated patterns.
5. **Verify** — `npm run lint`, `npm run build`, manual test of the flow (see [07-TESTING-STRATEGY.md](./07-TESTING-STRATEGY.md)).
6. **If root cause is architectural** — document in Known Inconsistencies; escalate if fix requires new dependency.

---

## Playbook: Refactor a Component

1. **Read neighbors** — [05-COMPONENT-PATTERNS-AND-CODING-STANDARDS.md](./05-COMPONENT-PATTERNS-AND-CODING-STANDARDS.md): preserve export style (named vs default) unless whole folder is migrated.
2. **Preserve public API** — same props interface unless all call sites are updated in same PR.
3. **Do not change state ownership** — [04-STATE-MANAGEMENT.md](./04-STATE-MANAGEMENT.md): moving fetch from RTK Query to local fetch is forbidden.
4. **Keep styling approach** — Tailwind + `cn()`; do not introduce CSS Modules mid-refactor.
5. **Split pattern** — if page exceeds ~300 lines, follow scoring pattern: thin `page.tsx` + `{Feature}Page.tsx` Client component.
6. **Run lint + build** before finishing.

---

## Escalation Rule

**Stop and report** (do not proceed silently) if the task requires:

- A new npm dependency not in [02-TECH-STACK.md](./02-TECH-STACK.md)
- Next.js API routes or direct backend logic in this repo
- A second global state library or raw `fetch`/`axios` bypassing RTK Query
- Persisting `scoring` slice or RTK cache
- Changing auth mechanism (NextAuth, JWT in localStorage, etc.)
- Removing/redesigning the mobile 430px AppShell paradigm

State the conflict, cite the existing pattern and file path, and propose an approach for human approval.

---

## Pre-Completion Checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` passes (or `npx tsc --noEmit` at minimum)
- [ ] No new `any` types unless matching existing API error pattern — prefer proper types
- [ ] No unused imports
- [ ] File naming matches sibling files in the same directory
- [ ] `"use client"` present on any file using hooks, Redux, or browser APIs
- [ ] New API endpoints use `injectEndpoints` + types in `src/types/`
- [ ] No secrets or `.env` values in code or docs
- [ ] Architecture docs updated if routes, store, or patterns changed
- [ ] Known inconsistencies noted in docs if discovered but not fixed

---

## Quick Reference: Key Files

| Purpose | Path |
|---------|------|
| Store setup | `src/store/index.ts` |
| API base + 401 | `src/store/api/baseApi.ts` |
| Typed Redux hooks | `src/store/hooks.ts` |
| Auth bootstrap | `src/components/AuthInitializer.tsx` |
| App shell | `src/components/app-shell/AppShell.tsx` |
| Route header config | `src/components/app-shell/config/routeConfig.ts` |
| Design tokens | `src/app/globals.css`, `src/theme/index.ts` |
| Class merge utility | `src/lib/cn.ts` |
