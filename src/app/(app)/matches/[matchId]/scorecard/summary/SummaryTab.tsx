"use client";

import { useGetScorecardSummaryQuery } from "@/store/api/cricket/scorecardApi";
import {
  ScorecardResponse,
  ScorecardSummaryResponse,
  TeamScoreSummary,
} from "@/types/cricket/scorecard";
import SummaryResultCard from "./SummaryResultCard";
import SummaryScoreCard from "./SummaryScoreCard";
import SummaryPerformerCard from "./SummaryPerformerCard";

type Props = {
  matchId: string;
  initialScorecard?: ScorecardResponse | null;
};

// Build a TeamScoreSummary from the full scorecard's match snapshot when the
// dedicated summary endpoint isn't available — uses only backend-provided fields.
function teamScoreFromInnings(
  team:
    | {
        teamId: string;
        teamNameSnapshot: string;
        shortNameSnapshot?: string | null;
        logoUrl?: string | null;
      }
    | undefined,
  innings: ScorecardResponse["innings"][number] | undefined,
): TeamScoreSummary | null {
  if (!team || !innings) return null;
  return {
    teamId: team.teamId,
    teamNameSnapshot: team.teamNameSnapshot,
    logoUrl: team.logoUrl ?? undefined,
    runs: innings.totalRuns,
    wickets: innings.wickets,
    overs: String(innings.overs),
    runRate: (innings as unknown as { runRate?: number }).runRate ?? 0,
    inningsId: innings.inningsId,
  };
}

