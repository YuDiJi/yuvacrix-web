"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { useGetMyMatchesOverviewQuery } from "@/store/api/matchApi";
import { Match, MatchStatus } from "@/types/match";
import {
  resetMatch,
  setMatchContext,
  setMatchIdMode,
} from "@/store/startMatch/startMatchSlice";
import { useAppDispatch } from "@/store/hooks";
import { Team } from "@/types/team";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTab = "Your" | "Played" | "Network" | "All";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format ISO date → "19-May-26" */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    })
    .replace(/ /g, "-");
}

/** First 1–3 uppercase initials from a team ID (replace with real team name lookup) */
function teamInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Shorten match type label */
function matchTypeLabel(type: string): string {
  const map: Record<string, string> = {
    LIMITED_OVERS: "Individual Match",
    BOX_TURF: "Box Cricket",
    TEST: "Test Match",
    THE_HUNDRED: "The Hundred",
    PAIR: "Pair Cricket",
  };
  return map[type] ?? type;
}

/** Resolve display date — prefer scheduledAt, fallback to createdAt */
function resolveDate(match: Match): string {
  return formatDate(match.scheduledAt ?? match.createdAt);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MatchStatus }) {
  const config: Record<MatchStatus, { label: string; className: string }> = {
    DRAFT: {
      label: "Draft",
      className:
        "bg-(--color-bg-base) text-(--color-text-muted) border border-(--color-bg-border)",
    },
    SCHEDULED: {
      label: "Upcoming",
      className: "bg-(--color-sky)/15 text-(--color-sky)",
    },
    READY_FOR_TOSS: {
      label: "Ready for Toss",
      className: "bg-(--color-brand)/10 text-(--color-brand)",
    },
    TOSS_DONE: {
      label: "Toss Done",
      className: "bg-(--color-six)/15 text-(--color-six)",
    },
    LIVE: {
      label: "Live",
      className: "bg-(--color-live)/12 text-(--color-live)",
    },
    INNINGS_BREAK: {
      label: "Innings Break",
      className: "bg-(--color-six)/12 text-(--color-six)",
    },
    COMPLETED: {
      label: "Completed",
      className: "bg-(--color-four)/12 text-(--color-four)",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-(--color-text-muted)/10 text-(--color-text-muted)",
    },
    ABANDONED: {
      label: "Abandoned",
      className: "bg-(--color-text-muted)/10 text-(--color-text-muted)",
    },
  };

  const { label, className } = config[status] ?? config.DRAFT;

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[10px] font-(family-name:--font-display) font-bold uppercase tracking-[0.07em]",
        className,
      )}
    >
      {label}
    </span>
  );
}

// ─── Team Avatar ──────────────────────────────────────────────────────────────

function TeamAvatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-bg-base) border border-(--color-bg-border)">
      <span className="font-(family-name:--font-display) text-xs font-black text-(--color-text-secondary) uppercase tracking-wide">
        {initials}
      </span>
    </div>
  );
}

// ─── Match Card ───────────────────────────────────────────────────────────────

