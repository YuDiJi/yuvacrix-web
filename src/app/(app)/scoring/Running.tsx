import { Settings } from "lucide-react";
import { cn } from "@/lib/cn";
import { DialogBottom } from "@/components/common/DialogBottom"; // Adjust import path
import { ExtraType } from "@/types/cricket/scoring";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/common/Button";

export function RunningSheet({
  open,
  onClose,
  onSelect,
  isRecording,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (additionalRuns: number) => void;
  isRecording: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [extraRuns, setExtraRuns] = useState("");

  useEffect(() => {
    if (!open) {
      inputRef.current?.blur();
      return;
    }

    const timer = setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 300);

    return () => clearTimeout(timer);
  }, [open]);

  return (
    <DialogBottom open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2 pb-5">
        <h3 className="font-display text-xl font-black uppercase tracking-[0.04em] text-(--color-navy) flex items-baseline gap-2">
          Runs Scored by running
        </h3>
      </div>
      <div className="flex items-center justify-center">
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
            "py-2 w-24 rounded-md border-2 border-(--color-sky)",
            "font-display font-black text-sm text-(--color-sky) text-center",
            "bg-(--color-bg-card) transition-all duration-150",
            "hover:bg-(--color-sky)/5 active:scale-95 active:bg-(--color-sky)/10",
            isRecording && "opacity-40 cursor-not-allowed",
          )}
        />
      </div>

      <div className="flex gap-6 mt-6">
        <Button onClick={onClose} size="sm" variant="secondary" fullWidth>
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSelect(Number(extraRuns) || 0);
          }}
          fullWidth
        >
          Ok
        </Button>
      </div>
    </DialogBottom>
  );
}
