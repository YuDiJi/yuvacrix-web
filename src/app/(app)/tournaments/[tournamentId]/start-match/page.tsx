"use client";

import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";
import { useGetTournamentGroupsQuery } from "@/store/api/tournamentGroupApi";
import { useGetTournamentRoundsQuery } from "@/store/api/tournamentRoundApi";
import { useAppDispatch } from "@/store/hooks";
import {
  resetMatch,
  setTournamentMatchContext,
} from "@/store/startMatch/startMatchSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { Plus } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

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

  const groupsLoading = isLoadingGroups || isFetchingGroups;

  const canContinue =
    selectedRoundId !== null && !groupsLoading && !isGroupsError;

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
                onClick={() => setSelectedRoundId(isSelected ? null : round.id)}
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
            <section className="mt-6 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
              <div className="mb-3">
                <h3 className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-navy)">
                  Select Group
                </h3>

                <p className="mt-1 text-xs leading-5 text-(--color-text-secondary)">
                  Optional. Leave “No Group” selected for a round-level match.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGroupId(null)}
                  className={cn(
                    "rounded-full border px-4 py-2",
                    "font-(family-name:--font-display) text-xs font-bold uppercase",
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
      <div className="z-20 border-t border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3">
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
