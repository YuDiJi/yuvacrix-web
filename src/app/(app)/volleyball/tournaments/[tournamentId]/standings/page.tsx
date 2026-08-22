"use client";

import { ChevronLeft, Medal, RefreshCw, Trophy } from "lucide-react";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";

import {
  useGetVolleyballTournamentQuery,
  useGetVolleyballTournamentStandingsQuery,
} from "@/store/api/volleyball/volleyballTournamentApi";

import {
  VOLLEYBALL_TOURNAMENT_FORMATS,
  type VolleyballTournamentStanding,
} from "@/types/volleyball/tournament";

/* =========================================================
   PAGE
========================================================= */

export default function VolleyballTournamentStandingsPage() {
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
    data: standingsResponse,
    isLoading: isStandingsLoading,
    isFetching: isStandingsFetching,
    isError: isStandingsError,
    refetch: refetchStandings,
  } = useGetVolleyballTournamentStandingsQuery(
    {
      tournamentId,
    },
    {
      skip: !tournamentId,
    },
  );

  const standings = standingsResponse?.standings ?? [];

  /* =====================================================
     LOADING
  ===================================================== */

  if (isTournamentLoading || isStandingsLoading) {
    return <StandingsSkeleton />;
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (isTournamentError || isStandingsError || !tournament) {
    return (
      <StandingsError
        onRetry={() => {
          void Promise.all([refetchTournament(), refetchStandings()]);
        }}
      />
    );
  }

  const isKnockout =
    tournament.format === VOLLEYBALL_TOURNAMENT_FORMATS.KNOCKOUT;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-full bg-(--color-bg-base) pb-8">
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="bg-(--color-navy) text-white">
        <div className="px-4 pb-5 pt-4">
          <div className="flex items-center justify-between gap-3">
            {/* <button
              type="button"
              onClick={() =>
                router.push(`/volleyball/tournaments/${tournamentId}`)
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"
            >
              <ChevronLeft size={18} />
            </button> */}

            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-black uppercase tracking-[0.15em] text-white/45">
                Tournament
              </p>

              <h1 className="truncate text-sm font-black text-white">
                {tournament.name}
              </h1>
            </div>

            <button
              type="button"
              disabled={isStandingsFetching}
              onClick={() => void refetchStandings()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 disabled:opacity-40"
            >
              <RefreshCw
                size={15}
                className={cn(isStandingsFetching && "animate-spin")}
              />
            </button>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-brand)">
                <Trophy size={18} />
              </div>

              <div>
                <p className="font-(family-name:--font-display) text-xl font-black uppercase tracking-wide">
                  {isKnockout ? "Tournament Standings" : "Points Table"}
                </p>

                <p className="mt-0.5 text-[9px] text-white/50">
                  Updated from completed tournament matches
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="space-y-4 px-4 py-5">
        {/* GENERATED INFO */}

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-wide text-(--color-text-secondary)">
              Standings
            </p>

            <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
              {standingsResponse?.generatedAt
                ? `Updated ${formatGeneratedTime(
                    standingsResponse.generatedAt,
                  )}`
                : "Current tournament table"}
            </p>
          </div>

          {standingsResponse?.groupName && (
            <span className="rounded-full bg-(--color-bg-tint) px-2.5 py-1 text-[8px] font-black text-(--color-brand)">
              {standingsResponse.groupName}
            </span>
          )}
        </div>

        {/* EMPTY */}

        {standings.length === 0 ? (
          <EmptyStandings isKnockout={isKnockout} />
        ) : (
          <>
            {/* TOP 3 */}

            <PodiumPreview standings={standings} />

            {/* TABLE */}

            <StandingsTable standings={standings} />

            {/* LEGEND */}

            <StandingsLegend />
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PODIUM
========================================================= */

function PodiumPreview({
  standings,
}: {
  standings: VolleyballTournamentStanding[];
}) {
  const topThree = standings.slice(0, 3);

  if (topThree.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {topThree.map((team) => (
        <div
          key={team.teamId}
          className={cn(
            "rounded-2xl border bg-(--color-bg-card) px-2 py-3 text-center shadow-sm",

            team.position === 1
              ? "border-amber-200"
              : "border-(--color-bg-border)",
          )}
        >
          <div
            className={cn(
              "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-black",

              team.position === 1
                ? "bg-amber-100 text-amber-700"
                : team.position === 2
                  ? "bg-slate-100 text-slate-600"
                  : "bg-orange-50 text-orange-700",
            )}
          >
            {team.position === 1 ? <Medal size={15} /> : team.position}
          </div>

          <p className="mt-2 truncate text-[10px] font-black text-(--color-text-primary)">
            {team.teamName}
          </p>

          <p className="mt-1 font-(family-name:--font-display) text-lg font-black text-(--color-brand)">
            {team.competitionPoints}
          </p>

          <p className="text-[7px] font-black uppercase tracking-wide text-(--color-text-muted)">
            Points
          </p>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   TABLE
========================================================= */

function StandingsTable({
  standings,
}: {
  standings: VolleyballTournamentStanding[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-sm">
      {/* HEADER */}

      <div className="grid grid-cols-[30px_minmax(110px,1fr)_32px_32px_32px_42px_42px] items-center gap-1 border-b border-(--color-bg-border) bg-(--color-bg-base) px-2 py-2">
        <TableHeader>#</TableHeader>

        <TableHeader left>Team</TableHeader>

        <TableHeader>P</TableHeader>

        <TableHeader>W</TableHeader>

        <TableHeader>L</TableHeader>

        <TableHeader>SD</TableHeader>

        <TableHeader>PTS</TableHeader>
      </div>

      {/* ROWS */}

      <div>
        {standings.map((team, index) => (
          <StandingRow
            key={team.teamId}
            team={team}
            last={index === standings.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   ROW
========================================================= */

function StandingRow({
  team,
  last,
}: {
  team: VolleyballTournamentStanding;

  last: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[30px_minmax(110px,1fr)_32px_32px_32px_42px_42px] items-center gap-1 px-2 py-3",

        !last && "border-b border-(--color-bg-border)",
      )}
    >
      {/* POSITION */}

      <div>
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-black",

            team.position === 1
              ? "bg-amber-100 text-amber-700"
              : team.position === 2
                ? "bg-slate-100 text-slate-600"
                : team.position === 3
                  ? "bg-orange-50 text-orange-700"
                  : "bg-(--color-bg-base) text-(--color-text-muted)",
          )}
        >
          {team.position}
        </span>
      </div>

      {/* TEAM */}

      <div className="min-w-0 pr-2">
        <p className="truncate text-[10px] font-black text-(--color-text-primary)">
          {team.teamName}
        </p>

        <p className="mt-0.5 text-[7px] text-(--color-text-muted)">
          Sets {team.setsWon}-{team.setsLost}
        </p>
      </div>

      <TableValue>{team.played}</TableValue>

      <TableValue emphasis>{team.won}</TableValue>

      <TableValue>{team.lost}</TableValue>

      <TableValue
        positive={team.setDifference > 0}
        negative={team.setDifference < 0}
      >
        {formatSignedNumber(team.setDifference)}
      </TableValue>

      <div className="text-center">
        <span className="font-(family-name:--font-display) text-sm font-black text-(--color-brand)">
          {team.competitionPoints}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function StandingsLegend() {
  return (
    <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-3 py-3">
      <p className="text-[9px] font-black text-(--color-text-primary)">
        Table guide
      </p>

      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
        <LegendItem label="P" value="Played" />

        <LegendItem label="W" value="Won" />

        <LegendItem label="L" value="Lost" />

        <LegendItem label="SD" value="Set difference" />

        <LegendItem label="PTS" value="Competition points" />
      </div>

      <div className="mt-3 border-t border-(--color-bg-border) pt-2">
        <p className="text-[8px] leading-4 text-(--color-text-muted)">
          Ranking is provided by the tournament backend. YuvaCrix does not
          recalculate table positions on this screen.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyStandings({ isKnockout }: { isKnockout: boolean }) {
  return (
    <div className="rounded-3xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) px-5 py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
        <Trophy size={21} className="text-(--color-brand)" />
      </div>

      <p className="mt-3 text-sm font-black text-(--color-text-primary)">
        No standings yet
      </p>

      <p className="mx-auto mt-1 max-w-[270px] text-[10px] leading-5 text-(--color-text-muted)">
        {isKnockout
          ? "Tournament results will appear as knockout matches are completed."
          : "The points table will update automatically after tournament matches are completed."}
      </p>
    </div>
  );
}

/* =========================================================
   TABLE HELPERS
========================================================= */

function TableHeader({
  children,
  left = false,
}: {
  children: React.ReactNode;

  left?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-[7px] font-black uppercase tracking-wide text-(--color-text-muted)",

        left ? "text-left" : "text-center",
      )}
    >
      {children}
    </p>
  );
}

function TableValue({
  children,
  emphasis = false,
  positive = false,
  negative = false,
}: {
  children: React.ReactNode;

  emphasis?: boolean;

  positive?: boolean;

  negative?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-center text-[9px] font-bold text-(--color-text-secondary)",

        emphasis && "font-black text-(--color-text-primary)",

        positive && "text-emerald-600",

        negative && "text-(--color-live)",
      )}
    >
      {children}
    </p>
  );
}

function LegendItem({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-(--color-bg-base) px-1 text-[7px] font-black text-(--color-brand)">
        {label}
      </span>

      <span className="text-[8px] text-(--color-text-muted)">{value}</span>
    </div>
  );
}

/* =========================================================
   ERROR
========================================================= */

function StandingsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) px-4">
      <div className="w-full max-w-sm rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) p-5 text-center">
        <Trophy size={26} className="mx-auto text-(--color-brand)" />

        <p className="mt-3 text-sm font-black text-(--color-text-primary)">
          Unable to load standings
        </p>

        <p className="mt-1 text-[10px] leading-5 text-(--color-text-muted)">
          Tournament standings could not be loaded.
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

function StandingsSkeleton() {
  return (
    <div className="min-h-full bg-(--color-bg-base)">
      <div className="h-40 animate-pulse bg-(--color-navy)" />

      <div className="space-y-4 px-4 py-5">
        <div className="grid grid-cols-3 gap-2">
          <div className="h-24 animate-pulse rounded-2xl bg-(--color-bg-card)" />
          <div className="h-24 animate-pulse rounded-2xl bg-(--color-bg-card)" />
          <div className="h-24 animate-pulse rounded-2xl bg-(--color-bg-card)" />
        </div>

        <div className="h-72 animate-pulse rounded-2xl bg-(--color-bg-card)" />
      </div>
    </div>
  );
}

/* =========================================================
   FORMATTERS
========================================================= */

function formatSignedNumber(value: number) {
  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
}

function formatGeneratedTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
