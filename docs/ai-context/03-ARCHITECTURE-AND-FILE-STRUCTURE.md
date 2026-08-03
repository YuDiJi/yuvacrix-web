# Architecture and File Structure

## Top-Level Tree (3 levels, excluding `.git`, `node_modules`, `.next`)

```
yuvacrix-web/
├── docs/ai-context/          # AI architecture docs (this set)
├── public/logo/                # Static logo assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/              # Authenticated routes + AppShell
│   │   ├── (login)/            # Login + onboarding
│   │   ├── (marketing)/        # Landing page
│   │   ├── globals.css         # Tailwind v4 + design tokens
│   │   ├── layout.tsx          # Root layout (fonts, Redux providers)
│   │   ├── global-error.tsx    # Root error boundary
│   │   └── not-found.tsx       # 404 page
│   ├── components/             # Shared React components
│   │   ├── app-shell/          # Header, BottomNav, SideDrawer, routing config
│   │   ├── common/             # Button, DialogBox, loaders, ImageUploader
│   │   └── Players/            # Player picker, cards, lists
│   ├── hooks/                  # usePageHeader
│   ├── lib/                    # cn() utility
│   ├── providers/              # HeaderProvider, ReduxPersistProvider
│   ├── store/                  # Redux store, slices, RTK Query APIs
│   │   ├── api/                # baseApi + domain endpoint modules
│   │   ├── auth/               # authSlice, selectors
│   │   ├── scoring/            # scoringSlice
│   │   └── startMatch/         # startMatchSlice, selectors
│   ├── theme/                  # COLORS, FONTS, DESIGN_RULES constants
│   └── types/                  # Domain TypeScript interfaces
├── .cursor/rules/              # Cursor operational rules
├── .eslintrc.json              # ESLint (next/core-web-vitals)
├── next.config.js              # Next config (images remotePatterns)
├── package.json
├── package-lock.json
├── postcss.config.mjs          # Tailwind PostCSS plugin
└── tsconfig.json
```

## Route Groups and Special Files

| Path | Role |
|------|------|
| `src/app/(app)/layout.tsx` | Wraps authenticated pages: `AuthInitializer`, `HeaderProvider`, `AppShell` |
| `src/app/(login)/layout.tsx` | Phone-frame layout for auth flows (no AppShell) |
| `src/app/(marketing)/layout.tsx` | Marketing site chrome |
| `src/app/(app)/loading.tsx` | Segment loading UI for `(app)` routes |
| `src/app/(app)/error.tsx` | Segment error boundary for `(app)` routes |
| `src/app/(app)/start-match/layout.tsx` | Nested flex column wrapper for match wizard |

**Not present:** `middleware.ts`, any `src/app/api/**/route.ts` handlers.

## Server vs Client Component Conventions

**Observed pattern:** Most interactive pages and all shared components use `"use client"`. Root and group layouts are Server Components that compose Client children.

### Example 1 — Server layout composing Client providers

`src/app/layout.tsx` — no `"use client"`; imports Client `ReduxProvider` and `ReduxPersistProvider`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable}`}>
      <body>
        <ReduxProvider>
          <ReduxPersistProvider>{children}</ReduxPersistProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
```

### Example 2 — Thin Server page delegating to Client component

`src/app/(app)/scoring/page.tsx`:

```tsx
import ScoringPage from "./ScoringPage";

export default function Page() {
  return <ScoringPage />;
}
```

`ScoringPage.tsx` carries `"use client"` and all hooks/Redux logic.

### Example 3 — Client page with direct logic

`src/app/(app)/start-match/page.tsx` — `"use client"` at top; uses `useAppSelector` inline.

**Rule of thumb for new work:** If the file uses hooks, Redux, browser APIs, or event handlers → add `"use client"`. Prefer thin `page.tsx` + named Client component when the page is large (scoring pattern).

## File Naming Conventions (actual, mixed)

| Area | Convention | Examples |
|------|------------|----------|
| Route segments | kebab-case | `start-match`, `my-cricket`, `create-player` |
| Next.js pages | `page.tsx` | Always lowercase |
| Route-private components | `_components/` prefix folder | `start-match/_components/MatchDetails.tsx` |
| Shared components | PascalCase files (mostly) | `DialogBox.tsx`, `AppShell.tsx` |
| Inconsistencies | Mixed casing | `Loginform.tsx`, `Playercard.tsx`, `Onboardingprofileform.tsx` |

Match the naming of the nearest file in the same directory.

## How to Add a New Feature (template: scoring/out flow)

Based on git history (`feature/out` → `ecb221d`) and file structure in `src/app/(app)/scoring/out/`:

1. **Define types** in `src/types/` if new API shapes are needed (e.g. `scoring.ts`, `innings.ts`).

2. **Add RTK Query endpoints** in the appropriate `src/store/api/*.ts` file via `baseApi.injectEndpoints` (e.g. `scoringApi.ts` for scoring mutations).

3. **Add Redux slice actions** only if client-side wizard/flow state is needed beyond RTK Query cache (e.g. `scoringSlice.ts` for `pendingNextAction`).

4. **Create UI under the feature route folder:**
   ```
   src/app/(app)/scoring/out/
   ├── Out.tsx              # Main sheet/flow component (named export)
   ├── constant.ts          # Flow config, enums, step types
   ├── WicketTypeSelector.tsx
   ├── FielderSelector.tsx
   └── ...
   ```

5. **Wire into parent Client page** — import and render from `ScoringPage.tsx` (or equivalent orchestrator).

6. **Update header** via `usePageHeader` hook or direct `useHeader().setHeader()` if the route needs custom title/back button.

7. **Add route config** entry in `src/components/app-shell/config/routeConfig.ts` if the app header should reflect the new route.

8. **Use existing dialog patterns:** `DialogBottom` for bottom sheets, `DialogBox` for centered modals.

9. **No new dependencies** unless escalated — out flow used existing RTK Query + local `useState` only.

## Import Alias

Always use `@/` for imports from `src/`:

```tsx
import { cn } from "@/lib/cn";
import { useAppDispatch } from "@/store/hooks";
```

## Known Inconsistencies

- Some pages are monolithic Client `page.tsx` files; others split into `Page.tsx` + `page.tsx`.
- `_components` co-location is used for `start-match` but not consistently for all features (scoring uses sibling files + `out/` subfolder).
- `add-tournaments-series/page.tsx` uses lowercase `const page = ()` — inconsistent with other pages.
