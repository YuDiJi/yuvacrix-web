"use client";

import { useEffect, useMemo, useState } from "react";

import { AlertTriangle, Check, CircleAlert, X } from "lucide-react";

import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";
import { cn } from "@/lib/cn";

import {
  VOLLEYBALL_MATCH_RULE_PRESETS,
  VOLLEYBALL_RULE_FORMAT_TYPES,
  type VolleyballMatch,
  type VolleyballMatchRulePreset,
  type VolleyballMatchRulesOverrides,
} from "@/types/volleyball/match";
import {
  VOLLEYBALL_SET_STATUSES,
  type VolleyballSet,
} from "@/types/volleyball/set";

type CorrectionChoice = "BEST_OF_1" | "BEST_OF_3" | "CUSTOM";

type SubmitPayload = {
  presetKey: VolleyballMatchRulePreset;
  customRules: VolleyballMatchRulesOverrides;
};

type Props = {
  open: boolean;
  match: VolleyballMatch;
  sets?: VolleyballSet[];
  loading?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: SubmitPayload) => void;
};

const MAX_SET_OPTIONS = [1, 3, 5] as const;
const SET_POINT_OPTIONS = [15, 21, 25] as const;
const DECIDING_POINT_OPTIONS = [11, 15, 21, 25] as const;
const WIN_BY_OPTIONS = [1, 2] as const;

export function VolleyballMatchRuleCorrectionSheet({
  open,
  match,
  sets = [],
  loading = false,
  error,
  onClose,
  onSubmit,
}: Props) {
  const rules = match.rulesSnapshot;

  const completedSetCount = sets.filter(
    (set) => set.status === VOLLEYBALL_SET_STATUSES.COMPLETED,
  ).length;

  const currentMaxSets = rules.maxSets ?? rules.totalSets ?? 1;

  const defaultDecidingSetPoints =
    rules.decidingSetPoints ?? rules.normalSetPoints;

  const [choice, setChoice] = useState<CorrectionChoice>("BEST_OF_1");
  const [customMaxSets, setCustomMaxSets] = useState<number>(currentMaxSets);
  const [customNormalPoints, setCustomNormalPoints] = useState<number>(
    rules.normalSetPoints,
  );
  const [customDecidingPoints, setCustomDecidingPoints] = useState<number>(
    defaultDecidingSetPoints,
  );
  const [customWinBy, setCustomWinBy] = useState<number>(rules.winByMargin);

  useEffect(() => {
    if (!open) {
      return;
    }

    setChoice(currentMaxSets > 1 ? "BEST_OF_1" : "BEST_OF_3");
    setCustomMaxSets(currentMaxSets);
    setCustomNormalPoints(rules.normalSetPoints);
    setCustomDecidingPoints(defaultDecidingSetPoints);
    setCustomWinBy(rules.winByMargin);
  }, [
    currentMaxSets,
    defaultDecidingSetPoints,
    open,
    rules.normalSetPoints,
    rules.winByMargin,
  ]);

  const choices = useMemo(() => {
    return [
      {
        key: "BEST_OF_1" as const,
        title: "Best of 1",
        subtitle: "One completed set can decide the match",
        hidden: currentMaxSets === 1 || completedSetCount > 1,
      },
      {
        key: "BEST_OF_3" as const,
        title: "Best of 3",
        subtitle: "First team to 2 sets",
        hidden: currentMaxSets === 3,
      },
      {
        key: "CUSTOM" as const,
        title: "Custom",
        subtitle: "Adjust supported match format values",
        hidden: false,
      },
    ].filter((item) => !item.hidden);
  }, [completedSetCount, currentMaxSets]);

  const payload = useMemo<SubmitPayload>(() => {
    if (choice === "BEST_OF_1") {
      return {
        presetKey: VOLLEYBALL_MATCH_RULE_PRESETS.CUSTOM,
        customRules: buildBestOfRules({
          maxSets: 1,
          normalSetPoints: rules.normalSetPoints,
          decidingSetPoints: defaultDecidingSetPoints,
          winByMargin: rules.winByMargin,
        }),
      };
    }

    if (choice === "BEST_OF_3") {
      return {
        presetKey: VOLLEYBALL_MATCH_RULE_PRESETS.CUSTOM,
        customRules: buildBestOfRules({
          maxSets: 3,
          normalSetPoints: rules.normalSetPoints,
          decidingSetPoints: defaultDecidingSetPoints,
          winByMargin: rules.winByMargin,
        }),
      };
    }

    return {
      presetKey: VOLLEYBALL_MATCH_RULE_PRESETS.CUSTOM,
      customRules: buildBestOfRules({
        maxSets: customMaxSets,
        normalSetPoints: customNormalPoints,
        decidingSetPoints: customDecidingPoints,
        winByMargin: customWinBy,
      }),
    };
  }, [
    choice,
    customDecidingPoints,
    customMaxSets,
    customNormalPoints,
    customWinBy,
    defaultDecidingSetPoints,
    rules.normalSetPoints,
    rules.winByMargin,
  ]);

  const selectedMaxSets = payload.customRules.maxSets ?? currentMaxSets;
  const isNoChange =
    selectedMaxSets === currentMaxSets &&
    payload.customRules.normalSetPoints === rules.normalSetPoints &&
    payload.customRules.decidingSetPoints === defaultDecidingSetPoints &&
    payload.customRules.winByMargin === rules.winByMargin;

  return (
    <DialogBottom
      open={open}
      onClose={() => {
        if (!loading) {
          onClose();
        }
      }}
      className="h-[86dvh] max-h-[86dvh] overflow-hidden rounded-t-3xl bg-(--color-bg-card)"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-(--color-bg-border) px-1 pb-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-(--color-brand)">
              Match rules
            </p>

            <h2 className="mt-0.5 text-xl font-black text-(--color-text-primary)">
              Correct match format
            </h2>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-base) text-(--color-text-secondary)"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-(--color-bg-base) px-1 py-3 scrollbar-hide">
          <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-(--shadow-card)">
            <p className="text-section-label">Current format</p>
            <p className="mt-1 text-sm font-black text-(--color-text-primary)">
              {formatRulesLabel(rules.maxSets, rules.setsToWin)}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-(--color-text-muted)">
              {rules.normalSetPoints} points
              {rules.decidingSetPoints
                ? `, ${rules.decidingSetPoints} deciding`
                : ""}
              , win by {rules.winByMargin}
            </p>
          </div>

          <div className="mt-3">
            <p className="text-section-label">Correct to</p>

            <div className="mt-2 flex flex-col gap-2">
              {choices.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  disabled={loading}
                  onClick={() => setChoice(item.key)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border bg-(--color-bg-card) p-3 text-left shadow-(--shadow-card) transition-all",
                    choice === item.key
                      ? "border-(--color-brand) bg-(--color-bg-tint) ring-1 ring-(--color-brand)/15"
                      : "border-(--color-bg-border)",
                    loading && "opacity-60",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      choice === item.key
                        ? "border-(--color-brand) bg-(--color-brand) text-white"
                        : "border-(--color-bg-border)",
                    )}
                  >
                    {choice === item.key && <Check size={12} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-(--color-text-primary)">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-(--color-text-muted)">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {choice === "CUSTOM" && (
            <div className="mt-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-(--shadow-card)">
              <RulePicker
                label="Max sets"
                value={customMaxSets}
                values={MAX_SET_OPTIONS}
                disabled={loading}
                onChange={setCustomMaxSets}
              />

              <RulePicker
                label="Normal set points"
                value={customNormalPoints}
                values={SET_POINT_OPTIONS}
                disabled={loading}
                onChange={setCustomNormalPoints}
              />

              <RulePicker
                label="Deciding set points"
                value={customDecidingPoints}
                values={DECIDING_POINT_OPTIONS}
                disabled={loading}
                onChange={setCustomDecidingPoints}
              />

              <RulePicker
                label="Win by"
                value={customWinBy}
                values={WIN_BY_OPTIONS}
                disabled={loading}
                onChange={setCustomWinBy}
              />
            </div>
          )}

          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-amber-800">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p className="min-w-0 text-[11px] font-semibold leading-4">
              Completed sets will not be changed. Tournament standings and
              progression may be recalculated by the server.
            </p>
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-red-700">
              <CircleAlert size={16} className="mt-0.5 shrink-0" />
              <p className="min-w-0 break-words text-xs font-semibold leading-4">
                {error}
              </p>
            </div>
          )}
        </div>

        <div className="safe-bottom shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-1 pb-2 pt-3">
          <Button
            fullWidth
            size="sm"
            loading={loading}
            disabled={loading || isNoChange}
            onClick={() => onSubmit(payload)}
          >
            Confirm correction
          </Button>
        </div>
      </div>
    </DialogBottom>
  );
}

