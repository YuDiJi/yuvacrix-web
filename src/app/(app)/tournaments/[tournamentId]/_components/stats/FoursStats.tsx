// _components/stats/FoursStats.tsx

"use client";

import { AlertCircle, BarChart3, RefreshCw, SearchX } from "lucide-react";

import { cn } from "@/lib/cn";
import { S3Image } from "@/components/common/S3Image";
import { useGetTournamentBoundaryStatsQuery } from "@/store/api/cricket/tournamentAnalyticsApi";
import { TournamentBoundaryStatType } from "@/types/cricket/tournamentAnalytics";

type Props = {
  tournamentId: string;
  teamId: string;
};

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export default function FoursStats({ tournamentId, teamId }: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetTournamentBoundaryStatsQuery({
      tournamentId,
      query: {
        type: TournamentBoundaryStatType.FOURS,
        teamId,
        roundId: "ALL",
        groupId: "ALL",
        skip: 0,
        limit: 100,
      },
    });

  if (isLoading) {
    return <BoundaryStatsSkeleton />;
  }

  if (isError || !data) {
    return (
      <BoundaryMessage
        type="error"
        title="Unable to load fours"
        description="Something went wrong while loading the fours leaderboard."
        buttonLabel="Try Again"
        onClick={refetch}
      />
    );
  }

  if (data.summary.includedCompletedMatches === 0 || !data.items.length) {
    return (
      <BoundaryMessage
        title="No fours recorded yet"
        description="Fours stats will appear after completed tournament matches."
      />
    );
  }

  return (
    <div className="relative pb-24">
      <BoundaryHero
        label="Total Fours"
        value={data.summary.total}
        players={data.summary.playersWithBoundary}
      />

      <div className="px-4 pt-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="font-(family-name:--font-display) text-lg font-black uppercase tracking-wider text-(--color-text-primary)">
              Boundary Makers
            </h3>

            <p className="mt-0.5 text-xs text-(--color-text-secondary)">
              Players ranked by most fours
            </p>
          </div>

          <span className="rounded-full bg-(--color-bg-tint) px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-(--color-brand)">
            {data.pagination.total} Players
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {data.items.map((item, index) => {
            const firstValue = data.items[0]?.value || 1;
            const progress = Math.max(
              8,
              Math.min(100, (item.value / firstValue) * 100),
            );

            const isTopPlayer = index === 0;

            return (
              <article
                key={item.playerId}
                className={cn(
                  "relative overflow-hidden rounded-2xl border shadow-(--shadow-card)",
                  isTopPlayer
                    ? "border-(--color-brand) bg-(--color-navy) text-white"
                    : "border-(--color-bg-border) bg-(--color-bg-card)",
                )}
              >
                <div className="flex items-center gap-3 p-3.5">
                  <div
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full",
                      "font-(family-name:--font-display) text-md font-black",
                      isTopPlayer
                        ? "bg-white/15 text-white"
                        : "bg-(--color-bg-tint) text-(--color-brand)",
                    )}
                  >
                    {item.rank}
                  </div>

                  <div
                    className={cn(
                      "relative size-13 shrink-0 overflow-hidden rounded-full border-2",
                      isTopPlayer
                        ? "border-white/30 bg-white/10"
                        : "border-(--color-bg-border) bg-(--color-bg-tint)",
                    )}
                  >
                    {item.profileImageUrl ? (
                      <S3Image
                        imageKey={item.profileImageUrl}
                        alt={item.playerName}
                        width={52}
                        height={52}
                        className="h-full w-full object-cover"
                        fallback={
                          <PlayerFallback
                            playerName={item.playerName}
                            inverse={isTopPlayer}
                          />
                        }
                      />
                    ) : (
                      <PlayerFallback
                        playerName={item.playerName}
                        inverse={isTopPlayer}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4
                      className={cn(
                        "truncate text-sm font-bold",
                        isTopPlayer
                          ? "text-white"
                          : "text-(--color-text-primary)",
                      )}
                    >
                      {item.playerName}
                    </h4>

                    <p
                      className={cn(
                        "truncate text-[10px] font-bold uppercase tracking-[0.06em]",
                        isTopPlayer
                          ? "text-white/60"
                          : "text-(--color-text-muted)",
                      )}
                    >
                      {item.teamShortName || item.teamName}
                    </p>

                    <p
                      className={cn(
                        "mt-1 truncate text-xs",
                        isTopPlayer
                          ? "text-white/70"
                          : "text-(--color-text-secondary)",
                      )}
                    >
                      Inn: {item.batting.innings}
                      {" · "}Runs: {item.batting.runs}
                      {" · "}Avg: {formatNumber(item.batting.average)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={cn(
                        "font-(family-name:--font-display) text-4xl font-black",
                        isTopPlayer ? "text-white" : "text-(--color-brand)",
                      )}
                    >
                      {item.value}
                    </p>

                    <p
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-[0.06em]",
                        isTopPlayer
                          ? "text-white/60"
                          : "text-(--color-text-muted)",
                      )}
                    >
                      Fours
                    </p>
                  </div>
                </div>

                <div
                  className={cn(
                    "h-1",
                    isTopPlayer ? "bg-white/10" : "bg-(--color-bg-base)",
                  )}
                >
                  <div
                    className={cn(
                      "h-full rounded-r-full",
                      isTopPlayer ? "bg-(--color-sky)" : "bg-(--color-brand)",
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {isFetching && <RefreshingIndicator label="Updating Fours" />}
    </div>
  );
}

function BoundaryHero({
  label,
  value,
  players,
}: {
  label: string;
  value: number;
  players: number;
}) {
  return (
    <div className="bg-(--color-bg-card) px-4 py-5">
      <div className="relative overflow-hidden rounded-3xl bg-(--color-navy) p-5 text-white shadow-(--shadow-card)">
        <div className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-(--color-sky)/20" />
        <div className="pointer-events-none absolute -bottom-14 -left-10 size-36 rounded-full bg-(--color-violet)/20" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">
              {label}
            </p>

            <p className="mt-2 font-(family-name:--font-display) text-5xl font-black">
              {value}
            </p>

            <p className="mt-1 text-sm text-white/70">
              Hit by {players} {players === 1 ? "player" : "players"}
            </p>
          </div>

          <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10">
            <BarChart3 className="size-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerFallback({
  playerName,
  inverse = false,
}: {
  playerName: string;
  inverse?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        "font-(family-name:--font-display) text-xl font-black uppercase",
        inverse
          ? "bg-white/10 text-white"
          : "bg-(--color-bg-tint) text-(--color-brand)",
      )}
    >
      {playerName.charAt(0)}
    </div>
  );
}

function BoundaryStatsSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="h-40 animate-pulse rounded-3xl bg-(--color-bg-card)" />

      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-24 animate-pulse rounded-2xl bg-(--color-bg-card)"
        />
      ))}
    </div>
  );
}

