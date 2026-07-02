"use client";

import { TOURNAMENTS, type Tournament } from "./mockData";

function TournamentCard({ t }: { t: Tournament }) {
  const progress = Math.round((t.matchesPlayed / t.totalMatches) * 100);

  return (
    <div className="w-[210px] flex-shrink-0 overflow-hidden rounded-2xl border border-[#E8ECF2] bg-white shadow-[0_2px_8px_rgba(13,27,62,0.08)]">
      {/* Banner */}
      <div
        className={`relative flex h-[80px] items-end justify-between bg-gradient-to-br ${t.gradient} px-3 pb-2.5`}
      >
        {/* Texture overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, white, white 1px, transparent 1px, transparent 24px)",
          }}
        />
        <h3 className="relative font-display text-[13px] font-black uppercase leading-tight tracking-wide text-white max-w-[140px]">
          {t.name}
        </h3>
        <div className="relative flex flex-col items-end gap-1">
          <span className="text-[22px] leading-none">{t.emoji}</span>
          <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-bold text-white">
            {t.format}
          </span>
        </div>
      </div>

      <div className="px-3 py-3">
        {/* Progress */}
        <div className="mb-2.5">
          <p className="mb-1.5 text-[10px] font-semibold text-[#6B7280]">
            {t.matchesPlayed} / {t.totalMatches} Matches
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E8ECF2]">
            <div
              className="h-full rounded-full bg-[#2F5BFF]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Top teams */}
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF]">
          Top Teams
        </p>
        <div className="flex flex-col gap-1">
          {t.topTeams.map((team, i) => (
            <div key={team.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 text-[9px] font-bold text-[#9CA3AF]">
                  {i + 1}
                </span>
                <span className="text-[11px]">{team.emoji}</span>
                <span className="text-[10px] font-semibold text-[#374151] truncate max-w-[90px]">
                  {team.name}
                </span>
              </div>
              <span className="text-[10px] font-black text-[#0D1B3E]">
                {team.pts} PTS
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ActiveTournaments() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="font-display text-[13px] font-black uppercase tracking-widest text-[#0D1B3E]">
          Active Tournaments
        </h2>
        <button className="flex items-center gap-0.5 text-[11px] font-bold text-[#2F5BFF]">
          See All <span className="text-[13px]">›</span>
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {TOURNAMENTS.map((t) => (
          <TournamentCard key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}
