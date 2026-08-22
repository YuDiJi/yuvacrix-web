"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/cn";
import { TeamCard } from "@/components/cricket/team/TeamCard";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  setActiveTeam,
  setTeamA,
  setTeamB,
} from "@/store/startMatch/startMatchSlice";

import {
  selectRoundId,
  selectTeamA,
  selectTeamB,
  selectTournamentGroupId,
} from "@/store/startMatch/selectors";

import { useGetTournamentTeamsQuery } from "@/store/api/cricket/tournamentTeamApi";
import { useGetTournamentGroupDetailQuery } from "@/store/api/cricket/tournamentGroupApi";

import type { Team } from "@/types/team";
import { SPORT_TYPES } from "@/types/sport";

export default function SelectTournamentTeamPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const tournamentId = params.tournamentId as string;
  const teamType = searchParams.get("team");

  const [searchTerm, setSearchTerm] = useState("");

  const teamA = useAppSelector(selectTeamA);
  const teamB = useAppSelector(selectTeamB);
  const roundId = useAppSelector(selectRoundId);
  const groupId = useAppSelector(selectTournamentGroupId);

  const {
    data: tournamentTeams = [],
    isLoading: isLoadingTeams,
    isFetching: isFetchingTeams,
    isError: isTeamsError,
    refetch: refetchTeams,
  } = useGetTournamentTeamsQuery({
    tournamentId,
  });

  const {
    data: selectedGroup,
    isLoading: isLoadingGroup,
    isFetching: isFetchingGroup,
    isError: isGroupError,
    refetch: refetchGroup,
  } = useGetTournamentGroupDetailQuery(
    tournamentId && groupId
      ? {
          tournamentId,
          groupId,
        }
      : skipToken,
  );

  const groupTeamIds = useMemo<string[]>(() => {
    if (!groupId || !selectedGroup) {
      return [];
    }

    if (Array.isArray(selectedGroup.teamIds)) {
      return selectedGroup.teamIds;
    }

    // if (Array.isArray(selectedGroup.teams)) {
    //   return selectedGroup.teams.map((team) => team.teamId).filter(Boolean);
    // }

    return [];
  }, [groupId, selectedGroup]);

  const availableTournamentTeams = useMemo(() => {
    if (!groupId) {
      return tournamentTeams;
    }

    const allowedTeamIds = new Set(groupTeamIds);

    return tournamentTeams.filter((team) => allowedTeamIds.has(team.teamId));
  }, [groupId, groupTeamIds, tournamentTeams]);

  const filteredTeams = useMemo<Team[]>(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return availableTournamentTeams
      .filter((team) => {
        if (!normalizedSearch) {
          return true;
        }

        const nameMatches = team.teamNameSnapshot
          .toLowerCase()
          .includes(normalizedSearch);

        const shortNameMatches =
          team.teamShortNameSnapshot
            ?.toLowerCase()
            .includes(normalizedSearch) ?? false;

        return nameMatches || shortNameMatches;
      })
      .map((team) => ({
        id: team.teamId,
        name: team.teamNameSnapshot,
        shortName: team.teamShortNameSnapshot ?? undefined,
        logoUrl: team.teamLogoSnapshot ?? undefined,
        sportType: SPORT_TYPES.CRICKET,
        memberCount: 0,
        city: undefined,
      }));
  }, [availableTournamentTeams, searchTerm]);

  const isLoading =
    isLoadingTeams ||
    isFetchingTeams ||
    Boolean(groupId && (isLoadingGroup || isFetchingGroup));

  const hasError = isTeamsError || Boolean(groupId && isGroupError);

  function handleTeamSelect(team: Team) {
    if (teamType === "A") {
      if (team.id === teamB?.id) {
        return;
      }

      dispatch(setTeamA(team));
      dispatch(setActiveTeam("A"));
    } else if (teamType === "B") {
      if (team.id === teamA?.id) {
        return;
      }

      dispatch(setTeamB(team));
      dispatch(setActiveTeam("B"));
    } else {
      return;
    }

    router.push(
      `/tournaments/${tournamentId}/players?team=${team.id}&from=tournament-start-match`,
    );
  }

  if (!roundId) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-(--color-bg-base) px-6 text-center">
        <AlertCircle size={36} className="text-(--color-live)" />

        <h2 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
          Round Not Selected
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-(--color-text-secondary)">
          Select a tournament round before choosing the playing teams.
        </p>

        <button
          type="button"
          onClick={() => router.back()}
          className="mt-5 text-sm font-semibold text-(--color-brand)"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-col gap-3 bg-(--color-bg-base) p-4">
        <div className="mb-2 h-12 animate-pulse rounded-2xl bg-(--color-bg-card)" />

        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-2xl bg-(--color-bg-card)"
          />
        ))}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-(--color-bg-base) px-6 text-center">
        <AlertCircle size={36} className="text-(--color-live)" />

        <h2 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
          Failed to Load Teams
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-(--color-text-secondary)">
          The tournament teams or selected group could not be loaded.
        </p>

        <button
          type="button"
          onClick={() => {
            void refetchTeams();

            if (groupId) {
              void refetchGroup();
            }
          }}
          className="mt-5 rounded-xl bg-(--color-brand) px-5 py-2.5 text-sm font-bold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (availableTournamentTeams.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-(--color-navy) shadow-[0_8px_32px_rgba(13,27,62,0.18)]">
            <Users size={44} strokeWidth={1.5} className="text-white/85" />
          </div>

          <div className="absolute inset-0 scale-110 rounded-3xl border-2 border-(--color-brand)/20" />
        </div>

        <h3
          className="font-(family-name:--font-display) text-2xl font-black uppercase text-(--color-text-primary)"
          style={{
            letterSpacing: "0.04em",
          }}
        >
          {groupId ? "No Teams In Group" : "No Teams Yet"}
        </h3>

        <p className="mt-2 max-w-60 text-sm leading-relaxed text-(--color-text-secondary)">
          {groupId
            ? "Add at least two active tournament teams to this group before creating a group match."
            : "Add tournament teams before creating a tournament match."}
        </p>

        {!groupId && (
          <button
            type="button"
            onClick={() =>
              router.push(`/tournaments/${tournamentId}/add-teams`)
            }
            className="mt-5 rounded-xl bg-(--color-brand) px-5 py-2.5 text-sm font-bold text-white"
          >
            Add Teams
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-full bg-(--color-bg-base) p-4 pb-24">
      {groupId && selectedGroup && (
        <div className="mb-4 rounded-2xl border border-(--color-brand)/20 bg-(--color-bg-tint) p-4">
          <p className="text-section-label">Selected Group</p>

          <h2 className="mt-1 font-(family-name:--font-display) text-lg font-black uppercase text-(--color-brand)">
            {selectedGroup.name}
          </h2>

          <p className="mt-1 text-xs leading-5 text-(--color-text-secondary)">
            Only teams assigned to this group can be selected for this match.
          </p>
        </div>
      )}

      {/* Search bar */}
      <div
        className={cn(
          "mb-5 flex items-center gap-3 rounded-2xl border-2 border-(--color-bg-border)",
          "bg-(--color-bg-card) px-4 py-3 shadow-(--shadow-card)",
          "focus-within:border-(--color-sky) focus-within:shadow-[0_0_0_3px_rgba(75,139,255,0.10)]",
          "transition-all duration-150",
        )}
      >
        <Search size={18} className="shrink-0 text-(--color-text-muted)" />

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search teams..."
          className={cn(
            "min-w-0 flex-1 bg-transparent outline-none",
            "font-(family-name:--font-display) text-sm font-bold uppercase tracking-[0.06em]",
            "text-(--color-text-primary)",
            "placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-(--color-text-muted)",
          )}
        />

        <button
          type="button"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--color-bg-base) text-(--color-text-secondary) transition-all hover:bg-(--color-bg-tint) hover:text-(--color-brand) active:scale-90"
          aria-label="Filter teams"
        >
          <SlidersHorizontal size={15} />
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-section-label">
          {groupId ? `${selectedGroup?.name ?? "Group"} Teams` : "All Teams"}
        </p>

        <span className="text-xs font-semibold text-(--color-text-muted)">
          {availableTournamentTeams.length}{" "}
          {availableTournamentTeams.length === 1 ? "team" : "teams"}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {filteredTeams.map((team) => {
          const isOpponent =
            (teamType === "A" && team.id === teamB?.id) ||
            (teamType === "B" && team.id === teamA?.id);

          return (
            <TeamCard
              key={team.id}
              team={team}
              disabled={isOpponent}
              onClick={handleTeamSelect}
            />
          );
        })}
      </div>

      {filteredTeams.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-sm font-medium text-(--color-text-muted)">
            No teams match your search.
          </p>
        </div>
      )}

      {/* Creating a normal owned team does not automatically add it
          to the tournament or selected group. Keep this FAB only
          if that is intentional in your flow. */}
      {!groupId && (
        <button
          type="button"
          onClick={() =>
            router.push(`/start-match/create-team?team=${teamType ?? "A"}`)
          }
          className={cn(
            "fixed bottom-10 right-4 z-20 md:right-[38%]",
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            "bg-(--color-brand) text-white",
            "shadow-[0_8px_24px_rgba(27,63,160,0.40)]",
            "transition-all duration-200 hover:bg-[#2449b8] active:scale-90",
          )}
          aria-label="Create new team"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
