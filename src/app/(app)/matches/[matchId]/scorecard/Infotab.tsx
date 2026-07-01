"use client";

import { ScorecardResponse } from "@/types/scorecard";

type Props = {
  matchId: string;
  initialScorecard?: ScorecardResponse | null;
};

// ── Type cast helpers — reads loosely typed match fields safely ────────
type MatchExtended = NonNullable<ScorecardResponse["match"]> & {
  tournamentName?: string | null;
  matchType?: string | null;
  totalOvers?: number | string | null;
  scheduledAt?: string | null;
  startedAt?: string | null;
  toss?: {
    winnerTeamName?: string | null;
    decision?: string | null;
  } | null;
  ballType?: string | null;
  matchId?: string | null;
  notes?: MatchNote[] | null;
  status?: string | null;
};

type MatchNote = {
  title?: string | null;
  body?: string | null;
  createdAt?: string | null;
};

function formatDateTime(iso?: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

function capitalize(str?: string | null): string {
  if (!str) return "—";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ── Sub-components ─────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-(--color-bg-border) py-3 last:border-b-0">
      <span className="shrink-0 text-[13px] text-(--color-text-muted) w-28">
        {label}
      </span>
      <span
        className={`text-right text-[13px] font-medium flex-1 ${
          accent ? "text-(--color-brand)" : "text-(--color-text-body)"
        }`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="bg-(--color-bg-base) px-4 py-2">
      <p className="text-section-label">{label}</p>
    </div>
  );
}

// ── Main InfoTab ───────────────────────────────────────────────────────
export default function InfoTab({ initialScorecard }: Props) {
  const match = initialScorecard?.match as MatchExtended | undefined;

  if (!match) {
    return (
      <div className="mt-8 rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) mx-3 px-4 py-6 text-center shadow-(--shadow-card)">
        <p className="text-body text-(--color-text-secondary)">
          Match info not available yet.
        </p>
      </div>
    );
  }

  const dateValue = match.startedAt ?? match.scheduledAt;
  const venueText = match.venue
    ? [match.venue.groundName, match.venue.city].filter(Boolean).join(", ")
    : null;

  const winnerTeamName =
    match.toss?.wonByTeamId === match.teamA.teamId
      ? match.teamA.teamNameSnapshot
      : match.toss?.wonByTeamId === match.teamB.teamId
        ? match.teamB.teamNameSnapshot
        : null;
  const tossText =
    winnerTeamName && match.toss?.decision
      ? `${winnerTeamName} opted to ${capitalize(match.toss.decision)}`
      : winnerTeamName
        ? winnerTeamName
        : null;

  const notes: MatchNote[] = match.notes ?? [];

  return (
    <div className="flex flex-col pb-6">
      {/* ── Info section ─────────────────────────────────────── */}
      <SectionHeader label="Info" />

      <div className="bg-(--color-bg-card) border-b border-(--color-bg-border) px-4">
        {match.tournamentName && (
          <InfoRow label="Tournament" value={match.tournamentName} />
        )}

        {match.matchType && (
          <InfoRow label="Match type" value={capitalize(match.matchType)} />
        )}

        {match.totalOvers != null && (
          <InfoRow label="Overs" value={String(match.totalOvers)} />
        )}

        {dateValue && (
          <InfoRow label="Date & time" value={formatDateTime(dateValue)} />
        )}

        {venueText && <InfoRow label="Venue" value={venueText} accent />}

        {tossText && <InfoRow label="Toss" value={tossText} />}

        {match.ballType && (
          <InfoRow label="Ball type" value={match.ballType.toUpperCase()} />
        )}

        {/* {(match.matchId ?? (match as unknown as { id?: string }).id) && (
          <InfoRow
            label="Match ID"
            value={String(
              match.matchId ?? (match as unknown as { id?: string }).id,
            )}
          />
        )} */}

        {match.status && match.status !== "COMPLETED" && (
          <InfoRow label="Status" value={capitalize(match.status)} />
        )}
      </div>

      {/* ── Teams section ─────────────────────────────────────── */}
      {(match.teamA || match.teamB) && (
        <>
          <SectionHeader label="Teams" />
          <div className="bg-(--color-bg-card) border-b border-(--color-bg-border) px-4">
            {match.teamA?.teamNameSnapshot && (
              <InfoRow label="Team A" value={match.teamA.teamNameSnapshot} />
            )}
            {match.teamB?.teamNameSnapshot && (
              <InfoRow label="Team B" value={match.teamB.teamNameSnapshot} />
            )}
          </div>
        </>
      )}

      {/* ── Match Notes section ───────────────────────────────── */}
      {notes.length > 0 && (
        <>
          <SectionHeader label="Match notes" />
          <div className="flex flex-col gap-3 bg-(--color-bg-card) px-4 py-3">
            {notes.map((note, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                {note.title && (
                  <p className="text-[13px] font-bold text-(--color-navy)">
                    {note.title}
                  </p>
                )}
                {note.body && (
                  <p className="text-[13px] text-(--color-text-body) leading-relaxed">
                    {note.body}
                  </p>
                )}
                {note.createdAt && (
                  <p className="text-meta">{formatDateTime(note.createdAt)}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
