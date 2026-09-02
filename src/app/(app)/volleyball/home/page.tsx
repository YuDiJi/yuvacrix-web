"use client";

import {
  Activity,
  BarChart3,
  ChevronRight,
  Play,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Users,
  Volleyball,
  Zap,
} from "lucide-react";
import Link from "next/link";

// TODO: Replace with dedicated Volleyball Home API.
const HOME_PREVIEW_DATA = {
  stats: [
    { label: "Kills", value: 386, trend: "16%", tone: "orange" },
    { label: "Aces", value: 92, trend: "10%", tone: "blue" },
    { label: "Blocks", value: 64, trend: "5%", tone: "green" },
    { label: "Digs", value: 228, trend: "3%", tone: "purple" },
  ],
  awards: [
    { title: "4 MVP Awards", detail: "Season 2024–25", kind: "mvp" },
    { title: "Best Spiker", detail: "District Open 2025", kind: "spiker" },
    { title: "Top 5 Ace Server", detail: "Regional Rankings", kind: "server" },
  ],
  recentMatch: {
    meta: "Yesterday · Beach Court 2",
    detail: "Best of 5 · Set 3 decided",
    result: "Won",
    teams: [
      {
        initials: "SP",
        name: "Spike Masters",
        scores: [25, 25, 22, null, null],
      },
      { initials: "BK", name: "Block Kings", scores: [18, 20, 25, null, null] },
    ],
  },
  tournaments: [
    {
      name: "City Beach Open 2025",
      meta: "16 Teams · Pool Stage",
      venue: "Beach Volleyball",
      status: "Live",
      tone: "beach",
    },
    {
      name: "YuvaCrix Invitational",
      meta: "12 Teams · Knockout",
      venue: "Indoor Volleyball",
      status: "Upcoming",
      tone: "indoor",
    },
  ],
} as const;

const QUICK_ACTIONS = [
  {
    title: "Score a match",
    description: "Record live sets and points",
    href: "/volleyball/matches/create",
    icon: Play,
    tone: "orange",
  },
  {
    title: "Create tournament",
    description: "Create your tournament format",
    href: "/volleyball/tournaments/create",
    icon: Trophy,
    tone: "blue",
  },
  {
    title: "My Volleyball",
    description: "Matches, tournaments and more",
    href: "/volleyball/my-volleyball",
    icon: Users,
    tone: "green",
  },
] as const;

const toneClasses = {
  orange: {
    soft: "bg-orange-50",
    text: "text-(--color-brand)",
    solid: "bg-(--color-brand)",
  },
  blue: { soft: "bg-blue-50", text: "text-blue-500", solid: "bg-blue-500" },
  green: {
    soft: "bg-emerald-50",
    text: "text-emerald-600",
    solid: "bg-emerald-500",
  },
  purple: {
    soft: "bg-violet-50",
    text: "text-violet-500",
    solid: "bg-violet-500",
  },
} as const;

export default function VolleyballHomePage() {
  return (
    <div className="min-h-full overflow-x-hidden bg-(--color-bg-base) pb-24">
      <main className="space-y-7 px-4 py-4">
        <VolleyballHomeHero />
        <HomeQuickActions />
        <HomeSeasonStats />
        <HomeAwards />
        <HomeRecentMatch />
        <HomeTournaments />
      </main>
    </div>
  );
}

function VolleyballHomeHero() {
  return (
    <section
      role="img"
      aria-label="Volleyball player jumping to hit the ball with Play Hard Rise Higher message"
      className="aspect-[3/1] w-full overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 bg-contain bg-center bg-no-repeat shadow-[0_6px_18px_rgba(31,78,140,0.08)]"
      style={{
        backgroundImage: "url('/volleyball/home/volleyball banner.png')",
      }}
    />
  );
}

