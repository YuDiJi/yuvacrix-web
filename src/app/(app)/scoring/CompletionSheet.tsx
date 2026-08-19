import { Settings, Trophy } from "lucide-react";
import { DialogBox } from "@/components/common/DialogBox";
import { ScoringState } from "@/types/cricket/innings";
import { Button } from "@/components/common/Button";
import { BallChip } from "./BallChip";
import { MatchDetailsPlayer, MatchDetailsTeam } from "@/types/cricket/match";
import { useMemo } from "react";

import { useCompleteMatchMutation } from "@/store/api/cricket/matchApi";

type CompletionSheetMode =
  | "OVER_COMPLETED"
  | "INNINGS_COMPLETED"
  | "MATCH_COMPLETED";

interface Props {
  mode: CompletionSheetMode;
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  players: MatchDetailsPlayer[] | undefined;
  teams?: MatchDetailsTeam[] | undefined;
  matchId: string | null;
  inningsId: string | undefined;
  state: ScoringState | undefined;

  onContinueThisOver: () => void;
}

export function CompletionSheet({
  mode,
  open,
  onClose,
  onContinue,
  onContinueThisOver,
  players,
  teams,
  matchId,
  inningsId,
  state,
}: Props) {
  const [completeMatch, { isLoading: isMatchComplete }] =
    useCompleteMatchMutation();

  const handleContinueCurrentOver = async () => {
    if (!matchId || !inningsId) return;

    try {
      onContinueThisOver();
    } catch (error) {
      console.error(error);
    }
  };

  const handleNext = async () => {
    if (!matchId || !state) return;
    onClose();
    onContinue();
  };

  const playersById = useMemo(() => {
    return new Map((players ?? []).map((player) => [player.playerId, player]));
  }, [players]);

  const bowlerName = state?.lastCompletedOver?.bowlerId
    ? playersById.get(state?.lastCompletedOver.bowlerId)?.playerNameSnapshot
    : undefined;

  return (
    <DialogBox open={open} onClose={() => {}} className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-(--color-brand) font-semibold">
          {mode === "OVER_COMPLETED"
            ? "Over complete"
            : mode === "INNINGS_COMPLETED"
              ? "Innings complete"
              : mode === "MATCH_COMPLETED"
                ? "Match result"
                : ""}
        </h2>
        {/* <button
          onClick={onClose}
          className="text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Settings size={22} strokeWidth={1.5} />
        </button> */}
      </div>

      {/* Stats Box */}
      {(mode === "INNINGS_COMPLETED" || mode === "OVER_COMPLETED") && (
        <div className="border border-slate-100 rounded-xl overflow-hidden mb-5">
          <div className="flex bg-[#f7f8fa] divide-x divide-white">
            <div className="flex-1 py-3 flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-800">
                {state?.totalRuns}
              </span>
              <span className="text-[10px] text-slate-600 font-medium">
                Runs
              </span>
            </div>
            <div className="flex-1 py-3 flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-800">
                {state?.oversText}
              </span>
              <span className="text-[10px] text-slate-600 font-medium">
                Overs
              </span>
            </div>
            <div className="flex-1 py-3 flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-800">
                {state?.wickets}
              </span>
              <span className="text-[10px] text-slate-600 font-medium">
                Wickets
              </span>
            </div>
            <div className="flex-1 py-3 flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-800">
                {state?.extras?.total}
              </span>
              <span className="text-[10px] text-slate-600 font-medium">
                Extras
              </span>
            </div>
          </div>
        </div>
      )}

      {mode === "OVER_COMPLETED" && (
        <>
          {/* Bowler Info */}
          <p className="text-sm text-slate-700 mb-3">
            End of over {state?.lastCompletedOver?.overNumber} by{" "}
            {bowlerName ?? ""}
          </p>

          {/* Ball-by-ball summary for the over */}
          <div className="flex items-center justify-between mb-6 gap-3">
            <div className="flex items-start gap-1.5 overflow-x-auto scrollbar-none">
              {/* {lastCompletedOver?.display?.split(" ").map((ball, i) => ( */}
              {state?.lastCompletedOver?.balls?.map((ball) => (
                <BallChip key={ball.sequenceNumber} ball={ball} />
              ))}
            </div>

            <div className="shrink-0 text-sm font-semibold text-slate-800">
              = {state?.lastCompletedOver?.totalRuns ?? 0}
            </div>
          </div>
        </>
      )}

      {mode === "MATCH_COMPLETED" && (
        <div className="flex flex-col mb-6">
          {/* Result Banner - Negative margin to stretch full width of the padded dialog */}
          <div className="flex items-center gap-3 bg-(--color-bg-tint) px-5 py-3.5 -mx-5 mb-6">
            <Trophy className="text-(--color-brand) shrink-0" size={22} />
            <span className="font-display text-lg font-black text-(--color-navy) tracking-wide">
              {state?.matchResult?.summaryText ?? "MATCH RESULT SUMMARY"}
            </span>
          </div>

          {/* Stats Table */}
          <div className="rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="flex items-center border-b border-(--color-bg-border) px-4 py-2 bg-(--color-bg-base)/50">
              <span className="text-section-label flex-1 text-(--color-text-secondary)">
                NAME
              </span>
              <div className="flex shrink-0 items-center gap-6 sm:gap-8">
                <span className="text-section-label w-6 text-center text-(--color-text-secondary)">
                  R
                </span>
                <span className="text-section-label w-6 text-center text-(--color-text-secondary)">
                  W
                </span>
                <span className="text-section-label w-6 text-center text-(--color-text-secondary)">
                  O
                </span>
              </div>
            </div>

            {/* 
              Table Rows 
              Maps through your actual state.innings. 
              (Included a fallback to demonstrate the exact UI from your image if state is empty)
            */}
            {state?.matchResult &&
              state.matchResult.scoreRows.map((score, index) => (
                <div
                  key={index}
                  className="flex items-center px-4 py-3 border-b border-(--color-bg-border) last:border-0"
                >
                  <span className="text-body font-medium text-(--color-text-body) flex-1 truncate pr-2">
                    {score.teamName}
                  </span>
                  <div className="flex shrink-0 items-center gap-6 sm:gap-8">
                    <span className="text-body font-medium text-(--color-text-secondary) w-6 text-center">
                      {score.runs}
                    </span>
                    <span className="text-body font-medium text-(--color-text-secondary) w-6 text-center">
                      {score.wickets}
                    </span>
                    <span className="text-body font-medium text-(--color-text-secondary) w-6 text-center">
                      {score.overs}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            handleNext();
          }}
          size="sm"
        >
          {mode === "INNINGS_COMPLETED" && "Start next innings"}
          {mode === "OVER_COMPLETED" && "Start next over"}
          {mode === "MATCH_COMPLETED" && "End Match"}
        </Button>
        <Button
          onClick={handleContinueCurrentOver}
          size="sm"
          variant="secondary"
        >
          Continue this over
        </Button>
      </div>
    </DialogBox>
  );
}
