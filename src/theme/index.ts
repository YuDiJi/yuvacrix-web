/**
 * YuvaCrix Design System — Theme Constants
 * ==========================================
 * This is the SINGLE SOURCE OF TRUTH for all visual tokens.
 * Changing values here will update the entire UI.
 *
 * Theme: Navy Sports · v1.0 Final
 */

// ─── COLOR PALETTE ───────────────────────────────────────────────────────────

export const COLORS = {
  // Backgrounds
  bgBase: "#EDF0F5", // Root screen / page background (blue-tinted light gray)
  bgCard: "#FFFFFF", // All cards, sheets, modals
  bgTint: "#EEF4FF", // Active chips, highlight rows, tab backgrounds
  bgBorder: "#E8ECF2", // Card borders, dividers, separators

  // Brand
  navy: "#0D1B3E", // Hero backgrounds, headings, team names
  brand: "#1B3FA0", // Primary CTA, score hero cards, active nav, buttons
  sky: "#4B8BFF", // Accent, links, tint highlights, logo accent
  violet: "#7C3AED", // Pro badge ONLY — never on cricket data or navigation

  // Semantic / Cricket States
  live: "#FF3B30", // Live dot, wicket ball, error states, fixture left bar
  four: "#22C55E", // Boundary (4), match won, correct/success
  six: "#F59E0B", // Six (6), extras, caution / warning

  // Text
  textPrimary: "#0D1B3E", // All main headings and key data
  textBody: "#374151", // Body text, player names
  textSecondary: "#6B7280", // Supporting labels, secondary info
  textMuted: "#9CA3AF", // Meta, timestamps, muted labels
  textInverse: "#FFFFFF", // Text on dark/navy backgrounds

  // Ball color coding (scorecard ball-by-ball)
  ball: {
    dot: "#E8ECF2", // 0 runs — dot ball
    single: "#E8ECF2", // 1–3 runs — normal
    four: "#22C55E", // 4 — boundary green
    six: "#F59E0B", // 6 — six amber
    wicket: "#FF3B30", // W — wicket red
    wide: "#4B8BFF", // Wd — wide blue
    noBall: "#4B8BFF", // Nb — no ball blue
  },

  // Stat color coding (scorecards & tables)
  stat: {
    runs: "#1B3FA0", // Runs column
    fours: "#22C55E", // Fours column
    sixes: "#F59E0B", // Sixes column
    wickets: "#FF3B30", // Wickets column
  },
} as const;

// ─── TYPOGRAPHY ───────────────────────────────────────────────────────────────

export const FONTS = {
  display: "'Barlow Condensed', sans-serif", // Team names, screen titles (800 ExtraBold)
  score: "'Barlow Condensed', sans-serif", // Hero score numbers (900 Black)
  label: "'Barlow Condensed', sans-serif", // Buttons, CTAs, badges (700 Bold)
  body: "'Inter', sans-serif", // Body text, player names (400 Regular)
  ui: "'Inter', sans-serif", // UI elements (600 SemiBold)
} as const;

export const FONT_SIZES = {
  heroScore: "3rem", // 48px — Live score hero number
  teamName: "1.375rem", // 22px — Team names, screen titles (uppercase)
  sectionLabel: "0.6875rem", // 11px — Section labels (uppercase, tracked)
  body: "0.875rem", // 14px — Body text, player names
  meta: "0.75rem", // 12px — Meta, muted info
  buttonCta: "1rem", // 16px — Buttons and CTAs
  badgeLabel: "0.625rem", // 10px — Hero badge labels
} as const;

export const FONT_WEIGHTS = {
  black: "900",
  extraBold: "800",
  bold: "700",
  semiBold: "600",
  medium: "500",
  regular: "400",
} as const;

export const LETTER_SPACING = {
  tight: "-0.01em", // Hero score numbers
  normal: "0",
  wide: "0.04em", // Team names
  wider: "0.06em", // Buttons/CTAs
  widest: "0.08em", // Hero badge labels
  ultra: "0.1em", // Section labels
} as const;

// ─── SPACING ─────────────────────────────────────────────────────────────────

export const SPACING = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.25rem", // 20px
  xl: "1.5rem", // 24px
  "2xl": "1.75rem", // 28px
  "3xl": "2rem", // 32px
  "4xl": "2.5rem", // 40px
} as const;

// ─── BORDER RADIUS ────────────────────────────────────────────────────────────

export const RADII = {
  sm: "0.5rem", // 8px — small chips, tags
  md: "0.625rem", // 10px — rule cards
  lg: "0.75rem", // 12px — main cards
  xl: "0.875rem", // 14px — hero sections
  full: "9999px", // Pills / badges
} as const;

// ─── SHADOWS ─────────────────────────────────────────────────────────────────

export const SHADOWS = {
  card: "0 1px 4px rgba(13, 27, 62, 0.06)",
  button: "0 4px 16px rgba(27, 63, 160, 0.30)",
  hero: "0 8px 32px rgba(13, 27, 62, 0.18)",
  live: "0 4px 12px rgba(255, 59, 48, 0.25)",
} as const;

// ─── NON-NEGOTIABLE DESIGN RULES (for documentation) ─────────────────────────

/**
 * 1. RED LEFT BAR: Every fixture/match row MUST have a 3px `border-l-[3px] border-l-live` left border.
 * 2. SCORE HERO = NAVY CARD: Live scores always on bg-[navy] (#1B3FA0). Never white.
 * 3. UPPERCASE TEAM NAMES: All team names, screen titles, CTAs use Barlow Condensed uppercase.
 * 4. STAT COLORS: runs=#1B3FA0, fours=#22C55E, sixes=#F59E0B, wickets=#FF3B30.
 * 5. NO GRADIENTS ON DATA: Solid colors only on scorecards. Gradients only on splash/onboarding.
 * 6. VIOLET = PRO ONLY: #7C3AED appears only on Pro badges — never on cricket data or navigation.
 */
export const DESIGN_RULES = {
  fixtureBorderWidth: "3px",
  fixtureBorderColor: COLORS.live,
  scoreHeroBg: COLORS.brand,
  proColor: COLORS.violet,
} as const;
