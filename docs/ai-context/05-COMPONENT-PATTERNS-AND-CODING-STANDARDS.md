# Component Patterns and Coding Standards

## Prop Typing

**Primary pattern:** `interface` named `{ComponentName}Props`, exported for reusable components.

Example — `src/components/common/DialogBox.tsx`:

```tsx
export interface DialogBoxProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  onClose: () => void;
}

export function DialogBox({ open, children, className, onClose }: DialogBoxProps) {
```

Example — feature component with domain types — `src/app/(app)/scoring/out/Out.tsx`:

```tsx
interface OutSheetProps {
  open: boolean;
  onClose: () => void;
  state: ScoringState | undefined;
  players: MatchDetailsPlayer[] | undefined;
}

export function OutSheet({ open, onClose, state, players }: OutSheetProps) {
```

**Inline props** used on pages/layouts:

```tsx
export default function Layout({ children }: { children: ReactNode }) {
```

**Button** uses `interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>` with `forwardRef` — `src/components/common/Button.tsx`.

## Export Style (mixed — follow neighbors)

| Pattern | Where used |
|---------|------------|
| **Named export** | Shared components: `DialogBox`, `Button`, `OutSheet`, `LoginForm`, API hooks |
| **Default export** | Next.js `page.tsx`, `layout.tsx`, many route-level components: `AppShell`, `MatchDetails`, `ScoringPage` |
| **Default export reducers** | `authSlice.ts`, `startMatchSlice.ts`, `scoringSlice.ts` |

For new **shared** components in `src/components/`, prefer **named exports** (matches `Button`, `DialogBox`). For new **route pages**, use **default export** in `page.tsx`.

## File Naming

- Route folders: **kebab-case** (`start-match`, `my-cricket`)
- Components: **PascalCase** intended, but inconsistencies exist (`Loginform.tsx`, `Playercard.tsx`)
- Private route components: **`_components/`** subfolder under the route
- Constants: `constant.ts` (lowercase) in feature folders

## Import Order (observed, not enforced by ESLint)

1. React / Next.js
2. Third-party libraries (`lucide-react`, `react-hook-form`)
3. `@/` internal imports (store, types, components, lib)
4. Relative imports (`./`, `../`)

No import-sort ESLint plugin configured.

## Styling Conventions

### Tailwind v4

- Config via `src/app/globals.css` — `@import "tailwindcss"` and CSS custom properties
- No `tailwind.config.js` file
- Token usage in classnames: `bg-(--color-brand)`, `text-(--color-text-muted)`, `font-(family-name:--font-display)`

### `cn()` utility

Always merge conditional classes through `@/lib/cn` (clsx + tailwind-merge):

```tsx
className={cn("base-classes", condition && "conditional", className)}
```

### Theme constants

`src/theme/index.ts` exports `COLORS`, `FONTS`, `DESIGN_RULES` for JS/inline styles. Duplicates exist in `globals.css` `:root` — when changing tokens, update both or prefer CSS variables in Tailwind classes.

### Design rules (from theme)

- Team names / CTAs: Barlow Condensed, uppercase, wide tracking
- Score hero cards: navy/brand background, not white
- Fixture rows: 3px red left border (`border-l-live`)
- Violet (`--color-violet`) for Pro badge only

### Component library

**None.** Custom primitives: `Button`, `DialogBox`, `DialogBottom`, loaders in `components/common/`.

Icons: **lucide-react** only.

## Accessibility (observed)

Partial — not systematic:

- `aria-label` on icon buttons in `Header.tsx`, OTP inputs, some scoring controls
- `aria-hidden="true"` on decorative SVGs
- `focus-visible:ring` on `Button`
- Many interactive divs (dialog backdrops) use `onClick` without keyboard handling

When adding new icon-only buttons, follow `Header.tsx` pattern with `aria-label`.

## Representative Component Shape

A typical feature component file structure (from `Out.tsx`, `MatchDetails.tsx`):

```
1. "use client" (if needed)
2. imports (React, libs, @/ paths, relative)
3. types/interfaces
4. constants/helpers (or import from constant.ts)
5. component function
6. named or default export
```

Section comments use ASCII dividers: `// ─── Section Name ───`

## Known Inconsistencies

- `PlayerPickerSheet copy.tsx` duplicate file — do not use; use `PlayerPickerSheet.tsx`
- `MatchDetails.tsx` is a default export without `"use client"` but uses hooks — UNCONFIRMED if parent always wraps as client; verify before copying pattern
- Mixed `interface` vs inline prop types on pages
- Some components use inline `style={{}}` alongside Tailwind (dialogs, marketing)
