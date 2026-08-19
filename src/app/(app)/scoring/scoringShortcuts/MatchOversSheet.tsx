"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Minus, Plus } from "lucide-react";

import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";

import {
  MatchRulesConfiguration,
  UpdateMatchRulesRequest,
} from "@/types/matchRules";

type MatchOversSheetProps = {
  open: boolean;
  configuration: MatchRulesConfiguration | undefined;
  currentInningsNumber?: number;
  saving: boolean;
  onClose: () => void;
  onSave: (body: UpdateMatchRulesRequest) => Promise<void>;
};

export function MatchOversSheet({
  open,
  configuration,
  currentInningsNumber,
  saving,
  onClose,
  onSave,
}: MatchOversSheetProps) {
  const currentOvers =
    configuration?.resolvedSnapshot.format.oversPerInnings ?? 20;

  const [overs, setOvers] = useState(currentOvers);

  useEffect(() => {
    if (open) {
      setOvers(currentOvers);
    }
  }, [open, currentOvers]);

  const isSecondInnings = currentInningsNumber === 2;

  const handleSave = async () => {
    if (!configuration || isSecondInnings) return;

    await onSave({
      preset: configuration.preset,

      overrides: {
        ...configuration.overrides,

        format: {
          ...configuration.overrides.format,
          oversPerInnings: overs,
        },
      },
    });

    onClose();
  };

  return (
    <DialogBottom open={open} onClose={saving ? () => undefined : onClose}>
      <div className="pb-2">
        <div className="text-center">
          <h2 className="font-display text-xl font-black uppercase tracking-[0.04em] text-(--color-navy)">
            Change Match Overs
          </h2>

          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Set the maximum overs for each innings
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-base) p-5">
          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              disabled={saving || isSecondInnings || overs <= 1}
              onClick={() => setOvers((current) => Math.max(1, current - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-(--color-bg-border) bg-white text-(--color-navy) disabled:opacity-40"
            >
              <Minus size={18} />
            </button>

            <div className="min-w-24 text-center">
              <p className="font-display text-4xl font-black text-(--color-navy)">
                {overs}
              </p>

              <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-(--color-text-muted)">
                Overs
              </p>
            </div>

            <button
              type="button"
              disabled={saving || isSecondInnings}
              onClick={() => setOvers((current) => current + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-(--color-bg-border) bg-white text-(--color-navy) disabled:opacity-40"
            >
              <Plus size={18} />
            </button>
          </div>

          <input
            type="number"
            min={1}
            value={overs}
            disabled={saving || isSecondInnings}
            onChange={(event) => {
              const value = Number(event.target.value);

              if (Number.isFinite(value) && value >= 1) {
                setOvers(value);
              }
            }}
            className="mt-5 w-full rounded-xl border border-(--color-bg-border) bg-white px-4 py-3 text-center font-display text-lg font-black text-(--color-navy) outline-none focus:border-(--color-brand) disabled:opacity-50"
          />
        </div>

        {isSecondInnings && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-(--color-six)/10 p-3">
            <AlertCircle
              size={16}
              className="mt-0.5 shrink-0 text-(--color-six)"
            />

            <p className="text-xs leading-5 text-(--color-text-secondary)">
              Match overs cannot be changed after the second innings has
              started.
            </p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            fullWidth
            disabled={saving || isSecondInnings || overs === currentOvers}
            loading={saving}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </DialogBottom>
  );
}
