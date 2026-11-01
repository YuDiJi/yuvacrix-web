# API and Data Fetching

## Architecture

All HTTP traffic goes to an **external REST backend** via **RTK Query**. There are:

- **No** Next.js Route Handlers (`route.ts`)
- **No** tRPC, GraphQL, or direct DB access
- **No** `axios` usage in `src/` (despite being in dependencies)

## Base API

File: `src/store/api/baseApi.ts`

```tsx
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});
```

- **Cookie-based auth** — `credentials: "include"` sends session cookies
- **401 interceptor** — all simultaneous failures share one in-flight `POST
  /auth/refresh`; each original request retries at most once after success. A
  refresh request never recursively refreshes. Failure dispatches `logout()` and
  redirects once. `ACCOUNT_ACCESS_RESTRICTED` 403 responses use the same
  one-time auth-failure handling without attempting refresh.

## Endpoint Modules

Extend `baseApi` with `injectEndpoints`:

| Module             | Key endpoints                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| `authApi.ts`       | `POST /auth/send-otp`, `POST /auth/verify-otp`, `GET /users/me`, `PATCH /users/me`, `POST /auth/logout` |
| `teamApi.ts`       | Team listing, detail, create                                                                            |
| `playerApi.ts`     | Player search, create                                                                                   |
| `matchApi.ts`      | `POST /matches`, lineup, toss, `GET` my matches                                                         |
| `matchRulesApi.ts` | `/match-rule-presets` plus match/tournament/round rule configuration                                    |
| `scoringApi.ts`    | `/match/{id}/scoring/*` — innings, balls, undo, bowler/strike changes                                   |
| `scorecardApi.ts`  | `/matchescored/{id}/scorecard/*` — scorecard, summary, commentary, squads, MVP                          |

Generated hooks follow RTK Query naming: `useGetMeQuery`, `useCreateMatchMutation`, `useRecordBallMutation`, etc.

## Request / Response Types

Domain types live in `src/types/`:

| File            | Covers                                                                            |
| --------------- | --------------------------------------------------------------------------------- |
| `auth.ts`       | Auth DTOs                                                                         |
| `user.ts`       | `User`, `MeResponse`                                                              |
| `team.ts`       | `Team`, team requests                                                             |
| `player.ts`     | Player entities                                                                   |
| `match.ts`      | Match creation, lineup, status enums                                              |
| `matchRules.ts` | Versioned rule presets, snapshots, overrides, validation, and propagation results |
| `innings.ts`    | `ScoringState`, innings start/complete                                            |
| `scoring.ts`    | Ball recording, wicket flow, undo                                                 |
| `scorecard.ts`  | Scorecard views and derived match summaries                                       |

Types are hand-written TypeScript. Zod validates forms and required tournament standings fields; other API responses remain compile-time types.

## Adding a New Endpoint

1. Add/update types in `src/types/{domain}.ts`
2. Add endpoint in the appropriate `src/store/api/{domain}Api.ts`:

```tsx
export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    myEndpoint: builder.query<ResponseType, ArgType>({
      query: (arg) => ({ url: `/path`, method: "GET" }),
      providesTags: ["Team"],
    }),
  }),
});

export const { useMyEndpointQuery } = teamApi;
```

3. Add tag type to `tagTypes` in `baseApi.ts` if new domain
4. Use generated hook in Client component — do not call `fetch` directly

## Auth Flow

1. User enters mobile → `useSendOtpMutation`
2. OTP verify → `useVerifyOtpMutation` → dispatch `setCredentials`
3. On app load → auth status is `initializing`; `AuthInitializer` runs
   `useGetMeQuery()` and then sets `authenticated` or `unauthenticated`.
   `ProtectedRoute` waits during initialization, so cleared browser storage with
   valid HttpOnly cookies does not flash or redirect to login.
4. Session maintained via HTTP-only cookies (inferred from `credentials: "include"` — cookie details UNCONFIRMED — verify with team)

## Error Handling Patterns

### RTK Query mutation/query errors

Login form extracts message from error shape:

```tsx
const errorMessage =
  (sendOtpState.error as any)?.data?.message ||
  (verifyOtpState.error as any)?.data?.message ||
  null;
```

Pattern: cast `error` to access `.data.message` from backend — **uses `any`** (known gap).

