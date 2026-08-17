"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  Plus,
  Trophy,
  HelpCircle,
  ListFilter,
  Pencil,
  Trash2,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";

import {
  useDeleteTournamentGroupMutation,
  useGetTournamentGroupsQuery,
} from "@/store/api/tournamentGroupApi";
import {
  useGetTournamentGroupPointsTableQuery,
  useGetTournamentPointsTableQuery,
  useGetTournamentRoundPointsTableQuery,
} from "@/store/api/tournamentPointsApi";
import { useGetTournamentRoundsQuery } from "@/store/api/tournamentRoundApi";

import type { TournamentPointsTableResponse } from "@/store/api/tournamentPointsApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatNrr(nrr: number) {
  if (nrr > 0) {
    return `+${nrr.toFixed(3)}`;
  }
  return nrr.toFixed(3);
}

function formatCalculatedAt(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function PointsTableSkeleton() {
  return (
    <div className="overflow-hidden bg-(--color-bg-card) border-y border-(--color-bg-border) mt-4">
      <div className="h-10 bg-(--color-bg-tint) border-b border-(--color-bg-border)" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center justify-between p-3 border-b border-(--color-bg-border) last:border-b-0"
        >
          <div className="h-4 w-24 rounded bg-(--color-bg-border)" />
          <div className="flex gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-4 w-4 rounded bg-(--color-bg-border)" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-6 py-14 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--color-live)/10">
        <AlertCircle size={30} className="text-(--color-live)" />
      </div>
      <h3 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
        {title}
      </h3>
      <p className="max-w-72 text-sm leading-6 text-(--color-text-secondary)">
        {description}
      </p>
      {onRetry && (
        <Button type="button" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

// ─── No rounds state ──────────────────────────────────────────────────────────

function NoRoundsState({ onCreateRound }: { onCreateRound: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) px-6 py-14 text-center shadow-sm">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-(--color-bg-tint)">
        <Trophy size={34} className="text-(--color-brand)" />
      </div>
      <h3 className="mt-5 font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
        Create Your First Round
      </h3>
      <p className="mt-2 max-w-72 text-sm leading-6 text-(--color-text-secondary)">
        Create a round such as League Stage, Super League, Semi Final or Final
        to organise tournament matches and standings.
      </p>
      <Button
        type="button"
        size="sm"
        className="mt-6"
        onClick={onCreateRound}
        leftIcon={<Plus size={16} />}
      >
        Create Round
      </Button>
    </div>
  );
}

// ─── Empty points table state ─────────────────────────────────────────────────

function EmptyStandingsState({ scopeName }: { scopeName: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) px-6 py-14 text-center shadow-sm">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-(--color-bg-tint)">
        <Trophy size={34} className="text-(--color-brand)" />
      </div>
      <h3 className="mt-5 font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
        No Standings Yet
      </h3>
      <p className="mt-2 max-w-72 text-sm leading-6 text-(--color-text-secondary)">
        Standings for <strong>{scopeName}</strong> will appear after eligible
        tournament matches are completed.
      </p>
    </div>
  );
}

// ─── Actual standings table ───────────────────────────────────────────────────

// ─── Actual standings table ───────────────────────────────────────────────────

function StandingsTable({
  data,
  title,
}: {
  data: TournamentPointsTableResponse;
  title: string;
}) {
  const calculatedAt = formatCalculatedAt(data.calculatedAt);

  return (
    <div className="mb-6">
      {/* Table Header Section */}
      <div className="flex items-center justify-between mb-2 px-4">
        <h3 className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-navy) tracking-wide">
          {title}
        </h3>
        <button className="text-(--color-brand) hover:opacity-80 transition-opacity">
          <ListFilter size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Tightly Packed Mobile Table with proper outer padding */}
      <div className="bg-(--color-bg-card) border-y sm:border sm:rounded-xl border-(--color-bg-border) shadow-sm">
        <table className="w-full table-fixed text-[11px] sm:text-xs">
          <thead>
            <tr className="border-b border-(--color-bg-border) bg-(--color-bg-base)/50">
              <th className="w-[34%] pl-4 pr-1 py-3 text-left font-bold uppercase tracking-wider text-(--color-text-muted)">
                TEAM
              </th>
              <th className="w-[8%] px-0.5 py-3 text-center font-bold uppercase tracking-wider text-(--color-text-muted)">
                M
              </th>
              <th className="w-[8%] px-0.5 py-3 text-center font-bold uppercase tracking-wider text-(--color-text-muted)">
                W
              </th>
              <th className="w-[8%] px-0.5 py-3 text-center font-bold uppercase tracking-wider text-(--color-text-muted)">
                L
              </th>
              <th className="w-[8%] px-0.5 py-3 text-center font-bold uppercase tracking-wider text-(--color-text-muted)">
                T
              </th>
              <th className="w-[8%] px-0.5 py-3 text-center font-bold uppercase tracking-wider text-(--color-text-muted)">
                NR
              </th>
              <th className="w-[10%] px-0.5 py-3 text-center font-bold uppercase tracking-wider text-(--color-text-muted)">
                PT.
              </th>
              <th className="w-[16%] pl-1 pr-4 py-3 text-right font-bold uppercase tracking-wider text-(--color-text-muted)">
                NRR
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr
                key={row.teamId}
                className="border-b border-(--color-bg-border) last:border-b-0"
              >
                {/* Team Name - Added pl-4 for left padding */}
                <td className="pl-4 pr-1 py-3.5 text-left min-w-0">
                  <p className="truncate font-(family-name:--font-display) text-[13px] font-black uppercase text-(--color-navy)">
                    {row.teamNameSnapshot}
                  </p>
                  {(row.bonusPoints > 0 || row.penaltyPoints > 0) && (
                    <div className="flex gap-1 mt-0.5">
                      {row.bonusPoints > 0 && (
                        <span className="text-[9px] text-(--color-four)">
                          +{row.bonusPoints}BP
                        </span>
                      )}
                      {row.penaltyPoints > 0 && (
                        <span className="text-[9px] text-(--color-live)">
                          -{row.penaltyPoints}PP
                        </span>
                      )}
                    </div>
                  )}
                </td>

                {/* Stats */}
                <td className="px-0.5 py-3.5 text-center font-bold text-(--color-navy)">
                  {row.matchesPlayed}
                </td>
                <td className="px-0.5 py-3.5 text-center font-bold text-(--color-navy)">
                  {row.wins}
                </td>
                <td className="px-0.5 py-3.5 text-center font-bold text-(--color-navy)">
                  {row.losses}
                </td>
                <td className="px-0.5 py-3.5 text-center font-bold text-(--color-navy)">
                  {row.ties}
                </td>
                <td className="px-0.5 py-3.5 text-center font-bold text-(--color-navy)">
                  {row.noResults}
                </td>
                <td className="px-0.5 py-3.5 text-center font-bold text-(--color-navy)">
                  {row.points}
                </td>

                {/* NRR with indicator - Added pr-4 for right padding */}
                <td className="pl-1 pr-4 py-3.5 text-right font-bold">
                  <div
                    className={cn(
                      "flex items-center justify-end gap-0.5",
                      row.nrr > 0
                        ? "text-(--color-four)"
                        : row.nrr < 0
                          ? "text-(--color-live)"
                          : "text-(--color-text-secondary)",
                    )}
                  >
                    {row.nrrCalculationStatus === "COMPLETE"
                      ? formatNrr(row.nrr)
                      : "0"}
                    {row.nrrCalculationStatus === "COMPLETE" &&
                      row.nrr !== 0 && (
                        <ChevronDown
                          size={12}
                          className={row.nrr > 0 ? "rotate-180" : ""}
                          strokeWidth={3}
                        />
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer info - aligned with padding */}
        {calculatedAt && (
          <div className="bg-(--color-bg-base)/30 px-4 py-2.5 border-t border-(--color-bg-border)">
            <p className="text-[10px] text-(--color-text-muted) italic">
              Last calculated {calculatedAt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TournamentPointsTable({
  isAdmin,
}: {
  isAdmin: boolean;
}) {
  const router = useRouter();
  const params = useParams();

  const tournamentId = params.tournamentId as string;

  /*
   * null = Overall Tournament
   */
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);

  /*
   * null while a round is selected = All Groups for that round
   */
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const [roundPickerOpen, setRoundPickerOpen] = useState(false);

  const [groupToDelete, setGroupToDelete] = useState<{
    id: string;
    name: string;
    roundId: string;
  } | null>(null);

  const [deleteError, setDeleteError] = useState("");

  // ── Rounds ────────────────────────────────────────────────────────────────

  const [deleteTournamentGroup, { isLoading: isDeletingGroup }] =
    useDeleteTournamentGroupMutation();

  const {
    data: rounds = [],
    isLoading: isLoadingRounds,
    isError: isRoundsError,
    refetch: refetchRounds,
  } = useGetTournamentRoundsQuery({
    tournamentId,
  });

  const selectedRound = rounds.find((round) => round.id === selectedRoundId);

  // ── Groups for selected round ─────────────────────────────────────────────

  const {
    data: groups = [],
    isLoading: isLoadingGroups,
    isFetching: isFetchingGroups,
    isError: isGroupsError,
    refetch: refetchGroups,
  } = useGetTournamentGroupsQuery(
    selectedRoundId
      ? {
          tournamentId,
          roundId: selectedRoundId,
        }
      : skipToken,
  );

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);

  /*
   * Reset the selected group whenever the round changes.
   *
   * Keep the current group only when it still belongs to the loaded group list.
   */
  useEffect(() => {
    if (!selectedRoundId) {
      setSelectedGroupId(null);
      return;
    }

    setSelectedGroupId((currentGroupId) => {
      if (
        currentGroupId &&
        groups.some((group) => group.id === currentGroupId)
      ) {
        return currentGroupId;
      }

      return null;
    });
  }, [selectedRoundId, groups]);

  // ── Tournament points query ───────────────────────────────────────────────

  const tournamentPointsQuery = useGetTournamentPointsTableQuery(
    selectedRoundId === null
      ? {
          tournamentId,
        }
      : skipToken,
  );

  // ── Round points query ────────────────────────────────────────────────────

  const roundPointsQuery = useGetTournamentRoundPointsTableQuery(
    selectedRoundId && selectedGroupId === null
      ? {
          tournamentId,
          roundId: selectedRoundId,
        }
      : skipToken,
  );

  // ── Group points query ────────────────────────────────────────────────────

  const groupPointsQuery = useGetTournamentGroupPointsTableQuery(
    selectedGroupId
      ? {
          tournamentId,
          groupId: selectedGroupId,
        }
      : skipToken,
  );

  // ── Resolve which query is currently active ───────────────────────────────

  const activePointsQuery = selectedGroupId
    ? groupPointsQuery
    : selectedRoundId
      ? roundPointsQuery
      : tournamentPointsQuery;

  const {
    data,
    isLoading: isLoadingPoints,
    isFetching: isFetchingPoints,
    isError: isPointsError,
  } = activePointsQuery;

  const isGroupsLoading =
    selectedRoundId !== null && (isLoadingGroups || isFetchingGroups);

  const isPointsLoading = isLoadingPoints || isFetchingPoints;

  const scopeName = selectedGroup
    ? selectedGroup.name
    : selectedRound
      ? selectedRound.name
      : "Overall Tournament";

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleRoundChange(roundId: string | null) {
    setSelectedRoundId(roundId);
    setSelectedGroupId(null);
    setRoundPickerOpen(false);
  }

  function handleCreateRound() {
    router.push(`/tournaments/${tournamentId}/start-match/round`);
  }

  // function handleAddGroup() {
  //   if (!selectedRoundId) return;

  //   router.push(`/tournaments/${tournamentId}/groups/create${query}`);
  // }

  function handleAddGroup() {
    const query = selectedRoundId ? `?roundId=${selectedRoundId}` : "";

    router.push(`/tournaments/${tournamentId}/groups/create${query}`);
  }

  function handleRetryPoints() {
    if (selectedGroupId) {
      void groupPointsQuery.refetch();
      return;
    }

    if (selectedRoundId) {
      void roundPointsQuery.refetch();
      return;
    }

    void tournamentPointsQuery.refetch();
  }

  async function handleDeleteGroup() {
    if (!groupToDelete) return;

    setDeleteError("");

    try {
      await deleteTournamentGroup({
        tournamentId,
        roundId: groupToDelete.roundId,
        groupId: groupToDelete.id,
      }).unwrap();

      if (selectedGroupId === groupToDelete.id) {
        setSelectedGroupId(null);
      }

      setGroupToDelete(null);
    } catch (error) {
      const message =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
          ? String(error.data.message)
          : "Failed to delete group. Please try again.";

      setDeleteError(message);
    }
  }

  // ── Initial round loading ─────────────────────────────────────────────────

  if (isLoadingRounds) {
    return (
      <div className="bg-(--color-bg-base) pb-4">
        <PointsTableSkeleton />
      </div>
    );
  }

  if (isRoundsError) {
    return (
      <div className="bg-(--color-bg-base) p-4">
        <ErrorState
          title="Failed to Load Rounds"
          description="Please check your connection and try again."
          onRetry={() => refetchRounds()}
        />
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="bg-(--color-bg-base) p-4">
        <NoRoundsState onCreateRound={handleCreateRound} />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base)">
      {/* Top action link */}
      {/* <div className="flex justify-end px-4 pt-3 pb-1">
        <button className="flex items-center gap-1.5 text-xs font-bold text-(--color-brand) hover:opacity-80 active:scale-95 transition-all">
          How is NRR calculated?
          <HelpCircle size={14} />
        </button>
      </div> */}

      {/* ── Round selector ──────────────────────────────────────────────── */}
      <section className="px-4 pb-4 pt-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setRoundPickerOpen((current) => !current);
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border-2 px-4 py-2 text-left",
              "border-(--color-bg-border) bg-white",
              "transition-colors hover:border-(--color-brand)/30",
            )}
          >
            <div className="min-w-0">
              <p className="truncate font-(family-name:--font-display) text-sm font-black uppercase text-(--color-text-primary)">
                {selectedRound?.name ?? "Overall Tournament"}
              </p>
            </div>
            <ChevronDown
              size={18}
              className={cn(
                "shrink-0 text-(--color-text-muted) transition-transform",
                roundPickerOpen && "rotate-180",
              )}
            />
          </button>

          {roundPickerOpen && (
            <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-(--color-bg-border) bg-white p-2 shadow-lg">
              <button
                type="button"
                onClick={() => handleRoundChange(null)}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left transition-colors",
                  selectedRoundId === null
                    ? "bg-(--color-brand) text-white"
                    : "text-(--color-text-primary) hover:bg-(--color-bg-tint)",
                )}
              >
                <p className="font-(family-name:--font-display) text-sm font-black uppercase">
                  Overall Tournament
                </p>
              </button>

              {rounds.map((round) => (
                <button
                  key={round.id}
                  type="button"
                  onClick={() => handleRoundChange(round.id)}
                  className={cn(
                    "mt-1 w-full rounded-lg px-3 py-2 text-left transition-colors",
                    selectedRoundId === round.id
                      ? "bg-(--color-brand) text-white"
                      : "text-(--color-text-primary) hover:bg-(--color-bg-tint)",
                  )}
                >
                  <p className="font-(family-name:--font-display) text-sm font-black uppercase">
                    {round.name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Groups selector ──────────────────────────────────────────── */}
        {selectedRoundId && isGroupsLoading && (
          <div className="mt-4 animate-pulse">
            <div className="h-3 w-20 rounded bg-(--color-bg-border)" />
            <div className="mt-3 flex gap-2">
              <div className="h-8 w-24 rounded-full bg-(--color-bg-border)" />
              <div className="h-8 w-24 rounded-full bg-(--color-bg-border)" />
            </div>
          </div>
        )}

        {selectedRoundId &&
          !isGroupsLoading &&
          !isGroupsError &&
          groups.length > 0 && (
            <div className="mt-4">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedGroupId(null)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-1.5",
                    "font-(family-name:--font-display) text-xs font-bold uppercase",
                    selectedGroupId === null
                      ? "border-(--color-brand) bg-(--color-brand) text-white"
                      : "border-(--color-bg-border) bg-white text-(--color-text-secondary)",
                  )}
                >
                  Round Table
                </button>

                {/* {groups.map((group) => {
                  const isSelected = selectedGroupId === group.id;

                  return (
                    <div
                      key={group.id}
                      className={cn(
                        "flex shrink-0 items-center overflow-hidden rounded-full border",
                        isSelected
                          ? "border-(--color-brand) bg-(--color-brand) text-white"
                          : "border-(--color-bg-border) bg-white text-(--color-text-secondary)",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedGroupId(group.id)}
                        className="px-4 py-1.5 font-(family-name:--font-display) text-xs font-bold uppercase"
                      >
                        {group.name}
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();

                          router.push(
                            `/tournaments/${tournamentId}/groups/${group.id}/edit`,
                          );
                        }}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center border-l",
                          isSelected
                            ? "border-white/20 text-white/80 hover:bg-white/10"
                            : "border-(--color-bg-border) text-(--color-text-muted) hover:bg-(--color-bg-tint)",
                        )}
                        aria-label={`Edit ${group.name}`}
                      >
                        <Pencil size={12} />
                      </button>
                    </div>
                  );
                })} */}

                {groups.map((group) => {
                  const isSelected = selectedGroupId === group.id;

                  return (
                    <div
                      key={group.id}
                      className={cn(
                        "flex shrink-0 items-center overflow-hidden rounded-full border",
                        isSelected
                          ? "border-(--color-brand) bg-(--color-brand) text-white"
                          : "border-(--color-bg-border) bg-white text-(--color-text-secondary)",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedGroupId(group.id)}
                        className="px-4 py-1.5 font-(family-name:--font-display) text-xs font-bold uppercase"
                      >
                        {group.name}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();

                          router.push(
                            `/tournaments/${tournamentId}/groups/${group.id}/edit`,
                          );
                        }}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center border-l",
                          isSelected
                            ? "border-white/20 text-white/80 hover:bg-white/10"
                            : "border-(--color-bg-border) text-(--color-text-muted) hover:bg-(--color-bg-tint)",
                        )}
                        aria-label={`Edit ${group.name}`}
                      >
                        <Pencil size={12} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setDeleteError("");

                          setGroupToDelete({
                            id: group.id,
                            name: group.name,
                            roundId: group.roundId ?? selectedRoundId!,
                          });
                        }}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center border-l",
                          isSelected
                            ? "border-white/20 text-white/80 hover:bg-white/10"
                            : "border-(--color-bg-border) text-(--color-live) hover:bg-(--color-live)/5",
                        )}
                        aria-label={`Delete ${group.name}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}

                {/* Add another group to the selected round */}
                <button
                  type="button"
                  onClick={handleAddGroup}
                  className={cn(
                    "flex shrink-0 items-center gap-1 rounded-full border px-4 py-1.5",
                    "border-dashed border-(--color-brand)/50 bg-(--color-brand)/5",
                    "font-(family-name:--font-display) text-xs font-bold uppercase text-(--color-brand)",
                    "transition-all hover:border-(--color-brand) hover:bg-(--color-brand)/10 active:scale-95",
                  )}
                >
                  <Plus size={13} strokeWidth={2.5} />
                  Add Group
                </button>
              </div>
            </div>
          )}
      </section>

      {selectedRoundId &&
        isAdmin &&
        !isGroupsLoading &&
        !isGroupsError &&
        groups.length === 0 && (
          <div className="mx-4 mb-4 rounded-xl border border-(--color-brand)/20 bg-(--color-bg-tint) p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-(family-name:--font-display) text-sm font-black uppercase text-(--color-navy)">
                  Want Separate Group Tables?
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddGroup}
                className="flex shrink-0 items-center gap-1 rounded-lg bg-(--color-brand) px-3 py-2 text-xs font-bold text-white shadow-sm"
              >
                <Plus size={14} />
                Add Group
              </button>
            </div>
            <p className="mt-1 text-xs leading-5 text-(--color-text-secondary)">
              Groups are optional. Create them only when you want to divide this
              round into pools such as Group A and Group B.
            </p>
          </div>
        )}

      {/* ── Table Area ─────────────────────────────────────────────── */}
      <div className="flex-1 w-full max-w-150 mx-auto">
        {selectedRoundId && isGroupsError ? (
          <div className="p-4">
            <ErrorState
              title="Failed to Load Groups"
              description="Groups for this round could not be loaded."
              onRetry={() => refetchGroups()}
            />
          </div>
        ) : isPointsLoading ? (
          <PointsTableSkeleton />
        ) : isPointsError || !data ? (
          <div className="p-4">
            <ErrorState
              title="Failed to Load Points Table"
              description="Please check your connection and try again."
              onRetry={handleRetryPoints}
            />
          </div>
        ) : data.rows.length === 0 ? (
          <div className="p-4">
            <EmptyStandingsState scopeName={scopeName} />
          </div>
        ) : (
          <StandingsTable data={data} title={scopeName} />
        )}
      </div>

      {/* ── Bottom Promo / Tools ────────────────────────────────────────────── */}
      {/* <div className="mt-8 mb-10 px-4 flex flex-col items-center text-center">
        <h4 className="text-lg font-medium text-(--color-navy)">
          Can your team make it to the next round?
        </h4>
        <p className="mt-2 text-sm text-(--color-text-secondary) leading-relaxed max-w-md mx-auto">
          Wondering what score your team needs in the final group match to
          qualify? Use the smart NRR calculator to know your target, plan
          better, and aim for that win!
        </p>
        <div className="mt-5 w-full max-w-sm">
          <Button variant="primary" size="lg" fullWidth>
            SMART NRR CALCULATOR
          </Button>
        </div>

        <p className="mt-8 text-sm text-(--color-text-secondary)">
          Do you have a bonus points system?{" "}
          <button className="font-semibold text-(--color-brand) underline underline-offset-2">
            Show more
          </button>
        </p>
      </div> */}
      {groupToDelete && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-(--color-bg-card) p-5 shadow-[0_20px_60px_rgba(13,27,62,0.30)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-live)/10">
              <Trash2 size={22} className="text-(--color-live)" />
            </div>

            <h3 className="mt-4 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
              Delete Group?
            </h3>

            <p className="mt-2 text-sm leading-6 text-(--color-text-secondary)">
              Are you sure you want to delete{" "}
              <strong>{groupToDelete.name}</strong>? Its group points table and
              team assignments will no longer be available.
            </p>

            {deleteError && (
              <div className="mt-4 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
                <p className="text-sm font-medium text-(--color-live)">
                  {deleteError}
                </p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                disabled={isDeletingGroup}
                onClick={() => {
                  setGroupToDelete(null);
                  setDeleteError("");
                }}
              >
                Cancel
              </Button>

              <Button
                type="button"
                fullWidth
                loading={isDeletingGroup}
                disabled={isDeletingGroup}
                onClick={handleDeleteGroup}
                className="bg-(--color-live) text-white hover:bg-red-600"
              >
                Delete Group
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
