"use client";

import {
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock3,
  Play,
  RefreshCw,
  Trophy,
} from "lucide-react";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";
import { S3Image } from "@/components/common/S3Image";

import { cn } from "@/lib/cn";

import {
  useGetVolleyballTournamentFixturesQuery,
  useGetVolleyballTournamentQuery,
} from "@/store/api/volleyball/volleyballTournamentApi";

import {
  VOLLEYBALL_FIXTURE_STATUSES,
  VOLLEYBALL_TOURNAMENT_FORMATS,
  VOLLEYBALL_TOURNAMENT_STAGES,
  type VolleyballTournamentFixture,
  type VolleyballTournamentStage,
} from "@/types/volleyball/tournament";

/* =========================================================
   KNOCKOUT STAGES
========================================================= */

const KNOCKOUT_STAGE_ORDER: VolleyballTournamentStage[] = [
  VOLLEYBALL_TOURNAMENT_STAGES.ROUND_OF_16,
  VOLLEYBALL_TOURNAMENT_STAGES.QUARTER_FINAL,
  VOLLEYBALL_TOURNAMENT_STAGES.SEMI_FINAL,
  VOLLEYBALL_TOURNAMENT_STAGES.THIRD_PLACE,
  VOLLEYBALL_TOURNAMENT_STAGES.FINAL,
];

/* =========================================================
   PAGE
========================================================= */

