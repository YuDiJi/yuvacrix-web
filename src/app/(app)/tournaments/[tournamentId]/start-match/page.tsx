"use client";

import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";
import { useGetTournamentGroupsQuery } from "@/store/api/cricket/tournamentGroupApi";
import { useGetTournamentRoundsQuery } from "@/store/api/cricket/tournamentRoundApi";
import { useAppDispatch } from "@/store/hooks";
import { setTournamentMatchContext } from "@/store/startMatch/startMatchSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { Layers3, Plus, Trophy, UsersRound } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const StartMatchPage = () => {
  const router = useRouter();
  const params = useParams();

  const dispatch = useAppDispatch();

  const tournamentId = params.tournamentId as string;

  const {
    data: rounds,
    isLoading,
    isError,
  } = useGetTournamentRoundsQuery({ tournamentId });

  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const {
    data: groups = [],
    isLoading: isLoadingGroups,
    isFetching: isFetchingGroups,
    isError: isGroupsError,
  } = useGetTournamentGroupsQuery(
    selectedRoundId
      ? {
          tournamentId,
          roundId: selectedRoundId,
        }
      : skipToken,
  );

  function handleRoundSelect(roundId: string) {
    setSelectedRoundId((currentRoundId) => {
      if (currentRoundId === roundId) {
        setSelectedGroupId(null);
        return null;
      }

      setSelectedGroupId(null);
      return roundId;
    });
  }

  function handleAddGroup() {
    const query = selectedRoundId ? `?roundId=${selectedRoundId}` : "";

    router.push(`/tournaments/${tournamentId}/groups/create${query}`);
  }

  const groupsLoading = isLoadingGroups || isFetchingGroups;

  const canContinue =
    selectedRoundId !== null && !groupsLoading && !isGroupsError;

  const selectedRound = rounds?.find((round) => round.id === selectedRoundId);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-full flex-col bg-(--color-bg-base) px-4 pt-4">
        <div className="mb-1 h-3 w-24 animate-pulse rounded-full bg-(--color-bg-border)" />
        <div className="mb-5 h-7 w-36 animate-pulse rounded-full bg-(--color-bg-border)" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-2xl bg-(--color-bg-border)"
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-3 bg-(--color-bg-base) px-6 text-center">
        <p className="text-sm font-medium text-(--color-text-muted)">
          Failed to load rounds. Please go back and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-(--color-bg-base)">
      {/* ── Page content ─────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 pt-5 pb-28">
        {/* Hint + heading */}
        <p className="mb-1 text-xs italic text-(--color-text-muted)">
          * Scoring a match on YuvaCrix is free.
        </p>
        <h2
          className="mb-5 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-navy)"
          style={{ letterSpacing: "0.03em" }}
        >
          Select Round
        </h2>

        {/* ── Round grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {rounds?.map((round) => {
            const isSelected = selectedRoundId === round.id;
            return (
              <button
                key={round.id}
                type="button"
                onClick={() => handleRoundSelect(round.id)}
                className={cn(
                  // square-ish card
                  "flex aspect-square flex-col items-center justify-center rounded-2xl border-2 p-3 text-center",
                  "font-(family-name:--font-display) text-sm font-black uppercase leading-tight",
                  "transition-all duration-150 active:scale-[0.96]",
                  isSelected
                    ? // selected — brand blue fill
                      "border-(--color-brand) bg-(--color-brand) text-white shadow-[0_4px_16px_rgba(27,63,160,0.35)]"
                    : // unselected — light card
                      "border-(--color-bg-border) bg-(--color-bg-card) text-(--color-navy) shadow-(--shadow-card) hover:border-(--color-brand)/30",
                )}
                style={{ letterSpacing: "0.03em" }}
              >
                {round.name}
              </button>
            );
          })}

          {/* Add new round — always last, dark navy */}
          <button
            type="button"
            onClick={() =>
              router.push(`/tournaments/${tournamentId}/start-match/round`)
            }
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2",
              "border-(--color-navy) bg-(--color-navy) p-3 text-center",
              "transition-all duration-150 active:scale-[0.96] hover:bg-[#162040]",
            )}
          >
            <Plus size={20} className="text-white/70" strokeWidth={2.5} />
            <span
              className="font-(family-name:--font-display) text-sm font-black uppercase leading-tight text-white"
              style={{ letterSpacing: "0.03em" }}
            >
              Add new{"\n"}round
            </span>
          </button>
        </div>

        {/* ── Group grid ─────────────────────────────────────────────────── */}
        {selectedRoundId &&
          !groupsLoading &&
          !isGroupsError &&
          groups.length > 0 && (
            <section className="mt-4 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
              <div className="mb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-navy)">
                      Select Group
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-(--color-text-secondary)">
                      Optional. Select “No Group” for a round-level match.
                    </p>
                  </div>

                  {groups.length > 0 && (
                    <button
                      type="button"
                      onClick={handleAddGroup}
                      className="flex shrink-0 items-center gap-1 font-(family-name:--font-display) text-xs font-black uppercase text-(--color-brand)"
                    >
                      <Plus size={14} strokeWidth={2.5} />
                      Add
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGroupId(null)}
                  className={cn(
                    "rounded-full border px-4 py-2",
                    "font-(family-name:--font-display) text-xs font-bold uppercase",
                    "transition-colors",
                    selectedGroupId === null
                      ? "border-(--color-brand) bg-(--color-brand) text-white"
                      : "border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-secondary)",
                  )}
                >
                  No Group
                </button>

                {groups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setSelectedGroupId(group.id)}
                    className={cn(
                      "rounded-full border px-4 py-2",
                      "font-(family-name:--font-display) text-xs font-bold uppercase",
                      "transition-colors",
                      selectedGroupId === group.id
                        ? "border-(--color-brand) bg-(--color-brand) text-white"
                        : "border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-secondary)",
                    )}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            </section>
          )}

        {selectedRoundId &&
          !groupsLoading &&
          !isGroupsError &&
          groups.length === 0 && (
            <section className="mt-6 overflow-hidden rounded-2xl border border-(--color-brand)/15 bg-(--color-bg-card) shadow-(--shadow-card)">
              {/* Header */}
              {/* <div className="border-b border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-3">
                <div className="flex items-center gap-2">
                  <Layers3
                    size={18}
                    className="text-(--color-brand)"
                    strokeWidth={2.5}
                  />

                  <div>
                    <h3 className="font-(family-name:--font-display) text-base font-black uppercase text-(--color-navy)">
                      Organise this round
                    </h3>

                    <p className="mt-0.5 text-xs text-(--color-text-secondary)">
                      Groups are optional 
                    </p>
                  </div>
                </div>
              </div> */}

              <div className="border-b border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-3">
                <div className="flex items-center gap-2">
                  <Layers3
                    size={18}
                    className="text-(--color-brand)"
                    strokeWidth={2.5}
                  />

                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-(family-name:--font-display) text-base font-black uppercase text-(--color-navy)">
                        Organise this round
                      </h3>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full",
                          "border border-(--color-brand)/20",
                          "bg-(--color-brand)/10",
                          "px-2.5 py-1",
                          "font-(family-name:--font-display) text-[10px] font-black uppercase tracking-wide",
                          "text-(--color-brand)",
                        )}
                      >
                        Optional
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-(--color-text-secondary)">
                      <span className="font-semibold text-(--color-brand)">
                        Groups are completely optional.
                      </span>{" "}
                      You can simply tap{" "}
                      <span className="font-semibold text-(--color-text-primary)">
                        Next
                      </span>{" "}
                      to continue without creating any groups.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4">
                {/* Visual diagram */}
                <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-base) p-4">
                  {/* Round */}
                  <div className="flex flex-col items-center">
                    <div className="flex min-w-40 items-center justify-center gap-2 rounded-xl border-2 border-(--color-brand) bg-(--color-brand) px-5 py-3 text-white shadow-sm">
                      <Trophy size={17} strokeWidth={2.5} />

                      <span className="font-(family-name:--font-display) text-sm font-black uppercase">
                        {selectedRound?.name}
                      </span>
                    </div>

                    <span className="mt-1 font-(family-name:--font-display) text-[10px] font-bold uppercase text-(--color-text-muted)">
                      Round
                    </span>

                    {/* Main connector */}
                    <div className="mt-2 h-5 w-px bg-(--color-brand)/40" />

                    {/* Horizontal branch */}
                    <div className="relative h-px w-1/2 bg-(--color-brand)/40">
                      <div className="absolute left-0 top-0 h-4 w-px bg-(--color-brand)/40" />
                      <div className="absolute right-0 top-0 h-4 w-px bg-(--color-brand)/40" />
                    </div>
                  </div>

                  {/* Groups */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-(--color-brand)/20 bg-(--color-bg-card) p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <UsersRound
                          size={15}
                          className="text-(--color-brand)"
                          strokeWidth={2.5}
                        />

                        <p className="font-(family-name:--font-display) text-sm font-black uppercase text-(--color-navy)">
                          Group A
                        </p>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <div className="rounded-lg bg-(--color-bg-tint) px-2 py-1.5 text-xs font-semibold text-(--color-text-secondary)">
                          Team A
                        </div>

                        <div className="rounded-lg bg-(--color-bg-tint) px-2 py-1.5 text-xs font-semibold text-(--color-text-secondary)">
                          Team B
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-(--color-brand)/20 bg-(--color-bg-card) p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <UsersRound
                          size={15}
                          className="text-(--color-brand)"
                          strokeWidth={2.5}
                        />

                        <p className="font-(family-name:--font-display) text-sm font-black uppercase text-(--color-navy)">
                          Group B
                        </p>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <div className="rounded-lg bg-(--color-bg-tint) px-2 py-1.5 text-xs font-semibold text-(--color-text-secondary)">
                          Team C
                        </div>

                        <div className="rounded-lg bg-(--color-bg-tint) px-2 py-1.5 text-xs font-semibold text-(--color-text-secondary)">
                          Team D
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minimal explanation */}
                <div className="text-center">
                  <p className="text-sm font-semibold text-(--color-text-primary)">
                    Divide teams into smaller groups
                  </p>

                  <p className="mt-1 text-xs leading-5 text-(--color-text-secondary)">
                    Create groups like Group A and Group B, or continue without
                    one.
                  </p>
                </div>

                {/* Create group CTA */}
                <button
                  type="button"
                  onClick={handleAddGroup}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl border",
                    "border-(--color-brand)/25 bg-(--color-brand)/8 px-4 py-3",
                    "font-(family-name:--font-display) text-sm font-black uppercase text-(--color-brand)",
                    "transition-all active:scale-[0.98] hover:bg-(--color-brand)/12",
                  )}
                >
                  <Plus size={17} strokeWidth={2.5} />
                  Create Group
                  <span className="text-[10px] font-bold opacity-70">
                    (Optional)
                  </span>
                </button>
              </div>
            </section>
          )}

        {selectedRoundId && groupsLoading && (
          <div className="mt-6 animate-pulse rounded-2xl bg-(--color-bg-card) p-4">
            <div className="h-4 w-28 rounded bg-(--color-bg-border)" />

            <div className="mt-3 flex gap-2">
              <div className="h-9 w-24 rounded-full bg-(--color-bg-border)" />
              <div className="h-9 w-24 rounded-full bg-(--color-bg-border)" />
            </div>
          </div>
        )}

        {selectedRoundId && isGroupsError && (
          <div className="mt-6 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
            <p className="text-sm font-medium text-(--color-live)">
              Failed to load groups for this round.
            </p>
          </div>
        )}
      </div>
      {/* ── Sticky CTA ───────────────────────────────────────────────────── */}
      <div className="z-20 sticky bottom-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3">
        <Button
          type="button"
          fullWidth
          disabled={!canContinue}
          onClick={() => {
            if (!canContinue || !selectedRoundId) return;
            dispatch(
              setTournamentMatchContext({
                tournamentId: tournamentId,
                roundId: selectedRoundId,
                groupId: selectedGroupId,
              }),
            );

            router.push(
              `/tournaments/${tournamentId}/start-match/playing-teams`,
            );
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StartMatchPage;
