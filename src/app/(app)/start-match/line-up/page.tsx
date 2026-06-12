// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Pencil, UserPlus } from "lucide-react";
// import { cn } from "@/lib/cn";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import {
//   selectTeamA,
//   selectTeamB,
//   selectTeamACaptain,
//   selectTeamAKeeper,
//   selectTeamBCaptain,
//   selectTeamBKeeper,
// } from "@/store/startMatch/selectors";
// import { useGetTeamMembersQuery } from "@/store/api/teamApi";
// import { PlayerList } from "@/components/Players/Playerlist";
// import { PlayerListItem } from "@/components/Players/Types";
// import {
//   setTeamARoles,
//   setTeamBRoles,
// } from "@/store/startMatch/startMatchSlice";
// import { Button } from "@/components/common/Button";
// import { useSubmitTeamLineupMutation } from "@/store/api/matchApi";
// import { SubmitLineupDto } from "@/types/match";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type ActiveTab = "A" | "B";

// // ─── Toggle Switch ────────────────────────────────────────────────────────────

// // function ToggleSwitch({
// //   on,
// //   onChange,
// // }: {
// //   on: boolean;
// //   onChange: (v: boolean) => void;
// // }) {
// //   return (
// //     <button
// //       type="button"
// //       role="switch"
// //       aria-checked={on}
// //       onClick={() => onChange(!on)}
// //       className={cn(
// //         "relative h-8 w-14 rounded-full transition-colors duration-200 shrink-0",
// //         on
// //           ? "bg-(--color-brand) shadow-[0_2px_8px_rgba(27,63,160,0.35)]"
// //           : "bg-(--color-bg-border)",
// //       )}
// //     >
// //       <div
// //         className={cn(
// //           "absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-200",
// //           on ? "left-7" : "left-1",
// //         )}
// //       />
// //     </button>
// //   );
// // }

// // ─── Match Mode Pill ──────────────────────────────────────────────────────────

// function MatchModePill({ label }: { label: string }) {
//   return (
//     <div className="flex items-center justify-between rounded-2xl border border-(--color-brand)/25 bg-(--color-bg-card) px-4 py-3">
//       <span className="text-[10px] font-(family-name:--font-display) font-bold uppercase tracking-widest text-(--color-text-muted)">
//         Match Mode
//       </span>
//       <span className="text-[11px] font-(family-name:--font-display) font-black uppercase tracking-[0.06em] text-(--color-brand)">
//         {label}
//       </span>
//     </div>
//   );
// }

// // ─── Update Lineup Banner ─────────────────────────────────────────────────────

// function UpdateLineupBanner({ onReview }: { onReview: () => void }) {
//   return (
//     <div className="fixture-bar rounded-2xl bg-(--color-bg-card) p-5 shadow-(--shadow-card)">
//       <h3
//         className="font-(family-name:--font-display) text-xl font-black text-(--color-navy) uppercase leading-tight mb-2"
//         style={{ letterSpacing: "0.02em" }}
//       >
//         Update Team Lineup?
//       </h3>
//       <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-4">
//         Currently all players are selected by default for this match.
//       </p>
//       <button
//         onClick={onReview}
//         className={cn(
//           "w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl",
//           "bg-(--color-brand) text-white",
//           "font-(family-name:--font-display) font-black uppercase tracking-[0.06em] text-sm",
//           "shadow-(--shadow-button) transition-all active:scale-[0.98]",
//         )}
//       >
//         <Pencil size={15} />
//         Review Lineup
//       </button>
//     </div>
//   );
// }

// // ─── Team Tabs ────────────────────────────────────────────────────────────────

// function TeamTabs({
//   nameA,
//   nameB,
//   active,
//   onChange,
// }: {
//   nameA: string;
//   nameB: string;
//   active: ActiveTab;
//   onChange: (t: ActiveTab) => void;
// }) {
//   return (
//     <div className="flex border-b border-(--color-bg-border)">
//       {(["A", "B"] as ActiveTab[]).map((tab) => {
//         const isActive = active === tab;
//         const name = tab === "A" ? nameA : nameB;
//         return (
//           <button
//             key={tab}
//             onClick={() => onChange(tab)}
//             className={cn(
//               "flex-1 py-3 font-(family-name:--font-display) font-black uppercase text-sm tracking-[0.04em] transition-all duration-200",
//               "border-b-2 -mb-px",
//               isActive
//                 ? "border-(--color-brand) text-(--color-brand)"
//                 : "border-transparent text-(--color-text-muted) hover:text-(--color-text-secondary)",
//             )}
//           >
//             {name}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// // ─── Stats Row ────────────────────────────────────────────────────────────────

