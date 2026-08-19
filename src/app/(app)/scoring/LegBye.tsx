import { Settings } from "lucide-react";
import { cn } from "@/lib/cn";
import { DialogBottom } from "@/components/common/DialogBottom"; // Adjust import path
import { ExtraType } from "@/types/cricket/scoring";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/common/Button";

const LEG_BYE_RUN_OPTIONS = [1, 2, 3, 4];

export function LegByeSheet({
  open,
  onClose,
  onSelect,
  isRecording,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (type: ExtraType, additionalRuns: number) => void;
  isRecording: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [extraInput, setExtraInput] = useState<boolean>(false);
  const [extraRuns, setExtraRuns] = useState("");

  useEffect(() => {
    if (extraInput) {
      inputRef.current?.focus();
      inputRef.current?.select(); // optional: selects existing value
    }
  }, [extraInput]);
  return (
    <DialogBottom open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2 pb-5">
        <h3 className="font-display text-xl font-black uppercase tracking-[0.04em] text-(--color-navy) flex items-baseline gap-2">
          Leg Bye Runs
        </h3>
      </div>
      {/* 4-column pill grid — LEG_BYE+0 … LEG_BYE+6 then + */}

      <div className="grid grid-cols-4 gap-3">
        {LEG_BYE_RUN_OPTIONS.map((runs) => (
          <button
            key={runs}
            onClick={() => onSelect("LEG_BYE", runs)}
            disabled={isRecording}
            className={cn(
              "py-2 rounded-md border-2 border-(--color-sky)",
              "font-display font-black text-sm text-(--color-sky)",
              "bg-(--color-bg-card) transition-all duration-150",
              "hover:bg-(--color-sky)/5 active:scale-95 active:bg-(--color-sky)/10",
              isRecording && "opacity-40 cursor-not-allowed",
            )}
          >
            {runs}
          </button>
        ))}

        {/* + button — custom additional runs */}
        <button
          disabled={isRecording}
          onClick={() => setExtraInput(true)}
          className={cn(
            "py-2 rounded-md border-2 border-(--color-sky)",
            "font-display font-black text-2xl leading-none text-(--color-sky) flex items-center justify-center",
            "bg-(--color-bg-card) transition-all duration-150",
            "hover:bg-(--color-sky)/5 active:scale-95 active:bg-(--color-sky)/10",
            isRecording && "opacity-40 cursor-not-allowed",
          )}
          aria-label="Custom LEG_BYE runs"
        >
          +
        </button>
        {extraInput && (
          <input
            min={0}
            max={7}
            ref={inputRef}
            type="number"
            value={extraRuns}
            onChange={(e) => {
              const value = e.target.value;

              // Allow clearing the input temporarily
              if (value === "") {
                setExtraRuns("");
                return;
              }

              const num = Number(value);

              if (num >= 1 && num <= 7) {
                setExtraRuns(value);
              }
            }}
            className={cn(
              "py-2 w-16 rounded-md border-2 border-(--color-sky)",
              "font-display font-black text-sm text-(--color-sky) text-center",
              "bg-(--color-bg-card) transition-all duration-150",
              "hover:bg-(--color-sky)/5 active:scale-95 active:bg-(--color-sky)/10",
              isRecording && "opacity-40 cursor-not-allowed",
            )}
          />
        )}
      </div>

      {extraInput && (
        <div className="flex gap-6 mt-6">
          <Button
            onClick={() => setExtraInput(false)}
            size="sm"
            variant="secondary"
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSelect("LEG_BYE", Number(extraRuns) || 0);
              setExtraInput(false);
            }}
            fullWidth
          >
            Ok
          </Button>
        </div>
      )}
    </DialogBottom>
  );
}
