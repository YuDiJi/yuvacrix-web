# YuvaCrix Web

Mobile-first Next.js 14 client for YuvaCrix cricket scoring, match setup, teams, and player workflows. It uses the App Router, React 18, Redux Toolkit, RTK Query, Tailwind CSS v4, and TypeScript.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The client expects the backend base URL in `NEXT_PUBLIC_API_URL`, for example `http://localhost:3006/api/v1`.

```bash
npm run lint
npm run build
npx tsc --noEmit
```

There is no automated test runner configured yet.

## Architecture rules

- Use RTK Query modules in `src/store/api/` for all server communication.
- Do not add raw `fetch`, axios calls, React Query, SWR, Next.js route handlers, or a direct database client.
- Keep remote data in RTK Query; reserve Redux slices for client workflow state.
- Authenticated routes use the mobile AppShell; use the established Tailwind and `cn()` patterns.
- Do not place environment secrets in source control. Only the public API URL is consumed by this client.

## Main areas

- Marketing and OTP onboarding
- Teams and player management
- Match creation: teams, squads, roles, lineup, toss, and innings setup
- Live ball-by-ball scoring and scorecard views
- Redux-persisted auth and match-setup workflow state

The maintained contributor reference is [docs/ai-context/00-START-HERE.md](./docs/ai-context/00-START-HERE.md). It documents the current routes, state ownership, API layer, and development workflow.