// function StatsRow({
//   selected,
//   notPlaying,
//   onAddPlayer,
// }: {
//   selected: number;
//   notPlaying: number;
//   onAddPlayer: () => void;
// }) {
//   return (
//     <div className="flex items-center justify-between">
//       <p className="text-[11px] font-(family-name:--font-display) font-bold uppercase tracking-[0.06em] text-(--color-brand)">
//         {selected} Selected
//         {notPlaying > 0 && (
//           <span className="text-(--color-text-muted)">
//             {" "}
//             • {notPlaying} Not Playing
//           </span>
//         )}
//       </p>
//       <button
//         onClick={onAddPlayer}
//         className="flex items-center gap-1.5 text-[11px] font-(family-name:--font-display) font-bold uppercase tracking-[0.06em] text-(--color-brand) hover:opacity-75 transition-opacity"
//       >
//         <UserPlus size={13} />
//         Add Player
//       </button>
//     </div>
//   );
// }

// // ─── Lineup Summary Card ──────────────────────────────────────────────────────

// function LineupSummary({
//   teamAName,
//   teamBName,
//   teamAPlaying,
//   teamBPlaying,
//   teamACaptainName,
//   teamAKeeperName,
//   teamBCaptainName,
//   teamBKeeperName,
// }: {
//   teamAName: string;
//   teamBName: string;
//   teamAPlaying: number;
//   teamBPlaying: number;
//   teamACaptainName?: string;
//   teamAKeeperName?: string;
//   teamBCaptainName?: string;
//   teamBKeeperName?: string;
// }) {
//   return (
//     <div className="fixture-bar rounded-2xl bg-(--color-bg-card) shadow-(--shadow-card) overflow-hidden">
//       {/* Header */}
//       <div className="px-5 pt-4 pb-3 border-b border-(--color-bg-border)">
//         <h4
//           className="font-(family-name:--font-display) font-black uppercase text-base text-(--color-brand)"
//           style={{ letterSpacing: "0.04em" }}
//         >
//           Lineup Summary
//         </h4>
//       </div>

//       {/* Two-column split */}
//       <div className="grid grid-cols-2 divide-x divide-(--color-bg-border)">
//         {/* Team A */}
//         <div className="px-4 py-4">
//           <p className="text-[10px] font-(family-name:--font-display) font-bold uppercase tracking-[0.08em] text-(--color-text-muted) mb-1">
//             {teamAName}
//           </p>
//           <p className="font-bold text-base text-(--color-text-primary) mb-1.5">
//             {teamAPlaying} Playing
//           </p>

//           <div className="flex items-center gap-1 text-xs text-(--color-text-secondary)">
//             <span className="shrink-0">C:</span>
//             <span className="truncate">{teamACaptainName ?? "—"}</span>
//           </div>

//           <div className="flex items-center gap-1 text-xs text-(--color-text-secondary)">
//             <span className="shrink-0">WK:</span>
//             <span className="truncate">{teamAKeeperName ?? "—"}</span>
//           </div>
//         </div>

//         {/* Team B */}
//         <div className="px-4 py-4">
//           <p className="text-[10px] font-(family-name:--font-display) font-bold uppercase tracking-[0.08em] text-(--color-text-muted) mb-1">
//             {teamBName}
//           </p>
//           <p className="font-bold text-base text-(--color-text-primary) mb-1.5">
//             {teamBPlaying} Playing
//           </p>

//           <div className="flex items-center gap-1 text-xs text-(--color-text-secondary)">
//             <span className="shrink-0">C:</span>
//             <span className="truncate">{teamBCaptainName ?? "—"}</span>
//           </div>

//           <div className="flex items-center gap-1 text-xs text-(--color-text-secondary)">
//             <span className="shrink-0">WK:</span>
//             <span className="truncate">{teamBKeeperName ?? "—"}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Custom PlayerList wrapper that renders the toggle-style cards ─────────────
// // The existing PlayerList uses a checkbox — the design uses a toggle switch.
// // We wrap it by overriding the card appearance via a thin adapter layer
// // that maps toggle state → selectedPlayerIds.

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function LineupPage() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const searchParams = useSearchParams();

//   const mode = searchParams.get("mode");
//   const matchId = searchParams.get("matchId");

//   // Redux state
//   const teamA = useAppSelector(selectTeamA);
//   const teamB = useAppSelector(selectTeamB);
//   const teamACaptain = useAppSelector(selectTeamACaptain);
//   const teamAKeeper = useAppSelector(selectTeamAKeeper);
//   const teamBCaptain = useAppSelector(selectTeamBCaptain);
//   const teamBKeeper = useAppSelector(selectTeamBKeeper);

