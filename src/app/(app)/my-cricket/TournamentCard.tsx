// // ─── Helpers ──────────────────────────────────────────────────────────────────

// /** Format ISO date → "19-May-26" */
// function formatDate(iso: string): string {
//   const d = new Date(iso);
//   return d
//     .toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "2-digit",
//     })
//     .replace(/ /g, "-");
// }
// // ─── Status Badge ─────────────────────────────────────────────────────────────

// function StatusBadge({ status }: { status: TournamentStatus }) {
//   const config: Record<TournamentStatus, { label: string; className: string }> =
//     {
//       DRAFT: {
//         label: "Draft",
//         className:
//           "bg-(--color-bg-base) text-(--color-text-muted) border border-(--color-bg-border)",
//       },
//       // SCHEDULED: {
//       //   label: "Upcoming",
//       //   className: "bg-(--color-sky)/15 text-(--color-sky)",
//       // },
//       FIXTURES_READY: {
//         label: "Fixtures Ready",
//         className: "bg-(--color-brand)/10 text-(--color-brand)",
//       },
//       // TOSS_DONE: {
//       //   label: "Toss Done",
//       //   className: "bg-(--color-six)/15 text-(--color-six)",
//       // },
//       ACTIVE: {
//         label: "Active",
//         className: "bg-(--color-live)/12 text-(--color-live)",
//       },
//       ARCHIVED: {
//         label: "Archived",
//         className: "bg-(--color-six)/12 text-(--color-six)",
//       },
//       COMPLETED: {
//         label: "Completed",
//         className: "bg-(--color-four)/12 text-(--color-four)",
//       },
//       CANCELLED: {
//         label: "Cancelled",
//         className: "bg-(--color-text-muted)/10 text-(--color-text-muted)",
//       },
//       // ABANDONED: {
//       //   label: "Abandoned",
//       //   className: "bg-(--color-text-muted)/10 text-(--color-text-muted)",
//       // },
//     };

//   const { label, className } = config[status] ?? config.DRAFT;

//   return (
//     <span
//       className={cn(
//         "rounded-full px-3 py-1 text-[10px] font-(family-name:--font-display) font-bold uppercase tracking-[0.07em]",
//         className,
//       )}
//     >
//       {label}
//     </span>
//   );
// }

// /** Resolve display date — prefer scheduledAt, fallback to createdAt */

// /** First 1–3 uppercase initials from a team ID (replace with real team name lookup) */
// function teamInitials(name: string): string {
//   return name
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
// }

// import { S3Image } from "@/components/common/S3Image";
// import { cn } from "@/lib/cn";
// import { Tournament, TournamentStatus } from "@/store/api/tournamentApi";
// import { Match, MatchStatus } from "@/types/match";
// // ─── Team Avatar ──────────────────────────────────────────────────────────────

// import { useRouter } from "next/navigation";

// function TeamAvatar({ initials }: { initials: string }) {
//   return (
//     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-bg-base) border border-(--color-bg-border)">
//       <span className="font-(family-name:--font-display) text-xs font-black text-(--color-text-secondary) uppercase tracking-wide">
//         {initials}
//       </span>
//     </div>
//   );
// }

// // ─── Match Card ───────────────────────────────────────────────────────────────

// export function TournamentCard({
//   tournament,
//   onClick,
// }: {
//   tournament: Tournament;
//   onClick: () => void;
// }) {
//   const router = useRouter();

//   const venue_city = tournament.location?.city;
//   const venue_groundName = tournament.location?.groundName;
//   const displayDate = `${formatDate(tournament?.startDate)} to ${formatDate(tournament?.endDate)}`;

//   return (
//     <button
//       onClick={onClick}
//       className="fixture-bar w-full rounded-2xl bg-(--color-bg-card) shadow-(--shadow-card) text-left transition-all duration-150 active:scale-[0.99] hover:shadow-[0_4px_20px_rgba(13,27,62,0.10)]"
//     >
//       {/* Top meta row */}
//       <div className="flex items-center justify-between px-4 pt-4 pb-2">
//         {/* <span className="text-section-label">{typeLabel}</span> */}
//         <StatusBadge status={tournament?.status} />
//       </div>
//       <div>
//         <S3Image
//           imageKey={tournament.coverImageUrl}
//           alt="Tournament Banner"
//           width={80}
//           height={80}
//           fallback={
//             <div className="flex h-36 w-full items-center justify-center bg-(--color-bg-navy) border border-(--color-bg-border)">
//               <span className="font-(family-name:--font-display) text-xs font-black text-(--color-text-secondary) uppercase tracking-wide">
//                 {teamInitials(tournament.name)}
//               </span>
//             </div>
//           }
//         />
//       </div>
//       {/* Teams */}
//       <div className="flex flex-col gap-2.5 px-4 py-3">
//         <div className="flex items-center gap-3">
//           <span
//             className={cn(
//               "font-(family-name:--font-display) font-black uppercase leading-tight",
//               // teamAName.length > 12 ? "text-base" : "text-lg",
//             )}
//             style={{ letterSpacing: "0.02em", color: "var(--color-navy)" }}
//           >
//             {tournament.name}
//           </span>
//         </div>
//       </div>

//       {/* Date + overs + venue */}
//       <div className="px-4 pb-3">
//         <p className="text-xs text-(--color-text-muted) font-medium">
//           {displayDate}
//           {" | "}
//           {venue_city}, {venue_groundName}
//         </p>
//       </div>

//       {/* Divider */}
//       <div className="mx-4 h-px bg-(--color-bg-border)" />
//     </button>
//   );
// }

"use client";

