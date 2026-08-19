// app/.../_components/leaderboard/LeaderboardPage.tsx

"use client";

import { useState } from "react";
import { AlertCircle, BarChart3 } from "lucide-react";

import { cn } from "@/lib/cn";
import { useGetTournamentTeamsQuery } from "@/store/api/cricket/tournamentTeamApi";
import { TournamentLeaderboardTeamOption } from "@/types/cricket/tournamentAnalytics";

import BatLeaderboard from "./BatLeaderboard";
import BowlLeaderboard from "./BowlLeaderboard";
import FieldLeaderboard from "./FieldLeaderboard";
import MvpLeaderboard from "./MvpLeaderboard";

type LeaderboardTab = "BAT" | "BOWL" | "FIELD" | "MVP";

type Props = {
  tournamentId: string;
};

const tabs: Array<{
  id: LeaderboardTab;
  label: string;
}> = [
  {
    id: "BAT",
    label: "Bat",
  },
  {
    id: "BOWL",
    label: "Bowl",
  },
  {
    id: "FIELD",
    label: "Field",
  },
  {
    id: "MVP",
    label: "MVP",
  },
];

export default function LeaderboardPage({ tournamentId }: Props) {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("BAT");

  const {
    data: tournamentTeams,
    isLoading: isTeamsLoading,
    isError: isTeamsError,
  } = useGetTournamentTeamsQuery({
    tournamentId,
    status: "ACTIVE",
  });

  const teamOptions: TournamentLeaderboardTeamOption[] =
    tournamentTeams?.map((team) => ({
      id: team.teamId,
      name: team.teamNameSnapshot,
      shortName: team.teamShortNameSnapshot ?? null,
    })) ?? [];

  return (
    <section className="min-h-125 bg-(--color-bg-base)">
      {/* <div className="border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
            <BarChart3 className="size-5 text-(--color-brand)" />
          </div>

          <div className="min-w-0">
            <h2 className="font-(family-name:--font-display) text-xl font-black uppercase tracking-[0.04em] text-(--color-text-primary)">
              Tournament Leaderboard
            </h2>

            <p className="mt-0.5 text-xs text-(--color-text-secondary)">
              Compare the tournament&apos;s top performers
            </p>
          </div>
        </div>
      </div> */}

      <div className="sticky top-12.25 z-10 border-b border-(--color-bg-border) bg-(--color-bg-card) px-3 py-3">
        <div className="grid grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "py-1.5 rounded-full font-(family-name:--font-display) text-sm font-black uppercase tracking-wider transition-all",
                  isActive
                    ? "bg-(--color-brand) text-white shadow-[0_6px_16px_rgba(27,63,160,0.24)]"
                    : "bg-(--color-bg-base) text-(--color-text-secondary)",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {isTeamsError && (
        <div className="mx-3 mt-3 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm font-bold text-red-700">
              Unable to load team filters
            </p>

            <p className="mt-0.5 text-xs leading-5 text-red-600">
              The leaderboard can still be viewed using the All Teams filter.
            </p>
          </div>
        </div>
      )}

      {activeTab === "BAT" && (
        <BatLeaderboard
          tournamentId={tournamentId}
          teams={teamOptions}
          isTeamsLoading={isTeamsLoading}
        />
      )}

      {activeTab === "BOWL" && (
        <BowlLeaderboard
          tournamentId={tournamentId}
          teams={teamOptions}
          isTeamsLoading={isTeamsLoading}
        />
      )}

      {activeTab === "FIELD" && (
        <FieldLeaderboard
          tournamentId={tournamentId}
          teams={teamOptions}
          isTeamsLoading={isTeamsLoading}
        />
      )}

      {activeTab === "MVP" && (
        <MvpLeaderboard
          tournamentId={tournamentId}
          teams={teamOptions}
          isTeamsLoading={isTeamsLoading}
        />
      )}
    </section>
  );
}
