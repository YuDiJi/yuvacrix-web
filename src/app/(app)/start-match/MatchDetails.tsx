// import { useGetTeamDetailQuery } from "@/store/api/teamApi";
// import { User, ClipboardList, Video, Users2, ChevronRight } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/cn";
// import { Team } from "@/types/team";
// import Image from "next/image";
// import {
//   selectTeamACaptain,
//   selectTeamAKeeper,
//   selectTeamBCaptain,
//   selectTeamBKeeper,
// } from "@/store/startMatch/selectors";
// import { useAppSelector } from "@/store/hooks";

// const MatchDetails = ({ teamA, teamB }: { teamA: Team; teamB: Team }) => {
//   const router = useRouter();

//   const { data: teamADetail } = useGetTeamDetailQuery({ teamId: teamA.id });
//   const { data: teamBDetail } = useGetTeamDetailQuery({ teamId: teamB.id });

//   const teamACaptain = useAppSelector(selectTeamACaptain);
//   const teamAKeeper = useAppSelector(selectTeamAKeeper);
//   const teamBCaptain = useAppSelector(selectTeamBCaptain);
//   const teamBKeeper = useAppSelector(selectTeamBKeeper);

//   //   console.log(teamACaptain);
//   //   console.log(teamAKeeper);
//   //   console.log(teamBCaptain);
//   //   console.log(teamBKeeper);

//   console.log(teamADetail);
//   console.log(teamBDetail);

//   return (
//     <div className="flex min-h-full flex-col bg-(--color-bg-base)">
//       {/* Team hero banner */}
//       <div className="relative bg-(--color-navy) px-5 py-5">
//         {/* Subtle glow */}
//         <div
//           className="pointer-events-none absolute inset-0 opacity-[0.06]"
//           style={{
//             background:
//               "radial-gradient(ellipse 80% 60% at 50% 50%, white 0%, transparent 70%)",
//           }}
//         />
//         <div className="relative flex items-center justify-between">
//           {/* Team A */}
//           <div
//             className="flex cursor-pointer flex-col items-center gap-2"
//             onClick={() => router.push("/start-match/select-team?team=A")}
//           >
//             <div className="relative">
//               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4b5563] shadow-[0_4px_16px_rgba(0,0,0,0.30)]">
//                 <span
//                   className="font-(family-name:--font-display) text-lg font-black text-white"
//                   style={{ letterSpacing: "0.02em" }}
//                 >
//                   {teamADetail?.logoUrl ? (
//                     <Image
//                       src={teamADetail.logoUrl}
//                       alt={teamADetail?.name}
//                       height={28}
//                       width={28}
//                     />
//                   ) : (
//                     teamADetail?.name?.slice(0, 1).toUpperCase()
//                   )}
//                 </span>
//               </div>
//               <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-(--color-sky) ring-2 ring-(--color-navy)">
//                 <User size={10} className="text-white" />
//               </div>
//             </div>
//             <div className="text-center">
//               <p
//                 className="font-(family-name:--font-display) text-xs font-black uppercase text-white"
//                 style={{ letterSpacing: "0.04em", maxWidth: 80 }}
//               >
//                 {teamADetail?.name}
//               </p>
//               <span className="mt-0.5 inline-block rounded-full bg-(--color-brand) px-2.5 py-0.5 font-(family-name:--font-display) text-[9px] font-bold uppercase tracking-widest text-white">
//                 Squad ({teamADetail?.memberCount})
//               </span>
//               <p>Captain - {teamACaptain?.name}</p>
//               <p>Wicket Keeper - {teamAKeeper?.name}</p>
//             </div>
//           </div>

//           {/* VS diamond */}
//           <div
//             className="flex h-10 w-10 items-center justify-center bg-white shadow-[0_2px_12px_rgba(255,255,255,0.25)]"
//             style={{ transform: "rotate(45deg)" }}
//           >
//             <span
//               className="font-(family-name:--font-display) text-[10px] font-black text-(--color-navy)"
//               style={{ transform: "rotate(-45deg)", letterSpacing: "0.04em" }}
//             >
//               VS
//             </span>
//           </div>

