import { Settings } from "lucide-react";
import { DialogBox } from "@/components/common/DialogBox";
import { cn } from "@/lib/cn";
import { LastCompletedOver } from "@/types/innings";
import { Button } from "@/components/common/Button";
import { BallChip } from "./BallChip";
import { MatchDetailsPlayer } from "@/types/match";
import { useMemo } from "react";
import { useContinueCurrentOverMutation } from "@/store/api/scoringApi";

type CompletionSheetMode = "OVER_COMPLETED" | "INNINGS_COMPLETED";

interface Props {
  mode: CompletionSheetMode;
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  lastCompletedOver: LastCompletedOver | undefined | null;
  totalRuns?: number;
  wickets?: number;
  oversText?: string;
  extras?: number;
  players: MatchDetailsPlayer[] | undefined;
  matchId: string | null;
  inningsId: string | undefined;

  onContinueThisOver: () => void;
}

export function CompletionSheet({
  mode,
  open,
  onClose,
  onContinue,
  lastCompletedOver,
  totalRuns,
  wickets,
  oversText,
  extras,
  onContinueThisOver,
  players,
  matchId,
  inningsId,
}: Props) {
  const [continueCurrentOver, { isLoading: isContinuingCurrentOver }] =
    useContinueCurrentOverMutation();

  const handleContinueCurrentOver = async () => {
    if (!matchId || !inningsId) return;

    try {
      // await continueCurrentOver({
      //   matchId,
      //   inningsId,
      //   reason: "Continue this over",
      // }).unwrap();

      onContinueThisOver();
    } catch (error) {
      console.error(error);
    }
  };

  const playersById = useMemo(() => {
    return new Map((players ?? []).map((player) => [player.playerId, player]));
  }, [players]);

  const bowlerName = lastCompletedOver?.bowlerId
    ? playersById.get(lastCompletedOver.bowlerId)?.playerNameSnapshot
    : undefined;

  return (
    <DialogBox open={open} onClose={onClose} className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-[#d33a41]">
          {mode === "OVER_COMPLETED" ? "Over complete" : "Innings complete"}
        </h2>
        <button
          onClick={onClose}
          className="text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Settings size={22} strokeWidth={1.5} />
        </button>
      </div>

      {/* Stats Box */}
      <div className="border border-slate-100 rounded-xl overflow-hidden mb-5">
        <div className="flex bg-[#f7f8fa] divide-x divide-white">
          <div className="flex-1 py-3 flex flex-col items-center">
            <span className="text-2xl font-bold text-slate-800">
              {totalRuns}
            </span>
            <span className="text-[10px] text-slate-600 font-medium">Runs</span>
          </div>
          <div className="flex-1 py-3 flex flex-col items-center">
            <span className="text-2xl font-bold text-slate-800">
              {oversText}
            </span>
            <span className="text-[10px] text-slate-600 font-medium">
              Overs
            </span>
          </div>
          <div className="flex-1 py-3 flex flex-col items-center">
            <span className="text-2xl font-bold text-slate-800">{wickets}</span>
            <span className="text-[10px] text-slate-600 font-medium">
              Wickets
            </span>
          </div>
          <div className="flex-1 py-3 flex flex-col items-center">
            <span className="text-2xl font-bold text-slate-800">{extras}</span>
            <span className="text-[10px] text-slate-600 font-medium">
              Extras
            </span>
          </div>
        </div>
      </div>

      {mode === "OVER_COMPLETED" && (
        <>
          {/* Bowler Info */}
          <p className="text-sm text-slate-700 mb-3">
            End of over {lastCompletedOver?.overNumber} by {bowlerName ?? ""}
          </p>

          {/* Ball-by-ball summary for the over */}
          <div className="flex items-center justify-between mb-6 gap-3">
            <div className="flex items-start gap-1.5 overflow-x-auto scrollbar-none">
              {/* {lastCompletedOver?.display?.split(" ").map((ball, i) => ( */}
              {lastCompletedOver?.balls?.map((ball) => (
                <BallChip key={ball.sequenceNumber} ball={ball} />
              ))}
            </div>

            <div className="shrink-0 text-sm font-semibold text-slate-800">
              = {lastCompletedOver?.totalRuns ?? 0}
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            onContinue();
            onClose();
          }}
          size="sm"
        >
          {mode === "INNINGS_COMPLETED" && "Start next innings"}
          {mode === "OVER_COMPLETED" && "Start next over"}
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
