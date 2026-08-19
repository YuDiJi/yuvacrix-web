"use client";

import { useState } from "react";
import { AlertCircle, CalendarDays, RefreshCw, UserRound } from "lucide-react";

import { cn } from "@/lib/cn";
import { useGetMyCricketProfileQuery } from "@/store/api/cricket/cricketProfileApi";

import { CricketProfileHeader } from "./_components/CricketProfileHeader";
import { CricketProfileSkeleton } from "./_components/CricketProfileSkeleton";
import { MatchesTab } from "./_components/MatchesTab";
import StatsTab from "./_components/StatsTab";
import HighlightsTab from "./_components/HighlightsTab";
import { CricketProfile } from "@/types/cricket/cricketProfile";
import { TrophiesTab } from "./_components/TrophiesTab";
import { BadgesTab } from "./_components/BadgesTab";
import { TeamsTab } from "./_components/TeamsTab";

export type CricketProfileTab =
  | "MATCHES"
  | "STATS"
  | "TROPHIES"
  | "BADGES"
  // | "HIGHLIGHTS"
  | "TEAMS";

type TabOption = {
  id: CricketProfileTab;
  label: string;
};

const TAB_OPTIONS: readonly TabOption[] = [
  {
    id: "MATCHES",
    label: "Matches",
  },
  {
    id: "STATS",
    label: "Stats",
  },
  {
    id: "TROPHIES",
    label: "Trophies",
  },
  {
    id: "BADGES",
    label: "Badges",
  },
  // {
  //   id: "HIGHLIGHTS",
  //   label: "Highlights",
  // },
  {
    id: "TEAMS",
    label: "Teams",
  },
];

export default function CricketProfilePage() {
  const [activeTab, setActiveTab] = useState<CricketProfileTab>("MATCHES");

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetMyCricketProfileQuery();

  if (isLoading) {
    return <CricketProfileSkeleton />;
  }

  if (isError) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? error.status
        : undefined;

    const playerNotFound = status === 404;

    return (
      <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) p-4">
        <div className="w-full max-w-md rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-6 text-center shadow-(--shadow-card)">
          <div
            className={cn(
              "mx-auto flex h-14 w-14 items-center justify-center rounded-full",
              playerNotFound
                ? "bg-(--color-brand)/10 text-(--color-brand)"
                : "bg-red-50 text-red-500",
            )}
          >
            {playerNotFound ? (
              <UserRound size={26} />
            ) : (
              <AlertCircle size={26} />
            )}
          </div>

          <h2 className="mt-4 font-display text-[20px] font-black uppercase tracking-wide text-(--color-navy)">
            {playerNotFound
              ? "Cricket Profile Not Found"
              : "Unable To Load Profile"}
          </h2>

          <p className="mt-2 text-[13px] leading-5 text-(--color-text-secondary)">
            {playerNotFound
              ? "Your player profile could not be resolved."
              : "Something went wrong while loading your cricket profile."}
          </p>

          {!playerNotFound && (
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-brand) py-3.5 font-display text-[13px] font-black uppercase tracking-widest text-white"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const profile = data;

  if (!profile) {
    return (
      <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) p-4">
        <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-6 text-center shadow-(--shadow-card)">
          <CalendarDays
            size={30}
            className="mx-auto text-(--color-text-muted)"
          />

          <p className="mt-3 font-display text-[16px] font-black uppercase tracking-wide text-(--color-navy)">
            Profile data unavailable
          </p>
        </div>
      </div>
    );
  }

  function renderActiveTab(currentProfile: CricketProfile) {
    switch (activeTab) {
      case "MATCHES":
        return <MatchesTab />;

      case "STATS":
        return <StatsTab profile={currentProfile} />;

      case "TROPHIES":
        return <TrophiesTab />;

      case "BADGES":
        return <BadgesTab />;

      // case "HIGHLIGHTS":
      //   return <HighlightsTab profile={currentProfile} />;

      case "TEAMS":
        return <TeamsTab />;

      default:
        return <MatchesTab />;
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-(--color-bg-base)">
      <div className="flex-1 overflow-y-auto">
        <CricketProfileHeader
          profile={profile}
          onStatsClick={() => setActiveTab("STATS")}
        />

        <div className="sticky top-0 z-20 border-b border-(--color-bg-border) bg-white/95 backdrop-blur-md">
          <div className="flex overflow-x-auto px-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {TAB_OPTIONS.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative min-w-max shrink-0 px-4 py-4",
                    "font-display text-[13px] font-black uppercase tracking-wide",
                    "transition-colors",
                    active
                      ? "text-(--color-brand)"
                      : "text-(--color-text-secondary)",
                  )}
                >
                  {tab.label}

                  <span
                    className={cn(
                      "absolute bottom-0 left-3 right-3 h-0.75 rounded-t-full",
                      active ? "bg-(--color-brand)" : "bg-transparent",
                    )}
                  />
                </button>
              );
            })}
          </div>

          {isFetching && (
            <div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden">
              <div className="h-full w-1/3 animate-pulse bg-(--color-sky)" />
            </div>
          )}
        </div>

        <main className="min-h-100">{renderActiveTab(profile)}</main>
      </div>
    </div>
  );
}
