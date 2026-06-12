import { Users, Tv, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { Team } from "@/types/team";

type Props = {
  teamA: Team | null;
  teamB: Team | null;
};

const TeamSelection = ({ teamA, teamB }: Props) => {
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-col gap-5 bg-(--color-bg-base) p-4">
      {/* Step header */}
      <div className="space-y-2">
        <h2
          className="font-(family-name:--font-display) text-2xl font-black uppercase text-(--color-text-primary)"
          style={{ letterSpacing: "0.04em" }}
        >
          Team Selection
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-section-label">Step 1 of 5</span>
          <div className="ml-2 flex flex-1 items-center gap-1.5">
            <div className="h-1 w-8 rounded-full bg-(--color-brand)" />
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full bg-(--color-bg-border)"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Team cards */}
      <div className="relative flex flex-col gap-3">
        {/* Team A */}
        <button
          onClick={() => router.push("/start-match/select-team?team=A")}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-8",
            "transition-all duration-200 active:scale-[0.98]",
            teamA
              ? "border-(--color-brand) bg-(--color-navy) shadow-[0_4px_20px_rgba(27,63,160,0.20)]"
              : "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-sky)/40",
          )}
        >
          {teamA && (
            <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-(--color-brand)">
              <Check size={12} className="text-white" strokeWidth={3} />
            </span>
          )}
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
              teamA
                ? "border-white/20 bg-white/10"
                : "border-(--color-bg-border) bg-(--color-bg-base)",
            )}
          >
            <Users
              size={22}
              className={teamA ? "text-white/70" : "text-(--color-text-muted)"}
            />
          </div>
          <div className="text-center">
            <h3
              className={cn(
                "font-(family-name:--font-display) text-lg font-black uppercase",
                teamA ? "text-white" : "text-(--color-text-secondary)",
              )}
              style={{ letterSpacing: "0.04em" }}
            >
              {teamA ? teamA.name : "Select Team A"}
            </h3>
            <p
              className="text-section-label mt-0.5"
              style={{ color: teamA ? "rgba(255,255,255,0.45)" : undefined }}
            >
              Home Team
            </p>
          </div>
          {!teamA && (
            <span className="flex items-center gap-1 rounded-full border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-1 text-xs font-semibold text-(--color-text-muted)">
              Tap to select <ChevronRight size={11} />
            </span>
          )}
        </button>

        {/* VS badge */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-brand) shadow-[0_4px_14px_rgba(27,63,160,0.40)] ring-4 ring-(--color-bg-base)">
            <span
              className="font-(family-name:--font-display) text-xs font-black text-white"
              style={{ letterSpacing: "0.06em" }}
            >
              VS
            </span>
          </div>
        </div>

        {/* Team B */}
        <button
          onClick={() => router.push("/start-match/select-team?team=B")}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-8",
            "transition-all duration-200 active:scale-[0.98]",
            teamB
              ? "border-(--color-brand) bg-(--color-navy) shadow-[0_4px_20px_rgba(27,63,160,0.20)]"
              : "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-sky)/40",
          )}
        >
          {teamB && (
            <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-(--color-brand)">
              <Check size={12} className="text-white" strokeWidth={3} />
            </span>
          )}
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
              teamB
                ? "border-white/20 bg-white/10"
                : "border-(--color-bg-border) bg-(--color-bg-base)",
            )}
          >
            <Users
              size={22}
              className={teamB ? "text-white/70" : "text-(--color-text-muted)"}
            />
          </div>
          <div className="text-center">
            <h3
              className={cn(
                "font-(family-name:--font-display) text-lg font-black uppercase",
                teamB ? "text-white" : "text-(--color-text-secondary)",
              )}
              style={{ letterSpacing: "0.04em" }}
            >
              {teamB ? teamB.name : "Select Team B"}
            </h3>
            <p
              className="text-section-label mt-0.5"
              style={{ color: teamB ? "rgba(255,255,255,0.45)" : undefined }}
            >
              Opponent Team
            </p>
          </div>
          {!teamB && (
            <span className="flex items-center gap-1 rounded-full border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-1 text-xs font-semibold text-(--color-text-muted)">
              Tap to select <ChevronRight size={11} />
            </span>
          )}
        </button>
      </div>

      {/* Match details hint */}
      <div className="flex items-center gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-base)">
          <Tv size={20} className="text-(--color-text-muted)" />
        </div>
        <div>
          <p className="text-section-label">Match Details</p>
          <p className="mt-0.5 text-sm font-semibold text-(--color-text-secondary)">
            Please select teams to proceed
          </p>
        </div>
      </div>

      {/* Continue CTA */}
      <div className="mt-auto">
        <button
          disabled
          className="w-full cursor-not-allowed rounded-2xl bg-(--color-bg-border) py-4 font-(family-name:--font-display) text-base font-black uppercase tracking-[0.06em] text-(--color-text-muted)"
        >
          Continue <ChevronRight className="inline" size={16} />
        </button>
      </div>
    </div>
  );
};

export default TeamSelection;
