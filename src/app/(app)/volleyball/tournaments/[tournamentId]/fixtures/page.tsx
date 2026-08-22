"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  CircleDot,
  Play,
  Plus,
  Settings2,
  Trophy,
  X,
} from "lucide-react";

import { type ReactNode, useEffect, useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";
import { S3Image } from "@/components/common/S3Image";

import { cn } from "@/lib/cn";

import { useGetVolleyballMatchRulePresetsQuery } from "@/store/api/volleyball/volleyballMatchApi";

import {
  useCreateVolleyballMatchFromFixtureMutation,
  useCreateVolleyballTournamentFixtureMutation,
  useGetVolleyballTournamentFixturesQuery,
  useGetVolleyballTournamentQuery,
  useGetVolleyballTournamentTeamsQuery,
} from "@/store/api/volleyball/volleyballTournamentApi";

import {
  VOLLEYBALL_MATCH_RULE_PRESETS,
  type VolleyballMatchRulePreset,
  type VolleyballMatchRulesOverrides,
} from "@/types/volleyball/match";

import {
  VOLLEYBALL_FIXTURE_STATUSES,
  VOLLEYBALL_TOURNAMENT_FORMATS,
  VOLLEYBALL_TOURNAMENT_STAGES,
  type VolleyballTournamentFixture,
  type VolleyballTournamentStage,
  type VolleyballTournamentTeam,
} from "@/types/volleyball/tournament";

/* =========================================================
   LOCAL TYPES
========================================================= */

type FixtureSlotMode = "TEAM" | "WINNER";

type CustomFormatType = "BEST_OF" | "FIXED_SETS";

/* =========================================================
   CUSTOM RULE DEFAULTS
========================================================= */

const CUSTOM_MAX_SET_OPTIONS = [1, 3, 5];

const CUSTOM_TOTAL_SET_OPTIONS = [1, 2, 3, 5];

const CUSTOM_NORMAL_POINTS_OPTIONS = [5, 11, 15, 21, 25];

const CUSTOM_DECIDING_POINTS_OPTIONS = [3, 5, 7, 11, 15];

const CUSTOM_WIN_BY_OPTIONS = [1, 2];

/* =========================================================
   PAGE
========================================================= */

export default function VolleyballTournamentFixturesPage() {
  const params = useParams();

  const router = useRouter();

  const tournamentId =
    typeof params.tournamentId === "string" ? params.tournamentId : "";

  /* =====================================================
     UI STATE
  ===================================================== */

  const [createSheetOpen, setCreateSheetOpen] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [creatingMatchFixtureId, setCreatingMatchFixtureId] = useState<
    string | null
  >(null);

  /* =====================================================
     FIXTURE FORM STATE
  ===================================================== */

  const [stage, setStage] = useState<VolleyballTournamentStage>(
    VOLLEYBALL_TOURNAMENT_STAGES.LEAGUE,
  );

  const [roundNumber, setRoundNumber] = useState(1);

  const [groupName, setGroupName] = useState("");

  const [teamASlotMode, setTeamASlotMode] = useState<FixtureSlotMode>("TEAM");

  const [teamBSlotMode, setTeamBSlotMode] = useState<FixtureSlotMode>("TEAM");

  const [teamAId, setTeamAId] = useState("");

  const [teamBId, setTeamBId] = useState("");

  const [teamASourceFixtureId, setTeamASourceFixtureId] = useState("");

  const [teamBSourceFixtureId, setTeamBSourceFixtureId] = useState("");

  const [matchRulesPresetKey, setMatchRulesPresetKey] =
    useState<VolleyballMatchRulePreset>(
      VOLLEYBALL_MATCH_RULE_PRESETS.BEST_OF_5,
    );

  const [scheduledAt, setScheduledAt] = useState("");

  const [stageOpen, setStageOpen] = useState(false);

  const [rulesOpen, setRulesOpen] = useState(false);

  /* =====================================================
     CUSTOM RULE STATE
  ===================================================== */

  const [customFormatType, setCustomFormatType] =
    useState<CustomFormatType>("BEST_OF");

  const [customMaxSets, setCustomMaxSets] = useState(3);

  const [customTotalSets, setCustomTotalSets] = useState(3);

  const [customNormalSetPoints, setCustomNormalSetPoints] = useState(15);

  const [customDecidingSetPoints, setCustomDecidingSetPoints] = useState(11);

  const [customWinByMargin, setCustomWinByMargin] = useState(2);

  /* =====================================================
     API
  ===================================================== */

  const {
    data: tournament,
    isLoading: isTournamentLoading,
    isError: isTournamentError,
  } = useGetVolleyballTournamentQuery(
    {
      tournamentId,
    },
    {
      skip: !tournamentId,
    },
  );

  const {
    data: registeredTeams = [],
    isLoading: areTeamsLoading,
    isError: areTeamsError,
  } = useGetVolleyballTournamentTeamsQuery(
    {
      tournamentId,
    },
    {
      skip: !tournamentId,
    },
  );

  const {
    data: fixtures = [],
    isLoading: areFixturesLoading,
    isError: areFixturesError,
    refetch: refetchFixtures,
  } = useGetVolleyballTournamentFixturesQuery(
    {
      tournamentId,
    },
    {
      skip: !tournamentId,
    },
  );

  const {
    data: rulesResponse,
    isLoading: areRulesLoading,
    isError: areRulesError,
  } = useGetVolleyballMatchRulePresetsQuery();

  const [createFixture, { isLoading: isCreatingFixture }] =
    useCreateVolleyballTournamentFixtureMutation();

  const [createMatchFromFixture] =
    useCreateVolleyballMatchFromFixtureMutation();

  /* =====================================================
     STAGES
  ===================================================== */

  const stageOptions = useMemo<VolleyballTournamentStage[]>(() => {
    if (!tournament) {
      return [];
    }

    if (tournament.format === VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE) {
      return [VOLLEYBALL_TOURNAMENT_STAGES.LEAGUE];
    }

    if (tournament.format === VOLLEYBALL_TOURNAMENT_FORMATS.GROUP_KNOCKOUT) {
      return [
        VOLLEYBALL_TOURNAMENT_STAGES.GROUP_STAGE,
        VOLLEYBALL_TOURNAMENT_STAGES.ROUND_OF_16,
        VOLLEYBALL_TOURNAMENT_STAGES.QUARTER_FINAL,
        VOLLEYBALL_TOURNAMENT_STAGES.SEMI_FINAL,
        VOLLEYBALL_TOURNAMENT_STAGES.THIRD_PLACE,
        VOLLEYBALL_TOURNAMENT_STAGES.FINAL,
      ];
    }

    return [
      VOLLEYBALL_TOURNAMENT_STAGES.ROUND_OF_16,
      VOLLEYBALL_TOURNAMENT_STAGES.QUARTER_FINAL,
      VOLLEYBALL_TOURNAMENT_STAGES.SEMI_FINAL,
      VOLLEYBALL_TOURNAMENT_STAGES.THIRD_PLACE,
      VOLLEYBALL_TOURNAMENT_STAGES.FINAL,
    ];
  }, [tournament]);

  const isKnockoutStage = isKnockoutTournamentStage(stage);

  const supportsWinnerSource =
    isKnockoutStage && stage !== VOLLEYBALL_TOURNAMENT_STAGES.THIRD_PLACE;

  const requiresGroup = stage === VOLLEYBALL_TOURNAMENT_STAGES.GROUP_STAGE;

  /* =====================================================
     INITIAL STAGE
  ===================================================== */

  useEffect(() => {
    if (!tournament || stageOptions.length === 0) {
      return;
    }

    if (stageOptions.includes(stage)) {
      return;
    }

    setStage(
      getSuggestedInitialStage(
        tournament.format,
        registeredTeams.length,
        stageOptions,
      ),
    );
  }, [tournament, registeredTeams.length, stage, stageOptions]);

  useEffect(() => {
    if (
      !createSheetOpen ||
      fixtures.length > 0 ||
      !tournament ||
      stageOptions.length === 0
    ) {
      return;
    }

    setStage(
      getSuggestedInitialStage(
        tournament.format,
        registeredTeams.length,
        stageOptions,
      ),
    );
  }, [
    createSheetOpen,
    fixtures.length,
    tournament,
    registeredTeams.length,
    stageOptions,
  ]);

  /* =====================================================
     RULE PRESETS
  ===================================================== */

  const rulePresets = useMemo(() => {
    const presets = rulesResponse?.presets ?? [];

    if (!isKnockoutStage) {
      return presets;
    }

    return presets.filter(
      (preset) => preset.configuration.formatType === "BEST_OF",
    );
  }, [rulesResponse, isKnockoutStage]);

  const selectedRule = useMemo(
    () =>
      rulePresets.find((preset) => preset.key === matchRulesPresetKey) ?? null,
    [rulePresets, matchRulesPresetKey],
  );

  const isCustomRules =
    matchRulesPresetKey === VOLLEYBALL_MATCH_RULE_PRESETS.CUSTOM;

  const customSetsToWin =
    customFormatType === "BEST_OF" ? Math.floor(customMaxSets / 2) + 1 : null;

  /* =====================================================
     KNOCKOUT CUSTOM SAFETY
  ===================================================== */

  useEffect(() => {
    if (!isKnockoutStage) {
      return;
    }

    /*
     * A custom knockout fixture must remain winner-capable.
     */
    if (isCustomRules) {
      setCustomFormatType("BEST_OF");

      return;
    }

    const preset = rulesResponse?.presets?.find(
      (item) => item.key === matchRulesPresetKey,
    );

    if (preset?.configuration.formatType === "BEST_OF") {
      return;
    }

    setMatchRulesPresetKey(VOLLEYBALL_MATCH_RULE_PRESETS.BEST_OF_5);
  }, [isKnockoutStage, isCustomRules, matchRulesPresetKey, rulesResponse]);

  useEffect(() => {
    if (!rulePresets.length) {
      return;
    }

    /*
     * CUSTOM is a virtual frontend option.
     * It does not need to exist in GET presets.
     */
    if (matchRulesPresetKey === VOLLEYBALL_MATCH_RULE_PRESETS.CUSTOM) {
      return;
    }

    const exists = rulePresets.some(
      (preset) => preset.key === matchRulesPresetKey,
    );

    if (exists) {
      return;
    }

    setMatchRulesPresetKey(rulePresets[0].key);
  }, [rulePresets, matchRulesPresetKey]);

  /* =====================================================
     TEAMS
  ===================================================== */

  const groups = useMemo(
    () =>
      Array.from(
        new Set(
          registeredTeams
            .map((team) => team.groupName)
            .filter((value): value is string => Boolean(value)),
        ),
      ),
    [registeredTeams],
  );

  const availableTeams = useMemo(
    () =>
      filterTeamsForFixture(registeredTeams, requiresGroup ? groupName : null),
    [registeredTeams, requiresGroup, groupName],
  );

  const selectedTeamA = registeredTeams.find((team) => team.teamId === teamAId);

  const selectedTeamB = registeredTeams.find((team) => team.teamId === teamBId);

  /* =====================================================
     SOURCE FIXTURES
  ===================================================== */

  const sourceFixtures = useMemo(() => {
    if (!supportsWinnerSource) {
      return [];
    }

    const currentRank = getStageRank(stage);

    return fixtures.filter((fixture) => {
      const rank = getStageRank(fixture.stage);

      return rank >= 0 && rank < currentRank;
    });
  }, [fixtures, stage, supportsWinnerSource]);

  const selectedTeamASourceFixture = fixtures.find(
    (fixture) => fixture.id === teamASourceFixtureId,
  );

  const selectedTeamBSourceFixture = fixtures.find(
    (fixture) => fixture.id === teamBSourceFixtureId,
  );

  /* =====================================================
     FORM VALIDITY
  ===================================================== */

  const teamASlotReady =
    teamASlotMode === "TEAM" ? Boolean(teamAId) : Boolean(teamASourceFixtureId);

  const teamBSlotReady =
    teamBSlotMode === "TEAM" ? Boolean(teamBId) : Boolean(teamBSourceFixtureId);

  const customRulesValid =
    !isCustomRules ||
    (customNormalSetPoints >= 1 &&
      customWinByMargin >= 1 &&
      (customFormatType === "BEST_OF"
        ? customMaxSets >= 1 &&
          customMaxSets % 2 === 1 &&
          customDecidingSetPoints >= 1
        : customTotalSets >= 1));

  const matchRulesReady = isCustomRules
    ? customRulesValid
    : Boolean(selectedRule);

  const fixtureFormReady =
    teamASlotReady &&
    teamBSlotReady &&
    matchRulesReady &&
    (!requiresGroup || Boolean(groupName.trim()));

  /* =====================================================
     SCHEDULE GROUPING
  ===================================================== */

  const groupedFixtures = useMemo(() => {
    const sorted = [...fixtures].sort((a, b) => {
      const stageDiff =
        getFixtureDisplayRank(a.stage) - getFixtureDisplayRank(b.stage);

      if (stageDiff !== 0) {
        return stageDiff;
      }

      return a.roundNumber - b.roundNumber;
    });

    const map = new Map<
      VolleyballTournamentStage,
      VolleyballTournamentFixture[]
    >();

    sorted.forEach((fixture) => {
      const list = map.get(fixture.stage) ?? [];

      list.push(fixture);

      map.set(fixture.stage, list);
    });

    return Array.from(map.entries());
  }, [fixtures]);

  /* =====================================================
     SUCCESS MESSAGE
  ===================================================== */

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSuccessMessage("");
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [successMessage]);

  /* =====================================================
     CUSTOM RULE BUILDER
  ===================================================== */

  function buildCustomRules(): VolleyballMatchRulesOverrides {
    if (customFormatType === "BEST_OF") {
      return {
        formatType: "BEST_OF",

        maxSets: customMaxSets,

        totalSets: null,

        setsToWin: customSetsToWin,

        normalSetPoints: customNormalSetPoints,

        decidingSetPoints:
          customMaxSets === 1 ? customNormalSetPoints : customDecidingSetPoints,

        winByMargin: customWinByMargin,
      };
    }

    return {
      formatType: "FIXED_SETS",

      maxSets: null,

      totalSets: customTotalSets,

      setsToWin: null,

      normalSetPoints: customNormalSetPoints,

      decidingSetPoints: null,

      winByMargin: customWinByMargin,
    };
  }

  /* =====================================================
     OPEN CREATOR
  ===================================================== */

  function handleOpenCreateSheet() {
    setError("");

    setCreateSheetOpen(true);
  }

  /* =====================================================
     STAGE CHANGE
  ===================================================== */

  function handleStageChange(nextStage: VolleyballTournamentStage) {
    setError("");

    setStage(nextStage);

    setStageOpen(false);

    if (nextStage !== VOLLEYBALL_TOURNAMENT_STAGES.GROUP_STAGE) {
      setGroupName("");
    }

    if (isKnockoutTournamentStage(nextStage)) {
      setCustomFormatType("BEST_OF");
    }

    resetFixtureSlots();
  }

  /* =====================================================
     SLOT MODE
  ===================================================== */

  function handleTeamASlotModeChange(mode: FixtureSlotMode) {
    setError("");

    setTeamASlotMode(mode);

    if (mode === "TEAM") {
      setTeamASourceFixtureId("");
    } else {
      setTeamAId("");
    }
  }

  function handleTeamBSlotModeChange(mode: FixtureSlotMode) {
    setError("");

    setTeamBSlotMode(mode);

    if (mode === "TEAM") {
      setTeamBSourceFixtureId("");
    } else {
      setTeamBId("");
    }
  }

  /* =====================================================
     CREATE FIXTURE
  ===================================================== */

  async function handleCreateFixture() {
    if (!teamASlotReady) {
      setError("Configure Side A.");

      return;
    }

    if (!teamBSlotReady) {
      setError("Configure Side B.");

      return;
    }

    if (
      teamASlotMode === "TEAM" &&
      teamBSlotMode === "TEAM" &&
      teamAId === teamBId
    ) {
      setError("Both sides cannot use the same team.");

      return;
    }

    if (
      teamASlotMode === "WINNER" &&
      teamBSlotMode === "WINNER" &&
      teamASourceFixtureId === teamBSourceFixtureId
    ) {
      setError("Both sides cannot use the same source fixture.");

      return;
    }

    if (requiresGroup && !groupName.trim()) {
      setError("Select a group for this fixture.");

      return;
    }

    if (roundNumber < 1) {
      setError("Match number must be at least 1.");

      return;
    }

    if (
      isCustomRules &&
      customFormatType === "BEST_OF" &&
      customMaxSets % 2 === 0
    ) {
      setError("Best Of must use an odd number of maximum sets.");

      return;
    }

    if (isCustomRules && isKnockoutStage && customFormatType !== "BEST_OF") {
      setError(
        "Knockout matches must use Best Of rules so the fixture always produces a winner.",
      );

      return;
    }

    if (isCustomRules && (customNormalSetPoints < 1 || customWinByMargin < 1)) {
      setError("Custom rule values must be at least 1.");

      return;
    }

    setError("");

    try {
      await createFixture({
        tournamentId,

        body: {
          stage,

          roundNumber,

          ...(teamASlotMode === "TEAM"
            ? {
                teamAId,
              }
            : {
                teamASourceFixtureId,
              }),

          ...(teamBSlotMode === "TEAM"
            ? {
                teamBId,
              }
            : {
                teamBSourceFixtureId,
              }),

          ...(requiresGroup
            ? {
                groupName: groupName.trim(),
              }
            : {}),

          matchRulesPresetKey,

          ...(isCustomRules
            ? {
                customRules: buildCustomRules(),
              }
            : {}),

          ...(scheduledAt
            ? {
                scheduledAt: new Date(scheduledAt).toISOString(),
              }
            : {}),
        },
      }).unwrap();

      await refetchFixtures();

      resetFixtureForm();

      setCreateSheetOpen(false);

      setSuccessMessage("Fixture added to the schedule.");
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to create fixture."));
    }
  }

  /* =====================================================
     CREATE EXECUTION MATCH
  ===================================================== */

  async function handleCreateMatch(fixture: VolleyballTournamentFixture) {
    if (fixture.status !== VOLLEYBALL_FIXTURE_STATUSES.SCHEDULED) {
      return;
    }

    if (!fixture.teamAId || !fixture.teamBId) {
      setError("This fixture is still waiting for teams to be resolved.");

      return;
    }

    setError("");

    setCreatingMatchFixtureId(fixture.id);

    try {
      const match = await createMatchFromFixture({
        tournamentId,

        fixtureId: fixture.id,
      }).unwrap();

      const search = new URLSearchParams({
        tournamentId,

        fixtureId: fixture.id,
      });

      router.push(
        `/volleyball/matches/${match.id}/rosters?${search.toString()}`,
      );
    } catch (err) {
      setError(
        extractErrorMessage(err, "Failed to create match from fixture."),
      );
    } finally {
      setCreatingMatchFixtureId(null);
    }
  }

  /* =====================================================
     OPEN MATCH
  ===================================================== */

  function handleOpenFixtureMatch(fixture: VolleyballTournamentFixture) {
    if (!fixture.executionMatchId) {
      return;
    }

    const search = new URLSearchParams({
      tournamentId,

      fixtureId: fixture.id,
    });

    router.push(
      `/volleyball/matches/${fixture.executionMatchId}?${search.toString()}`,
    );
  }

  /* =====================================================
     QUICK CUSTOM PRESETS
  ===================================================== */

  function applyFastTestRules() {
    setCustomFormatType("BEST_OF");

    setCustomMaxSets(1);

    setCustomNormalSetPoints(5);

    setCustomDecidingSetPoints(5);

    setCustomWinByMargin(1);
  }

  function applyLocalShortRules() {
    setCustomFormatType("BEST_OF");

    setCustomMaxSets(3);

    setCustomNormalSetPoints(15);

    setCustomDecidingSetPoints(11);

    setCustomWinByMargin(2);
  }

  /* =====================================================
     RESET
  ===================================================== */

  function resetFixtureSlots() {
    setTeamAId("");
    setTeamBId("");

    setTeamASourceFixtureId("");

    setTeamBSourceFixtureId("");

    setTeamASlotMode("TEAM");

    setTeamBSlotMode("TEAM");
  }

  function resetFixtureForm() {
    resetFixtureSlots();

    setRoundNumber(1);

    setGroupName("");

    setScheduledAt("");

    setStageOpen(false);

    setRulesOpen(false);

    setError("");
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (
    isTournamentLoading ||
    areTeamsLoading ||
    areFixturesLoading ||
    areRulesLoading
  ) {
    return <FixturesPageSkeleton />;
  }

  /* =====================================================
     LOAD ERROR
  ===================================================== */

  if (
    isTournamentError ||
    areTeamsError ||
    areFixturesError ||
    areRulesError ||
    !tournament
  ) {
    return (
      <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) px-4">
        <div className="w-full max-w-sm rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center shadow-(--shadow-card)">
          <Trophy size={26} className="mx-auto text-(--color-brand)" />

          <p className="mt-3 text-sm font-black text-(--color-text-primary)">
            Unable to load tournament
          </p>

          <p className="mt-1 text-xs text-(--color-text-muted)">
            Please try again.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      <div className="min-h-full bg-(--color-bg-base)">
        <div className="flex flex-col gap-4 px-4 py-5 pb-28">
          {/* HEADER */}

          <div>
            <p className="text-section-label">Tournament Schedule</p>

            <h1 className="mt-1 truncate font-(family-name:--font-display) text-2xl font-black uppercase tracking-wide text-(--color-text-primary)">
              {tournament.name}
            </h1>

            <p className="mt-1 text-xs leading-5 text-(--color-text-secondary)">
              Build every match in the tournament, then play them from this
              schedule.
            </p>
          </div>

          {/* STEPS */}

          <div className="grid grid-cols-3 gap-2">
            <SetupStep number="1" label="Tournament" completed />

            <SetupStep number="2" label="Teams" completed />

            <SetupStep number="3" label="Schedule" active />
          </div>

          {/* SUMMARY */}

          <div className="overflow-hidden rounded-2xl bg-(--color-navy) text-white shadow-(--shadow-card)">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              <SummaryStat value={registeredTeams.length} label="Teams" />

              <SummaryStat value={fixtures.length} label="Fixtures" />

              <SummaryStat
                value={
                  fixtures.filter(
                    (fixture) =>
                      fixture.status === VOLLEYBALL_FIXTURE_STATUSES.COMPLETED,
                  ).length
                }
                label="Played"
              />
            </div>
          </div>

          {/* SUCCESS */}

          {successMessage && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check size={12} />
              </div>

              <div>
                <p className="text-xs font-black text-emerald-800">
                  {successMessage}
                </p>

                <p className="mt-0.5 text-[9px] text-emerald-700/75">
                  Continue building or playing the schedule below.
                </p>
              </div>
            </div>
          )}

          {/* ERROR */}

          {error && !createSheetOpen && (
            <div className="rounded-2xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-3">
              <p className="text-xs font-semibold text-(--color-live)">
                {error}
              </p>
            </div>
          )}

          {/* SCHEDULE */}

          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-section-label">Match Schedule</p>

                <p className="mt-1 text-[10px] text-(--color-text-muted)">
                  {fixtures.length === 0
                    ? "No fixtures yet"
                    : `${fixtures.length} fixture${
                        fixtures.length === 1 ? "" : "s"
                      } created`}
                </p>
              </div>

              {fixtures.length > 0 && (
                <button
                  type="button"
                  onClick={handleOpenCreateSheet}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-(--color-brand) px-3 text-[10px] font-black text-white"
                >
                  <Plus size={14} />
                  Add Fixture
                </button>
              )}
            </div>

            {fixtures.length === 0 ? (
              <EmptySchedule onCreate={handleOpenCreateSheet} />
            ) : (
              <div className="space-y-5">
                {groupedFixtures.map(([fixtureStage, stageFixtures]) => (
                  <FixtureStageSection
                    key={fixtureStage}
                    stage={fixtureStage}
                    fixtures={stageFixtures}
                    allFixtures={fixtures}
                    creatingMatchFixtureId={creatingMatchFixtureId}
                    onCreateMatch={handleCreateMatch}
                    onOpenMatch={handleOpenFixtureMatch}
                  />
                ))}

                <button
                  type="button"
                  onClick={handleOpenCreateSheet}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-(--color-brand)/30 bg-(--color-bg-card) px-4 py-4 text-(--color-brand)"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-(--color-bg-tint)">
                    <Plus size={14} />
                  </div>

                  <div className="text-left">
                    <p className="text-xs font-black">Add another fixture</p>

                    <p className="mt-0.5 text-[9px] font-medium text-(--color-text-muted)">
                      Add another match or knockout round.
                    </p>
                  </div>
                </button>
              </div>
            )}
          </section>
        </div>

        {/* {fixtures.length > 0 && (
          <div className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-(--color-bg-border) bg-(--color-bg-card)/95 px-4 py-3 backdrop-blur">
            <div className="mx-auto w-full max-w-xl">
              <Button fullWidth onClick={handleOpenCreateSheet}>
                <Plus size={16} />
                Add Fixture
              </Button>
            </div>
          </div>
        )} */}
      </div>

      {/* =================================================
          ADD FIXTURE SHEET
      ================================================= */}

      {createSheetOpen && (
        <DialogBottom
          open={createSheetOpen}
          onClose={() => {
            if (isCreatingFixture) {
              return;
            }

            setCreateSheetOpen(false);

            setError("");
          }}
          className="h-[92dvh] max-h-[92dvh] overflow-hidden rounded-t-3xl bg-(--color-bg-card)"
        >
          <div className="flex h-full min-h-0 flex-col">
            {/* SHEET HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-(--color-text-muted)">
                  Tournament Schedule
                </p>

                <h2 className="mt-0.5 font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
                  {fixtures.length === 0
                    ? "Create First Fixture"
                    : "Add Another Fixture"}
                </h2>

                <p className="mt-0.5 text-[9px] text-(--color-text-muted)">
                  {fixtures.length} already added
                </p>
              </div>

              <button
                type="button"
                disabled={isCreatingFixture}
                onClick={() => {
                  setCreateSheetOpen(false);

                  setError("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-bg-base) text-(--color-text-secondary)"
              >
                <X size={18} />
              </button>
            </div>

            {/* SHEET BODY */}

            <div className="min-h-0 flex-1 overflow-y-auto bg-(--color-bg-base) px-4 py-4 scrollbar-none">
              <div className="space-y-4">
                {/* INFO */}

                <div className="rounded-2xl bg-(--color-bg-tint) px-3 py-3">
                  <p className="text-[10px] font-black text-(--color-brand)">
                    One fixture = one tournament match
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-(--color-text-secondary)">
                    A 4-team knockout usually needs two semi-finals and one
                    final. You can give every fixture its own match rules.
                  </p>
                </div>

                {/* ERROR */}

                {error && (
                  <div className="rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-2.5">
                    <p className="text-xs font-semibold text-(--color-live)">
                      {error}
                    </p>
                  </div>
                )}

                {/* STAGE */}

                <div>
                  <FieldLabel>Match Stage</FieldLabel>

                  <SelectShell
                    open={stageOpen}
                    onClick={() => setStageOpen((value) => !value)}
                  >
                    <div>
                      <p className="text-xs font-black">{formatStage(stage)}</p>

                      <p className="mt-0.5 text-[9px] font-normal text-(--color-text-muted)">
                        Where this match belongs in the tournament.
                      </p>
                    </div>
                  </SelectShell>

                  {stageOpen && (
                    <OptionPanel>
                      {stageOptions.map((option) => (
                        <OptionButton
                          key={option}
                          selected={option === stage}
                          onClick={() => handleStageChange(option)}
                        >
                          {formatStage(option)}
                        </OptionButton>
                      ))}
                    </OptionPanel>
                  )}
                </div>

                {/* MATCH NUMBER */}

                <div>
                  <FieldLabel>Match Number</FieldLabel>

                  <input
                    type="number"
                    min={1}
                    value={roundNumber}
                    onChange={(event) => {
                      setRoundNumber(
                        Math.max(1, Number(event.target.value) || 1),
                      );
                    }}
                    className={inputClassName()}
                  />

                  <p className="mt-1 text-[9px] text-(--color-text-muted)">
                    Example: Semi Final 1, Semi Final 2.
                  </p>
                </div>

                {/* GROUP */}

                {requiresGroup && (
                  <div>
                    <FieldLabel>Pool / Group</FieldLabel>

                    {groups.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {groups.map((group) => (
                          <button
                            key={group}
                            type="button"
                            onClick={() => {
                              setGroupName(group);

                              resetFixtureSlots();

                              setError("");
                            }}
                            className={cn(
                              "h-10 rounded-xl border text-[10px] font-black",

                              groupName === group
                                ? "border-(--color-brand) bg-(--color-brand) text-white"
                                : "border-(--color-bg-border) bg-(--color-bg-card) text-(--color-text-secondary)",
                            )}
                          >
                            {group}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        value={groupName}
                        onChange={(event) => setGroupName(event.target.value)}
                        placeholder="e.g. Pool A"
                        className={inputClassName()}
                      />
                    )}
                  </div>
                )}

                {/* MATCHUP */}

                <div className="pt-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-(--color-brand)">
                    Matchup
                  </p>

                  <p className="mt-1 text-[9px] text-(--color-text-muted)">
                    Pick real teams or connect winners from earlier knockout
                    matches.
                  </p>
                </div>

                <FixtureSlotSelector
                  label="Side A"
                  mode={teamASlotMode}
                  allowWinnerSource={supportsWinnerSource}
                  selectedTeam={selectedTeamA}
                  selectedSourceFixture={selectedTeamASourceFixture}
                  teams={availableTeams}
                  sourceFixtures={sourceFixtures}
                  disabledTeamId={teamBId || undefined}
                  disabledSourceFixtureId={teamBSourceFixtureId || undefined}
                  onChangeMode={handleTeamASlotModeChange}
                  onSelectTeam={(team) => {
                    setTeamAId(team.teamId);

                    setError("");
                  }}
                  onSelectSource={(fixture) => {
                    setTeamASourceFixtureId(fixture.id);

                    setError("");
                  }}
                />

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-(--color-bg-border)" />

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-(--color-navy) font-(family-name:--font-display) text-[9px] font-black text-white">
                    VS
                  </div>

                  <div className="h-px flex-1 bg-(--color-bg-border)" />
                </div>

                <FixtureSlotSelector
                  label="Side B"
                  mode={teamBSlotMode}
                  allowWinnerSource={supportsWinnerSource}
                  selectedTeam={selectedTeamB}
                  selectedSourceFixture={selectedTeamBSourceFixture}
                  teams={availableTeams}
                  sourceFixtures={sourceFixtures}
                  disabledTeamId={teamAId || undefined}
                  disabledSourceFixtureId={teamASourceFixtureId || undefined}
                  onChangeMode={handleTeamBSlotModeChange}
                  onSelectTeam={(team) => {
                    setTeamBId(team.teamId);

                    setError("");
                  }}
                  onSelectSource={(fixture) => {
                    setTeamBSourceFixtureId(fixture.id);

                    setError("");
                  }}
                />

                {/* MATCH FORMAT */}

                <div>
                  <div className="flex items-end justify-between gap-3">
                    <FieldLabel>Match Format</FieldLabel>

                    {isKnockoutStage && (
                      <span className="mb-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-black text-emerald-700">
                        Winner required
                      </span>
                    )}
                  </div>

                  <SelectShell
                    open={rulesOpen}
                    onClick={() => setRulesOpen((value) => !value)}
                  >
                    <div>
                      <p className="text-xs font-black">
                        {isCustomRules
                          ? "Custom Rules"
                          : (selectedRule?.name ?? "Select format")}
                      </p>

                      <p className="mt-0.5 text-[9px] font-normal text-(--color-text-muted)">
                        {isCustomRules
                          ? formatCustomRulesSummary(
                              customFormatType,
                              customMaxSets,
                              customTotalSets,
                              customSetsToWin,
                              customNormalSetPoints,
                              customDecidingSetPoints,
                              customWinByMargin,
                            )
                          : selectedRule
                            ? formatRuleSummary(selectedRule.configuration)
                            : "Choose match format"}
                      </p>
                    </div>
                  </SelectShell>

                  {rulesOpen && (
                    <OptionPanel>
                      {rulePresets.map((preset) => {
                        const selected = preset.key === matchRulesPresetKey;

                        const isCustom =
                          preset.key === VOLLEYBALL_MATCH_RULE_PRESETS.CUSTOM;

                        return (
                          <button
                            key={preset.key}
                            type="button"
                            onClick={() => {
                              setMatchRulesPresetKey(preset.key);

                              if (isCustom && isKnockoutStage) {
                                setCustomFormatType("BEST_OF");
                              }

                              setRulesOpen(false);

                              setError("");
                            }}
                            className={cn(
                              "flex w-full items-start gap-3 border-b border-(--color-bg-border) px-3 py-3 text-left last:border-b-0",

                              selected
                                ? "bg-(--color-bg-tint)"
                                : "bg-(--color-bg-card)",
                            )}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-base)">
                              {isCustom ? (
                                <Settings2
                                  size={15}
                                  className="text-(--color-brand)"
                                />
                              ) : (
                                <CircleDot
                                  size={14}
                                  className="text-(--color-text-secondary)"
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-black text-(--color-text-primary)">
                                {isCustom ? "Custom Rules" : preset.name}
                              </p>

                              <p className="mt-0.5 text-[9px] leading-4 text-(--color-text-muted)">
                                {isCustom
                                  ? "Choose sets, points and winning margin."
                                  : formatRuleSummary(preset.configuration)}
                              </p>
                            </div>

                            {selected && (
                              <Check
                                size={14}
                                className="mt-1 shrink-0 text-(--color-brand)"
                              />
                            )}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          setMatchRulesPresetKey(
                            VOLLEYBALL_MATCH_RULE_PRESETS.CUSTOM,
                          );

                          if (isKnockoutStage) {
                            setCustomFormatType("BEST_OF");
                          }

                          setRulesOpen(false);
                          setError("");
                        }}
                        className={cn(
                          "flex w-full items-start gap-3 border-b border-(--color-bg-border) px-3 py-3 text-left last:border-b-0",

                          isCustomRules
                            ? "bg-(--color-bg-tint)"
                            : "bg-(--color-bg-card)",
                        )}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-base)">
                          <Settings2
                            size={15}
                            className="text-(--color-brand)"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-(--color-text-primary)">
                            Custom Rules
                          </p>

                          <p className="mt-0.5 text-[9px] leading-4 text-(--color-text-muted)">
                            Choose sets, target points and winning margin.
                          </p>
                        </div>

                        {isCustomRules && (
                          <Check
                            size={14}
                            className="mt-1 shrink-0 text-(--color-brand)"
                          />
                        )}
                      </button>
                    </OptionPanel>
                  )}

                  {isKnockoutStage && (
                    <p className="mt-1.5 text-[9px] leading-4 text-(--color-text-muted)">
                      Knockout matches must use a winner-capable Best Of format.
                    </p>
                  )}
                </div>

                {/* CUSTOM RULES */}

                {isCustomRules && (
                  <CustomRulesEditor
                    knockout={isKnockoutStage}
                    formatType={customFormatType}
                    maxSets={customMaxSets}
                    totalSets={customTotalSets}
                    normalSetPoints={customNormalSetPoints}
                    decidingSetPoints={customDecidingSetPoints}
                    winByMargin={customWinByMargin}
                    setsToWin={customSetsToWin}
                    onFormatTypeChange={setCustomFormatType}
                    onMaxSetsChange={setCustomMaxSets}
                    onTotalSetsChange={setCustomTotalSets}
                    onNormalSetPointsChange={setCustomNormalSetPoints}
                    onDecidingSetPointsChange={setCustomDecidingSetPoints}
                    onWinByMarginChange={setCustomWinByMargin}
                    onFastTest={applyFastTestRules}
                    onLocalShort={applyLocalShortRules}
                  />
                )}

                {/* SCHEDULE */}

                <div>
                  <FieldLabel>Match Time</FieldLabel>

                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(event) => setScheduledAt(event.target.value)}
                    className={inputClassName()}
                  />

                  <p className="mt-1 text-[9px] text-(--color-text-muted)">
                    Optional. You can leave this empty.
                  </p>
                </div>
              </div>
            </div>

            {/* SHEET FOOTER */}

            <div className="safe-bottom shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3 shadow-[0_-8px_24px_rgba(13,27,62,0.06)]">
              <Button
                fullWidth
                loading={isCreatingFixture}
                disabled={isCreatingFixture || !fixtureFormReady}
                onClick={handleCreateFixture}
              >
                <Plus size={16} />

                {fixtures.length === 0
                  ? "Create First Fixture"
                  : "Add Fixture to Schedule"}
              </Button>
            </div>
          </div>
        </DialogBottom>
      )}
    </>
  );
}

/* =========================================================
   CUSTOM RULES EDITOR
========================================================= */

function CustomRulesEditor({
  knockout,
  formatType,
  maxSets,
  totalSets,
  normalSetPoints,
  decidingSetPoints,
  winByMargin,
  setsToWin,
  onFormatTypeChange,
  onMaxSetsChange,
  onTotalSetsChange,
  onNormalSetPointsChange,
  onDecidingSetPointsChange,
  onWinByMarginChange,
  onFastTest,
  onLocalShort,
}: {
  knockout: boolean;

  formatType: CustomFormatType;

  maxSets: number;

  totalSets: number;

  normalSetPoints: number;

  decidingSetPoints: number;

  winByMargin: number;

  setsToWin: number | null;

  onFormatTypeChange: (value: CustomFormatType) => void;

  onMaxSetsChange: (value: number) => void;

  onTotalSetsChange: (value: number) => void;

  onNormalSetPointsChange: (value: number) => void;

  onDecidingSetPointsChange: (value: number) => void;

  onWinByMarginChange: (value: number) => void;

  onFastTest: () => void;

  onLocalShort: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-(--color-brand)/20 bg-(--color-bg-card)">
      {/* HEADER */}

      <div className="border-b border-(--color-bg-border) bg-(--color-bg-tint) px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-brand) text-white">
            <Settings2 size={15} />
          </div>

          <div>
            <p className="text-xs font-black text-(--color-text-primary)">
              Custom Match Rules
            </p>

            <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
              Configure this fixture exactly how local players play it.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-3">
        {/* QUICK OPTIONS */}

        <div>
          <FieldLabel>Quick Setup</FieldLabel>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onFastTest}
              className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-2.5 text-left"
            >
              <p className="text-[10px] font-black text-(--color-text-primary)">
                ⚡ Fast Test
              </p>

              <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
                1 set · 5 pts · win by 1
              </p>
            </button>

            <button
              type="button"
              onClick={onLocalShort}
              className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-2.5 text-left"
            >
              <p className="text-[10px] font-black text-(--color-text-primary)">
                Local Short
              </p>

              <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
                Best of 3 · 15 / 11
              </p>
            </button>
          </div>
        </div>

        {/* STRUCTURE */}

        <div>
          <FieldLabel>Match Structure</FieldLabel>

          <div
            className={cn(
              "grid gap-2",

              knockout ? "grid-cols-1" : "grid-cols-2",
            )}
          >
            <RuleChoiceButton
              selected={formatType === "BEST_OF"}
              onClick={() => onFormatTypeChange("BEST_OF")}
              label="Best Of"
              description="First team to required set wins"
            />

            {!knockout && (
              <RuleChoiceButton
                selected={formatType === "FIXED_SETS"}
                onClick={() => onFormatTypeChange("FIXED_SETS")}
                label="Fixed Sets"
                description="Play every scheduled set"
              />
            )}
          </div>

          {knockout && (
            <p className="mt-1.5 text-[8px] text-(--color-text-muted)">
              Knockout fixtures must produce one winner, so Fixed Sets is not
              available here.
            </p>
          )}
        </div>

        {/* BEST OF */}

        {formatType === "BEST_OF" ? (
          <>
            <RuleOptionSection
              label="Maximum Sets"
              options={CUSTOM_MAX_SET_OPTIONS}
              value={maxSets}
              onChange={onMaxSetsChange}
            />

            <div className="rounded-xl bg-(--color-bg-tint) px-3 py-2.5">
              <p className="text-[9px] font-black text-(--color-brand)">
                First to {setsToWin} set
                {setsToWin === 1 ? "" : "s"} wins
              </p>

              <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
                YuvaCrix derives this automatically from Best of {maxSets}.
              </p>
            </div>
          </>
        ) : (
          <RuleOptionSection
            label="Total Sets"
            options={CUSTOM_TOTAL_SET_OPTIONS}
            value={totalSets}
            onChange={onTotalSetsChange}
          />
        )}

        {/* NORMAL POINTS */}

        <RuleOptionSection
          label={formatType === "BEST_OF" ? "Regular Set Points" : "Set Points"}
          options={CUSTOM_NORMAL_POINTS_OPTIONS}
          value={normalSetPoints}
          onChange={onNormalSetPointsChange}
        />

        {/* DECIDER */}

        {formatType === "BEST_OF" && maxSets > 1 && (
          <RuleOptionSection
            label="Deciding Set Points"
            options={CUSTOM_DECIDING_POINTS_OPTIONS}
            value={decidingSetPoints}
            onChange={onDecidingSetPointsChange}
          />
        )}

        {/* WIN BY */}

        <RuleOptionSection
          label="Win By"
          options={CUSTOM_WIN_BY_OPTIONS}
          value={winByMargin}
          onChange={onWinByMarginChange}
        />

        {/* PREVIEW */}

        <div className="overflow-hidden rounded-2xl bg-(--color-navy) text-white">
          <div className="border-b border-white/10 px-3 py-2">
            <p className="text-[8px] font-black uppercase tracking-[0.14em] text-white/45">
              Match Preview
            </p>
          </div>

          <div className="space-y-2 px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[9px] text-white/55">Format</span>

              <span className="text-[10px] font-black">
                {formatType === "BEST_OF"
                  ? `Best of ${maxSets}`
                  : `${totalSets} Fixed Set${totalSets === 1 ? "" : "s"}`}
              </span>
            </div>

            {formatType === "BEST_OF" && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-[9px] text-white/55">Match win</span>

                <span className="text-[10px] font-black">
                  First to {setsToWin}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <span className="text-[9px] text-white/55">Set points</span>

              <span className="text-[10px] font-black">{normalSetPoints}</span>
            </div>

            {formatType === "BEST_OF" && maxSets > 1 && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-[9px] text-white/55">Deciding set</span>

                <span className="text-[10px] font-black">
                  {decidingSetPoints}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <span className="text-[9px] text-white/55">Win by</span>

              <span className="text-[10px] font-black">{winByMargin}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   RULE CHOICE
========================================================= */

function RuleChoiceButton({
  selected,
  onClick,
  label,
  description,
}: {
  selected: boolean;

  onClick: () => void;

  label: string;

  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3 py-2.5 text-left transition",

        selected
          ? "border-(--color-brand) bg-(--color-bg-tint)"
          : "border-(--color-bg-border) bg-(--color-bg-base)",
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",

            selected
              ? "border-(--color-brand) bg-(--color-brand)"
              : "border-(--color-bg-border)",
          )}
        >
          {selected && <Check size={9} className="text-white" />}
        </div>

        <p className="text-[10px] font-black text-(--color-text-primary)">
          {label}
        </p>
      </div>

      <p className="mt-1 pl-6 text-[8px] leading-4 text-(--color-text-muted)">
        {description}
      </p>
    </button>
  );
}

/* =========================================================
   RULE OPTION SECTION
========================================================= */

function RuleOptionSection({
  label,
  options,
  value,
  onChange,
}: {
  label: string;

  options: number[];

  value: number;

  onChange: (value: number) => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "min-w-10 rounded-xl border px-3 py-2 text-[10px] font-black",

              value === option
                ? "border-(--color-brand) bg-(--color-brand) text-white"
                : "border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-secondary)",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   STAGE SECTION
========================================================= */

function FixtureStageSection({
  stage,
  fixtures,
  allFixtures,
  creatingMatchFixtureId,
  onCreateMatch,
  onOpenMatch,
}: {
  stage: VolleyballTournamentStage;

  fixtures: VolleyballTournamentFixture[];

  allFixtures: VolleyballTournamentFixture[];

  creatingMatchFixtureId: string | null;

  onCreateMatch: (fixture: VolleyballTournamentFixture) => void;

  onOpenMatch: (fixture: VolleyballTournamentFixture) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-(--color-brand)" />

        <p className="text-xs font-black uppercase tracking-wide text-(--color-text-primary)">
          {formatStage(stage)}
        </p>

        <span className="rounded-full bg-(--color-bg-card) px-2 py-0.5 text-[8px] font-black text-(--color-text-muted)">
          {fixtures.length}
        </span>
      </div>

      <div className="space-y-3">
        {fixtures.map((fixture) => (
          <FixtureCard
            key={fixture.id}
            fixture={fixture}
            allFixtures={allFixtures}
            creatingMatch={creatingMatchFixtureId === fixture.id}
            onCreateMatch={() => onCreateMatch(fixture)}
            onOpenMatch={() => onOpenMatch(fixture)}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   FIXTURE CARD
========================================================= */

function FixtureCard({
  fixture,
  allFixtures,
  creatingMatch,
  onCreateMatch,
  onOpenMatch,
}: {
  fixture: VolleyballTournamentFixture;

  allFixtures: VolleyballTournamentFixture[];

  creatingMatch: boolean;

  onCreateMatch: () => void;

  onOpenMatch: () => void;
}) {
  /* =====================================================
     BASIC STATE
  ===================================================== */

  const teamsResolved = Boolean(fixture.teamAId && fixture.teamBId);

  const hasSourceSlots = Boolean(
    fixture.teamASourceFixtureId || fixture.teamBSourceFixtureId,
  );

  const canCreateMatch =
    fixture.status === VOLLEYBALL_FIXTURE_STATUSES.SCHEDULED &&
    !fixture.executionMatchId &&
    teamsResolved;

  const waitingForTeams =
    fixture.status === VOLLEYBALL_FIXTURE_STATUSES.SCHEDULED &&
    !fixture.executionMatchId &&
    !teamsResolved &&
    hasSourceSlots;

  const isCompleted = fixture.status === VOLLEYBALL_FIXTURE_STATUSES.COMPLETED;

  const isKnockout = isKnockoutTournamentStage(fixture.stage);

  /* =====================================================
     SIDE LABELS
  ===================================================== */

  const sideA = getFixtureSlotLabel(fixture, "A", allFixtures);

  const sideB = getFixtureSlotLabel(fixture, "B", allFixtures);

  /* =====================================================
     AUTOMATIC PROGRESSION STATE
  ===================================================== */

  const downstreamFixture = getDownstreamFixture(fixture, allFixtures);

  const hasDownstreamFixture = Boolean(downstreamFixture);

  const progressedToDownstream = downstreamFixture
    ? isWinnerResolvedInDownstream(fixture, downstreamFixture)
    : false;

  const waitingForAutomaticProgression =
    isCompleted &&
    isKnockout &&
    hasDownstreamFixture &&
    !progressedToDownstream;

  const isTournamentFinal =
    fixture.stage === VOLLEYBALL_TOURNAMENT_STAGES.FINAL;

  return (
    <div className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-sm">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between gap-3 border-b border-(--color-bg-border) px-3 py-2.5">
        <div>
          <p className="text-[9px] font-black uppercase tracking-wide text-(--color-brand)">
            {formatStage(fixture.stage)} {fixture.roundNumber}
          </p>

          {fixture.groupName && (
            <p className="mt-0.5 text-[8px] font-bold text-(--color-text-muted)">
              {fixture.groupName}
            </p>
          )}
        </div>

        <FixtureStatusBadge status={fixture.status} />
      </div>

      {/* =================================================
          BODY
      ================================================= */}

      <div className="p-3">
        {/* MATCHUP */}

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <FixtureSide
            name={sideA.name}
            logoUrl={fixture.teamASnapshot?.logoUrl}
            source={sideA.source}
          />

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--color-bg-base) font-(family-name:--font-display) text-[9px] font-black text-(--color-text-muted)">
            VS
          </div>

          <FixtureSide
            right
            name={sideB.name}
            logoUrl={fixture.teamBSnapshot?.logoUrl}
            source={sideB.source}
          />
        </div>

        {/* META */}

        {(fixture.scheduledAt || fixture.matchRulesSnapshot) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-(--color-bg-border) pt-2.5">
            {fixture.scheduledAt && (
              <div className="flex items-center gap-1 text-[9px] text-(--color-text-muted)">
                <CalendarDays size={11} />

                {formatSchedule(fixture.scheduledAt)}
              </div>
            )}

            {fixture.matchRulesSnapshot && (
              <div className="flex items-center gap-1 text-[9px] text-(--color-text-muted)">
                <CircleDot size={10} />

                {formatFixtureRuleSummary(fixture.matchRulesSnapshot)}
              </div>
            )}
          </div>
        )}

        {/* =================================================
            WAITING FOR SOURCE WINNERS
        ================================================= */}

        {waitingForTeams && (
          <WaitingForTeams fixture={fixture} fixtures={allFixtures} />
        )}

        {/* =================================================
            COMPLETED WINNER
        ================================================= */}
        {isCompleted && isKnockout && hasDownstreamFixture && (
          <div className="mt-3 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50">
            <div className="flex items-center gap-3 px-3 py-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <Trophy size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-black uppercase tracking-[0.14em] text-emerald-600">
                  Match Completed
                </p>

                <p className="mt-0.5 text-xs font-black text-emerald-900">
                  {progressedToDownstream
                    ? "Next round updated"
                    : "Result confirmed"}
                </p>
              </div>

              {progressedToDownstream && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check size={12} />
                </div>
              )}
            </div>

            {progressedToDownstream && downstreamFixture && (
              <div className="flex items-center gap-2 border-t border-emerald-200 bg-white/40 px-3 py-2">
                <Check size={11} className="shrink-0 text-emerald-600" />

                <p className="text-[8px] font-bold text-emerald-700">
                  Qualified team placed in{" "}
                  {formatStage(downstreamFixture.stage)}
                </p>
              </div>
            )}

            {waitingForAutomaticProgression && (
              <div className="flex items-start gap-2 border-t border-amber-200 bg-amber-50 px-3 py-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />

                <div>
                  <p className="text-[8px] font-black text-amber-800">
                    Waiting for bracket update
                  </p>

                  <p className="mt-0.5 text-[8px] leading-4 text-amber-700/75">
                    This match is complete. The next-round slot has not been
                    updated yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================
            CREATE EXECUTION MATCH
        ================================================= */}

        {canCreateMatch && (
          <button
            type="button"
            disabled={creatingMatch}
            onClick={onCreateMatch}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-(--color-brand) text-xs font-black text-white disabled:opacity-50"
          >
            {creatingMatch ? (
              <LoadingSpinner />
            ) : (
              <>
                <Play size={14} />
                Create Match
              </>
            )}
          </button>
        )}

        {/* =================================================
            OPEN EXECUTION MATCH
        ================================================= */}

        {fixture.executionMatchId && (
          <button
            type="button"
            onClick={onOpenMatch}
            className={cn(
              "mt-3 flex h-10 w-full items-center justify-center rounded-xl border text-xs font-black",

              fixture.status === VOLLEYBALL_FIXTURE_STATUSES.LIVE
                ? "border-red-200 bg-red-50 text-red-600"
                : fixture.status === VOLLEYBALL_FIXTURE_STATUSES.COMPLETED
                  ? "border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-secondary)"
                  : "border-(--color-brand)/25 bg-(--color-bg-tint) text-(--color-brand)",
            )}
          >
            {fixture.status === VOLLEYBALL_FIXTURE_STATUSES.LIVE
              ? "Open Live Match"
              : fixture.status === VOLLEYBALL_FIXTURE_STATUSES.COMPLETED
                ? "View Match"
                : "Open Match"}
          </button>
        )}
      </div>
    </div>
  );
}

function WaitingForTeams({
  fixture,
  fixtures,
}: {
  fixture: VolleyballTournamentFixture;

  fixtures: VolleyballTournamentFixture[];
}) {
  const teamAWaiting =
    !fixture.teamAId && Boolean(fixture.teamASourceFixtureId);

  const teamBWaiting =
    !fixture.teamBId && Boolean(fixture.teamBSourceFixtureId);

  const teamASource = fixture.teamASourceFixtureId
    ? fixtures.find((item) => item.id === fixture.teamASourceFixtureId)
    : null;

  const teamBSource = fixture.teamBSourceFixtureId
    ? fixtures.find((item) => item.id === fixture.teamBSourceFixtureId)
    : null;

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-(--color-brand)/15 bg-(--color-bg-tint)">
      <div className="px-3 py-2.5">
        <p className="text-[9px] font-black text-(--color-brand)">
          Waiting for teams
        </p>

        <p className="mt-0.5 text-[8px] leading-4 text-(--color-text-muted)">
          This match becomes ready automatically when its source matches are
          resolved.
        </p>
      </div>

      {(teamAWaiting || teamBWaiting) && (
        <div className="border-t border-(--color-brand)/10 bg-(--color-bg-card)/55 px-3 py-2">
          <div className="space-y-1.5">
            {teamAWaiting && (
              <WaitingSourceRow label="Side A" source={teamASource} />
            )}

            {teamBWaiting && (
              <WaitingSourceRow label="Side B" source={teamBSource} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function WaitingSourceRow({
  label,
  source,
}: {
  label: string;

  source: VolleyballTournamentFixture | null | undefined;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[8px] font-bold text-(--color-text-muted)">
        {label}
      </span>

      <span className="truncate text-right text-[8px] font-black text-(--color-text-secondary)">
        {source
          ? `Winner of ${formatStage(source.stage)} ${source.roundNumber}`
          : "Previous match winner"}
      </span>
    </div>
  );
}

function isWinnerResolvedInDownstream(
  fixture: VolleyballTournamentFixture,
  downstream: VolleyballTournamentFixture,
) {
  if (downstream.teamASourceFixtureId === fixture.id) {
    return Boolean(downstream.teamAId && downstream.teamASnapshot);
  }

  if (downstream.teamBSourceFixtureId === fixture.id) {
    return Boolean(downstream.teamBId && downstream.teamBSnapshot);
  }

  return false;
}

/* =========================================================
   FIXTURE SLOT
========================================================= */

function FixtureSlotSelector({
  label,
  mode,
  allowWinnerSource,
  selectedTeam,
  selectedSourceFixture,
  teams,
  sourceFixtures,
  disabledTeamId,
  disabledSourceFixtureId,
  onChangeMode,
  onSelectTeam,
  onSelectSource,
}: {
  label: string;

  mode: FixtureSlotMode;

  allowWinnerSource: boolean;

  selectedTeam: VolleyballTournamentTeam | undefined;

  selectedSourceFixture: VolleyballTournamentFixture | undefined;

  teams: VolleyballTournamentTeam[];

  sourceFixtures: VolleyballTournamentFixture[];

  disabledTeamId?: string;

  disabledSourceFixtureId?: string;

  onChangeMode: (mode: FixtureSlotMode) => void;

  onSelectTeam: (team: VolleyballTournamentTeam) => void;

  onSelectSource: (fixture: VolleyballTournamentFixture) => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>

      {allowWinnerSource && (
        <div className="mb-2 grid grid-cols-2 gap-2">
          <SlotModeButton
            selected={mode === "TEAM"}
            onClick={() => onChangeMode("TEAM")}
          >
            Pick Team
          </SlotModeButton>

          <SlotModeButton
            selected={mode === "WINNER"}
            onClick={() => onChangeMode("WINNER")}
          >
            Winner of Match
          </SlotModeButton>
        </div>
      )}

      {mode === "TEAM" ? (
        <FixtureTeamSelector
          value={selectedTeam}
          teams={teams}
          disabledTeamId={disabledTeamId}
          onSelect={onSelectTeam}
        />
      ) : (
        <SourceFixtureSelector
          value={selectedSourceFixture}
          fixtures={sourceFixtures}
          disabledFixtureId={disabledSourceFixtureId}
          onSelect={onSelectSource}
        />
      )}
    </div>
  );
}

/* =========================================================
   SLOT BUTTON
========================================================= */

function SlotModeButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;

  onClick: () => void;

  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 rounded-xl border text-[9px] font-black",

        selected
          ? "border-(--color-brand) bg-(--color-brand) text-white"
          : "border-(--color-bg-border) bg-(--color-bg-card) text-(--color-text-secondary)",
      )}
    >
      {children}
    </button>
  );
}

/* =========================================================
   TEAM SELECTOR
========================================================= */

function FixtureTeamSelector({
  value,
  teams,
  disabledTeamId,
  onSelect,
}: {
  value: VolleyballTournamentTeam | undefined;

  teams: VolleyballTournamentTeam[];

  disabledTeamId?: string;

  onSelect: (team: VolleyballTournamentTeam) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={selectButtonClassName()}
      >
        {value ? (
          <TeamIdentity
            snapshot={value.teamSnapshot}
            groupName={value.groupName}
          />
        ) : (
          <span className="text-xs font-semibold text-(--color-text-muted)">
            Select team
          </span>
        )}

        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-(--color-text-muted)",

            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="mt-2 max-h-60 overflow-y-auto rounded-xl border border-(--color-bg-border)">
          {teams.map((team) => {
            const disabled = team.teamId === disabledTeamId;

            const selected = value?.teamId === team.teamId;

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
                  "flex w-full items-center justify-between gap-3 border-b border-(--color-bg-border) px-3 py-2.5 text-left last:border-b-0",

                  selected ? "bg-(--color-bg-tint)" : "bg-(--color-bg-card)",

                  disabled && "opacity-40",
                )}
              >
                <TeamIdentity
                  snapshot={team.teamSnapshot}
                  groupName={team.groupName}
                />

                {selected && (
                  <Check size={14} className="text-(--color-brand)" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SOURCE FIXTURE SELECTOR
========================================================= */

function SourceFixtureSelector({
  value,
  fixtures,
  disabledFixtureId,
  onSelect,
}: {
  value: VolleyballTournamentFixture | undefined;

  fixtures: VolleyballTournamentFixture[];

  disabledFixtureId?: string;

  onSelect: (fixture: VolleyballTournamentFixture) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={selectButtonClassName()}
      >
        {value ? (
          <div className="min-w-0 text-left">
            <p className="text-xs font-black text-(--color-text-primary)">
              Winner of {formatStage(value.stage)} {value.roundNumber}
            </p>

            <p className="mt-0.5 truncate text-[9px] text-(--color-text-muted)">
              {formatFixtureTeams(value)}
            </p>
          </div>
        ) : (
          <span className="text-xs font-semibold text-(--color-text-muted)">
            Select earlier fixture
          </span>
        )}

        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-(--color-text-muted)",

            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-(--color-bg-border)">
          {fixtures.length === 0 ? (
            <div className="px-4 py-5 text-center">
              <p className="text-[10px] text-(--color-text-muted)">
                Create the earlier knockout fixture first.
              </p>
            </div>
          ) : (
            fixtures.map((fixture) => {
              const disabled = fixture.id === disabledFixtureId;

              const selected = value?.id === fixture.id;

              return (
                <button
                  key={fixture.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onSelect(fixture);

                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 border-b border-(--color-bg-border) px-3 py-3 text-left last:border-b-0",

                    selected ? "bg-(--color-bg-tint)" : "bg-(--color-bg-card)",

                    disabled && "opacity-40",
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-black text-(--color-text-primary)">
                      {formatStage(fixture.stage)} {fixture.roundNumber}
                    </p>

                    <p className="mt-0.5 truncate text-[9px] text-(--color-text-muted)">
                      {formatFixtureTeams(fixture)}
                    </p>
                  </div>

                  {selected ? (
                    <Check size={14} className="text-(--color-brand)" />
                  ) : (
                    <span className="rounded-full bg-(--color-bg-tint) px-2 py-1 text-[8px] font-black text-(--color-brand)">
                      Winner
                    </span>
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
   FIXTURE SIDE
========================================================= */

function FixtureSide({
  name,
  logoUrl,
  source,
  right = false,
}: {
  name: string;

  logoUrl?: string | null;

  source?: string | null;

  right?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-0",

        right && "text-right",
      )}
    >
      <div
        className={cn(
          "mb-1.5 flex",

          right ? "justify-end" : "justify-start",
        )}
      >
        <TeamLogo imageKey={logoUrl} name={name} />
      </div>

      <p className="truncate text-xs font-black text-(--color-text-primary)">
        {name}
      </p>

      {source && (
        <p className="mt-0.5 truncate text-[8px] font-semibold text-(--color-brand)">
          {source}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   TEAM IDENTITY
========================================================= */

function TeamIdentity({
  snapshot,
  groupName,
}: {
  snapshot: {
    name: string;

    shortName?: string | null;

    logoUrl?: string | null;
  };

  groupName?: string | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <TeamLogo imageKey={snapshot.logoUrl} name={snapshot.name} />

      <div className="min-w-0 text-left">
        <p className="truncate text-xs font-black text-(--color-text-primary)">
          {snapshot.name}
        </p>

        {groupName && (
          <p className="mt-0.5 text-[8px] font-semibold text-(--color-text-muted)">
            {groupName}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   TEAM LOGO
========================================================= */

function TeamLogo({
  imageKey,
  name,
}: {
  imageKey?: string | null;

  name: string;
}) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-(--color-bg-tint)">
      {imageKey ? (
        <S3Image
          imageKey={imageKey}
          alt={name}
          width={40}
          height={40}
          className="h-full w-full object-cover"
          fallback={<TeamInitials name={name} />}
        />
      ) : (
        <TeamInitials name={name} />
      )}
    </div>
  );
}

function TeamInitials({ name }: { name: string }) {
  return (
    <span className="font-(family-name:--font-display) text-xs font-black text-(--color-brand)">
      {getInitials(name)}
    </span>
  );
}

/* =========================================================
   STATUS
========================================================= */

function FixtureStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-1 text-[8px] font-black",

        status === VOLLEYBALL_FIXTURE_STATUSES.COMPLETED &&
          "bg-emerald-50 text-emerald-700",

        status === VOLLEYBALL_FIXTURE_STATUSES.LIVE && "bg-red-50 text-red-600",

        status === VOLLEYBALL_FIXTURE_STATUSES.MATCH_CREATED &&
          "bg-blue-50 text-blue-700",

        status === VOLLEYBALL_FIXTURE_STATUSES.SCHEDULED &&
          "bg-(--color-bg-base) text-(--color-text-secondary)",

        status === VOLLEYBALL_FIXTURE_STATUSES.CANCELLED &&
          "bg-red-50 text-red-600",
      )}
    >
      {formatFixtureStatus(status)}
    </span>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptySchedule({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) px-5 py-8 text-center">
      <CalendarDays size={24} className="mx-auto text-(--color-brand)" />

      <p className="mt-3 text-sm font-black text-(--color-text-primary)">
        Build your tournament schedule
      </p>

      <p className="mx-auto mt-1 max-w-[270px] text-[10px] leading-5 text-(--color-text-muted)">
        Add each match separately. A 4-team knockout needs two semi-finals and
        one final.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mx-auto mt-4 flex h-10 items-center gap-2 rounded-xl bg-(--color-brand) px-4 text-xs font-black text-white"
      >
        <Plus size={15} />
        Create First Fixture
      </button>
    </div>
  );
}

/* =========================================================
   SELECT UI
========================================================= */

function SelectShell({
  open,
  onClick,
  children,
}: {
  open: boolean;

  onClick: () => void;

  children: ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className={selectButtonClassName()}>
      <div className="min-w-0 flex-1 text-left">{children}</div>

      <ChevronDown
        size={16}
        className={cn(
          "shrink-0 text-(--color-text-muted)",

          open && "rotate-180",
        )}
      />
    </button>
  );
}

function OptionPanel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-(--color-bg-border)">
      {children}
    </div>
  );
}

function OptionButton({
  children,
  selected,
  onClick,
}: {
  children: ReactNode;

  selected: boolean;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between border-b border-(--color-bg-border) px-3 py-3 text-left last:border-b-0",

        selected ? "bg-(--color-bg-tint)" : "bg-(--color-bg-card)",
      )}
    >
      <span className="text-xs font-bold text-(--color-text-primary)">
        {children}
      </span>

      {selected && <Check size={14} className="text-(--color-brand)" />}
    </button>
  );
}

/* =========================================================
   SUMMARY / STEPS
========================================================= */

function SummaryStat({
  value,
  label,
}: {
  value: number;

  label: string;
}) {
  return (
    <div className="px-3 py-3 text-center">
      <p className="font-(family-name:--font-display) text-xl font-black">
        {value}
      </p>

      <p className="mt-0.5 text-[8px] font-black uppercase tracking-wide text-white/45">
        {label}
      </p>
    </div>
  );
}

function SetupStep({
  number,
  label,
  completed = false,
  active = false,
}: {
  number: string;

  label: string;

  completed?: boolean;

  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-2 py-2.5 text-center",

        completed && "border-emerald-200 bg-emerald-50",

        active && "border-(--color-brand)/25 bg-(--color-bg-tint)",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-black",

          completed
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-(--color-brand) text-white"
              : "bg-(--color-bg-base) text-(--color-text-muted)",
        )}
      >
        {completed ? <Check size={10} /> : number}
      </div>

      <p
        className={cn(
          "mt-1.5 text-[8px] font-black uppercase tracking-wide",

          active
            ? "text-(--color-brand)"
            : completed
              ? "text-emerald-700"
              : "text-(--color-text-muted)",
        )}
      >
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   FIELD / LOADING
========================================================= */

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-(--color-text-secondary)">
      {children}
    </p>
  );
}

function LoadingSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  );
}

function FixturesPageSkeleton() {
  return (
    <div className="min-h-full bg-(--color-bg-base) px-4 py-5">
      <div className="animate-pulse space-y-4">
        <div className="h-20 rounded-2xl bg-(--color-bg-card)" />

        <div className="grid grid-cols-3 gap-2">
          <div className="h-14 rounded-xl bg-(--color-bg-card)" />
          <div className="h-14 rounded-xl bg-(--color-bg-card)" />
          <div className="h-14 rounded-xl bg-(--color-bg-card)" />
        </div>

        <div className="h-20 rounded-2xl bg-(--color-bg-card)" />

        <div className="h-40 rounded-2xl bg-(--color-bg-card)" />
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getDownstreamFixture(
  fixture: VolleyballTournamentFixture,

  fixtures: VolleyballTournamentFixture[],
) {
  return (
    fixtures.find(
      (candidate) =>
        candidate.teamASourceFixtureId === fixture.id ||
        candidate.teamBSourceFixtureId === fixture.id,
    ) ?? null
  );
}

function getFixtureSlotLabel(
  fixture: VolleyballTournamentFixture,
  side: "A" | "B",
  fixtures: VolleyballTournamentFixture[],
) {
  const snapshot = side === "A" ? fixture.teamASnapshot : fixture.teamBSnapshot;

  const sourceFixtureId =
    side === "A" ? fixture.teamASourceFixtureId : fixture.teamBSourceFixtureId;

  if (snapshot) {
    return {
      name: snapshot.name,

      source: sourceFixtureId ? "Qualified from earlier match" : null,
    };
  }

  if (sourceFixtureId) {
    const source = fixtures.find((item) => item.id === sourceFixtureId);

    return {
      name: "TBD",

      source: source
        ? `Winner of ${formatStage(source.stage)} ${source.roundNumber}`
        : "Winner of previous match",
    };
  }

  return {
    name: "TBD",
    source: null,
  };
}

function isKnockoutTournamentStage(stage: VolleyballTournamentStage) {
  return (
    stage === VOLLEYBALL_TOURNAMENT_STAGES.ROUND_OF_16 ||
    stage === VOLLEYBALL_TOURNAMENT_STAGES.QUARTER_FINAL ||
    stage === VOLLEYBALL_TOURNAMENT_STAGES.SEMI_FINAL ||
    stage === VOLLEYBALL_TOURNAMENT_STAGES.THIRD_PLACE ||
    stage === VOLLEYBALL_TOURNAMENT_STAGES.FINAL
  );
}

function getStageRank(stage: VolleyballTournamentStage) {
  switch (stage) {
    case VOLLEYBALL_TOURNAMENT_STAGES.ROUND_OF_16:
      return 1;

    case VOLLEYBALL_TOURNAMENT_STAGES.QUARTER_FINAL:
      return 2;

    case VOLLEYBALL_TOURNAMENT_STAGES.SEMI_FINAL:
      return 3;

    case VOLLEYBALL_TOURNAMENT_STAGES.FINAL:
      return 4;

    default:
      return -1;
  }
}

function getFixtureDisplayRank(stage: VolleyballTournamentStage) {
  switch (stage) {
    case VOLLEYBALL_TOURNAMENT_STAGES.LEAGUE:
      return 0;

    case VOLLEYBALL_TOURNAMENT_STAGES.GROUP_STAGE:
      return 1;

    case VOLLEYBALL_TOURNAMENT_STAGES.ROUND_OF_16:
      return 2;

    case VOLLEYBALL_TOURNAMENT_STAGES.QUARTER_FINAL:
      return 3;

    case VOLLEYBALL_TOURNAMENT_STAGES.SEMI_FINAL:
      return 4;

    case VOLLEYBALL_TOURNAMENT_STAGES.THIRD_PLACE:
      return 5;

    case VOLLEYBALL_TOURNAMENT_STAGES.FINAL:
      return 6;

    default:
      return 99;
  }
}

function getSuggestedInitialStage(
  format: string,

  teamCount: number,

  options: VolleyballTournamentStage[],
) {
  if (format === VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE) {
    return VOLLEYBALL_TOURNAMENT_STAGES.LEAGUE;
  }

  if (format === VOLLEYBALL_TOURNAMENT_FORMATS.GROUP_KNOCKOUT) {
    return VOLLEYBALL_TOURNAMENT_STAGES.GROUP_STAGE;
  }

  if (teamCount <= 2) {
    return VOLLEYBALL_TOURNAMENT_STAGES.FINAL;
  }

  if (teamCount <= 4) {
    return VOLLEYBALL_TOURNAMENT_STAGES.SEMI_FINAL;
  }

  if (teamCount <= 8) {
    return VOLLEYBALL_TOURNAMENT_STAGES.QUARTER_FINAL;
  }

  if (teamCount <= 16) {
    return VOLLEYBALL_TOURNAMENT_STAGES.ROUND_OF_16;
  }

  return options[0] ?? VOLLEYBALL_TOURNAMENT_STAGES.ROUND_OF_16;
}

function filterTeamsForFixture(
  teams: VolleyballTournamentTeam[],

  groupName: string | null,
) {
  if (!groupName) {
    return teams;
  }

  return teams.filter((team) => team.groupName === groupName);
}

function selectButtonClassName() {
  return cn(
    "flex min-h-11 w-full items-center justify-between gap-3 rounded-xl",
    "border border-(--color-bg-border)",
    "bg-(--color-bg-card) px-3 text-(--color-text-primary)",
    "outline-none transition",
    "focus:border-(--color-brand)/50 focus:ring-2 focus:ring-(--color-brand)/10",
  );
}

function inputClassName() {
  return cn(
    "h-11 w-full rounded-xl border border-(--color-bg-border)",
    "bg-(--color-bg-card) px-3 text-sm font-semibold text-(--color-text-primary)",
    "outline-none transition",
    "focus:border-(--color-brand)/50 focus:ring-2 focus:ring-(--color-brand)/10",
  );
}

function formatStage(stage: VolleyballTournamentStage) {
  switch (stage) {
    case VOLLEYBALL_TOURNAMENT_STAGES.LEAGUE:
      return "League";

    case VOLLEYBALL_TOURNAMENT_STAGES.GROUP_STAGE:
      return "Group Stage";

    case VOLLEYBALL_TOURNAMENT_STAGES.ROUND_OF_16:
      return "Round of 16";

    case VOLLEYBALL_TOURNAMENT_STAGES.QUARTER_FINAL:
      return "Quarter Final";

    case VOLLEYBALL_TOURNAMENT_STAGES.SEMI_FINAL:
      return "Semi Final";

    case VOLLEYBALL_TOURNAMENT_STAGES.THIRD_PLACE:
      return "Third Place";

    case VOLLEYBALL_TOURNAMENT_STAGES.FINAL:
      return "Final";

    default:
      return stage;
  }
}

function formatFixtureStatus(status: string) {
  switch (status) {
    case VOLLEYBALL_FIXTURE_STATUSES.SCHEDULED:
      return "Scheduled";

    case VOLLEYBALL_FIXTURE_STATUSES.MATCH_CREATED:
      return "Match Created";

    case VOLLEYBALL_FIXTURE_STATUSES.LIVE:
      return "Live";

    case VOLLEYBALL_FIXTURE_STATUSES.COMPLETED:
      return "Completed";

    case VOLLEYBALL_FIXTURE_STATUSES.CANCELLED:
      return "Cancelled";

    default:
      return status;
  }
}

function formatFixtureTeams(fixture: VolleyballTournamentFixture) {
  const teamA =
    fixture.teamASnapshot?.shortName ?? fixture.teamASnapshot?.name ?? "TBD";

  const teamB =
    fixture.teamBSnapshot?.shortName ?? fixture.teamBSnapshot?.name ?? "TBD";

  return `${teamA} vs ${teamB}`;
}

function formatRuleSummary(configuration: {
  formatType: string;

  maxSets?: number | null;

  totalSets?: number | null;

  normalSetPoints: number;

  decidingSetPoints?: number | null;

  winByMargin: number;
}) {
  if (configuration.formatType === "BEST_OF") {
    return `Best of ${configuration.maxSets ?? "—"} · ${configuration.normalSetPoints} pts${
      configuration.decidingSetPoints
        ? ` · Decider ${configuration.decidingSetPoints}`
        : ""
    }`;
  }

  return `${configuration.totalSets ?? "—"} fixed sets · ${configuration.normalSetPoints} pts`;
}

function formatCustomRulesSummary(
  formatType: CustomFormatType,

  maxSets: number,

  totalSets: number,

  setsToWin: number | null,

  normalSetPoints: number,

  decidingSetPoints: number,

  winByMargin: number,
) {
  if (formatType === "BEST_OF") {
    if (maxSets === 1) {
      return `Best of 1 · ${normalSetPoints} pts · Win by ${winByMargin}`;
    }

    return `Best of ${maxSets} · First to ${setsToWin} · ${normalSetPoints}/${decidingSetPoints} pts`;
  }

  return `${totalSets} fixed sets · ${normalSetPoints} pts · Win by ${winByMargin}`;
}

function formatFixtureRuleSummary(configuration: {
  formatType: string;

  maxSets?: number | null;

  totalSets?: number | null;

  normalSetPoints?: number | null;

  decidingSetPoints?: number | null;

  winByMargin?: number | null;
}) {
  if (configuration.formatType === "BEST_OF") {
    return `Best of ${configuration.maxSets ?? "—"} · ${
      configuration.normalSetPoints ?? "—"
    } pts`;
  }

  return `${configuration.totalSets ?? "—"} fixed sets · ${
    configuration.normalSetPoints ?? "—"
  } pts`;
}

function formatSchedule(value: string) {
  return new Date(value).toLocaleString(undefined, {
    day: "numeric",

    month: "short",

    hour: "numeric",

    minute: "2-digit",
  });
}

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function extractErrorMessage(
  error: unknown,

  fallback: string,
) {
  if (error && typeof error === "object" && "data" in error) {
    const data = (
      error as {
        data?: unknown;
      }
    ).data;

    if (data && typeof data === "object" && "message" in data) {
      const message = (
        data as {
          message?: unknown;
        }
      ).message;

      if (Array.isArray(message)) {
        return message.join(", ");
      }

      if (message) {
        return String(message);
      }
    }
  }

  return fallback;
}
