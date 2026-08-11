"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Info,
  ChevronDown,
  Pencil,
  ChevronRight,
  X,
  Search,
  Check,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAppSelector } from "@/store/hooks";
import { selectMatchId } from "@/store/startMatch/selectors";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetMatchByIdQuery } from "@/store/api/matchApi";
import { BattingStyle, BowlingStyle } from "@/types/player";
import {
  useGetScoringStateQuery,
  useStartInningMutation,
} from "@/store/api/scoringApi";
import { S3Image } from "@/components/common/S3Image";

// ─── Types ────────────────────────────────────────────────────────────────────

type PickerRole = "striker" | "non-striker" | "bowler";

interface InningsPlayer {
  playerId: string;
  fullName: string;
  profileImageUrl?: string | null;
  isCaptain?: boolean;
  isWicketKeeper?: boolean;
  battingOrder?: number;
  battingStyle?: BattingStyle | null;
  bowlingStyle?: BowlingStyle | null;
}

type PendingStyle =
  | { kind: "batting"; player: InningsPlayer; role: "striker" | "non-striker" }
  | { kind: "bowling"; player: InningsPlayer }
  | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function roleTag(p: InningsPlayer): string {
  const t: string[] = [];
  if (p.isCaptain) t.push("C");
  if (p.isWicketKeeper) t.push("WK");
  return t.join(" · ");
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Player Avatar ────────────────────────────────────────────────────────────

function PlayerAvatar({
  player,
  size = 48,
}: {
  player: InningsPlayer | null;
  size?: number;
}) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-full border-2 border-(--color-bg-border)"
      style={{ width: size, height: size }}
    >
      {player?.profileImageUrl ? (
        <S3Image
          imageKey={player.profileImageUrl}
          alt={player.fullName}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          fallback={
            <div className="flex h-full w-full items-center justify-center rounded-full bg-(--color-navy)">
              {player.fullName.charAt(0)}
            </div>
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-(--color-navy)">
          {player ? (
            <span
              className="font-(family-name:--font-display) font-black text-white"
              style={{ fontSize: size * 0.33 }}
            >
              {initials(player.fullName)}
            </span>
          ) : (
            <Users size={size * 0.4} className="text-white/40" />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Player Selector Row ──────────────────────────────────────────────────────

function PlayerSelectorRow({
  player,
  placeholder,
  subtitle,
  onTap,
  dimmed,
}: {
  player: InningsPlayer | null;
  placeholder: string;
  subtitle?: string;
  onTap: () => void;
  dimmed?: boolean;
}) {
  return (
    <button
      onClick={onTap}
      disabled={dimmed}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border border-(--color-bg-border)",
        "bg-(--color-bg-card) px-4 py-3.5 text-left shadow-(--shadow-card)",
        "transition-all duration-150 active:scale-[0.98]",
        dimmed
          ? "cursor-not-allowed opacity-40"
          : "hover:border-(--color-sky)/40",
      )}
    >
      <PlayerAvatar player={player} size={48} />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-bold truncate",
            player
              ? "text-(--color-text-primary)"
              : "text-(--color-text-secondary)",
          )}
        >
          {player ? player.fullName : placeholder}
        </p>
        <p className="mt-0.5 text-xs font-medium truncate text-(--color-brand)">
          {player
            ? [
                roleTag(player),
                // player.battingStyle === "RIGHT_HAND_BAT"
                //   ? "Right Hand Bat"
                //   : player.battingStyle === "LEFT_HAND_BAT"
                //     ? "Left Hand Bat"
                //     : null,
                // player.bowlingStyle
                //   ? formatBowlingStyle(player.bowlingStyle)
                //   : null,
              ]
                .filter(Boolean)
                .join(" · ")
            : subtitle}
        </p>
      </div>
      <ChevronDown size={18} className="shrink-0 text-(--color-text-muted)" />
    </button>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  color = "brand",
}: {
  icon: React.ElementType;
  title: string;
  color?: "brand" | "live";
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon
        size={20}
        className={
          color === "live" ? "text-(--color-live)" : "text-(--color-brand)"
        }
      />
      <h2
        className="font-(family-name:--font-display) text-base font-black uppercase text-(--color-text-primary)"
        style={{ letterSpacing: "0.06em" }}
      >
        {title}
      </h2>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-section-label">{children}</p>;
}

function BatIcon({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 21L13 11M13 11L18 6C19.5 4.5 21 4 21 4C21 4 20.5 5.5 19 7L14 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 11L14 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="5" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

function BallIcon({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6 7.5Q12 12 18 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M6 16.5Q12 12 18 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Player Picker Bottom Sheet ───────────────────────────────────────────────

function PlayerPickerSheet({
  open,
  role,
  players,
  disabledIds,
  onPick,
  onClose,
}: {
  open: boolean;
  role: PickerRole | null;
  players: InningsPlayer[];
  disabledIds: string[];
  onPick: (player: InningsPlayer) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? players.filter((p) => p.fullName.toLowerCase().includes(q))
      : players;
  }, [players, query]);

  const title =
    role === "striker"
      ? "Select Striker"
      : role === "non-striker"
        ? "Select Non-Striker"
        : "Select Bowler";
  const hint =
    role === "bowler"
      ? "Tap a bowler from the fielding team"
      : "Tap a batsman from the batting team";

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 z-40 transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        style={{
          background: "rgba(13,27,62,0.55)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-50 flex flex-col",
          "rounded-t-3xl bg-(--color-bg-card) shadow-[0_-8px_40px_rgba(13,27,62,0.18)]",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "translate-y-0" : "translate-y-full",
        )}
        style={{ maxHeight: "72%" }}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="h-1 w-10 rounded-full bg-(--color-bg-border)" />
        </div>
        <div className="shrink-0 flex items-center justify-between border-b border-(--color-bg-border) px-5 pb-3">
          <div>
            <h3
              className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-text-primary)"
              style={{ letterSpacing: "0.04em" }}
            >
              {title}
            </h3>
            <p className="text-meta mt-0.5">{hint}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-bg-base) text-(--color-text-secondary) active:scale-90 transition-all"
          >
            <X size={16} />
          </button>
        </div>
        <div className="shrink-0 px-4 pt-3 pb-2">
          <div className="flex items-center gap-3 rounded-2xl border-2 border-(--color-bg-border) bg-(--color-bg-base) px-4 py-2.5 focus-within:border-(--color-sky) focus-within:shadow-[0_0_0_3px_rgba(75,139,255,0.10)] transition-all">
            <Search size={16} className="shrink-0 text-(--color-text-muted)" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search players..."
              className="flex-1 bg-transparent text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-none px-4 pb-4">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm italic text-(--color-text-muted)">
              No players found
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((player) => {
                const isDisabled = disabledIds.includes(player.playerId);
                const tag = roleTag(player);
                return (
                  <button
                    key={player.playerId}
                    onClick={() => !isDisabled && onPick(player)}
                    disabled={isDisabled}
                    className={cn(
                      "flex items-center gap-3.5 rounded-2xl border-2 px-4 py-3 text-left transition-all active:scale-[0.98]",
                      isDisabled
                        ? "cursor-not-allowed border-(--color-bg-border) bg-(--color-bg-base) opacity-40"
                        : "border-(--color-bg-border) bg-(--color-bg-card) hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint)",
                    )}
                  >
                    <PlayerAvatar player={player} size={44} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-(--color-text-primary) truncate">
                        {player.fullName}
                      </p>
                      {tag && (
                        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-(--color-brand)">
                          {tag}
                        </p>
                      )}
                      {player.battingOrder !== undefined && (
                        <p className="text-meta mt-0.5">
                          Batting #{player.battingOrder}
                        </p>
                      )}
                    </div>
                    {isDisabled ? (
                      <span className="flex items-center gap-1 rounded-full bg-(--color-bg-tint) px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-(--color-brand)">
                        <Check size={10} strokeWidth={3} /> Selected
                      </span>
                    ) : (
                      <ChevronRight
                        size={16}
                        className="shrink-0 text-(--color-text-muted)"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StartInningsPage() {
  const router = useRouter();
  const matchId = useAppSelector(selectMatchId);

  // const { data, isLoading } = useGetMatchByIdQuery(
  //   matchId ? { matchId } : skipToken,
  // );

  const [startInning, { isLoading: isStartingInnings }] =
    useStartInningMutation();

  const { data: matchData, isLoading: isMatchDataLoading } =
    useGetMatchByIdQuery(matchId ? { matchId } : skipToken);
  const { data: state } = useGetScoringStateQuery(matchId ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });

  // ── Derived teams & players ──────────────────────────────────────────────

  const toss = matchData?.match.toss;
  const teamA = matchData?.teams.find((t) => t.side === "TEAM_A");
  const teamB = matchData?.teams.find((t) => t.side === "TEAM_B");

  const tossWinnerName =
    toss?.wonByTeamId === teamA?.teamId
      ? (teamA?.teamNameSnapshot ?? "")
      : (teamB?.teamNameSnapshot ?? "");

  const tossDecision = toss?.decision === "BAT" ? "Bat First" : "Bowl First";

  const firstInningsBattingTeamId =
    toss?.decision === "BAT"
      ? toss?.wonByTeamId
      : toss?.wonByTeamId === teamA?.teamId
        ? teamB?.teamId
        : teamA?.teamId;

  const firstInningsBowlingTeamId =
    firstInningsBattingTeamId === teamA?.teamId ? teamB?.teamId : teamA?.teamId;

  const isSecondInnings = !!state;

  const battingTeamId = isSecondInnings
    ? firstInningsBowlingTeamId
    : firstInningsBattingTeamId;

  const bowlingTeamId = isSecondInnings
    ? firstInningsBattingTeamId
    : firstInningsBowlingTeamId;

  const battingTeamName =
    battingTeamId === teamA?.teamId
      ? (teamA?.teamNameSnapshot ?? "Batting Team")
      : (teamB?.teamNameSnapshot ?? "Batting Team");

  const battingTeamLogoUrl =
    battingTeamId === teamA?.teamId
      ? (teamA?.teamLogoSnapshot ?? null)
      : (teamB?.teamLogoSnapshot ?? null);

  const allPlayers = matchData?.players ?? [];

  const batters = useMemo(
    () =>
      allPlayers
        .filter((p) => p.teamId === battingTeamId && p.isPlayingXi)
        .sort((a, b) => a.battingOrder - b.battingOrder)
        .map((p) => ({
          playerId: p.playerId,
          fullName: p.playerNameSnapshot,
          isCaptain: p.isCaptain,
          isWicketKeeper: p.isWicketKeeper,
          battingOrder: p.battingOrder,
        })),
    [allPlayers, battingTeamId],
  );

  const bowlingPlayers: InningsPlayer[] = useMemo(
    () =>
      allPlayers
        .filter((p) => p.teamId === bowlingTeamId && p.isPlayingXi)
        .map((p) => ({
          playerId: p.playerId,
          fullName: p.playerNameSnapshot,
          isCaptain: p.isCaptain,
          isWicketKeeper: p.isWicketKeeper,
          battingOrder: p.battingOrder,
        })),
    [allPlayers, bowlingTeamId],
  );

  // ── Selection state ──────────────────────────────────────────────────────

  const [striker, setStriker] = useState<InningsPlayer | null>(null);
  const [nonStriker, setNonStriker] = useState<InningsPlayer | null>(null);
  const [bowler, setBowler] = useState<InningsPlayer | null>(null);

  const [openRole, setOpenRole] = useState<PickerRole | null>(null);
  // const [pendingStyle, setPendingStyle] = useState<PendingStyle>(null);

  const canStart = striker !== null && nonStriker !== null && bowler !== null;
  const disabledBatterIds = [striker?.playerId, nonStriker?.playerId].filter(
    Boolean,
  ) as string[];

  // ── KEY FIX: batch both state updates together ───────────────────────────
  // React 18 batches these in the same render, so pendingStyle is truthy
  // in the very same commit that openRole becomes null.
  // This means the style dialog mounts at the same time the sheet slides out —
  // no render gap, no missing dialog.
  function handlePick(player: InningsPlayer) {
    if (openRole === "striker") {
      setStriker(player);
      setOpenRole(null);
    }
    // setPendingStyle({ kind: "batting", player, role: openRole }); // ← first
    if (openRole === "non-striker") {
      setNonStriker(player);
      setOpenRole(null);
      // setPendingStyle({ kind: "batting", player, role: openRole }); // ← first
    } else if (openRole === "bowler") {
      setBowler(player);
      setOpenRole(null);
      // setPendingStyle({ kind: "bowling", player });
    }
  }

  // function handleBattingStyleConfirm(style: BattingStyle) {
  //   if (!pendingStyle || pendingStyle.kind !== "batting") return;
  //   const withStyle = { ...pendingStyle.player, battingStyle: style };
  //   if (pendingStyle.role === "striker") setStriker(withStyle);
  //   if (pendingStyle.role === "non-striker") setNonStriker(withStyle);
  //   setPendingStyle(null);
  // }

  // function handleBowlingStyleConfirm(style: BowlingStyle) {
  //   if (!pendingStyle || pendingStyle.kind !== "bowling") return;
  //   setBowler({ ...pendingStyle.player, bowlingStyle: style });
  //   setPendingStyle(null);
  // }

  // function handleStyleCancel() {
  //   setPendingStyle(null); // discard; player not committed
  // }

  const handleStartScroing = async () => {
    if (
      !matchId ||
      !battingTeamId ||
      !bowlingTeamId ||
      !striker ||
      !nonStriker ||
      !bowler
    ) {
      return;
    }
    try {
      const response = await startInning({
        matchId,
        inningsNumber: isSecondInnings ? 2 : 1,
        battingTeamId: battingTeamId,
        bowlingTeamId: bowlingTeamId,
        strikerId: striker.playerId,
        nonStrikerId: nonStriker.playerId,
        bowlerId: bowler?.playerId,
      }).unwrap();

      router.push("/scoring");
    } catch (error) {
      console.error(error);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="relative flex min-h-full flex-col bg-(--color-bg-base)">
      {isSecondInnings && state && (
        <div className="overflow-hidden bg-(--color-navy)/90 px-5 py-2 shadow-[0_8px_32px_rgba(27,63,160,0.30)]">
          <div className="whitespace-nowrap animate-marquee">
            <span className="text-sm font-medium text-(--color-text-inverse)">
              Target: {state.score} in {state.oversText} ({state.runRateSummary}
              )
            </span>
          </div>
        </div>
      )}
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="flex flex-col gap-5 p-4">
          {/* Hero card */}
          <div className="relative overflow-hidden rounded-3xl bg-(--color-brand) px-5 py-6 shadow-[0_8px_32px_rgba(27,63,160,0.30)]">
            {/* Radial highlight */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.10]"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 30%, white 0%, transparent 70%)",
              }}
            />

            {/* Team logo background — ghosted behind everything */}
            {battingTeamLogoUrl && (
              <span className="pointer-events-none absolute inset-0 z-0">
                <S3Image
                  imageKey={battingTeamLogoUrl}
                  alt={battingTeamName}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover opacity-[0.08]"
                  fallback={null}
                />
              </span>
            )}

            {/* Team logo avatar circle */}
            <div className="relative z-10 mb-3 flex justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white/15 ring-4 ring-white/10">
                <S3Image
                  imageKey={battingTeamLogoUrl}
                  alt={battingTeamName}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  fallback={<Users size={32} className="text-white/80" />}
                />
              </div>
            </div>

            {/* Team name */}
            <div className="relative z-10 text-center">
              <p className="font-(family-name:--font-display) text-[10px] font-bold uppercase tracking-[0.16em] text-(--color-sky)">
                Now Batting
              </p>
              <h1
                className="mt-1 font-(family-name:--font-display) text-3xl font-black uppercase text-white"
                style={{ letterSpacing: "0.04em", lineHeight: 1.05 }}
              >
                {isMatchDataLoading ? (
                  <span className="inline-block h-8 w-48 animate-pulse rounded-lg bg-white/20" />
                ) : (
                  battingTeamName
                )}
              </h1>
            </div>

            {/* Toss info */}
            {tossWinnerName && !isMatchDataLoading && (
              <div className="relative z-10 mt-4 flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-3">
                <Info size={16} className="mt-0.5 shrink-0 text-white/70" />
                <p className="text-sm font-medium leading-snug text-white/80">
                  <span className="font-bold text-white">{tossWinnerName}</span>{" "}
                  won the toss and elected to{" "}
                  <span className="font-bold text-(--color-sky)">
                    {tossDecision}
                  </span>
                  .
                </p>
              </div>
            )}
          </div>

          {/* Opening Pair */}
          <div className="flex flex-col gap-3">
            <SectionHeader icon={BatIcon} title="Opening Pair" />
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Striker</FieldLabel>
              <PlayerSelectorRow
                player={striker}
                placeholder="Select Striker"
                // subtitle="Tap to choose batsman"
                onTap={() => setOpenRole("striker")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Non-Striker</FieldLabel>
              <PlayerSelectorRow
                player={nonStriker}
                placeholder="Select Non-Striker"
                // subtitle="Tap to choose batsman"
                onTap={() => setOpenRole("non-striker")}
                dimmed={!striker}
              />
            </div>
          </div>

          {/* Opening Bowler */}
          <div className="flex flex-col gap-3">
            <SectionHeader
              icon={BallIcon}
              title="Opening Bowler"
              color="live"
            />
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Opening Bowler</FieldLabel>
              <PlayerSelectorRow
                player={bowler}
                placeholder="Select Bowler"
                // subtitle="Tap to choose bowler"
                onTap={() => setOpenRole("bowler")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="safe-bottom shrink-0 flex border-t border-(--color-bg-border) bg-(--color-bg-card)">
        <button
          onClick={() =>
            router.push(`/start-match/match-rules?matchId=${matchId}`)
          }
          className="flex flex-1 items-center justify-center gap-2 py-4 font-(family-name:--font-display) text-xs font-black uppercase tracking-[0.06em] text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
        >
          <Pencil size={13} /> Match Rules
        </button>
        <div className="h-8 w-px self-center bg-(--color-bg-border)" />
        <button
          onClick={() => canStart && handleStartScroing()}
          disabled={!canStart}
          className={cn(
            "flex flex-2 items-center justify-center gap-2 py-4",
            "font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em] text-white transition-all active:scale-[0.97]",
            canStart
              ? "bg-(--color-brand) shadow-[0_-2px_12px_rgba(27,63,160,0.20)]"
              : "bg-(--color-bg-border) text-(--color-text-muted) cursor-not-allowed",
          )}
        >
          Start Scoring <ChevronRight size={16} />
        </button>
      </div>

      {/* Player Picker Sheet */}
      <PlayerPickerSheet
        open={openRole !== null}
        role={openRole}
        players={openRole === "bowler" ? bowlingPlayers : batters}
        disabledIds={openRole === "bowler" ? [] : disabledBatterIds}
        onPick={handlePick}
        onClose={() => setOpenRole(null)}
      />

      {/* {pendingStyle?.kind === "batting" && (
        <BattingStyleDialog
          playerName={pendingStyle.player.fullName}
          onConfirm={handleBattingStyleConfirm}
          onCancel={handleStyleCancel}
        />
      )}
      {pendingStyle?.kind === "bowling" && (
        <BowlingStyleDialog
          playerName={pendingStyle.player.fullName}
          onConfirm={handleBowlingStyleConfirm}
          onCancel={handleStyleCancel}
        />
      )} */}
    </div>
  );
}
