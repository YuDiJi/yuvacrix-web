"use client";

import { useEffect } from "react";
import { Copy, ChevronUp, User } from "lucide-react";
import { useHeader } from "@/providers/HeaderProvider";

export default function ScoringPage() {
  const { setHeader } = useHeader();

  useEffect(() => {
    // Rely on your global AppShell header instead of the custom one
    setHeader({
      title: "BLACK PANTHER",
      showBackButton: true,
      showNotifications: false,
    });
  }, [setHeader]);

  return (
    // 'absolute inset-x-0 bottom-0 top-14' strictly forces the layout to fit
    // exactly within the screen under the global header, preventing any scrolling.
    <div className="absolute inset-x-0 bottom-0 top-14 flex flex-col bg-(--color-bg-base) overflow-hidden z-10">
      {/* 1. HERO SECTION (Navy Background) */}
      <div className="bg-(--color-navy) text-white pb-10 rounded-b-sm shrink-0">
        <div className="flex flex-col items-center pt-6 px-4">
          <div className="flex items-baseline font-display">
            <span className="text-[3.5rem] font-black leading-none tracking-tight">
              0/0
            </span>
            <span className="text-[#4DFFDE] text-2xl font-bold ml-2">
              (0/20)
            </span>
          </div>

          <p className="mt-2 text-[10px] font-bold text-white/60 uppercase tracking-widest font-display text-center">
            Black panther won the toss and elected to field
          </p>

          <div className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-md">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-display">
              Match ID: 25578100
            </span>
            <button className="text-white/40 hover:text-white/80 transition-colors">
              <Copy size={12} />
            </button>
          </div>
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
                  DIMPAL PARIYAR
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
                  YUVAAN
                </h3>
                <button className="mt-0.5 text-[9px] font-bold text-[#4DFFDE] uppercase tracking-widest hover:opacity-80">
                  REPLACE
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Bowler */}
          <div className="p-2.5 flex items-center justify-between border-l-[3px] border-l-(--color-live)">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-(--color-navy) flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 3.5a9.99 9.99 0 0 0 0 17" />
                  <path d="M16 3.5a9.99 9.99 0 0 1 0 17" />
                </svg>
              </div>
              <div>
                <h3 className="font-display font-black text-xs uppercase text-(--color-navy) tracking-wide mb-1">
                  DIMPAL PARIYAR
                </h3>
                {/* Recent Balls */}
                <div className="flex gap-1">
                  <span className="w-4 h-4 rounded-full bg-(--color-six) flex items-center justify-center text-white text-[9px] font-black shadow-sm">
                    6
                  </span>
                  <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-(--color-text-secondary) text-[9px] font-black shadow-sm">
                    2
                  </span>
                  <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-(--color-text-secondary) text-[9px] font-black shadow-sm">
                    1
                  </span>
                  <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-(--color-text-secondary) text-[9px] font-black shadow-sm">
                    5
                  </span>
                </div>
              </div>
            </div>

            {/* Bowler Stats */}
            <div className="text-right">
              <div className="font-display text-lg font-black text-(--color-navy) leading-none mb-1">
                0-0-0-0
              </div>
              <div className="text-[8px] font-bold text-(--color-text-muted) uppercase tracking-widest font-display">
                O-M-R-W
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. KEYPAD GRID (Automatically stretches to fill space) */}
      <div className="flex-1 mt-2 flex flex-col bg-white border-t border-(--color-bg-border) min-h-0">
        {/* Row 1 */}
        <div className="flex flex-1 border-b border-(--color-bg-border)">
          <button className="flex-1 border-r border-(--color-bg-border) font-display text-3xl font-black text-(--color-navy) active:bg-slate-50 transition-colors">
            0
          </button>
          <button className="flex-1 border-r border-(--color-bg-border) font-display text-3xl font-black text-(--color-navy) active:bg-slate-50 transition-colors">
            1
          </button>
          <button className="flex-1 border-r border-(--color-bg-border) font-display text-3xl font-black text-(--color-navy) active:bg-slate-50 transition-colors">
            2
          </button>
          <button className="flex-1 font-display text-xs font-black text-[#4DFFDE] uppercase tracking-widest active:bg-slate-50 transition-colors">
            UNDO
          </button>
        </div>

        {/* Row 2 */}
        <div className="flex flex-[1.3] border-b border-(--color-bg-border)">
          <button className="flex-1 border-r border-(--color-bg-border) font-display text-3xl font-black text-(--color-navy) active:bg-slate-50 transition-colors">
            3
          </button>
          <button className="flex-1 flex flex-col items-center justify-center border-r border-(--color-bg-border) active:bg-(--color-four)/5 transition-colors">
            <span className="font-display text-4xl font-black text-(--color-four)">
              4
            </span>
            <span className="font-display text-[9px] font-black text-(--color-four) uppercase tracking-widest">
              FOUR
            </span>
          </button>
          <button className="flex-1 flex flex-col items-center justify-center border-r border-(--color-bg-border) active:bg-(--color-six)/5 transition-colors">
            <span className="font-display text-4xl font-black text-(--color-six)">
              6
            </span>
            <span className="font-display text-[9px] font-black text-(--color-six) uppercase tracking-widest">
              SIX
            </span>
          </button>
          <div className="flex-1 flex flex-col">
            <button className="flex-1 border-b border-(--color-bg-border) bg-[#F8FAFC] font-display text-xl font-black text-(--color-text-body) active:bg-slate-100 transition-colors">
              5, 7
            </button>
            <button className="flex-[1.6] bg-[#FFF5F5] font-display text-sm font-black text-(--color-live) uppercase tracking-widest active:bg-red-100 transition-colors">
              OUT
            </button>
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex flex-1">
          <button className="flex-1 border-r border-(--color-bg-border) font-display text-xl font-black text-(--color-navy) active:bg-slate-50 transition-colors">
            WD
          </button>
          <button className="flex-1 border-r border-(--color-bg-border) font-display text-xl font-black text-(--color-navy) active:bg-slate-50 transition-colors">
            NB
          </button>
          <button className="flex-1 border-r border-(--color-bg-border) font-display text-xl font-black text-(--color-navy) active:bg-slate-50 transition-colors">
            BYE
          </button>
          <button className="flex-1 font-display text-xl font-black text-(--color-navy) active:bg-slate-50 transition-colors">
            LB
          </button>
        </div>
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
