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
import { MatchCard } from "./MatchCard";
import { DialogBottom } from "@/components/common/DialogBottom";
import { LiveOptionsSheet } from "./LiveOptionsSheet";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTab = "Your" | "Played" | "Network" | "All";

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

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showLiveOptions, setShowLiveOptions] = useState(false);

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

      case "SCHEDULED":
        return `/start-match/line-up`;

      case "READY_FOR_TOSS":
        return `/start-match/toss`;

      case "TOSS_DONE":
        return `/start-match/start-innings`;

      case "LIVE":
        if (
          match.primaryAction === "START_SCORING" ||
          match.primaryAction === "START_SECOND_INNINGS"
        ) {
          return `/start-match/start-innings`;
        } else {
          return `/scoring`;
        }

      case "INNINGS_BREAK":
        return `/start-match/start-innings`;

      case "COMPLETED":
        return `/matches/${match.matchId}/scorecard`; //score card

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

    if (match.status === "LIVE") {
      setSelectedMatch(match);
      setShowLiveOptions(true);
    } else {
      router.push(getMatchRoute(match));
    }
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

      {selectedMatch && (
        <LiveOptionsSheet
          showLiveOptions={showLiveOptions}
          setShowLiveOptions={setShowLiveOptions}
          match={selectedMatch}
          getMatchRoute={getMatchRoute}
        />
      )}
    </div>
  );
}