export default function SummaryTab({ matchId, initialScorecard }: Props) {
  const {
    data: summary,
    isLoading,
    isError,
  } = useGetScorecardSummaryQuery(matchId, {
    skip: !matchId,
  });

  const showLoading = isLoading && !initialScorecard;

  // Prefer dedicated summary; fall back to full scorecard data if summary fails.
  const hasSummary = !isError && !!summary;
  const hasFallback = Boolean(initialScorecard);

  const teamAScore: TeamScoreSummary | null = hasSummary
    ? summary!.teamAScore
    : hasFallback
      ? teamScoreFromInnings(
          initialScorecard?.match?.teamA,
          initialScorecard?.innings?.[0],
        )
      : null;

  const teamBScore: TeamScoreSummary | null = hasSummary
    ? summary!.teamBScore
    : hasFallback
      ? teamScoreFromInnings(
          initialScorecard?.match?.teamB,
          initialScorecard?.innings?.[1],
        )
      : null;

  const resultText = hasSummary ? summary!.resultText : null;
  const matchStatus = initialScorecard?.match?.status ?? null;
  const winnerTeamId = hasSummary ? summary!.winnerTeamId : null;

  const playerOfTheMatch = hasSummary
    ? summary!.playerOfTheMatchCandidate
    : null;
  const bestBatter = hasSummary ? summary!.bestBatter : null;
  const bestBowler = hasSummary ? summary!.bestBowler : null;
  const starPerformances: ScorecardSummaryResponse["starPerformances"] =
    hasSummary ? (summary!.starPerformances ?? []) : [];

  const noDataAtAll = !showLoading && !hasSummary && !hasFallback;
  const noScores = !showLoading && !noDataAtAll && !teamAScore && !teamBScore;

  return (
    <div className="flex flex-col gap-3 px-3 py-3 pb-6">
      {showLoading && <SummarySkeleton />}

      {!showLoading && isError && !hasFallback && (
        <div className="mt-8 flex flex-col items-center gap-2 px-6 text-center">
          <p className="font-display text-[15px] font-bold uppercase text-(--color-navy)">
            Unable to load summary
          </p>
          <p className="text-meta">Check your connection and try again.</p>
        </div>
      )}

      {noDataAtAll && !isError && (
        <div className="mt-8 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-6 text-center shadow-(--shadow-card)">
          <p className="text-body text-(--color-text-secondary)">
            Summary not available yet.
          </p>
        </div>
      )}

      {noScores && (
        <div className="mt-2 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-6 text-center shadow-(--shadow-card)">
          <p className="text-body text-(--color-text-secondary)">
            Match summary will appear once scoring starts.
          </p>
        </div>
      )}

      {!showLoading && !noDataAtAll && (teamAScore || teamBScore) && (
        <>
          {/* ── Result / Status ──────────────────────────── */}
          <SummaryResultCard
            resultText={resultText}
            matchStatus={matchStatus}
            hasWinner={Boolean(winnerTeamId)}
          />

          {/* ── Team Score Cards ──────────────────────────── */}
          <div className="flex flex-col gap-2">
            {teamAScore && (
              <SummaryScoreCard
                team={teamAScore}
                isWinner={winnerTeamId === teamAScore.teamId}
              />
            )}
            {teamBScore && (
              <SummaryScoreCard
                team={teamBScore}
                isWinner={winnerTeamId === teamBScore.teamId}
              />
            )}
          </div>

          {/* ── Player of the Match ──────────────────────────── */}
          {playerOfTheMatch && (
            <div className="flex flex-col gap-2">
              <p className="text-section-label px-1">Heroes of the Match</p>
              <SummaryPerformerCard
                title="Player of the Match"
                performer={playerOfTheMatch}
                kind="player_of_match"
              />
            </div>
          )}

          {/* ── Best Batter / Best Bowler (stacked full-width) ──── */}
          {(bestBatter || bestBowler) && (
            <div className="flex flex-col gap-3">
              {bestBatter && (
                <SummaryPerformerCard
                  title="Best Batter"
                  performer={bestBatter}
                  kind="batter"
                />
              )}
              {bestBowler && (
                <SummaryPerformerCard
                  title="Best Bowler"
                  performer={bestBowler}
                  kind="bowler"
                />
              )}
            </div>
          )}

          {/* ── Star Performances ──────────────────────────── */}
          {starPerformances && starPerformances.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-section-label px-1">Star Performances</p>
              <div className="flex flex-col gap-3">
                {starPerformances.map((p) => (
                  <SummaryPerformerCard
                    key={p.playerId}
                    title={p.reason ?? "Star Performance"}
                    performer={p}
                    kind="star"
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Compact Match Facts ──────────────────────────── */}
          {initialScorecard?.match && (
            <MatchFacts match={initialScorecard.match} />
          )}
        </>
      )}
    </div>
  );
}

// ── Match Facts ───────────────────────────────────────────────────────
function MatchFacts({
  match,
}: {
  match: NonNullable<ScorecardResponse["match"]>;
}) {
  const toss = (
    match as unknown as {
      toss?: { winnerTeamName?: string; decision?: string };
    }
  ).toss;
  const matchType = (match as unknown as { matchType?: string }).matchType;
  const venue = match.venue;

  const hasFacts = Boolean(toss?.winnerTeamName || venue || matchType);
  if (!hasFacts) return null;

  return (
    <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3 shadow-(--shadow-card)">
      <p className="text-section-label mb-2">Match Facts</p>
      <div className="flex flex-col gap-1.5">
        {toss?.winnerTeamName && (
          <FactRow
            label="Toss"
            value={`${toss.winnerTeamName}${toss.decision ? ` opted to ${toss.decision.toLowerCase()}` : ""}`}
          />
        )}
        {venue && (
          <FactRow label="Venue" value={`${venue.groundName}, ${venue.city}`} />
        )}
        {matchType && <FactRow label="Match Type" value={matchType} />}
      </div>
    </div>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-meta shrink-0">{label}</span>
      <span className="text-[12px] font-medium text-(--color-text-body) text-right">
        {value}
      </span>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────
function SummarySkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {/* Result pill */}
      <div className="h-12 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card)" />
      {/* Two score cards */}
      <div className="h-16 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card)" />
      <div className="h-16 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card)" />
      {/* Hero performer card */}
      <div className="overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-card)">
        <div className="h-56 bg-(--color-bg-border)" />
        <div className="space-y-2 px-4 py-3">
          <div className="h-4 w-2/3 rounded bg-(--color-bg-border)" />
          <div className="h-3 w-1/3 rounded bg-(--color-bg-border)" />
          <div className="h-3 w-1/2 rounded bg-(--color-bg-border)" />
        </div>
      </div>
      {/* Two more performer cards */}
      <div className="h-72 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card)" />
      <div className="h-72 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card)" />
    </div>
  );
}