//   // API queries
//   const { data: membersA = [] } = useGetTeamMembersQuery(
//     { teamId: teamA?.id ?? "" },
//     { skip: !teamA?.id },
//   );
//   const { data: membersB = [] } = useGetTeamMembersQuery(
//     { teamId: teamB?.id ?? "" },
//     { skip: !teamB?.id },
//   );

//   const [submitTeamLineup, { isLoading }] = useSubmitTeamLineupMutation();

//   // Local UI state
//   const [reviewOpen, setReviewOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<ActiveTab>("A");

//   // Captain / Keeper — local state (initialized from redux, editable here)
//   const [captainA, setCaptainA] = useState<string | null>(
//     teamACaptain?.id ?? null,
//   );
//   const [keeperA, setKeeperA] = useState<string | null>(
//     teamAKeeper?.id ?? null,
//   );
//   const [captainB, setCaptainB] = useState<string | null>(
//     teamBCaptain?.id ?? null,
//   );
//   const [keeperB, setKeeperB] = useState<string | null>(
//     teamBKeeper?.id ?? null,
//   );

//   // Selection sets — default ALL selected
//   const [selectedA, setSelectedA] = useState<Set<string>>(
//     () => new Set(membersA.map((m) => m.playerId)),
//   );
//   const [selectedB, setSelectedB] = useState<Set<string>>(
//     () => new Set(membersB.map((m) => m.playerId)),
//   );

//   // Sync selection sets when API data arrives
//   useEffect(() => {
//     setSelectedA(new Set(membersA.map((m) => m.playerId)));
//   }, [membersA]);
//   useEffect(() => {
//     setSelectedB(new Set(membersB.map((m) => m.playerId)));
//   }, [membersB]);

//   // Map API TeamMember → PlayerListItem
//   const playersA: PlayerListItem[] = useMemo(
//     () =>
//       membersA.map((m) => ({
//         playerId: m.playerId,
//         fullName: m.fullName,
//         profileImageUrl: m.profileImageUrl,
//         role: m.roles,
//       })),
//     [membersA],
//   );
//   const playersB: PlayerListItem[] = useMemo(
//     () =>
//       membersB.map((m) => ({
//         playerId: m.playerId,
//         fullName: m.fullName,
//         profileImageUrl: m.profileImageUrl,
//         role: m.roles,
//       })),
//     [membersB],
//   );

//   // Derived counts
//   const playingA = selectedA.size;
//   const notPlayingA = playersA.length - playingA;
//   const playingB = selectedB.size;

//   // Active tab data shortcuts
//   const activePlayers = activeTab === "A" ? playersA : playersB;
//   const activeSelected = activeTab === "A" ? selectedA : selectedB;
//   const activeCaptain = activeTab === "A" ? captainA : captainB;
//   const activeKeeper = activeTab === "A" ? keeperA : keeperB;
//   const activeNotPlaying =
//     activeTab === "A" ? notPlayingA : playersB.length - playingB;

//   function handleSelectionChange(playerId: string, sel: boolean) {
//     const setter = activeTab === "A" ? setSelectedA : setSelectedB;
//     setter((prev) => {
//       const next = new Set(prev);
//       sel ? next.add(playerId) : next.delete(playerId);
//       return next;
//     });
//   }

//   function handleCaptainChange(id: string | null) {
//     activeTab === "A" ? setCaptainA(id) : setCaptainB(id);
//   }

//   function handleKeeperChange(id: string | null) {
//     activeTab === "A" ? setKeeperA(id) : setKeeperB(id);
//   }

//   //   Short name helper for summary (e.g. "Rohit Sharma" → "R. Sharma")
//   //   function shortName(playerId: string | null, players: PlayerListItem[]) {
//   //     if (!playerId) return undefined;
//   //     const p = players.find((pl) => pl.playerId === playerId);
//   //     if (!p) return undefined;
//   //     const parts = p.fullName.trim().split(" ");
//   //     if (parts.length === 1) return parts[0];
//   //     return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
//   //   }

//   function getPlayerName(playerId: string | null, players: PlayerListItem[]) {
//     if (!playerId) return undefined;

//     return players.find((p) => p.playerId === playerId)?.fullName;
//   }

//   const canContinue = captainA && keeperA && captainB && keeperB;

//   function validateNoDuplicatePlayers() {
//     const teamAPlayerIds = new Set(selectedA);

//     const duplicates = [...selectedB].filter((id) => teamAPlayerIds.has(id));

//     return duplicates;
//   }

