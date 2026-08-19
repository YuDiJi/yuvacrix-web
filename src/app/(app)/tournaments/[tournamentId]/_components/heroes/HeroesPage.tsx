// _components/heroes/HeroesPage.tsx

"use client";

import {
  AlertCircle,
  RefreshCw,
  SearchX,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { useGetTournamentHeroesQuery } from "@/store/api/cricket/tournamentAnalyticsApi";
import { useGetTournamentTeamsQuery } from "@/store/api/cricket/tournamentTeamApi";

import HeroCard from "./HeroCard";

type Props = {
  tournamentId: string;
};

export default function HeroesPage({ tournamentId }: Props) {
  const [selectedTeamId, setSelectedTeamId] = useState("ALL");

  const {
    data: tournamentTeams,
    isLoading: isTeamsLoading,
    isError: isTeamsError,
  } = useGetTournamentTeamsQuery({
    tournamentId,
    status: "ACTIVE",
  });

  const { data, isLoading, isFetching, isError, refetch } =
    useGetTournamentHeroesQuery({
      tournamentId,
      query: {
        teamId: selectedTeamId,
        roundId: "ALL",
        groupId: "ALL",
      },
    });

  const teamOptions =
    tournamentTeams?.map((team) => ({
      id: team.teamId,
      name: team.teamNameSnapshot,
    })) ?? [];

  return (
    <section className="min-h-125 bg-(--color-bg-base) pb-24">
      {/* <div className="border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
            <Trophy className="size-5 text-(--color-brand)" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-(family-name:--font-display) text-xl font-black uppercase tracking-[0.04em] text-(--color-text-primary)">
              Tournament Heroes
            </h2>

            <p className="mt-0.5 text-xs text-(--color-text-secondary)">
              Celebrate the tournament&apos;s standout performers
            </p>
          </div>
        </div>
      </div> */}

      <div className="border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-4">
        <label className="block space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.08em] text-(--color-text-muted)">
            Team Filter
          </span>

          <select
            value={selectedTeamId}
            onChange={(event) => setSelectedTeamId(event.target.value)}
            disabled={isTeamsLoading}
            className={cn(
              "py-2 w-full rounded-2xl border-2 border-(--color-bg-border)",
              "bg-(--color-bg-card) px-4",
              "font-(family-name:--font-display) text-sm font-bold uppercase tracking-[0.04em]",
              "text-(--color-text-primary) outline-none",
              "transition-all focus:border-(--color-brand)",
              "disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            <option value="ALL">
              {isTeamsLoading ? "Loading Teams..." : "All Teams"}
            </option>

            {teamOptions.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isTeamsError && (
        <div className="mx-4 mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm font-bold text-red-700">
              Team filter unavailable
            </p>

            <p className="mt-0.5 text-xs leading-5 text-red-600">
              Tournament-wide heroes can still be viewed.
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <HeroesSkeleton />
      ) : isError || !data ? (
        <HeroesMessage
          type="error"
          title="Unable to load heroes"
          description="Something went wrong while loading tournament heroes."
          actionLabel="Try Again"
          onAction={refetch}
        />
      ) : data.metadata.includedCompletedMatches === 0 || !data.cards.length ? (
        <HeroesMessage
          title="No tournament heroes yet"
          description="Tournament heroes will appear after players start performing in completed matches."
        />
      ) : (
        <>
          <div className="px-4 pt-5">
            <div className="rounded-3xl bg-(--color-navy) p-5 text-white shadow-(--shadow-card)">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">
                    Hall of Fame
                  </p>

                  <h3 className="mt-1 font-(family-name:--font-display) text-2xl font-black uppercase tracking-[0.04em]">
                    Tournament Standouts
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-white/70">
                    {data.cards.length} achievements across{" "}
                    {data.metadata.includedCompletedMatches} completed{" "}
                    {data.metadata.includedCompletedMatches === 1
                      ? "match"
                      : "matches"}
                  </p>
                </div>

                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <Sparkles className="size-6" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 px-4 pt-4">
            {data.cards.map((card) => (
              <HeroCard key={card.type} card={card} />
            ))}
          </div>
        </>
      )}

      {isFetching && !isLoading && (
        <div className="fixed bottom-20 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-(--color-navy) px-4 py-2 text-xs font-semibold text-white shadow-lg">
          <RefreshCw className="size-3.5 animate-spin" />
          Updating Heroes
        </div>
      )}
    </section>
  );
}

function HeroesSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="h-32 animate-pulse rounded-3xl bg-(--color-bg-card)" />

      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-107.5 animate-pulse rounded-3xl bg-(--color-bg-card)"
        />
      ))}
    </div>
  );
}

function HeroesMessage({
  type = "empty",
  title,
  description,
  actionLabel,
  onAction,
}: {
  type?: "empty" | "error";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
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

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 rounded-2xl bg-(--color-brand) px-5 py-3 text-sm font-bold text-white"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
