# Tech Stack

Versions below are from `package.json` ranges where noted, **resolved versions from `package-lock.json`** where installed.

## Stack Table

| Layer | Package | Declared | Lockfile (resolved) |
|-------|---------|----------|---------------------|
| Framework | `next` | ^14.2.35 | **14.2.35** |
| UI | `react` | ^18.2.0 | **18.3.1** |
| UI | `react-dom` | ^18.2.0 | **18.3.1** |
| Language | `typescript` | ^5 | **5.9.3** |
| State | `@reduxjs/toolkit` | ^2.12.0 | **2.12.0** |
| State | `react-redux` | ^9.3.0 | **9.3.0** |
| State | `redux-persist` | ^6.0.0 | **6.0.0** |
| Forms | `react-hook-form` | ^7.76.1 | **7.76.1** |
| Forms | `@hookform/resolvers` | ^5.4.0 | **5.4.0** |
| Validation | `zod` | ^4.4.3 | **4.4.3** |
| HTTP (unused in src) | `axios` | ^1.16.1 | **1.16.1** |
| Styling | `tailwindcss` | ^4 | **4.3.0** |
| Styling | `@tailwindcss/postcss` | ^4 | **4.3.0** |
| Styling | `clsx` | ^2.1.1 | **2.1.1** |
| Styling | `tailwind-merge` | ^3.6.0 | **3.6.0** |
| Icons | `lucide-react` | ^1.17.0 | **1.17.0** |
| DnD | `@dnd-kit/core` | ^6.3.1 | **6.3.1** |
| DnD | `@dnd-kit/sortable` | ^10.0.0 | UNCONFIRMED — verify lockfile if pinning |
| Lint | `eslint` | ^8.57.0 | **8.57.1** |
| Lint | `eslint-config-next` | ^14.2.35 | **14.2.35** |
| Types | `@types/node` | ^20 | UNCONFIRMED — verify lockfile if pinning |
| Types | `@types/react` | ^18.3.29 | UNCONFIRMED — verify lockfile if pinning |
| Types | `@types/react-dom` | ^18.3.7 | UNCONFIRMED — verify lockfile if pinning |

## Tooling

| Tool | In use? | Notes |
|------|---------|-------|
| Package manager | **npm** | `package-lock.json` present; no yarn/pnpm lockfiles |
| Router | **App Router only** | `src/app/`; no `pages/` directory |
| tsconfig strict | **Yes** | `"strict": true` |
| Path alias | **`@/*` → `./src/*`** | `tsconfig.json` |
| Prettier | **No** | No config file found |
| Husky / lint-staged | **No** | No hooks configured |
| CI | **No** | No `.github/workflows/` found |
| Test runner | **None configured** | No Jest/Vitest/Playwright config or test files |

## Scripts (`package.json`)

```json
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint"
```

No `typecheck` script — run `npx tsc --noEmit` manually if needed.

## Do Not Introduce (without documented team decision)

| Avoid | Reason |
|-------|--------|
| Zustand, Jotai, Recoil, MobX | Redux Toolkit is the global client state standard |
| @tanstack/react-query, SWR | RTK Query (`baseApi`) handles server state |
| Redux (plain), Context for global app state | RTK slices + one small Header Context already exist |
| Next.js Route Handlers for business API | Backend is external; no `src/app/api/` pattern exists |
| tRPC, GraphQL clients | REST via RTK Query only |
| Prisma, Drizzle, direct DB clients | Frontend-only repo |
| NextAuth, Clerk, Auth0 | Custom cookie + OTP auth via external API |
| MUI, Chakra, Ant Design, shadcn/ui | Custom Tailwind component library |
| CSS Modules, styled-components, Emotion | Tailwind v4 + CSS variables only |
| axios for new calls | Use RTK Query; axios is unused dead dependency |
| Pages Router | App Router only |

## Fonts

Loaded via `next/font/google` in root layout: **Inter** (body), **Barlow Condensed** (display). Additional Google Fonts `@import` also exists in `globals.css`.
