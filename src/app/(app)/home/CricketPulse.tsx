"use client";

import { Zap, ArrowRight } from "lucide-react";
import { CRICKET_PULSE } from "./mockData";

export default function CricketPulse() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="font-display text-[13px] font-black uppercase tracking-widest text-[#0D1B3E]">
          Cricket Pulse
        </h2>
        <button className="flex items-center gap-0.5 text-[11px] font-bold text-[#2F5BFF]">
          See All <span className="text-[13px]">›</span>
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {CRICKET_PULSE.map((item) => (
          <div
            key={item.id}
            className="flex w-[160px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E8ECF2] bg-white shadow-[0_2px_8px_rgba(13,27,62,0.08)]"
          >
            {/* Coloured banner top */}
            <div
              className={`relative flex h-[80px] items-center justify-center bg-gradient-to-br ${item.bgGradient}`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(115deg, white, white 1px, transparent 1px, transparent 20px)",
                }}
              />
              <span className="relative text-[40px] leading-none">{item.emoji}</span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between px-3 py-2.5">
              <div>
                <p className="text-[9px] font-semibold text-[#9CA3AF]">
                  {item.timeAgo}
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-[#0D1B3E] leading-snug line-clamp-3">
                  {item.headline}
                </p>
              </div>

              {/* CTA chip */}
              <button className="mt-2.5 flex items-center gap-1 self-start rounded-full bg-[#F0F3FF] px-2.5 py-1">
                <span className="text-[10px] font-bold text-[#2F5BFF]">
                  {item.cta}
                </span>
                {item.ctaIcon === "zap" ? (
                  <Zap size={10} className="text-[#2F5BFF]" />
                ) : (
                  <ArrowRight size={10} className="text-[#2F5BFF]" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
