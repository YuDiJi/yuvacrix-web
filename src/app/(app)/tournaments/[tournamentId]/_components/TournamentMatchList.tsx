"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CalendarDays, Plus, Radio, Volleyball } from "lucide-react";

import { cn } from "@/lib/cn";
import { MatchesList } from "@/components/cricket/match/MatchesList";
import { LiveOptionsSheet } from "@/components/cricket/match/LiveOptionsSheet";

import { useGetTournamentMatchesQuery } from "@/store/api/cricket/tournamentMatchApi";
import { useAppDispatch } from "@/store/hooks";
import {
  resetMatch,
  setMatchContext,
  setTournamentMatchContext,
} from "@/store/startMatch/startMatchSlice";

import type { Team } from "@/types/cricket/team";
import { MatchCardModel } from "@/types/cricket/matchCard";
import { tournamentMatchToMatchCard } from "@/lib/adapters/tournamentMatchCardAdapter";

const TOURNAMENT_MATCH_TABS = ["LIVE", "UPCOMING", "PAST"] as const;

type TournamentMatchTab = (typeof TOURNAMENT_MATCH_TABS)[number];

const TOURNAMENT_TAB_LABELS: Record<TournamentMatchTab, string> = {
  LIVE: "Live",
  UPCOMING: "Upcoming",
  PAST: "Past",
};

export default function TournamentMatchList() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useParams();

  const tournamentId = params.tournamentId as string;

  const [activeTab, setActiveTab] = useState<TournamentMatchTab>("PAST");

  const [selectedMatch, setSelectedMatch] = useState<MatchCardModel | null>(
    null,
  );
  const [showLiveOptions, setShowLiveOptions] = useState(false);

  const {
    data: tournamentMatches = [],
    isLoading,
    isFetching,
    isError,
  } = useGetTournamentMatchesQuery({
    tournamentId,
    filter: activeTab,
    skip: 0,
    limit: 50,
  });

  const matches = useMemo<MatchCardModel[]>(
    () => tournamentMatches.map(tournamentMatchToMatchCard),
    [tournamentMatches],
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
        return `/tournaments/${tournamentId}`;
    }
  }

  function setSelectedMatchContext(match: MatchCardModel) {
    dispatch(
      setTournamentMatchContext({
        tournamentId,
        roundId: match.roundId ?? "",
      }),
    );

    dispatch(
      setMatchContext({
        matchId: match.matchId,
        lineUpMode: "FLEXIBLE",

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

    if (!match.isAdmin) {
      return router.push(`/matches/${match.matchId}/scorecard`);
    }

    if (match.status === "LIVE") {
      setSelectedMatch(match);
      setShowLiveOptions(true);
      return;
    }

    router.push(getMatchRoute(match));
  }

  function handleStartMatch() {
    dispatch(resetMatch());

    dispatch(
      setTournamentMatchContext({
        tournamentId,
        roundId: "",
      }),
    );

    router.push(`/tournaments/${tournamentId}/start-match`);
  }

  function getEmptyContent() {
    switch (activeTab) {
      case "LIVE":
        return {
          title: "No Live Matches",
          description:
            "There are no tournament matches being played right now.",
        };

      case "PAST":
        return {
          title: "No Past Matches",
          description: "Completed tournament matches will appear here.",
        };

      default:
        return {
          title: "No Upcoming Matches",
          description:
            "Create a tournament match to schedule or start playing.",
        };
    }
  }

  const emptyContent = getEmptyContent();
  const loading = isLoading || isFetching;

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base)">
      {/* Tournament match tabs */}

      <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none">
        {TOURNAMENT_MATCH_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 rounded-full px-5 py-1 text-sm font-(family-name:--font-display) font-bold uppercase tracking-[0.04em] transition-all duration-150 active:scale-95",
              activeTab === tab
                ? "bg-(--color-brand) text-white shadow-[0_2px_8px_rgba(27,63,160,0.3)]"
                : "bg-(--color-bg-card) text-(--color-text-secondary) border border-(--color-bg-border) hover:border-(--color-brand)/30",
            )}
          >
            {TOURNAMENT_TAB_LABELS[tab]}

            {activeTab === tab && (
              <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-(--color-brand)" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 px-4 py-4">
        {!loading && !isError && matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-(--color-bg-tint)">
              {activeTab === "UPCOMING" ? (
                <CalendarDays size={34} className="text-(--color-brand)" />
              ) : activeTab === "LIVE" ? (
                <Radio size={34} className="text-(--color-brand)" />
              ) : activeTab === "PAST" ? (
                <Volleyball size={34} className="text-(--color-brand)" />
              ) : (
                ""
              )}
            </div>

            <h3 className="mt-5 font-(family-name:--font-display) text-xl font-black uppercase tracking-wide text-(--color-text-primary)">
              {emptyContent.title}
            </h3>

            <p className="mt-2 max-w-64 text-sm leading-6 text-(--color-text-secondary)">
              {emptyContent.description}
            </p>
          </div>
        ) : (
          <MatchesList
            matches={matches}
            isLoading={loading}
            isError={isError}
            errorText="Failed to load tournament matches."
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