//           {/* Team B */}
//           <div
//             className="flex cursor-pointer flex-col items-center gap-2"
//             onClick={() => router.push("/start-match/select-team?team=A")}
//           >
//             <div className="relative">
//               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7c3aed] shadow-[0_4px_16px_rgba(0,0,0,0.30)]">
//                 <span
//                   className="font-(family-name:--font-display) text-lg font-black text-white"
//                   style={{ letterSpacing: "0.02em" }}
//                 >
//                   {teamBDetail?.logoUrl ? (
//                     <Image
//                       src={teamBDetail.logoUrl}
//                       alt={teamBDetail?.name}
//                       height={28}
//                       width={28}
//                     />
//                   ) : (
//                     teamBDetail?.name?.slice(0, 1).toUpperCase()
//                   )}
//                 </span>
//               </div>
//               <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-(--color-sky) ring-2 ring-(--color-navy)">
//                 <User size={10} className="text-white" />
//               </div>
//             </div>
//             <div className="text-center">
//               <p
//                 className="font-(family-name:--font-display) text-xs font-black uppercase text-white"
//                 style={{ letterSpacing: "0.04em", maxWidth: 80 }}
//               >
//                 {teamBDetail?.name}
//               </p>
//               <span className="mt-0.5 inline-block rounded-full bg-(--color-brand) px-2.5 py-0.5 font-(family-name:--font-display) text-[9px] font-bold uppercase tracking-widest text-white">
//                 Squad ({teamBDetail?.memberCount})
//               </span>
//               <p>{teamBCaptain?.name}</p>
//               <p>{teamBKeeper?.name}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Form sections */}
//       <div className="flex flex-col gap-3 p-4">
//         {/* Match Type */}
//         <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
//           <p className="text-section-label mb-3">
//             Match Type <span className="text-(--color-live)">*</span>
//           </p>
//           <div className="flex flex-wrap gap-2">
//             {[
//               "LIMITED OVERS",
//               "BOX/TURF CRICKET",
//               "PAIR CRICKET",
//               "TEST MATCH",
//               "THE HUNDRED",
//             ].map((type) => (
//               <button
//                 key={type}
//                 className={cn(
//                   "rounded-full px-4 py-1.5 font-(family-name:--font-display) text-[10px] font-bold uppercase tracking-wide transition-all active:scale-95",
//                   type === "LIMITED OVERS"
//                     ? "bg-(--color-brand) text-white shadow-[0_2px_8px_rgba(27,63,160,0.25)]"
//                     : "bg-(--color-bg-base) text-(--color-text-secondary) hover:bg-(--color-bg-tint) hover:text-(--color-text-primary)",
//                 )}
//               >
//                 {type}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Overs */}
//         <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
//           <div className="flex items-end gap-6">
//             <div className="flex-1">
//               <p className="text-section-label mb-1.5">
//                 No. of Overs <span className="text-(--color-live)">*</span>
//               </p>
//               <input
//                 type="number"
//                 defaultValue={20}
//                 className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1 text-xl font-bold text-(--color-text-primary) outline-none focus:border-(--color-sky) transition-colors"
//               />
//             </div>
//             <div className="flex-1">
//               <p className="text-section-label mb-1.5">Overs Per Bowler</p>
//               <div className="flex items-end justify-between border-b-2 border-(--color-bg-border) pb-1 focus-within:border-(--color-sky) transition-colors">
//                 <input
//                   type="number"
//                   defaultValue={4}
//                   className="w-full bg-transparent text-xl font-bold text-(--color-text-primary) outline-none"
//                 />
//                 <button className="flex items-center gap-0.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-(--color-brand)">
//                   Power Play <ChevronRight size={11} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Location & Date */}
//         <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card) flex flex-col gap-4">
//           {[
//             {
//               label: "City / Town",
//               placeholder: "Mumbai",
//               required: true,
//               defaultValue: "Mumbai",
//             },
//             {
//               label: "Ground",
//               placeholder: "Search Ground",
//               required: true,
//               defaultValue: "",
//             },
//             {
//               label: "Date & Time",
//               placeholder: "",
//               required: false,
//               defaultValue: "Sun, May 24 2026 01:24 PM",
//             },
//           ].map(({ label, placeholder, required, defaultValue }) => (
//             <div key={label}>
//               <p className="text-section-label mb-1.5">
//                 {label}
//                 {required && (
//                   <span className="ml-0.5 text-(--color-live)">*</span>
//                 )}
//               </p>
//               <input
//                 type="text"
//                 placeholder={placeholder}
//                 defaultValue={defaultValue}
//                 className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1.5 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-sky) transition-colors"
//               />
//             </div>
//           ))}
//         </div>

