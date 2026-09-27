"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  CalendarDays,
  MoreVertical,
  Radio,
  Volleyball,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { Button } from "@/components/common/Button";
import { DialogBox } from "@/components/common/DialogBox";
import { MatchesList } from "@/components/cricket/match/MatchesList";
import { LiveOptionsSheet } from "@/components/cricket/match/LiveOptionsSheet";

import { useGetTournamentMatchesQuery } from "@/store/api/cricket/tournamentMatchApi";
import { useDeleteFixtureMatchMutation } from "@/store/api/cricket/tournamentFixtureApi";
import { useAppDispatch } from "@/store/hooks";
import {
  resetMatch,
  setMatchContext,
  setTournamentMatchContext,
} from "@/store/startMatch/startMatchSlice";

import type { Team } from "@/types/team";
import { MatchCardModel } from "@/types/cricket/matchCard";
import { tournamentMatchToMatchCard } from "@/lib/adapters/tournamentMatchCardAdapter";
import { SPORT_TYPES } from "@/types/sport";

const TOURNAMENT_MATCH_TABS = ["LIVE", "UPCOMING", "PAST"] as const;

type TournamentMatchTab = (typeof TOURNAMENT_MATCH_TABS)[number];

const TOURNAMENT_TAB_LABELS: Record<TournamentMatchTab, string> = {
  LIVE: "Live",
  UPCOMING: "Upcoming",
  PAST: "Past",
};

function getDeleteFixtureMatchErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object"
  ) {
    const data = error.data as {
      code?: string;
      message?: string;
    };

    if (data.code === "TOURNAMENT_MATCH_DELETE_LOCKED") {
      return "This match can no longer be deleted because it has already started or finished.";
    }

    if (data.code === "MATCH_HAS_SCORING_DATA") {
      return "This match cannot be deleted because scoring data already exists.";
    }

    if (data.code === "TOURNAMENT_MATCH_NOT_FOUND_FOR_FIXTURE") {
      return "No linked match exists for this fixture.";
    }

    if (typeof data.message === "string") {
      return data.message;
    }
  }

  return "Unable to delete match.";
}

function canDeleteTournamentMatch(match: MatchCardModel) {
  return (
    match.source === "TOURNAMENT" &&
    match.isAdmin &&
    Boolean(match.fixtureId) &&
    match.status !== "LIVE" &&
    match.status !== "COMPLETED" &&
    match.status !== "CANCELLED" &&
    match.status !== "ABANDONED"
  );
}

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
  const [openActionsMatchId, setOpenActionsMatchId] = useState<string | null>(
    null,
  );
  const [matchToDelete, setMatchToDelete] = useState<MatchCardModel | null>(
    null,
  );
  const [deletingFixtureId, setDeletingFixtureId] = useState<string | null>(
    null,
  );
  const [deleteMatchError, setDeleteMatchError] = useState("");

  const [deleteFixtureMatch] = useDeleteFixtureMatchMutation();

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
          sportType: SPORT_TYPES.CRICKET,
          memberCount: match.teamA.squadCount,
        } as Team,

        teamB: {
          id: match.teamB.teamId,
          name: match.teamB.name,
          logoUrl: match.teamB.logoUrl,
          sportType: SPORT_TYPES.CRICKET,
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

  function handleRequestDeleteMatch(match: MatchCardModel) {
    if (!canDeleteTournamentMatch(match)) return;

    setOpenActionsMatchId(null);
    setDeleteMatchError("");
    setMatchToDelete(match);
  }

  async function handleConfirmDeleteMatch() {
    if (!matchToDelete?.fixtureId || deletingFixtureId) return;

    setDeleteMatchError("");
    setDeletingFixtureId(matchToDelete.fixtureId);

    try {
      await deleteFixtureMatch({
        tournamentId,
        fixtureId: matchToDelete.fixtureId,
      }).unwrap();

      setMatchToDelete(null);
    } catch (error) {
      setDeleteMatchError(getDeleteFixtureMatchErrorMessage(error));
    } finally {
      setDeletingFixtureId(null);
    }
  }

  function renderMatchActions(match: MatchCardModel) {
    if (!canDeleteTournamentMatch(match)) return null;

    const menuOpen = openActionsMatchId === match.matchId;

    return (
      <div className="relative">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setOpenActionsMatchId((current) =>
              current === match.matchId ? null : match.matchId,
            );
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full text-(--color-text-secondary) transition-colors hover:bg-(--color-bg-tint) hover:text-(--color-text-primary)"
          aria-label="Open match actions"
          aria-expanded={menuOpen}
        >
          <MoreVertical size={17} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-9 z-20 min-w-36 overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
            <button
              type="button"
              disabled={deletingFixtureId === match.fixtureId}
              onClick={(event) => {
                event.stopPropagation();
                handleRequestDeleteMatch(match);
              }}
              className="w-full px-4 py-3 text-left font-(family-name:--font-display) text-xs font-black uppercase tracking-wide text-(--color-live) transition-colors hover:bg-(--color-live)/8 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete Match
            </button>
          </div>
        )}
      </div>
    );
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
            renderActions={renderMatchActions}
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

      <DialogBox
        open={Boolean(matchToDelete)}
        onClose={() => {
          if (deletingFixtureId) return;

          setDeleteMatchError("");
          setMatchToDelete(null);
        }}
      >
        <div className="p-5">
          <h2 className="font-(family-name:--font-display) text-xl font-black uppercase text-(--color-text-primary)">
            Delete match?
          </h2>

          <p className="mt-2 text-sm leading-5 text-(--color-text-secondary)">
            This will delete the linked match but keep the fixture, teams,
            schedule and match number. You can create the match again later.
          </p>

          {deleteMatchError && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-(--color-live)/20 bg-(--color-live)/10 px-3 py-2.5">
              <AlertCircle
                size={15}
                className="mt-0.5 shrink-0 text-(--color-live)"
              />

              <p className="text-xs font-semibold text-(--color-live)">
                {deleteMatchError}
              </p>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={Boolean(deletingFixtureId)}
              onClick={() => {
                setDeleteMatchError("");
                setMatchToDelete(null);
              }}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="danger"
              size="sm"
              loading={Boolean(deletingFixtureId)}
              onClick={() => void handleConfirmDeleteMatch()}
            >
              Delete Match
            </Button>
          </div>
        </div>
      </DialogBox>
    </div>
  );
}
