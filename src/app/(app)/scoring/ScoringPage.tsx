"use client";

import { Copy, ChevronUp, User, Volleyball } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectMatchId } from "@/store/startMatch/selectors";
import {
  useGetScoringStateQuery,
  useRecordBallMutation,
} from "@/store/api/scoringApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { ExtraType } from "@/types/scoring";
import { useEffect, useState } from "react";
import { WideBallSheet } from "./WideBall";
import { NoBallSheet } from "./NoBall";
import { ByeSheet } from "./Bye";
import { LegByeSheet } from "./LegBye";
import { RunningSheet } from "./Running";
import { useGetMatchByIdQuery } from "@/store/api/matchApi";
import { useMemo } from "react";
import { UndoSheet } from "./Undo";
import { OutSheet } from "./out/Out";
import { CompletionSheet } from "./CompletionSheet";
import { NextBowlerSheet } from "./NextBowler";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";
import { BallChip } from "./BallChip";
import { ScoringState } from "@/types/innings";
import NextBatterSheet from "./NextBatter";

import { useRouter } from "next/navigation";

export type DialogType =
  | "WIDE"
  | "NO_BALL"
  | "BYE"
  | "LEG_BYE"
  | "OUT"
  | "UNDO"
  | "RUNNING";

type ScoringFlow =
  | "IDLE"
  | "OVER_COMPLETED"
  | "SELECT_NEXT_BOWLER"
  | "SELECT_NEXT_BATTER"
  | "AWAITING_NEXT_OVER"
  | "START_NEXT_INNINGS"
  | "MATCH_COMPLETED";

