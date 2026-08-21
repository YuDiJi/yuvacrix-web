"use client";

import { CheckCircle2, Trophy } from "lucide-react";

import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";

import type { VolleyballMatch } from "@/types/volleyball/match";
import type { VolleyballSet } from "@/types/volleyball/set";

type Props = {
  open: boolean;

  match: VolleyballMatch;

  set: VolleyballSet;

  isLoading?: boolean;

  onContinue: () => void;
};

export function VolleyballSetCompletedSheet({
  open,
  match,
  set,
  isLoading = false,
  onContinue,
}: Props) {
  const winner =
    set.winnerTeamId === match.teamAId
      ? match.teamASnapshot
      : set.winnerTeamId === match.teamBId
        ? match.teamBSnapshot
        : null;

  return (
    <DialogBottom
      open={open}
      onClose={() => {
        /*
         * Deliberately prevent accidental
         * dismissal after a completed set.
         *
         * Scorer must explicitly Continue.
         */
      }}
      className="overflow-hidden rounded-t-3xl bg-(--color-bg-card)"
    >
      <div className="px-5 pb-5 pt-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--color-brand)/10">
          <CheckCircle2 size={28} className="text-(--color-brand)" />
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-(--color-brand)">
            Set {set.setNumber}
          </p>

          <h2 className="mt-1 text-xl font-black text-(--color-text-primary)">
            Set Complete
          </h2>
        </div>

        <div className="mt-5 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-base) p-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <TeamScore
              name={match.teamASnapshot.shortName ?? match.teamASnapshot.name}
              score={set.teamAPoints}
              winner={set.winnerTeamId === match.teamAId}
            />

            <span className="text-sm font-bold text-(--color-text-muted)">
              —
            </span>

            <TeamScore
              name={match.teamBSnapshot.shortName ?? match.teamBSnapshot.name}
              score={set.teamBPoints}
              winner={set.winnerTeamId === match.teamBId}
            />
          </div>
        </div>

        {winner && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Trophy size={16} className="text-(--color-brand)" />

            <p className="text-sm font-bold text-(--color-text-primary)">
              {winner.name} won Set {set.setNumber}
            </p>
          </div>
        )}

        <div className="mt-6">
          <Button
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </DialogBottom>
  );
}

function TeamScore({
  name,
  score,
  winner,
}: {
  name: string;
  score: number;
  winner: boolean;
}) {
  return (
    <div className="text-center">
      <p className="truncate text-xs font-bold text-(--color-text-secondary)">
        {name}
      </p>

      <p className="mt-1 font-(family-name:--font-display) text-4xl font-black text-(--color-text-primary)">
        {score}
      </p>

      {winner && (
        <span className="mt-1 inline-flex rounded-full bg-(--color-brand)/10 px-2 py-0.5 text-[9px] font-black uppercase text-(--color-brand)">
          Winner
        </span>
      )}
    </div>
  );
}
