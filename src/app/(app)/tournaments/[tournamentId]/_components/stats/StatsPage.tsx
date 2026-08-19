// _components/stats/StatsPage.tsx

"use client";

import { useState } from "react";
import { AlertCircle, BarChart3 } from "lucide-react";

import { cn } from "@/lib/cn";
import { useGetTournamentTeamsQuery } from "@/store/api/cricket/tournamentTeamApi";
import { TournamentLeaderboardTeamOption } from "@/types/cricket/tournamentAnalytics";

import OverallStats from "./OverallStats";
import SixesStats from "./SixesStats";
import FoursStats from "./FoursStats";

type StatsTab = "OVERALL" | "SIXES" | "FOURS";

type Props = {
  tournamentId: string;
};

const STATS_TABS: Array<{
  id: StatsTab;
  label: string;
}> = [
  {
    id: "OVERALL",
    label: "Overall",
  },
  {
    id: "SIXES",
    label: "Sixes",
  },
  {
    id: "FOURS",
    label: "Fours",
  },
];

export default function StatsPage({ tournamentId }: Props) {
  const [activeTab, setActiveTab] = useState<StatsTab>("OVERALL");
  const [selectedTeamId, setSelectedTeamId] = useState("ALL");

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
      {/* Subtabs */}
      <div className="border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          {STATS_TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "py-1.5 rounded-full font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.04em]",
                  "transition-all duration-200 active:scale-[0.97]",
                  isActive
                    ? "bg-(--color-brand) text-white shadow-[0_6px_18px_rgba(27,63,160,0.24)]"
                    : "bg-(--color-bg-base) text-(--color-text-secondary)",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Team filter */}
      <div className="border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-2">
        <label className="block space-y-1.5">
          <span className="text-[11px] font-black uppercase tracking-[0.08em] text-(--color-text-muted)">
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
              You can still view tournament-wide stats using All Teams.
            </p>
          </div>
        </div>
      )}

      {/* Active stats tab */}
      {activeTab === "OVERALL" && (
        <OverallStats tournamentId={tournamentId} teamId={selectedTeamId} />
      )}

      {activeTab === "SIXES" && (
        <SixesStats tournamentId={tournamentId} teamId={selectedTeamId} />
      )}

      {activeTab === "FOURS" && (
        <FoursStats tournamentId={tournamentId} teamId={selectedTeamId} />
      )}
    </section>
  );
}
