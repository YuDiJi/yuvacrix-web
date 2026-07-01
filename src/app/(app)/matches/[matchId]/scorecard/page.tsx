"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetScorecardQuery } from "@/store/api/scorecardApi";
import ScorecardInningsAccordion from "./scorecardComp/Scorecardinningsaccordion";
import CommentaryTab from "./commentary/CommentaryTab";
import SquadTab from "./squad/Squadtab";
import MvpTab from "./mvp/MvpTab";
import SummaryTab from "./summary/SummaryTab";
import InfoTab from "./Infotab";

const TABS = [
  "Info",
  "Summary",
  "Scorecard",
  "Squad",
  "MVP",
  "Insights",
  "Comms",
] as const;
type Tab = (typeof TABS)[number];

// ── Skeleton ──────────────────────────────────────────────────────────
function ScorecardSkeleton() {
  return (
    <div className="space-y-3 px-3 py-4 animate-pulse">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-(--color-navy) px-4 py-3">
            <div className="h-4 w-36 rounded bg-white/20" />
            <div className="h-5 w-20 rounded bg-white/20" />
          </div>
          {/* Rows */}
          <div className="divide-y divide-(--color-bg-border)">
            {[1, 2, 3, 4, 5].map((r) => (
              <div key={r} className="flex items-center gap-3 px-3 py-3">
                <div className="h-3 flex-1 rounded bg-(--color-bg-border)" />
                <div className="h-3 w-6 rounded bg-(--color-bg-border)" />
                <div className="h-3 w-6 rounded bg-(--color-bg-border)" />
                <div className="h-3 w-6 rounded bg-(--color-bg-border)" />
                <div className="h-3 w-6 rounded bg-(--color-bg-border)" />
                <div className="h-3 w-10 rounded bg-(--color-bg-border)" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function ScorecardPage() {
  const params = useParams<{ matchId: string }>();
  const matchId = params?.matchId ?? "";

  const [activeTab, setActiveTab] = useState<Tab>("Scorecard");

  const {
    data: scorecard,
    isLoading,
    isError,
  } = useGetScorecardQuery(
    {
      matchId,
      includeSquads: false,
      includeMvp: false,
    },
    {
      skip:
        !matchId ||
        (activeTab !== "Scorecard" &&
          activeTab !== "Squad" &&
          activeTab !== "Summary" &&
          activeTab !== "Info"),
    },
  );

  // const { data, isLoading, isError } = useGetScorecardQuery(matchId, {
  //   skip: !matchId || activeTab !== "Scorecard",
  // });

  const match = scorecard?.match;

  return (
    <div className="min-h-dvh bg-(--color-bg-base)">
      {/* ── Match title header ──────────────────────────── */}
      {match && (
        <div className="safe-top sticky top-0 z-20 bg-(--color-navy) px-4 pb-3">
          {/* <p className="font-display text-[11px] font-bold uppercase tracking-widest text-(--color-sky)">
            {match.tournamentName ?? "League Matches"}
          </p> */}
          <h1 className="font-display text-[17px] font-black uppercase tracking-wide leading-tight text-(--color-text-inverse) pt-3">
            {match.teamA?.teamNameSnapshot ?? "Team A"} vs{" "}
            {match.teamB?.teamNameSnapshot ?? "Team B"}
          </h1>
          {match.venue && (
            <p className="mt-0.5 text-[11px] text-(--color-sky)">
              {match.venue.groundName}, {match.venue.city}
            </p>
          )}
        </div>
      )}

      {/* ── Tab bar ─────────────────────────────────────── */}
      <div className="sticky top-13 z-10 border-b border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
        <div className="flex overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative shrink-0 whitespace-nowrap px-4 py-3 font-body text-[13px] font-semibold transition-colors ${
                  active
                    ? "text-(--color-brand)"
                    : "text-(--color-text-secondary) hover:text-(--color-text-body)"
                }`}
              >
                {tab}
                {/* Active underline */}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-(--color-brand)" />
                )}
                {/* Insights dot */}
                {tab === "Insights" && (
                  <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-(--color-live) align-middle" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      {activeTab === "Info" && (
        <InfoTab matchId={matchId} initialScorecard={scorecard} />
      )}

      {activeTab === "Scorecard" && (
        <div className="px-3 py-3">
          {isLoading && <ScorecardSkeleton />}

          {isError && (
            <div className="mt-12 flex flex-col items-center gap-2 px-6 text-center">
              <p className="font-display text-[15px] font-bold uppercase text-(--color-navy)">
                Unable to load scorecard
              </p>
              <p className="text-meta">Check your connection and try again.</p>
            </div>
          )}

          {!isLoading && !isError && scorecard && (
            <>
              {!scorecard.innings || scorecard.innings.length === 0 ? (
                <div className="mt-12 flex flex-col items-center gap-2 px-6 text-center">
                  <p className="font-display text-[15px] font-bold uppercase text-(--color-navy)">
                    Scorecard not started yet
                  </p>
                  <p className="text-meta">Check back once the match begins.</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {scorecard.innings.map((inn, idx) => (
                    <ScorecardInningsAccordion
                      key={inn.inningsId ?? idx}
                      innings={inn}
                      defaultExpanded={idx === scorecard.innings.length - 1}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "Summary" && matchId && (
        <SummaryTab matchId={matchId} initialScorecard={scorecard} />
      )}

      {activeTab === "Squad" && matchId && (
        <SquadTab matchId={matchId} initialSquads={scorecard?.squads} />
      )}

      {activeTab === "MVP" && matchId && <MvpTab matchId={matchId} />}

      {activeTab === "Comms" && matchId && <CommentaryTab matchId={matchId} />}

      {activeTab !== "Scorecard" &&
        activeTab !== "Info" &&
        activeTab !== "Summary" &&
        activeTab !== "Squad" &&
        activeTab !== "MVP" &&
        activeTab !== "Comms" && (
          <div className="mt-12 flex flex-col items-center gap-2 px-6 text-center">
            <p className="text-body text-(--color-text-secondary)">
              {activeTab} coming soon.
            </p>
          </div>
        )}
    </div>
  );
}