//         {/* Ball Type */}
//         <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
//           <p className="text-section-label mb-3">
//             Ball Type <span className="text-(--color-live)">*</span>
//           </p>
//           <div className="flex items-end gap-6">
//             {[
//               { label: "Tennis", color: "#84cc16", ring: "#84cc16" },
//               { label: "Leather", color: "#ef4444", ring: "#ef4444" },
//               { label: "Other", color: "#f59e0b", ring: "#f59e0b", dot: true },
//             ].map(({ label, color, ring, dot }, i) => (
//               <div
//                 key={label}
//                 className="flex flex-col items-center gap-1.5 cursor-pointer"
//               >
//                 <div
//                   className={cn(
//                     "h-12 w-12 rounded-full transition-all duration-150",
//                     i === 0 &&
//                       "ring-[3px] ring-offset-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
//                   )}
//                   style={{
//                     backgroundColor: color,
//                     ...(i === 0 ? { outlineColor: ring } : {}),
//                   }}
//                 >
//                   {dot && (
//                     <div className="flex h-full items-center justify-center">
//                       <div className="h-3 w-3 rounded-full border-2 border-white/60" />
//                     </div>
//                   )}
//                 </div>
//                 <span className="text-section-label">{label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Wagon Wheel */}
//         <div className="rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card) flex items-center justify-between">
//           <div>
//             <p
//               className="font-(family-name:--font-display) text-sm font-black uppercase text-(--color-text-primary)"
//               style={{ letterSpacing: "0.04em" }}
//             >
//               Wagon Wheel
//             </p>
//             <p className="text-meta mt-0.5">
//               Show Wagon Wheel for 1s, 2s, & 3s
//             </p>
//           </div>
//           <div className="flex h-7 w-12 cursor-pointer items-center rounded-full bg-(--color-brand) p-1 justify-end">
//             <div className="h-5 w-5 rounded-full bg-white shadow-sm" />
//           </div>
//         </div>

//         {/* Pitch Type */}
//         <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
//           <p className="text-section-label mb-3">Pitch Type</p>
//           <div className="flex flex-wrap gap-2">
//             {["ROUGH", "CEMENT", "TURF", "ASTROTURF", "MATTING"].map((pt) => (
//               <button
//                 key={pt}
//                 className="rounded-full border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-1.5 font-(family-name:--font-display) text-[10px] font-bold uppercase tracking-wide text-(--color-text-secondary) transition-all hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint) active:scale-95"
//               >
//                 {pt}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Match Officials */}
//         <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
//           <p className="text-section-label mb-4">Match Officials</p>
//           <div className="flex items-center justify-around">
//             {[
//               { icon: User, label: "Umpires" },
//               { icon: ClipboardList, label: "Scorers" },
//               { icon: Video, label: "Streamer" },
//               { icon: Users2, label: "Others" },
//             ].map(({ icon: Icon, label }) => (
//               <button
//                 key={label}
//                 className="flex flex-col items-center gap-2 active:scale-90 transition-transform"
//               >
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-(--color-bg-border) bg-(--color-bg-base) hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint) transition-colors">
//                   <Icon size={20} className="text-(--color-text-secondary)" />
//                 </div>
//                 <span className="text-section-label">{label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Sticky dual footer */}
//       <div className="safe-bottom sticky bottom-0 flex shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card)">
//         <button className="flex flex-1 items-center justify-center py-4 font-(family-name:--font-display) text-xs font-black uppercase tracking-[0.06em] text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors">
//           Schedule Match
//         </button>
//         <div className="h-8 w-px self-center bg-(--color-bg-border)" />
//         <button className="flex flex-1 items-center justify-center gap-1.5 bg-(--color-brand) py-4 font-(family-name:--font-display) text-xs font-black uppercase tracking-[0.06em] text-white shadow-[0_-2px_12px_rgba(27,63,160,0.20)] transition-all active:scale-[0.97]">
//           Next (Toss) <ChevronRight size={14} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MatchDetails;

