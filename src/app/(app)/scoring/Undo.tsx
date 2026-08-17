import { DialogBottom } from "@/components/common/DialogBottom"; // Adjust import path
import { Button } from "@/components/common/Button";
import { useUndoLastBallMutation } from "@/store/api/scoringApi";
import { Info } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { DialogType } from "./ScoringPage";

const BYE_RUN_OPTIONS = [1, 2, 3, 4];

export function UndoSheet({
  open,
  onClose,
  inningsId,
  matchId,
  setOpenDialog,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
  matchId: string | null;
  inningsId: string | undefined;
  setOpenDialog: Dispatch<SetStateAction<DialogType | null>>;
}) {
  const [undoLastBall, { isLoading: isUndoing, error }] =
    useUndoLastBallMutation();
  const errorMessage = (error as { data?: { message?: string } } | undefined)
    ?.data?.message;

  async function handleUndo() {
    if (!matchId || !inningsId) return;

    try {
      await undoLastBall({
        matchId,
        inningsId,
        reason: "Undo from scoring screen",
      }).unwrap();
      setOpenDialog(null);
      onDone();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <DialogBottom open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-1 mb-2">
        <div className="bg-(--color-six)/20 rounded-full p-6">
          <Info className="w-12 h-12 text-(--color-six)" />
        </div>
        <h3 className="font-display text-xl font-black uppercase tracking-[0.04em] text-(--color-navy) flex items-baseline gap-2">
          Undo?
        </h3>
        <p>Undo last ball?</p>
        {errorMessage && (
          <p className="text-center text-sm font-semibold text-red-600">
            {errorMessage === "SCORING_VERSION_CONFLICT"
              ? "Score changed elsewhere. Close this message and try again with the refreshed score."
              : "The last ball could not be undone. Please try again."}
          </p>
        )}
      </div>

      <div className="flex gap-6 mt-6">
        <Button onClick={onClose} size="sm" variant="secondary" fullWidth>
          Cancel
        </Button>
        <Button disabled={isUndoing} onClick={handleUndo} fullWidth>
          Yes, I&apos;m sure
        </Button>
      </div>
    </DialogBottom>
  );
}