function MatchCard({ match, onClick }: { match: Match; onClick: () => void }) {
  const router = useRouter();

  const teamAName = match.teamA.name;
  const teamBName = match.teamB.name;
  const venue_city = match.venue.city;
  const venue_groundName = match.venue.groundName;
  const displayDate = resolveDate(match);
  const overs = match.oversLimit;
  const typeLabel = matchTypeLabel(match.matchType);

  const tossWinnerName =
    match.toss?.wonByTeamId === match.teamA.teamId
      ? match.teamA.name
      : match.teamB.name;

  const tossSentence =
    match.status === "DRAFT"
      ? "Select Line-up"
      : match.status === "SCHEDULED" && match.scheduledAt
        ? `Match scheduled to begin on ${formatDate(
            match.scheduledAt,
          )} at ${new Date(match.scheduledAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : match.status === "READY_FOR_TOSS"
          ? "Start Toss"
          : ["TOSS_DONE", "LIVE", "INNINGS_BREAK"].includes(match.status) &&
              match.toss
            ? `${tossWinnerName} won the toss and elected to ${match.toss.decision.toLowerCase()}`
            : match.status === "COMPLETED"
              ? "Match completed"
              : match.status === "CANCELLED"
                ? "Match cancelled"
                : match.status === "ABANDONED"
                  ? "Match abandoned"
                  : null;

  return (
    <button
      onClick={onClick}
      className="fixture-bar w-full rounded-2xl bg-(--color-bg-card) shadow-(--shadow-card) text-left transition-all duration-150 active:scale-[0.99] hover:shadow-[0_4px_20px_rgba(13,27,62,0.10)]"
    >
      {/* Top meta row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-section-label">{typeLabel}</span>
        <StatusBadge status={match.status} />
      </div>

      {/* Date + overs + venue */}
      <div className="px-4 pb-3">
        <p className="text-xs text-(--color-text-muted) font-medium">
          {displayDate}
          {" | "}
          {overs} Ov.
          {" | "}
          {venue_city}, {venue_groundName}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-(--color-bg-border)" />

      {/* Teams */}
      <div className="flex flex-col gap-2.5 px-4 py-3">
        {/* Team A */}
        <div className="flex items-center gap-3">
          <TeamAvatar initials={teamInitials(teamAName)} />
          <span
            className={cn(
              "font-(family-name:--font-display) font-black uppercase leading-tight",
              teamAName.length > 12 ? "text-base" : "text-lg",
            )}
            style={{ letterSpacing: "0.02em", color: "var(--color-navy)" }}
          >
            {teamAName}
          </span>
        </div>

        {/* Team B */}
        <div className="flex items-center gap-3">
          <TeamAvatar initials={teamInitials(teamBName)} />
          <span
            className={cn(
              "font-(family-name:--font-display) font-black uppercase leading-tight",
              teamBName.length > 12 ? "text-base" : "text-lg",
            )}
            style={{ letterSpacing: "0.02em", color: "var(--color-navy)" }}
          >
            {teamBName}
          </span>
        </div>
      </div>

      {/* Bottom row — toss/schedule + action links */}
      {(tossSentence || true) && (
        <>
          <div className="mx-4 h-px bg-(--color-bg-border)" />
          <div className="flex items-center justify-between px-4 py-3 gap-2">
            <p className="flex-1 min-w-0 text-xs italic text-(--color-text-muted) leading-relaxed truncate">
              {tossSentence}
            </p>
            {/* Action links */}
            <div
              className="flex items-center gap-3 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() =>
                  router.push(`/matches/${match.matchId}/insights`)
                }
                className="text-[11px] font-(family-name:--font-display) font-black uppercase tracking-[0.07em] text-(--color-brand) hover:opacity-70 transition-opacity"
              >
                Insights
              </button>
              <button
                onClick={() => router.push(`/matches/${match.matchId}/squads`)}
                className="text-[11px] font-(family-name:--font-display) font-black uppercase tracking-[0.07em] text-(--color-brand) hover:opacity-70 transition-opacity"
              >
                Squads
              </button>
            </div>
          </div>
        </>
      )}
    </button>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) shadow-(--shadow-card) p-4 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-3 w-32 rounded-full bg-(--color-bg-border)" />
        <div className="h-5 w-20 rounded-full bg-(--color-bg-border)" />
      </div>
      <div className="h-3 w-48 rounded-full bg-(--color-bg-border)" />
      <div className="h-px bg-(--color-bg-border)" />
      <div className="flex gap-3 items-center">
        <div className="h-9 w-9 rounded-full bg-(--color-bg-border)" />
        <div className="h-4 w-36 rounded-full bg-(--color-bg-border)" />
      </div>
      <div className="flex gap-3 items-center">
        <div className="h-9 w-9 rounded-full bg-(--color-bg-border)" />
        <div className="h-4 w-28 rounded-full bg-(--color-bg-border)" />
      </div>
    </div>
  );
}

// ─── Filter chips ─────────────────────────────────────────────────────────────

const FILTER_TABS: FilterTab[] = ["Your", "Played", "Network", "All"];

function FilterChips({
  active,
  onChange,
}: {
  active: FilterTab;
  onChange: (t: FilterTab) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "shrink-0 rounded-full px-5 py-2 text-sm font-(family-name:--font-display) font-bold uppercase tracking-[0.04em] transition-all duration-150 active:scale-95",
            active === tab
              ? "bg-(--color-brand) text-white shadow-[0_2px_8px_rgba(27,63,160,0.3)]"
              : "bg-(--color-bg-card) text-(--color-text-secondary) border border-(--color-bg-border) hover:border-(--color-brand)/30",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ─── Nav tabs (horizontal scroll) ────────────────────────────────────────────

const NAV_TABS = ["Matches", "Tournaments", "Teams", "Stats", "Highlights"];

function NavTabs({ active }: { active: string }) {
  return (
    <div className="flex overflow-x-auto bg-(--color-brand) scrollbar-none">
      {NAV_TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            className={cn(
              "shrink-0 px-5 py-3.5 font-(family-name:--font-display) font-black uppercase text-[13px] tracking-[0.06em] transition-all relative",
              isActive ? "text-white" : "text-white/45 hover:text-white/70",
            )}
          >
            {tab}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MatchesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Your");

  const {
    data: matches = [],
    isLoading,
    isError,
  } = useGetMyMatchesOverviewQuery();

  // In a real app, team names would be fetched/cached separately.
  // Here we derive a short display from teamId last chars as placeholder.
  // Replace with a team name lookup map from your store/cache.

  // Filter — "Your" and "All" show all since the endpoint already returns own matches
  const filtered = useMemo<Match[]>(() => {
    const m = matches as Match[];
    if (activeFilter === "Played") {
      return m.filter((x) =>
        ["COMPLETED", "IN_REVIEW", "ABANDONED"].includes(x.status),
      );
    }
    if (activeFilter === "Network") {
      return m.filter((x) => x.status === "LIVE");
    }
    return m; // Your + All
  }, [matches, activeFilter]);

  const getMatchRoute = (match: Match) => {
    switch (match.status) {
      case "DRAFT":
        return `/start-match/line-up`;

      case "READY_FOR_TOSS":
        return `/start-match/toss`;

      case "SCHEDULED":
        return `/start-match`;

      case "TOSS_DONE":
        return `/start-match/start-innings`;

      case "LIVE":
        return `/scoring`;

      case "INNINGS_BREAK":
        return `/start-match/start-innings`;

      case "COMPLETED":
        return `/start-match/${match.matchId}/summary`;

      case "CANCELLED":
      case "ABANDONED":
        return `/start-match/${match.matchId}`;

      default:
        return `/start-match/${match.matchId}`;
    }
  };

  const handleMatchClick = (match: Match) => {
    dispatch(
      setMatchContext({
        matchId: match.matchId,
        lineUpMode: match.lineupMode,

        teamA: {
          id: match.teamA.teamId,
          name: match.teamA.name,
          logoUrl: match.teamA.logoUrl,
          sportType: "CRICKET",
          memberCount: match.teamA.squadCount,
        } as Team,

        teamB: {
          id: match.teamB.teamId,
          name: match.teamB.name,
          logoUrl: match.teamB.logoUrl,
          sportType: "CRICKET",
          memberCount: match.teamB.squadCount,
        } as Team,

        teamACaptain: match.teamA.captainId
          ? {
              id: match.teamA.captainId,
              name: "",
            }
          : null,

        teamAKeeper: match.teamA.wicketKeeperId
          ? {
              id: match.teamA.wicketKeeperId,
              name: "",
            }
          : null,

        teamBCaptain: match.teamB.captainId
          ? {
              id: match.teamB.captainId,
              name: "",
            }
          : null,

        teamBKeeper: match.teamB.wicketKeeperId
          ? {
              id: match.teamB.wicketKeeperId,
              name: "",
            }
          : null,
      }),
    );

    router.push(getMatchRoute(match));
  };

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base)">
      {/* ── Nav tabs ─────────────────────────────────────────────────────── */}
      <NavTabs active="Matches" />

      {/* ── Start match banner ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-(--color-bg-card) px-4 py-3.5 border-b border-(--color-bg-border)">
        <p className="text-sm font-medium text-(--color-text-secondary)">
          Want to start a match?
        </p>
        <button
          onClick={() => {
            dispatch(resetMatch());
            router.push("/start-match");
          }}
          className="rounded-xl bg-(--color-brand) px-5 py-2 font-(family-name:--font-display) font-black uppercase text-sm tracking-[0.06em] text-white shadow-(--shadow-button) transition-all active:scale-95"
        >
          Start
        </button>
      </div>

      {/* ── Filter chips ─────────────────────────────────────────────────── */}
      <div className="py-3 bg-(--color-bg-base)">
        <FilterChips active={activeFilter} onChange={setActiveFilter} />
      </div>

      {/* ── Match list ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-4 pb-6 flex-1">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm text-(--color-text-muted) text-center">
              Failed to load matches. Pull down to retry.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-(--color-bg-tint) flex items-center justify-center">
              {/* Stumps icon */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect
                  x="7"
                  y="6"
                  width="2.5"
                  height="16"
                  rx="1.25"
                  fill="var(--color-brand)"
                  opacity="0.5"
                />
                <rect
                  x="12.75"
                  y="5"
                  width="2.5"
                  height="17"
                  rx="1.25"
                  fill="var(--color-brand)"
                  opacity="0.7"
                />
                <rect
                  x="18.5"
                  y="6"
                  width="2.5"
                  height="16"
                  rx="1.25"
                  fill="var(--color-brand)"
                  opacity="0.5"
                />
                <rect
                  x="6"
                  y="5"
                  width="7"
                  height="2"
                  rx="1"
                  fill="var(--color-sky)"
                />
                <rect
                  x="15"
                  y="5"
                  width="7"
                  height="2"
                  rx="1"
                  fill="var(--color-sky)"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-(--color-text-muted) text-center">
              {activeFilter === "Played"
                ? "No completed matches yet"
                : "No matches found"}
            </p>
            <button
              onClick={() => router.push("/start-match")}
              className="mt-1 rounded-xl bg-(--color-brand) px-5 py-2.5 font-(family-name:--font-display) font-black uppercase text-sm tracking-[0.06em] text-white shadow-(--shadow-button) transition-all active:scale-95"
            >
              Start a Match
            </button>
          </div>
        ) : (
          filtered.map((match) => (
            <MatchCard
              key={match.matchId}
              match={match}
              onClick={() => handleMatchClick(match)}
            />
          ))
        )}
      </div>
    </div>
  );
}
