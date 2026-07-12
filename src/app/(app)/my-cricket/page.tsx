"use client";

import { cn } from "@/lib/cn";
import Matches from "./Matches";
import { useState } from "react";
import Tournaments from "./Tournaments";

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Skeleton card ────────────────────────────────────────────────────────────

const NAV_TABS = [
  "Matches",
  "Tournaments",
  "Teams",
  "Stats",
  "Highlights",
] as const;

type NavTab = (typeof NAV_TABS)[number];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState<NavTab>("Matches");

  return (
    <div className="flex flex-col bg-(--color-bg-base)">
      {/* ── Nav tabs ─────────────────────────────────────────────────────── */}
      <div className="flex overflow-x-auto bg-(--color-brand) scrollbar-none">
        {NAV_TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "shrink-0 px-5 py-3.5 font-(family-name:--font-display) font-black uppercase text-[13px] tracking-[0.06em] transition-all relative",
                isActive ? "text-white" : "text-white/45 hover:text-white/70",
              )}
            >
              {tab}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>
      {activeTab === "Matches" && <Matches />}
      {activeTab === "Tournaments" && <Tournaments />}
    </div>
  );
}
