import { CalendarPlus, Sparkles, X } from "lucide-react";

import { DialogBox } from "@/components/common/DialogBox";
import { cn } from "@/lib/cn";

type ScheduleMethodDialogProps = {
  open: boolean;
  onClose: () => void;
  onManualSelect: () => void;
  onAutoSelect: () => void;
};

export function ScheduleMethodDialog({
  open,
  onClose,
  onManualSelect,
  onAutoSelect,
}: ScheduleMethodDialogProps) {
  return (
    <DialogBox
      open={open}
      onClose={onClose}
      className="max-w-sm rounded-3xl bg-(--color-bg-card)"
    >
      <div className="border-b border-(--color-bg-border) px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-navy)">
              Schedule Matches
            </h2>

            <p className="mt-1 text-sm text-(--color-text-secondary)">
              Choose how you want to create tournament fixtures.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-(--color-text-muted) transition-colors hover:bg-(--color-bg-base)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <button
          type="button"
          onClick={onManualSelect}
          className={cn(
            "flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left",
            "border-(--color-bg-border) bg-(--color-bg-card)",
            "transition-all hover:border-(--color-brand)/40 hover:bg-(--color-bg-tint)",
          )}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--color-brand)/10 text-(--color-brand)">
            <CalendarPlus size={23} strokeWidth={2.3} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-navy)">
              Manual
            </h3>

            <p className="mt-1 text-sm leading-5 text-(--color-text-secondary)">
              Select two teams and configure one match at a time using your
              existing scheduling flow.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={onAutoSelect}
          className={cn(
            "relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border-2 p-4 text-left",
            "border-(--color-brand)/30 bg-(--color-brand)/5",
            "transition-all hover:border-(--color-brand) hover:bg-(--color-brand)/10",
          )}
        >
          {/* <span className="absolute right-3 top-3 rounded-full bg-(--color-brand) px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
            Recommended
          </span> */}

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--color-brand) text-white">
            <Sparkles size={23} strokeWidth={2.3} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-navy)">
              Auto Generate
            </h3>

            <p className="mt-1 text-sm leading-5 text-(--color-text-secondary)">
              Automatically create fixtures for all teams, a group, or selected
              teams.
            </p>
          </div>
        </button>
      </div>
    </DialogBox>
  );
}
