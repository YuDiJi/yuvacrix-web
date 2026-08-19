// "use client";

// import { DialogBottom } from "@/components/common/DialogBottom";
// import { FieldZone } from "@/types/scoring";
// import { cn } from "@/lib/cn";

// // -----------------------------------------------------------------------------
// // Types
// // -----------------------------------------------------------------------------

// type ZoneDefinition = {
//   value: FieldZone;
//   label: string;
//   x: number;
//   y: number;
// };

// type WagonWheelDirectionSheetProps = {
//   open: boolean;
//   batRuns: number | null;

//   isRecording: boolean;
//   isUpdatingSettings?: boolean;

//   /**
//    * Current match-level wagon-wheel preferences.
//    */
//   showForRunningRuns: boolean;
//   showForBoundaries: boolean;

//   onClose: () => void;

//   /**
//    * Called when scorer taps a direction on the field.
//    */
//   onSelect: (fieldZone: FieldZone) => void;

//   /**
//    * 1, 2 & 3 group.
//    */
//   onToggleRunningRuns: (enabled: boolean) => Promise<void>;

//   /**
//    * 4 & 6 group.
//    */
//   onToggleBoundaries: (enabled: boolean) => Promise<void>;
// };

// // -----------------------------------------------------------------------------
// // Field constants
// // -----------------------------------------------------------------------------

// const FIELD_SIZE = 360;
// const CENTER = FIELD_SIZE / 2;

// const FIELD_POSITIONS: ZoneDefinition[] = [
//   {
//     value: "DEEP_FINE_LEG",
//     label: "Deep\nfine leg",
//     x: 115,
//     y: 58,
//   },
//   {
//     value: "THIRD_MAN",
//     label: "Third man",
//     x: 245,
//     y: 58,
//   },
//   {
//     value: "DEEP_SQUARE_LEG",
//     label: "Deep\nsquare leg",
//     x: 55,
//     y: 135,
//   },
//   {
//     value: "DEEP_POINT",
//     label: "Deep\npoint",
//     x: 305,
//     y: 135,
//   },
//   {
//     value: "DEEP_MID_WICKET",
//     label: "Deep\nmid wicket",
//     x: 58,
//     y: 235,
//   },
//   {
//     value: "DEEP_COVER",
//     label: "Deep\ncover",
//     x: 302,
//     y: 235,
//   },
//   {
//     value: "LONG_ON",
//     label: "Long on",
//     x: 125,
//     y: 310,
//   },
//   {
//     value: "LONG_OFF",
//     label: "Long off",
//     x: 235,
//     y: 310,
//   },
// ];

// // -----------------------------------------------------------------------------
// // Zone resolution
// // -----------------------------------------------------------------------------

// function getZoneFromPoint(x: number, y: number): FieldZone {
//   const dx = x - CENTER;
//   const dy = CENTER - y;

//   // 90° = top
//   // 0° = right
//   // -90° = bottom
//   // ±180° = left
//   const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

//   const distance = Math.sqrt(dx * dx + dy * dy);

//   const isDeep = distance > 100;

//   // ---------------------------------------------------------------------------
//   // Off side
//   // ---------------------------------------------------------------------------

//   if (angle >= 67.5 && angle < 112.5) {
//     return dx >= 0 ? "THIRD_MAN" : "DEEP_FINE_LEG";
//   }

//   if (angle >= 22.5 && angle < 67.5) {
//     return isDeep ? "DEEP_POINT" : "POINT";
//   }

//   if (angle >= -22.5 && angle < 22.5) {
//     return isDeep ? "DEEP_POINT" : "POINT";
//   }

//   if (angle >= -67.5 && angle < -22.5) {
//     return isDeep ? "DEEP_COVER" : "COVER";
//   }

//   if (angle >= -112.5 && angle < -67.5) {
//     return dx >= 0 ? "LONG_OFF" : "LONG_ON";
//   }

//   // ---------------------------------------------------------------------------
//   // Leg side
//   // ---------------------------------------------------------------------------

//   if (angle >= -157.5 && angle < -112.5) {
//     return isDeep ? "DEEP_MID_WICKET" : "MID_WICKET";
//   }

//   if (angle >= 157.5 || angle < -157.5) {
//     return isDeep ? "DEEP_SQUARE_LEG" : "SQUARE_LEG";
//   }