function RulePicker({
  label,
  value,
  values,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  values: readonly number[];
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="border-b border-(--color-bg-border) py-3 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-(--color-text-primary)">
          {label}
        </p>

        <div className="flex shrink-0 gap-1">
          {values.map((item) => (
            <button
              key={item}
              type="button"
              disabled={disabled}
              onClick={() => onChange(item)}
              className={cn(
                "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-black transition-all",
                value === item
                  ? "bg-(--color-brand) text-white"
                  : "bg-(--color-bg-base) text-(--color-text-secondary)",
                disabled && "opacity-50",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function buildBestOfRules({
  maxSets,
  normalSetPoints,
  decidingSetPoints,
  winByMargin,
}: {
  maxSets: number;
  normalSetPoints: number;
  decidingSetPoints: number;
  winByMargin: number;
}): VolleyballMatchRulesOverrides {
  return {
    formatType: VOLLEYBALL_RULE_FORMAT_TYPES.BEST_OF,
    maxSets,
    setsToWin: Math.floor(maxSets / 2) + 1,
    normalSetPoints,
    decidingSetPoints,
    winByMargin,
  };
}

function formatRulesLabel(maxSets: number | null, setsToWin: number | null) {
  if (maxSets && setsToWin) {
    return `Best of ${maxSets}, first to ${setsToWin}`;
  }

  if (maxSets) {
    return `${maxSets} sets`;
  }

  return "Custom format";
}
