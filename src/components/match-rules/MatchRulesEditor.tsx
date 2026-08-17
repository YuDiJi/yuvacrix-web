"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";

import { Button } from "@/components/common/Button";
import {
  MatchRulesConfiguration,
  MatchRulesOverrides,
  MatchRulesPreset,
  MatchRulesPresetReference,
  MatchRulesSnapshot,
  UpdateMatchRulesRequest,
} from "@/types/matchRules";

type Props = {
  configuration: MatchRulesConfiguration;
  presets: MatchRulesPreset[];
  scopeLabel: string;
  locked?: boolean;
  confirmLabel: string;
  saving?: boolean;
  onValidate?: (
    body: UpdateMatchRulesRequest,
  ) => Promise<MatchRulesConfiguration>;
  onSave: (body: UpdateMatchRulesRequest) => Promise<void>;
};

type SectionProps = { title: string; children: React.ReactNode };

function Section({ title, children }: SectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
      <h2 className="border-b border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-3 font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em] text-(--color-navy)">
        {title}
      </h2>
      <div className="divide-y divide-(--color-bg-border)">{children}</div>
    </section>
  );
}

function RuleRow({
  label,
  description,
  overridden,
  onReset,
  children,
}: {
  label: string;
  description: string;
  overridden: boolean;
  onReset?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-(--color-text-primary)">
            {label}
          </p>
          <p className="mt-0.5 text-xs leading-4 text-(--color-text-muted)">
            {description}
          </p>
          <span className="mt-1 inline-block text-[10px] font-black uppercase tracking-wider text-(--color-brand)">
            {overridden ? "Changed here" : "Inherited"}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {overridden && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg p-2 text-(--color-text-muted) hover:bg-(--color-bg-tint)"
              aria-label={`Reset ${label} to inherited value`}
            >
              <RotateCcw size={14} />
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors disabled:opacity-60 ${checked ? "bg-(--color-brand)" : "bg-(--color-bg-border)"}`}
    >
      <span
        className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

function NumberInput({
  value,
  disabled,
  min = 0,
  onChange,
}: {
  value: number;
  disabled?: boolean;
  min?: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="number"
      min={min}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(Number(event.target.value))}
      className="w-20 rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-2 text-right text-sm font-bold text-(--color-navy) outline-none focus:border-(--color-brand) disabled:opacity-60"
    />
  );
}

export function MatchRulesEditor({
  configuration,
  presets,
  scopeLabel,
  locked = false,
  confirmLabel,
  saving = false,
  onValidate,
  onSave,
}: Props) {
  const [preset, setPreset] = useState(configuration.preset);
  const [overrides, setOverrides] = useState<MatchRulesOverrides>(
    configuration.overrides,
  );
  const [review, setReview] = useState<MatchRulesConfiguration | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreset(configuration.preset);
    setOverrides(configuration.overrides);
    setReview(null);
  }, [configuration]);

  const selectedPreset =
    presets.find(
      (item) => item.key === preset.key && item.version === preset.version,
    ) ?? presets[0];
  const baseSnapshot =
    preset.key === configuration.preset.key
      ? (configuration.inheritedSnapshot ?? configuration.resolvedSnapshot)
      : selectedPreset.snapshot;
  const snapshot = useMemo(
    () => applyOverrides(baseSnapshot, overrides),
    [baseSnapshot, overrides],
  );
  const disabled = locked || saving;

  function setPresetReference(next: MatchRulesPresetReference) {
    setPreset(next);
    setOverrides({});
    setReview(null);
  }

  function setFormat(values: MatchRulesOverrides["format"]) {
    setOverrides((current) => ({
      ...current,
      format: { ...current.format, ...values },
    }));
    setReview(null);
  }

  function setBowling(values: MatchRulesOverrides["bowling"]) {
    setOverrides((current) => ({
      ...current,
      bowling: { ...current.bowling, ...values },
    }));
    setReview(null);
  }

  function setBatting(values: MatchRulesOverrides["batting"]) {
    setOverrides((current) => ({
      ...current,
      batting: { ...current.batting, ...values },
    }));
    setReview(null);
  }

  function setExtras(
    type: "wide" | "noBall",
    values: Record<string, boolean | number>,
  ) {
    setOverrides((current) => ({
      ...current,
      extras: {
        ...current.extras,
        [type]: { ...current.extras?.[type], ...values },
      },
    }));
    setReview(null);
  }

  function setWagonWheel(values: MatchRulesOverrides["wagonWheel"]) {
    setOverrides((current) => ({
      ...current,
      wagonWheel: { ...current.wagonWheel, ...values },
    }));
    setReview(null);
  }

  function resetSection(section: keyof MatchRulesOverrides) {
    setOverrides((current) => {
      const next = { ...current };
      delete next[section];
      return next;
    });
    setReview(null);
  }

  const body = { preset, overrides };

  async function handleReview() {
    setError(null);
    try {
      const result = onValidate
        ? await onValidate(body)
        : ({
            ...configuration,
            preset,
            overrides,
            resolvedSnapshot: snapshot,
            issues: [],
          } as MatchRulesConfiguration);
      setReview(result);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function handleSave() {
    setError(null);
    try {
      await onSave(body);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  const powerplay = snapshot.powerplays[0];

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base) pb-28">
      <div className="space-y-3 p-4">
        <div className="rounded-2xl bg-(--color-navy) p-4 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/60">
            {scopeLabel}
          </p>
          <h1 className="mt-1 font-(family-name:--font-display) text-xl font-black uppercase">
            Match Rules
          </h1>
          <p className="mt-2 text-xs leading-5 text-white/70">
            International-style rules are inherited by default. Only changed
            fields are stored at this level.
          </p>
          {locked && (
            <p className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold">
              Rules were locked before toss and are now read-only.
            </p>
          )}
        </div>

        <Section title="Preset & inheritance">
          <div className="p-4">
            <label className="text-xs font-black uppercase tracking-wider text-(--color-text-muted)">
              Rule preset
            </label>
            <select
              value={`${preset.key}:${preset.version}`}
              disabled={disabled}
              onChange={(event) => {
                const [key, version] = event.target.value.split(":");
                setPresetReference({
                  key: key as MatchRulesPresetReference["key"],
                  version: Number(version),
                });
              }}
              className="mt-2 w-full rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-3 text-sm font-bold text-(--color-navy)"
            >
              {presets.map((item) => (
                <option
                  key={`${item.key}:${item.version}`}
                  value={`${item.key}:${item.version}`}
                >
                  {item.key.replaceAll("_", " ")} · v{item.version}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs leading-5 text-(--color-text-muted)">
              Sources: {snapshot.source.levels.join(" → ")}
            </p>
          </div>
        </Section>

        <Section title="Match format">
          <RuleRow
            label="Overs"
            description="Overs available in each innings."
            overridden={overrides.format?.oversPerInnings !== undefined}
            onReset={() => resetSection("format")}
          >
            <NumberInput
              disabled={disabled}
              min={1}
              value={snapshot.format.oversPerInnings}
              onChange={(value) => setFormat({ oversPerInnings: value })}
            />
          </RuleRow>
          <RuleRow
            label="Balls per over"
            description="Used by scoring, over completion and strike rotation."
            overridden={overrides.format?.ballsPerOver !== undefined}
            onReset={() => resetSection("format")}
          >
            <NumberInput
              disabled={disabled}
              min={1}
              value={snapshot.format.ballsPerOver}
              onChange={(value) => setFormat({ ballsPerOver: value })}
            />
          </RuleRow>
        </Section>

        <Section title="Bowling limits">
          <RuleRow
            label="Maximum overs per bowler"
            description="Hard limit checked while selecting and recording a bowler."
            overridden={overrides.bowling?.maxOversPerBowler !== undefined}
            onReset={() => resetSection("bowling")}
          >
            <NumberInput
              disabled={disabled}
              min={1}
              value={snapshot.bowling.maxOversPerBowler}
              onChange={(value) => setBowling({ maxOversPerBowler: value })}
            />
          </RuleRow>
          <RuleRow
            label="Minimum bowlers"
            description="Minimum distinct bowlers required for the innings."
            overridden={overrides.bowling?.minimumDistinctBowlers !== undefined}
            onReset={() => resetSection("bowling")}
          >
            <NumberInput
              disabled={disabled}
              min={1}
              value={snapshot.bowling.minimumDistinctBowlers ?? 1}
              onChange={(value) =>
                setBowling({ minimumDistinctBowlers: value })
              }
            />
          </RuleRow>
          <RuleRow
            label="Consecutive overs"
            description="Allow the same bowler in consecutive overs."
            overridden={
              overrides.bowling?.consecutiveOversAllowed !== undefined
            }
            onReset={() => resetSection("bowling")}
          >
            <Toggle
              disabled={disabled}
              checked={snapshot.bowling.consecutiveOversAllowed}
              onChange={(value) =>
                setBowling({ consecutiveOversAllowed: value })
              }
            />
          </RuleRow>
        </Section>

        <Section title="Wides & no-balls">
          <RuleRow
            label="Wide counts as ball"
            description="Count a wide as a legal delivery."
            overridden={
              overrides.extras?.wide?.countsAsLegalDelivery !== undefined
            }
            onReset={() => resetSection("extras")}
          >
            <Toggle
              disabled={disabled}
              checked={snapshot.extras.wide.countsAsLegalDelivery}
              onChange={(value) =>
                setExtras("wide", { countsAsLegalDelivery: value })
              }
            />
          </RuleRow>
          <RuleRow
            label="Wide runs"
            description="Automatic runs added for a wide."
            overridden={overrides.extras?.wide?.runs !== undefined}
            onReset={() => resetSection("extras")}
          >
            <NumberInput
              disabled={disabled}
              value={snapshot.extras.wide.runs}
              onChange={(value) => setExtras("wide", { runs: value })}
            />
          </RuleRow>
          <RuleRow
            label="No-ball counts as ball"
            description="Count a no-ball as a legal delivery."
            overridden={
              overrides.extras?.noBall?.countsAsLegalDelivery !== undefined
            }
            onReset={() => resetSection("extras")}
          >
            <Toggle
              disabled={disabled}
              checked={snapshot.extras.noBall.countsAsLegalDelivery}
              onChange={(value) =>
                setExtras("noBall", { countsAsLegalDelivery: value })
              }
            />
          </RuleRow>
          <RuleRow
            label="No-ball runs"
            description="Automatic runs added for a no-ball."
            overridden={overrides.extras?.noBall?.runs !== undefined}
            onReset={() => resetSection("extras")}
          >
            <NumberInput
              disabled={disabled}
              value={snapshot.extras.noBall.runs}
              onChange={(value) => setExtras("noBall", { runs: value })}
            />
          </RuleRow>
          <RuleRow
            label="Free hit"
            description="Apply a free hit after a no-ball."
            overridden={overrides.extras?.noBall?.freeHitEnabled !== undefined}
            onReset={() => resetSection("extras")}
          >
            <Toggle
              disabled={disabled}
              checked={snapshot.extras.noBall.freeHitEnabled}
              onChange={(value) =>
                setExtras("noBall", { freeHitEnabled: value })
              }
            />
          </RuleRow>
        </Section>

        <Section title="Batting & strike">
          <RuleRow
            label="Rotate on odd runs"
            description="Swap striker after odd completed runs."
            overridden={overrides.batting?.rotateStrikeOnOddRuns !== undefined}
            onReset={() => resetSection("batting")}
          >
            <Toggle
              disabled={disabled}
              checked={snapshot.batting.rotateStrikeOnOddRuns}
              onChange={(value) => setBatting({ rotateStrikeOnOddRuns: value })}
            />
          </RuleRow>
          <RuleRow
            label="Rotate after over"
            description="Swap striker when a legal over completes."
            overridden={overrides.batting?.rotateStrikeAtOverEnd !== undefined}
            onReset={() => resetSection("batting")}
          >
            <Toggle
              disabled={disabled}
              checked={snapshot.batting.rotateStrikeAtOverEnd}
              onChange={(value) => setBatting({ rotateStrikeAtOverEnd: value })}
            />
          </RuleRow>
          <RuleRow
            label="Last batter batting"
            description="Allow the final batter to continue without a partner."
            overridden={overrides.batting?.lastBatterAllowed !== undefined}
            onReset={() => resetSection("batting")}
          >
            <Toggle
              disabled={disabled}
              checked={snapshot.batting.lastBatterAllowed}
              onChange={(value) => setBatting({ lastBatterAllowed: value })}
            />
          </RuleRow>
        </Section>

        <Section title="Bowling target powerplay">
          <RuleRow
            label="Enable powerplay"
            description="Bowling captain may declare a predefined target over."
            overridden={overrides.powerplays !== undefined}
            onReset={() => resetSection("powerplays")}
          >
            <Toggle
              disabled={disabled}
              checked={powerplay?.enabled ?? false}
              onChange={(enabled) =>
                setOverrides((current) => ({
                  ...current,
                  powerplays: [
                    powerplay ? { ...powerplay, enabled } : defaultPowerplay(),
                  ],
                }))
              }
            />
          </RuleRow>
          {(powerplay?.enabled ?? false) && (
            <>
              <RuleRow
                label="Target runs"
                description="Batting team must reach this target in the selected over."
                overridden={overrides.powerplays !== undefined}
                onReset={() => resetSection("powerplays")}
              >
                <NumberInput
                  disabled={disabled}
                  value={powerplay.targetRuns}
                  onChange={(targetRuns) =>
                    setOverrides((current) => ({
                      ...current,
                      powerplays: [{ ...powerplay, targetRuns }],
                    }))
                  }
                />
              </RuleRow>
              <RuleRow
                label="Success bonus"
                description="Bonus runs added when the target is achieved."
                overridden={overrides.powerplays !== undefined}
                onReset={() => resetSection("powerplays")}
              >
                <NumberInput
                  disabled={disabled}
                  value={powerplay.successBonusRuns}
                  onChange={(successBonusRuns) =>
                    setOverrides((current) => ({
                      ...current,
                      powerplays: [{ ...powerplay, successBonusRuns }],
                    }))
                  }
                />
              </RuleRow>
            </>
          )}
        </Section>

        <Section title="Wagon wheel">
          <RuleRow
            label="Enable wagon wheel"
            description="Capture shot direction during scoring."
            overridden={overrides.wagonWheel?.enabled !== undefined}
            onReset={() => resetSection("wagonWheel")}
          >
            <Toggle
              disabled={disabled}
              checked={snapshot.wagonWheel.enabled}
              onChange={(enabled) =>
                setWagonWheel({
                  enabled,
                  requiredForBatRuns: enabled ? [4, 6] : [],
                  optionalForBatRuns: [],
                })
              }
            />
          </RuleRow>
          {snapshot.wagonWheel.enabled && (
            <div className="px-4 py-3 text-xs text-(--color-text-secondary)">
              Direction is required for:{" "}
              <strong>
                {snapshot.wagonWheel.requiredForBatRuns.join(", ") || "none"}
              </strong>
              . Boundary defaults are 4 and 6.
            </div>
          )}
        </Section>

        {error && (
          <div className="flex gap-2 rounded-2xl border border-(--color-live)/20 bg-(--color-live)/8 p-4 text-sm text-(--color-live)">
            <AlertCircle className="shrink-0" size={18} /> {error}
          </div>
        )}

        {review && (
          <div className="rounded-2xl border border-(--color-brand)/25 bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <div className="flex items-center gap-2 text-(--color-brand)">
              <CheckCircle2 size={18} />
              <h2 className="font-(family-name:--font-display) font-black uppercase">
                Confirm resolved rules
              </h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-(--color-text-secondary)">
              {review.summary ?? "Rules are valid and ready to save."}
            </p>
            {(review.issues?.length ?? 0) > 0 && (
              <ul className="mt-3 list-disc pl-5 text-xs text-(--color-live)">
                {review.issues?.map((issue) => (
                  <li key={`${issue.path}-${issue.code}`}>{issue.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {!locked && (
        <div className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[430px] -translate-x-1/2 gap-3 border-t border-(--color-bg-border) bg-(--color-bg-card) p-4">
          {!review ? (
            <Button fullWidth onClick={handleReview}>
              Review rules
            </Button>
          ) : (
            <Button
              fullWidth
              loading={saving}
              disabled={(review.issues?.length ?? 0) > 0}
              onClick={handleSave}
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function applyOverrides(
  snapshot: MatchRulesSnapshot,
  overrides: MatchRulesOverrides,
): MatchRulesSnapshot {
  return {
    ...snapshot,
    format: { ...snapshot.format, ...overrides.format },
    bowling: { ...snapshot.bowling, ...overrides.bowling },
    extras: {
      ...snapshot.extras,
      ...overrides.extras,
      wide: { ...snapshot.extras.wide, ...overrides.extras?.wide },
      noBall: { ...snapshot.extras.noBall, ...overrides.extras?.noBall },
    },
    batting: { ...snapshot.batting, ...overrides.batting },
    powerplays: overrides.powerplays ?? snapshot.powerplays,
    wagonWheel: { ...snapshot.wagonWheel, ...overrides.wagonWheel },
  };
}

function defaultPowerplay(): MatchRulesSnapshot["powerplays"][number] {
  return {
    type: "BOWLING_TARGET_POWERPLAY",
    version: 1,
    enabled: true,
    allowedSelections: 1,
    selectionAuthority: "BOWLING_CAPTAIN",
    targetRuns: 10,
    successOutcome: "KEEP_RUNS_PLUS_BONUS",
    successBonusRuns: 10,
    failureOutcome: "ZERO_OVER_RUNS",
    endOverWhenTargetReached: true,
  };
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error && "data" in error) {
    const data = (error as { data?: { message?: string | string[] } }).data;
    if (Array.isArray(data?.message)) return data.message.join(", ");
    if (data?.message) return data.message;
  }
  return "Unable to save match rules. Please review the values and try again.";
}
