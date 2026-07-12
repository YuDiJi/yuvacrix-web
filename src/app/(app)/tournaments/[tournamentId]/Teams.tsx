import { TeamCard } from "@/components/team/TeamCard";
import { cn } from "@/lib/cn";
import { useGetTournamentTeamsQuery } from "@/store/api/tournamentTeamApi";
import { Team } from "@/types/team";
import {
  AlertCircle,
  ChevronRight,
  Plus,
  Search,
  ShieldPlus,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const Teams = () => {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.tournamentId as string;
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: teams,
    isLoading: isTeamsLoading,
    isError,
  } = useGetTournamentTeamsQuery({ tournamentId, status: "ACTIVE" });

  const filteredTeams =
    teams
      ?.filter((team) =>
        team.teamNameSnapshot.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .map<Team>((team) => ({
        id: team.teamId,
        name: team.teamNameSnapshot,
        shortName: team.teamShortNameSnapshot ?? undefined,
        logoUrl: team.teamLogoSnapshot ?? undefined,
        sportType: "CRICKET",
        city: undefined,
        memberCount: team.memberCount,
      })) ?? [];

  if (isTeamsLoading) {
    return (
      <div className="flex min-h-dvh flex-col bg-(--color-bg-base)">
        <div className="p-4 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl bg-(--color-bg-card)"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !teams) {
    return (
      <div className="flex pt-20 items-center justify-center bg-(--color-bg-base) p-4">
        <div className="rounded-xl bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
          <AlertCircle className="mx-auto mb-3 text-(--color-live)" />
          <h2 className="font-(family-name:--font-display) text-xl font-black text-(--color-navy)">
            Tournament not found
          </h2>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 rounded-xl bg-(--color-brand) px-5 py-3 text-sm font-bold text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-5">
        <div className="w-full max-w-sm rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) p-8 text-center shadow-(--shadow-card)">
          {/* Illustration */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-(--color-bg-tint)">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-(--color-brand)">
              <Users size={30} className="text-white" />
            </div>
          </div>

          {/* Heading */}
          <h2
            className="mt-6 font-(family-name:--font-display) text-2xl font-black uppercase text-(--color-text-primary)"
            style={{ letterSpacing: "0.04em" }}
          >
            No Teams Yet
          </h2>

          {/* Description */}
          <p className="mt-2 text-sm leading-6 text-(--color-text-secondary)">
            This tournament doesn&apos;t have any teams yet.
            <br />
            Add your first team to start creating rounds, fixtures and matches.
          </p>

          {/* Info */}
          {/* <div className="mt-6 rounded-2xl bg-(--color-bg-tint) p-4">
            <div className="flex items-center gap-3">
              <ShieldPlus size={18} className="shrink-0 text-(--color-brand)" />
              <p className="text-left text-xs font-medium text-(--color-text-secondary)">
                Teams must already exist in your account before they can be
                added to a tournament.
              </p>
            </div>
          </div> */}

          {/* CTA */}
          <button
            type="button"
            onClick={() =>
              router.push(`/tournaments/${tournamentId}/add-teams`)
            }
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-(--color-brand) py-4 font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em] text-white transition-all active:scale-[0.98]"
          >
            Add Teams
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full bg-(--color-bg-base) p-4 pb-24">
      <div className="flex gap-2">
        <div
          className={cn(
            "mb-5 flex items-center gap-3 rounded-2xl border-2 border-(--color-bg-border) flex-1",
            "bg-(--color-bg-card) px-4 py-3 shadow-(--shadow-card)",
            "focus-within:border-(--color-sky) focus-within:shadow-[0_0_0_3px_rgba(75,139,255,0.10)]",
            "transition-all duration-150",
          )}
        >
          <Search size={18} className="shrink-0 text-(--color-text-muted)" />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teams..."
            className={cn(
              "flex-1 bg-transparent outline-none",
              "font-(family-name:--font-display) text-sm font-bold uppercase tracking-[0.06em]",
              "text-(--color-text-primary)",
              "placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-(--color-text-muted)",
            )}
          />
          <button
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--color-bg-base) text-(--color-text-secondary) transition-all hover:bg-(--color-bg-tint) hover:text-(--color-brand) active:scale-90"
            aria-label="Filter"
          >
            <SlidersHorizontal size={15} />
          </button>
        </div>
        <button
          onClick={() => router.push(`/tournaments/${tournamentId}/add-teams`)}
          className={cn(
            "",
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            "bg-(--color-brand) text-white",
            "shadow-[0_8px_24px_rgba(27,63,160,0.40)]",
            "transition-all duration-200 active:scale-90 hover:bg-[#2449b8]",
          )}
          aria-label="Create new team"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {filteredTeams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            variant="navigate"
            onClick={() => {
              router.push(
                `/tournaments/${tournamentId}/players?team=${team.id}&from=tournament-team-setup`,
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Teams;
