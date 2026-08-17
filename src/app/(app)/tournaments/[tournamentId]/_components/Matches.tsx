import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import TournamentMatchList from "./TournamentMatchList";
import { ScheduleMethodDialog } from "./ScheduleMethodDialog";
import { useDispatch } from "react-redux";
import {
  resetMatch,
  setMatchCreationMode,
} from "@/store/startMatch/startMatchSlice";

const Matches = ({ isAdmin }: { isAdmin: boolean }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.tournamentId as string;
  const [scheduleMethodOpen, setScheduleMethodOpen] = useState(false);

  console.log(isAdmin);
  return (
    <div className="flex flex-col h-full">
      <div className="pb-20">
        <TournamentMatchList />
      </div>

      {/* 3. Bottom Action Buttons (Flush edge-to-edge like the image) */}
      {isAdmin && (
        <div className="mt-auto mx-auto w-full md:max-w-107.5 fixed bottom-0 left-0 right-0 z-40 flex border-t border-(--color-bg-border) bg-(--color-bg-card) safe-bottom">
          <button
            // onClick={() => {
            //   dispatch(resetMatch());
            //   dispatch(setMatchCreationMode("SCHEDULE"));
            //   router.push(`/tournaments/${tournamentId}/start-match`);
            // }}
            onClick={() => setScheduleMethodOpen(true)}
            className="flex-1 py-4 text-sm font-display font-bold uppercase tracking-wide text-(--color-brand) transition-colors hover:bg-slate-50 active:bg-(--color-bg-base)"
          >
            Schedule matches
          </button>
          <button
            onClick={() => {
              dispatch(resetMatch());
              dispatch(setMatchCreationMode("PLAY_NOW"));
              router.push(`/tournaments/${tournamentId}/start-match`);
            }}
            className="flex-1 py-4 text-sm font-display font-bold uppercase tracking-wide text-white bg-(--color-brand) transition-colors hover:bg-blue-800 active:bg-[#15348c]"
          >
            Start a match
          </button>
        </div>
      )}

      <ScheduleMethodDialog
        open={scheduleMethodOpen}
        onClose={() => setScheduleMethodOpen(false)}
        onManualSelect={() => {
          dispatch(resetMatch());
          dispatch(setMatchCreationMode("SCHEDULE"));
          router.push(`/tournaments/${tournamentId}/start-match`);
          setScheduleMethodOpen(false);
        }}
        onAutoSelect={() => {
          router.push(`/tournaments/${tournamentId}/fixtures/auto-generate`);
          setScheduleMethodOpen(false);
        }}
      />
    </div>
  );
};

export default Matches;
