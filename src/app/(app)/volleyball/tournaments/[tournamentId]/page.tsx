"use client";

import {
  CalendarDays,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Play,
  Trophy,
  Users,
  Volleyball,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";
import { S3Image } from "@/components/common/S3Image";

import { cn } from "@/lib/cn";

import {
  useCreateVolleyballMatchFromFixtureMutation,
  useGetVolleyballTournamentFixturesQuery,
  useGetVolleyballTournamentQuery,
  useGetVolleyballTournamentTeamsQuery,
} from "@/store/api/volleyball/volleyballTournamentApi";

import {
  VOLLEYBALL_FIXTURE_STATUSES,
  VOLLEYBALL_TOURNAMENT_FORMATS,
  VOLLEYBALL_TOURNAMENT_STAGES,
  type VolleyballTournamentFixture,
  type VolleyballTournamentStage,
} from "@/types/volleyball/tournament";

/* =========================================================
   PAGE
========================================================= */

export default function VolleyballTournamentOverviewPage() {
  const params = useParams();
  const router = useRouter();

  const tournamentId =
    typeof params.tournamentId === "string" ? params.tournamentId : "";

  const [error, setError] = useState("");

  const [creatingFixtureId, setCreatingFixtureId] = useState<string | null>(
    null,
  );

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
    data: registeredTeams = [],
    isLoading: areTeamsLoading,
    isError: areTeamsError,
    refetch: refetchTeams,
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

  const [createMatchFromFixture] =
    useCreateVolleyballMatchFromFixtureMutation();

  /* =====================================================
     COUNTS
  ===================================================== */

  const completedFixtures = useMemo(
    () =>
      fixtures.filter(
        (fixture) => fixture.status === VOLLEYBALL_FIXTURE_STATUSES.COMPLETED,
      ),
    [fixtures],
  );

  const liveFixtures = useMemo(
    () =>
      fixtures.filter(
        (fixture) => fixture.status === VOLLEYBALL_FIXTURE_STATUSES.LIVE,
      ),
    [fixtures],
  );

  const completedCount = completedFixtures.length;

  const totalFixtures = fixtures.length;

  /* =====================================================
     PRIMARY FIXTURE / NEXT ACTION
  ===================================================== */

  const primaryFixture = useMemo(() => getPrimaryFixture(fixtures), [fixtures]);

  const recentFixtures = useMemo(() => {
    return [...fixtures].sort(compareFixturesForOverview).slice(0, 3);
  }, [fixtures]);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  function goToTeams() {
    router.push(`/volleyball/tournaments/${tournamentId}/teams`);
  }

  function goToFixtures() {
    router.push(`/volleyball/tournaments/${tournamentId}/fixtures`);
  }

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
     CREATE EXECUTION MATCH
  ===================================================== */

  async function handleCreateMatch(fixture: VolleyballTournamentFixture) {
    if (
      fixture.status !== VOLLEYBALL_FIXTURE_STATUSES.SCHEDULED ||
      fixture.executionMatchId
    ) {
      return;
    }

    if (!fixture.teamAId || !fixture.teamBId) {
      setError("This fixture is still waiting for teams to be resolved.");

      return;
    }

    setError("");
    setCreatingFixtureId(fixture.id);

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
        extractErrorMessage(
          err,
          "Unable to create the match for this fixture.",
        ),
      );
    } finally {
      setCreatingFixtureId(null);
    }
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (isTournamentLoading || areTeamsLoading || areFixturesLoading) {
    return <TournamentOverviewSkeleton />;
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (isTournamentError || areTeamsError || areFixturesError || !tournament) {
    return (
      <TournamentLoadError
        onRetry={() => {
          void Promise.all([
            refetchTournament(),
            refetchTeams(),
            refetchFixtures(),
          ]);
        }}
      />
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-full bg-(--color-bg-base) pb-8">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="overflow-hidden bg-(--color-navy) text-white">
        <div className="relative px-4 pb-5 pt-5">
          {/* glow */}

          <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-(--color-brand)/20 blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/75">
                    Volleyball
                  </span>

                  <span className="rounded-full bg-(--color-brand) px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-white">
                    {formatTournamentFormat(tournament.format)}
                  </span>
                </div>

                <h1 className="mt-3 font-(family-name:--font-display) text-2xl font-black uppercase leading-tight tracking-wide text-white">
                  {tournament.name}
                </h1>

                <p className="mt-1 text-[10px] font-medium text-white/55">
                  Tournament control centre
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <Volleyball size={23} className="text-white" />
              </div>
            </div>

            {/* STATS */}

            <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <HeroStat value={registeredTeams.length} label="Teams" />

              <HeroStat value={totalFixtures} label="Fixtures" />

              <HeroStat value={completedCount} label="Played" />
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-5 px-4 py-5">
        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="rounded-2xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-3">
            <p className="text-xs font-semibold text-(--color-live)">{error}</p>
          </div>
        )}

        {/* =================================================
            PRIMARY ACTION
        ================================================= */}

        <section>
          <SectionHeader
            title="What's next?"
            subtitle="Continue running the tournament."
          />

          {!primaryFixture ? (
            <NoFixturesAction
              teamCount={registeredTeams.length}
              onTeams={goToTeams}
              onFixtures={goToFixtures}
            />
          ) : (
            <PrimaryFixtureCard
              fixture={primaryFixture}
              allFixtures={fixtures}
              creating={creatingFixtureId === primaryFixture.id}
              onCreateMatch={() => void handleCreateMatch(primaryFixture)}
              onOpenMatch={() => handleOpenFixtureMatch(primaryFixture)}
              onFixtures={goToFixtures}
            />
          )}
        </section>

        {/* =================================================
            TOURNAMENT PROGRESS
        ================================================= */}

        <section>
          <SectionHeader
            title="Tournament Progress"
            subtitle="A quick view of where the competition stands."
          />

          <div className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)">
            <ProgressRow
              icon={Users}
              label="Teams"
              detail={`${registeredTeams.length} registered`}
              completed={registeredTeams.length >= 2}
              onClick={goToTeams}
            />

            <ProgressRow
              icon={CalendarDays}
              label="Schedule"
              detail={
                totalFixtures
                  ? `${totalFixtures} fixture${totalFixtures === 1 ? "" : "s"}`
                  : "Not created yet"
              }
              completed={totalFixtures > 0}
              onClick={goToFixtures}
            />

            <ProgressRow
              icon={Trophy}
              label="Matches"
              detail={
                totalFixtures
                  ? `${completedCount} of ${totalFixtures} completed`
                  : "Waiting for schedule"
              }
              completed={totalFixtures > 0 && completedCount === totalFixtures}
              last
              onClick={goToFixtures}
            />
          </div>
        </section>

        {/* =================================================
            MANAGE
        ================================================= */}

        <section>
          <SectionHeader
            title="Manage"
            subtitle="Teams, fixtures and match operations."
          />

          <div
            className={cn(
              "grid gap-3",

              tournament.format === VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE
                ? "grid-cols-2"
                : "grid-cols-3",
            )}
          >
            <ManageCard
              icon={Users}
              label="Teams"
              value={`${registeredTeams.length}`}
              description="Registered"
              onClick={goToTeams}
            />

            <ManageCard
              icon={CalendarDays}
              label="Fixtures"
              value={`${totalFixtures}`}
              description="Schedule"
              onClick={goToFixtures}
            />

            {tournament.format !== VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE && (
              <ManageCard
                icon={Trophy}
                label="Bracket"
                value={`${completedCount}/${totalFixtures}`}
                description="Knockout"
                onClick={() =>
                  router.push(`/volleyball/tournaments/${tournamentId}/bracket`)
                }
              />
            )}
          </div>
        </section>

        {/* =================================================
            LIVE MATCH
        ================================================= */}

        {liveFixtures.length > 0 && (
          <section>
            <SectionHeader
              title="Live Now"
              subtitle="Tournament matches currently in progress."
            />

            <div className="space-y-3">
              {liveFixtures.slice(0, 2).map((fixture) => (
                <CompactFixtureCard
                  key={fixture.id}
                  fixture={fixture}
                  allFixtures={fixtures}
                  onClick={() => handleOpenFixtureMatch(fixture)}
                />
              ))}
            </div>
          </section>
        )}

        {/* =================================================
            RECENT / UPCOMING
        ================================================= */}

        {recentFixtures.length > 0 && (
          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <SectionHeader
                title="Fixtures"
                subtitle="Recent and upcoming tournament matches."
                noMargin
              />

              <button
                type="button"
                onClick={goToFixtures}
                className="shrink-0 text-[10px] font-black text-(--color-brand)"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {recentFixtures.map((fixture) => (
                <CompactFixtureCard
                  key={fixture.id}
                  fixture={fixture}
                  allFixtures={fixtures}
                  onClick={() => {
                    if (fixture.executionMatchId) {
                      handleOpenFixtureMatch(fixture);

                      return;
                    }

                    goToFixtures();
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* =================================================
            STANDINGS PREVIEW
        ================================================= */}

        <section>
          <button
            type="button"
            onClick={() =>
              router.push(`/volleyball/tournaments/${tournamentId}/standings`)
            }
            className="w-full overflow-hidden rounded-2xl bg-(--color-navy) text-left text-white active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Trophy size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-black">
                  {tournament.format === VOLLEYBALL_TOURNAMENT_FORMATS.KNOCKOUT
                    ? "Tournament Results"
                    : "Tournament Standings"}
                </p>

                <p className="mt-0.5 text-[9px] leading-4 text-white/50">
                  {tournament.format === VOLLEYBALL_TOURNAMENT_FORMATS.KNOCKOUT
                    ? "View tournament match standings and results."
                    : "View the backend-calculated points table."}
                </p>
              </div>

              <ChevronRight size={16} className="shrink-0 text-white/50" />
            </div>
          </button>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   PRIMARY FIXTURE CARD
========================================================= */

function PrimaryFixtureCard({
  fixture,
  allFixtures,
  creating,
  onCreateMatch,
  onOpenMatch,
  onFixtures,
}: {
  fixture: VolleyballTournamentFixture;

  allFixtures: VolleyballTournamentFixture[];

  creating: boolean;

  onCreateMatch: () => void;

  onOpenMatch: () => void;

  onFixtures: () => void;
}) {
  const teamA = getFixtureSide(fixture, "A", allFixtures);
  const teamB = getFixtureSide(fixture, "B", allFixtures);

  const teamsResolved = Boolean(fixture.teamAId && fixture.teamBId);

  const waitingForTeams =
    fixture.status === VOLLEYBALL_FIXTURE_STATUSES.SCHEDULED &&
    !fixture.executionMatchId &&
    !teamsResolved;

  const canCreateMatch =
    fixture.status === VOLLEYBALL_FIXTURE_STATUSES.SCHEDULED &&
    !fixture.executionMatchId &&
    teamsResolved;

  const hasExecutionMatch = Boolean(fixture.executionMatchId);

  return (
    <div className="overflow-hidden rounded-3xl border border-(--color-brand)/15 bg-(--color-bg-card) shadow-sm">
      {/* HEADER */}

      <div className="flex items-center justify-between gap-3 bg-(--color-bg-tint) px-4 py-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-(--color-brand)">
            {formatStage(fixture.stage)} {fixture.roundNumber}
          </p>

          <p className="mt-0.5 text-[8px] font-semibold text-(--color-text-muted)">
            {getPrimaryFixtureMessage(fixture)}
          </p>
        </div>

        <FixtureStatusBadge status={fixture.status} />
      </div>

      {/* MATCHUP */}

      <div className="px-4 py-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <OverviewFixtureTeam
            name={teamA.name}
            logoUrl={fixture.teamASnapshot?.logoUrl}
            source={teamA.source}
          />

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--color-bg-base) font-(family-name:--font-display) text-[9px] font-black text-(--color-text-muted)">
            VS
          </div>

          <OverviewFixtureTeam
            right
            name={teamB.name}
            logoUrl={fixture.teamBSnapshot?.logoUrl}
            source={teamB.source}
          />
        </div>

        {/* META */}

        {(fixture.scheduledAt || fixture.matchRulesSnapshot) && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-(--color-bg-border) pt-3">
            {fixture.scheduledAt && (
              <div className="flex items-center gap-1.5 text-[9px] text-(--color-text-muted)">
                <Clock3 size={11} />

                {formatSchedule(fixture.scheduledAt)}
              </div>
            )}

            {fixture.matchRulesSnapshot && (
              <div className="flex items-center gap-1.5 text-[9px] text-(--color-text-muted)">
                <CircleDot size={10} />

                {formatRules(fixture)}
              </div>
            )}
          </div>
        )}

        {/* WAITING */}

        {waitingForTeams && (
          <div className="mt-4 rounded-xl border border-(--color-brand)/15 bg-(--color-bg-tint) px-3 py-2.5">
            <p className="text-[9px] font-black text-(--color-brand)">
              Waiting for teams
            </p>

            <p className="mt-0.5 text-[8px] leading-4 text-(--color-text-muted)">
              This fixture depends on winner slots from earlier matches.
            </p>
          </div>
        )}

        {/* ACTION */}

        {canCreateMatch && (
          <Button
            fullWidth
            className="mt-4"
            loading={creating}
            disabled={creating}
            onClick={onCreateMatch}
          >
            <Play size={15} />
            Create Match
          </Button>
        )}

        {hasExecutionMatch && (
          <button
            type="button"
            onClick={onOpenMatch}
            className={cn(
              "mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-black",

              fixture.status === VOLLEYBALL_FIXTURE_STATUSES.LIVE
                ? "bg-(--color-live) text-white"
                : "bg-(--color-brand) text-white",
            )}
          >
            {fixture.status === VOLLEYBALL_FIXTURE_STATUSES.LIVE ? (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                Resume Live Match
              </>
            ) : fixture.status === VOLLEYBALL_FIXTURE_STATUSES.COMPLETED ? (
              <>
                <Trophy size={14} />
                View Match
              </>
            ) : (
              <>
                <Play size={14} />
                Open Match
              </>
            )}
          </button>
        )}

        {waitingForTeams && (
          <button
            type="button"
            onClick={onFixtures}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-(--color-bg-border) text-[10px] font-black text-(--color-text-secondary)"
          >
            View Schedule
            <ChevronRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   NO FIXTURES
========================================================= */

function NoFixturesAction({
  teamCount,
  onTeams,
  onFixtures,
}: {
  teamCount: number;

  onTeams: () => void;

  onFixtures: () => void;
}) {
  const needsTeams = teamCount < 2;

  return (
    <div className="rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
          {needsTeams ? (
            <Users size={19} className="text-(--color-brand)" />
          ) : (
            <CalendarDays size={19} className="text-(--color-brand)" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-black text-(--color-text-primary)">
            {needsTeams ? "Add tournament teams" : "Create the schedule"}
          </p>

          <p className="mt-1 text-[10px] leading-5 text-(--color-text-muted)">
            {needsTeams
              ? "Register at least two Volleyball teams before building fixtures."
              : "Your teams are ready. Add the first tournament fixture."}
          </p>
        </div>
      </div>

      <Button
        fullWidth
        className="mt-4"
        onClick={needsTeams ? onTeams : onFixtures}
      >
        {needsTeams ? (
          <>
            <Users size={15} />
            Manage Teams
          </>
        ) : (
          <>
            <CalendarDays size={15} />
            Create Fixtures
          </>
        )}
      </Button>
    </div>
  );
}

/* =========================================================
   PROGRESS ROW
========================================================= */

function ProgressRow({
  icon: Icon,
  label,
  detail,
  completed,
  last = false,
  onClick,
}: {
  icon: typeof Users;

  label: string;

  detail: string;

  completed: boolean;

  last?: boolean;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-3.5 py-3.5 text-left",

        !last && "border-b border-(--color-bg-border)",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",

          completed
            ? "bg-emerald-50 text-emerald-600"
            : "bg-(--color-bg-tint) text-(--color-brand)",
        )}
      >
        {completed ? <Check size={16} /> : <Icon size={16} />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-black text-(--color-text-primary)">
          {label}
        </p>

        <p className="mt-0.5 text-[9px] text-(--color-text-muted)">{detail}</p>
      </div>

      <ChevronRight size={15} className="shrink-0 text-(--color-text-muted)" />
    </button>
  );
}

/* =========================================================
   MANAGE CARD
========================================================= */

function ManageCard({
  icon: Icon,
  label,
  value,
  description,
  onClick,
}: {
  icon: typeof Users;

  label: string;

  value: string;

  description: string;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 text-left shadow-sm active:scale-[0.98]"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-bg-tint)">
          <Icon size={16} className="text-(--color-brand)" />
        </div>

        <ChevronRight size={14} className="text-(--color-text-muted)" />
      </div>

      <p className="mt-3 font-(family-name:--font-display) text-xl font-black text-(--color-text-primary)">
        {value}
      </p>

      <p className="text-[10px] font-black text-(--color-text-primary)">
        {label}
      </p>

      <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
        {description}
      </p>
    </button>
  );
}

/* =========================================================
   COMPACT FIXTURE
========================================================= */

function CompactFixtureCard({
  fixture,
  allFixtures,
  onClick,
}: {
  fixture: VolleyballTournamentFixture;

  allFixtures: VolleyballTournamentFixture[];

  onClick: () => void;
}) {
  const teamA = getFixtureSide(fixture, "A", allFixtures);
  const teamB = getFixtureSide(fixture, "B", allFixtures);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) text-left shadow-sm active:scale-[0.99]"
    >
      <div className="flex items-center justify-between border-b border-(--color-bg-border) px-3 py-2">
        <p className="text-[8px] font-black uppercase tracking-wide text-(--color-brand)">
          {formatStage(fixture.stage)} {fixture.roundNumber}
        </p>

        <FixtureStatusBadge status={fixture.status} />
      </div>

      <div className="px-3 py-3">
        <div className="flex items-center gap-3">
          <MiniTeamLogo
            imageKey={fixture.teamASnapshot?.logoUrl}
            name={teamA.name}
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-black text-(--color-text-primary)">
              {teamA.name}
            </p>

            <p className="my-0.5 text-[8px] font-bold text-(--color-text-muted)">
              vs
            </p>

            <p className="truncate text-[11px] font-black text-(--color-text-primary)">
              {teamB.name}
            </p>
          </div>

          <MiniTeamLogo
            imageKey={fixture.teamBSnapshot?.logoUrl}
            name={teamB.name}
          />

          <ChevronRight
            size={15}
            className="shrink-0 text-(--color-text-muted)"
          />
        </div>

        {fixture.scheduledAt && (
          <div className="mt-2.5 flex items-center gap-1.5 border-t border-(--color-bg-border) pt-2 text-[8px] text-(--color-text-muted)">
            <CalendarDays size={10} />

            {formatSchedule(fixture.scheduledAt)}
          </div>
        )}
      </div>
    </button>
  );
}

/* =========================================================
   TEAM
========================================================= */

function OverviewFixtureTeam({
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
    <div className={cn("min-w-0", right && "text-right")}>
      <div
        className={cn(
          "mb-2 flex",

          right ? "justify-end" : "justify-start",
        )}
      >
        <MiniTeamLogo imageKey={logoUrl} name={name} large />
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
   TEAM LOGO
========================================================= */

function MiniTeamLogo({
  imageKey,
  name,
  large = false,
}: {
  imageKey?: string | null;

  name: string;

  large?: boolean;
}) {
  const size = large ? 44 : 34;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-(--color-bg-tint)",

        large ? "h-11 w-11" : "h-[34px] w-[34px]",
      )}
    >
      {imageKey ? (
        <S3Image
          imageKey={imageKey}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          fallback={<TeamInitial name={name} />}
        />
      ) : (
        <TeamInitial name={name} />
      )}
    </div>
  );
}

function TeamInitial({ name }: { name: string }) {
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
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  subtitle,
  noMargin = false,
}: {
  title: string;

  subtitle?: string;

  noMargin?: boolean;
}) {
  return (
    <div className={cn(!noMargin && "mb-3")}>
      <p className="text-section-label">{title}</p>

      {subtitle && (
        <p className="mt-1 text-[9px] text-(--color-text-muted)">{subtitle}</p>
      )}
    </div>
  );
}

/* =========================================================
   HERO STAT
========================================================= */

function HeroStat({
  value,
  label,
}: {
  value: number;

  label: string;
}) {
  return (
    <div className="px-2 py-3 text-center">
      <p className="font-(family-name:--font-display) text-xl font-black text-white">
        {value}
      </p>

      <p className="mt-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-white/40">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   ERROR
========================================================= */

function TournamentLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) px-4">
      <div className="w-full max-w-sm rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center shadow-sm">
        <Trophy size={26} className="mx-auto text-(--color-brand)" />

        <p className="mt-3 text-sm font-black text-(--color-text-primary)">
          Unable to load tournament
        </p>

        <p className="mt-1 text-xs leading-5 text-(--color-text-muted)">
          Tournament information could not be loaded.
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

function TournamentOverviewSkeleton() {
  return (
    <div className="min-h-full bg-(--color-bg-base)">
      <div className="h-52 animate-pulse bg-(--color-navy)" />

      <div className="space-y-5 px-4 py-5">
        <div className="h-44 animate-pulse rounded-3xl bg-(--color-bg-card)" />

        <div className="h-44 animate-pulse rounded-2xl bg-(--color-bg-card)" />

        <div className="grid grid-cols-2 gap-3">
          <div className="h-32 animate-pulse rounded-2xl bg-(--color-bg-card)" />

          <div className="h-32 animate-pulse rounded-2xl bg-(--color-bg-card)" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PRIMARY FIXTURE SELECTION
========================================================= */

function getPrimaryFixture(fixtures: VolleyballTournamentFixture[]) {
  if (fixtures.length === 0) {
    return null;
  }

  /*
   * Priority 1
   * A currently LIVE fixture.
   */
  const liveFixture = fixtures.find(
    (fixture) => fixture.status === VOLLEYBALL_FIXTURE_STATUSES.LIVE,
  );

  if (liveFixture) {
    return liveFixture;
  }

  /*
   * Priority 2
   * Match exists but scoring/setup has not completed.
   */
  const existingMatch = fixtures.find(
    (fixture) =>
      fixture.status === VOLLEYBALL_FIXTURE_STATUSES.MATCH_CREATED &&
      Boolean(fixture.executionMatchId),
  );

  if (existingMatch) {
    return existingMatch;
  }

  /*
   * Priority 3
   * Ready fixture that can create its execution match.
   */
  const readyFixture = [...fixtures]
    .filter(
      (fixture) =>
        fixture.status === VOLLEYBALL_FIXTURE_STATUSES.SCHEDULED &&
        !fixture.executionMatchId &&
        Boolean(fixture.teamAId) &&
        Boolean(fixture.teamBId),
    )
    .sort(compareFixtureOrder)[0];

  if (readyFixture) {
    return readyFixture;
  }

  /*
   * Priority 4
   * Fixture waiting on source winners.
   */
  const waitingFixture = [...fixtures]
    .filter(
      (fixture) =>
        fixture.status === VOLLEYBALL_FIXTURE_STATUSES.SCHEDULED &&
        !fixture.executionMatchId &&
        (!fixture.teamAId || !fixture.teamBId),
    )
    .sort(compareFixtureOrder)[0];

  if (waitingFixture) {
    return waitingFixture;
  }

  /*
   * Everything is likely complete.
   * Show the most advanced / latest fixture.
   */
  return [...fixtures].sort((a, b) => compareFixtureOrder(b, a))[0] ?? null;
}

/* =========================================================
   FIXTURE ORDERING
========================================================= */

function compareFixtureOrder(
  a: VolleyballTournamentFixture,
  b: VolleyballTournamentFixture,
) {
  const stageDifference = getStageRank(a.stage) - getStageRank(b.stage);

  if (stageDifference !== 0) {
    return stageDifference;
  }

  return a.roundNumber - b.roundNumber;
}

function compareFixturesForOverview(
  a: VolleyballTournamentFixture,
  b: VolleyballTournamentFixture,
) {
  const priorityDifference =
    getStatusPriority(a.status) - getStatusPriority(b.status);

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  return compareFixtureOrder(a, b);
}

function getStatusPriority(status: string) {
  switch (status) {
    case VOLLEYBALL_FIXTURE_STATUSES.LIVE:
      return 0;

    case VOLLEYBALL_FIXTURE_STATUSES.MATCH_CREATED:
      return 1;

    case VOLLEYBALL_FIXTURE_STATUSES.SCHEDULED:
      return 2;

    case VOLLEYBALL_FIXTURE_STATUSES.COMPLETED:
      return 3;

    case VOLLEYBALL_FIXTURE_STATUSES.CANCELLED:
      return 4;

    default:
      return 10;
  }
}

/* =========================================================
   FIXTURE SIDE
========================================================= */

function getFixtureSide(
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
    const sourceFixture =
      fixtures.find((candidate) => candidate.id === sourceFixtureId) ?? null;

    return {
      name: "TBD",

      source: sourceFixture
        ? `Winner of ${formatStage(
            sourceFixture.stage,
          )} ${sourceFixture.roundNumber}`
        : "Winner of previous match",
    };
  }

  return {
    name: "TBD",
    source: null,
  };
}

/* =========================================================
   PRIMARY MESSAGE
========================================================= */

function getPrimaryFixtureMessage(fixture: VolleyballTournamentFixture) {
  switch (fixture.status) {
    case VOLLEYBALL_FIXTURE_STATUSES.LIVE:
      return "Match is live now";

    case VOLLEYBALL_FIXTURE_STATUSES.MATCH_CREATED:
      return "Match setup is in progress";

    case VOLLEYBALL_FIXTURE_STATUSES.COMPLETED:
      return "Match completed";

    case VOLLEYBALL_FIXTURE_STATUSES.SCHEDULED:
      if (!fixture.teamAId || !fixture.teamBId) {
        return "Waiting for teams";
      }

      return "Ready to create match";

    case VOLLEYBALL_FIXTURE_STATUSES.CANCELLED:
      return "Fixture cancelled";

    default:
      return "Tournament fixture";
  }
}

/* =========================================================
   STAGE
========================================================= */

function getStageRank(stage: VolleyballTournamentStage) {
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

/* =========================================================
   FORMAT
========================================================= */

function formatTournamentFormat(format: string) {
  switch (format) {
    case VOLLEYBALL_TOURNAMENT_FORMATS.LEAGUE:
      return "League";

    case VOLLEYBALL_TOURNAMENT_FORMATS.KNOCKOUT:
      return "Knockout";

    case VOLLEYBALL_TOURNAMENT_FORMATS.GROUP_KNOCKOUT:
      return "Group + Knockout";

    default:
      return format
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) => character.toUpperCase());
  }
}

/* =========================================================
   STATUS
========================================================= */

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

/* =========================================================
   RULES
========================================================= */

function formatRules(fixture: VolleyballTournamentFixture) {
  const rules = fixture.matchRulesSnapshot;

  if (!rules) {
    return "Match rules";
  }

  if (rules.formatType === "BEST_OF") {
    return `Best of ${rules.maxSets ?? "—"} · ${
      rules.normalSetPoints ?? "—"
    } pts`;
  }

  return `${rules.totalSets ?? "—"} fixed sets · ${
    rules.normalSetPoints ?? "—"
  } pts`;
}

/* =========================================================
   DATE
========================================================= */

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

/* =========================================================
   INITIALS
========================================================= */

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* =========================================================
   ERROR
========================================================= */

function extractErrorMessage(error: unknown, fallback: string) {
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