function HomeQuickActions() {
  return (
    <section>
      <SectionHeading
        title="Quick actions"
        action="All actions"
        href="/volleyball/my-volleyball"
      />
      <div className="-mx-4 mt-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        <div className="flex w-max flex-nowrap gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="flex min-h-[104px] w-[220px] shrink-0 items-center gap-3 rounded-2xl border border-blue-100 bg-(--color-bg-card) p-3 shadow-[0_7px_20px_rgba(31,78,140,0.08)] transition active:scale-[0.99]"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${toneClasses[action.tone].soft} ${toneClasses[action.tone].text}`}
                >
                  <Icon size={22} strokeWidth={2.4} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block min-h-10 break-words text-sm font-black leading-5 text-(--color-navy)">
                    {action.title}
                  </span>
                  <span className="mt-1 block text-[10px] leading-4 text-slate-500">
                    {action.description}
                  </span>
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${toneClasses[action.tone].solid}`}
                >
                  <ChevronRight size={15} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HomeSeasonStats() {
  const icons = [Activity, Target, Shield, Sparkles];
  return (
    <section>
      <SectionHeading
        title="This season's numbers"
        action="View all stats"
        href="/volleyball/my-performance"
      />
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {HOME_PREVIEW_DATA.stats.map((stat, index) => {
          const Icon = icons[index];
          return (
            <article
              key={stat.label}
              className="rounded-2xl border border-blue-100 bg-(--color-bg-card) p-3 shadow-[0_7px_20px_rgba(31,78,140,0.08)]"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toneClasses[stat.tone].soft} ${toneClasses[stat.tone].text}`}
                >
                  <Icon size={19} strokeWidth={2.4} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold text-slate-600">
                    {stat.label}
                  </p>
                  <p className="font-(family-name:--font-display) text-3xl font-black leading-none text-(--color-navy)">
                    {stat.value}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[10px] font-bold text-emerald-600">
                ↑ {stat.trend}
              </p>
              <p className="mt-0.5 text-[9px] text-slate-400">vs last season</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function HomeAwards() {
  return (
    <section>
      <SectionHeading
        title="Awards and badges"
        action="All Awards"
        href="/volleyball/my-awards"
      />
      <div className="-mx-4 mt-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        <div className="flex w-max gap-2.5">
          {HOME_PREVIEW_DATA.awards.map((award) => (
            <article
              key={award.title}
              className="flex min-h-[112px] w-[225px] shrink-0 items-center gap-3 rounded-2xl border border-blue-100 bg-(--color-bg-card) p-3 shadow-[0_7px_20px_rgba(31,78,140,0.08)]"
            >
              <AwardIcon kind={award.kind} />
              <div className="min-w-0">
                <p className="text-xs font-black uppercase leading-4 text-(--color-navy)">
                  {award.title}
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-[9px] text-slate-500">
                  <span className="text-amber-400">★</span>
                  {award.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AwardIcon({
  kind,
}: {
  kind: (typeof HOME_PREVIEW_DATA.awards)[number]["kind"];
}) {
  const config = {
    mvp: { icon: Trophy, className: "bg-amber-50 text-amber-500" },
    spiker: { icon: Zap, className: "bg-orange-50 text-orange-500" },
    server: { icon: Target, className: "bg-rose-50 text-rose-500" },
  } as const;
  const Icon = config[kind].icon;
  return (
    <span
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${config[kind].className}`}
    >
      <Icon size={30} strokeWidth={2.3} />
    </span>
  );
}

function HomeRecentMatch() {
  const match = HOME_PREVIEW_DATA.recentMatch;
  return (
    <section>
      <SectionHeading
        title="Recent matches"
        action="See all"
        href="/volleyball/my-volleyball?tab=matches&scope=all"
      />
      <article className="mt-3 rounded-2xl border border-blue-100 bg-(--color-bg-card) p-3.5 shadow-[0_8px_24px_rgba(31,78,140,0.09)]">
        <div className="flex flex-wrap items-center justify-between gap-1.5 text-[9px] text-slate-500">
          <span>{match.meta}</span>
          <span>{match.detail}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2.5">
            {match.teams.map((team, index) => (
              <div key={team.name} className="flex min-w-0 items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white ${index === 0 ? "bg-(--color-navy)" : "bg-slate-400"}`}
                >
                  {team.initials}
                </span>
                <span className="truncate text-[11px] font-black text-(--color-navy)">
                  {team.name}
                </span>
              </div>
            ))}
          </div>
          <div className="max-w-[185px] overflow-x-auto pb-1 scrollbar-hide">
            <div className="grid min-w-[172px] grid-cols-5 gap-1.5">
              {match.teams.flatMap((team, teamIndex) =>
                team.scores.map((score, setIndex) => (
                  <span
                    key={`${team.name}-${setIndex}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-[10px] font-black ${teamIndex === 0 && setIndex === 2 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-blue-100 bg-blue-50/50 text-(--color-navy)"}`}
                    style={{ gridRow: teamIndex + 1, gridColumn: setIndex + 1 }}
                  >
                    {score ?? "–"}
                  </span>
                )),
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-blue-50 pt-3">
          <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {match.result}
          </span>
          <button
            type="button"
            disabled
            aria-label="Scorecard preview unavailable"
            className="flex h-8 items-center gap-1.5 rounded-lg border border-blue-100 px-3 text-[9px] font-bold text-blue-500 opacity-60"
          >
            <BarChart3 size={13} />
            Scorecard
          </button>
        </div>
      </article>
    </section>
  );
}

function HomeTournaments() {
  return (
    <section>
      <SectionHeading
        title="My tournaments"
        action="Create new"
        href="/volleyball/tournaments/create"
      />
      <div className="mt-3 overflow-hidden rounded-2xl border border-blue-100 bg-(--color-bg-card) shadow-[0_8px_24px_rgba(31,78,140,0.09)]">
        {HOME_PREVIEW_DATA.tournaments.map((tournament, index) => (
          <div
            key={tournament.name}
            className={`flex items-center gap-3 p-3 ${index > 0 ? "border-t border-blue-50" : ""}`}
          >
            <TournamentArtwork tone={tournament.tone} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-black text-(--color-navy)">
                {tournament.name}
              </p>
              <p className="mt-1 truncate text-[9px] text-slate-500">
                {tournament.meta}
              </p>
              <p className="mt-1 truncate text-[8px] text-slate-400">
                {tournament.venue}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1.5 text-[8px] font-black ${tournament.status === "Live" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-500"}`}
            >
              {tournament.status}
            </span>
            <ChevronRight size={16} className="shrink-0 text-slate-400" />
          </div>
        ))}
      </div>
      <Link
        href="/volleyball/my-volleyball?tab=tournaments&scope=all"
        className="mt-3 flex items-center justify-center gap-1 text-[10px] font-black text-blue-600"
      >
        View all tournaments <ChevronRight size={13} />
      </Link>
    </section>
  );
}

function TournamentArtwork({ tone }: { tone: "beach" | "indoor" }) {
  return (
    <span
      className={`relative flex h-14 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl ${tone === "beach" ? "bg-[linear-gradient(145deg,#73c9ff,#fff2ad_58%,#f3a84d)]" : "bg-[linear-gradient(145deg,#131d55,#2969bd_58%,#ff6b2c)]"}`}
      aria-hidden="true"
    >
      <span className="absolute inset-x-0 bottom-2 h-px bg-white/60" />
      <span className="absolute bottom-2 right-2 h-8 w-px bg-white/60" />
      <Volleyball
        size={26}
        className={tone === "beach" ? "text-(--color-navy)" : "text-white"}
      />
    </span>
  );
}

function SectionHeading({
  title,
  action,
  href,
}: {
  title: string;
  action: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-base font-black text-(--color-navy)">{title}</h2>
      <Link
        href={href}
        className="flex shrink-0 items-center gap-0.5 text-[10px] font-bold text-blue-600"
      >
        {action}
        <ChevronRight size={13} />
      </Link>
    </div>
  );
}
