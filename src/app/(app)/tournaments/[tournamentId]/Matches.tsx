import { Button } from "@/components/common/Button";
import { cn } from "@/lib/cn";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import TournamentMatchList from "./TournamentMatchList";

const TABS = ["Live", "Upcoming", "Past"] as const;
type Tab = (typeof TABS)[number];
const Matches = () => {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.tournamentId as string;
  const [activeTab, setActiveTab] = useState<Tab>("Past");
  return (
    <div className="flex flex-col h-full ">
      {/* <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 rounded-full px-5 py-1 text-sm font-(family-name:--font-display) font-bold uppercase tracking-[0.04em] transition-all duration-150 active:scale-95",
              activeTab === tab
                ? "bg-(--color-brand) text-white shadow-[0_2px_8px_rgba(27,63,160,0.3)]"
                : "bg-(--color-bg-card) text-(--color-text-secondary) border border-(--color-bg-border) hover:border-(--color-brand)/30",
            )}
          >
            {tab}
          </button>
        ))}
      </div> */}

      {/* 2. Content Area */}
      {/* <div className="flex-1 p-4 overflow-y-auto">
        <p className="py-20 text-center text-sm">
          You can create a schedule in advance or start scoring matches directly
          from here
        </p>
      </div> */}

      <TournamentMatchList />

      {/* 3. Bottom Action Buttons (Flush edge-to-edge like the image) */}
      <div className="mt-auto sticky bottom-0 flex w-full border-t border-(--color-bg-border) bg-(--color-bg-card) safe-bottom">
        <button className="flex-1 py-4 text-sm font-display font-bold uppercase tracking-wide text-(--color-brand) transition-colors hover:bg-slate-50 active:bg-(--color-bg-base)">
          Schedule matches
        </button>
        <button
          onClick={() =>
            router.push(`/tournaments/${tournamentId}/start-match`)
          }
          className="flex-1 py-4 text-sm font-display font-bold uppercase tracking-wide text-white bg-(--color-brand) transition-colors hover:bg-blue-800 active:bg-[#15348c]"
        >
          Start a match
        </button>
      </div>
    </div>
  );
};

export default Matches;