//   if (angle >= 112.5 && angle < 157.5) {
//     return isDeep ? "DEEP_FINE_LEG" : "FINE_LEG";
//   }

//   return "MID_WICKET";
// }

// // -----------------------------------------------------------------------------
// // Preference row
// // -----------------------------------------------------------------------------

// function WagonWheelPreferenceRow({
//   title,

//   checked,
//   disabled = false,
//   onChange,
// }: {
//   title: string;

//   checked: boolean;
//   disabled?: boolean;
//   onChange: (checked: boolean) => Promise<void>;
// }) {
//   const handleToggle = () => {
//     if (disabled) return;

//     void onChange(!checked);
//   };

//   return (
//     <div className="flex items-center gap-4 border-b border-(--color-bg-border) px-4 py-2 last:border-b-0">
//       <button
//         type="button"
//         disabled={disabled}
//         onClick={handleToggle}
//         className="min-w-0 flex-1 text-left disabled:cursor-not-allowed"
//       >
//         <p className="text-sm font-bold text-(--color-text-primary)">{title}</p>
//       </button>

//       <button
//         type="button"
//         role="switch"
//         aria-checked={checked}
//         aria-label={title}
//         disabled={disabled}
//         onClick={handleToggle}
//         className={cn(
//           "relative h-5 w-8 shrink-0 rounded-full transition-colors",
//           checked ? "bg-(--color-brand)" : "bg-(--color-bg-border)",
//           disabled && "cursor-not-allowed opacity-60",
//         )}
//       >
//         <span
//           className={cn(
//             "absolute left-1 top-1 h-3 w-3 rounded-full bg-white shadow-sm transition-transform",
//             checked ? "translate-x-5" : "translate-x-0",
//           )}
//         />
//       </button>
//     </div>
//   );
// }

// // -----------------------------------------------------------------------------
// // Wagon wheel sheet
// // -----------------------------------------------------------------------------

// export function WagonWheelDirectionSheet({
//   open,
//   batRuns,

//   isRecording,
//   isUpdatingSettings = false,

//   showForRunningRuns,
//   showForBoundaries,

//   onClose,
//   onSelect,

//   onToggleRunningRuns,
//   onToggleBoundaries,
// }: WagonWheelDirectionSheetProps) {
//   const isBusy = isRecording || isUpdatingSettings;

//   // ---------------------------------------------------------------------------
//   // Select field direction
//   // ---------------------------------------------------------------------------

//   const handleGroundClick = (
//     event: React.MouseEvent<SVGSVGElement, MouseEvent>,
//   ) => {
//     if (isBusy) return;

//     const svg = event.currentTarget;
//     const rect = svg.getBoundingClientRect();

//     const x = ((event.clientX - rect.left) / rect.width) * FIELD_SIZE;

//     const y = ((event.clientY - rect.top) / rect.height) * FIELD_SIZE;

//     const dx = x - CENTER;
//     const dy = y - CENTER;

//     const distance = Math.sqrt(dx * dx + dy * dy);

//     // Ignore clicks outside boundary or directly on batter.
//     if (distance > 175 || distance < 18) {
//       return;
//     }

//     const zone = getZoneFromPoint(x, y);

//     onSelect(zone);
//   };

//   // ---------------------------------------------------------------------------
//   // Header label
//   // ---------------------------------------------------------------------------

//   const directionTitle = (() => {
//     if (batRuns === 6) {
//       return "Six Direction";
//     }

//     if (batRuns === 4) {
//       return "Four Direction";
//     }

//     if (batRuns !== null) {
//       return `${batRuns} Run${batRuns === 1 ? "" : "s"} Direction`;
//     }

//     return "Shot Direction";
//   })();

//   // ---------------------------------------------------------------------------
//   // Render
//   // ---------------------------------------------------------------------------

//   return (
//     <DialogBottom
//       open={open}
//       onClose={isBusy ? () => undefined : onClose}
//       className="max-h-[92dvh]"
//     >
//       <div className="flex max-h-[88dvh] min-h-0 flex-col">
//         {/* ------------------------------------------------------------------ */}
//         {/* Scrollable content                                                 */}
//         {/* ------------------------------------------------------------------ */}

//         <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
//           {/* Header */}