//   function buildLineupPayload(
//     players: PlayerListItem[],
//     selectedIds: Set<string>,
//     captainId: string,
//     wicketKeeperId: string,
//   ): SubmitLineupDto {
//     const playingPlayers = players
//       .filter((player) => selectedIds.has(player.playerId))
//       .map((player, index) => ({
//         playerId: player.playerId,
//         isPlayingXi: true,
//         battingOrder: index + 1, // backend will overwrite anyway
//       }));

//     return {
//       playingXiCount: playingPlayers.length,
//       players: playingPlayers,
//       captainId,
//       wicketKeeperId,
//     };
//   }

//   async function handleContinue() {
//     const duplicates = validateNoDuplicatePlayers();

//     if (duplicates.length > 0) {
//       alert("Some players are selected in both teams. Please review lineups.");

//       setReviewOpen(true);
//       setActiveTab("A");

//       return;
//     }
//     if (
//       !matchId ||
//       !teamA?.id ||
//       !teamB?.id ||
//       !captainA ||
//       !keeperA ||
//       !captainB ||
//       !keeperB
//     ) {
//       return;
//     }

//     try {
//       await Promise.all([
//         submitTeamLineup({
//           matchId,
//           teamId: teamA.id,
//           body: buildLineupPayload(playersA, selectedA, captainA, keeperA),
//         }).unwrap(),

//         submitTeamLineup({
//           matchId,
//           teamId: teamB.id,
//           body: buildLineupPayload(playersB, selectedB, captainB, keeperB),
//         }).unwrap(),
//       ]);

//       router.push("/start-match/toss");
//     } catch (error) {
//       console.error("Failed to submit lineup", error);
//     }
//   }

//   return (
//     <div className="flex min-h-full flex-col bg-(--color-bg-base)">
//       <div className="flex flex-col gap-3 p-4 flex-1">
//         {/* ── 1. Match mode pill ─────────────────────────────────────────── */}
//         <MatchModePill label="Flexible Lineup Enabled" />

//         {/* ── 2. Update banner (always visible) ─────────────────────────── */}
//         <UpdateLineupBanner onReview={() => setReviewOpen((v) => !v)} />

//         {/* ── 3. Tabs + player list (revealed after Review click) ────────── */}
//         {reviewOpen && (
//           <>
//             {/* Team tabs */}
//             <div className="bg-(--color-bg-card) rounded-2xl border border-(--color-bg-border) shadow-(--shadow-card) overflow-hidden">
//               <TeamTabs
//                 nameA={teamA?.name ?? "Team A"}
//                 nameB={teamB?.name ?? "Team B"}
//                 active={activeTab}
//                 onChange={setActiveTab}
//               />

//               {/* Stats row */}
//               <div className="px-4 pt-3 pb-2">
//                 <StatsRow
//                   selected={activeSelected.size}
//                   notPlaying={activeNotPlaying}
//                   onAddPlayer={() =>
//                     router.push(`/start-match/add-player?team=${activeTab}`)
//                   }
//                 />
//               </div>

//               {/* Player list */}
//               <div className="px-3 pb-3">
//                 <PlayerList
//                   players={activePlayers}
//                   mode="flexible-lineup"
//                   captainId={activeCaptain}
//                   keeperId={activeKeeper}
//                   onCaptainChange={handleCaptainChange}
//                   onKeeperChange={handleKeeperChange}
//                   selectedPlayerIds={activeSelected}
//                   onSelectionChange={handleSelectionChange}
//                   showSearch={false}
//                   emptyMessage="No players in roster"
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {/* ── 4. Lineup summary ─────────────────────────────────────────── */}
//         <LineupSummary
//           teamAName={teamA?.name ?? "Team A"}
//           teamBName={teamB?.name ?? "Team B"}
//           teamAPlaying={playingA}
//           teamBPlaying={playingB}
//           teamACaptainName={getPlayerName(captainA, playersA)}
//           teamAKeeperName={getPlayerName(keeperA, playersA)}
//           teamBCaptainName={getPlayerName(captainB, playersB)}
//           teamBKeeperName={getPlayerName(keeperB, playersB)}
//         />

//         <div className="h-2" />
//       </div>

//       {/* ── 5. Sticky CTA footer ──────────────────────────────────────────── */}
//       <div className="safe-bottom sticky bottom-0 shrink-0 px-4 pb-4 bg-(--color-bg-base) pt-2">
//         <Button
//           onClick={() => handleContinue()}
//           disabled={!canContinue}
//           fullWidth
//         >
//           <span className="font-(family-name:--font-display) font-black uppercase tracking-[0.08em] text-base text-white">
//             Continue to Toss
//           </span>
//           {mode === "FIXED" && (
//             <span className="text-[11px] text-white/60 mt-0.5">
//               Lineups locked after Ready For Toss.
//             </span>
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, UserPlus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectTeamA,
  selectTeamB,
  selectTeamACaptain,
  selectTeamAKeeper,
  selectTeamBCaptain,
  selectTeamBKeeper,
} from "@/store/startMatch/selectors";
import { useGetTeamMembersQuery } from "@/store/api/teamApi";
import { PlayerList } from "@/components/Players/Playerlist";
import { PlayerListItem } from "@/components/Players/Types";
import {
  setTeamARoles,
  setTeamBRoles,
} from "@/store/startMatch/startMatchSlice";
import { Button } from "@/components/common/Button";
import { useSubmitTeamLineupMutation } from "@/store/api/matchApi";
import { SubmitLineupDto } from "@/types/match";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActiveTab = "A" | "B";

