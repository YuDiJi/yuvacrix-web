# Project Overview

## What YuvaCrix Is

**Inferred from code and metadata** (README is the default create-next-app template; product intent comes from routes, copy, and `layout.tsx` metadata):

YuvaCrix is a **mobile-first cricket scoring and tournament platform**. Users authenticate via mobile OTP, manage teams and players, create matches, run toss/lineup flows, and score ball-by-ball in real time.

Source: `src/app/layout.tsx` metadata — *"Modern Cricket Scoring & Tournament Platform"*.

## Core Features (from existing routes)

| Route | Status | Purpose |
|-------|--------|---------|
| `/` (marketing) | Implemented | Landing page with feature marketing |
| `/login` | Implemented | Mobile OTP login |
| `/on-boarding`, `/on-boarding/profile-picture` | Implemented | Post-login profile setup |
| `/dashboard` | **Stub** | Placeholder `<div>page</div>` |
| `/my-cricket` | Implemented | Match list, filters, resume/start flows |
| `/start-match` | Implemented | Team selection → match details wizard |
| `/start-match/select-team` | Implemented | Pick teams A/B |
| `/start-match/select-players` | Implemented | Squad selection |
| `/start-match/create-player` | Implemented | Add player to team |
| `/start-match/create-team` | Implemented | Create new team |
| `/start-match/line-up` | Implemented | Drag-and-drop lineup |
| `/start-match/toss` | Implemented | Toss decision |
| `/start-match/start-innings` | Implemented | Open innings (striker/bowler/style) |
| `/scoring` | Implemented | Live ball-by-ball scoring UI |
| `/add-tournaments-series` | **Stub** | Placeholder content |

Navigation is defined in `src/components/app-shell/constant.ts` and `src/components/app-shell/config/routeConfig.ts`.

## Domain / Module Breakdown

```
src/
├── app/                    # Next.js App Router pages (route groups)
│   ├── (app)/              # Authenticated app shell routes
│   ├── (login)/            # Auth + onboarding (phone frame layout)
│   └── (marketing)/        # Public landing
├── components/             # Shared UI (app-shell, common, Players)
├── store/                  # Redux slices + RTK Query API modules
├── types/                  # Domain TypeScript types (match, team, scoring…)
├── providers/              # React Context providers (Header, PersistGate)
├── hooks/                  # Shared hooks (usePageHeader)
├── lib/                    # Utilities (cn)
└── theme/                  # Design token constants (COLORS, FONTS, etc.)
```

### Domain mapping

| Domain | Primary locations |
|--------|-------------------|
| Auth / user | `src/store/auth/`, `src/store/api/authApi.ts`, `src/types/auth.ts`, `src/types/user.ts`, `src/app/(login)/` |
| Teams / players | `src/store/api/teamApi.ts`, `src/store/api/playerApi.ts`, `src/types/team.ts`, `src/types/player.ts`, `src/components/Players/` |
| Match creation | `src/store/startMatch/`, `src/store/api/matchApi.ts`, `src/types/match.ts`, `src/app/(app)/start-match/` |
| Live scoring | `src/store/scoring/`, `src/store/api/scoringApi.ts`, `src/types/scoring.ts`, `src/types/innings.ts`, `src/app/(app)/scoring/` |
| App chrome | `src/components/app-shell/`, `src/providers/HeaderProvider.tsx` |

## Backend Relationship

This repo is a **frontend-only** Next.js client. All persistence and business logic live on an external REST API (`NEXT_PUBLIC_API_URL`). There are **no** `src/app/api/` route handlers and **no** ORM/DB client in this repo.

## Known Inconsistencies

- `dashboard` and `add-tournaments-series` routes exist but are unimplemented stubs.
- README does not describe the product; rely on this doc set and route inspection.
- Duplicate file `src/components/Players/PlayerPickerSheet copy.tsx` — likely accidental; prefer `PlayerPickerSheet.tsx`.
