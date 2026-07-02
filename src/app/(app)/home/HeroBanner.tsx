"use client";

import { Zap, Users, Trophy, Radio } from "lucide-react";

const STATS = [
  { icon: Radio, value: "12", label: "Live Matches", color: "text-[#FF2D2D]" },
  { icon: Users, value: "34", label: "Teams", color: "text-white" },
  { icon: Trophy, value: "4", label: "Active Tournaments", color: "text-[#F59E0B]" },
];

const STRIP = [
  { icon: Radio, text: "12 matches live now", color: "text-[#FF2D2D]" },
  { icon: Trophy, text: "YuvaCrix Premier League  ·  ongoing", color: "text-[#F59E0B]" },
  { icon: Zap, text: "127 matches scored today", color: "text-[#4B8BFF]" },
];

export default function HeroBanner() {
  return (
    <div className="mx-3 overflow-hidden rounded-2xl bg-[#0D1B3E] shadow-[0_8px_32px_rgba(13,27,62,0.35)]">
      {/* Main hero area */}
      <div
        className="relative px-4 pt-5 pb-4"
        style={{
          background:
            "linear-gradient(135deg, #0D1B3E 0%, #1B3FA0 60%, #0D1B3E 100%)",
        }}
      >
        {/* Diagonal texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, white, white 1px, transparent 1px, transparent 32px)",
          }}
        />

        {/* Cricket ball accent */}
        <div
          aria-hidden
          className="absolute right-4 top-1/2 -translate-y-1/2 h-28 w-28 rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, #FF2D2D, #990000)",
          }}
        />

        {/* Batsman silhouette placeholder */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 flex items-end justify-end pr-2 pb-4 opacity-20"
        >
          <span className="text-[72px] leading-none select-none">🏏</span>
        </div>

        <div className="relative">
          {/* Title */}
          <h1 className="font-display text-[20px] font-black uppercase leading-tight tracking-wide text-white">
            YUVACRIX
            <br />
            LIVE CRICKET
          </h1>
          <p className="mt-1 text-[11px] font-semibold text-white/60 tracking-widest">
            CREATE • PLAY • SCORE • COMPETE
          </p>

          {/* Stats row */}
          <div className="mt-4 flex items-center gap-5">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-1.5">
                  <Icon size={14} className={s.color} />
                  <div>
                    <span className="font-display text-[18px] font-black leading-none text-white">
                      {s.value}
                    </span>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50">
                      {s.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom mini strip */}
      <div className="flex items-stretch divide-x divide-white/10 bg-white/5 backdrop-blur-sm">
        {STRIP.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex flex-1 items-center gap-1.5 px-2 py-2.5 min-w-0"
            >
              <Icon size={11} className={`flex-shrink-0 ${item.color}`} />
              <p className="text-[9.5px] font-semibold leading-tight text-white/70 truncate">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
