import { useState } from "react";
import { cn } from "@/lib/cn";
import { DialogBottom } from "@/components/common/DialogBottom";
import { Button } from "@/components/common/Button";
import { useRouter } from "next/navigation";
import { MatchCardModel } from "@/types/cricket/matchCard";

// If you are rendering this inside an existing component, you just need
// the state and the return block.
export function LiveOptionsSheet({
  showLiveOptions,
  setShowLiveOptions,
  match,
  getMatchRoute,
}: {
  showLiveOptions: boolean;
  setShowLiveOptions: (v: boolean) => void;
  match: MatchCardModel;
  getMatchRoute: (match: MatchCardModel) => string;
}) {
  const router = useRouter();

  const [selectedAction, setSelectedAction] = useState<"RESUME" | "SCORECARD">(
    "RESUME",
  );

  const handleContinue = () => {
    if (selectedAction === "RESUME") {
      router.push(getMatchRoute(match));
    } else {
      router.push(`/matches/${match.matchId}/scorecard`);
    }
    setShowLiveOptions(false);
  };

  return (
    <DialogBottom
      open={showLiveOptions}
      onClose={() => setShowLiveOptions(false)}
    >
      <div className="flex flex-col mb-14">
        {/* Header Section */}
        <div className="mb-5 flex flex-col gap-1">
          <h2 className="font-display text-2xl font-black uppercase tracking-[0.04em] text-(--color-navy)">
            What would you like to do?
          </h2>
          <p className="text-sm font-medium text-(--color-text-secondary) leading-snug">
            Choose an action to proceed with this match.
          </p>
        </div>

        {/* Radio Cards */}
        <div className="flex flex-col gap-3 mb-6">
          {/* Option 1: Resume Scoring */}
          <label
            className={cn(
              "group flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98]",
              selectedAction === "RESUME"
                ? "border-(--color-brand) bg-(--color-bg-tint)"
                : "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-brand)/40 hover:bg-(--color-bg-base)",
            )}
          >
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-display text-lg font-bold uppercase tracking-wide",
                  selectedAction === "RESUME"
                    ? "text-(--color-brand)"
                    : "text-(--color-navy)",
                )}
              >
                Resume Scoring
              </span>
              <span className="text-xs font-medium text-(--color-text-secondary) mt-0.5">
                Continue updating the match live.
              </span>
            </div>

            {/* Custom Radio Indicator */}
            <div
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors shrink-0",
                selectedAction === "RESUME"
                  ? "border-(--color-brand) bg-(--color-brand)"
                  : "border-(--color-bg-border) bg-transparent group-hover:border-(--color-brand)/40",
              )}
            >
              {selectedAction === "RESUME" && (
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
              )}
            </div>

            <input
              type="radio"
              name="live_action"
              value="RESUME"
              checked={selectedAction === "RESUME"}
              onChange={() => setSelectedAction("RESUME")}
              className="sr-only" // Hides the native radio input
            />
          </label>

          {/* Option 2: View Scorecard */}
          <label
            className={cn(
              "group flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98]",
              selectedAction === "SCORECARD"
                ? "border-(--color-brand) bg-(--color-bg-tint)"
                : "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-brand)/40 hover:bg-(--color-bg-base)",
            )}
          >
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-display text-lg font-bold uppercase tracking-wide",
                  selectedAction === "SCORECARD"
                    ? "text-(--color-brand)"
                    : "text-(--color-navy)",
                )}
              >
                View Scorecard
              </span>
              <span className="text-xs font-medium text-(--color-text-secondary) mt-0.5">
                Check the full match statistics.
              </span>
            </div>

            {/* Custom Radio Indicator */}
            <div
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors shrink-0",
                selectedAction === "SCORECARD"
                  ? "border-(--color-brand) bg-(--color-brand)"
                  : "border-(--color-bg-border) bg-transparent group-hover:border-(--color-brand)/40",
              )}
            >
              {selectedAction === "SCORECARD" && (
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
              )}
            </div>

            <input
              type="radio"
              name="live_action"
              value="SCORECARD"
              checked={selectedAction === "SCORECARD"}
              onChange={() => setSelectedAction("SCORECARD")}
              className="sr-only" // Hides the native radio input
            />
          </label>
        </div>

        {/* Action Button */}
        <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </DialogBottom>
  );
}
