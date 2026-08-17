# State Management

Based on grep/import analysis of `src/` — no Zustand, Jotai, Recoil, React Query, or SWR found.

## Overview

| State kind | Tool | Location |
|------------|------|----------|
| Server / remote data | **RTK Query** (`baseApi`) | `src/store/api/` |
| Global client auth | **Redux slice** | `src/store/auth/authSlice.ts` |
| Match creation wizard | **Redux slice** (persisted) | `src/store/startMatch/startMatchSlice.ts` |
| Live scoring flow | **Redux slice** (not persisted) | `src/store/scoring/scoringSlice.ts` |
| App header UI | **React Context** | `src/providers/HeaderProvider.tsx` |
| Local component UI | **`useState`** | Throughout Client components |
| Form state (some flows) | **react-hook-form + zod** | e.g. `MatchDetails.tsx` |
| Form state (other flows) | **`useState`** | e.g. `Loginform.tsx`, scoring out flow |
| URL state | **`useSearchParams`**, **`useRouter`** | Next.js navigation hooks |

## Store Configuration

File: `src/store/index.ts`

```tsx
combineReducers({
  auth: authReducer,
  startMatch: startMatchReducer,
  scoring: scoringReducer,
  [baseApi.reducerPath]: baseApi.reducer,  // "api"
});
```

**redux-persist** whitelist: `["auth", "startMatch"]` only. Scoring state and RTK Query cache are **not** persisted.

Match Rules and scoring remain server-authoritative. The editor holds only unsaved typed overrides locally. Record Ball sends a stable `clientEventId` and displayed `baseInningsVersion`; conflicts refresh `ScoringState` instead of applying a client-calculated score.

Middleware: default RTK middleware with `serializableCheck: false` + `baseApi.middleware`.

## Slice Responsibilities

### `authSlice` — `src/store/auth/authSlice.ts`

- `user: User | null`
- `isAuthenticated: boolean`
- Actions: `setCredentials`, `logout`
- Selectors: `src/store/auth/authSelectors.ts` (`selectUser`, `selectIsAuthenticated`)
- Hydrated by `AuthInitializer` calling `useGetMeQuery()` on app load

### `startMatchSlice` — `src/store/startMatch/startMatchSlice.ts`

- Team A/B selection, captains, keepers, `activeTeam`, `matchId`, `lineUpMode`
- Persisted to localStorage via redux-persist
- Selectors: `src/store/startMatch/selectors.ts`

### `scoringSlice` — `src/store/scoring/scoringSlice.ts`

- `inningsId`, `scoringState`, `pendingNextAction`, `awaitingBowlerAfterBatter`
- Updated after scoring API responses; drives modal/flow queue
- **Not persisted** — resets on refresh
- Uses `any` for `pendingNextAction` (known type gap)

## RTK Query API Modules

All inject into `baseApi` (`src/store/api/baseApi.ts`):

| File | Domain |
|------|--------|
| `authApi.ts` | OTP, verify, getMe, updateProfile, logout |
| `teamApi.ts` | Teams CRUD, owned teams |
| `playerApi.ts` | Player search/create |
| `matchApi.ts` | Create match, lineup, toss, match list |
| `matchRulesApi.ts` | Rule presets; match, tournament, and round rule reads/validation/mutations |
| `scoringApi.ts` | Innings start, record ball, undo, bowler/batter changes |
| `scorecardApi.ts` | Scorecard, summary, commentary, squads, and MVP reads |

Tag types: `Auth`, `Player`, `Members`, `Team`, `Matches`, `ScoringState`, `Scorecard`.

## Typed Hooks

`src/store/hooks.ts`:

```tsx
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

Always use these instead of raw `useDispatch`/`useSelector`.

## Header Context

`src/providers/HeaderProvider.tsx` — local UI state for app header title, back button, notifications icon. Consumed via `useHeader()` or `usePageHeader()` (`src/hooks/usePageHeader.ts`).

Do not move server/API state into Header Context.

## Server vs Client State Separation (practice)

**Intended:** RTK Query owns fetched entities; slices own multi-step wizard state that must survive navigation (`startMatch`) or active session flow (`scoring`).

**In practice — mixed:**
- RTK Query cache is the source of truth for API data, but slices also copy scoring state (`setScoringState`) for flow orchestration.
- Auth user exists in both RTK Query (`getMe`) and `authSlice.user` — kept in sync via `AuthInitializer`.

## Known Inconsistencies

| Issue | Current reality | Recommendation |
|-------|-----------------|----------------|
| Form libraries | `react-hook-form` + zod only in `MatchDetails.tsx`; login and scoring use `useState` | Match the nearest feature; do not migrate login to RHF unless ticket says so |
| axios in package.json | Zero imports in `src/` | Use RTK Query for all new HTTP; do not add axios calls |
| `pendingNextAction: any` | Untyped in scoringSlice | Type against API response when touching scoring |
| Duplicate auth state | RTK Query + authSlice | Keep both in sync via `AuthInitializer` pattern |
| `alert()` validation | Still in `select-team/page.tsx` | Prefer inline errors (see `line-up/page.tsx` comment) |