//           <div className="shrink-0 text-center">
//             <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--color-text-muted)">
//               Wagon Wheel
//             </p>

//             <h3 className="mt-0.5 font-display text-xl font-black uppercase tracking-[0.04em] text-(--color-navy)">
//               {directionTitle}
//               {/* {" (LHB)"} */}
//             </h3>

//             <p className="mt-1 text-xs text-(--color-text-secondary)">
//               Tap where the batter hit the ball
//             </p>
//           </div>

//           {/* -------------------------------------------------------------- */}
//           {/* Cricket field                                                  */}
//           {/* -------------------------------------------------------------- */}

//           <div className="mt-4 flex items-center justify-center">
//             <div className="relative aspect-square w-full max-w-[390px]">
//               <svg
//                 viewBox={`0 0 ${FIELD_SIZE} ${FIELD_SIZE}`}
//                 className={cn(
//                   "h-full w-full select-none touch-manipulation",
//                   isBusy ? "cursor-not-allowed opacity-70" : "cursor-crosshair",
//                 )}
//                 onClick={handleGroundClick}
//               >
//                 {/* Ground */}

//                 <circle
//                   cx={CENTER}
//                   cy={CENTER}
//                   r="176"
//                   fill="#4D9300"
//                   stroke="#F59E0B"
//                   strokeWidth="2"
//                 />

//                 {/* Boundary */}

//                 <circle
//                   cx={CENTER}
//                   cy={CENTER}
//                   r="160"
//                   fill="none"
//                   stroke="rgba(255,255,255,0.95)"
//                   strokeWidth="2"
//                 />

//                 {/* Inner field */}

//                 <circle
//                   cx={CENTER}
//                   cy={CENTER}
//                   r="78"
//                   fill="none"
//                   stroke="rgba(255,255,255,0.35)"
//                 />

//                 {/* -------------------------------------------------------- */}
//                 {/* Radial zone lines                                        */}
//                 {/* -------------------------------------------------------- */}

//                 <line
//                   x1={CENTER}
//                   y1="20"
//                   x2={CENTER}
//                   y2="340"
//                   stroke="rgba(255,255,255,0.55)"
//                 />

//                 <line
//                   x1="20"
//                   y1={CENTER}
//                   x2="340"
//                   y2={CENTER}
//                   stroke="rgba(255,255,255,0.55)"
//                 />

//                 <line
//                   x1="67"
//                   y1="67"
//                   x2="293"
//                   y2="293"
//                   stroke="rgba(255,255,255,0.35)"
//                 />

//                 <line
//                   x1="293"
//                   y1="67"
//                   x2="67"
//                   y2="293"
//                   stroke="rgba(255,255,255,0.35)"
//                 />

//                 {/* Pitch */}

//                 <rect x="170" y="142" width="20" height="76" fill="#D9BD74" />

//                 {/* Leg side */}

//                 <text
//                   x="105"
//                   y="176"
//                   textAnchor="middle"
//                   fill="rgba(255,255,255,0.5)"
//                   fontSize="15"
//                   fontWeight="700"
//                 >
//                   Leg
//                 </text>

//                 {/* Off side */}

//                 <text
//                   x="255"
//                   y="176"
//                   textAnchor="middle"
//                   fill="rgba(255,255,255,0.5)"
//                   fontSize="15"
//                   fontWeight="700"
//                 >
//                   Off
//                 </text>

//                 {/* -------------------------------------------------------- */}
//                 {/* Field position labels                                    */}
//                 {/* -------------------------------------------------------- */}

//                 {FIELD_POSITIONS.map((position) => {
//                   const lines = position.label.split("\n");

//                   return (
//                     <g key={position.value} className="pointer-events-none">
//                       <circle
//                         cx={position.x}
//                         cy={position.y - 12}
//                         r="4"
//                         fill="rgba(34,197,94,0.75)"
//                       />

//                       <text
//                         x={position.x}
//                         y={position.y}
//                         textAnchor="middle"
//                         fill="rgba(255,255,255,0.55)"
//                         fontSize="10"
//                       >
//                         {lines.map((line, index) => (
//                           <tspan
//                             key={`${position.value}-${line}`}
//                             x={position.x}
//                             dy={index === 0 ? 0 : 11}
//                           >
//                             {line}
//                           </tspan>
//                         ))}
//                       </text>
//                     </g>
//                   );
//                 })}

