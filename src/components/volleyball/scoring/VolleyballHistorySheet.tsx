"use client";

import { ArrowRightLeft, RotateCcw, Shield, Trophy, X } from "lucide-react";

import { DialogBottom } from "@/components/common/DialogBottom";
import { cn } from "@/lib/cn";

import { useGetVolleyballMatchHistoryQuery } from "@/store/api/volleyball/volleyballMatchApi";

import type { VolleyballMatch } from "@/types/volleyball/match";
import type { VolleyballHistoryEvent } from "@/types/volleyball/history";

type Props = {
  open: boolean;
  match: VolleyballMatch;
  onClose: () => void;
};

export function VolleyballHistorySheet({ open, match, onClose }: Props) {
  const { data, isLoading, isError } = useGetVolleyballMatchHistoryQuery(
    {
      matchId: match.id,
      limit: 50,
      includeRevoked: false,
    },
    {
      skip: !open,
    },
  );

  const events = data?.events ?? [];

  const groupedEvents = groupEventsBySet(events);

  return (
    <DialogBottom
      open={open}
      onClose={onClose}
      className="h-[88dvh] max-h-[88dvh] overflow-hidden rounded-t-3xl bg-(--color-bg-card)"
    >
      <div className="flex h-full min-h-0 flex-col bg-(--color-bg-base)">
        {/* HEADER */}

        <div className="flex shrink-0 items-center justify-between border-b border-(--color-bg-border) bg-(--color-bg-card) px-4 py-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-(--color-text-muted)">
              Match timeline
            </p>

            <h2 className="mt-0.5 text-lg font-black text-(--color-text-primary)">
              History
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-bg-base) text-(--color-text-secondary)"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
          {isLoading && <HistorySkeleton />}

          {isError && (
            <div className="m-3 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-3">
              <p className="text-xs font-semibold text-(--color-live)">
                Unable to load history.
              </p>
            </div>
          )}

          {!isLoading && !isError && events.length === 0 && (
            <div className="m-3 rounded-2xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) p-6 text-center">
              <p className="text-sm font-bold text-(--color-text-primary)">
                No match events yet
              </p>

              <p className="mt-1 text-xs text-(--color-text-muted)">
                Points, substitutions and other match actions will appear here.
              </p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            groupedEvents.map(({ setNumber, events: setEvents }) => (
              <HistorySetSection
                key={setNumber}
                setNumber={setNumber}
                events={setEvents}
                match={match}
              />
            ))}
        </div>
      </div>
    </DialogBottom>
  );
}

/* =========================================================
   SET GROUPING
========================================================= */

function groupEventsBySet(events: VolleyballHistoryEvent[]) {
  const map = new Map<number, VolleyballHistoryEvent[]>();

  /*
   * Oldest → newest inside each set,
   * like VolleyStation.
   */
  const sorted = [...events].sort(
    (a, b) => a.sequenceNumber - b.sequenceNumber,
  );

  for (const event of sorted) {
    const setNumber = event.setNumber ?? 0;

    const existing = map.get(setNumber) ?? [];

    existing.push(event);

    map.set(setNumber, existing);
  }

  return Array.from(map.entries()).map(([setNumber, setEvents]) => ({
    setNumber,
    events: setEvents,
  }));
}

/* =========================================================
   SET SECTION
========================================================= */