export default function VolleyballTournamentBracketPage() {
  const params = useParams();
  const router = useRouter();

  const tournamentId =
    typeof params.tournamentId === "string" ? params.tournamentId : "";

  /* =====================================================
     API
  ===================================================== */

  const {
    data: tournament,
    isLoading: isTournamentLoading,
    isError: isTournamentError,
    refetch: refetchTournament,
  } = useGetVolleyballTournamentQuery(
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
    isFetching: areFixturesFetching,
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

  /* =====================================================
     KNOCKOUT FIXTURES
  ===================================================== */

  const knockoutFixtures = useMemo(
    () => fixtures.filter((fixture) => isKnockoutStage(fixture.stage)),
    [fixtures],
  );

  const stages = useMemo(() => {
    return KNOCKOUT_STAGE_ORDER.filter((stage) =>
      knockoutFixtures.some((fixture) => fixture.stage === stage),
    );
  }, [knockoutFixtures]);

  const completedCount = useMemo(
    () =>
      knockoutFixtures.filter(
        (fixture) => fixture.status === VOLLEYBALL_FIXTURE_STATUSES.COMPLETED,
      ).length,
    [knockoutFixtures],
  );

  const liveCount = useMemo(
    () =>
      knockoutFixtures.filter(
        (fixture) => fixture.status === VOLLEYBALL_FIXTURE_STATUSES.LIVE,
      ).length,
    [knockoutFixtures],
  );

  /* =====================================================
     OPEN EXECUTION MATCH
  ===================================================== */

  function handleOpenMatch(fixture: VolleyballTournamentFixture) {
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
     LOADING
  ===================================================== */

  if (isTournamentLoading || areFixturesLoading) {
    return <BracketSkeleton />;
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (isTournamentError || areFixturesError || !tournament) {
    return (
      <BracketError
        onRetry={() => {
          void Promise.all([refetchTournament(), refetchFixtures()]);
        }}
      />
    );
  }

  /* =====================================================
     NON-KNOCKOUT
  ===================================================== */

  if (tournament.format === VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE) {
    return (
      <NotKnockoutTournament
        tournamentId={tournamentId}
        tournamentName={tournament.name}
      />
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-full bg-(--color-bg-base) pb-10">
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="bg-(--color-navy) text-white">
        <div className="px-4 pb-5 pt-4">
          <div className="flex items-center gap-3">
            {/* <button
              type="button"
              onClick={() =>
                router.push(`/volleyball/tournaments/${tournamentId}`)
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10"
            >
              <ChevronLeft size={18} />
            </button> */}

            <div className="min-w-0 flex-1">
              <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/45">
                Knockout
              </p>

              <h1 className="truncate text-sm font-black text-white">
                {tournament.name}
              </h1>
            </div>

            <button
              type="button"
              disabled={areFixturesFetching}
              onClick={() => void refetchFixtures()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 disabled:opacity-40"
            >
              <RefreshCw
                size={15}
                className={cn(areFixturesFetching && "animate-spin")}
              />
            </button>
          </div>

          {/* TITLE */}

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--color-brand)">
              <Trophy size={20} />
            </div>

            <div>
              <p className="font-(family-name:--font-display) text-2xl font-black uppercase tracking-wide">
                Tournament Bracket
              </p>

              <p className="mt-0.5 text-[9px] text-white/50">
                Follow teams through the knockout rounds
              </p>
            </div>
          </div>

          {/* SUMMARY */}

          <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <HeaderStat value={knockoutFixtures.length} label="Matches" />

            <HeaderStat value={completedCount} label="Completed" />

            <HeaderStat value={liveCount} label="Live" />
          </div>
        </div>
      </section>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="px-4 py-5">
        {knockoutFixtures.length === 0 ? (
          <EmptyBracket
            onFixtures={() =>
              router.push(`/volleyball/tournaments/${tournamentId}/fixtures`)
            }
          />
        ) : (
          <div className="space-y-7">
            {stages.map((stage, stageIndex) => {
              const stageFixtures = knockoutFixtures
                .filter((fixture) => fixture.stage === stage)
                .sort((a, b) => a.roundNumber - b.roundNumber);

              return (
                <BracketStage
                  key={stage}
                  stage={stage}
                  fixtures={stageFixtures}
                  allFixtures={knockoutFixtures}
                  isLast={stageIndex === stages.length - 1}
                  onOpenMatch={handleOpenMatch}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================================================
   STAGE
========================================================= */

function BracketStage({
  stage,
  fixtures,
  allFixtures,
  isLast,
  onOpenMatch,
}: {
  stage: VolleyballTournamentStage;

  fixtures: VolleyballTournamentFixture[];

  allFixtures: VolleyballTournamentFixture[];

  isLast: boolean;

  onOpenMatch: (fixture: VolleyballTournamentFixture) => void;
}) {
  const completed = fixtures.filter(
    (fixture) => fixture.status === VOLLEYBALL_FIXTURE_STATUSES.COMPLETED,
  ).length;

  return (
    <section>
      {/* STAGE HEADING */}

      <div className="mb-3 flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",

            stage === VOLLEYBALL_TOURNAMENT_STAGES.FINAL
              ? "bg-amber-100 text-amber-700"
              : "bg-(--color-bg-tint) text-(--color-brand)",
          )}
        >
          {stage === VOLLEYBALL_TOURNAMENT_STAGES.FINAL ? (
            <Trophy size={16} />
          ) : (
            <span className="font-(family-name:--font-display) text-sm font-black">
              {getStageShortLabel(stage)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-wide text-(--color-text-primary)">
            {formatStage(stage)}
          </p>

          <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
            {completed} of {fixtures.length} completed
          </p>
        </div>

        <span className="rounded-full bg-(--color-bg-card) px-2 py-1 text-[8px] font-black text-(--color-text-muted)">
          {fixtures.length}
        </span>
      </div>

      {/* FIXTURES */}

      <div className="space-y-3">
        {fixtures.map((fixture, index) => (
          <div key={fixture.id} className="relative">
            <BracketFixtureCard
              fixture={fixture}
              allFixtures={allFixtures}
              onOpenMatch={() => onOpenMatch(fixture)}
            />

            {/* VISUAL FLOW */}

            {!isLast && index === fixtures.length - 1 && (
              <div className="mx-auto mt-3 flex h-5 w-px items-center justify-center bg-(--color-bg-border)">
                <ChevronRight
                  size={12}
                  className="rotate-90 bg-(--color-bg-base) text-(--color-text-muted)"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   FIXTURE CARD
========================================================= */

function BracketFixtureCard({
  fixture,
  allFixtures,
  onOpenMatch,
}: {
  fixture: VolleyballTournamentFixture;

  allFixtures: VolleyballTournamentFixture[];

  onOpenMatch: () => void;
}) {
  const sideA = getBracketSide(fixture, "A", allFixtures);

  const sideB = getBracketSide(fixture, "B", allFixtures);

  const teamsResolved = Boolean(fixture.teamAId && fixture.teamBId);

  const waitingForTeams =
    fixture.status === VOLLEYBALL_FIXTURE_STATUSES.SCHEDULED && !teamsResolved;

  const completed = fixture.status === VOLLEYBALL_FIXTURE_STATUSES.COMPLETED;

  const live = fixture.status === VOLLEYBALL_FIXTURE_STATUSES.LIVE;

  const downstream = getDownstreamFixture(fixture, allFixtures);

  const progressed = downstream
    ? hasResolvedDownstreamSlot(fixture, downstream)
    : false;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-(--color-bg-card) shadow-sm",

        live
          ? "border-red-200"
          : fixture.stage === VOLLEYBALL_TOURNAMENT_STAGES.FINAL
            ? "border-amber-200"
            : "border-(--color-bg-border)",
      )}
    >
      {/* HEADER */}

      <div className="flex items-center justify-between gap-3 border-b border-(--color-bg-border) px-3 py-2.5">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.12em] text-(--color-brand)">
            Match {fixture.roundNumber}
          </p>

          {fixture.groupName && (
            <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
              {fixture.groupName}
            </p>
          )}
        </div>

        <FixtureStatusBadge status={fixture.status} />
      </div>

      {/* TEAMS */}

      <div className="px-3 py-3">
        <BracketTeamRow
          name={sideA.name}
          source={sideA.source}
          logoUrl={fixture.teamASnapshot?.logoUrl}
          resolved={Boolean(fixture.teamAId)}
        />

        <div className="my-2 flex items-center gap-2">
          <div className="h-px flex-1 bg-(--color-bg-border)" />

          <span className="text-[7px] font-black uppercase text-(--color-text-muted)">
            vs
          </span>

          <div className="h-px flex-1 bg-(--color-bg-border)" />
        </div>

        <BracketTeamRow
          name={sideB.name}
          source={sideB.source}
          logoUrl={fixture.teamBSnapshot?.logoUrl}
          resolved={Boolean(fixture.teamBId)}
        />

        {/* META */}

        {(fixture.scheduledAt || fixture.matchRulesSnapshot) && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-(--color-bg-border) pt-2.5">
            {fixture.scheduledAt && (
              <div className="flex items-center gap-1 text-[8px] text-(--color-text-muted)">
                <Clock3 size={10} />

                {formatSchedule(fixture.scheduledAt)}
              </div>
            )}

            {fixture.matchRulesSnapshot && (
              <div className="flex items-center gap-1 text-[8px] text-(--color-text-muted)">
                <CircleDot size={9} />

                {formatRuleSummary(fixture)}
              </div>
            )}
          </div>
        )}

        {/* WAITING */}

        {waitingForTeams && (
          <div className="mt-3 rounded-xl border border-dashed border-(--color-brand)/20 bg-(--color-bg-tint) px-3 py-2.5">
            <p className="text-[9px] font-black text-(--color-brand)">
              Waiting for previous round
            </p>

            <p className="mt-0.5 text-[8px] leading-4 text-(--color-text-muted)">
              This matchup will be filled when its source fixture results are
              resolved.
            </p>
          </div>
        )}

        {/* COMPLETED PROGRESSION */}

        {completed && downstream && (
          <div
            className={cn(
              "mt-3 flex items-start gap-2 rounded-xl px-3 py-2.5",

              progressed ? "bg-emerald-50" : "bg-amber-50",
            )}
          >
            <span
              className={cn(
                "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",

                progressed ? "bg-emerald-500" : "bg-amber-500",
              )}
            />

            <div>
              <p
                className={cn(
                  "text-[8px] font-black",

                  progressed ? "text-emerald-700" : "text-amber-800",
                )}
              >
                {progressed
                  ? `Next round updated`
                  : "Waiting for bracket update"}
              </p>

              <p
                className={cn(
                  "mt-0.5 text-[8px] leading-4",

                  progressed ? "text-emerald-700/70" : "text-amber-700/75",
                )}
              >
                {progressed
                  ? `Qualified team has been placed in ${formatStage(
                      downstream.stage,
                    )}.`
                  : "This result is complete, but the downstream team slot is not resolved yet."}
              </p>
            </div>
          </div>
        )}

        {/* OPEN MATCH */}

        {fixture.executionMatchId && (
          <button
            type="button"
            onClick={onOpenMatch}
            className={cn(
              "mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[10px] font-black",

              live
                ? "bg-(--color-live) text-white"
                : completed
                  ? "border border-(--color-bg-border) bg-(--color-bg-base) text-(--color-text-secondary)"
                  : "bg-(--color-brand) text-white",
            )}
          >
            {live ? (
              <>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                Open Live Match
              </>
            ) : completed ? (
              <>
                <Trophy size={13} />
                View Match
              </>
            ) : (
              <>
                <Play size={13} />
                Open Match
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   TEAM ROW
========================================================= */

function BracketTeamRow({
  name,
  source,
  logoUrl,
  resolved,
}: {
  name: string;

  source?: string | null;

  logoUrl?: string | null;

  resolved: boolean;
}) {
  return (
    <div className="flex min-h-11 items-center gap-3">
      <TeamLogo imageKey={logoUrl} name={name} />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-xs font-black",

            resolved
              ? "text-(--color-text-primary)"
              : "text-(--color-text-muted)",
          )}
        >
          {name}
        </p>

        {source && (
          <p className="mt-0.5 truncate text-[8px] font-semibold text-(--color-brand)">
            {source}
          </p>
        )}
      </div>

      {resolved ? (
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[7px] font-black text-emerald-700">
          Ready
        </span>
      ) : (
        <span className="rounded-full bg-(--color-bg-base) px-2 py-1 text-[7px] font-black text-(--color-text-muted)">
          TBD
        </span>
      )}
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
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-(--color-bg-tint)">
      {imageKey ? (
        <S3Image
          imageKey={imageKey}
          alt={name}
          width={36}
          height={36}
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
    <span className="font-(family-name:--font-display) text-[10px] font-black text-(--color-brand)">
      {getInitials(name)}
    </span>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function FixtureStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-1 text-[7px] font-black",

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

function EmptyBracket({ onFixtures }: { onFixtures: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) px-5 py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
        <Trophy size={21} className="text-(--color-brand)" />
      </div>

      <p className="mt-3 text-sm font-black text-(--color-text-primary)">
        Bracket not created yet
      </p>

      <p className="mx-auto mt-1 max-w-[280px] text-[10px] leading-5 text-(--color-text-muted)">
        Create knockout fixtures and connect later rounds to previous fixture
        winners.
      </p>

      <Button fullWidth className="mt-4" onClick={onFixtures}>
        Manage Fixtures
      </Button>
    </div>
  );
}

/* =========================================================
   NON KNOCKOUT
========================================================= */

function NotKnockoutTournament({
  tournamentId,
  tournamentName,
}: {
  tournamentId: string;

  tournamentName: string;
}) {
  const router = useRouter();

  return (
    <div className="min-h-full bg-(--color-bg-base)">
      <section className="bg-(--color-navy) px-4 pb-5 pt-4 text-white">
        <button
          type="button"
          onClick={() => router.push(`/volleyball/tournaments/${tournamentId}`)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"
        >
          <ChevronLeft size={18} />
        </button>

        <p className="mt-4 text-[8px] font-black uppercase tracking-wide text-white/45">
          {tournamentName}
        </p>

        <h1 className="mt-1 font-(family-name:--font-display) text-2xl font-black uppercase">
          Tournament Bracket
        </h1>
      </section>

      <div className="px-4 py-5">
        <div className="rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) px-5 py-8 text-center">
          <Trophy size={24} className="mx-auto text-(--color-brand)" />

          <p className="mt-3 text-sm font-black text-(--color-text-primary)">
            No knockout bracket
          </p>

          <p className="mx-auto mt-1 max-w-[280px] text-[10px] leading-5 text-(--color-text-muted)">
            League tournaments use standings instead of a knockout bracket.
          </p>

          <Button
            fullWidth
            className="mt-4"
            onClick={() =>
              router.push(`/volleyball/tournaments/${tournamentId}/standings`)
            }
          >
            View Standings
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ERROR
========================================================= */

function BracketError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) px-4">
      <div className="w-full max-w-sm rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center">
        <Trophy size={26} className="mx-auto text-(--color-brand)" />

        <p className="mt-3 text-sm font-black text-(--color-text-primary)">
          Unable to load bracket
        </p>

        <p className="mt-1 text-[10px] leading-5 text-(--color-text-muted)">
          Tournament fixtures could not be loaded.
        </p>

        <Button fullWidth className="mt-4" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function BracketSkeleton() {
  return (
    <div className="min-h-full bg-(--color-bg-base)">
      <div className="h-52 animate-pulse bg-(--color-navy)" />

      <div className="space-y-6 px-4 py-5">
        {[1, 2, 3].map((value) => (
          <div key={value} className="space-y-3">
            <div className="h-9 w-40 animate-pulse rounded-xl bg-(--color-bg-card)" />

            <div className="h-44 animate-pulse rounded-2xl bg-(--color-bg-card)" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   HEADER STAT
========================================================= */

function HeaderStat({
  value,
  label,
}: {
  value: number;

  label: string;
}) {
  return (
    <div className="px-2 py-3 text-center">
      <p className="font-(family-name:--font-display) text-xl font-black">
        {value}
      </p>

      <p className="mt-0.5 text-[7px] font-black uppercase tracking-[0.12em] text-white/40">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   BRACKET HELPERS
========================================================= */

function isKnockoutStage(stage: VolleyballTournamentStage) {
  return (
    stage === VOLLEYBALL_TOURNAMENT_STAGES.ROUND_OF_16 ||
    stage === VOLLEYBALL_TOURNAMENT_STAGES.QUARTER_FINAL ||
    stage === VOLLEYBALL_TOURNAMENT_STAGES.SEMI_FINAL ||
    stage === VOLLEYBALL_TOURNAMENT_STAGES.THIRD_PLACE ||
    stage === VOLLEYBALL_TOURNAMENT_STAGES.FINAL
  );
}

function getDownstreamFixture(
  fixture: VolleyballTournamentFixture,
  fixtures: VolleyballTournamentFixture[],
) {
  /*
   * Prefer the explicit backend progression link when present.
   */
  if (fixture.nextFixtureId) {
    const explicit = fixtures.find(
      (candidate) => candidate.id === fixture.nextFixtureId,
    );

    if (explicit) {
      return explicit;
    }
  }

  /*
   * Defensive fallback:
   * detect a fixture that references this one as a source.
   */
  return (
    fixtures.find(
      (candidate) =>
        candidate.teamASourceFixtureId === fixture.id ||
        candidate.teamBSourceFixtureId === fixture.id,
    ) ?? null
  );
}

function hasResolvedDownstreamSlot(
  fixture: VolleyballTournamentFixture,
  downstream: VolleyballTournamentFixture,
) {
  if (downstream.teamASourceFixtureId === fixture.id) {
    return Boolean(downstream.teamAId);
  }

  if (downstream.teamBSourceFixtureId === fixture.id) {
    return Boolean(downstream.teamBId);
  }

  /*
   * nextFixtureSlot can also tell us which downstream side
   * the backend intends to populate.
   */
  if (fixture.nextFixtureId === downstream.id) {
    if (fixture.nextFixtureSlot === "A") {
      return Boolean(downstream.teamAId);
    }

    if (fixture.nextFixtureSlot === "B") {
      return Boolean(downstream.teamBId);
    }
  }

  return false;
}

function getBracketSide(
  fixture: VolleyballTournamentFixture,
  side: "A" | "B",
  fixtures: VolleyballTournamentFixture[],
) {
  const snapshot = side === "A" ? fixture.teamASnapshot : fixture.teamBSnapshot;

  const sourceFixtureId =
    side === "A" ? fixture.teamASourceFixtureId : fixture.teamBSourceFixtureId;

  if (snapshot) {
    return {
      name: snapshot.shortName ?? snapshot.name,

      source: sourceFixtureId ? "Qualified from earlier match" : null,
    };
  }

  if (sourceFixtureId) {
    const source = fixtures.find(
      (candidate) => candidate.id === sourceFixtureId,
    );

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

/* =========================================================
   FORMATTERS
========================================================= */

function formatStage(stage: VolleyballTournamentStage) {
  switch (stage) {
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

    case VOLLEYBALL_TOURNAMENT_STAGES.GROUP_STAGE:
      return "Group Stage";

    case VOLLEYBALL_TOURNAMENT_STAGES.LEAGUE:
      return "League";

    default:
      return stage;
  }
}

function getStageShortLabel(stage: VolleyballTournamentStage) {
  switch (stage) {
    case VOLLEYBALL_TOURNAMENT_STAGES.ROUND_OF_16:
      return "R16";

    case VOLLEYBALL_TOURNAMENT_STAGES.QUARTER_FINAL:
      return "QF";

    case VOLLEYBALL_TOURNAMENT_STAGES.SEMI_FINAL:
      return "SF";

    case VOLLEYBALL_TOURNAMENT_STAGES.THIRD_PLACE:
      return "3RD";

    case VOLLEYBALL_TOURNAMENT_STAGES.FINAL:
      return "F";

    default:
      return "KO";
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

function formatRuleSummary(fixture: VolleyballTournamentFixture) {
  const rules = fixture.matchRulesSnapshot;

  if (rules.formatType === "BEST_OF") {
    return `Best of ${rules.maxSets ?? "—"} · ${rules.normalSetPoints} pts`;
  }

  return `${rules.totalSets ?? "—"} sets · ${rules.normalSetPoints} pts`;
}

function formatSchedule(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
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
