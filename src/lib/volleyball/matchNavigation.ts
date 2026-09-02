import {
  VOLLEYBALL_MATCH_PRIMARY_ACTIONS,
  VOLLEYBALL_MY_MATCH_SOURCES,
  type VolleyballMyMatchItem,
} from "@/types/volleyball/match";

function getMatchContextSuffix(match: VolleyballMyMatchItem) {
  if (
    match.sourceType !== VOLLEYBALL_MY_MATCH_SOURCES.TOURNAMENT ||
    !match.tournament ||
    !match.fixture
  ) {
    return "";
  }

  const query = new URLSearchParams({
    tournamentId: match.tournament.id,
    fixtureId: match.fixture.id,
  });

  return `?${query.toString()}`;
}

export function getVolleyballMatchActionHref(match: VolleyballMyMatchItem) {
  const suffix = getMatchContextSuffix(match);

  switch (match.primaryAction) {
    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.SETUP_ROSTER:
      return `/volleyball/matches/${match.matchId}/rosters${suffix}`;

    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.START_SET:
      return `/volleyball/matches/${match.matchId}/sets/setup${suffix}`;

    /*
     * Compact feed items do not expose the active set id required by scoring.
     * Match Details resolves it and preserves the established resume flow.
     */
    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.RESUME_SCORING:
    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.VIEW_RESULT:
    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.VIEW_MATCH:
    default:
      return `/volleyball/matches/${match.matchId}${suffix}`;
  }
}

export function getVolleyballMatchActionLabel(match: VolleyballMyMatchItem) {
  switch (match.primaryAction) {
    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.SETUP_ROSTER:
      return "Setup Rosters";
    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.START_SET:
      return "Start Match";
    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.RESUME_SCORING:
      return "Resume Scoring";
    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.VIEW_RESULT:
      return "View Result";
    case VOLLEYBALL_MATCH_PRIMARY_ACTIONS.VIEW_MATCH:
    default:
      return "View Match";
  }
}
