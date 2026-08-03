# Testing Strategy

## Current State

**No automated tests exist in this repository.**

Verified by glob search — zero files matching `*.test.*`, `*.spec.*`, or e2e directories. No configuration found for:

- Jest
- Vitest
- Playwright
- Cypress
- Testing Library

`.gitignore` includes `/coverage` but nothing generates coverage today.

## What Runs Today

| Check | Command | Config |
|-------|---------|--------|
| ESLint | `npm run lint` | `.eslintrc.json` → `next/core-web-vitals` |
| TypeScript | `npx tsc --noEmit` | `tsconfig.json` strict mode — **no npm script** |
| Build | `npm run build` | Implicit type-check via Next.js build |

No CI pipeline (`.github/workflows/` not present).

## Coverage by Area (honest assessment)

| Area | Coverage |
|------|----------|
| Auth / login | None |
| Match creation wizard | None |
| Live scoring | None |
| Components | None |
| Redux store / API layer | None |
| E2E flows | None |

Rough coverage: **0%**.

## Convention for New Tests (when introduced)

No existing tests to copy. If the team adds a test runner, align with these repo facts:

1. **Framework choice is UNCONFIRMED — verify with team.** Vitest + Testing Library is a common fit for Next.js 14 + RTK Query, but nothing is configured yet.

2. **Suggested file placement** (not yet established):
   - Unit: co-located `ComponentName.test.tsx` next to component, or `__tests__/` sibling folder
   - Store: `src/store/**/*.test.ts`
   - E2E: `e2e/` at repo root

3. **Mock RTK Query** rather than hitting `NEXT_PUBLIC_API_URL` in unit tests.

4. **Do not commit real env values** — mock `process.env.NEXT_PUBLIC_API_URL`.

5. **Run before PR:** at minimum `npm run lint` and `npm run build` until a test script exists.

## Pre-PR Manual Test Checklist (inferred from features)

Until automated tests exist, manually verify affected flows:

- [ ] OTP login and redirect
- [ ] Team selection / create team / add player
- [ ] Match creation form submission
- [ ] Toss and lineup flows
- [ ] Start innings
- [ ] Record ball types (runs, wide, no-ball, bye, leg-bye, wicket/out)
- [ ] Undo last ball
- [ ] Mobile layout (430px frame) and bottom nav visibility

## Known Gaps

- No test runner means regressions in scoring flow (recent bugfix commits: `inningsBugfix`, `matchComplete`) are caught manually only.
- The `add-tournaments-series` placeholder route has no implementation or tests.
