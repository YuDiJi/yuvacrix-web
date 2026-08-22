"use client";

import {
  CalendarDays,
  ChevronRight,
  CircleDot,
  Plus,
  Trophy,
  Volleyball,
} from "lucide-react";

import { useMemo } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";

import { useGetVolleyballTournamentsQuery } from "@/store/api/volleyball/volleyballTournamentApi";

import {
  VOLLEYBALL_TOURNAMENT_STATUSES,
  type VolleyballTournament,
  type VolleyballTournamentStatus,
} from "@/types/volleyball/tournament";

/* =========================================================
   LOCAL TYPES
========================================================= */

type MyVolleyballTab = "matches" | "tournaments";

type MatchFilter = "all" | "live" | "upcoming" | "completed";

type TournamentFilter = "all" | "active" | "draft" | "completed";

/* =========================================================
   PAGE
========================================================= */

export default function MyVolleyballPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  /* =====================================================
     URL STATE
  ===================================================== */

  const requestedTab = searchParams.get("tab");

  const requestedFilter = searchParams.get("filter");

  const activeTab: MyVolleyballTab =
    requestedTab === "tournaments" ? "tournaments" : "matches";

  const matchFilter: MatchFilter = isMatchFilter(requestedFilter)
    ? requestedFilter
    : "all";

  const tournamentFilter: TournamentFilter = isTournamentFilter(requestedFilter)
    ? requestedFilter
    : "all";

  /* =====================================================
     TOURNAMENT API
  ===================================================== */

  const tournamentStatus = getTournamentStatus(tournamentFilter);

  const {
    data: tournaments = [],
    isLoading: isTournamentsLoading,
    isFetching: isTournamentsFetching,
    isError: isTournamentsError,
    refetch: refetchTournaments,
  } = useGetVolleyballTournamentsQuery(
    activeTab === "tournaments"
      ? tournamentStatus
        ? {
            status: tournamentStatus,
          }
        : {}
      : undefined,
    {
      skip: activeTab !== "tournaments",
    },
  );

  /*
   * Current API already returns VolleyballTournament[].
   *
   * Once backend adds:
   *
   * GET /volleyball/tournaments/me
   *
   * we will replace only the query above.
   *
   * The UI below will not need structural changes.
   */

  const sortedTournaments = useMemo(() => {
    return [...tournaments].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [tournaments]);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  function changeTab(tab: MyVolleyballTab) {
    const params = new URLSearchParams();

    params.set("tab", tab);
    params.set("filter", "all");

    router.replace(`/volleyball/my-volleyball?${params.toString()}`);
  }

  function changeMatchFilter(filter: MatchFilter) {
    const params = new URLSearchParams();

    params.set("tab", "matches");

    params.set("filter", filter);

    router.replace(`/volleyball/my-volleyball?${params.toString()}`);
  }

  function changeTournamentFilter(filter: TournamentFilter) {
    const params = new URLSearchParams();

    params.set("tab", "tournaments");

    params.set("filter", filter);

    router.replace(`/volleyball/my-volleyball?${params.toString()}`);
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-full bg-(--color-bg-base) pb-24">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="bg-(--color-navy) px-4 pb-5 pt-5 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/45">
              Volleyball
            </p>

            <h1 className="mt-1 font-(family-name:--font-display) text-2xl font-black uppercase tracking-wide">
              My Volleyball
            </h1>

            <p className="mt-1 text-[9px] text-white/50">
              Matches and tournaments in one place
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--color-brand)">
            <Volleyball size={20} />
          </div>
        </div>
      </section>

      {/* =================================================
          PRIMARY TABS
      ================================================= */}

      <div className="sticky top-0 z-20 border-b border-(--color-bg-border) bg-(--color-bg-card)">
        <div className="grid grid-cols-2 px-4">
          <MainTabButton
            active={activeTab === "matches"}
            label="Matches"
            onClick={() => changeTab("matches")}
          />

          <MainTabButton
            active={activeTab === "tournaments"}
            label="Tournaments"
            onClick={() => changeTab("tournaments")}
          />
        </div>
      </div>

      {/* =================================================
          MATCHES
      ================================================= */}

      {activeTab === "matches" && (
        <MatchesTab
          filter={matchFilter}
          onFilterChange={changeMatchFilter}
          onCreateMatch={() => router.push("/volleyball/matches/create")}
        />
      )}

      {/* =================================================
          TOURNAMENTS
      ================================================= */}

      {activeTab === "tournaments" && (
        <TournamentsTab
          filter={tournamentFilter}
          tournaments={sortedTournaments}
          loading={isTournamentsLoading}
          fetching={isTournamentsFetching}
          error={isTournamentsError}
          onFilterChange={changeTournamentFilter}
          onRetry={() => void refetchTournaments()}
          onCreate={() => router.push("/volleyball/tournaments/create")}
          onOpen={(tournamentId) =>
            router.push(`/volleyball/tournaments/${tournamentId}`)
          }
        />
      )}
    </div>
  );
}

