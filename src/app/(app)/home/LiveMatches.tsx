"use client";

import { useRouter } from "next/navigation";
import { MapPin, Eye, ChevronRight } from "lucide-react";
import { S3Image } from "@/components/common/S3Image";

export type LiveMatchItem = {
  matchId: string;
  matchFormat?: string | null;
  matchTypeLabel?: string | null;
  route?: string | null;
  teamA: {
    teamId: string;
    name: string;
    shortName?: string | null;
    logoUrl?: string | null;
  };
  teamB: {
    teamId: string;
    name: string;
    shortName?: string | null;
    logoUrl?: string | null;
  };
  scoreA?: string | null;
  oversA?: string | null;
  scoreB?: string | null;
  oversB?: string | null;
  statusText?: string | null;
  venue?: string | null;
  viewCount?: number | null;
};

type Props = { matches: unknown[] };

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function TeamAvatar({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string | null;
}) {
  return (
    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#E8ECF2] bg-[#F0F3FF]">
      {logoUrl ? (
        <S3Image
          imageKey={logoUrl}
          alt={name}
          width={48}
          height={48}
          className="h-full w-full object-cover"
          fallback={
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-brand)">
              <span className="font-bold text-white">{getInitials(name)}</span>
            </div>
          }
        />
      ) : (
        <span className="font-display text-[13px] font-black text-[#1B3FA0]">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}

function MatchCard({
  match,
  onPress,
}: {
  match: LiveMatchItem;
  onPress: () => void;
}) {
  const format = match.matchTypeLabel ?? match.matchFormat ?? "";

  return (
    <button
      onClick={onPress}
      className="flex w-55 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E8ECF2] bg-white shadow-[0_2px_8px_rgba(13,27,62,0.08)] text-left active:scale-95 transition-transform"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8ECF2] px-3 py-2">
        <span className="flex items-center gap-1 rounded-md bg-[#FF2D2D] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          LIVE
        </span>
        {format && (
          <span className="rounded-md bg-[#F0F3FF] px-2 py-0.5 text-[9px] font-bold text-[#2F5BFF]">
            {format}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex flex-col items-center gap-1">
          <TeamAvatar name={match.teamA.name} logoUrl={match.teamA.logoUrl} />
          <p className="max-w-15 text-center text-[9px] font-black uppercase leading-tight text-[#0D1B3E]">
            {match.teamA.shortName ?? match.teamA.name}
          </p>
          <p className="font-display text-[17px] font-black leading-none text-[#0D1B3E]">
            {match.scoreA ?? "—"}
          </p>
          <p className="text-[9px] text-[#9CA3AF]">{match.oversA ?? ""}</p>
        </div>

        <span className="mx-1 font-display text-[11px] font-black text-[#9CA3AF]">
          VS
        </span>

        <div className="flex flex-col items-center gap-1">
          <TeamAvatar name={match.teamB.name} logoUrl={match.teamB.logoUrl} />
          <p className="max-w-15 text-center text-[9px] font-black uppercase leading-tight text-[#0D1B3E]">
            {match.teamB.shortName ?? match.teamB.name}
          </p>
          <p className="font-display text-[17px] font-black leading-none text-[#0D1B3E]">
            {match.scoreB ?? "—"}
          </p>
          <p className="text-[9px] text-[#9CA3AF]">
            {match.oversB ?? "Yet to Bat"}
          </p>
        </div>
      </div>

      {match.statusText && (
        <div className="mx-3 mb-3 rounded-xl bg-[#F6F8FC] px-3 py-2 text-center">
          <p className="text-[10px] font-semibold leading-snug text-[#374151]">
            {match.statusText}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#E8ECF2] px-3 py-2">
        <div className="flex min-w-0 items-center gap-1">
          <MapPin size={10} className="shrink-0 text-[#9CA3AF]" />
          <p className="truncate text-[9px] text-[#9CA3AF]">
            {match.venue ?? "—"}
          </p>
        </div>
        {match.viewCount != null && (
          <div className="ml-2 flex shrink-0 items-center gap-1">
            <Eye size={10} className="text-[#9CA3AF]" />
            <p className="text-[9px] text-[#9CA3AF]">
              {match.viewCount > 999
                ? `${(match.viewCount / 1000).toFixed(1)}K`
                : match.viewCount}
            </p>
          </div>
        )}
      </div>
    </button>
  );
}

export default function LiveMatches({ matches }: Props) {
  const router = useRouter();

  if (!matches || matches.length === 0) return null;

  const typed = matches as LiveMatchItem[];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="font-display text-[13px] font-black uppercase tracking-widest text-[#0D1B3E]">
          Today&apos;s Live Matches
        </h2>
        <button
          onClick={() => router.push("/matches")}
          className="flex items-center gap-0.5 text-[11px] font-bold text-[#2F5BFF]"
        >
          See All <ChevronRight size={14} />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {typed.map((m) => (
          <MatchCard
            key={m.matchId}
            match={m}
            onPress={() => {
              const route = m.route ?? `/matches/${m.matchId}`;
              router.push(route);
            }}
          />
        ))}
      </div>
    </div>
  );
}