// ─── Match Mode Pill ──────────────────────────────────────────────────────────

function MatchModePill({
  label,
  mode,
}: {
  label: string;
  mode: string | null;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-(--color-brand)/25 bg-(--color-bg-card) px-4 py-3 shadow-(--shadow-card)">
      <span className="font-(family-name:--font-display) text-[10px] font-bold uppercase tracking-widest text-(--color-text-muted)">
        Match Mode
      </span>
      <span
        className={`font-(family-name:--font-display) text-[11px] font-black uppercase tracking-[0.06em] ${mode === "FIXED" ? "text-(--color-live)" : "text-(--color-brand)"} `}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Update Lineup Banner ─────────────────────────────────────────────────────

function UpdateLineupBanner({
  onReview,
  showAllPlayersMessage,
}: {
  onReview: () => void;
  showAllPlayersMessage: boolean;
}) {
  return (
    <div className="fixture-bar rounded-2xl bg-(--color-bg-card) p-5 shadow-(--shadow-card)">
      <h3
        className="font-(family-name:--font-display) mb-2 text-xl font-black uppercase leading-tight text-(--color-navy)"
        style={{ letterSpacing: "0.02em" }}
      >
        Update Team Lineup?
      </h3>
      {showAllPlayersMessage && (
        <p className="mb-4 text-sm leading-relaxed text-(--color-text-secondary)">
          Currently all players are selected by default for this match.
        </p>
      )}
      <button
        onClick={onReview}
        className={cn(
          "flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5",
          "bg-(--color-brand) text-white",
          "font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.06em]",
          "shadow-(--shadow-button) transition-all active:scale-[0.98]",
        )}
      >
        <Pencil size={15} />
        Review Lineup
      </button>
    </div>
  );
}

// ─── Team Tabs ────────────────────────────────────────────────────────────────

function TeamTabs({
  nameA,
  nameB,
  active,
  onChange,
  warningA,
  warningB,
}: {
  nameA: string;
  nameB: string;
  active: ActiveTab;
  onChange: (t: ActiveTab) => void;
  warningA?: boolean;
  warningB?: boolean;
}) {
  return (
    <div className="flex border-b border-(--color-bg-border)">
      {(["A", "B"] as ActiveTab[]).map((tab) => {
        const isActive = active === tab;
        const name = tab === "A" ? nameA : nameB;
        const hasWarn = tab === "A" ? warningA : warningB;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={cn(
              "relative flex-1 py-3 font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.04em] transition-all duration-200",
              "-mb-px border-b-2",
              isActive
                ? "border-(--color-brand) text-(--color-brand)"
                : "border-transparent text-(--color-text-muted) hover:text-(--color-text-secondary)",
            )}
          >
            {name}
            {/* Orange dot when this tab has a validation warning */}
            {hasWarn && (
              <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-(--color-six)" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────

function StatsRow({
  selected,
  notPlaying,
  onAddPlayer,
}: {
  selected: number;
  notPlaying: number;
  onAddPlayer: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="font-(family-name:--font-display) text-[11px] font-bold uppercase tracking-[0.06em] text-(--color-brand)">
        {selected} Selected
        {notPlaying > 0 && (
          <span className="text-(--color-text-muted)">
            {" "}
            • {notPlaying} Not Playing
          </span>
        )}
      </p>
      <button
        onClick={onAddPlayer}
        className="flex items-center gap-1.5 font-(family-name:--font-display) text-[11px] font-bold uppercase tracking-[0.06em] text-(--color-brand) transition-opacity hover:opacity-75"
      >
        <UserPlus size={13} />
        Add Player
      </button>
    </div>
  );
}

// ─── Inline error pill ────────────────────────────────────────────────────────

function ErrorPill({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-(--color-live)/20 bg-(--color-live)/8 px-4 py-3">
      <AlertCircle size={15} className="mt-0.5 shrink-0 text-(--color-live)" />
      <p className="text-sm font-medium text-(--color-live)">{message}</p>
    </div>
  );
}

// ─── Validation hint row ──────────────────────────────────────────────────────

function ValidationHint({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="mx-3 mb-2 flex items-center gap-2 rounded-xl border border-(--color-six)/30 bg-(--color-six)/8 px-3 py-2">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-six)" />
      <p className="text-xs font-semibold text-(--color-six)">{message}</p>
    </div>
  );
}

// ─── Lineup Summary Card ──────────────────────────────────────────────────────

function LineupSummary({
  teamAName,
  teamBName,
  teamAPlaying,
  teamBPlaying,
  teamACaptainName,
  teamAKeeperName,
  teamBCaptainName,
  teamBKeeperName,
}: {
  teamAName: string;
  teamBName: string;
  teamAPlaying: number;
  teamBPlaying: number;
  teamACaptainName?: string;
  teamAKeeperName?: string;
  teamBCaptainName?: string;
  teamBKeeperName?: string;
}) {
  return (
    <div className="fixture-bar overflow-hidden rounded-2xl bg-(--color-bg-card) shadow-(--shadow-card)">
      {/* Header */}
      <div className="border-b border-(--color-bg-border) px-5 pb-3 pt-4">
        <h4
          className="font-(family-name:--font-display) text-base font-black uppercase text-(--color-brand)"
          style={{ letterSpacing: "0.04em" }}
        >
          Lineup Summary
        </h4>
      </div>

      {/* Two-column split */}
      <div className="grid grid-cols-2 divide-x divide-(--color-bg-border)">
        {[
          {
            name: teamAName,
            playing: teamAPlaying,
            captain: teamACaptainName,
            keeper: teamAKeeperName,
          },
          {
            name: teamBName,
            playing: teamBPlaying,
            captain: teamBCaptainName,
            keeper: teamBKeeperName,
          },
        ].map(({ name, playing, captain, keeper }) => (
          <div key={name} className="px-4 py-4">
            <p className="font-(family-name:--font-display) mb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-(--color-text-muted)">
              {name}
            </p>
            <p className="mb-1.5 text-base font-bold text-(--color-text-primary)">
              {playing} Playing
            </p>
            <div className="flex items-center gap-1 text-xs text-(--color-text-secondary)">
              <span className="shrink-0 font-bold text-(--color-sky)">C:</span>
              <span
                className={cn(
                  "truncate",
                  !captain && "italic text-(--color-text-muted)",
                )}
              >
                {captain ?? "Not set"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-(--color-text-secondary)">
              <span className="shrink-0 font-bold text-(--color-sky)">WK:</span>
              <span
                className={cn(
                  "truncate",
                  !keeper && "italic text-(--color-text-muted)",
                )}
              >
                {keeper ?? "Not set"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LineupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode");
  const matchId = searchParams.get("matchId");

  // Redux state
  const teamA = useAppSelector(selectTeamA);
  const teamB = useAppSelector(selectTeamB);
  const teamACaptain = useAppSelector(selectTeamACaptain);
  const teamAKeeper = useAppSelector(selectTeamAKeeper);
  const teamBCaptain = useAppSelector(selectTeamBCaptain);
  const teamBKeeper = useAppSelector(selectTeamBKeeper);

  // API queries
  const { data: membersA = [], isLoading: loadingA } = useGetTeamMembersQuery(
    { teamId: teamA?.id ?? "" },
    { skip: !teamA?.id },
  );
  const { data: membersB = [], isLoading: loadingB } = useGetTeamMembersQuery(
    { teamId: teamB?.id ?? "" },
    { skip: !teamB?.id },
  );

  const [submitTeamLineup, { isLoading: isSubmitting }] =
    useSubmitTeamLineupMutation();

  // Local UI state
  const [reviewOpen, setReviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("A");
  const [error, setError] = useState("");

  // Captain / Keeper — local state (initialised from Redux, editable here)
  const [captainA, setCaptainA] = useState<string | null>(
    teamACaptain?.id ?? null,
  );
  const [keeperA, setKeeperA] = useState<string | null>(
    teamAKeeper?.id ?? null,
  );
  const [captainB, setCaptainB] = useState<string | null>(
    teamBCaptain?.id ?? null,
  );
  const [keeperB, setKeeperB] = useState<string | null>(
    teamBKeeper?.id ?? null,
  );

  // Selection sets — default ALL selected
  const [selectedA, setSelectedA] = useState<Set<string>>(
    () => new Set(membersA.map((m) => m.playerId)),
  );
  const [selectedB, setSelectedB] = useState<Set<string>>(
    () => new Set(membersB.map((m) => m.playerId)),
  );

  // Sync selection sets when API data arrives
  useEffect(() => {
    setSelectedA(new Set(membersA.map((m) => m.playerId)));
  }, [membersA]);
  useEffect(() => {
    setSelectedB(new Set(membersB.map((m) => m.playerId)));
  }, [membersB]);

  // Map API TeamMember → PlayerListItem
  const playersA: PlayerListItem[] = useMemo(
    () =>
      membersA.map((m) => ({
        playerId: m.playerId,
        fullName: m.fullName,
        profileImageUrl: m.profileImageUrl,
        role: m.roles,
      })),
    [membersA],
  );
  const playersB: PlayerListItem[] = useMemo(
    () =>
      membersB.map((m) => ({
        playerId: m.playerId,
        fullName: m.fullName,
        profileImageUrl: m.profileImageUrl,
        role: m.roles,
      })),
    [membersB],
  );

  // Derived counts
  const playingA = selectedA.size;
  const notPlayingA = playersA.length - playingA;
  const playingB = selectedB.size;
  const notPlayingB = playersB.length - playingB;

  // Active tab shortcuts
  const activePlayers = activeTab === "A" ? playersA : playersB;
  const activeSelected = activeTab === "A" ? selectedA : selectedB;
  const activeCaptain = activeTab === "A" ? captainA : captainB;
  const activeKeeper = activeTab === "A" ? keeperA : keeperB;
  const activeNotPlaying = activeTab === "A" ? notPlayingA : notPlayingB;

  const allPlayersSelected =
    selectedA.size === playersA.length && selectedB.size === playersB.length;

  // Per-tab validation hints (shown inside the tab panel)
  const hintA =
    !captainA && !keeperA
      ? `Select Captain and Wicketkeeper for ${teamA?.name}`
      : !captainA
        ? `Select Captain for ${teamA?.name}`
        : !keeperA
          ? `Select Wicketkeeper for ${teamA?.name}`
          : "";
  const hintB =
    !captainB && !keeperB
      ? `Select Captain and Wicketkeeper for ${teamB?.name}`
      : !captainB
        ? `Select Captain for ${teamB?.name}`
        : !keeperB
          ? `Select Wicketkeeper for ${teamB?.name}`
          : "";
  const activeHint = activeTab === "A" ? hintA : hintB;

  // ── Event handlers ────────────────────────────────────────────────────────

  function handleSelectionChange(playerId: string, sel: boolean) {
    const setter = activeTab === "A" ? setSelectedA : setSelectedB;
    setter((prev) => {
      const next = new Set(prev);
      sel ? next.add(playerId) : next.delete(playerId);
      return next;
    });
  }

  function handleCaptainChange(id: string | null) {
    activeTab === "A" ? setCaptainA(id) : setCaptainB(id);
  }

  function handleKeeperChange(id: string | null) {
    activeTab === "A" ? setKeeperA(id) : setKeeperB(id);
  }

  function getPlayerName(playerId: string | null, players: PlayerListItem[]) {
    if (!playerId) return undefined;
    return players.find((p) => p.playerId === playerId)?.fullName;
  }

  const canContinue = Boolean(captainA && keeperA && captainB && keeperB);

  // ── Duplicate validation (was alert(), now inline error) ─────────────────

  function validateNoDuplicatePlayers(): string[] {
    const teamAPlayerIds = new Set(selectedA);
    return [...selectedB].filter((id) => teamAPlayerIds.has(id));
  }

  // ── Build lineup payload ──────────────────────────────────────────────────

  function buildLineupPayload(
    players: PlayerListItem[],
    selectedIds: Set<string>,
    captainId: string,
    wicketKeeperId: string,
  ): SubmitLineupDto {
    const playingPlayers = players
      .filter((p) => selectedIds.has(p.playerId))
      .map((p, index) => ({
        playerId: p.playerId,
        isPlayingXi: true,
        battingOrder: index + 1,
      }));
    return {
      playingXiCount: playingPlayers.length,
      players: playingPlayers,
      captainId,
      wicketKeeperId,
    };
  }

  // ── Continue / submit ─────────────────────────────────────────────────────

  async function handleContinue() {
    setError("");

    // 1. Duplicate player check — inline error instead of alert()
    const duplicates = validateNoDuplicatePlayers();
    if (duplicates.length > 0) {
      setError(
        `${duplicates.length} player${duplicates.length > 1 ? "s are" : " is"} selected in both teams. Please review lineups.`,
      );
      setReviewOpen(true);
      setActiveTab("A");
      return;
    }

    // 2. Guard: required fields
    if (
      !matchId ||
      !teamA?.id ||
      !teamB?.id ||
      !captainA ||
      !keeperA ||
      !captainB ||
      !keeperB
    ) {
      setError(
        "Please assign Captain and Wicketkeeper for both teams before continuing.",
      );
      return;
    }

    // 3. Submit both lineups
    try {
      await Promise.all([
        submitTeamLineup({
          matchId,
          teamId: teamA.id,
          body: buildLineupPayload(playersA, selectedA, captainA, keeperA),
        }).unwrap(),
        submitTeamLineup({
          matchId,
          teamId: teamB.id,
          body: buildLineupPayload(playersB, selectedB, captainB, keeperB),
        }).unwrap(),
      ]);
      router.push("/start-match/toss");
    } catch (err: any) {
      setError(
        err?.data?.message ?? "Failed to submit lineup. Please try again.",
      );
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base)">
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* 1. Match mode pill */}
        <MatchModePill
          label={
            mode === "FLEXIBLE"
              ? "Flexible Lineup Enabled"
              : "Fixed Lineup Enabled"
          }
          mode={mode}
        />

        {/* 2. Update banner */}
        <UpdateLineupBanner
          onReview={() => setReviewOpen((v) => !v)}
          showAllPlayersMessage={allPlayersSelected}
        />

        {/* 3. Global error — duplicate players or API failure */}
        <ErrorPill message={error} />

        {/* 4. Tabs + player list (revealed after Review click) */}
        {reviewOpen && (
          <div className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card) shadow-(--shadow-card)">
            {/* Tab bar — orange warning dot if tab has missing roles */}
            <TeamTabs
              nameA={teamA?.name ?? "Team A"}
              nameB={teamB?.name ?? "Team B"}
              active={activeTab}
              onChange={(tab) => {
                setActiveTab(tab);
                setError("");
              }}
              warningA={Boolean(hintA)}
              warningB={Boolean(hintB)}
            />

            {/* Stats row */}
            <div className="px-4 pb-2 pt-3">
              <StatsRow
                selected={activeSelected.size}
                notPlaying={activeNotPlaying}
                onAddPlayer={() =>
                  router.push(`/start-match/add-player?team=${activeTab}`)
                }
              />
            </div>

            {/* Per-tab role validation hint */}
            <ValidationHint message={activeHint} />

            {/* Player list */}
            <div className="px-3 pb-3">
              {loadingA || loadingB ? (
                // Skeleton rows while members load
                <div className="flex flex-col gap-2.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-2xl border-2 border-(--color-bg-border) bg-(--color-bg-card) px-3.5 py-3"
                    >
                      <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-(--color-bg-border)" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-32 animate-pulse rounded-full bg-(--color-bg-border)" />
                        <div className="h-2.5 w-20 animate-pulse rounded-full bg-(--color-bg-border)" />
                      </div>
                      <div className="h-9 w-9 animate-pulse rounded-full bg-(--color-bg-border)" />
                      <div className="h-9 w-9 animate-pulse rounded-full bg-(--color-bg-border)" />
                    </div>
                  ))}
                </div>
              ) : (
                <PlayerList
                  players={activePlayers}
                  mode="flexible-lineup"
                  captainId={activeCaptain}
                  keeperId={activeKeeper}
                  onCaptainChange={handleCaptainChange}
                  onKeeperChange={handleKeeperChange}
                  selectedPlayerIds={activeSelected}
                  onSelectionChange={handleSelectionChange}
                  showSearch={false}
                  emptyMessage="No players in roster"
                />
              )}
            </div>
          </div>
        )}

        {/* 5. Lineup summary */}
        <LineupSummary
          teamAName={teamA?.name ?? "Team A"}
          teamBName={teamB?.name ?? "Team B"}
          teamAPlaying={playingA}
          teamBPlaying={playingB}
          teamACaptainName={getPlayerName(captainA, playersA)}
          teamAKeeperName={getPlayerName(keeperA, playersA)}
          teamBCaptainName={getPlayerName(captainB, playersB)}
          teamBKeeperName={getPlayerName(keeperB, playersB)}
        />

        <div className="h-2" />
      </div>

      {/* 6. Sticky CTA footer */}
      <div className="safe-bottom sticky bottom-0 shrink-0 bg-(--color-bg-base) px-4 pb-4 pt-2">
        <Button
          onClick={handleContinue}
          disabled={!canContinue || isSubmitting}
          loading={isSubmitting}
          fullWidth
        >
          <span className="flex flex-col">
            <span className="font-(family-name:--font-display) text-base font-black uppercase tracking-[0.08em] text-white">
              Continue to Toss
            </span>
            {mode === "FIXED" && (
              <span className="mt-0.5 text-[11px] text-white/60">
                Lineups locked after Ready For Toss.
              </span>
            )}
          </span>
        </Button>
      </div>
    </div>
  );
}
