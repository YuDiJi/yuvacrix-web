// src/features/tournaments/leaderboard/MvpLeaderboard.tsx

"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, SearchX, Sparkles } from "lucide-react";

import { cn } from "@/lib/cn";
import { useGetTournamentMvpLeaderboardQuery } from "@/store/api/cricket/tournamentAnalyticsApi";
import {
  TournamentLeaderboardTeamOption,
  TournamentMvpLeaderboardItem,
} from "@/types/cricket/tournamentAnalytics";
import { S3Image } from "@/components/common/S3Image";

type Props = {
  tournamentId: string;
  teams: TournamentLeaderboardTeamOption[];
  isTeamsLoading?: boolean;
};

export default function MvpLeaderboard({
  tournamentId,
  teams,
  isTeamsLoading = false,
}: Props) {
  const [teamId, setTeamId] = useState("ALL");
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } =
    useGetTournamentMvpLeaderboardQuery({
      tournamentId,
      query: {
        teamId,
        roundId: "ALL",
        groupId: "ALL",
        skip: 0,
        limit: 50,
      },
    });

  return (
    <div>
      <div className="border-b border-(--color-bg-border) bg-white p-3">
        <label className="block space-y-1">
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
      </div>

      {/* {data && (
        <div className="flex items-center justify-between border-b border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-(--color-brand)" />

            <div>
              <p className="text-xs font-bold text-(--color-text-primary)">
                MVP Points
              </p>

              <p className="text-[10px] text-(--color-text-secondary)">
                {data.formulaVersion} · {data.mvpConfigMode}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-(--color-brand)">
            Backend calculated
          </span>
        </div>
      )} */}

      {isLoading ? (
        <Skeleton />
      ) : isError ? (
        <Empty
          title="Unable to load MVP leaderboard"
          buttonLabel="Try again"
          onClick={refetch}
        />
      ) : !data?.items.length ? (
        <Empty
          title="No MVP rankings yet"
          description="Leaderboard will update after tournament matches are completed."
        />
      ) : (
        <div className="space-y-2 p-3">
          {data.items.map((item) => {
            const isExpanded = expandedPlayerId === item.player.playerId;

            return (
              <MvpRow
                key={item.player.playerId}
                item={item}
                expanded={isExpanded}
                onToggle={() =>
                  setExpandedPlayerId((current) =>
                    current === item.player.playerId
                      ? null
                      : item.player.playerId,
                  )
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function MvpRow({
  item,
  expanded,
  onToggle,
}: {
  item: TournamentMvpLeaderboardItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full font-(family-name:--font-display) text-lg font-black",
            item.rank === 1
              ? "bg-amber-100 text-amber-700"
              : item.rank === 2
                ? "bg-slate-200 text-slate-700"
                : item.rank === 3
                  ? "bg-orange-100 text-orange-700"
                  : "bg-(--color-bg-base) text-(--color-text-secondary)",
          )}
        >
          {item.rank}
        </div>

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

          <p className="mt-1 text-xs text-(--color-text-secondary)">
            Bat {item.mvp.battingPoints.toFixed(2)}
            {" · "}Bowl {item.mvp.bowlingPoints.toFixed(2)}
            {" · "}Field {item.mvp.fieldingPoints.toFixed(2)}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-(family-name:--font-display) text-3xl font-black text-(--color-brand)">
            {item.value.toFixed(3)}
          </p>

          <ChevronDown
            className={cn(
              "ml-auto size-4 text-(--color-text-muted) transition-transform",
              expanded && "rotate-180",
            )}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-(--color-bg-border) bg-(--color-bg-tint) p-3">
          <div className="grid grid-cols-3 gap-2">
            <StatBox label="Runs" value={item.batting.runs} />

            <StatBox label="Wickets" value={item.bowling.wickets} />

            <StatBox label="Dismissals" value={item.fielding.dismissals} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <PointBox label="Batting points" value={item.mvp.battingPoints} />

            <PointBox label="Bowling points" value={item.mvp.bowlingPoints} />

            <PointBox label="Fielding points" value={item.mvp.fieldingPoints} />

            <PointBox label="Penalty points" value={item.mvp.penaltyPoints} />
          </div>
        </div>
      )}
    </article>
  );
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-white p-2 text-center">
      <p className="font-(family-name:--font-display) text-xl font-black text-(--color-text-primary)">
        {value}
      </p>

      <p className="text-[10px] font-semibold text-(--color-text-muted)">
        {label}
      </p>
    </div>
  );
}

function PointBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
      <span className="text-xs text-(--color-text-secondary)">{label}</span>

      <strong className="text-xs text-(--color-text-primary)">
        {value.toFixed(2)}
      </strong>
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