//                 {/* -------------------------------------------------------- */}
//                 {/* Batter                                                   */}
//                 {/* -------------------------------------------------------- */}

//                 <g
//                   transform={`translate(${CENTER - 15}, ${CENTER - 50})`}
//                   className="pointer-events-none"
//                 >
//                   {/* Head */}

//                   <circle cx="15" cy="5" r="3.5" fill="#0D1B3E" />

//                   {/* Body */}

//                   <path
//                     d="
//                       M14 9
//                       C12 12 11 17 11 22
//                       L15 25
//                       L19 21
//                       C18 16 18 12 17 9
//                       Z
//                     "
//                     fill="#0D1B3E"
//                   />

//                   {/* Back leg */}

//                   <path
//                     d="M14 23 L10 32"
//                     stroke="#0D1B3E"
//                     strokeWidth="3.5"
//                     strokeLinecap="round"
//                   />

//                   {/* Front leg */}

//                   <path
//                     d="M17 23 L21 31"
//                     stroke="#0D1B3E"
//                     strokeWidth="3.5"
//                     strokeLinecap="round"
//                   />

//                   {/* Arms */}

//                   <path
//                     d="M13 12 L19 15 L22 12"
//                     stroke="#0D1B3E"
//                     strokeWidth="3"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     fill="none"
//                   />

//                   {/* Bat handle */}

//                   <path
//                     d="M21 12 L24 8"
//                     stroke="#0D1B3E"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                   />

//                   {/* Bat blade */}

//                   <path
//                     d="M24 8 L28 -2"
//                     stroke="#D5B56E"
//                     strokeWidth="4"
//                     strokeLinecap="round"
//                   />
//                 </g>
//               </svg>
//             </div>
//           </div>

//           {/* -------------------------------------------------------------- */}
//           {/* Wagon-wheel preferences                                        */}
//           {/* -------------------------------------------------------------- */}

//           <div className="mt-4 pt-4">
//             <div className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)">
//               {/* 1, 2 & 3 */}

//               <WagonWheelPreferenceRow
//                 title="Show for 1s, 2s & 3s"
//                 checked={showForRunningRuns}
//                 disabled={isBusy}
//                 onChange={onToggleRunningRuns}
//               />

//               {/* 4 & 6 */}

//               <WagonWheelPreferenceRow
//                 title="Show for 4s & 6s"
//                 checked={showForBoundaries}
//                 disabled={isBusy}
//                 onChange={onToggleBoundaries}
//               />
//             </div>

//             {isUpdatingSettings && (
//               <p className="mt-2 text-center text-[11px] font-medium text-(--color-text-muted)">
//                 Updating wagon wheel preferences...
//               </p>
//             )}
//           </div>

//           <div className="h-2" />
//         </div>
//       </div>
//     </DialogBottom>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import { DialogBottom } from "@/components/common/DialogBottom";
import { FieldZone } from "@/types/scoring";
import { cn } from "@/lib/cn";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type BattingHand = "RHB" | "LHB";

type ZoneDefinition = {
  value: FieldZone;
  label: string;
  x: number;
  y: number;
};

type WagonWheelDirectionSheetProps = {
  open: boolean;
  batRuns: number | null;

  isRecording: boolean;
  isUpdatingSettings?: boolean;

  showForRunningRuns: boolean;
  showForBoundaries: boolean;

  onClose: () => void;

  onSelect: (fieldZone: FieldZone) => void;

  onToggleRunningRuns: (enabled: boolean) => Promise<void>;
  onToggleBoundaries: (enabled: boolean) => Promise<void>;
};

// -----------------------------------------------------------------------------
// Field constants
// -----------------------------------------------------------------------------

const FIELD_SIZE = 360;
const CENTER = FIELD_SIZE / 2;

/**
 * Canonical orientation = RIGHT-HANDED BATTER.
 *
 * RHB:
 *
 *                THIRD MAN | DEEP FINE LEG
 *      DEEP POINT           |           DEEP SQUARE LEG
 *
 *               OFF        |        LEG
 *
 *      DEEP COVER           |           DEEP MID WICKET
 *                 LONG OFF | LONG ON
 */