function HistorySetSection({
  setNumber,
  events,
  match,
}: {
  setNumber: number;
  events: VolleyballHistoryEvent[];
  match: VolleyballMatch;
}) {
  const lastScore = [...events]
    .reverse()
    .find((event) => event.scoreAfter)?.scoreAfter;

  return (
    <section>
      {/* SET HEADER */}

      <div className="sticky top-0 z-10 border-b border-(--color-bg-border) bg-(--color-bg-base)/95 px-3 py-2 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.12em] text-(--color-text-primary)">
              Set {setNumber}
            </span>

            <span className="rounded-full bg-(--color-bg-tint) px-2 py-0.5 text-[9px] font-black text-(--color-brand)">
              {events.length} events
            </span>
          </div>

          {lastScore && (
            <div className="flex items-center gap-1 font-(family-name:--font-display) text-sm font-black text-(--color-text-primary)">
              <span>{lastScore.teamAPoints}</span>

              <span className="text-(--color-text-muted)">:</span>

              <span>{lastScore.teamBPoints}</span>
            </div>
          )}
        </div>
      </div>

      {/* EVENTS */}

      <div className="divide-y divide-(--color-bg-border) bg-(--color-bg-card)">
        {events.map((event) => (
          <HistoryEventRow key={event.id} event={event} match={match} />
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   EVENT ROW
========================================================= */

function HistoryEventRow({
  event,
  match,
}: {
  event: VolleyballHistoryEvent;
  match: VolleyballMatch;
}) {
  const time = new Date(event.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (event.eventType === "RALLY" && event.rally) {
    return <RallyRow event={event} match={match} time={time} />;
  }

  if (event.eventType === "SUBSTITUTION" && event.substitution) {
    return <SubstitutionRow event={event} match={match} time={time} />;
  }

  if (event.eventType === "LIBERO_REPLACEMENT" && event.liberoReplacement) {
    return <LiberoRow event={event} match={match} time={time} />;
  }

  if (event.eventType === "UNDO") {
    return <UndoRow event={event} time={time} />;
  }

  return null;
}

/* =========================================================
   RALLY
========================================================= */

function RallyRow({
  event,
  match,
  time,
}: {
  event: VolleyballHistoryEvent;
  match: VolleyballMatch;
  time: string;
}) {
  if (!event.rally) {
    return null;
  }

  const isTeamA = event.rally.winningTeamId === match.teamAId;

  const teamName = isTeamA
    ? (match.teamASnapshot.shortName ?? match.teamASnapshot.name)
    : (match.teamBSnapshot.shortName ?? match.teamBSnapshot.name);

  const player = findPlayer(match, event.rally.creditedPlayerId);

  const pointType = formatEventLabel(event.rally.pointType);

  return (
    <div className="grid min-h-[58px] grid-cols-[62px_1fr_auto] items-center gap-2 px-2 py-1.5">
      <HistoryScore score={event.scoreAfter} highlight={isTeamA ? "A" : "B"} />

      <div className="flex min-w-0 items-center gap-2">
        <EventIcon type="POINT" side={isTeamA ? "A" : "B"} />

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "text-[9px] font-black uppercase tracking-wide",
                isTeamA ? "text-[#d97706]" : "text-[#dc2626]",
              )}
            >
              Point
            </span>

            {event.rally.isSideOut && (
              <span className="rounded bg-(--color-bg-base) px-1.5 py-0.5 text-[8px] font-bold text-(--color-text-muted)">
                Side-out
              </span>
            )}
          </div>

          <p className="truncate text-xs font-bold text-(--color-text-primary)">
            {teamName}
          </p>

          <p className="truncate text-[9px] text-(--color-text-muted)">
            {pointType}

            {player ? ` · ${player.playerNameSnapshot}` : ""}

            {event.rally.causedRotation ? " · Rotation" : ""}
          </p>
        </div>
      </div>

      <div className="self-start pt-1 text-[9px] text-(--color-text-muted)">
        {time}
      </div>
    </div>
  );
}

/* =========================================================
   SUBSTITUTION
========================================================= */

function SubstitutionRow({
  event,
  match,
  time,
}: {
  event: VolleyballHistoryEvent;
  match: VolleyballMatch;
  time: string;
}) {
  if (!event.substitution) {
    return null;
  }

  const outgoing = findPlayer(match, event.substitution.outgoingPlayerId);

  const incoming = findPlayer(match, event.substitution.incomingPlayerId);

  const isTeamA = event.substitution.teamId === match.teamAId;

  return (
    <div className="grid min-h-[56px] grid-cols-[62px_1fr_auto] items-center gap-2 px-2 py-1.5">
      <HistoryScore score={event.scoreAfter} highlight={isTeamA ? "A" : "B"} />

      <div className="flex min-w-0 items-center gap-2">
        <EventIcon type="SUB" side={isTeamA ? "A" : "B"} />

        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-wide text-(--color-brand)">
            Substitution
          </p>

          <p className="truncate text-xs font-bold text-(--color-text-primary)">
            {outgoing?.playerNameSnapshot ?? "Player"}
            {" → "}
            {incoming?.playerNameSnapshot ?? "Player"}
          </p>

          <p className="text-[9px] text-(--color-text-muted)">
            Position {event.substitution.rotationPosition}
          </p>
        </div>
      </div>

      <span className="self-start pt-1 text-[9px] text-(--color-text-muted)">
        {time}
      </span>
    </div>
  );
}

/* =========================================================
   LIBERO
========================================================= */

function LiberoRow({
  event,
  match,
  time,
}: {
  event: VolleyballHistoryEvent;
  match: VolleyballMatch;
  time: string;
}) {
  if (!event.liberoReplacement) {
    return null;
  }

  const outgoing = findPlayer(match, event.liberoReplacement.outgoingPlayerId);

  const incoming = findPlayer(match, event.liberoReplacement.incomingPlayerId);

  const isTeamA = event.liberoReplacement.teamId === match.teamAId;

  return (
    <div className="grid min-h-[56px] grid-cols-[62px_1fr_auto] items-center gap-2 px-2 py-1.5">
      <HistoryScore score={event.scoreAfter} highlight={isTeamA ? "A" : "B"} />

      <div className="flex min-w-0 items-center gap-2">
        <EventIcon type="LIBERO" side={isTeamA ? "A" : "B"} />

        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-wide text-(--color-brand)">
            Libero
          </p>

          <p className="truncate text-xs font-bold text-(--color-text-primary)">
            {outgoing?.playerNameSnapshot ?? "Player"}
            {" → "}
            {incoming?.playerNameSnapshot ?? "Player"}
          </p>

          <p className="text-[9px] text-(--color-text-muted)">
            Position {event.liberoReplacement.rotationPosition}
          </p>
        </div>
      </div>

      <span className="self-start pt-1 text-[9px] text-(--color-text-muted)">
        {time}
      </span>
    </div>
  );
}

/* =========================================================
   UNDO
========================================================= */

function UndoRow({
  event,
  time,
}: {
  event: VolleyballHistoryEvent;
  time: string;
}) {
  return (
    <div className="grid min-h-[50px] grid-cols-[62px_1fr_auto] items-center gap-2 bg-(--color-bg-tint)/50 px-2 py-1.5">
      <HistoryScore score={event.scoreAfter} />

      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--color-bg-card) text-(--color-brand)">
          <RotateCcw size={14} />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-wide text-(--color-brand)">
            Undo
          </p>

          <p className="truncate text-xs font-bold text-(--color-text-primary)">
            Previous action undone
          </p>
        </div>
      </div>

      <span className="self-start pt-1 text-[9px] text-(--color-text-muted)">
        {time}
      </span>
    </div>
  );
}

/* =========================================================
   SCORE BOX
========================================================= */

function HistoryScore({
  score,
  highlight,
}: {
  score?: {
    teamAPoints: number;
    teamBPoints: number;
  } | null;

  highlight?: "A" | "B";
}) {
  if (!score) {
    return (
      <div className="flex h-9 w-[58px] items-center justify-center rounded-lg bg-(--color-bg-base)">
        <span className="text-[10px] font-bold text-(--color-text-muted)">
          —
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-9 w-[58px] items-center justify-center gap-1">
      <ScoreNumber
        value={score.teamAPoints}
        active={highlight === "A"}
        side="A"
      />

      <span className="text-[10px] font-black text-(--color-text-muted)">
        :
      </span>

      <ScoreNumber
        value={score.teamBPoints}
        active={highlight === "B"}
        side="B"
      />
    </div>
  );
}

function ScoreNumber({
  value,
  active,
  side,
}: {
  value: number;
  active: boolean;
  side: "A" | "B";
}) {
  return (
    <span
      className={cn(
        "flex h-8 min-w-6 items-center justify-center rounded-md bg-(--color-bg-base) px-1 font-(family-name:--font-display) text-sm font-black text-(--color-text-primary)",
        active && side === "A" && "border-b-2 border-[#f59e0b]",
        active && side === "B" && "border-b-2 border-[#ef3b2d]",
      )}
    >
      {value}
    </span>
  );
}

/* =========================================================
   EVENT ICON
========================================================= */

function EventIcon({
  type,
  side,
}: {
  type: "POINT" | "SUB" | "LIBERO";

  side: "A" | "B";
}) {
  const common = cn(
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
    side === "A" ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600",
  );

  if (type === "POINT") {
    return (
      <div className={common}>
        <Trophy size={14} />
      </div>
    );
  }

  if (type === "SUB") {
    return (
      <div className={common}>
        <ArrowRightLeft size={14} />
      </div>
    );
  }

  return (
    <div className={common}>
      <Shield size={14} />
    </div>
  );
}

/* =========================================================
   PLAYER LOOKUP
========================================================= */

function findPlayer(match: VolleyballMatch, playerId?: string | null) {
  if (!playerId) {
    return undefined;
  }

  const players = [
    ...(match.teamARoster?.players ?? []),
    ...(match.teamBRoster?.players ?? []),
  ];

  return players.find((player) => player.playerId === playerId);
}

function formatEventLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

/* =========================================================
   LOADING
========================================================= */

function HistorySkeleton() {
  return (
    <div>
      <div className="h-9 animate-pulse border-b border-(--color-bg-border) bg-(--color-bg-card)" />

      <div className="divide-y divide-(--color-bg-border)">
        {Array.from({
          length: 8,
        }).map((_, index) => (
          <div
            key={index}
            className="flex h-[58px] items-center gap-2 bg-(--color-bg-card) px-2"
          >
            <div className="h-8 w-14 animate-pulse rounded-lg bg-(--color-bg-base)" />

            <div className="h-7 w-7 animate-pulse rounded-lg bg-(--color-bg-base)" />

            <div className="flex-1 space-y-1">
              <div className="h-2.5 w-16 animate-pulse rounded bg-(--color-bg-base)" />
              <div className="h-3 w-32 animate-pulse rounded bg-(--color-bg-base)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
