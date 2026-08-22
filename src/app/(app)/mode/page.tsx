"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Volleyball } from "lucide-react";

import { cn } from "@/lib/cn";
import { useAppDispatch } from "@/store/hooks";
import { setActiveSport } from "@/store/sport/sportSlice";
import { SPORT_TYPES, SportType } from "@/types/sport";
import { useUpdatePlayerMutation } from "@/store/api/playerApi";
import { Button } from "@/components/common/Button";

const SPORTS: Array<{
  value: SportType;
  label: string;
  description: string;
  icon: typeof Trophy;
}> = [
  {
    value: SPORT_TYPES.CRICKET,
    label: "Cricket",
    description: "Score matches, manage teams and tournaments.",
    icon: Trophy,
  },
  {
    value: SPORT_TYPES.VOLLEYBALL,
    label: "Volleyball",
    description: "Score sets, manage teams and tournaments.",
    icon: Volleyball,
  },
];

export default function ModePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedSport, setSelectedSport] = useState<SportType | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [updatePlayer, { isLoading: isUpdating }] = useUpdatePlayerMutation();

  const handleContinue = async () => {
    if (!selectedSport || isUpdating) return;

    try {
      setError(null);

      await updatePlayer({
        activeSport: selectedSport,
      }).unwrap();

      dispatch(setActiveSport(selectedSport));

      if (selectedSport === SPORT_TYPES.CRICKET) {
        router.replace("/home");
        return;
      }

      if (selectedSport === SPORT_TYPES.VOLLEYBALL) {
        router.replace("/volleyball/home");
      }
    } catch (err) {
      console.error("Failed to update active sport:", err);

      setError("Unable to switch sport. Please try again.");
    }
  };

  return (
    <main className=" bg-(--color-bg-base)">
      <div className="mx-auto flex min-h-[92dvh] w-full max-w-md flex-col px-4 pb-6 pt-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-2 font-display text-3xl font-black uppercase tracking-wide text-(--color-navy)">
            Choose Your Sport
          </div>

          <p className="mx-auto max-w-xs text-sm leading-6 text-(--color-text-secondary)">
            Select the sport you want to use right now. You can switch sports
            anytime from the side drawer.
          </p>
        </div>

        {/* Sport Options */}
        <div className="flex flex-1 flex-col gap-3">
          {SPORTS.map((sport) => {
            const Icon = sport.icon;
            const selected = selectedSport === sport.value;

            return (
              <button
                key={sport.value}
                type="button"
                disabled={isUpdating}
                onClick={() => setSelectedSport(sport.value)}
                className={cn(
                  "relative flex w-full items-center gap-4 rounded-xl border bg-(--color-bg-card) p-4 text-left transition-all",
                  selected
                    ? "border-(--color-brand) bg-(--color-bg-tint) shadow-(--shadow-card)"
                    : "border-(--color-bg-border) hover:border-(--color-brand)/40",
                  isUpdating && "cursor-not-allowed opacity-70",
                )}
              >
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-xl",
                    selected
                      ? "bg-(--color-brand) text-white"
                      : "bg-(--color-bg-base) text-(--color-text-secondary)",
                  )}
                >
                  <Icon size={24} strokeWidth={2.2} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-display text-lg font-bold uppercase tracking-wide text-(--color-text-primary)">
                    {sport.label}
                  </div>

                  <p className="mt-1 text-sm leading-5 text-(--color-text-secondary)">
                    {sport.description}
                  </p>
                </div>

                <div
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                    selected
                      ? "border-(--color-brand)"
                      : "border-(--color-bg-border)",
                  )}
                >
                  {selected && (
                    <div className="size-2.5 rounded-full bg-(--color-brand)" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 text-center text-sm font-medium text-red-500">
            {error}
          </p>
        )}

        {/* Continue */}
        <div className="safe-bottom pt-6">
          <Button
            type="button"
            disabled={!selectedSport || isUpdating}
            onClick={handleContinue}
            fullWidth
          >
            {isUpdating ? "Switching..." : "Continue"}
          </Button>
        </div>
      </div>
    </main>
  );
}