### 401 global handling

Handled in `baseApi` interceptor — refresh + redirect, not per-component.

### User-facing errors

- **Inline text** below forms (login)
- **Inline validation** in lineup flow (replacing older `alert()`)
- **`alert()`** still used once in `select-team/page.tsx` for duplicate team check
- **No toast/notification library** installed

### Loading states

- RTK Query: `isLoading`, `isFetching` from hooks
- `Button` component has `loading` prop with spinner
- Route-level: `src/app/(app)/loading.tsx`
- Custom: `CricketLoader`, `Skeletonloader` in `components/common/loaders/`

### Empty states

Handled per-page in component JSX — no shared empty-state component found.

## Caching / Revalidation

RTK Query defaults apply — **no custom `staleTime` or `keepUnusedDataFor`** configured in endpoint definitions inspected.

Cache invalidation via tags:

```tsx
invalidatesTags: ["ScoringState"];
providesTags: ["Auth"];
```

Next.js `fetch` cache options are **not used** — all data fetching is client-side RTK Query.

## Match Rules and scoring contracts

- `matchRulesApi` reads presets/configurations, validates edits, and confirms the pre-toss lock.
- `scoringApi` declares bowling-target powerplay and invalidates `ScoringState`/`Scorecard` after mutations.
- Required boundary wagon-wheel direction is collected before Record Ball and sent as `wagonWheel.fieldZone`.
- Record Ball sends `clientEventId` and `baseInningsVersion`. `SCORING_VERSION_CONFLICT` triggers an authoritative refetch.
- Scorecard innings include `scoreAdjustments` for bonus/deduction display.

## Error Boundaries

| File                       | Scope                                       |
| -------------------------- | ------------------------------------------- |
| `src/app/(app)/error.tsx`  | `(app)` segment errors — shows reset button |
| `src/app/global-error.tsx` | Root catastrophic errors — minimal fallback |

## Known Inconsistencies

- Widespread `(error as any)` for API error messages — no shared error extractor utility
- `axios` dependency unused — do not introduce parallel HTTP client
- `completeInnings` mutation typed as `builder.mutation<any, ...>` in scoringApi
- No centralized API error toast — each page handles errors locally


## Cricket playoffs

- Tournament configuration lives in `tournamentApi.ts`: League + Playoffs requires one of the exact Top 2/3/4 configuration pairs. New mixed-format selections default to Top 3. Legacy missing configuration is not invented.
- Editing reads `GET /tournaments/:id/about` and requires `actions.canEditFormat === true` to send format fields. Metadata updates omit both format fields when permission is false, missing, or loading.
- `TournamentPlayoffs` uses the existing fixture API slice. Its read-only aggregate query pages `/fixtures` until an empty page, rejecting repeated pages or incomplete responses before presenting readiness. Existing manual playoff rounds block generation to avoid duplicate round setup.
- Organizer confirmation posts to `/fixtures/knockout/generate` with `{}` or supplied `rulesOverrides`; mixed-format requests never send seeds. The supplied backend contract describes a direct fixture array response. Backend source for this contract is unavailable in the sibling checkout.
- Generation invalidates tournament details, fixtures, rounds, match-list and overall standings tags on success. Details, playoff fixtures, matches and standings also provide the existing `Matches` tag so scoring/completion mutations invalidate them. Returning to Matches refetches; there is no periodic polling or automatic generation/repair.
- Standings normalize documented `played/won/lost/tied/noResult/netRunRate` and legacy frontend field names, preserving response order. Invalid required data makes the entire ranking unavailable with an explicit error; it never silently drops seeds.
- Bracket slots, linked match IDs, advancement and tournament winners always come from the backend. Resolved fixtures without a match ID remain unplayable. Completed tournament results resolve server winner/runner-up IDs against tournament team snapshots.
- Optional override number validation follows the existing auto-fixture form (overs 1-200, per bowler 1-50; per bowler cannot exceed total if both supplied). These are frontend conventions, not verified backend DTO limits. The backend must validate partial overrides against inherited rules.
- Offline regression checks: `node scripts/check-tournament-playoffs.cjs`. Uses Node assertions and the installed TypeScript compiler; no added test framework or production requests. Browser/E2E progression still requires a compatible backend.
