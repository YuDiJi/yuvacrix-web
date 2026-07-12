"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/cn";
import { MatchesList } from "@/components/match/MatchesList";
import { LiveOptionsSheet } from "@/components/match/LiveOptionsSheet";

import { useGetMyMatchesOverviewQuery } from "@/store/api/matchApi";
import { useAppDispatch } from "@/store/hooks";
import {
  resetMatch,
  setMatchContext,
} from "@/store/startMatch/startMatchSlice";

// import type { Match } from "@/types/match";
import type { Team } from "@/types/team";

import { matchToMatchCard } from "@/lib/adapters/matchCardAdapter";
import type { MatchCardModel } from "@/types/matchCard";

const MY_MATCH_TABS = ["YOUR", "PLAYED", "NETWORK", "ALL"] as const;

type MyMatchTab = (typeof MY_MATCH_TABS)[number];

const MY_MATCH_TAB_LABELS: Record<MyMatchTab, string> = {
  YOUR: "Your",
  PLAYED: "Played",
  NETWORK: "Network",
  ALL: "All",
};

export default function MyMatches() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<MyMatchTab>("YOUR");
  const [selectedMatch, setSelectedMatch] = useState<MatchCardModel | null>(
    null,
  );
  const [showLiveOptions, setShowLiveOptions] = useState(false);

  const {
    data: matches = [],
    isLoading,
    isError,
  } = useGetMyMatchesOverviewQuery();

  const filteredMatches = useMemo(() => {
    if (activeTab === "PLAYED") {
      return matches.filter((match) =>
        ["COMPLETED", "IN_REVIEW", "ABANDONED", "CANCELLED"].includes(
          match.status,
        ),
      );
    }

    if (activeTab === "NETWORK") {
      return matches.filter((match) =>
        ["LIVE", "INNINGS_BREAK"].includes(match.status),
      );
    }

    // YOUR and ALL currently show the full response because
    // the backend endpoint does not provide separate filters.
    return matches;
  }, [matches, activeTab]);

  const matchCards = useMemo<MatchCardModel[]>(
    () => filteredMatches.map(matchToMatchCard),
    [filteredMatches],
  );

  function getMatchRoute(match: MatchCardModel) {
    switch (match.status) {
      case "DRAFT":
      case "SCHEDULED":
        return "/start-match/line-up";

      case "READY_FOR_TOSS":
        return "/start-match/toss";

      case "TOSS_DONE":
      case "INNINGS_BREAK":
        return "/start-match/start-innings";

      case "LIVE":
        if (
          match.primaryAction === "START_SCORING" ||
          match.primaryAction === "START_SECOND_INNINGS"
        ) {
          return "/start-match/start-innings";
        }

        return "/scoring";

      case "COMPLETED":
        return `/matches/${match.matchId}/scorecard`;

      default:
        return `/start-match/${match.matchId}`;
    }
  }

  function setSelectedMatchContext(match: MatchCardModel) {
    dispatch(
      setMatchContext({
        matchId: match.matchId,
        lineUpMode: match.lineupMode ? match.lineupMode : "FLEXIBLE",

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
  }

  function handleMatchClick(match: MatchCardModel) {
    setSelectedMatchContext(match);

    if (match.status === "LIVE") {
      setSelectedMatch(match);
      setShowLiveOptions(true);
      return;
    }

    router.push(getMatchRoute(match));
  }

  function handleStartMatch() {
    dispatch(resetMatch());
    router.push("/start-match");
  }

  function getEmptyText() {
    switch (activeTab) {
      case "PLAYED":
        return "No completed matches yet";

      case "NETWORK":
        return "No live matches in your network";

      case "ALL":
        return "No matches found";

      default:
        return "You haven't created or played any matches yet";
    }
  }

  return (
    <div className="flex h-full flex-col bg-(--color-bg-base)">
      {/* Start match banner */}
      <div className="flex items-center justify-between border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3.5">
        <p className="text-sm font-medium text-(--color-text-secondary)">
          Want to start a match?
        </p>

        <button
          type="button"
          onClick={handleStartMatch}
          className="rounded-xl bg-(--color-brand) px-5 py-2 font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em] text-white shadow-(--shadow-button) transition-all active:scale-95"
        >
          Start
        </button>
      </div>

      {/* My Cricket tabs */}
      <div className="bg-(--color-bg-base) py-3">
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-1">
          {MY_MATCH_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2",
                "font-(family-name:--font-display) text-sm font-bold uppercase tracking-[0.04em]",
                "transition-all duration-150 active:scale-95",
                activeTab === tab
                  ? "bg-(--color-brand) text-white shadow-[0_2px_8px_rgba(27,63,160,0.3)]"
                  : "border border-(--color-bg-border) bg-(--color-bg-card) text-(--color-text-secondary)",
              )}
            >
              {MY_MATCH_TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pb-6">
        {!isLoading && !isError && filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-bg-tint)">
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
              </svg>
            </div>

            <p className="text-sm font-medium text-(--color-text-muted)">
              {getEmptyText()}
            </p>

            <button
              type="button"
              onClick={handleStartMatch}
              className="mt-1 rounded-xl bg-(--color-brand) px-5 py-2.5 font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em] text-white shadow-(--shadow-button)"
            >
              Start a Match
            </button>
          </div>
        ) : (
          <MatchesList
            matches={matchCards}
            isLoading={isLoading}
            isError={isError}
            onMatchClick={handleMatchClick}
          />
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