const RHB_FIELD_POSITIONS: ZoneDefinition[] = [
  {
    value: "THIRD_MAN",
    label: "Third man",
    x: 115,
    y: 58,
  },
  {
    value: "DEEP_FINE_LEG",
    label: "Deep\nfine leg",
    x: 245,
    y: 58,
  },
  {
    value: "DEEP_POINT",
    label: "Deep\npoint",
    x: 55,
    y: 135,
  },
  {
    value: "DEEP_SQUARE_LEG",
    label: "Deep\nsquare leg",
    x: 305,
    y: 135,
  },
  {
    value: "DEEP_COVER",
    label: "Deep\ncover",
    x: 58,
    y: 235,
  },
  {
    value: "DEEP_MID_WICKET",
    label: "Deep\nmid wicket",
    x: 302,
    y: 235,
  },
  {
    value: "LONG_OFF",
    label: "Long off",
    x: 125,
    y: 310,
  },
  {
    value: "LONG_ON",
    label: "Long on",
    x: 235,
    y: 310,
  },
];

function getFieldPositions(hand: BattingHand): ZoneDefinition[] {
  if (hand === "RHB") {
    return RHB_FIELD_POSITIONS;
  }

  // Mirror the RHB field horizontally to create LHB.
  return RHB_FIELD_POSITIONS.map((position) => ({
    ...position,
    x: FIELD_SIZE - position.x,
  }));
}

// -----------------------------------------------------------------------------
// Zone resolution
// -----------------------------------------------------------------------------
//
// This function uses your ORIGINAL / LHB coordinate orientation.
// For RHB we mirror X before sending the point here.
//

function getZoneFromPoint(x: number, y: number): FieldZone {
  const dx = x - CENTER;
  const dy = CENTER - y;

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  const distance = Math.sqrt(dx * dx + dy * dy);

  const isDeep = distance > 100;

  // Top
  if (angle >= 67.5 && angle < 112.5) {
    return dx >= 0 ? "THIRD_MAN" : "DEEP_FINE_LEG";
  }

  // Upper-right
  if (angle >= 22.5 && angle < 67.5) {
    return isDeep ? "DEEP_POINT" : "POINT";
  }

  // Right
  if (angle >= -22.5 && angle < 22.5) {
    return isDeep ? "DEEP_POINT" : "POINT";
  }

  // Lower-right
  if (angle >= -67.5 && angle < -22.5) {
    return isDeep ? "DEEP_COVER" : "COVER";
  }

  // Bottom
  if (angle >= -112.5 && angle < -67.5) {
    return dx >= 0 ? "LONG_OFF" : "LONG_ON";
  }

  // Lower-left
  if (angle >= -157.5 && angle < -112.5) {
    return isDeep ? "DEEP_MID_WICKET" : "MID_WICKET";
  }

  // Left
  if (angle >= 157.5 || angle < -157.5) {
    return isDeep ? "DEEP_SQUARE_LEG" : "SQUARE_LEG";
  }

  // Upper-left
  if (angle >= 112.5 && angle < 157.5) {
    return isDeep ? "DEEP_FINE_LEG" : "FINE_LEG";
  }

  return "MID_WICKET";
}

// -----------------------------------------------------------------------------
// Batting hand selector
// -----------------------------------------------------------------------------

