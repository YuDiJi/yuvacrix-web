import type { VolleyballMatch } from "@/types/volleyball/match";
import type { VolleyballMatchRoster } from "@/types/volleyball/roster";

type VolleyballMatchWithReadyRosters = VolleyballMatch & {
  teamARoster: VolleyballMatchRoster & { isConfirmed: true };
  teamBRoster: VolleyballMatchRoster & { isConfirmed: true };
};

export function isVolleyballRosterReadyForSetSetup(
  match: VolleyballMatch | null | undefined,
): match is VolleyballMatchWithReadyRosters {
  return Boolean(
    match?.teamARoster?.isConfirmed && match.teamBRoster?.isConfirmed,
  );
}
