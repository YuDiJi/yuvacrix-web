import { Settings } from "lucide-react";
import { cn } from "@/lib/cn";
import { DialogBottom } from "@/components/common/DialogBottom"; // Adjust import path
import { ExtraType } from "@/types/cricket/scoring";
import { useState } from "react";
import { Button } from "@/components/common/Button";

const WIDE_RUN_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7];

export function WideBallSheet({
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
  const [extraInput, setExtraInput] = useState<boolean>(false);
  const [extraRuns, setExtraRuns] = useState("0");
  return (
    <DialogBottom open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2 pb-5">
        <h3 className="font-display text-xl font-black uppercase tracking-[0.04em] text-(--color-navy) flex items-baseline gap-2">
          Wide ball
          <span className="text-base font-bold text-(--color-text-muted) normal-case tracking-normal">
            WD=1
          </span>
        </h3>

        <button
          onClick={onClose}
          aria-label="Wide ball settings"
          className="flex h-9 w-9 items-center justify-center rounded-full text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-(--color-bg-base) transition-all"
        >
          <Settings size={19} />
        </button>
      </div>
      {/* 4-column pill grid — WD+0 … WD+6 then + */}
      {!extraInput && (
        <div className="grid grid-cols-4 gap-3">
          {WIDE_RUN_OPTIONS.map((runs) => (
            <button
              key={runs}
              onClick={() => onSelect("WIDE", runs)}
              disabled={isRecording}
              className={cn(
                "py-2 rounded-md border-2 border-(--color-sky)",
                "font-display font-black text-sm text-(--color-sky)",
                "bg-(--color-bg-card) transition-all duration-150",
                "hover:bg-(--color-sky)/5 active:scale-95 active:bg-(--color-sky)/10",
                isRecording && "opacity-40 cursor-not-allowed",
              )}
            >
              WD+{runs}
            </button>
          ))}

          {/* + button — custom additional runs */}
          {/* <button
            disabled={isRecording}
            onClick={() => setExtraInput(true)}
            className={cn(
              "py-2 rounded-md border-2 border-(--color-sky)",
              "font-display font-black text-2xl leading-none text-(--color-sky) flex items-center justify-center",
              "bg-(--color-bg-card) transition-all duration-150",
              "hover:bg-(--color-sky)/5 active:scale-95 active:bg-(--color-sky)/10",
              isRecording && "opacity-40 cursor-not-allowed",
            )}
            aria-label="Custom wide runs"
          >
            +
          </button> */}
        </div>
      )}
      {extraInput && (
        <div>
          <div className="flex gap-2 items-center justify-center">
            <p>WD +</p>
            <input
              min={0}
              max={7}
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

                if (num >= 0 && num <= 7) {
                  setExtraRuns(value);
                }
              }}
              className={cn(
                "py-2 w-12 rounded-md border-2 border-(--color-sky)",
                "font-display font-black text-sm text-(--color-sky) text-center",
                "bg-(--color-bg-card) transition-all duration-150",
                "hover:bg-(--color-sky)/5 active:scale-95 active:bg-(--color-sky)/10",
                isRecording && "opacity-40 cursor-not-allowed",
              )}
            />
            <p>= 1</p>
          </div>
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
                onSelect("WIDE", Number(extraRuns) || 0);
                setExtraInput(false);
              }}
              fullWidth
            >
              Ok
            </Button>
          </div>
        </div>
      )}
    </DialogBottom>
  );
}
