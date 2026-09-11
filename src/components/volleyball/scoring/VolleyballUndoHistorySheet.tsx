"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/common/Button";
import { DialogBottom } from "@/components/common/DialogBottom";
import { cn } from "@/lib/cn";
import {
  getTeamColorAccentTextColor,
  getTeamColorIndicatorStyles,
  resolveVolleyballTeamColor,
  VOLLEYBALL_TEAM_A_FALLBACK_COLOR,
  VOLLEYBALL_TEAM_B_FALLBACK_COLOR,
  withHexAlpha,
} from "@/lib/volleyball/teamColors";
import { useGetVolleyballScoringHistoryQuery } from "@/store/api/volleyball/volleyballMatchApi";
import type { VolleyballScoringHistoryItem } from "@/types/volleyball/history";
import type { VolleyballMatch } from "@/types/volleyball/match";
import type { VolleyballSet } from "@/types/volleyball/set";

type Props = {
  open: boolean;
  match: VolleyballMatch;
  liveSet: VolleyballSet;
  loading: boolean;
  error: string;
  resetKey: number;
  onClose: () => void;
  onUndo: (throughEventId?: string) => void;
};

export function VolleyballUndoHistorySheet({ open, match, liveSet, loading, error, resetKey, onClose, onUndo }: Props) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [quickUndoSelected, setQuickUndoSelected] = useState(false);
  const { data, isLoading, isFetching, isError, refetch } = useGetVolleyballScoringHistoryQuery(
    { matchId: match.id, limit: 30, skip: 0 },
    { skip: !open, refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    setSelectedEventId(null);
    setQuickUndoSelected(false);
    if (resetKey > 0 && open) void refetch();
  }, [open, refetch, resetKey]);

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const selectedIndex = items.findIndex((item) => item.eventId === selectedEventId);
  const selectedItem = selectedIndex >= 0 ? items[selectedIndex] : null;
  const affectedItems = useMemo(
    () => (selectedIndex >= 0 ? items.slice(0, selectedIndex + 1) : []),
    [items, selectedIndex],
  );
  const countIsCertain = affectedItems.length > 0 && affectedItems.every((item) => item.reversible);
  const teamAColor = resolveVolleyballTeamColor(match.teamASnapshot.teamColor, VOLLEYBALL_TEAM_A_FALLBACK_COLOR);
  const teamBColor = resolveVolleyballTeamColor(match.teamBSnapshot.teamColor, VOLLEYBALL_TEAM_B_FALLBACK_COLOR);

  return (
    <DialogBottom open={open} onClose={onClose} className="h-[88dvh] max-h-[88dvh] overflow-hidden rounded-t-3xl bg-(--color-bg-card)">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-(--color-bg-border) px-4 py-3">
          <div className="min-w-0">
            <h2 className="text-lg font-black">Score correction</h2>
            <p className="mt-0.5 truncate text-[10px] font-semibold text-(--color-text-muted)">Choose where the match should return to.</p>
          </div>
          <button type="button" disabled={loading} onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-base)">
            <X size={18} />
          </button>
        </div>

        <div className="shrink-0 border-b border-(--color-bg-border) bg-(--color-bg-base) p-3">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.16em] text-(--color-text-muted)">Set {liveSet.setNumber}</p>
          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) px-3 py-3 shadow-sm">
            <TeamScore name={match.teamASnapshot.name} points={liveSet.teamAPoints} color={teamAColor} />
            <span className="text-sm font-black text-(--color-text-muted)">–</span>
            <TeamScore right name={match.teamBSnapshot.name} points={liveSet.teamBPoints} color={teamBColor} />
          </div>
          <button
            type="button"
            disabled={loading || isLoading || items.length === 0}
            onClick={() => { setSelectedEventId(null); setQuickUndoSelected(true); }}
            className={cn(
              "mt-2 flex w-full items-center gap-3 rounded-2xl border bg-(--color-bg-card) p-3 text-left",
              quickUndoSelected ? "border-(--color-primary)" : "border-(--color-bg-border)",
              (loading || isLoading || items.length === 0) && "opacity-50",
            )}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-primary)/10 text-(--color-primary)"><RotateCcw size={16} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-black">Undo last action</span>
              <span className="mt-0.5 block text-[10px] leading-4 text-(--color-text-muted)">Returns to the state before the latest scoring action.</span>
            </span>
            {quickUndoSelected && <Check size={17} className="shrink-0 text-(--color-primary)" />}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-(--color-bg-base) p-3 scrollbar-hide">
          <p className="text-section-label">Go back to</p>
          {error && <div className="mt-2 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 p-3 text-xs font-semibold text-(--color-live)">{error}</div>}
          {(isLoading || isFetching) && <HistorySkeleton />}
          {!isLoading && !isFetching && isError && <div className="mt-2 rounded-xl bg-(--color-bg-card) p-4 text-center text-xs text-(--color-live)">Unable to load scoring history.</div>}
          {!isLoading && !isFetching && !isError && items.length === 0 && <div className="mt-2 rounded-2xl border border-dashed border-(--color-bg-border) bg-(--color-bg-card) p-6 text-center text-sm font-bold">Nothing to correct yet.</div>}
          {!isLoading && !isFetching && !isError && items.length > 0 && (
            <div className="mt-2 space-y-2">
              {items.map((item) => (
                <HistoryRow
                  key={item.eventId}
                  item={item}
                  selected={item.eventId === selectedEventId}
                  disabled={loading || !item.reversible}
                  teamAId={match.teamAId}
                  teamBId={match.teamBId}
                  teamAColor={teamAColor}
                  teamBColor={teamBColor}
                  teamAName={match.teamASnapshot.name}
                  teamBName={match.teamBSnapshot.name}
                  onClick={() => { setQuickUndoSelected(false); setSelectedEventId(item.eventId); }}
                />
              ))}
            </div>
          )}
        </div>

        {(quickUndoSelected || selectedItem) && (
          <div className="safe-bottom shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card) p-3">
            <p className="text-xs font-black">{quickUndoSelected ? "Return before the latest action?" : "Return to before:"}</p>
            <p className="mt-1 text-[10px] leading-4 text-(--color-text-muted)">
              {quickUndoSelected ? "The latest scoring action will be reverted." : `“${selectedItem?.description}”`}
            </p>
            {!quickUndoSelected && selectedItem && (
              <p className="mt-1 text-[10px] leading-4 text-(--color-text-muted)">
                {countIsCertain ? `This will undo ${affectedItems.length} ${affectedItems.length === 1 ? "action" : "actions"}.` : "This will undo this action and everything after it."}
              </p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" disabled={loading} onClick={() => { setSelectedEventId(null); setQuickUndoSelected(false); }}>Cancel</Button>
              <Button loading={loading} disabled={loading} onClick={() => onUndo(quickUndoSelected ? undefined : selectedItem?.eventId)}>
                {loading ? "Correcting…" : "Confirm correction"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DialogBottom>
  );
}

function TeamScore({ name, points, color, right = false }: { name: string; points: number; color: string; right?: boolean }) {
  return (
    <div className={cn("min-w-0", right && "text-right")}>
      <div className={cn("flex items-center gap-1.5", right && "justify-end")}>
        {!right && <span className="h-2 w-2 shrink-0 rounded-full border" style={getTeamColorIndicatorStyles(color)} />}
        <p className="line-clamp-2 text-[10px] font-bold leading-tight">{name}</p>
        {right && <span className="h-2 w-2 shrink-0 rounded-full border" style={getTeamColorIndicatorStyles(color)} />}
      </div>
      <p className="mt-1 border-b-2 pb-1 font-(family-name:--font-display) text-3xl font-black" style={{ borderColor: color }}>{points}</p>
    </div>
  );
}

type HistoryRowProps = {
  item: VolleyballScoringHistoryItem;
  selected: boolean;
  disabled: boolean;
  teamAId: string;
  teamBId: string;
  teamAColor: string;
  teamBColor: string;
  teamAName: string;
  teamBName: string;
  onClick: () => void;
};

function HistoryRow({ item, selected, disabled, teamAId, teamBId, teamAColor, teamBColor, teamAName, teamBName, onClick }: HistoryRowProps) {
  const servingColor = item.servingTeamIdAfter === teamAId ? teamAColor : item.servingTeamIdAfter === teamBId ? teamBColor : undefined;
  const servingTeamName = item.servingTeamIdAfter === teamAId ? teamAName : item.servingTeamIdAfter === teamBId ? teamBName : null;
  const accentColor = servingColor ?? teamAColor;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn("flex w-full min-w-0 items-center gap-3 rounded-2xl border bg-(--color-bg-card) p-3 text-left shadow-sm", !selected && "border-(--color-bg-border)", disabled && "opacity-50")}
      style={selected ? { borderColor: accentColor, backgroundColor: withHexAlpha(accentColor, "12") } : undefined}
    >
      <div className="flex w-14 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-base) py-2 font-(family-name:--font-display) text-base font-black">
        {item.scoreAfter ? `${item.scoreAfter.teamAPoints}–${item.scoreAfter.teamBPoints}` : "—"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold leading-4 text-(--color-text-primary)">{item.description}</p>
        <p className="mt-1 break-words text-[9px] text-(--color-text-muted)">
          {formatRelativeTime(item.createdAt)}{servingTeamName ? ` · Serving after: ${servingTeamName}` : ""}
        </p>
      </div>
      {selected ? <Check size={17} className="shrink-0" style={{ color: getTeamColorAccentTextColor(accentColor) }} /> : <span className="h-3 w-3 shrink-0 rounded-full border-2" style={servingColor ? getTeamColorIndicatorStyles(servingColor) : { borderColor: "#CBD5E1" }} />}
    </button>
  );
}

function formatRelativeTime(createdAt: string) {
  const timestamp = new Date(createdAt).getTime();
  if (Number.isNaN(timestamp)) return "";
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (elapsedSeconds < 60) return "a few seconds ago";
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  if (elapsedMinutes < 24 * 60) return `${Math.floor(elapsedMinutes / 60)}h ago`;
  return new Date(createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function HistorySkeleton() {
  return <div className="mt-2 space-y-2">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-[70px] animate-pulse rounded-2xl bg-(--color-bg-card)" />)}</div>;
}