import { useGetTeamDetailQuery } from "@/store/api/teamApi";
import { User, ClipboardList, Video, Users2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Team } from "@/types/team";
import Image from "next/image";
import {
  selectTeamACaptain,
  selectTeamAKeeper,
  selectTeamBCaptain,
  selectTeamBKeeper,
} from "@/store/startMatch/selectors";
import { useAppSelector } from "@/store/hooks";

// ─── Reusable: captain / keeper pill row inside the hero ──────────────────────

function OfficialRow({
  label,
  name,
}: {
  label: "C" | "WK";
  name: string | undefined;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2 py-1">
      {/* Label — fixed width so names stay aligned across both team columns */}
      <span
        className="w-5 shrink-0 font-(family-name:--font-display) text-[9px] font-black uppercase tracking-widest"
        style={{ color: "var(--color-sky)" }}
      >
        {label}
      </span>
      <span
        className={cn(
          "flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-medium",
          name ? "text-white/65" : "italic text-white/25",
        )}
      >
        {name ?? "Not set"}
      </span>
    </div>
  );
}

// ─── Reusable: one team column (avatar + name + squad badge + officials) ───────

function TeamColumn({
  detail,
  captainName,
  keeperName,
  onClick,
}: {
  detail: { name?: string; logoUrl?: string; memberCount?: number } | undefined;
  captainName: string | undefined;
  keeperName: string | undefined;
  onClick: () => void;
}) {
  return (
    <div
      className="flex flex-1 cursor-pointer flex-col items-center gap-1.5"
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative mb-0.5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4b5563] shadow-[0_4px_16px_rgba(0,0,0,0.30)]">
          {detail?.logoUrl ? (
            <Image
              src={detail.logoUrl}
              alt={detail.name ?? ""}
              height={40}
              width={40}
              className="rounded-full object-cover"
            />
          ) : (
            <span
              className="font-(family-name:--font-display) text-lg font-black text-white"
              style={{ letterSpacing: "0.02em" }}
            >
              {detail?.name?.slice(0, 1).toUpperCase() ?? "?"}
            </span>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-(--color-sky) ring-2 ring-(--color-navy)">
          <User size={10} className="text-white" />
        </div>
      </div>

      {/* Team name */}
      <p
        className="font-(family-name:--font-display) text-xs font-black uppercase text-white"
        style={{ letterSpacing: "0.04em", maxWidth: 96, textAlign: "center" }}
      >
        {detail?.name ?? "—"}
      </p>

      {/* Squad count */}
      <span className="inline-block rounded-full bg-(--color-brand) px-2.5 py-0.5 font-(family-name:--font-display) text-[9px] font-bold uppercase tracking-widest text-white">
        Squad ({detail?.memberCount ?? 0})
      </span>

      {/* ── Captain & Keeper — two compact pills ── */}
      <div className="mt-0.5 flex w-full flex-col gap-1">
        <OfficialRow label="C" name={captainName} />
        <OfficialRow label="WK" name={keeperName} />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const MatchDetails = ({ teamA, teamB }: { teamA: Team; teamB: Team }) => {
  const router = useRouter();

  const { data: teamADetail } = useGetTeamDetailQuery({ teamId: teamA.id });
  const { data: teamBDetail } = useGetTeamDetailQuery({ teamId: teamB.id });

  const teamACaptain = useAppSelector(selectTeamACaptain);
  const teamAKeeper = useAppSelector(selectTeamAKeeper);
  const teamBCaptain = useAppSelector(selectTeamBCaptain);
  const teamBKeeper = useAppSelector(selectTeamBKeeper);

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg-base)">
      {/* ── Team hero banner ─────────────────────────────────── */}
      <div className="relative bg-(--color-navy) px-5 py-5">
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, white 0%, transparent 70%)",
          }}
        />

        <div className="relative flex items-start justify-between gap-2">
          {/* Team A */}
          <TeamColumn
            detail={teamADetail}
            captainName={teamACaptain?.name}
            keeperName={teamAKeeper?.name}
            onClick={() => router.push("/start-match/select-team?team=A")}
          />

          {/* VS diamond — vertically centred against the avatar, not the whole column */}
          <div
            className="mt-4 flex h-9 w-9 shrink-0 items-center justify-center bg-white shadow-[0_2px_12px_rgba(255,255,255,0.25)]"
            style={{ transform: "rotate(45deg)" }}
          >
            <span
              className="font-(family-name:--font-display) text-[9px] font-black text-(--color-navy)"
              style={{ transform: "rotate(-45deg)", letterSpacing: "0.04em" }}
            >
              VS
            </span>
          </div>

          {/* Team B */}
          <TeamColumn
            detail={teamBDetail}
            captainName={teamBCaptain?.name}
            keeperName={teamBKeeper?.name}
            onClick={() => router.push("/start-match/select-team?team=B")}
          />
        </div>
      </div>

      {/* ── Form sections ────────────────────────────────────── */}
      <div className="flex flex-col gap-3 p-4">
        {/* Match Type */}
        <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
          <p className="text-section-label mb-3">
            Match Type <span className="text-(--color-live)">*</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "LIMITED OVERS",
              "BOX/TURF CRICKET",
              "PAIR CRICKET",
              "TEST MATCH",
              "THE HUNDRED",
            ].map((type) => (
              <button
                key={type}
                className={cn(
                  "rounded-full px-4 py-1.5 font-(family-name:--font-display) text-[10px] font-bold uppercase tracking-wide transition-all active:scale-95",
                  type === "LIMITED OVERS"
                    ? "bg-(--color-brand) text-white shadow-[0_2px_8px_rgba(27,63,160,0.25)]"
                    : "bg-(--color-bg-base) text-(--color-text-secondary) hover:bg-(--color-bg-tint) hover:text-(--color-text-primary)",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Overs */}
        <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
          <div className="flex items-end gap-6">
            <div className="flex-1">
              <p className="text-section-label mb-1.5">
                No. of Overs <span className="text-(--color-live)">*</span>
              </p>
              <input
                type="number"
                defaultValue={20}
                className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1 text-xl font-bold text-(--color-text-primary) outline-none transition-colors focus:border-(--color-sky)"
              />
            </div>
            <div className="flex-1">
              <p className="text-section-label mb-1.5">Overs Per Bowler</p>
              <div className="flex items-end justify-between border-b-2 border-(--color-bg-border) pb-1 transition-colors focus-within:border-(--color-sky)">
                <input
                  type="number"
                  defaultValue={4}
                  className="w-full bg-transparent text-xl font-bold text-(--color-text-primary) outline-none"
                />
                <button className="flex items-center gap-0.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-(--color-brand)">
                  Power Play <ChevronRight size={11} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Date */}
        <div className="fixture-bar flex flex-col gap-4 rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
          {[
            {
              label: "City / Town",
              placeholder: "Mumbai",
              required: true,
              defaultValue: "Mumbai",
            },
            {
              label: "Ground",
              placeholder: "Search Ground",
              required: true,
              defaultValue: "",
            },
            {
              label: "Date & Time",
              placeholder: "",
              required: false,
              defaultValue: "Sun, May 24 2026 01:24 PM",
            },
          ].map(({ label, placeholder, required, defaultValue }) => (
            <div key={label}>
              <p className="text-section-label mb-1.5">
                {label}
                {required && (
                  <span className="ml-0.5 text-(--color-live)">*</span>
                )}
              </p>
              <input
                type="text"
                placeholder={placeholder}
                defaultValue={defaultValue}
                className="w-full border-b-2 border-(--color-bg-border) bg-transparent pb-1.5 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) transition-colors focus:border-(--color-sky)"
              />
            </div>
          ))}
        </div>

        {/* Ball Type */}
        <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
          <p className="text-section-label mb-3">
            Ball Type <span className="text-(--color-live)">*</span>
          </p>
          <div className="flex items-end gap-6">
            {[
              { label: "Tennis", color: "#84cc16", selected: true },
              { label: "Leather", color: "#ef4444", selected: false },
              { label: "Other", color: "#f59e0b", selected: false, dot: true },
            ].map(({ label, color, selected, dot }) => (
              <div
                key={label}
                className="flex cursor-pointer flex-col items-center gap-1.5"
              >
                <div
                  className={cn(
                    "h-12 w-12 rounded-full transition-all duration-150",
                    selected &&
                      "ring-[3px] ring-offset-2 ring-offset-(--color-bg-card) shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
                  )}
                  style={{
                    backgroundColor: color,
                    ...(selected ? { ringColor: color } : {}),
                  }}
                >
                  {dot && (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-3 w-3 rounded-full border-2 border-white/60" />
                    </div>
                  )}
                </div>
                <span className="text-section-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wagon Wheel */}
        <div className="flex items-center justify-between rounded-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
          <div>
            <p
              className="font-(family-name:--font-display) text-sm font-black uppercase text-(--color-text-primary)"
              style={{ letterSpacing: "0.04em" }}
            >
              Wagon Wheel
            </p>
            <p className="text-meta mt-0.5">
              Show Wagon Wheel for 1s, 2s, &amp; 3s
            </p>
          </div>
          <div className="flex h-7 w-12 cursor-pointer items-center justify-end rounded-full bg-(--color-brand) p-1">
            <div className="h-5 w-5 rounded-full bg-white shadow-sm" />
          </div>
        </div>

        {/* Pitch Type */}
        <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
          <p className="text-section-label mb-3">Pitch Type</p>
          <div className="flex flex-wrap gap-2">
            {["ROUGH", "CEMENT", "TURF", "ASTROTURF", "MATTING"].map((pt) => (
              <button
                key={pt}
                className="rounded-full border border-(--color-bg-border) bg-(--color-bg-base) px-3 py-1.5 font-(family-name:--font-display) text-[10px] font-bold uppercase tracking-wide text-(--color-text-secondary) transition-all hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint) active:scale-95"
              >
                {pt}
              </button>
            ))}
          </div>
        </div>

        {/* Match Officials */}
        <div className="fixture-bar rounded-r-2xl bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
          <p className="text-section-label mb-4">Match Officials</p>
          <div className="flex items-center justify-around">
            {[
              { icon: User, label: "Umpires" },
              { icon: ClipboardList, label: "Scorers" },
              { icon: Video, label: "Streamer" },
              { icon: Users2, label: "Others" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-2 transition-transform active:scale-90"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-(--color-bg-border) bg-(--color-bg-base) transition-colors hover:border-(--color-sky)/40 hover:bg-(--color-bg-tint)">
                  <Icon size={20} className="text-(--color-text-secondary)" />
                </div>
                <span className="text-section-label">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky dual footer ───────────────────────────────── */}
      <div className="safe-bottom sticky bottom-0 flex shrink-0 border-t border-(--color-bg-border) bg-(--color-bg-card)">
        <button className="flex flex-1 items-center justify-center py-4 font-(family-name:--font-display) text-xs font-black uppercase tracking-[0.06em] text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)">
          Schedule Match
        </button>
        <div className="h-8 w-px self-center bg-(--color-bg-border)" />
        <button className="flex flex-1 items-center justify-center gap-1.5 bg-(--color-brand) py-4 font-(family-name:--font-display) text-xs font-black uppercase tracking-[0.06em] text-white shadow-[0_-2px_12px_rgba(27,63,160,0.20)] transition-all active:scale-[0.97]">
          Next (Toss) <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default MatchDetails;
