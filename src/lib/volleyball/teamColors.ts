export const VOLLEYBALL_TEAM_A_FALLBACK_COLOR = "#F59E0B";
export const VOLLEYBALL_TEAM_B_FALLBACK_COLOR = "#EF3B2D";

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export function resolveVolleyballTeamColor(
  teamColor: string | null | undefined,
  fallback: string,
) {
  return teamColor && HEX_COLOR_PATTERN.test(teamColor)
    ? teamColor.toUpperCase()
    : fallback;
}

export function withHexAlpha(color: string, alpha: string) {
  return `${color}${alpha}`;
}

export function getReadableTextColor(color: string) {
  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;

  return luminance >= 160 ? "#111827" : "#FFFFFF";
}
