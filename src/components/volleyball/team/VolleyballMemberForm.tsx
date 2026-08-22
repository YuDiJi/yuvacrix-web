"use client";

import { useMemo, useState } from "react";

import { Hash, UserRound } from "lucide-react";

import { Button } from "@/components/common/Button";
import type { Player } from "@/types/player";
import {
  VOLLEYBALL_POSITIONS,
  type VolleyballPosition,
} from "@/types/volleyball/team";

type VolleyballMemberFormValues = {
  jerseyNumber: number;
  primaryPosition: VolleyballPosition;
  secondaryPosition?: VolleyballPosition;
};

type VolleyballMemberFormPlayer = {
  id: string;
  fullName: string;
  profileImageUrl?: string | null;
};

type VolleyballMemberFormProps = {
  player: VolleyballMemberFormPlayer;

  initialValues?: {
    jerseyNumber: number;
    primaryPosition: VolleyballPosition;
    secondaryPosition?: VolleyballPosition | null;
  };

  submitText?: string;

  isLoading?: boolean;
  error?: string;

  onCancel?: () => void;

  onSubmit: (values: VolleyballMemberFormValues) => void | Promise<void>;
};

const positionOptions = Object.values(VOLLEYBALL_POSITIONS);

function formatPosition(position: VolleyballPosition) {
  return position
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function VolleyballMemberForm({
  player,
  initialValues,
  submitText = "Add Player to Team",
  isLoading = false,
  error,
  onCancel,
  onSubmit,
}: VolleyballMemberFormProps) {
  const [jerseyNumber, setJerseyNumber] = useState(
    initialValues?.jerseyNumber?.toString() ?? "",
  );

  const [primaryPosition, setPrimaryPosition] = useState<
    VolleyballPosition | ""
  >(initialValues?.primaryPosition ?? "");

  const [secondaryPosition, setSecondaryPosition] = useState<
    VolleyballPosition | ""
  >(initialValues?.secondaryPosition ?? "");
  const parsedJerseyNumber = Number(jerseyNumber);

  const isValid = useMemo(() => {
    return (
      jerseyNumber.trim() !== "" &&
      Number.isInteger(parsedJerseyNumber) &&
      parsedJerseyNumber >= 0 &&
      parsedJerseyNumber <= 99 &&
      primaryPosition !== ""
    );
  }, [jerseyNumber, parsedJerseyNumber, primaryPosition]);

  async function handleSubmit() {
    if (!isValid || primaryPosition === "") {
      return;
    }

    await onSubmit({
      jerseyNumber: parsedJerseyNumber,
      primaryPosition,
      ...(secondaryPosition
        ? {
            secondaryPosition,
          }
        : {}),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
        <p className="text-section-label">Volleyball Player</p>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--color-bg-tint)">
            <UserRound size={20} className="text-(--color-brand)" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-(--color-text-primary)">
              {player.fullName}
            </p>

            <p className="text-xs text-(--color-text-muted)">
              Add volleyball details before adding to team
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
        <label htmlFor="jersey-number" className="text-section-label">
          Jersey Number
        </label>

        <div className="mt-2 flex items-center gap-3 rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-3">
          <Hash size={17} className="shrink-0 text-(--color-brand)" />

          <input
            id="jersey-number"
            type="number"
            min={0}
            max={99}
            inputMode="numeric"
            value={jerseyNumber}
            onChange={(event) => setJerseyNumber(event.target.value)}
            placeholder="e.g. 10"
            className="w-full bg-transparent text-sm font-semibold text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
        <label htmlFor="primary-position" className="text-section-label">
          Primary Position
        </label>

        <select
          id="primary-position"
          value={primaryPosition}
          onChange={(event) =>
            setPrimaryPosition(event.target.value as VolleyballPosition)
          }
          className="mt-2 w-full rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-3 text-sm font-semibold text-(--color-text-primary) outline-none focus:border-(--color-brand)"
        >
          <option value="">Select position</option>

          {positionOptions.map((position) => (
            <option key={position} value={position}>
              {formatPosition(position)}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
        <div>
          <label htmlFor="secondary-position" className="text-section-label">
            Secondary Position
          </label>

          <p className="mt-1 text-xs text-(--color-text-muted)">Optional</p>
        </div>

        <select
          id="secondary-position"
          value={secondaryPosition}
          onChange={(event) =>
            setSecondaryPosition(event.target.value as VolleyballPosition)
          }
          className="mt-2 w-full rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-3 text-sm font-semibold text-(--color-text-primary) outline-none focus:border-(--color-brand)"
        >
          <option value="">No secondary position</option>

          {positionOptions
            .filter((position) => position !== primaryPosition)
            .map((position) => (
              <option key={position} value={position}>
                {formatPosition(position)}
              </option>
            ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
          <p className="text-sm font-medium text-(--color-live)">{error}</p>
        </div>
      )}

      <div className="safe-bottom flex flex-col gap-2 pt-2">
        <Button
          fullWidth
          loading={isLoading}
          disabled={!isValid || isLoading}
          onClick={handleSubmit}
        >
          {submitText}
        </Button>

        {onCancel && (
          <Button
            fullWidth
            variant="secondary"
            disabled={isLoading}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
