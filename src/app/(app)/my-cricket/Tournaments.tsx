import { useState, useMemo } from "react";
import { Team } from "@/types/team";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

import {
  resetMatch,
  setMatchContext,
  setMatchIdMode,
  setTournamentMatchContext,
} from "@/store/startMatch/startMatchSlice";
import { useAppDispatch } from "@/store/hooks";
import {
  Tournament,
  useGetMyOwnedTournamentsQuery,
} from "@/store/api/tournamentApi";
import { TournamentCard } from "./TournamentCard";

type FilterTab = "Your" | "Participate" | "Network" | "All";

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

const FILTER_TABS: FilterTab[] = ["Your", "Participate", "Network", "All"];

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

const Tournaments = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [showLiveOptions, setShowLiveOptions] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Your");

  const {
    data: tournaments,
    isLoading,
    isError,
  } = useGetMyOwnedTournamentsQuery();

  const filtered = useMemo<Tournament[]>(() => {
    const m = tournaments as Tournament[];
    if (activeFilter === "Participate") {
      return m.filter((x) => ["COMPLETED", "ACTIVE"].includes(x.status));
    }
    if (activeFilter === "Network") {
      return m.filter((x) => x.status === "ARCHIVED");
    }
    return m; // Your + All
  }, [tournaments, activeFilter]);

  const getMatchRoute = (tournament: Tournament) => {
    switch (tournament.status) {
      case "DRAFT":
        return `/tournaments/${tournament.id}`;

      case "FIXTURES_READY":
      case "ACTIVE":
      case "COMPLETED":
      case "ARCHIVED":
      case "CANCELLED":
        return `/tournaments/${tournament.id}`;

      default:
        return `/tournaments/${tournament.id}`;
    }
  };

  const handleMatchClick = (tournament: Tournament) => {
    // if (match.status === "LIVE") {
    //   setSelectedMatch(match);
    //   setShowLiveOptions(true);
    // } else {
    if (tournament) {
      router.push(getMatchRoute(tournament));
    }
  };

  return (
    <div>
      {/* ── Start match banner ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-(--color-bg-card) px-4 py-3.5 border-b border-(--color-bg-border)">
        <p className="text-sm font-medium text-(--color-text-secondary)">
          Want to host a tournament?
        </p>
        <button
          onClick={() => {
            dispatch(resetMatch());
            router.push("/add-tournaments-series/create-tournament");
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
              {activeFilter === "Participate"
                ? "No completed matches yet"
                : "No matches found"}
            </p>
            <button
              onClick={() => {
                dispatch(resetMatch());
                router.push("/start-match");
              }}
              className="mt-1 rounded-xl bg-(--color-brand) px-5 py-2.5 font-(family-name:--font-display) font-black uppercase text-sm tracking-[0.06em] text-white shadow-(--shadow-button) transition-all active:scale-95"
            >
              Start a Match
            </button>
          </div>
        ) : (
          filtered.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              onClick={() => handleMatchClick(tournament)}
            />
          ))
        )}
      </div>
      {/* 
      {selectedMatch && (
        <LiveOptionsSheet
          showLiveOptions={showLiveOptions}
          setShowLiveOptions={setShowLiveOptions}
          tournament={selectedTournament}
          getMatchRoute={getMatchRoute}
        />
      )} */}
    </div>
  );
};

export default Tournaments;
