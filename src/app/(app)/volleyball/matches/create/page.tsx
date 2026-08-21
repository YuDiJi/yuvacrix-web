"use client";

import { Check, ChevronDown, CircleDot, Settings2, Trophy } from "lucide-react";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";

import { cn } from "@/lib/cn";

import { useGetOwnedTeamQuery } from "@/store/api/teamApi";

import {
  useCreateVolleyballMatchMutation,
  useGetVolleyballMatchRulePresetsQuery,
} from "@/store/api/volleyball/volleyballMatchApi";

import {
  VOLLEYBALL_MATCH_RULE_PRESETS,
  VOLLEYBALL_RULE_FORMAT_TYPES,
  type VolleyballMatchRulePreset,
  type VolleyballMatchRulesOverrides,
  type VolleyballRuleFormatType,
} from "@/types/volleyball/match";

import { SPORT_TYPES } from "@/types/sport";

import type { Team } from "@/types/team";

/* =========================================================
   CONSTANTS
========================================================= */

const SET_POINT_OPTIONS = [25, 21, 15, 11] as const;

const BEST_OF_SET_OPTIONS = [1, 3, 5, 7] as const;

const FIXED_SET_OPTIONS = [1, 2, 3, 4, 5] as const;

const WIN_BY_OPTIONS = [1, 2] as const;

/* =========================================================
   TYPES
========================================================= */

type TeamSelectorProps = {
  label: string;

  value?: Team;

  teams: Team[];

  disabledTeamId?: string;

  onSelect: (team: Team) => void;
};

/* =========================================================
   TEAM SELECTOR
========================================================= */

