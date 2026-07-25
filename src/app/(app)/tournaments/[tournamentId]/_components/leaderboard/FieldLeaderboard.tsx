// src/features/tournaments/leaderboard/FieldLeaderboard.tsx

"use client";

import Image from "next/image";
import { useState } from "react";
import { SearchX } from "lucide-react";

import { useGetTournamentFieldingLeaderboardQuery } from "@/store/api/tournamentAnalyticsApi";
import {
  TournamentFieldingLeaderboardMetric,
  TournamentLeaderboardTeamOption,
} from "@/types/tournamentAnalytics";

import { fieldingLeaderboardFilters } from "./leaderboardConfig";
import { S3Image } from "@/components/common/S3Image";

type Props = {
  tournamentId: string;
  teams: TournamentLeaderboardTeamOption[];
  isTeamsLoading?: boolean;
};

export default function FieldLeaderboard({
  tournamentId,
  teams,
  isTeamsLoading = false,
}: Props) {
  const [teamId, setTeamId] = useState("ALL");
  const [metric, setMetric] = useState<TournamentFieldingLeaderboardMetric>(
    TournamentFieldingLeaderboardMetric.DISMISSALS,
  );

  const { data, isLoading, isError, refetch } =
    useGetTournamentFieldingLeaderboardQuery({
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
                event.target.value as TournamentFieldingLeaderboardMetric,
              )
            }
            className="h-11 rounded-xl border border-(--color-bg-border) bg-white px-3 text-sm font-semibold text-(--color-text-primary)"
          >
            {fieldingLeaderboardFilters.map((filter) => (
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
        <Empty
          title="Unable to load fielding leaderboard"
          buttonLabel="Try again"
          onClick={refetch}
        />
      ) : !data?.items.length ? (
        <Empty
          title="No fielding rankings yet"
          description="Leaderboard will update after tournament matches are completed."
        />
      ) : (
        <div className="space-y-2 p-3">
          {data.items.map((item) => {
            const topValue = data.items[0]?.value || 1;
            const progress = Math.max(
              8,
              Math.min(100, (item.value / topValue) * 100),
            );

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
                      Mat: {item.fielding.matches ?? 0}
                      {" · "}Dismissals: {item.fielding.dismissals}
                      {" · "}Catches: {item.fielding.catches}
                      {" · "}R/O: {item.fielding.runOuts}
                    </p>

                    {metric ===
                      TournamentFieldingLeaderboardMetric.WICKET_KEEPER_DISMISSALS && (
                      <p className="mt-0.5 text-[11px] font-semibold text-(--color-brand)">
                        Keeper dismissals:{" "}
                        {item.fielding.wicketKeeperDismissals ?? 0}
                        {" · "}Caught behind: {item.fielding.caughtBehind}
                        {" · "}Stumpings: {item.fielding.stumpings}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="font-(family-name:--font-display) text-3xl font-black text-(--color-navy)">
                      {String(item.rank).padStart(2, "0")}
                    </span>

                    <p className="text-[10px] font-bold text-(--color-text-muted)">
                      {item.value}
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

function Empty({
  title,
  description,
  buttonLabel,
  onClick,
}: {
  title: string;
  description?: string;
  buttonLabel?: string;
  onClick?: () => void;
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

      {buttonLabel && onClick && (
        <button
          type="button"
          onClick={onClick}
          className="mt-4 rounded-xl bg-(--color-brand) px-4 py-2 text-sm font-bold text-white"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
