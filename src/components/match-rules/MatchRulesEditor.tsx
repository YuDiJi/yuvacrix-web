"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  RotateCcw,
  Settings2,
} from "lucide-react";

import { Button } from "@/components/common/Button";

import {
  MatchRulesConfiguration,
  MatchRulesOverrides,
  MatchRulesPreset,
  MatchRulesPresetReference,
  MatchRulesSnapshot,
  MatchRulesValidationResult,
  UpdateMatchRulesRequest,
} from "@/types/matchRules";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
  configuration: MatchRulesConfiguration;
  presets: MatchRulesPreset[];

  scopeLabel?: string;

  locked?: boolean;
  saving?: boolean;

  confirmLabel: string;

  onValidate?: (
    body: UpdateMatchRulesRequest,
  ) => Promise<MatchRulesValidationResult>;

  onSave: (body: UpdateMatchRulesRequest) => Promise<void>;
};

type SectionKey = "format" | "bowling" | "extras" | "batting" | "wagonWheel";

// -----------------------------------------------------------------------------
// Preset labels
// -----------------------------------------------------------------------------

const PRESET_LABELS: Partial<Record<MatchRulesPresetReference["key"], string>> =
  {
    T20_STANDARD: "T20 Standard",
    ODI_STANDARD: "ODI Standard",
    LIMITED_OVERS_STANDARD: "Limited Overs",
    BOX_TURF_STANDARD: "Box / Turf",
    CUSTOM: "Custom",
  };

// -----------------------------------------------------------------------------
// Main editor
// -----------------------------------------------------------------------------