import { Calendar, MapPin, ChevronRight, Trophy } from "lucide-react";
import { S3Image } from "@/components/common/S3Image";
import { cn } from "@/lib/cn";
import { Tournament, TournamentStatus } from "@/store/api/tournamentApi";

// ── Helpers ───────────────────────────────────────────────────────────

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── Status Badge ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  TournamentStatus,
  { label: string; bg: string; text: string }
> = {
  DRAFT: { label: "Draft", bg: "bg-gray-600/80", text: "text-white" },
  FIXTURES_READY: {
    label: "Fixtures Ready",
    bg: "bg-blue-600/85",
    text: "text-white",
  },
  ACTIVE: { label: "Ongoing", bg: "bg-red-500/90", text: "text-white" },
  COMPLETED: { label: "Completed", bg: "bg-green-600/85", text: "text-white" },
  ARCHIVED: { label: "Archived", bg: "bg-slate-600/80", text: "text-white" },
  CANCELLED: { label: "Cancelled", bg: "bg-gray-500/80", text: "text-white" },
};

function StatusBadge({ status }: { status: TournamentStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-widest backdrop-blur-sm",
        cfg.bg,
        cfg.text,
      )}
    >
      {cfg.label}
    </span>
  );
}

// ── Banner ────────────────────────────────────────────────────────────

function BannerImage({
  coverImageUrl,
  name,
}: {
  coverImageUrl?: string | null;
  name: string;
}) {
  return (
    <div className="relative h-35 w-full overflow-hidden rounded-t-2xl">
      {coverImageUrl ? (
        <S3Image
          imageKey={coverImageUrl}
          alt={`${name} banner`}
          width={800}
          height={400}
          className="h-full w-full object-cover"
          fallback={<BannerFallback name={name} />}
        />
      ) : (
        <BannerFallback name={name} />
      )}
      {/* Bottom gradient scrim */}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
    </div>
  );
}

function BannerFallback({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-(--color-navy) to-(--color-brand)">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(112deg, white, white 1px, transparent 1px, transparent 28px)",
        }}
      />
      <span className="relative font-display text-[48px] font-black uppercase text-white/20">
        {getInitials(name)}
      </span>
    </div>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────

function TournamentLogo({
  logoUrl,
  name,
}: {
  logoUrl?: string | null;
  name: string;
}) {
  return (
    // Sits on the boundary between banner and card body — pulled up by -mt-5
    // so it overlaps the bottom of the image
    <div className="relative -mt-12 ml-3 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-(--color-bg-card) bg-(--color-bg-card) shadow-[0_2px_8px_rgba(13,27,62,0.18)]">
      {logoUrl ? (
        <S3Image
          imageKey={logoUrl}
          alt={`${name} logo`}
          width={50}
          height={50}
          className="h-full w-full object-cover"
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
              <Trophy size={35} className="text-white/70" />
            </div>
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
          <Trophy size={35} className="text-white/70" />
        </div>
      )}
    </div>
  );
}

// ── Main Card ─────────────────────────────────────────────────────────

export function TournamentCard({
  tournament,
  onClick,
}: {
  tournament: Tournament;
  onClick: () => void;
}) {
  const dateRange =
    tournament.startDate && tournament.endDate
      ? `${formatDate(tournament.startDate)} to ${formatDate(tournament.endDate)}`
      : tournament.startDate
        ? `From ${formatDate(tournament.startDate)}`
        : null;

  const city = tournament.location?.city;
  const ground = tournament.location?.groundName;
  const locationLine = [city, ground].filter(Boolean).join(", ");

  return (
    <button
      onClick={onClick}
      className="w-full overflow-hidden rounded-2xl bg-(--color-bg-card) text-left shadow-(--shadow-card) transition-all duration-150 active:scale-[0.98] hover:shadow-[0_4px_20px_rgba(13,27,62,0.12)]"
    >
      {/* ── Banner with status badge overlay ── */}
      <div className="relative">
        <BannerImage
          coverImageUrl={tournament.coverImageUrl}
          name={tournament.name}
        />
        {/* Status badge — top right */}
        <div className="absolute right-3 top-3">
          <StatusBadge status={tournament.status} />
        </div>
      </div>

      {/* ── Logo overlapping the banner bottom edge ── */}
      <TournamentLogo logoUrl={tournament.logoUrl} name={tournament.name} />

      {/* ── Card body ── */}
      <div className="flex flex-col gap-2 px-4 pb-3.5 pt-2">
        {/* Tournament name */}
        <h3 className="font-display text-[18px] font-black uppercase leading-tight tracking-wide text-(--color-navy)">
          {tournament.name}
        </h3>

        {/* Date row */}
        {dateRange && (
          <div className="flex items-center gap-2">
            <Calendar
              size={13}
              className="shrink-0 text-(--color-text-muted)"
            />
            <p className="text-[13px] font-medium text-(--color-text-secondary)">
              {dateRange}
            </p>
          </div>
        )}

        {/* Location + Go live CTA */}
        <div className="flex items-center justify-between">
          {locationLine ? (
            <div className="flex min-w-0 items-center gap-1.5">
              <MapPin
                size={13}
                className="shrink-0 text-(--color-text-muted)"
              />
              <p className="truncate text-[13px] font-medium text-(--color-text-muted)">
                {locationLine}
              </p>
            </div>
          ) : (
            <div />
          )}

          {/* Go live — only for active tournaments */}
          {tournament.status === "ACTIVE" && (
            <div className="ml-3 flex shrink-0 items-center gap-0.5">
              <span className="font-display text-[13px] font-black uppercase tracking-wide text-(--color-navy)">
                Go live
              </span>
              <ChevronRight
                size={15}
                strokeWidth={2.5}
                className="text-(--color-navy)"
              />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
