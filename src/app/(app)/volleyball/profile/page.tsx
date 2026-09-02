"use client";

import { Activity, Award, ChevronRight, MapPin, RefreshCw, Trophy, Volleyball } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";
import { S3Image } from "@/components/common/S3Image";
import { getInitials } from "@/lib/getInitials";
import { useGetPlayerQuery } from "@/store/api/playerApi";
import { useGetMyVolleyballPerformanceQuery } from "@/store/api/volleyball/volleyballPerformanceApi";
import { useGetMyVolleyballAwardsQuery } from "@/store/api/volleyball/volleyballProfileApi";
import { VOLLEYBALL_AWARD_SCOPES } from "@/types/volleyball/awards";
import type { VolleyballPerformanceMatch, VolleyballPerformanceOverall } from "@/types/volleyball/performance";

export default function VolleyballProfilePage() {
  const router = useRouter();
  const playerQuery = useGetPlayerQuery();
  const performanceQuery = useGetMyVolleyballPerformanceQuery();
  const awardsQuery = useGetMyVolleyballAwardsQuery({
    scope: VOLLEYBALL_AWARD_SCOPES.ALL,
    skip: 0,
    limit: 1,
  });

  const isLoading =
    playerQuery.isLoading || performanceQuery.isLoading || awardsQuery.isLoading;
  const hasError =
    playerQuery.isError || performanceQuery.isError || awardsQuery.isError;

  if (isLoading) return <VolleyballProfileSkeleton />;

  if (
    hasError ||
    !playerQuery.data?.player ||
    !performanceQuery.data ||
    !awardsQuery.data
  ) {
    return (
      <VolleyballProfileError
        onRetry={() => {
          void playerQuery.refetch();
          void performanceQuery.refetch();
          void awardsQuery.refetch();
        }}
      />
    );
  }

  const player = playerQuery.data.player;
  const performance = performanceQuery.data;

  return (
    <div className="min-h-full bg-(--color-bg-base) pb-8">
      <main className="space-y-4 px-4 py-4">
        <PlayerHero
          fullName={player.fullName}
          city={player.city ?? null}
          profileImageUrl={player.profileImageUrl ?? null}
        />

        <CareerSummary
          overall={performance.overall}
          awardsTotal={awardsQuery.data.summary.total}
        />

        <section className="space-y-2">
          <p className="text-section-label">Explore</p>
          <ProfileAction
            icon={<Activity size={17} />}
            title="My Performance"
            description="Career record, points and match-by-match form"
            onClick={() => router.push("/volleyball/my-performance")}
          />
          <ProfileAction
            icon={<Award size={17} />}
            title="My Awards"
            description="Match and tournament achievements"
            badge={awardsQuery.data.summary.total}
            onClick={() => router.push("/volleyball/my-awards")}
          />
        </section>

        <RecentActivity
          matches={performance.byMatch.slice(0, 3)}
          onOpen={(matchId) => router.push(`/volleyball/matches/${matchId}`)}
        />
      </main>
    </div>
  );
}