function BattingHandSelector({
  value,
  disabled,
  onChange,
}: {
  value: BattingHand;
  disabled?: boolean;
  onChange: (hand: BattingHand) => void;
}) {
  return (
    <div className="mx-auto mt-3 flex w-fit rounded-xl bg-(--color-bg-base) p-1">
      {(["RHB", "LHB"] as BattingHand[]).map((hand) => {
        const selected = value === hand;

        return (
          <button
            key={hand}
            type="button"
            disabled={disabled}
            onClick={() => onChange(hand)}
            className={cn(
              "min-w-16 rounded-lg px-4 py-1.5",
              "font-display text-xs font-black uppercase tracking-wider",
              "transition-all duration-150",
              selected
                ? "bg-(--color-brand) text-white shadow-sm"
                : "text-(--color-text-secondary)",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            {hand}
          </button>
        );
      })}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Preference row
// -----------------------------------------------------------------------------

function WagonWheelPreferenceRow({
  title,
  checked,
  disabled = false,
  onChange,
}: {
  title: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => Promise<void>;
}) {
  const handleToggle = () => {
    if (disabled) return;

    void onChange(!checked);
  };

  return (
    <div className="flex items-center gap-4 border-b border-(--color-bg-border) px-4 py-2 last:border-b-0">
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className="min-w-0 flex-1 text-left disabled:cursor-not-allowed"
      >
        <p className="text-sm font-bold text-(--color-text-primary)">{title}</p>
      </button>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "relative h-5 w-8 shrink-0 rounded-full transition-colors",
          checked ? "bg-(--color-brand)" : "bg-(--color-bg-border)",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span
          className={cn(
            "absolute left-1 top-1 h-3 w-3 rounded-full bg-white shadow-sm",
            "transition-transform",
            checked ? "translate-x-3" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Wagon wheel
// -----------------------------------------------------------------------------

export function WagonWheelDirectionSheet({
  open,
  batRuns,

  isRecording,
  isUpdatingSettings = false,

  showForRunningRuns,
  showForBoundaries,

  onClose,
  onSelect,

  onToggleRunningRuns,
  onToggleBoundaries,
}: WagonWheelDirectionSheetProps) {
  /**
   * Default is RHB.
   *
   * IMPORTANT:
   * Do NOT reset this inside onClose.
   *
   * Because DialogBottom stays mounted, if scorer switches to LHB,
   * closes this wagon wheel, then later records another 4/6,
   * LHB remains selected.
   */
  const [battingHand, setBattingHand] = useState<BattingHand>("RHB");

  const isBusy = isRecording || isUpdatingSettings;

  const fieldPositions = useMemo(
    () => getFieldPositions(battingHand),
    [battingHand],
  );

  // ---------------------------------------------------------------------------
  // Ground click
  // ---------------------------------------------------------------------------

  const handleGroundClick = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => {
    if (isBusy) return;

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * FIELD_SIZE;
    const y = ((event.clientY - rect.top) / rect.height) * FIELD_SIZE;

    const dx = x - CENTER;
    const dy = y - CENTER;

    const distance = Math.sqrt(dx * dx + dy * dy);

    // Ignore outside the field and directly on batter.
    if (distance > 175 || distance < 18) {
      return;
    }

    /**
     * getZoneFromPoint currently understands your old LHB orientation.
     *
     * LHB:
     * use clicked X directly.
     *
     * RHB:
     * mirror the click horizontally before resolving the field zone.
     */
    const normalizedX = battingHand === "RHB" ? FIELD_SIZE - x : x;

    const zone = getZoneFromPoint(normalizedX, y);

    onSelect(zone);
  };

  // ---------------------------------------------------------------------------
  // Header
  // ---------------------------------------------------------------------------

  const directionTitle = (() => {
    if (batRuns === 6) {
      return "Six Direction";
    }

    if (batRuns === 4) {
      return "Four Direction";
    }

    if (batRuns !== null) {
      return `${batRuns} Run${batRuns === 1 ? "" : "s"} Direction`;
    }

    return "Shot Direction";
  })();

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <DialogBottom
      open={open}
      onClose={isBusy ? () => undefined : onClose}
      className="max-h-[92dvh]"
    >
      <div className="flex max-h-[88dvh] min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
          {/* Header */}
          <div className="shrink-0 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--color-text-muted)">
              Wagon Wheel
            </p>

            <h3 className="mt-0.5 font-display text-xl font-black uppercase tracking-[0.04em] text-(--color-navy)">
              {directionTitle} ({battingHand})
            </h3>

            <p className="mt-1 text-xs text-(--color-text-secondary)">
              Tap where the batter hit the ball
            </p>

            <BattingHandSelector
              value={battingHand}
              disabled={isBusy}
              onChange={setBattingHand}
            />
          </div>

          {/* Cricket field */}
          <div className="mt-4 flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-[390px]">
              <svg
                viewBox={`0 0 ${FIELD_SIZE} ${FIELD_SIZE}`}
                className={cn(
                  "h-full w-full select-none touch-manipulation",
                  isBusy ? "cursor-not-allowed opacity-70" : "cursor-crosshair",
                )}
                onClick={handleGroundClick}
              >
                {/* Ground */}
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r="176"
                  fill="#4D9300"
                  stroke="#F59E0B"
                  strokeWidth="2"
                />

                {/* Boundary */}
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r="160"
                  fill="none"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="2"
                />

                {/* Inner field */}
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r="78"
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                />

                {/* Radial lines */}
                <line
                  x1={CENTER}
                  y1="20"
                  x2={CENTER}
                  y2="340"
                  stroke="rgba(255,255,255,0.55)"
                />

                <line
                  x1="20"
                  y1={CENTER}
                  x2="340"
                  y2={CENTER}
                  stroke="rgba(255,255,255,0.55)"
                />

                <line
                  x1="67"
                  y1="67"
                  x2="293"
                  y2="293"
                  stroke="rgba(255,255,255,0.35)"
                />

                <line
                  x1="293"
                  y1="67"
                  x2="67"
                  y2="293"
                  stroke="rgba(255,255,255,0.35)"
                />

                {/* Pitch */}
                <rect x="170" y="142" width="20" height="76" fill="#D9BD74" />

                {/* Left side */}
                <text
                  x="105"
                  y="176"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.5)"
                  fontSize="15"
                  fontWeight="700"
                  className="pointer-events-none"
                >
                  {battingHand === "RHB" ? "Off" : "Leg"}
                </text>

                {/* Right side */}
                <text
                  x="255"
                  y="176"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.5)"
                  fontSize="15"
                  fontWeight="700"
                  className="pointer-events-none"
                >
                  {battingHand === "RHB" ? "Leg" : "Off"}
                </text>

                {/* Field labels */}
                {fieldPositions.map((position) => {
                  const lines = position.label.split("\n");

                  return (
                    <g key={position.value} className="pointer-events-none">
                      <circle
                        cx={position.x}
                        cy={position.y - 12}
                        r="4"
                        fill="rgba(34,197,94,0.75)"
                      />

                      <text
                        x={position.x}
                        y={position.y}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.55)"
                        fontSize="10"
                      >
                        {lines.map((line, index) => (
                          <tspan
                            key={`${position.value}-${line}`}
                            x={position.x}
                            dy={index === 0 ? 0 : 11}
                          >
                            {line}
                          </tspan>
                        ))}
                      </text>
                    </g>
                  );
                })}

                {/* Batter */}
                <g
                  transform={
                    battingHand === "LHB"
                      ? `translate(${CENTER - 15}, ${CENTER - 50})`
                      : `translate(${CENTER + 15}, ${CENTER - 50}) scale(-1 1)`
                  }
                  className="pointer-events-none"
                >
                  {/* Head */}
                  <circle cx="15" cy="5" r="3.5" fill="#0D1B3E" />

                  {/* Body */}
                  <path
                    d="
                      M14 9
                      C12 12 11 17 11 22
                      L15 25
                      L19 21
                      C18 16 18 12 17 9
                      Z
                    "
                    fill="#0D1B3E"
                  />

                  {/* Back leg */}
                  <path
                    d="M14 23 L10 32"
                    stroke="#0D1B3E"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Front leg */}
                  <path
                    d="M17 23 L21 31"
                    stroke="#0D1B3E"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Arms */}
                  <path
                    d="M13 12 L19 15 L22 12"
                    stroke="#0D1B3E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />

                  {/* Bat handle */}
                  <path
                    d="M21 12 L24 8"
                    stroke="#0D1B3E"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Bat blade */}
                  <path
                    d="M24 8 L28 -2"
                    stroke="#D5B56E"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>
          </div>

          {/* Preferences */}
          <div className="mt-4 pt-4">
            <div className="overflow-hidden rounded-2xl border border-(--color-bg-border) bg-(--color-bg-card)">
              <WagonWheelPreferenceRow
                title="Show for 1s, 2s & 3s"
                checked={showForRunningRuns}
                disabled={isBusy}
                onChange={onToggleRunningRuns}
              />

              <WagonWheelPreferenceRow
                title="Show for 4s & 6s"
                checked={showForBoundaries}
                disabled={isBusy}
                onChange={onToggleBoundaries}
              />
            </div>

            {isUpdatingSettings && (
              <p className="mt-2 text-center text-[11px] font-medium text-(--color-text-muted)">
                Updating wagon wheel preferences...
              </p>
            )}
          </div>

          <div className="h-2" />
        </div>
      </div>
    </DialogBottom>
  );
}
