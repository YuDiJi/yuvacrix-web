"use client";

// import { useHeader } from "@/providers/HeaderProvider";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useGetOwnedTeamQuery } from "@/store/api/teamApi";
import { cn } from "@/lib/cn";
import { useState } from "react";

import { TeamCard } from "@/components/team/TeamCard";
import { Button } from "@/components/common/Button";
import {
  useAddTeamToTournamentMutation,
  useGetTournamentTeamsQuery,
} from "@/store/api/tournamentTeamApi";

export default function AddTeamPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.tournamentId as string;
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  const [addTeamToTournament, { isLoading: isAdding }] =
    useAddTeamToTournamentMutation();
  const { data: teams, isSuccess, isError } = useGetOwnedTeamQuery();
  const { data: tournamentTeams } = useGetTournamentTeamsQuery({
    tournamentId,
    status: "ACTIVE",
  });

  const tournamentTeamIds = new Set(
    tournamentTeams?.map((t) => t.teamId) ?? [],
  );

  const filteredTeams =
    teams?.filter((team) => {
      const matchesSearch = team.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const notAlreadyAdded = !tournamentTeamIds.has(team.id);

      return matchesSearch && notAlreadyAdded;
    }) ?? [];

  function toggleTeam(teamId: string) {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId],
    );
  }

  async function handleDone() {
    if (selectedTeamIds.length === 0) return;

    setError("");

    const results = await Promise.allSettled(
      selectedTeamIds.map((teamId, index) =>
        addTeamToTournament({
          tournamentId,
          teamId,
          seedNumber: index + 1,
        }).unwrap(),
      ),
    );

    const successTeamIds = selectedTeamIds.filter(
      (_teamId, index) => results[index].status === "fulfilled",
    );

    const failedResults = results.filter(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    );

    if (failedResults.length === 0) {
      router.push(`/tournaments/${tournamentId}`);
      return;
    }

    setSelectedTeamIds((prev) =>
      prev.filter((teamId) => !successTeamIds.includes(teamId)),
    );

    const errorMessages = failedResults.map((result) => {
      const reason = result.reason as {
        data?: {
          message?: string;
        };
        error?: string;
      };

      return reason.data?.message ?? reason.error ?? "Failed to add team.";
    });

    setError(
      [
        successTeamIds.length > 0
          ? `${successTeamIds.length} team(s) added successfully.`
          : null,
        `${failedResults.length} team(s) failed.`,
        ...errorMessages,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }

  if (teams?.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        {/* Icon */}
        <div
          onClick={() => router.push("/start-match/create-team?team=")}
          className="relative mb-6"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-(--color-navy) shadow-[0_8px_32px_rgba(13,27,62,0.18)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* <title xmlns="">add-team-02</title> */}
              <g
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 20v-2.03c0-1.242.56-2.46 1.69-2.975C6.068 14.366 7.722 14 9.5 14c1.245 0 2.429.18 3.5.503" />
                <circle cx="9.5" cy="7.5" r="3.5" />
                <path d="M14.5 4.145a3.502 3.502 0 0 1 0 6.71M18 14v6m-3-3h6" />
              </g>
            </svg>
          </div>
          {/* Decorative ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-(--color-brand)/20 scale-110" />
        </div>

        {/* Text */}
        <h3
          className="font-(family-name:--font-display) text-2xl font-black uppercase text-(--color-text-primary)"
          style={{ letterSpacing: "0.04em" }}
        >
          No Teams Yet
        </h3>
        <p className="mt-2 text-sm text-(--color-text-secondary) leading-relaxed max-w-55">
          Create your first team and start scoring matches with your squad.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative min-h-full bg-(--color-bg-base) p-4 pb-24">
        {/* Search Bar */}
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
            onClick={() =>
              router.push(`/tournaments/${tournamentId}/create-team`)
            }
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

        {/* Section label */}
        <p className="text-section-label mb-3 px-1">All Teams</p>

        {/* Team List */}

        <div className="flex flex-col gap-3">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              variant="select"
              selected={selectedTeamIds.includes(team.id)}
              onClick={() => toggleTeam(team.id)}
            />
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <div className="py-10 text-center text-(--color-text-muted)">
            No teams found
          </div>
        )}
        {error && (
          <div className="my-4 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 p-3">
            <p className="whitespace-pre-line text-sm font-medium text-(--color-live)">
              {error}
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-2 sticky bottom-0 mt-6 bg-white p-2">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => router.push(`/tournaments/${tournamentId}`)}
        >
          cancel
        </Button>
        {selectedTeamIds.length > 0 && (
          <Button
            fullWidth
            // className="sticky bottom-0 mt-6"
            loading={isAdding}
            disabled={selectedTeamIds.length === 0}
            onClick={handleDone}
          >
            Add {selectedTeamIds.length || ""} Team
            {selectedTeamIds.length !== 1 ? "s" : ""}
          </Button>
        )}
      </div>
    </div>
  );
}