/* =========================================================
   MATCHES TAB
========================================================= */

function MatchesTab({
  filter,
  onFilterChange,
  onCreateMatch,
}: {
  filter: MatchFilter;

  onFilterChange: (filter: MatchFilter) => void;

  onCreateMatch: () => void;
}) {
  return (
    <main className="px-4 py-4">
      {/* FILTERS */}

      <HorizontalFilters>
        <FilterChip
          selected={filter === "all"}
          onClick={() => onFilterChange("all")}
        >
          All
        </FilterChip>

        <FilterChip
          selected={filter === "live"}
          onClick={() => onFilterChange("live")}
        >
          Live
        </FilterChip>

        <FilterChip
          selected={filter === "upcoming"}
          onClick={() => onFilterChange("upcoming")}
        >
          Upcoming
        </FilterChip>

        <FilterChip
          selected={filter === "completed"}
          onClick={() => onFilterChange("completed")}
        >
          Completed
        </FilterChip>
      </HorizontalFilters>

      {/* MATCH FEED WAITING STATE */}

      <section className="mt-5 overflow-hidden rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-sm">
        <div className="px-5 py-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
            <CircleDot size={21} className="text-(--color-brand)" />
          </div>

          <p className="mt-3 text-sm font-black text-(--color-text-primary)">
            Your matches
          </p>

          <p className="mx-auto mt-1 max-w-[285px] text-[10px] leading-5 text-(--color-text-muted)">
            Your standalone Volleyball matches will appear here.
          </p>

          <div className="mt-4 rounded-2xl bg-(--color-bg-base) px-3 py-3 text-left">
            <p className="text-[8px] font-black uppercase tracking-wide text-(--color-brand)">
              Match feed coming next
            </p>

            <p className="mt-1 text-[8px] leading-4 text-(--color-text-muted)">
              The match list is waiting for the backend to identify standalone
              and tournament matches separately.
            </p>
          </div>

          <Button fullWidth className="mt-5" onClick={onCreateMatch}>
            <Plus size={15} />
            Start New Match
          </Button>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   TOURNAMENT TAB
========================================================= */

function TournamentsTab({
  filter,
  tournaments,
  loading,
  fetching,
  error,
  onFilterChange,
  onRetry,
  onCreate,
  onOpen,
}: {
  filter: TournamentFilter;

  tournaments: VolleyballTournament[];

  loading: boolean;

  fetching: boolean;

  error: boolean;

  onFilterChange: (filter: TournamentFilter) => void;

  onRetry: () => void;

  onCreate: () => void;

  onOpen: (tournamentId: string) => void;
}) {
  return (
    <main className="px-4 py-4">
      {/* FILTERS */}

      <HorizontalFilters>
        <FilterChip
          selected={filter === "all"}
          onClick={() => onFilterChange("all")}
        >
          All
        </FilterChip>

        <FilterChip
          selected={filter === "active"}
          onClick={() => onFilterChange("active")}
        >
          Active
        </FilterChip>

        <FilterChip
          selected={filter === "draft"}
          onClick={() => onFilterChange("draft")}
        >
          Draft
        </FilterChip>

        <FilterChip
          selected={filter === "completed"}
          onClick={() => onFilterChange("completed")}
        >
          Completed
        </FilterChip>
      </HorizontalFilters>

      <div className="mt-5">
        {loading ? (
          <TournamentSkeleton />
        ) : error ? (
          <TournamentError onRetry={onRetry} />
        ) : tournaments.length === 0 ? (
          <TournamentEmpty filter={filter} onCreate={onCreate} />
        ) : (
          <div className="space-y-3">
            {/* SECTION HEADING */}

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wide text-(--color-text-secondary)">
                  My Tournaments
                </p>

                <p className="mt-0.5 text-[8px] text-(--color-text-muted)">
                  {tournaments.length}{" "}
                  {tournaments.length === 1 ? "tournament" : "tournaments"}
                </p>
              </div>

              <button
                type="button"
                onClick={onCreate}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-(--color-brand) px-3 text-[9px] font-black text-white active:scale-[0.98]"
              >
                <Plus size={13} />
                New
              </button>
            </div>

            {/* REFRESH INDICATOR */}

            {fetching && (
              <div className="h-1 overflow-hidden rounded-full bg-(--color-bg-border)">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-(--color-brand)" />
              </div>
            )}

            {/* CARDS */}

            <div className="space-y-3">
              {tournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onClick={() => onOpen(tournament.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   TOURNAMENT CARD
========================================================= */

function TournamentCard({
  tournament,
  onClick,
}: {
  tournament: VolleyballTournament;

  onClick: () => void;
}) {
  const dateLabel = formatTournamentDates(tournament);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) text-left shadow-sm active:scale-[0.99]"
    >
      <div className="px-3.5 py-3.5">
        <div className="flex items-start gap-3">
          {/* ICON */}

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
            <Trophy size={18} className="text-(--color-brand)" />
          </div>

          {/* DETAILS */}

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black text-(--color-text-primary)">
                  {tournament.name}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-[8px] font-semibold text-(--color-text-muted)">
                    {formatTournamentFormat(tournament.format)}
                  </span>

                  <span className="h-1 w-1 rounded-full bg-(--color-bg-border)" />

                  <span className="text-[8px] font-semibold text-(--color-text-muted)">
                    {tournament.visibility}
                  </span>
                </div>
              </div>

              <TournamentStatusBadge status={tournament.status} />
            </div>

            {tournament.description && (
              <p className="mt-2 line-clamp-2 text-[9px] leading-4 text-(--color-text-muted)">
                {tournament.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <div className="flex items-center gap-3 border-t border-(--color-bg-border) bg-(--color-bg-base)/60 px-3.5 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <CalendarDays
            size={11}
            className="shrink-0 text-(--color-text-muted)"
          />

          <p className="truncate text-[8px] font-semibold text-(--color-text-muted)">
            {dateLabel ?? "Dates not set"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-[8px] font-black text-(--color-brand)">
          Manage
          <ChevronRight size={12} />
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   PRIMARY TAB
========================================================= */

function MainTabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;

  label: string;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative h-12 text-xs font-black",

        active ? "text-(--color-brand)" : "text-(--color-text-muted)",
      )}
    >
      {label}

      {active && (
        <span className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-(--color-brand)" />
      )}
    </button>
  );
}

/* =========================================================
   FILTERS
========================================================= */

function HorizontalFilters({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  selected,
  children,
  onClick,
}: {
  selected: boolean;

  children: React.ReactNode;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-full border px-4 text-[9px] font-black transition",

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
   STATUS
========================================================= */

function TournamentStatusBadge({
  status,
}: {
  status: VolleyballTournamentStatus;
}) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-1 text-[7px] font-black",

        status === VOLLEYBALL_TOURNAMENT_STATUSES.ACTIVE &&
          "bg-emerald-50 text-emerald-700",

        status === VOLLEYBALL_TOURNAMENT_STATUSES.DRAFT &&
          "bg-(--color-bg-tint) text-(--color-brand)",

        status === VOLLEYBALL_TOURNAMENT_STATUSES.COMPLETED &&
          "bg-slate-100 text-slate-600",

        status === VOLLEYBALL_TOURNAMENT_STATUSES.CANCELLED &&
          "bg-red-50 text-red-600",
      )}
    >
      {formatTournamentStatus(status)}
    </span>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function TournamentEmpty({
  filter,
  onCreate,
}: {
  filter: TournamentFilter;

  onCreate: () => void;
}) {
  return (
    <div className="rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) px-5 py-7 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
        <Trophy size={21} className="text-(--color-brand)" />
      </div>

      <p className="mt-3 text-sm font-black text-(--color-text-primary)">
        {getEmptyTitle(filter)}
      </p>

      <p className="mx-auto mt-1 max-w-[280px] text-[10px] leading-5 text-(--color-text-muted)">
        {getEmptyMessage(filter)}
      </p>

      {filter === "all" && (
        <Button fullWidth className="mt-5" onClick={onCreate}>
          <Plus size={15} />
          Create Tournament
        </Button>
      )}
    </div>
  );
}

/* =========================================================
   ERROR
========================================================= */

function TournamentError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) px-5 py-7 text-center">
      <Trophy size={24} className="mx-auto text-(--color-brand)" />

      <p className="mt-3 text-sm font-black text-(--color-text-primary)">
        Unable to load tournaments
      </p>

      <p className="mt-1 text-[10px] leading-5 text-(--color-text-muted)">
        We couldn&apos;t load your Volleyball tournaments.
      </p>

      <Button fullWidth className="mt-4" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function TournamentSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-32 animate-pulse rounded-2xl bg-(--color-bg-card)"
        />
      ))}
    </div>
  );
}

/* =========================================================
   FILTER HELPERS
========================================================= */

function isMatchFilter(value: string | null): value is MatchFilter {
  return (
    value === "all" ||
    value === "live" ||
    value === "upcoming" ||
    value === "completed"
  );
}

function isTournamentFilter(value: string | null): value is TournamentFilter {
  return (
    value === "all" ||
    value === "active" ||
    value === "draft" ||
    value === "completed"
  );
}

function getTournamentStatus(
  filter: TournamentFilter,
): VolleyballTournamentStatus | undefined {
  switch (filter) {
    case "active":
      return VOLLEYBALL_TOURNAMENT_STATUSES.ACTIVE;

    case "draft":
      return VOLLEYBALL_TOURNAMENT_STATUSES.DRAFT;

    case "completed":
      return VOLLEYBALL_TOURNAMENT_STATUSES.COMPLETED;

    default:
      return undefined;
  }
}

/* =========================================================
   FORMATTERS
========================================================= */

function formatTournamentStatus(status: VolleyballTournamentStatus) {
  switch (status) {
    case VOLLEYBALL_TOURNAMENT_STATUSES.ACTIVE:
      return "Active";

    case VOLLEYBALL_TOURNAMENT_STATUSES.DRAFT:
      return "Draft";

    case VOLLEYBALL_TOURNAMENT_STATUSES.COMPLETED:
      return "Completed";

    case VOLLEYBALL_TOURNAMENT_STATUSES.CANCELLED:
      return "Cancelled";

    default:
      return status;
  }
}

function formatTournamentFormat(format: string) {
  switch (format) {
    case "LEAGUE":
      return "League";

    case "KNOCKOUT":
      return "Knockout";

    case "GROUP_KNOCKOUT":
      return "Group + Knockout";

    default:
      return format;
  }
}

function formatTournamentDates(tournament: VolleyballTournament) {
  if (tournament.startDate && tournament.endDate) {
    return `${formatDate(tournament.startDate)} – ${formatDate(
      tournament.endDate,
    )}`;
  }

  if (tournament.startDate) {
    return `Starts ${formatDate(tournament.startDate)}`;
  }

  if (tournament.endDate) {
    return `Ends ${formatDate(tournament.endDate)}`;
  }

  return null;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getEmptyTitle(filter: TournamentFilter) {
  switch (filter) {
    case "active":
      return "No active tournaments";

    case "draft":
      return "No draft tournaments";

    case "completed":
      return "No completed tournaments";

    default:
      return "No tournaments yet";
  }
}

function getEmptyMessage(filter: TournamentFilter) {
  switch (filter) {
    case "active":
      return "Your active Volleyball tournaments will appear here.";

    case "draft":
      return "Tournament drafts you're preparing will appear here.";

    case "completed":
      return "Your finished Volleyball tournaments will appear here.";

    default:
      return "Create your first Volleyball tournament and manage teams, fixtures and matches from one place.";
  }
}