function TeamSelector({
  label,
  value,
  teams,
  disabledTeamId,
  onSelect,
}: TeamSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <p className="mb-2 text-section-label">{label}</p>

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className={cn(
          "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left",
          "bg-(--color-bg-card) shadow-(--shadow-card) transition-colors",
          value ? "border-(--color-brand)/30" : "border-(--color-bg-border)",
        )}
      >
        <div className="min-w-0">
          {value ? (
            <>
              <p className="truncate text-sm font-bold text-(--color-text-primary)">
                {value.name}
              </p>

              {value.city && (
                <p className="mt-0.5 text-xs text-(--color-text-muted)">
                  {value.city}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm font-medium text-(--color-text-muted)">
              Select team
            </p>
          )}
        </div>

        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-(--color-text-muted) transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="mt-2 overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
          {teams.length === 0 ? (
            <div className="px-4 py-5 text-center">
              <p className="text-sm font-medium text-(--color-text-muted)">
                No volleyball teams available.
              </p>
            </div>
          ) : (
            teams.map((team) => {
              const disabled = team.id === disabledTeamId;

              const selected = value?.id === team.id;

              return (
                <button
                  key={team.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onSelect(team);

                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between border-b border-(--color-bg-border) px-4 py-3 text-left last:border-b-0",
                    "transition-colors",

                    !disabled &&
                      "hover:bg-(--color-bg-tint) active:bg-(--color-bg-tint)",

                    disabled && "cursor-not-allowed opacity-40",
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-(--color-text-primary)">
                      {team.name}
                    </p>

                    {team.city && (
                      <p className="mt-0.5 text-xs text-(--color-text-muted)">
                        {team.city}
                      </p>
                    )}
                  </div>

                  {selected && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-brand)">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function CreateVolleyballMatchPage() {
  const router = useRouter();

  /* =========================
     TEAMS
  ========================= */

  const [teamA, setTeamA] = useState<Team | undefined>();

  const [teamB, setTeamB] = useState<Team | undefined>();

  /* =========================
     PRESET
  ========================= */

  const [selectedPreset, setSelectedPreset] =
    useState<VolleyballMatchRulePreset>(
      VOLLEYBALL_MATCH_RULE_PRESETS.BEST_OF_5,
    );

  /* =========================
     CUSTOM RULES
  ========================= */

  const [customFormatType, setCustomFormatType] =
    useState<VolleyballRuleFormatType>(VOLLEYBALL_RULE_FORMAT_TYPES.BEST_OF);

  const [customBestOfSets, setCustomBestOfSets] = useState<number>(3);

  const [customFixedSets, setCustomFixedSets] = useState<number>(3);

  const [customNormalSetPoints, setCustomNormalSetPoints] =
    useState<number>(25);

  const [customDecidingSetPoints, setCustomDecidingSetPoints] =
    useState<number>(15);

  const [customWinByMargin, setCustomWinByMargin] = useState<number>(2);

  const [error, setError] = useState("");

  /* =========================
     API
  ========================= */

  const {
    data: ownedTeams = [],
    isLoading: areTeamsLoading,
    isError: areTeamsError,
  } = useGetOwnedTeamQuery();

  const [createVolleyballMatch, { isLoading: isCreatingMatch }] =
    useCreateVolleyballMatchMutation();

  const {
    data: rulesResponse,
    isLoading: areRulesLoading,
    isError: areRulesError,
  } = useGetVolleyballMatchRulePresetsQuery();

  /* =========================
     PRESETS
  ========================= */

  const rulePresets = useMemo(() => {
    const presets = rulesResponse?.presets ?? [];

    /*
     * DEFAULT and BEST_OF_5 have
     * the same product behaviour.
     *
     * Don't show users two
     * identical choices.
     */
    return presets.filter(
      (preset) =>
        preset.key === VOLLEYBALL_MATCH_RULE_PRESETS.BEST_OF_5 ||
        preset.key === VOLLEYBALL_MATCH_RULE_PRESETS.ALWAYS_3_SETS ||
        preset.key === VOLLEYBALL_MATCH_RULE_PRESETS.JUST_1_SET,
    );
  }, [rulesResponse]);

  const volleyballTeams = useMemo(
    () =>
      ownedTeams.filter((team) => team.sportType === SPORT_TYPES.VOLLEYBALL),
    [ownedTeams],
  );

  const isCustom = selectedPreset === VOLLEYBALL_MATCH_RULE_PRESETS.CUSTOM;

  /* =========================
     CUSTOM DERIVED VALUES
  ========================= */

  const customSetsToWin =
    customFormatType === VOLLEYBALL_RULE_FORMAT_TYPES.BEST_OF
      ? Math.floor(customBestOfSets / 2) + 1
      : null;

  const customOverrides = useMemo<VolleyballMatchRulesOverrides>(() => {
    if (customFormatType === VOLLEYBALL_RULE_FORMAT_TYPES.BEST_OF) {
      return {
        formatType: VOLLEYBALL_RULE_FORMAT_TYPES.BEST_OF,

        maxSets: customBestOfSets,

        /*
         * Resolver derives setsToWin.
         */

        totalSets: null,

        normalSetPoints: customNormalSetPoints,

        /*
         * Best-of-1 has no meaningful
         * separate deciding set UI.
         *
         * Its only set should use the
         * selected normal target.
         */
        decidingSetPoints:
          customBestOfSets === 1
            ? customNormalSetPoints
            : customDecidingSetPoints,

        winByMargin: customWinByMargin,
      };
    }

    return {
      formatType: VOLLEYBALL_RULE_FORMAT_TYPES.FIXED_SETS,

      maxSets: null,

      totalSets: customFixedSets,

      normalSetPoints: customNormalSetPoints,

      decidingSetPoints: null,

      winByMargin: customWinByMargin,
    };
  }, [
    customFormatType,
    customBestOfSets,
    customFixedSets,
    customNormalSetPoints,
    customDecidingSetPoints,
    customWinByMargin,
  ]);

  /* =========================
     CREATE
  ========================= */

  async function handleCreateMatch() {
    if (!teamA) {
      setError("Please select Team A.");

      return;
    }

    if (!teamB) {
      setError("Please select Team B.");

      return;
    }

    if (teamA.id === teamB.id) {
      setError("Team A and Team B must be different.");

      return;
    }

    setError("");

    try {
      const match = await createVolleyballMatch({
        teamAId: teamA.id,

        teamBId: teamB.id,

        rules: isCustom
          ? {
              presetKey: VOLLEYBALL_MATCH_RULE_PRESETS.CUSTOM,

              overrides: customOverrides,
            }
          : {
              presetKey: selectedPreset,
            },
      }).unwrap();

      router.push(`/volleyball/matches/${match.id}/rosters`);
    } catch (err) {
      const message =
        err &&
        typeof err === "object" &&
        "data" in err &&
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data
          ? String(err.data.message)
          : "Failed to create volleyball match.";

      setError(message);
    }
  }

  /* =========================
     LOADING
  ========================= */

  if (areTeamsLoading || areRulesLoading) {
    return (
      <div className="min-h-full bg-(--color-bg-base) px-4 py-5">
        <div className="animate-pulse space-y-4">
          <div className="h-20 rounded-2xl bg-(--color-bg-card)" />

          <div className="h-20 rounded-2xl bg-(--color-bg-card)" />

          <div className="h-16 rounded-2xl bg-(--color-bg-card)" />

          <div className="h-40 rounded-2xl bg-(--color-bg-card)" />
        </div>
      </div>
    );
  }

  /* =========================
     LOAD ERROR
  ========================= */

  if (areTeamsError || areRulesError) {
    return (
      <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) px-4">
        <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
          <p className="text-sm font-bold text-(--color-text-primary)">
            Unable to load match setup
          </p>

          <p className="mt-1 text-xs text-(--color-text-muted)">
            Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-(--color-bg-base)">
      <div className="flex flex-col gap-5 px-4 py-5">
        {/* =================================
            HEADER
        ================================= */}

        <div>
          <p className="text-section-label">New Volleyball Match</p>

          <h1 className="mt-1 font-(family-name:--font-display) text-2xl font-black uppercase tracking-wide text-(--color-text-primary)">
            Match Setup
          </h1>

          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Select both teams and choose how the match should be played.
          </p>
        </div>

        {/* =================================
            TEAM REQUIREMENT
        ================================= */}

        {volleyballTeams.length < 2 && (
          <div className="rounded-2xl border border-(--color-brand)/15 bg-(--color-bg-tint) px-4 py-3">
            <p className="text-sm font-bold text-(--color-text-primary)">
              You need at least 2 volleyball teams
            </p>

            <p className="mt-1 text-xs text-(--color-text-secondary)">
              Create another volleyball team before starting a match.
            </p>
          </div>
        )}

        {/* =================================
            TEAM A
        ================================= */}

        <TeamSelector
          label="Team A"
          value={teamA}
          teams={volleyballTeams}
          disabledTeamId={teamB?.id}
          onSelect={(team) => {
            setError("");

            setTeamA(team);
          }}
        />

        {/* =================================
            TEAM B
        ================================= */}

        <TeamSelector
          label="Team B"
          value={teamB}
          teams={volleyballTeams}
          disabledTeamId={teamA?.id}
          onSelect={(team) => {
            setError("");

            setTeamB(team);
          }}
        />

        {/* =================================
            MATCH FORMAT
        ================================= */}

        <section>
          <div className="mb-3">
            <p className="text-section-label">Match Format</p>

            <p className="mt-1 text-xs text-(--color-text-muted)">
              Choose a standard format or create your own rules.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {rulePresets.map((preset) => (
              <PresetCard
                key={preset.key}
                name={preset.name}
                description={preset.description}
                selected={selectedPreset === preset.key}
                formatSummary={
                  preset.configuration.formatType ===
                  VOLLEYBALL_RULE_FORMAT_TYPES.BEST_OF
                    ? `Best of ${preset.configuration.maxSets} · First to ${preset.configuration.setsToWin}`
                    : `${preset.configuration.totalSets} set${
                        preset.configuration.totalSets === 1 ? "" : "s"
                      }`
                }
                pointsSummary={`${preset.configuration.normalSetPoints} pts${
                  preset.configuration.decidingSetPoints
                    ? ` · Decider ${preset.configuration.decidingSetPoints}`
                    : ""
                } · Win by ${preset.configuration.winByMargin}`}
                onClick={() => {
                  setError("");

                  setSelectedPreset(preset.key);
                }}
              />
            ))}

            {/* CUSTOM */}

            <button
              type="button"
              onClick={() => {
                setError("");

                setSelectedPreset(VOLLEYBALL_MATCH_RULE_PRESETS.CUSTOM);
              }}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border p-4 text-left shadow-(--shadow-card) transition-all",

                isCustom
                  ? "border-(--color-brand)/40 bg-(--color-bg-tint)"
                  : "border-(--color-bg-border) bg-(--color-bg-card)",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",

                  isCustom
                    ? "border-(--color-brand) bg-(--color-brand)"
                    : "border-(--color-bg-border) bg-(--color-bg-card)",
                )}
              >
                {isCustom && <Check size={12} className="text-white" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-(--color-text-primary)">
                    Custom
                  </p>

                  <Settings2 size={14} className="text-(--color-brand)" />
                </div>

                <p className="mt-1 text-xs text-(--color-text-secondary)">
                  Choose your sets, target points and winning margin.
                </p>

                {isCustom && (
                  <p className="mt-2 text-xs font-semibold text-(--color-brand)">
                    Custom rules selected
                  </p>
                )}
              </div>
            </button>
          </div>
        </section>

        {/* =================================
            CUSTOM RULES
        ================================= */}

        {isCustom && (
          <CustomRulesEditor
            formatType={customFormatType}
            bestOfSets={customBestOfSets}
            fixedSets={customFixedSets}
            normalSetPoints={customNormalSetPoints}
            decidingSetPoints={customDecidingSetPoints}
            winByMargin={customWinByMargin}
            setsToWin={customSetsToWin}
            onFormatChange={(value) => {
              setError("");

              setCustomFormatType(value);
            }}
            onBestOfSetsChange={(value) => {
              setError("");

              setCustomBestOfSets(value);
            }}
            onFixedSetsChange={(value) => {
              setError("");

              setCustomFixedSets(value);
            }}
            onNormalPointsChange={(value) => {
              setError("");

              setCustomNormalSetPoints(value);
            }}
            onDecidingPointsChange={(value) => {
              setError("");

              setCustomDecidingSetPoints(value);
            }}
            onWinByChange={(value) => {
              setError("");

              setCustomWinByMargin(value);
            }}
          />
        )}

        {/* =================================
            ERROR
        ================================= */}

        {error && (
          <div className="rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
            <p className="text-sm font-medium text-(--color-live)">{error}</p>
          </div>
        )}
      </div>

      {/* =================================
          CREATE
      ================================= */}

      <div className="safe-bottom sticky bottom-0 border-t border-(--color-bg-border) bg-(--color-bg-base) px-4 py-3">
        <Button
          fullWidth
          loading={isCreatingMatch}
          disabled={
            volleyballTeams.length < 2 || !teamA || !teamB || isCreatingMatch
          }
          onClick={handleCreateMatch}
        >
          Create Match
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   PRESET CARD
========================================================= */

function PresetCard({
  name,
  description,
  selected,
  formatSummary,
  pointsSummary,
  onClick,
}: {
  name: string;

  description: string;

  selected: boolean;

  formatSummary: string;

  pointsSummary: string;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border p-4 text-left shadow-(--shadow-card) transition-all",

        selected
          ? "border-(--color-brand)/40 bg-(--color-bg-tint)"
          : "border-(--color-bg-border) bg-(--color-bg-card)",
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",

          selected
            ? "border-(--color-brand) bg-(--color-brand)"
            : "border-(--color-bg-border) bg-(--color-bg-card)",
        )}
      >
        {selected && <Check size={12} className="text-white" />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-(--color-text-primary)">{name}</p>

        <p className="mt-1 text-xs leading-5 text-(--color-text-secondary)">
          {description}
        </p>

        <p className="mt-2 text-xs font-semibold text-(--color-brand)">
          {formatSummary}
        </p>

        <p className="mt-1 text-xs text-(--color-text-muted)">
          {pointsSummary}
        </p>
      </div>
    </button>
  );
}

/* =========================================================
   CUSTOM RULES EDITOR
========================================================= */

function CustomRulesEditor({
  formatType,
  bestOfSets,
  fixedSets,
  normalSetPoints,
  decidingSetPoints,
  winByMargin,
  setsToWin,

  onFormatChange,
  onBestOfSetsChange,
  onFixedSetsChange,
  onNormalPointsChange,
  onDecidingPointsChange,
  onWinByChange,
}: {
  formatType: VolleyballRuleFormatType;

  bestOfSets: number;

  fixedSets: number;

  normalSetPoints: number;

  decidingSetPoints: number;

  winByMargin: number;

  setsToWin: number | null;

  onFormatChange: (value: VolleyballRuleFormatType) => void;

  onBestOfSetsChange: (value: number) => void;

  onFixedSetsChange: (value: number) => void;

  onNormalPointsChange: (value: number) => void;

  onDecidingPointsChange: (value: number) => void;

  onWinByChange: (value: number) => void;
}) {
  const isBestOf = formatType === VOLLEYBALL_RULE_FORMAT_TYPES.BEST_OF;

  return (
    <section className="overflow-hidden rounded-3xl border border-(--color-brand)/20 bg-(--color-bg-card) shadow-(--shadow-card)">
      {/* HEADER */}

      <div className="flex items-center gap-3 border-b border-(--color-bg-border) bg-(--color-bg-tint) px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-brand) text-white">
          <Settings2 size={17} />
        </div>

        <div>
          <p className="text-sm font-black text-(--color-text-primary)">
            Custom Match Rules
          </p>

          <p className="mt-0.5 text-[10px] text-(--color-text-muted)">
            Configure how this match should be played.
          </p>
        </div>
      </div>

      <div className="space-y-5 p-4">
        {/* =================================
            FORMAT TYPE
        ================================= */}

        <RuleSection
          label="Match Type"
          description="Choose how the winner is decided."
        >
          <div className="grid grid-cols-2 gap-2">
            <ChoiceCard
              selected={isBestOf}
              title="Best Of"
              description="Match ends when a team wins the majority."
              onClick={() =>
                onFormatChange(VOLLEYBALL_RULE_FORMAT_TYPES.BEST_OF)
              }
            />

            <ChoiceCard
              selected={!isBestOf}
              title="Fixed Sets"
              description="Every configured set is played."
              onClick={() =>
                onFormatChange(VOLLEYBALL_RULE_FORMAT_TYPES.FIXED_SETS)
              }
            />
          </div>
        </RuleSection>

        {/* =================================
            SET COUNT
        ================================= */}

        <RuleSection
          label={isBestOf ? "Best Of" : "Number of Sets"}
          description={
            isBestOf
              ? "Best Of uses an odd number of sets."
              : "All selected sets will be played."
          }
        >
          <OptionGrid
            values={
              isBestOf ? [...BEST_OF_SET_OPTIONS] : [...FIXED_SET_OPTIONS]
            }
            selected={isBestOf ? bestOfSets : fixedSets}
            onChange={isBestOf ? onBestOfSetsChange : onFixedSetsChange}
          />
        </RuleSection>

        {/* =================================
            NORMAL SET POINTS
        ================================= */}

        <RuleSection
          label="Points Per Set"
          description="Target score for a normal set."
        >
          <OptionGrid
            values={[...SET_POINT_OPTIONS]}
            selected={normalSetPoints}
            onChange={onNormalPointsChange}
          />
        </RuleSection>

        {/* =================================
            DECIDER
        ================================= */}

        {isBestOf && bestOfSets > 1 && (
          <RuleSection
            label="Deciding Set"
            description={`Target score if the match reaches Set ${bestOfSets}.`}
          >
            <OptionGrid
              values={[...SET_POINT_OPTIONS]}
              selected={decidingSetPoints}
              onChange={onDecidingPointsChange}
            />
          </RuleSection>
        )}

        {/* =================================
            WIN BY
        ================================= */}

        <RuleSection
          label="Win By"
          description="Required point advantage to win a set."
        >
          <div className="grid grid-cols-2 gap-2">
            {WIN_BY_OPTIONS.map((value) => {
              const selected = winByMargin === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onWinByChange(value)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-3 py-3 text-left transition-all",

                    selected
                      ? "border-(--color-brand) bg-(--color-bg-tint)"
                      : "border-(--color-bg-border) bg-(--color-bg-base)",
                  )}
                >
                  <div>
                    <p className="text-sm font-black text-(--color-text-primary)">
                      {value} point
                      {value > 1 ? "s" : ""}
                    </p>

                    <p className="mt-0.5 text-[9px] text-(--color-text-muted)">
                      advantage
                    </p>
                  </div>

                  {selected && (
                    <Check size={14} className="text-(--color-brand)" />
                  )}
                </button>
              );
            })}
          </div>
        </RuleSection>

        {/* =================================
            SUMMARY
        ================================= */}

        <CustomRulesSummary
          formatType={formatType}
          bestOfSets={bestOfSets}
          fixedSets={fixedSets}
          setsToWin={setsToWin}
          normalSetPoints={normalSetPoints}
          decidingSetPoints={decidingSetPoints}
          winByMargin={winByMargin}
        />
      </div>
    </section>
  );
}

/* =========================================================
   RULE SECTION
========================================================= */

function RuleSection({
  label,
  description,
  children,
}: {
  label: string;

  description: string;

  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-section-label">{label}</p>

      <p className="mt-1 text-[10px] text-(--color-text-muted)">
        {description}
      </p>

      <div className="mt-2.5">{children}</div>
    </div>
  );
}

/* =========================================================
   CHOICE CARD
========================================================= */

function ChoiceCard({
  title,
  description,
  selected,
  onClick,
}: {
  title: string;

  description: string;

  selected: boolean;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border p-3 text-left transition-all",

        selected
          ? "border-(--color-brand) bg-(--color-bg-tint)"
          : "border-(--color-bg-border) bg-(--color-bg-base)",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black text-(--color-text-primary)">
          {title}
        </p>

        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",

            selected
              ? "border-(--color-brand) bg-(--color-brand)"
              : "border-(--color-bg-border)",
          )}
        >
          {selected && <Check size={11} className="text-white" />}
        </div>
      </div>

      <p className="mt-1.5 text-[9px] leading-4 text-(--color-text-muted)">
        {description}
      </p>
    </button>
  );
}

/* =========================================================
   OPTION GRID
========================================================= */

function OptionGrid({
  values,
  selected,
  onChange,
}: {
  values: number[];

  selected: number;

  onChange: (value: number) => void;
}) {
  return (
    <div
      className={cn(
        "grid gap-2",

        values.length <= 4 ? "grid-cols-4" : "grid-cols-5",
      )}
    >
      {values.map((value) => {
        const active = selected === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={cn(
              "flex h-11 items-center justify-center rounded-xl border font-(family-name:--font-display) text-lg font-black transition-all",

              active
                ? "border-(--color-brand) bg-(--color-brand) text-white shadow-sm"
                : "border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-primary)",
            )}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function CustomRulesSummary({
  formatType,
  bestOfSets,
  fixedSets,
  setsToWin,
  normalSetPoints,
  decidingSetPoints,
  winByMargin,
}: {
  formatType: VolleyballRuleFormatType;

  bestOfSets: number;

  fixedSets: number;

  setsToWin: number | null;

  normalSetPoints: number;

  decidingSetPoints: number;

  winByMargin: number;
}) {
  const isBestOf = formatType === VOLLEYBALL_RULE_FORMAT_TYPES.BEST_OF;

  return (
    <div className="overflow-hidden rounded-2xl bg-(--color-navy) text-white">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
        <CircleDot size={12} className="text-orange-400" />

        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/60">
          Match Summary
        </p>
      </div>

      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Trophy size={17} className="text-orange-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-(family-name:--font-display) text-base font-black uppercase tracking-wide">
              {isBestOf
                ? `Best of ${bestOfSets}`
                : `${fixedSets} Fixed Set${fixedSets === 1 ? "" : "s"}`}
            </p>

            <p className="mt-1 text-[10px] leading-4 text-white/60">
              {isBestOf
                ? `First team to ${setsToWin} set${
                    setsToWin === 1 ? "" : "s"
                  } wins the match.`
                : `All ${fixedSets} set${
                    fixedSets === 1 ? "" : "s"
                  } will be played.`}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 divide-x divide-white/10 rounded-xl bg-white/[0.06]">
          <SummaryValue label="Set" value={`${normalSetPoints} pts`} />

          <SummaryValue
            label={isBestOf && bestOfSets > 1 ? "Decider" : "Format"}
            value={
              isBestOf && bestOfSets > 1
                ? `${decidingSetPoints} pts`
                : isBestOf
                  ? "Best Of"
                  : "Fixed"
            }
          />

          <SummaryValue label="Win By" value={`${winByMargin}`} />
        </div>
      </div>
    </div>
  );
}

function SummaryValue({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="px-2 py-2.5 text-center">
      <p className="text-[8px] font-black uppercase tracking-wide text-white/40">
        {label}
      </p>

      <p className="mt-0.5 text-xs font-black">{value}</p>
    </div>
  );
}
