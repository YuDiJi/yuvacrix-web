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

function parseBall(ball: OverBall): ParsedBall {
  const sym = ball.symbol ?? "";

  // Wicket
  if (ball.isWicket || sym === "W" || sym.startsWith("W")) {
    const runPart = sym.replace(/^W/, "").replace(/[A-Z_]+$/, "");
    return {
      runDisplay: runPart ? `${runPart}W` : "W",
      extraLabel: "",
      extraKind: null,
      isFour: false,
      isSix: false,
      isWicket: true,
      isDot: false,
    };
  }

  // Extras — symbol like "2NO_BALL", "3WIDE", "3BYE", "2LEG_BYE", "1WIDE"
  const extraMap: Record<string, ExtraType> = {
    LEG_BYE: "LEG_BYE",
    NO_BALL: "NO_BALL",
    WIDE: "WIDE",
    BYE: "BYE",
  };

  const extraLabelMap: Record<string, string> = {
    LEG_BYE: "LB",
    NO_BALL: "NB",
    WIDE: "WD",
    BYE: "BYE",
  };

  for (const [key, kind] of Object.entries(extraMap)) {
    if (sym.endsWith(key)) {
      //   const runPart = sym.replace(key, "").replace(/_/g, "");
      //   const runs = runPart === "" ? "0" : runPart;

      const runs = sym.slice(0, -key.length) || "0";
      return {
        runDisplay: runs,
        extraLabel: extraLabelMap[key],
        extraKind: kind,
        isFour: false,
        isSix: false,
        isWicket: false,
        isDot: false,
      };
    }
  }

  // Pure run values
  const num = parseInt(sym, 10);
  if (sym === "0" || num === 0) {
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
  if (num === 4) {
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
  if (num === 6) {
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

  // 1, 2, 3, 5, 7 — plain runs
  return {
    runDisplay: String(num),
    extraLabel: "",
    extraKind: null,
    isFour: false,
    isSix: false,
    isWicket: false,
    isDot: false,
  };
}

// ─── Colour config ────────────────────────────────────────────────────────────

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