export function MatchRulesEditor({
  configuration,
  presets,
  scopeLabel = "This match",
  locked = false,
  saving = false,
  confirmLabel,
  onValidate,
  onSave,
}: Props) {
  const [preset, setPreset] = useState<MatchRulesPresetReference>(
    configuration.preset,
  );

  const [overrides, setOverrides] = useState<MatchRulesOverrides>(() =>
    sanitizeOverrides(configuration.overrides),
  );

  const [openSection, setOpenSection] = useState<SectionKey | null>("format");

  const [error, setError] = useState<string | null>(null);

  const [validationIssues, setValidationIssues] = useState<
    NonNullable<MatchRulesConfiguration["issues"]>
  >([]);

  // ---------------------------------------------------------------------------
  // Sync when API data changes
  // ---------------------------------------------------------------------------

  useEffect(() => {
    setPreset(configuration.preset);
    setOverrides(sanitizeOverrides(configuration.overrides));
    setValidationIssues([]);
    setError(null);
  }, [configuration]);

  // ---------------------------------------------------------------------------
  // Resolve selected preset
  // ---------------------------------------------------------------------------

  const selectedPreset = useMemo(
    () =>
      presets.find(
        (item) => item.key === preset.key && item.version === preset.version,
      ),
    [preset, presets],
  );

  /*
   * IMPORTANT:
   *
   * The new API documentation does not return inheritedSnapshot.
   *
   * Preset snapshots are our inheritance/base layer.
   */
  const baseSnapshot =
    selectedPreset?.snapshot ?? configuration.resolvedSnapshot;

  const snapshot = useMemo(
    () => applyOverrides(baseSnapshot, overrides),
    [baseSnapshot, overrides],
  );

  const body = useMemo<UpdateMatchRulesRequest>(
    () => ({
      preset,
      overrides,
    }),
    [preset, overrides],
  );

  const disabled = locked || saving;

  const customizedSections = useMemo(
    () =>
      (
        ["format", "bowling", "extras", "batting", "wagonWheel"] as SectionKey[]
      ).filter((section) => hasSectionOverrides(overrides, section)).length,
    [overrides],
  );

  // ---------------------------------------------------------------------------
  // Updates
  // ---------------------------------------------------------------------------

  function markChanged() {
    setValidationIssues([]);
    setError(null);
  }

  function setPresetReference(next: MatchRulesPresetReference) {
    setPreset(next);

    /*
     * Selecting another preset should start clean.
     * The preset becomes the new inherited/base rules.
     */
    setOverrides({});

    setValidationIssues([]);
    setError(null);
    setOpenSection("format");
  }

  function setFormat(values: MatchRulesOverrides["format"]) {
    setOverrides((current) => ({
      ...current,
      format: {
        ...current.format,
        ...values,
      },
    }));

    markChanged();
  }

  function setBowling(values: MatchRulesOverrides["bowling"]) {
    setOverrides((current) => ({
      ...current,
      bowling: {
        ...current.bowling,
        ...values,
      },
    }));

    markChanged();
  }

  function setBatting(values: MatchRulesOverrides["batting"]) {
    setOverrides((current) => ({
      ...current,
      batting: {
        ...current.batting,
        ...values,
      },
    }));

    markChanged();
  }

  function setExtras(
    values: Partial<NonNullable<MatchRulesOverrides["extras"]>>,
  ) {
    setOverrides((current) => ({
      ...current,
      extras: {
        ...current.extras,
        ...values,
      },
    }));

    markChanged();
  }

  function setExtraRule(
    type: "wide" | "noBall",
    values: Record<string, boolean | number>,
  ) {
    setOverrides((current) => ({
      ...current,
      extras: {
        ...current.extras,

        [type]: {
          ...current.extras?.[type],
          ...values,
        },
      },
    }));

    markChanged();
  }

  function setWagonWheel(values: MatchRulesOverrides["wagonWheel"]) {
    setOverrides((current) => ({
      ...current,
      wagonWheel: {
        ...current.wagonWheel,
        ...values,
      },
    }));

    markChanged();
  }

  function resetSection(section: SectionKey) {
    setOverrides((current) => {
      const next = {
        ...current,
      };

      delete next[section];

      return next;
    });

    markChanged();
  }

  // ---------------------------------------------------------------------------
  // Wagon-wheel run selection
  // ---------------------------------------------------------------------------

  function toggleRequiredWagonRun(run: number) {
    const required = snapshot.wagonWheel.requiredForBatRuns ?? [];
    const optional = snapshot.wagonWheel.optionalForBatRuns ?? [];

    const exists = required.includes(run);

    const nextRequired = exists
      ? required.filter((item) => item !== run)
      : [...required, run].sort((a, b) => a - b);

    /*
     * A run cannot be both required and optional.
     */
    const nextOptional = optional.filter((item) => item !== run);

    setWagonWheel({
      requiredForBatRuns: nextRequired,
      optionalForBatRuns: nextOptional,
    });
  }

  function toggleOptionalWagonRun(run: number) {
    const required = snapshot.wagonWheel.requiredForBatRuns ?? [];
    const optional = snapshot.wagonWheel.optionalForBatRuns ?? [];

    const exists = optional.includes(run);

    const nextOptional = exists
      ? optional.filter((item) => item !== run)
      : [...optional, run].sort((a, b) => a - b);

    /*
     * A run cannot be both required and optional.
     */
    const nextRequired = required.filter((item) => item !== run);

    setWagonWheel({
      requiredForBatRuns: nextRequired,
      optionalForBatRuns: nextOptional,
    });
  }

  // ---------------------------------------------------------------------------
  // Validate + save
  // ---------------------------------------------------------------------------

  async function handleConfirm() {
    setError(null);
    setValidationIssues([]);

    try {
      if (onValidate) {
        const validated = await onValidate(body);

        const issues = validated.issues ?? [];

        if (issues.length > 0) {
          setValidationIssues(issues);
          return;
        }
      }

      await onSave(body);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-(--color-bg-base) rounded-t-xl">
      {/* ------------------------------------------------------------------ */}
      {/* Scroll area                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
        {/* Header */}

        <div className="bg-(--color-navy) px-4 pb-5 pt-4 text-white">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Settings2 size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
                {scopeLabel}
              </p>

              <h1 className="mt-0.5 font-(family-name:--font-display) text-[22px] font-black uppercase leading-tight">
                Match Rules
              </h1>

              <p className="mt-1.5 text-xs leading-5 text-white/65">
                Start with a preset and change only the rules you need.
              </p>
            </div>
          </div>

          {/* Quick summary */}

          <div className="mt-4 grid grid-cols-3 gap-2">
            <SummaryStat
              value={String(snapshot.format.oversPerInnings)}
              label="Overs"
            />

            <SummaryStat
              value={String(snapshot.format.ballsPerOver)}
              label="Balls / over"
            />

            <SummaryStat
              value={String(snapshot.bowling.maxOversPerBowler)}
              label="Max / bowler"
            />
          </div>
        </div>

        <div className="space-y-3 p-4">
          {/* -------------------------------------------------------------- */}
          {/* Locked state                                                   */}
          {/* -------------------------------------------------------------- */}

          {locked && (
            <div className="flex gap-3 rounded-2xl border border-(--color-six)/20 bg-(--color-six)/8 p-3.5">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-(--color-six)"
              />

              <div>
                <p className="text-sm font-bold text-(--color-text-primary)">
                  Rules are locked
                </p>

                <p className="mt-0.5 text-xs leading-5 text-(--color-text-secondary)">
                  This match currently does not allow rule changes.
                </p>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------- */}
          {/* Preset                                                        */}
          {/* -------------------------------------------------------------- */}

          <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-(--color-text-primary)">
                  Match format
                </p>

                <p className="mt-0.5 text-xs text-(--color-text-muted)">
                  Choose the closest preset first.
                </p>
              </div>

              {customizedSections > 0 && (
                <span className="shrink-0 rounded-full bg-(--color-brand)/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-(--color-brand)">
                  {customizedSections} custom
                </span>
              )}
            </div>

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
              className="mt-3 w-full rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3.5 py-3 text-sm font-bold text-(--color-navy) outline-none focus:border-(--color-brand) disabled:opacity-60"
            >
              {presets.map((item) => (
                <option
                  key={`${item.key}:${item.version}`}
                  value={`${item.key}:${item.version}`}
                >
                  {PRESET_LABELS[item.key] ?? item.key.replaceAll("_", " ")}
                  {" · "}v{item.version}
                </option>
              ))}
            </select>

            <div className="mt-3 flex items-start gap-2 rounded-xl bg-(--color-bg-tint) px-3 py-2.5">
              <CheckCircle2
                size={15}
                className="mt-0.5 shrink-0 text-(--color-brand)"
              />

              <p className="text-xs leading-5 text-(--color-text-secondary)">
                Preset rules are inherited automatically. Only your custom
                changes are saved as match overrides.
              </p>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Match format                                                   */}
          {/* -------------------------------------------------------------- */}

          <RuleSection
            title="Match format"
            subtitle={`${snapshot.format.oversPerInnings} overs · ${snapshot.format.ballsPerOver} balls per over`}
            open={openSection === "format"}
            customized={hasSectionOverrides(overrides, "format")}
            disabled={disabled}
            onToggle={() =>
              setOpenSection((current) =>
                current === "format" ? null : "format",
              )
            }
            onReset={() => resetSection("format")}
          >
            <RuleRow
              label="Overs per innings"
              description="Maximum overs available to each batting team."
            >
              <NumberInput
                min={1}
                value={snapshot.format.oversPerInnings}
                disabled={disabled}
                onChange={(oversPerInnings) =>
                  setFormat({
                    oversPerInnings,
                  })
                }
              />
            </RuleRow>

            <RuleRow
              label="Balls per over"
              description="Number of legal deliveries required to complete an over."
            >
              <NumberInput
                min={1}
                value={snapshot.format.ballsPerOver}
                disabled={disabled}
                onChange={(ballsPerOver) =>
                  setFormat({
                    ballsPerOver,
                  })
                }
              />
            </RuleRow>

            <RuleRow
              label="Playing players"
              description="Optional fixed number of playing players. Leave Auto when lineup controls this."
            >
              <NullableNumberInput
                min={1}
                value={snapshot.format.playingPlayers}
                disabled={disabled}
                onChange={(playingPlayers) =>
                  setFormat({
                    playingPlayers,
                  })
                }
              />
            </RuleRow>

            <RuleRow
              label="Wickets to end innings"
              description="Optional custom wicket limit before the innings ends."
            >
              <NullableNumberInput
                min={1}
                value={snapshot.format.wicketsToEndInnings}
                disabled={disabled}
                onChange={(wicketsToEndInnings) =>
                  setFormat({
                    wicketsToEndInnings,
                  })
                }
              />
            </RuleRow>
          </RuleSection>

          {/* -------------------------------------------------------------- */}
          {/* Bowling                                                        */}
          {/* -------------------------------------------------------------- */}

          <RuleSection
            title="Bowling"
            subtitle={`Max ${snapshot.bowling.maxOversPerBowler} overs per bowler`}
            open={openSection === "bowling"}
            customized={hasSectionOverrides(overrides, "bowling")}
            disabled={disabled}
            onToggle={() =>
              setOpenSection((current) =>
                current === "bowling" ? null : "bowling",
              )
            }
            onReset={() => resetSection("bowling")}
          >
            <RuleRow
              label="Max overs per bowler"
              description="Maximum overs one bowler can deliver."
            >
              <NumberInput
                min={1}
                value={snapshot.bowling.maxOversPerBowler}
                disabled={disabled}
                onChange={(maxOversPerBowler) =>
                  setBowling({
                    maxOversPerBowler,
                  })
                }
              />
            </RuleRow>

            <RuleRow
              label="Consecutive overs"
              description="Allow the same bowler to bowl consecutive overs."
            >
              <Toggle
                checked={snapshot.bowling.consecutiveOversAllowed}
                disabled={disabled}
                onChange={(consecutiveOversAllowed) =>
                  setBowling({
                    consecutiveOversAllowed,
                  })
                }
              />
            </RuleRow>

            <RuleRow
              label="Minimum bowlers"
              description="Minimum number of distinct bowlers required."
            >
              <NullableNumberInput
                min={1}
                value={snapshot.bowling.minimumDistinctBowlers}
                disabled={disabled}
                onChange={(minimumDistinctBowlers) =>
                  setBowling({
                    minimumDistinctBowlers,
                  })
                }
              />
            </RuleRow>

            <RuleRow
              label="Additional-over bowler limit"
              description="Optional additional bowling restriction. Leave Auto to use preset behavior."
            >
              <NullableNumberInput
                min={0}
                value={snapshot.bowling.additionalOverBowlerLimit}
                disabled={disabled}
                onChange={(additionalOverBowlerLimit) =>
                  setBowling({
                    additionalOverBowlerLimit,
                  })
                }
              />
            </RuleRow>
          </RuleSection>

          {/* -------------------------------------------------------------- */}
          {/* Extras                                                         */}
          {/* -------------------------------------------------------------- */}

          <RuleSection
            title="Extras"
            subtitle="Wides, no-balls, byes & leg byes"
            open={openSection === "extras"}
            customized={hasSectionOverrides(overrides, "extras")}
            disabled={disabled}
            onToggle={() =>
              setOpenSection((current) =>
                current === "extras" ? null : "extras",
              )
            }
            onReset={() => resetSection("extras")}
          >
            <RuleGroupLabel>Wides</RuleGroupLabel>

            <RuleRow
              label="Allow wides"
              description="Enable wide-ball scoring for this match."
            >
              <Toggle
                checked={snapshot.extras.wide.enabled}
                disabled={disabled}
                onChange={(enabled) =>
                  setExtraRule("wide", {
                    enabled,
                  })
                }
              />
            </RuleRow>

            <div
              className={
                snapshot.extras.wide.enabled
                  ? ""
                  : "pointer-events-none opacity-45"
              }
            >
              <RuleRow
                label="Wide run value"
                description="Automatic runs awarded when a wide is called."
              >
                <NumberInput
                  min={0}
                  value={snapshot.extras.wide.runs}
                  disabled={disabled || !snapshot.extras.wide.enabled}
                  onChange={(runs) =>
                    setExtraRule("wide", {
                      runs,
                    })
                  }
                />
              </RuleRow>

              <RuleRow
                label="Wide counts as legal ball"
                description="Whether a wide contributes to the legal delivery count."
              >
                <Toggle
                  checked={snapshot.extras.wide.countsAsLegalDelivery}
                  disabled={disabled || !snapshot.extras.wide.enabled}
                  onChange={(countsAsLegalDelivery) =>
                    setExtraRule("wide", {
                      countsAsLegalDelivery,
                    })
                  }
                />
              </RuleRow>
            </div>

            <RuleGroupLabel>No-balls</RuleGroupLabel>

            <RuleRow
              label="Allow no-balls"
              description="Enable no-ball scoring for this match."
            >
              <Toggle
                checked={snapshot.extras.noBall.enabled}
                disabled={disabled}
                onChange={(enabled) =>
                  setExtraRule("noBall", {
                    enabled,
                  })
                }
              />
            </RuleRow>

            <div
              className={
                snapshot.extras.noBall.enabled
                  ? ""
                  : "pointer-events-none opacity-45"
              }
            >
              <RuleRow
                label="No-ball run value"
                description="Automatic runs awarded when a no-ball is called."
              >
                <NumberInput
                  min={0}
                  value={snapshot.extras.noBall.runs}
                  disabled={disabled || !snapshot.extras.noBall.enabled}
                  onChange={(runs) =>
                    setExtraRule("noBall", {
                      runs,
                    })
                  }
                />
              </RuleRow>

              <RuleRow
                label="No-ball counts as legal ball"
                description="Whether a no-ball contributes to the legal delivery count."
              >
                <Toggle
                  checked={snapshot.extras.noBall.countsAsLegalDelivery}
                  disabled={disabled || !snapshot.extras.noBall.enabled}
                  onChange={(countsAsLegalDelivery) =>
                    setExtraRule("noBall", {
                      countsAsLegalDelivery,
                    })
                  }
                />
              </RuleRow>

              <RuleRow
                label="Free hit"
                description="Award a free hit after a no-ball."
              >
                <Toggle
                  checked={snapshot.extras.noBall.freeHitEnabled}
                  disabled={disabled || !snapshot.extras.noBall.enabled}
                  onChange={(freeHitEnabled) =>
                    setExtraRule("noBall", {
                      freeHitEnabled,
                    })
                  }
                />
              </RuleRow>
            </div>

            <RuleGroupLabel>Other extras</RuleGroupLabel>

            <RuleRow
              label="Byes"
              description="Allow runs to be recorded as byes."
            >
              <Toggle
                checked={snapshot.extras.byesEnabled}
                disabled={disabled}
                onChange={(byesEnabled) =>
                  setExtras({
                    byesEnabled,
                  })
                }
              />
            </RuleRow>

            <RuleRow
              label="Leg byes"
              description="Allow runs to be recorded as leg byes."
            >
              <Toggle
                checked={snapshot.extras.legByesEnabled}
                disabled={disabled}
                onChange={(legByesEnabled) =>
                  setExtras({
                    legByesEnabled,
                  })
                }
              />
            </RuleRow>
          </RuleSection>

          {/* -------------------------------------------------------------- */}
          {/* Batting                                                        */}
          {/* -------------------------------------------------------------- */}

          <RuleSection
            title="Batting & strike"
            subtitle="Strike rotation and batter rules"
            open={openSection === "batting"}
            customized={hasSectionOverrides(overrides, "batting")}
            disabled={disabled}
            onToggle={() =>
              setOpenSection((current) =>
                current === "batting" ? null : "batting",
              )
            }
            onReset={() => resetSection("batting")}
          >
            <RuleRow
              label="Rotate strike on odd runs"
              description="Swap striker after odd completed runs."
            >
              <Toggle
                checked={snapshot.batting.rotateStrikeOnOddRuns}
                disabled={disabled}
                onChange={(rotateStrikeOnOddRuns) =>
                  setBatting({
                    rotateStrikeOnOddRuns,
                  })
                }
              />
            </RuleRow>

            <RuleRow
              label="Rotate strike after over"
              description="Swap striker after an over is completed."
            >
              <Toggle
                checked={snapshot.batting.rotateStrikeAtOverEnd}
                disabled={disabled}
                onChange={(rotateStrikeAtOverEnd) =>
                  setBatting({
                    rotateStrikeAtOverEnd,
                  })
                }
              />
            </RuleRow>

            <div className="px-4 py-3.5">
              <p className="text-sm font-bold text-(--color-text-primary)">
                Catch strike rule
              </p>

              <p className="mt-0.5 text-xs leading-5 text-(--color-text-muted)">
                Decide who takes strike after a caught dismissal.
              </p>

              <select
                value={snapshot.batting.catchStrikePolicy}
                disabled={disabled}
                onChange={(event) =>
                  setBatting({
                    catchStrikePolicy: event.target
                      .value as MatchRulesSnapshot["batting"]["catchStrikePolicy"],
                  })
                }
                className="mt-3 w-full rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3.5 py-3 text-sm font-bold text-(--color-navy) outline-none focus:border-(--color-brand) disabled:opacity-60"
              >
                <option value="NEW_BATTER_ON_STRIKE">
                  New batter takes strike
                </option>

                <option value="FOLLOW_COMPLETED_RUNS">
                  Follow completed runs
                </option>
              </select>
            </div>

            <RuleRow
              label="Last batter allowed"
              description="Allow the final batter to continue without a partner."
            >
              <Toggle
                checked={snapshot.batting.lastBatterAllowed}
                disabled={disabled}
                onChange={(lastBatterAllowed) =>
                  setBatting({
                    lastBatterAllowed,
                  })
                }
              />
            </RuleRow>

            <RuleRow
              label="Retired batter can return"
              description="Allow a retired batter to return later in the innings."
            >
              <Toggle
                checked={snapshot.batting.retiredBatterCanReturn}
                disabled={disabled}
                onChange={(retiredBatterCanReturn) =>
                  setBatting({
                    retiredBatterCanReturn,
                  })
                }
              />
            </RuleRow>
          </RuleSection>

          {/* -------------------------------------------------------------- */}
          {/* Wagon wheel                                                    */}
          {/* -------------------------------------------------------------- */}

          <RuleSection
            title="Wagon wheel"
            subtitle={
              snapshot.wagonWheel.enabled
                ? "Shot direction enabled"
                : "Shot direction disabled"
            }
            open={openSection === "wagonWheel"}
            customized={hasSectionOverrides(overrides, "wagonWheel")}
            disabled={disabled}
            onToggle={() =>
              setOpenSection((current) =>
                current === "wagonWheel" ? null : "wagonWheel",
              )
            }
            onReset={() => resetSection("wagonWheel")}
          >
            <RuleRow
              label="Enable wagon wheel"
              description="Capture shot direction while scoring."
            >
              <Toggle
                checked={snapshot.wagonWheel.enabled}
                disabled={disabled}
                onChange={(enabled) => {
                  if (
                    enabled &&
                    snapshot.wagonWheel.requiredForBatRuns.length === 0 &&
                    snapshot.wagonWheel.optionalForBatRuns.length === 0
                  ) {
                    setWagonWheel({
                      enabled: true,
                      requiredForBatRuns: [4, 6],
                      optionalForBatRuns: [1, 2, 3],
                      inputMode: "FIELD_ZONE",
                    });

                    return;
                  }

                  setWagonWheel({
                    enabled,
                  });
                }}
              />
            </RuleRow>

            {snapshot.wagonWheel.enabled && (
              <>
                <div className="border-t border-(--color-bg-border) px-4 py-4">
                  <p className="text-sm font-bold text-(--color-text-primary)">
                    Required for runs
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-(--color-text-muted)">
                    Scorer must select a shot direction for these bat runs.
                  </p>

                  <div className="mt-3">
                    <RunSelector
                      selected={snapshot.wagonWheel.requiredForBatRuns}
                      disabled={disabled}
                      onToggle={toggleRequiredWagonRun}
                    />
                  </div>
                </div>

                <div className="border-t border-(--color-bg-border) px-4 py-4">
                  <p className="text-sm font-bold text-(--color-text-primary)">
                    Optional for runs
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-(--color-text-muted)">
                    Shot direction can be added, but is not required.
                  </p>

                  <div className="mt-3">
                    <RunSelector
                      selected={snapshot.wagonWheel.optionalForBatRuns}
                      disabled={disabled}
                      onToggle={toggleOptionalWagonRun}
                    />
                  </div>
                </div>

                <div className="border-t border-(--color-bg-border) px-4 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-(--color-text-primary)">
                        Direction input
                      </p>

                      <p className="mt-0.5 text-xs text-(--color-text-muted)">
                        Wagon-wheel capture method
                      </p>
                    </div>

                    <span className="rounded-lg bg-(--color-bg-tint) px-3 py-2 text-xs font-black text-(--color-brand)">
                      Field zones
                    </span>
                  </div>
                </div>
              </>
            )}
          </RuleSection>

          {/* -------------------------------------------------------------- */}
          {/* Validation errors                                              */}
          {/* -------------------------------------------------------------- */}

          {validationIssues.length > 0 && (
            <div className="rounded-2xl border border-(--color-live)/20 bg-(--color-live)/6 p-4">
              <div className="flex items-center gap-2 text-(--color-live)">
                <AlertCircle size={18} />

                <p className="text-sm font-black">Review these rules</p>
              </div>

              <div className="mt-3 space-y-2">
                {validationIssues.map((issue) => (
                  <div
                    key={`${issue.path}-${issue.code}`}
                    className="rounded-xl bg-white/70 px-3 py-2.5"
                  >
                    <p className="text-xs font-bold text-(--color-live)">
                      {issue.message}
                    </p>

                    {issue.path && (
                      <p className="mt-0.5 text-[10px] text-(--color-text-muted)">
                        {issue.path}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request error */}

          {error && (
            <div className="flex gap-2.5 rounded-2xl border border-(--color-live)/20 bg-(--color-live)/6 p-4">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-(--color-live)"
              />

              <p className="text-sm leading-5 text-(--color-live)">{error}</p>
            </div>
          )}

          {/* Some breathing room before footer */}

          <div className="h-1" />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Sticky footer                                                       */}
      {/* ------------------------------------------------------------------ */}

      {!locked && (
        <div className="shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(13,27,62,0.06)]">
          <div className="mb-2 flex items-center justify-center gap-1.5">
            <CheckCircle2 size={13} className="text-(--color-brand)" />

            <p className="text-[11px] text-(--color-text-muted)">
              Rules will be validated before saving
            </p>
          </div>

          <Button
            fullWidth
            loading={saving}
            disabled={saving}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Rule section
// -----------------------------------------------------------------------------

function RuleSection({
  title,
  subtitle,
  open,
  customized,
  disabled,
  onToggle,
  onReset,
  children,
}: {
  title: string;
  subtitle: string;
  open: boolean;
  customized: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onReset: () => void;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
      <div className="flex items-center gap-1 px-2">
        {/* Main section toggle */}
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 px-2 py-4 text-left"
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              customized
                ? "bg-(--color-brand)/10 text-(--color-brand)"
                : "bg-(--color-bg-tint) text-(--color-text-secondary)"
            }`}
          >
            <Settings2 size={16} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-(--color-text-primary)">
                {title}
              </p>

              {customized && (
                <span className="rounded-full bg-(--color-brand)/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-(--color-brand)">
                  Custom
                </span>
              )}
            </div>

            <p className="mt-0.5 truncate text-xs text-(--color-text-muted)">
              {subtitle}
            </p>
          </div>
        </button>

        {/* Reset */}
        {customized && !disabled && (
          <button
            type="button"
            onClick={onReset}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-(--color-text-muted) transition active:bg-(--color-bg-tint)"
            aria-label={`Reset ${title}`}
          >
            <RotateCcw size={14} />
          </button>
        )}

        {/* Expand / collapse */}
        <button
          type="button"
          onClick={onToggle}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-(--color-text-muted) transition active:bg-(--color-bg-tint)"
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
        >
          <ChevronDown
            size={18}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-(--color-bg-border)">{children}</div>
      )}
    </section>
  );
}

// -----------------------------------------------------------------------------
// Rule row
// -----------------------------------------------------------------------------

function RuleRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-(--color-bg-border) px-4 py-3.5 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-(--color-text-primary)">{label}</p>

        <p className="mt-0.5 text-xs leading-5 text-(--color-text-muted)">
          {description}
        </p>
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Rule group label
// -----------------------------------------------------------------------------

function RuleGroupLabel({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-2">
      <p className="text-[10px] font-black uppercase tracking-widest text-(--color-text-muted)">
        {children}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Summary stat
// -----------------------------------------------------------------------------

function SummaryStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/8 px-2 py-2.5 text-center">
      <p className="font-(family-name:--font-display) text-lg font-black leading-none">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-white/50">
        {label}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Toggle
// -----------------------------------------------------------------------------

function Toggle({
  checked,
  disabled = false,
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
      className={`relative h-7 w-12 rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-(--color-brand)" : "bg-(--color-bg-border)"
      }`}
    >
      <span
        className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

// -----------------------------------------------------------------------------
// Number input
// -----------------------------------------------------------------------------

function NumberInput({
  value,
  disabled = false,
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
      inputMode="numeric"
      min={min}
      value={value}
      disabled={disabled}
      onChange={(event) => {
        const next = Number(event.target.value);

        if (!Number.isNaN(next)) {
          onChange(next);
        }
      }}
      className="h-10 w-20 rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-2.5 text-center text-sm font-black text-(--color-navy) outline-none focus:border-(--color-brand) disabled:opacity-50"
    />
  );
}

// -----------------------------------------------------------------------------
// Nullable number input
// -----------------------------------------------------------------------------

function NullableNumberInput({
  value,
  disabled = false,
  min = 0,
  onChange,
}: {
  value: number | null;
  disabled?: boolean;
  min?: number;
  onChange: (value: number | null) => void;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={min}
      value={value ?? ""}
      placeholder="Auto"
      disabled={disabled}
      onChange={(event) => {
        const raw = event.target.value;

        if (raw === "") {
          onChange(null);
          return;
        }

        const next = Number(raw);

        if (!Number.isNaN(next)) {
          onChange(next);
        }
      }}
      className="h-10 w-20 rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-2 text-center text-sm font-black text-(--color-navy) outline-none placeholder:font-medium placeholder:text-(--color-text-muted) focus:border-(--color-brand) disabled:opacity-50"
    />
  );
}

// -----------------------------------------------------------------------------
// Run selector
// -----------------------------------------------------------------------------

function RunSelector({
  selected,
  disabled = false,
  onToggle,
}: {
  selected: number[];
  disabled?: boolean;
  onToggle: (run: number) => void;
}) {
  /*
   * Delivery API supports batRuns 0-7.
   */
  const runs = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="grid grid-cols-8 gap-1.5">
      {runs.map((run) => {
        const active = selected.includes(run);

        return (
          <button
            key={run}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(run)}
            className={`flex aspect-square items-center justify-center rounded-lg border text-xs font-black transition disabled:opacity-50 ${
              active
                ? "border-(--color-brand) bg-(--color-brand) text-white"
                : "border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-secondary)"
            }`}
          >
            {run}
          </button>
        );
      })}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function hasSectionOverrides(
  overrides: MatchRulesOverrides,
  section: SectionKey,
) {
  const value = overrides[section];

  return Boolean(
    value && typeof value === "object" && Object.keys(value).length > 0,
  );
}

/**
 * Keep only fields supported by the new Match Rules API.
 *
 * This deliberately removes old/legacy properties such as `powerplays`
 * if they still exist in older frontend state/types.
 */
function sanitizeOverrides(
  overrides: MatchRulesOverrides,
): MatchRulesOverrides {
  const next: MatchRulesOverrides = {};

  if (overrides.format) {
    next.format = {
      ...overrides.format,
    };
  }

  if (overrides.bowling) {
    next.bowling = {
      ...overrides.bowling,
    };
  }

  if (overrides.extras) {
    next.extras = {
      ...overrides.extras,

      ...(overrides.extras.wide
        ? {
            wide: {
              ...overrides.extras.wide,
            },
          }
        : {}),

      ...(overrides.extras.noBall
        ? {
            noBall: {
              ...overrides.extras.noBall,
            },
          }
        : {}),
    };
  }

  if (overrides.batting) {
    next.batting = {
      ...overrides.batting,
    };
  }

  if (overrides.wagonWheel) {
    next.wagonWheel = {
      ...overrides.wagonWheel,
    };
  }

  return next;
}

function applyOverrides(
  snapshot: MatchRulesSnapshot,
  overrides: MatchRulesOverrides,
): MatchRulesSnapshot {
  return {
    ...snapshot,

    format: {
      ...snapshot.format,
      ...overrides.format,
    },

    bowling: {
      ...snapshot.bowling,
      ...overrides.bowling,
    },

    extras: {
      ...snapshot.extras,
      ...overrides.extras,

      wide: {
        ...snapshot.extras.wide,
        ...overrides.extras?.wide,
      },

      noBall: {
        ...snapshot.extras.noBall,
        ...overrides.extras?.noBall,
      },
    },

    batting: {
      ...snapshot.batting,
      ...overrides.batting,
    },

    wagonWheel: {
      ...snapshot.wagonWheel,
      ...overrides.wagonWheel,
    },
  };
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (
      error as {
        data?: {
          message?: string | string[];
        };
      }
    ).data;

    if (Array.isArray(data?.message)) {
      return data.message.join(", ");
    }

    if (data?.message) {
      return data.message;
    }
  }

  return "Unable to validate or save the match rules. Please review the values and try again.";
}