function PlayerHero({
  fullName,
  city,
  profileImageUrl,
}: {
  fullName: string;
  city: string | null;
  profileImageUrl: string | null;
}) {
  const fallback = (
    <div className="flex h-full w-full items-center justify-center bg-(--color-brand) font-(family-name:--font-display) text-xl font-black text-white">
      {getInitials(fullName)}
    </div>
  );

  return (
    <section className="relative overflow-hidden rounded-3xl bg-(--color-navy) p-4 text-white shadow-lg">
      <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-(--color-brand)/25 blur-3xl" />
      <div className="relative flex items-center gap-3.5">
        <div className="h-18 w-18 shrink-0 overflow-hidden rounded-2xl border-2 border-(--color-brand) bg-white/10 shadow-md">
          <S3Image
            imageKey={profileImageUrl}
            alt={fullName}
            width={72}
            height={72}
            className="h-full w-full object-cover"
            fallback={fallback}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex w-fit items-center gap-1.5 rounded-full bg-(--color-brand) px-2 py-1 text-[7px] font-black uppercase tracking-[0.16em]">
            <Volleyball size={10} /> Volleyball Player
          </div>
          <h1 className="mt-2 truncate font-(family-name:--font-display) text-xl font-black uppercase tracking-wide">
            {fullName}
          </h1>
          <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[10px] text-white/55">
            <MapPin size={12} className="shrink-0 text-(--color-brand)" />
            <span className="truncate">{city || "City not set"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CareerSummary({
  overall,
  awardsTotal,
}: {
  overall: VolleyballPerformanceOverall;
  awardsTotal: number;
}) {
  return (
    <section>
      <div className="mb-2 flex items-end justify-between">
        <p className="text-section-label">Career Summary</p>
        <span className="text-[8px] text-(--color-text-muted)">Completed matches</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <SummaryMetric label="Matches" value={overall.matchesPlayed} />
        <SummaryMetric label="Wins" value={overall.matchesWon} />
        <SummaryMetric label="Credited Points" value={overall.totalCreditedPoints} />
        <SummaryMetric label="Awards" value={awardsTotal} />
      </div>
    </section>
  );
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 shadow-sm">
      <p className="font-(family-name:--font-display) text-2xl font-black leading-none text-(--color-text-primary)">{value}</p>
      <p className="mt-1.5 text-[8px] font-black uppercase tracking-wide text-(--color-text-muted)">{label}</p>
    </div>
  );
}

function ProfileAction({
  icon,
  title,
  description,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 text-left shadow-sm active:scale-[0.99]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-tint) text-(--color-brand)">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-black text-(--color-text-primary)">{title}</p>
          {badge !== undefined && badge > 0 && (
            <span className="rounded-full bg-(--color-brand) px-1.5 py-0.5 text-[7px] font-black text-white">{badge}</span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[9px] text-(--color-text-muted)">{description}</p>
      </div>
      <ChevronRight size={16} className="shrink-0 text-(--color-brand)" />
    </button>
  );
}

function RecentActivity({ matches, onOpen }: { matches: VolleyballPerformanceMatch[]; onOpen: (matchId: string) => void }) {
  return (
    <section>
      <div className="mb-2 flex items-end justify-between">
        <p className="text-section-label">Recent Activity</p>
        <span className="text-[8px] text-(--color-text-muted)">Played matches</span>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) px-4 py-6 text-center">
          <Trophy size={20} className="mx-auto text-(--color-text-muted)" />
          <p className="mt-2 text-xs font-black text-(--color-text-primary)">No played matches yet</p>
          <p className="mt-1 text-[9px] text-(--color-text-muted)">Completed matches you participate in will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {matches.map((match) => (
            <button key={match.matchId} type="button" onClick={() => onOpen(match.matchId)} className="flex w-full items-center gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-3 text-left shadow-sm active:scale-[0.99]">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[9px] font-black ${match.result === "WIN" ? "bg-emerald-50 text-emerald-700" : match.result === "LOSS" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"}`}>{match.result}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-black text-(--color-text-primary)">{match.teamName} vs {match.opponentTeamName}</p>
                <p className="mt-0.5 text-[8px] text-(--color-text-muted)">{match.totalCreditedPoints} credited points · {match.setsPlayed} sets</p>
              </div>
              <ChevronRight size={15} className="shrink-0 text-(--color-text-muted)" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function VolleyballProfileSkeleton() {
  return (
    <div className="min-h-full bg-(--color-bg-base) px-4 py-4">
      <div className="animate-pulse space-y-4">
        <div className="h-28 rounded-3xl bg-(--color-navy)" />
        <div className="grid grid-cols-2 gap-2">{[1, 2, 3, 4].map((item) => <div key={item} className="h-20 rounded-2xl bg-(--color-bg-card)" />)}</div>
        <div className="h-16 rounded-2xl bg-(--color-bg-card)" />
        <div className="h-16 rounded-2xl bg-(--color-bg-card)" />
        <div className="h-24 rounded-2xl bg-(--color-bg-card)" />
      </div>
    </div>
  );
}

function VolleyballProfileError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-(--color-bg-base) px-4 py-8">
      <div className="w-full rounded-3xl border border-(--color-bg-border) bg-(--color-bg-card) px-5 py-8 text-center shadow-sm">
        <RefreshCw size={22} className="mx-auto text-(--color-brand)" />
        <p className="mt-3 text-sm font-black text-(--color-text-primary)">Unable to load Volleyball profile</p>
        <p className="mt-1 text-[10px] leading-5 text-(--color-text-muted)">We couldn&apos;t load your player profile right now.</p>
        <Button fullWidth className="mt-4" onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  );
}