function BoundaryMessage({
  type = "empty",
  title,
  description,
  buttonLabel,
  onClick,
}: {
  type?: "empty" | "error";
  title: string;
  description: string;
  buttonLabel?: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex min-h-80 items-center justify-center p-5">
      <div className="w-full max-w-sm rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) p-7 text-center shadow-(--shadow-card)">
        <div
          className={cn(
            "mx-auto flex size-16 items-center justify-center rounded-full",
            type === "error" ? "bg-red-50" : "bg-(--color-bg-tint)",
          )}
        >
          {type === "error" ? (
            <AlertCircle className="size-7 text-red-500" />
          ) : (
            <SearchX className="size-7 text-(--color-brand)" />
          )}
        </div>

        <h3 className="mt-5 font-(family-name:--font-display) text-xl font-black uppercase tracking-[0.04em] text-(--color-text-primary)">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-(--color-text-secondary)">
          {description}
        </p>

        {buttonLabel && onClick && (
          <button
            type="button"
            onClick={onClick}
            className="mt-5 rounded-2xl bg-(--color-brand) px-5 py-3 text-sm font-bold text-white"
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function RefreshingIndicator({ label }: { label: string }) {
  return (
    <div className="fixed bottom-20 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-(--color-navy) px-4 py-2 text-xs font-semibold text-white shadow-lg">
      <RefreshCw className="size-3.5 animate-spin" />
      {label}
    </div>
  );
}
