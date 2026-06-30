"use client";

import { useMemo } from "react";
import { useGetScorecardSquadsQuery } from "@/store/api/scorecardApi";
import { ScorecardSquads, SquadPlayer } from "@/types/scorecard";
import TeamLogo from "./Teamlogo";
import SquadPlayerCard from "./Squadplayercard";

type Props = {
  matchId: string;
  initialSquads?: ScorecardSquads | null;
};

// Sort Playing XI by battingOrder when present, else keep original order.
function sortPlayers(players: SquadPlayer[]): SquadPlayer[] {
  return [...players].sort((a, b) => {
    if (a.battingOrder != null && b.battingOrder != null) {
      return a.battingOrder - b.battingOrder;
    }
    if (a.battingOrder != null) return -1;
    if (b.battingOrder != null) return 1;
    return 0;
  });
}

export default function SquadTab({ matchId, initialSquads }: Props) {
  const hasInitialSquads = Boolean(
    initialSquads && (initialSquads.teamA || initialSquads.teamB),
  );

  // Only call the squads endpoint if the parent didn't already give us
  // squads from the full scorecard response.
  const { data, isLoading, isError } = useGetScorecardSquadsQuery(matchId, {
    skip: !matchId || hasInitialSquads,
  });

  const squads = hasInitialSquads ? initialSquads : data;

  const teamA = squads?.teamA;
  const teamB = squads?.teamB;

  const teamAPlayers = useMemo(
    () => sortPlayers(teamA?.players ?? []),
    [teamA],
  );
  const teamBPlayers = useMemo(
    () => sortPlayers(teamB?.players ?? []),
    [teamB],
  );

  const showLoading = !hasInitialSquads && isLoading;
  const showError = !hasInitialSquads && isError;
  const noSquadData = !showLoading && !showError && !teamA && !teamB;
  const noPlayers =
    !showLoading &&
    !showError &&
    (teamA || teamB) &&
    teamAPlayers.length === 0 &&
    teamBPlayers.length === 0;

  // Pair players row-by-row so left/right line up like the reference layout.
  const maxRows = Math.max(teamAPlayers.length, teamBPlayers.length);
  const rows = Array.from({ length: maxRows }, (_, i) => ({
    left: teamAPlayers[i],
    right: teamBPlayers[i],
  }));

  return (
    <div className="flex flex-col pb-4">
      {showLoading && <SquadSkeleton />}

      {showError && (
        <div className="mt-8 flex flex-col items-center gap-2 px-6 text-center">
          <p className="font-display text-[15px] font-bold uppercase text-(--color-navy)">
            Unable to load squad
          </p>
          <p className="text-meta">Check your connection and try again.</p>
        </div>
      )}

      {noSquadData && (
        <div className="mx-3 mt-3 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-6 text-center shadow-(--shadow-card)">
          <p className="text-body text-(--color-text-secondary)">
            Squad not available.
          </p>
        </div>
      )}

      {!showLoading && !showError && (teamA || teamB) && (
        <>
          {/* ── Team header strip ──────────────────────── */}
          <div className="flex items-center border-b border-(--color-bg-border) bg-(--color-bg-card) px-3 py-3">
            <div className="flex flex-1 items-center gap-2">
              <TeamLogo
                logoUrl={teamA?.team.logoUrlSnapshot}
                name={teamA?.team.teamNameSnapshot ?? "Team A"}
                size={32}
                bg="bg-(--color-brand)"
              />
              <span className="truncate font-display text-[13px] font-black uppercase tracking-wide text-(--color-navy)">
                {teamA?.team.shortNameSnapshot ??
                  teamA?.team.teamNameSnapshot ??
                  "Team A"}
              </span>
            </div>

            <div className="mx-2 h-6 w-px bg-(--color-bg-border)" />

            <div className="flex flex-1 items-center justify-end gap-2">
              <span className="truncate text-right font-display text-[13px] font-black uppercase tracking-wide text-(--color-navy)">
                {teamB?.team.shortNameSnapshot ??
                  teamB?.team.teamNameSnapshot ??
                  "Team B"}
              </span>
              <TeamLogo
                logoUrl={teamB?.team.logoUrlSnapshot}
                name={teamB?.team.teamNameSnapshot ?? "Team B"}
                size={32}
                bg="bg-(--color-live)"
              />
            </div>
          </div>

          {/* ── Player count summary ──────────────────────── */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-meta">{teamAPlayers.length} players</span>
            <span className="text-section-label">Squad</span>
            <span className="text-meta">{teamBPlayers.length} players</span>
          </div>

          {/* ── Side-by-side player rows ──────────────────────── */}
          {noPlayers ? (
            <div className="mx-3 mt-2 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-6 text-center shadow-(--shadow-card)">
              <p className="text-body text-(--color-text-secondary)">
                Squad not available.
              </p>
            </div>
          ) : (
            <div className="bg-(--color-bg-card)">
              {rows.map((row, i) => (
                <div
                  key={i}
                  className="flex items-stretch divide-x divide-(--color-bg-border) border-b border-(--color-bg-border) px-3 last:border-b-0"
                >
                  <div className="flex-1 pr-2">
                    {row.left && (
                      <SquadPlayerCard player={row.left} align="left" />
                    )}
                  </div>
                  <div className="flex-1 pl-2">
                    {row.right && (
                      <SquadPlayerCard player={row.right} align="right" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────
function SquadSkeleton() {
  return (
    <div className="flex flex-col gap-0 pt-1 animate-pulse">
      <div className="mx-3 h-12 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card)" />
      <div className="mt-2 bg-(--color-bg-card)">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-stretch divide-x divide-(--color-bg-border) border-b border-(--color-bg-border) px-3 py-2.5"
          >
            <div className="flex flex-1 items-center gap-2 pr-2">
              <div className="h-9 w-9 shrink-0 rounded-full bg-(--color-bg-border)" />
              <div className="h-3 flex-1 rounded bg-(--color-bg-border)" />
            </div>
            <div className="flex flex-1 items-center justify-end gap-2 pl-2">
              <div className="h-3 flex-1 rounded bg-(--color-bg-border)" />
              <div className="h-9 w-9 shrink-0 rounded-full bg-(--color-bg-border)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
