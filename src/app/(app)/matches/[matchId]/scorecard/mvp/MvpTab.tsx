"use client";

import { useGetScorecardMVPQuery } from "@/store/api/cricket/scorecardApi";
import MvpCandidateCard from "./MvpCandidateCard";
import MvpStatCard from "./MvpStatCard";
import MvpRankingCard from "./MvpRankingCard";

type Props = {
  matchId: string;
};

// Pull a stat value out of the loosely-typed batting/bowling records without
// performing any calculation — just safe formatted reads of backend values.
function readStat(
  record: Record<string, unknown> | undefined,
  key: string,
): string | undefined {
  if (!record) return undefined;
  const value = record[key];
  if (value === null || value === undefined) return undefined;
  return String(value);
}

export default function MvpTab({ matchId }: Props) {
  const { data, isLoading, isError } = useGetScorecardMVPQuery(matchId, {
    skip: !matchId,
  });

  const showLoading = isLoading;
  const showError = !showLoading && isError;
  const noCandidate =
    !showLoading &&
    !showError &&
    (!data || data.playerOfTheMatchCandidate == null);
  const hasRankings =
    !showLoading && !showError && data && data.rankings.length > 0;

  return (
    <div className="flex flex-col gap-4 px-3 py-3 pb-6">
      {showLoading && <MvpSkeleton />}

      {showError && (
        <div className="mt-8 flex flex-col items-center gap-2 px-6 text-center">
          <p className="font-display text-[15px] font-bold uppercase text-(--color-navy)">
            Unable to load MVP
          </p>
          <p className="text-meta">Check your connection and try again.</p>
        </div>
      )}

      {noCandidate && (
        <div className="mt-4 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-6 text-center shadow-(--shadow-card)">
          <p className="text-body text-(--color-text-secondary)">
            No MVP available yet.
          </p>
        </div>
      )}

      {!showLoading && !showError && data && data.playerOfTheMatchCandidate && (
        <>
          {/* ── Player of the Match Candidate ──────────────────────── */}
          <MvpCandidateCard player={data.playerOfTheMatchCandidate} />

          {/* ── Best Batter / Best Bowler ──────────────────────── */}
          {(data.bestBatter || data.bestBowler) && (
            <div className="flex gap-3">
              <MvpStatCard
                title="Best Batter"
                player={data.bestBatter}
                accent="brand"
                stats={
                  data.bestBatter
                    ? [
                        {
                          label: "Runs",
                          value:
                            readStat(data.bestBatter.batting, "runs") ?? "-",
                        },
                        {
                          label: "Balls",
                          value:
                            readStat(data.bestBatter.batting, "balls") ?? "-",
                        },
                        {
                          label: "SR",
                          value:
                            readStat(data.bestBatter.batting, "strikeRate") ??
                            "-",
                        },
                        {
                          label: "4s/6s",
                          value: `${readStat(data.bestBatter.batting, "fours") ?? "0"}/${readStat(data.bestBatter.batting, "sixes") ?? "0"}`,
                        },
                      ]
                    : []
                }
              />
              <MvpStatCard
                title="Best Bowler"
                player={data.bestBowler}
                accent="sky"
                stats={
                  data.bestBowler
                    ? [
                        {
                          label: "Overs",
                          value:
                            readStat(data.bestBowler.bowling, "overs") ?? "-",
                        },
                        {
                          label: "Wickets",
                          value:
                            readStat(data.bestBowler.bowling, "wickets") ?? "-",
                        },
                        {
                          label: "Runs",
                          value:
                            readStat(data.bestBowler.bowling, "runsConceded") ??
                            "-",
                        },
                        {
                          label: "Economy",
                          value:
                            readStat(data.bestBowler.bowling, "economy") ?? "-",
                        },
                      ]
                    : []
                }
              />
            </div>
          )}

          {/* ── MVP Rankings ──────────────────────── */}
          {hasRankings && (
            <div className="overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
              <div className="border-b border-(--color-bg-border) px-3 py-2.5">
                <p className="text-section-label">Top MVP Rankings</p>
              </div>
              <div className="divide-y divide-(--color-bg-border)">
                {data!.rankings.map((player, idx) => (
                  <MvpRankingCard
                    key={player.playerId}
                    player={player}
                    rank={idx + 1}
                    highlighted={
                      data!.playerOfTheMatchCandidate?.playerId ===
                      player.playerId
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {data.formulaVersion && (
            <p className="text-center text-[10px] text-(--color-text-muted)">
              MVP formula v{data.formulaVersion}
            </p>
          )}
        </>
      )}
    </div>
  );
}

// ── Skeleton (reuses the existing scorecard skeleton visual language) ──
function MvpSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-56 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card)" />
      <div className="flex gap-3">
        <div className="h-32 flex-1 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card)" />
        <div className="h-32 flex-1 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card)" />
      </div>
      <div className="overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-card)">
        <div className="h-9 bg-(--color-bg-base)" />
        <div className="divide-y divide-(--color-bg-border)">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3">
              <div className="h-6 w-6 flex-shrink-0 rounded-full bg-(--color-bg-border)" />
              <div className="h-9 w-9 flex-shrink-0 rounded-full bg-(--color-bg-border)" />
              <div className="h-3 flex-1 rounded bg-(--color-bg-border)" />
              <div className="h-5 w-10 rounded bg-(--color-bg-border)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
