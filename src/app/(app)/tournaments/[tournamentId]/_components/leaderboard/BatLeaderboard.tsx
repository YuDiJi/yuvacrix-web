// src/features/tournaments/leaderboard/BatLeaderboard.tsx

"use client";

import { useState } from "react";
import { RefreshCw, SearchX } from "lucide-react";

import { cn } from "@/lib/cn";
import { useGetTournamentBattingLeaderboardQuery } from "@/store/api/tournamentAnalyticsApi";
import {
  TournamentBattingLeaderboardMetric,
  TournamentLeaderboardTeamOption,
} from "@/types/tournamentAnalytics";

import { battingLeaderboardFilters } from "./leaderboardConfig";
import { S3Image } from "@/components/common/S3Image";

type Props = {
  tournamentId: string;
  teams: TournamentLeaderboardTeamOption[];
  isTeamsLoading?: boolean;
};

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export default function BatLeaderboard({
  tournamentId,
  teams,
  isTeamsLoading = false,
}: Props) {
  const [teamId, setTeamId] = useState("ALL");
  const [metric, setMetric] = useState<TournamentBattingLeaderboardMetric>(
    TournamentBattingLeaderboardMetric.RUNS,
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetTournamentBattingLeaderboardQuery({
      tournamentId,
      query: {
        teamId,
        roundId: "ALL",
        groupId: "ALL",
        metric,
        skip: 0,
        limit: 50,
      },
    });

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  return (
    <div>
      <div className="border-b border-(--color-bg-border) bg-white p-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-(--color-text-muted)">
              Team
            </span>

            <select
              value={teamId}
              onChange={(event) => setTeamId(event.target.value)}
              disabled={isTeamsLoading}
              className="h-11 w-full rounded-xl border border-(--color-bg-border) bg-white px-3 text-sm font-semibold text-(--color-text-primary) outline-none focus:border-(--color-brand)"
            >
              <option value="ALL">
                {isTeamsLoading ? "Loading teams..." : "All teams"}
              </option>

              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-(--color-text-muted)">
              Ranking
            </span>

            <select
              value={metric}
              onChange={(event) =>
                setMetric(
                  event.target.value as TournamentBattingLeaderboardMetric,
                )
              }
              className="h-11 w-full rounded-xl border border-(--color-bg-border) bg-white px-3 text-sm font-semibold text-(--color-text-primary) outline-none focus:border-(--color-brand)"
            >
              {battingLeaderboardFilters.map((filter) => (
                <option key={filter.metric} value={filter.metric}>
                  {filter.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : !data?.items.length ? (
        <EmptyState />
      ) : (
        <div className="space-y-2 p-3">
          {data.items.map((item, index) => {
            const progress =
              index === 0 || !data.items[0]?.value
                ? 100
                : Math.max(
                    8,
                    Math.min(100, (item.value / data.items[0].value) * 100),
                  );

            return (
              <article
                key={item.player.playerId}
                className="relative overflow-hidden rounded-2xl border border-(--color-bg-border) bg-white shadow-sm"
              >
                <div className="flex items-center gap-3 p-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-(--color-bg-tint)">
                    {item.player.profileImageUrl ? (
                      <S3Image
                        imageKey={item.player.profileImageUrl}
                        alt={item.player.playerName}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        fallback={
                          <div className="flex h-full w-full items-center justify-center bg-(--color-brand)">
                            <span className="font-bold text-white">
                              {item.player.playerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        }
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-(--color-brand)">
                        <span className="font-bold text-white">
                          {item.player.playerName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-(--color-text-primary)">
                      {item.player.playerName}
                    </h3>

                    <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-(--color-text-muted)">
                      {item.player.teamShortName || item.player.teamName}
                    </p>

                    <p className="mt-1 truncate text-xs text-(--color-text-secondary)">
                      Inn: {item.batting.innings}
                      {" · "}Runs: {item.batting.runs}
                      {" · "}Avg: {formatNumber(item.batting.average)}
                      {" · "}SR: {formatNumber(item.batting.strikeRate)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="font-(family-name:--font-display) text-3xl font-black text-(--color-navy)">
                      {String(item.rank).padStart(2, "0")}
                    </span>

                    <p className="text-[10px] font-bold uppercase text-(--color-text-muted)">
                      {formatNumber(item.value)}
                    </p>
                  </div>
                </div>

                <div className="h-1 bg-(--color-bg-base)">
                  <div
                    className="h-full rounded-r-full bg-(--color-brand)"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}

      {isFetching && !isLoading && <RefreshingIndicator />}
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3 p-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-20 animate-pulse rounded-2xl bg-white" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
      <SearchX className="size-10 text-(--color-text-muted)" />
      <h3 className="mt-3 font-bold text-(--color-text-primary)">
        No batting rankings yet
      </h3>
      <p className="mt-1 text-sm text-(--color-text-secondary)">
        Leaderboard will update after tournament matches are completed.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
      <p className="text-sm text-(--color-text-secondary)">
        Unable to load batting leaderboard.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl bg-(--color-brand) px-4 py-2 text-sm font-bold text-white"
      >
        Try again
      </button>
    </div>
  );
}

function RefreshingIndicator() {
  return (
    <div className="fixed bottom-20 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-(--color-navy) px-4 py-2 text-xs font-semibold text-white shadow-lg">
      <RefreshCw className="size-3.5 animate-spin" />
      Refreshing
    </div>
  );
}
