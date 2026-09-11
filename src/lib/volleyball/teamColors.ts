export const VOLLEYBALL_TEAM_A_FALLBACK_COLOR = "#F59E0B";
export const VOLLEYBALL_TEAM_B_FALLBACK_COLOR = "#EF3B2D";

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const SHORT_HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{3}$/;

const DARK_FOREGROUND = "#111827";
const LIGHT_FOREGROUND = "#FFFFFF";
const LIGHT_COLOR_OUTLINE = "rgba(17, 24, 39, 0.18)";

export function resolveVolleyballTeamColor(
  teamColor: string | null | undefined,
  fallback: string,
) {
  return normalizeHexColor(teamColor) ?? fallback;
}

export function withHexAlpha(color: string, alpha: string) {
  return `${color}${alpha}`;
}

export function getReadableTextColor(color: string) {
  const rgb = parseHexColor(color);

  if (!rgb) {
    return DARK_FOREGROUND;
  }

  const darkContrast = getContrastRatio(rgb, parseHexColor(DARK_FOREGROUND)!);
  const lightContrast = getContrastRatio(rgb, parseHexColor(LIGHT_FOREGROUND)!);

  return darkContrast >= lightContrast ? DARK_FOREGROUND : LIGHT_FOREGROUND;
}

export function isLightColor(color: string) {
  const rgb = parseHexColor(color);

  if (!rgb) {
    return false;
  }

  return getRelativeLuminance(rgb) > 0.78;
}

export function getTeamColorSurfaceStyles(color: string) {
  const normalizedColor = normalizeHexColor(color) ?? color;
  const needsOutline = isLightColor(normalizedColor);

  return {
    backgroundColor: normalizedColor,
    color: getReadableTextColor(normalizedColor),
    borderColor: needsOutline ? LIGHT_COLOR_OUTLINE : normalizedColor,
  };
}

export function getTeamColorIndicatorStyles(color: string) {
  const normalizedColor = normalizeHexColor(color) ?? color;
  const needsOutline = isLightColor(normalizedColor);

  return {
    backgroundColor: normalizedColor,
    borderColor: needsOutline ? LIGHT_COLOR_OUTLINE : normalizedColor,
  };
}

export function getTeamColorAccentTextColor(color: string) {
  const normalizedColor = normalizeHexColor(color) ?? color;

  return isLightColor(normalizedColor)
    ? DARK_FOREGROUND
    : getReadableTextColor(normalizedColor);
}

function normalizeHexColor(color: string | null | undefined) {
  if (!color) {
    return null;
  }

  if (HEX_COLOR_PATTERN.test(color)) {
    return color.toUpperCase();
  }

  if (SHORT_HEX_COLOR_PATTERN.test(color)) {
    const [, red, green, blue] = color;

    return `#${red}${red}${green}${green}${blue}${blue}`.toUpperCase();
  }

  return null;
}

function parseHexColor(color: string) {
  const normalizedColor = normalizeHexColor(color);

  if (!normalizedColor) {
    return null;
  }

  return {
    red: Number.parseInt(normalizedColor.slice(1, 3), 16),
    green: Number.parseInt(normalizedColor.slice(3, 5), 16),
    blue: Number.parseInt(normalizedColor.slice(5, 7), 16),
  };
}

function getContrastRatio(
  foreground: { red: number; green: number; blue: number },
  background: { red: number; green: number; blue: number },
) {
  const foregroundLuminance = getRelativeLuminance(foreground);
  const backgroundLuminance = getRelativeLuminance(background);

  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance({
  red,
  green,
  blue,
}: {
  red: number;
  green: number;
  blue: number;
}) {
  const [r, g, b] = [red, green, blue].map((channel) => {
    const value = channel / 255;

    return value <= 0.03928
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
