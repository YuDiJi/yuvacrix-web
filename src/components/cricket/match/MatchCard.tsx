// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format ISO date → "19-May-26" */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    })
    .replace(/ /g, "-");
}
// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MatchCardStatus }) {
  const config: Record<MatchCardStatus, { label: string; className: string }> =
    {
      DRAFT: {
        label: "Draft",
        className:
          "bg-(--color-bg-base) text-(--color-text-muted) border border-(--color-bg-border)",
      },
      SCHEDULED: {
        label: "Upcoming",
        className: "bg-(--color-sky)/15 text-(--color-sky)",
      },
      READY_FOR_TOSS: {
        label: "Ready for Toss",
        className: "bg-(--color-brand)/10 text-(--color-brand)",
      },
      TOSS_DONE: {
        label: "Toss Done",
        className: "bg-(--color-six)/15 text-(--color-six)",
      },
      LIVE: {
        label: "Live",
        className: "bg-(--color-live)/12 text-(--color-live)",
      },
      IN_REVIEW: {
        label: "Live",
        className: "bg-(--color-six)/12 text-(--color-six)",
      },
      INNINGS_BREAK: {
        label: "Innings Break",
        className: "bg-(--color-six)/12 text-(--color-six)",
      },
      COMPLETED: {
        label: "Completed",
        className: "bg-(--color-four)/12 text-(--color-four)",
      },
      CANCELLED: {
        label: "Cancelled",
        className: "bg-(--color-text-muted)/10 text-(--color-text-muted)",
      },
      ABANDONED: {
        label: "Abandoned",
        className: "bg-(--color-text-muted)/10 text-(--color-text-muted)",
      },
    };

  const { label, className } = config[status] ?? config.DRAFT;

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[10px] font-(family-name:--font-display) font-bold uppercase tracking-[0.07em]",
        className,
      )}
    >
      {label}
    </span>
  );
}

/** Resolve display date — prefer scheduledAt, fallback to createdAt */
function resolveDate(match: MatchCardModel): string {
  const date = match.scheduledAt ?? match.startedAt ?? match.completedAt;

  return date ? formatDate(date) : "--";
}

/** First 1–3 uppercase initials from a team ID (replace with real team name lookup) */
function teamInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Shorten match type label */
function matchTypeLabel(type: string): string {
  const map: Record<string, string> = {
    LIMITED_OVERS: "Limited Over",
    BOX_TURF: "Box Cricket",
    TEST: "Test Match",
    THE_HUNDRED: "The Hundred",
    PAIR: "Pair Cricket",
  };
  return map[type] ?? type;
}

import { cn } from "@/lib/cn";
// ─── Team Avatar ──────────────────────────────────────────────────────────────

import { S3Image } from "../../common/S3Image";
import { MatchCardModel, MatchCardStatus } from "@/types/cricket/matchCard";

function TeamAvatar({
  initials,
  logoUrl,
}: {
  initials: string;
  logoUrl: string | null;
}) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-bg-base) border border-(--color-bg-border)">
      {logoUrl ? (
        <S3Image
          imageKey={logoUrl}
          alt="initials"
          width={36}
          height={36}
          fallback={
            <span className="font-(family-name:--font-display) text-xs font-black text-(--color-text-secondary) uppercase tracking-wide">
              {initials}
            </span>
          }
          className="h-full w-full object-cover rounded-full"
        />
      ) : (
        <span className="font-(family-name:--font-display) text-xs font-black text-(--color-text-secondary) uppercase tracking-wide">
          {initials}
        </span>
      )}
    </div>
  );
}

// ─── Match Card ───────────────────────────────────────────────────────────────

export function MatchCard({
  match,
  onClick,
}: {
  match: MatchCardModel;
  onClick: () => void;
}) {
  const teamAName = match.teamA.name;
  const teamBName = match.teamB.name;
  const venue_city = match?.venue?.city;
  const venue_groundName = match.venue?.groundName;
  const displayDate = resolveDate(match);
  const overs = match.oversLimit;
  const typeLabel = match.matchType ? matchTypeLabel(match.matchType) : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixture-bar w-full rounded-2xl bg-(--color-bg-card) shadow-(--shadow-card) text-left transition-all duration-150 active:scale-[0.99] hover:shadow-[0_4px_20px_rgba(13,27,62,0.10)]"
    >
      {/* Top meta row */}
      <div
        className={`flex items-center ${match?.matchType ? "justify-between" : "justify-end"} px-4 pt-4 pb-2`}
      >
        {match?.matchType && (
          <span className="text-section-label">{typeLabel}</span>
        )}
        <StatusBadge status={match?.status} />
      </div>

      {/* Date + overs + venue */}
      <div className="px-4 pb-3">
        <p className="text-xs text-(--color-text-muted) font-medium">
          {displayDate}
          {" | "}
          {overs} Ov.
          {" | "}
          {venue_city}, {venue_groundName}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-(--color-bg-border)" />

      {/* Teams */}
      <div className="flex flex-col gap-2.5 px-4 py-3">
        {/* Team A */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <TeamAvatar
              initials={teamInitials(teamAName)}
              logoUrl={match.teamA.logoUrl ?? null}
            />
            <span
              className={cn(
                "font-(family-name:--font-display) font-black uppercase leading-tight",
                teamAName.length > 12 ? "text-base" : "text-lg",
              )}
              style={{ letterSpacing: "0.02em", color: "var(--color-navy)" }}
            >
              {teamAName}
            </span>
          </div>
          <div>
            {match.teamA.score && (
              <p>
                {match.teamA.score.runs}/{match.teamA.score?.wickets} (
                {match.teamA.score.oversText})
              </p>
            )}
          </div>
        </div>

        {/* Team B */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <TeamAvatar
              initials={teamInitials(teamBName)}
              logoUrl={match.teamB.logoUrl ?? null}
            />
            <span
              className={cn(
                "font-(family-name:--font-display) font-black uppercase leading-tight",
                teamBName.length > 12 ? "text-base" : "text-lg",
              )}
              style={{ letterSpacing: "0.02em", color: "var(--color-navy)" }}
            >
              {teamBName}
            </span>
          </div>
          <div>
            {match.teamB.score && (
              <p>
                {match.teamB.score.runs}/{match.teamB.score?.wickets} (
                {match.teamB.score.oversText})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row — toss/schedule + action links */}

      <>
        <div className="mx-4 h-px bg-(--color-bg-border)" />
        <div className="flex flex-col  items-end justify-between px-4 py-3 gap-1">
          <p className="flex-1 w-full min-w-0 text-xs italic text-(--color-text-muted) leading-relaxed truncate">
            {match.summaryText}
          </p>
          {/* Action links */}
          <div
            className="flex items-center gap-3 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex shrink-0 items-center gap-3"
              onClick={(event) => event.stopPropagation()}
            >
              {match.capabilities?.insightsAvailable && (
                <button
                  type="button"
                  onClick={onClick}
                  className="text-[11px] font-(family-name:--font-display) font-black uppercase tracking-[0.07em] text-(--color-brand) transition-opacity hover:opacity-70"
                >
                  Insights
                </button>
              )}

              {match.capabilities?.scorecardAvailable && (
                <button
                  type="button"
                  onClick={onClick}
                  className="text-[11px] font-(family-name:--font-display) font-black uppercase tracking-[0.07em] text-(--color-brand) transition-opacity hover:opacity-70"
                >
                  Scorecard
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    </button>
  );
}
