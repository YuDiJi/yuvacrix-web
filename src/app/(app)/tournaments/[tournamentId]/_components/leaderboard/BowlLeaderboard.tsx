// src/features/tournaments/leaderboard/BowlLeaderboard.tsx

"use client";

import Image from "next/image";
import { useState } from "react";
import { SearchX } from "lucide-react";

import { useGetTournamentBowlingLeaderboardQuery } from "@/store/api/tournamentAnalyticsApi";
import {
  TournamentBowlingLeaderboardMetric,
  TournamentLeaderboardTeamOption,
} from "@/types/tournamentAnalytics";

import { bowlingLeaderboardFilters } from "./leaderboardConfig";
import { S3Image } from "@/components/common/S3Image";

type Props = {
  tournamentId: string;
  teams: TournamentLeaderboardTeamOption[];
  isTeamsLoading?: boolean;
};

function valueOrDash(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";

  return Number.isInteger(value) ? value : value.toFixed(2);
}

export default function BowlLeaderboard({
  tournamentId,
  teams,
  isTeamsLoading = false,
}: Props) {
  const [teamId, setTeamId] = useState("ALL");
  const [metric, setMetric] = useState<TournamentBowlingLeaderboardMetric>(
    TournamentBowlingLeaderboardMetric.WICKETS,
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetTournamentBowlingLeaderboardQuery({
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

  return (
    <div>
      <div className="border-b border-(--color-bg-border) bg-white p-3">
        <div className="grid grid-cols-2 gap-3">
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

          <select
            value={metric}
            onChange={(event) =>
              setMetric(
                event.target.value as TournamentBowlingLeaderboardMetric,
              )
            }
            className="h-11 rounded-xl border border-(--color-bg-border) bg-white px-3 text-sm font-semibold text-(--color-text-primary)"
          >
            {bowlingLeaderboardFilters.map((filter) => (
              <option key={filter.metric} value={filter.metric}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <Skeleton />
      ) : isError ? (
        <Message
          title="Unable to load bowling leaderboard"
          actionLabel="Try again"
          onAction={refetch}
        />
      ) : !data?.items.length ? (
        <Message
          title="No bowling rankings yet"
          description="Leaderboard will update after tournament matches are completed."
        />
      ) : (
        <div className="space-y-2 p-3">
          {data.items.map((item, index) => {
            const topValue = data.items[0]?.value || 1;
            const progress = Math.max(
              8,
              Math.min(100, (item.value / topValue) * 100),
            );

            const bestFigures =
              item.bowling.bestWicketsInInnings !== undefined
                ? `${item.bowling.bestWicketsInInnings}/${
                    item.bowling.bestRunsConcededInInnings ?? 0
                  }`
                : null;

            return (
              <article
                key={item.player.playerId}
                className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-white shadow-sm"
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

                    <p className="truncate text-[11px] font-semibold uppercase text-(--color-text-muted)">
                      {item.player.teamShortName || item.player.teamName}
                    </p>

                    <p className="mt-1 truncate text-xs text-(--color-text-secondary)">
                      Inn: {item.bowling.innings}
                      {" · "}W: {item.bowling.wickets}
                      {" · "}Eco: {valueOrDash(item.bowling.economy)}
                      {" · "}Avg: {valueOrDash(item.bowling.average)}
                    </p>

                    {metric ===
                      TournamentBowlingLeaderboardMetric.HIGHEST_WICKETS_IN_INNINGS &&
                      bestFigures && (
                        <p className="mt-0.5 text-[11px] font-semibold text-(--color-brand)">
                          Best: {bestFigures} in{" "}
                          {item.bowling.bestOversInInnings ?? "—"} overs
                        </p>
                      )}
                  </div>

                  <div className="text-right">
                    <span className="font-(family-name:--font-display) text-3xl font-black text-(--color-navy)">
                      {String(item.rank).padStart(2, "0")}
                    </span>

                    <p className="text-[10px] font-bold text-(--color-text-muted)">
                      {valueOrDash(item.value)}
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

      {isFetching && !isLoading && (
        <p className="pb-3 text-center text-xs text-(--color-text-muted)">
          Updating rankings...
        </p>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 p-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-20 animate-pulse rounded-2xl bg-white" />
      ))}
    </div>
  );
}

function Message({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
      <SearchX className="size-10 text-(--color-text-muted)" />
      <h3 className="mt-3 font-bold text-(--color-text-primary)">{title}</h3>

      {description && (
        <p className="mt-1 text-sm text-(--color-text-secondary)">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-xl bg-(--color-brand) px-4 py-2 text-sm font-bold text-white"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
