"use client";

import { MapPin, Eye } from "lucide-react";
import { LIVE_MATCHES, type LiveMatch } from "./mockData";

function TeamBadge({
  team,
}: {
  team: LiveMatch["teamA"];
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Logo placeholder */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full text-[22px] shadow-sm"
        style={{ background: team.color + "22", border: `2px solid ${team.color}44` }}
      >
        <span>{team.emoji}</span>
      </div>
      <p className="text-center text-[9px] font-black uppercase tracking-wide text-[#0D1B3E] leading-tight max-w-[56px]">
        {team.name}
      </p>
    </div>
  );
}

function MatchCard({ match }: { match: LiveMatch }) {
  return (
    <div className="flex w-[220px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E8ECF2] bg-white shadow-[0_2px_8px_rgba(13,27,62,0.08)]">
      {/* Top strip */}
      <div className="flex items-center justify-between border-b border-[#E8ECF2] px-3 py-2">
        <span className="flex items-center gap-1 rounded-md bg-[#FF2D2D] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          LIVE
        </span>
        <span className="rounded-md bg-[#F0F3FF] px-2 py-0.5 text-[9px] font-bold text-[#2F5BFF]">
          {match.format}
        </span>
      </div>

      {/* Teams + scores */}
      <div className="flex items-center justify-between px-3 py-3">
        {/* Team A */}
        <div className="flex flex-col items-center gap-1">
          <TeamBadge team={match.teamA} />
          <p className="font-display text-[17px] font-black leading-none text-[#0D1B3E]">
            {match.scoreA}
          </p>
          <p className="text-[9px] text-[#9CA3AF]">{match.oversA}</p>
        </div>

        {/* VS */}
        <span className="mx-1 font-display text-[11px] font-black text-[#9CA3AF]">VS</span>

        {/* Team B */}
        <div className="flex flex-col items-center gap-1">
          <TeamBadge team={match.teamB} />
          <p className="font-display text-[17px] font-black leading-none text-[#0D1B3E]">
            {match.scoreB}
          </p>
          <p className="text-[9px] text-[#9CA3AF]">{match.oversB}</p>
        </div>
      </div>

      {/* Status */}
      <div className="mx-3 mb-3 rounded-xl bg-[#F6F8FC] px-3 py-2 text-center">
        <p className="text-[10px] font-semibold text-[#374151] leading-snug">
          {match.status}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#E8ECF2] px-3 py-2">
        <div className="flex items-center gap-1 min-w-0">
          <MapPin size={10} className="flex-shrink-0 text-[#9CA3AF]" />
          <p className="truncate text-[9px] text-[#9CA3AF]">{match.venue}</p>
        </div>
        <div className="ml-2 flex flex-shrink-0 items-center gap-1">
          <Eye size={10} className="text-[#9CA3AF]" />
          <p className="text-[9px] text-[#9CA3AF]">{match.views}</p>
        </div>
      </div>
    </div>
  );
}

export default function LiveMatches() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="font-display text-[13px] font-black uppercase tracking-widest text-[#0D1B3E]">
          Today's Live Matches
        </h2>
        <button className="flex items-center gap-0.5 text-[11px] font-bold text-[#2F5BFF]">
          See All <span className="text-[13px]">›</span>
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {LIVE_MATCHES.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    </div>
  );
}
