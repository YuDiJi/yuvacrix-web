"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { HomeTournament, HomeTournamentTeam } from "@/types/home";

type Props = { tournaments: HomeTournament[] };

const THEME_GRADIENTS: Record<string, string> = {
  BLUE: "from-[#0D1B3E] to-[#1B3FA0]",
  PURPLE: "from-[#2d1b6e] to-[#5a3aad]",
  PINK: "from-[#6b1060] to-[#b03a90]",
};

function getGradient(theme: string): string {
  return THEME_GRADIENTS[theme] ?? THEME_GRADIENTS.BLUE;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function TeamRow({ team }: { team: HomeTournamentTeam }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="w-3 text-[9px] font-bold text-[#9CA3AF]">
          {team.rank}
        </span>
        {team.logoUrl ? (
          <Image
            src={team.logoUrl}
            alt={team.name}
            width={16}
            height={16}
            className="h-4 w-4 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1B3FA0]">
            <span className="text-[7px] font-black text-white">
              {getInitials(team.name)}
            </span>
          </div>
        )}
        <span className="max-w-22.5 truncate text-[10px] font-semibold text-[#374151]">
          {team.name}
        </span>
      </div>
      <span className="text-[10px] font-black text-[#0D1B3E]">
        {team.points} PTS
      </span>
    </div>
  );
}

function TournamentCard({
  t,
  onPress,
}: {
  t: HomeTournament;
  onPress: () => void;
}) {
  const gradient = getGradient(t.theme);

  return (
    <button
      onClick={onPress}
      className="w-52.5 shrink-0 overflow-hidden rounded-2xl border border-[#E8ECF2] bg-white shadow-[0_2px_8px_rgba(13,27,62,0.08)] text-left active:scale-95 transition-transform"
    >
      {/* Banner */}
      <div
        className={`relative flex h-20 items-end justify-between bg-linear-to-br ${gradient} px-3 pb-2.5`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, white, white 1px, transparent 1px, transparent 24px)",
          }}
        />
        <h3 className="relative max-w-32.5 font-display text-[13px] font-black uppercase leading-tight tracking-wide text-white">
          {t.title}
        </h3>
        <div className="relative flex flex-col items-end gap-1">
          <span className="text-[22px] leading-none">🏆</span>
          <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-bold text-white">
            {t.matchTypeLabel}
          </span>
        </div>
      </div>

      <div className="px-3 py-3">
        {/* Progress */}
        <div className="mb-2.5">
          <p className="mb-1.5 text-[10px] font-semibold text-[#6B7280]">
            {t.completedMatches} / {t.totalMatches} Matches
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E8ECF2]">
            <div
              className="h-full rounded-full bg-[#2F5BFF]"
              style={{ width: `${Math.min(t.progressPercent, 100)}%` }}
            />
          </div>
        </div>

        {t.topTeams.length > 0 && (
          <>
            <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF]">
              Top Teams
            </p>
            <div className="flex flex-col gap-1">
              {t.topTeams.slice(0, 3).map((team) => (
                <TeamRow key={team.teamId} team={team} />
              ))}
            </div>
          </>
        )}
      </div>
    </button>
  );
}

export default function ActiveTournaments({ tournaments }: Props) {
  const router = useRouter();

  if (!tournaments || tournaments.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="font-display text-[13px] font-black uppercase tracking-widest text-[#0D1B3E]">
          Active Tournaments
        </h2>
        <button
          onClick={() => router.push("/tournaments")}
          className="flex items-center gap-0.5 text-[11px] font-bold text-[#2F5BFF]"
        >
          See All <ChevronRight size={14} />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {tournaments.map((t) => (
          <TournamentCard
            key={t.seriesId}
            t={t}
            onPress={() => router.push(t.route)}
          />
        ))}
      </div>
    </div>
  );
}