export default function ScoringPage() {
  const router = useRouter();
  const matchId = useAppSelector(selectMatchId);
  const { data: matchData } = useGetMatchByIdQuery(
    matchId ? { matchId } : skipToken,
  );
  const { data: state } = useGetScoringStateQuery(matchId ?? skipToken);

  const [recordBall, { isLoading: isRecording }] = useRecordBallMutation();

  const [openDialog, setOpenDialog] = useState<null | DialogType>(null);
  const [flow, setFlow] = useState<ScoringFlow>("IDLE");
  const [completedOverSnapshot, setCompletedOverSnapshot] =
    useState<ScoringState | null>(null);

  const playersById = useMemo(() => {
    return new Map(
      (matchData?.players ?? []).map((player) => [player.playerId, player]),
    );
  }, [matchData?.players]);

  async function handleRuns(batRuns: number) {
    if (!state || !matchId) return;

    try {
      const response = await recordBall({
        matchId,
        inningsId: state.inningsId,
        clientEventId: Date.now().toString(),
        runs: {
          batRuns,
        },
      }).unwrap();

      if (response.nextAction?.type === "SELECT_NEXT_BOWLER") {
        setCompletedOverSnapshot(state);
      }

      setOpenDialog(null);
    } catch (error) {
      console.error(error);
    }
  }

  const handleExtra = async (type: ExtraType, additionalRuns: number) => {
    if (!matchId || !state) return;

    try {
      const response = await recordBall({
        matchId,
        inningsId: state.inningsId,
        clientEventId: Date.now().toString(),

        runs: {
          batRuns: 0,
        },

        extra: {
          type,
          additionalRuns,
        },
      }).unwrap();

      if (response.nextAction?.type === "SELECT_NEXT_BOWLER") {
        setCompletedOverSnapshot(state);
      }

      setOpenDialog(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!state || flow !== "IDLE") return;

    if (flow !== "IDLE") return;

    if (state.inningsCompleted && state.inningsNumber === 2) {
      return setFlow("MATCH_COMPLETED");
    }

    if (state.inningsCompleted) {
      return setFlow("START_NEXT_INNINGS");
    }

    if (state.requiresNewBatter) {
      return setFlow("SELECT_NEXT_BATTER");
    }

    if (state.overCompleted) {
      return setFlow("OVER_COMPLETED");
    }

    if (state.requiresBowlerSelection) {
      return setFlow("SELECT_NEXT_BOWLER");
    }

    return setFlow("IDLE");
  }, [state]);

  const scoringLocked = flow === "AWAITING_NEXT_OVER";

  const shouldUseSnapshot =
    flow === "OVER_COMPLETED" ||
    flow === "SELECT_NEXT_BOWLER" ||
    flow === "AWAITING_NEXT_OVER";

  const displayState =
    shouldUseSnapshot && completedOverSnapshot ? completedOverSnapshot : state;

  const striker = displayState?.currentStrikerId
    ? playersById.get(displayState.currentStrikerId)
    : undefined;

  const nonStriker = displayState?.currentNonStrikerId
    ? playersById.get(displayState.currentNonStrikerId)
    : undefined;

  const bowler = displayState?.currentBowlerId
    ? playersById.get(displayState.currentBowlerId)
    : undefined;

  const battingTeam = matchData?.teams.find(
    (team) => team.teamId === displayState?.battingTeamId,
  );
  const bowlingTeam = matchData?.teams.find(
    (team) => team.teamId === displayState?.bowlingTeamId,
  );
  const tossWinner = matchData?.teams?.find(
    (team) => team.teamId === matchData?.match?.toss?.wonByTeamId,
  );

  const resetFlow = () => {
    setFlow("IDLE");
    setCompletedOverSnapshot(null);
  };

  return (
    // 'absolute inset-x-0 bottom-0 top-14' strictly forces the layout to fit
    // exactly within the screen under the global header, preventing any scrolling.
    <div className="absolute inset-x-0 bottom-0 top-14 flex flex-col bg-(--color-bg-base) overflow-hidden z-10">
      {/* 1. HERO SECTION (Navy Background) */}
      <div className="bg-(--color-navy) text-white pb-10 rounded-b-sm shrink-0">
        <div className="flex flex-col items-center pt-6 px-4">
          <h3 className="text-2xl font-bold leading-none text-(--color-six)/80 uppercase font-display text-center">
            {battingTeam?.teamNameSnapshot}
          </h3>
          <div className="flex items-baseline font-display">
            <span className="text-[3.5rem] font-black leading-none tracking-tight">
              {displayState?.score ?? "0/0"}
            </span>
            <span className="text-[#4DFFDE] text-2xl font-bold ml-2">
              ({displayState?.oversText ?? "0.0"})
            </span>
          </div>

          <p className="mt-2 text-[10px] font-bold text-white/60 uppercase tracking-widest font-display text-center">
            {/* {tossWinner?.teamNameSnapshot} won the toss and elected to{" "}
            {matchData?.match?.toss?.decision} */}
            {displayState?.runRateSummary}
          </p>

          {/* <div className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-md">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-display">
              Match ID: 25578100
            </span>
            <button className="text-white/40 hover:text-white/80 transition-colors">
              <Copy size={12} />
            </button>
          </div> */}
        </div>
      </div>

      {/* 2. FLOATING PLAYER CARD */}
      <div className="px-3 -mt-6 relative z-10 shrink-0">
        <div className="bg-white rounded-xl shadow-[0_8px_24px_rgba(13,27,62,0.12)] overflow-hidden border border-(--color-bg-border)">
          {/* Top Row: Batsmen */}
          <div className="flex border-b border-(--color-bg-border)">
            {/* Striker (Left) */}
            <div className="flex-1 p-2.5 flex items-start gap-3 border-l-[3px] border-l-(--color-live) relative">
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#4DFFDE] rounded-full shadow-[0_0_6px_#4DFFDE]" />

              <div className="w-8 h-8 rounded-full bg-[#4DFFDE]/15 flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4DFFDE"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="rotate-45"
                >
                  <path d="M6 14l-4 4" />
                  <path d="M14 6l-8 8" />
                  <rect width="12" height="18" x="8" y="2" rx="2" />
                </svg>
              </div>
              <div className="min-w-0 pt-0.5">
                <h3 className="font-display font-black text-xs uppercase text-(--color-navy) truncate tracking-wide">
                  {striker?.playerNameSnapshot}
                </h3>
                <button className="mt-0.5 text-[9px] font-bold text-[#4DFFDE] uppercase tracking-widest hover:opacity-80">
                  REPLACE
                </button>
              </div>
            </div>

            {/* Non-Striker (Right) */}
            <div className="flex-1 p-2.5 flex items-start gap-3 border-l border-(--color-bg-border) bg-(--color-bg-card) opacity-70">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                <User size={16} strokeWidth={2.5} />
              </div>
              <div className="min-w-0 pt-0.5">
                <h3 className="font-display font-black text-xs uppercase text-slate-400 truncate tracking-wide">
                  {nonStriker?.playerNameSnapshot}
                </h3>
                <button className="mt-0.5 text-[9px] font-bold text-[#4DFFDE] uppercase tracking-widest hover:opacity-80">
                  REPLACE
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Bowler */}
          <div className="p-2.5 flex items-center justify-between border-l-[3px] border-l-(--color-live) gap-3">
            {/* Left side: Bowler Info & Balls */}
            {/* Add 'flex-1 min-w-0' to constrain the width of this block to the available space */}
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 items-center mb-1.5 justify-between">
                <div className="flex gap-1 items-center">
                  <div className="w-5 h-5 rounded-full bg-(--color-four) flex items-center justify-center shrink-0">
                    <Volleyball />
                  </div>
                  <h3 className="font-display font-black text-xs uppercase text-(--color-navy) tracking-wide truncate">
                    {bowler?.playerNameSnapshot}
                  </h3>
                </div>
                {/* Add 'shrink-0' so this data block never collapses or gets pushed out */}
                <div className="text-right shrink-0">
                  <div className="font-display text-lg font-black text-(--color-navy) leading-none mb-1">
                    {displayState?.currentBowlerFigures?.display || "0-0-0-0"}
                  </div>
                  {/* <div className="text-[8px] font-bold text-(--color-text-muted) uppercase tracking-widest font-display">
                    O-M-R-W
                  </div> */}
                </div>
              </div>

              {/* Recent Balls */}
              <div className="flex gap-1 overflow-x-auto w-full pb-1  scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {displayState?.currentOver?.balls?.map((ball) => (
                  <BallChip key={ball.sequenceNumber} ball={ball} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. KEYPAD GRID (Automatically stretches to fill space) */}
      <div
        className={cn(
          "flex-1 mt-2 flex flex-col bg-white border-t border-(--color-bg-border) min-h-0",
        )}
      >
        {/* Row 1 */}
        <div className="flex flex-1 border-b border-(--color-bg-border)">
          <button
            disabled={isRecording || scoringLocked}
            onClick={() => handleRuns(0)}
            className={cn(
              "flex-1 border-r border-(--color-bg-border) font-display text-3xl font-black text-(--color-navy) active:bg-slate-50 transition-colors",
              scoringLocked &&
                "pointer-events-none blur-[2px] opacity-30 backdrop-brightness-55 bg-black/50",
            )}
          >
            0
          </button>
          <button
            disabled={isRecording || scoringLocked}
            onClick={() => handleRuns(1)}
            className={cn(
              "flex-1 border-r border-(--color-bg-border) font-display text-3xl font-black text-(--color-navy) active:bg-slate-50 transition-colors",
              scoringLocked &&
                "pointer-events-none blur-[2px] opacity-30 backdrop-brightness-55 bg-black/50",
            )}
          >
            1
          </button>
          <button
            disabled={isRecording || scoringLocked}
            onClick={() => handleRuns(2)}
            className={cn(
              "flex-1 border-r border-(--color-bg-border) font-display text-3xl font-black text-(--color-navy) active:bg-slate-50 transition-colors",
              scoringLocked &&
                "pointer-events-none blur-[2px] opacity-30 backdrop-brightness-55 bg-black/50",
            )}
          >
            2
          </button>
          <button
            onClick={() => setOpenDialog("UNDO")}
            className=" z-30 flex-1 font-display text-sm font-black text-[#38f5cf] bg-[#38f5cf]/5 uppercase tracking-widest active:bg-slate-50 transition-colors"
          >
            UNDO
          </button>
        </div>

        {/* Row 2 */}
        <div
          className={cn(
            "flex flex-[1.3] border-b border-(--color-bg-border)",
            scoringLocked &&
              "pointer-events-none blur-[2px] opacity-30 backdrop-brightness-55 bg-black/50",
          )}
        >
          <button
            disabled={isRecording || scoringLocked}
            onClick={() => handleRuns(3)}
            className="flex-1 border-r border-(--color-bg-border) font-display text-3xl font-black text-(--color-navy) active:bg-slate-50 transition-colors"
          >
            3
          </button>
          <button
            disabled={isRecording || scoringLocked}
            onClick={() => handleRuns(4)}
            className="flex-1 flex flex-col items-center justify-center border-r border-(--color-bg-border) active:bg-(--color-four)/5 transition-colors"
          >
            <span className="font-display text-4xl font-black text-(--color-four)">
              4
            </span>
            <span className="font-display text-[9px] font-black text-(--color-four) uppercase tracking-widest">
              FOUR
            </span>
          </button>
          <button
            disabled={isRecording || scoringLocked}
            onClick={() => handleRuns(6)}
            className="flex-1 flex flex-col items-center justify-center border-r border-(--color-bg-border) active:bg-(--color-six)/5 transition-colors"
          >
            <span className="font-display text-4xl font-black text-(--color-six)">
              6
            </span>
            <span className="font-display text-[9px] font-black text-(--color-six) uppercase tracking-widest">
              SIX
            </span>
          </button>
          <div
            className={cn(
              "flex-1 flex flex-col",
              scoringLocked &&
                "pointer-events-none blur-[2px] opacity-30 backdrop-brightness-55",
            )}
          >
            <button
              disabled={scoringLocked}
              onClick={() => setOpenDialog("RUNNING")}
              className="flex-1 border-b border-(--color-bg-border) bg-[#F8FAFC] font-display text-xl font-black text-(--color-text-body) active:bg-slate-100 transition-colors"
            >
              5, 7
            </button>
            <button
              disabled={scoringLocked}
              onClick={() => setOpenDialog("OUT")}
              className="flex-[1.6] bg-[#FFF5F5] font-display text-sm font-black text-(--color-live) uppercase tracking-widest active:bg-red-100 transition-colors"
            >
              OUT
            </button>
          </div>
        </div>

        {/* Row 3 */}
        <div
          className={cn(
            "flex flex-1",
            scoringLocked &&
              "pointer-events-none blur-[2px] opacity-30 backdrop-brightness-55 bg-black/50",
          )}
        >
          <button
            disabled={scoringLocked}
            onClick={() => setOpenDialog("WIDE")}
            className="flex-1 border-r border-(--color-bg-border) font-display text-xl font-black text-(--color-navy) active:bg-slate-50 transition-colors"
          >
            WD
          </button>
          <button
            disabled={scoringLocked}
            onClick={() => setOpenDialog("NO_BALL")}
            className="flex-1 border-r border-(--color-bg-border) font-display text-xl font-black text-(--color-navy) active:bg-slate-50 transition-colors"
          >
            NB
          </button>
          <button
            disabled={scoringLocked}
            onClick={() => setOpenDialog("BYE")}
            className="flex-1 border-r border-(--color-bg-border) font-display text-xl font-black text-(--color-navy) active:bg-slate-50 transition-colors"
          >
            BYE
          </button>
          <button
            disabled={scoringLocked}
            onClick={() => setOpenDialog("LEG_BYE")}
            className="flex-1 font-display text-xl font-black text-(--color-navy) active:bg-slate-50 transition-colors"
          >
            LB
          </button>
        </div>
      </div>

      {scoringLocked && (
        <div className="absolute inset-0 top-48 z-20 flex items-center justify-center">
          <Button
            onClick={() => {
              //   setIsAwaitingNextOver(false);
              //   setFlowStep("OVER_COMPLETED");
              setFlow("OVER_COMPLETED");
            }}
          >
            Start Next Over
          </Button>
        </div>
      )}

      <div>
        <WideBallSheet
          open={openDialog === "WIDE"}
          onClose={() => setOpenDialog(null)}
          onSelect={handleExtra}
          isRecording={isRecording}
        />
        <NoBallSheet
          open={openDialog === "NO_BALL"}
          onClose={() => setOpenDialog(null)}
          onSelect={handleExtra}
          isRecording={isRecording}
        />
        <ByeSheet
          open={openDialog === "BYE"}
          onClose={() => setOpenDialog(null)}
          onSelect={handleExtra}
          isRecording={isRecording}
        />
        <LegByeSheet
          open={openDialog === "LEG_BYE"}
          onClose={() => setOpenDialog(null)}
          onSelect={handleExtra}
          isRecording={isRecording}
        />
        <RunningSheet
          open={openDialog === "RUNNING"}
          onClose={() => setOpenDialog(null)}
          onSelect={handleRuns}
          isRecording={isRecording}
        />
        <UndoSheet
          open={openDialog === "UNDO"}
          onClose={() => setOpenDialog(null)}
          setOpenDialog={setOpenDialog}
          inningsId={state?.inningsId}
          matchId={matchId}
          onDone={() => {
            setFlow("IDLE");
          }}
        />
        <OutSheet
          open={openDialog === "OUT"}
          onClose={() => setOpenDialog(null)}
          state={state}
          players={matchData?.players}
        />
        <CompletionSheet
          open={flow === "OVER_COMPLETED"}
          mode={"OVER_COMPLETED"}
          onClose={() => {}}
          onContinue={() => {
            setFlow("SELECT_NEXT_BOWLER");
          }}
          onContinueThisOver={() => {
            setFlow("AWAITING_NEXT_OVER");
          }}
          players={matchData?.players}
          matchId={matchId}
          inningsId={state?.inningsId}
          state={state}
        />
        <CompletionSheet
          open={flow === "START_NEXT_INNINGS"}
          mode={"INNINGS_COMPLETED"}
          onClose={() => {
            resetFlow();
          }}
          onContinue={() => {
            setFlow("IDLE");
            router.push(`/start-match/start-innings`);
          }}
          onContinueThisOver={() => {
            setFlow("AWAITING_NEXT_OVER");
          }}
          players={matchData?.players}
          matchId={matchId}
          inningsId={state?.inningsId}
          state={state}
        />
        <CompletionSheet
          open={flow === "MATCH_COMPLETED"}
          mode={"MATCH_COMPLETED"}
          onClose={() => {
            resetFlow();
          }}
          onContinue={() => {
            router.push(`/matches/${matchId}/scorecard`);
          }}
          onContinueThisOver={() => {
            setFlow("AWAITING_NEXT_OVER");
          }}
          players={matchData?.players}
          teams={matchData?.teams}
          matchId={matchId}
          inningsId={state?.inningsId}
          state={state}
        />

        <NextBowlerSheet
          open={flow === "SELECT_NEXT_BOWLER"}
          onClose={resetFlow}
          players={matchData?.players}
          oversText={state?.oversText}
          matchId={matchId}
          inningsId={state?.inningsId}
          bowlingTeamId={state?.bowlingTeamId}
          currentBowlerId={state?.currentBowlerId}
        />

        <NextBatterSheet
          open={flow === "SELECT_NEXT_BATTER"}
          onClose={resetFlow}
          players={matchData?.players}
          state={state}
        />
      </div>

      {/* 4. BOTTOM ACTION SHEET TRIGGER */}
      <button className="h-6 shrink-0 bg-(--color-navy) flex items-center justify-center gap-2 w-full active:bg-[#0a1532] transition-colors safe-bottom pt-0">
        <span className="font-display text-xs font-bold text-white uppercase tracking-widest">
          Scoring Shortcuts
        </span>
        <ChevronUp size={16} className="text-white/80" />
      </button>
    </div>
  );
}
