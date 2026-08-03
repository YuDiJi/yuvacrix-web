// src/app/(app)/scoring/_components/BallChip.tsx
// ─── Parses ball symbol and renders the correct chip ─────────────────────────
//
// Symbol patterns from backend:
//   "0"          → dot ball
//   "1"–"3","7"  → runs (white bg)
//   "4"          → boundary four (green)
//   "6"          → six (amber)
//   "W"          → wicket (red)
//   "2NO_BALL"   → 2 runs + NB badge (purple/blue tint)
//   "1WIDE"      → wide + runs (grey tint)
//   "3BYE"       → bye runs (grey tint)
//   "2LEG_BYE"   → leg bye runs (grey tint)

import { cn } from "@/lib/cn";
import { OverBall } from "@/types/innings";
import { ExtraType } from "@/types/scoring";

// ─── Parse symbol into display parts ─────────────────────────────────────────

interface ParsedBall {
  runDisplay: string; // what goes inside the circle
  extraLabel: string; // what goes below (NB, WD, B, LB) — empty if none
  extraKind: ExtraType | null;
  isFour: boolean;
  isSix: boolean;
  isWicket: boolean;
  isDot: boolean;
}

// ─── Colour config ────────────────────────────────────────────────────────────

function parseBall(ball: OverBall): ParsedBall {
  const sym = (ball.symbol ?? "").trim().toUpperCase();

  /*
   * Extras must be checked before wickets because:
   * WD starts with W but is a wide, not a wicket.
   *
   * Supported formats:
   * WD, 2WD
   * WIDE, 2WIDE
   * NB, 2NB
   * NO_BALL, 2NO_BALL
   * B, 2B
   * BYE, 2BYE
   * LB, 2LB
   * LEG_BYE, 2LEG_BYE
   */

  const extraPatterns: Array<{
    suffixes: string[];
    kind: ExtraType;
    label: string;
  }> = [
    {
      suffixes: ["LEG_BYE", "LB"],
      kind: "LEG_BYE",
      label: "LB",
    },
    {
      suffixes: ["NO_BALL", "NB"],
      kind: "NO_BALL",
      label: "NB",
    },
    {
      suffixes: ["WIDE", "WD"],
      kind: "WIDE",
      label: "WD",
    },
    {
      suffixes: ["BYE", "B"],
      kind: "BYE",
      label: "BYE",
    },
  ];

  for (const pattern of extraPatterns) {
    const matchedSuffix = pattern.suffixes.find((suffix) =>
      sym.endsWith(suffix),
    );

    if (!matchedSuffix) continue;

    const runPart = sym.slice(0, -matchedSuffix.length);

    const parsedRuns = Number.parseInt(runPart, 10);

    const runs = Number.isNaN(parsedRuns) ? (ball.runs ?? 0) : parsedRuns;

    return {
      runDisplay: String(runs),
      extraLabel: pattern.label,
      extraKind: pattern.kind,
      isFour: false,
      isSix: false,
      isWicket: false,
      isDot: false,
    };
  }

  /*
   * Wickets:
   * W
   * 0W
   * 1W
   * BW
   *
   * Prefer ball.isWicket because symbols can vary.
   */
  if (ball.isWicket) {
    const numericRunMatch = sym.match(/^(\d+)W$/);
    const runsBeforeWicket = numericRunMatch?.[1];

    return {
      runDisplay:
        runsBeforeWicket && runsBeforeWicket !== "0"
          ? `${runsBeforeWicket}W`
          : "W",
      extraLabel: "",
      extraKind: null,
      isFour: false,
      isSix: false,
      isWicket: true,
      isDot: false,
    };
  }

  const runs = ball.runs ?? Number.parseInt(sym, 10);

  if (runs === 0 || sym === "0") {
    return {
      runDisplay: "•",
      extraLabel: "",
      extraKind: null,
      isFour: false,
      isSix: false,
      isWicket: false,
      isDot: true,
    };
  }

  if (runs === 4) {
    return {
      runDisplay: "4",
      extraLabel: "",
      extraKind: null,
      isFour: true,
      isSix: false,
      isWicket: false,
      isDot: false,
    };
  }

  if (runs === 6) {
    return {
      runDisplay: "6",
      extraLabel: "",
      extraKind: null,
      isFour: false,
      isSix: true,
      isWicket: false,
      isDot: false,
    };
  }

  return {
    runDisplay: Number.isNaN(runs) ? sym : String(runs),
    extraLabel: "",
    extraKind: null,
    isFour: false,
    isSix: false,
    isWicket: false,
    isDot: false,
  };
}

function getBallStyle(p: ParsedBall): {
  circleCls: string;
  textCls: string;
  borderCls: string;
} {
  if (p.isWicket) {
    return {
      circleCls: "bg-(--color-live)",
      textCls: "text-white",
      borderCls: "border-transparent",
    };
  }
  if (p.isFour) {
    return {
      circleCls: "bg-(--color-four)",
      textCls: "text-white",
      borderCls: "border-transparent",
    };
  }
  if (p.isSix) {
    return {
      circleCls: "bg-(--color-six)",
      textCls: "text-white",
      borderCls: "border-transparent",
    };
  }
  if (p.isDot) {
    return {
      circleCls: "bg-white",
      textCls: "text-(--color-text-muted)",
      borderCls: "border-(--color-bg-border)",
    };
  }
  if (p.extraKind === "NO_BALL") {
    return {
      circleCls: "bg-white",
      textCls: "text-(--color-brand)",
      borderCls: "border-(--color-brand)",
    };
  }
  if (p.extraKind === "WIDE") {
    return {
      circleCls: "bg-white",
      textCls: "text-(--color-text-secondary)",
      borderCls: "border-(--color-text-muted)",
    };
  }
  if (p.extraKind === "BYE" || p.extraKind === "LEG_BYE") {
    return {
      circleCls: "bg-white",
      textCls: "text-(--color-text-secondary)",
      borderCls: "border-(--color-text-muted)",
      // dashed border to match CricHeroes BYE/LB style
    };
  }
  // Plain runs 1,2,3,5,7 — white circle, navy text
  return {
    circleCls: "bg-white",
    textCls: "text-(--color-navy)",
    borderCls: "border-(--color-bg-border)",
  };
}

// ─── BallChip ─────────────────────────────────────────────────────────────────

export function BallChip({ ball }: { ball: OverBall }) {
  const parsed = parseBall(ball);
  const style = getBallStyle(parsed);

  const isDashed = parsed.extraKind === "BYE" || parsed.extraKind === "LEG_BYE";

  return (
    <div className="flex shrink-0 flex-col items-center gap-0.5">
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border shadow-sm",
          style.circleCls,
          style.textCls,
          style.borderCls,
          isDashed && "border-dashed",
        )}
      >
        <span className="font-(family-name:--font-display) text-[10px] font-black leading-none">
          {parsed.runDisplay}
        </span>
      </div>

      {/* Extra label below the circle */}
      {parsed.extraLabel && (
        <span
          className={cn(
            "font-(family-name:--font-display) text-[8px] font-bold uppercase leading-none",
            parsed.extraKind === "NO_BALL"
              ? "text-(--color-brand)"
              : parsed.extraKind === "WIDE"
                ? "text-(--color-text-muted)"
                : "text-(--color-text-muted)",
          )}
        >
          {parsed.extraLabel}
        </span>
      )}
    </div>
  );
}
