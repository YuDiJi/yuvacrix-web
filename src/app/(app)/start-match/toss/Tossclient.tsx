"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAppSelector } from "@/store/hooks";
import { selectTeamA, selectTeamB } from "@/store/startMatch/selectors";
import { useHeader } from "@/providers/HeaderProvider";

// ─── Types ────────────────────────────────────────────────────────────────────

type CoinFace = "heads" | "tails";
type Decision = "BAT" | "BOWL" | null;
type FlipState = "idle" | "flipping" | "done";

// ─── Coin SVG faces — realistic Indian Rupee coin ────────────────────────────

/**
 * HEADS — obverse face of the Indian ₹ coin.
 * Gold body, "INDIA / भारत" text, large ₹ symbol in the centre.
 */
function CoinHeads() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      {/* Coin body */}
      <circle
        cx="60"
        cy="60"
        r="58"
        fill="#C8A84B"
        stroke="#8A6010"
        strokeWidth="2.5"
      />
      {/* Mid ring — raised rim effect */}
      <circle
        cx="60"
        cy="60"
        r="52"
        fill="#D4B05A"
        stroke="#B8942A"
        strokeWidth="1"
      />
      {/* Inner field */}
      <circle
        cx="60"
        cy="60"
        r="47"
        fill="#D4B05A"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.5"
      />

      {/* "INDIA" arc — top */}
      <text
        x="60"
        y="30"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="11"
        fontWeight="700"
        fill="#5C3E0A"
        letterSpacing="2.5"
      >
        INDIA
      </text>

      {/* Thin horizontal dividers */}
      <line
        x1="22"
        y1="35"
        x2="98"
        y2="35"
        stroke="#A07830"
        strokeWidth="0.5"
        opacity="0.4"
      />
      <line
        x1="22"
        y1="87"
        x2="98"
        y2="87"
        stroke="#A07830"
        strokeWidth="0.5"
        opacity="0.4"
      />

      {/* ₹ symbol — centrepiece */}
      <text
        x="60"
        y="73"
        textAnchor="middle"
        fontFamily="'Noto Sans', system-ui, sans-serif"
        fontSize="42"
        fontWeight="900"
        fill="#5C3E0A"
      >
        ₹
      </text>

      {/* "भारत" — bottom */}
      <text
        x="60"
        y="100"
        textAnchor="middle"
        fontFamily="'Noto Sans Devanagari', system-ui, sans-serif"
        fontSize="11"
        fontWeight="700"
        fill="#5C3E0A"
        letterSpacing="1.5"
      >
        भारत
      </text>

      {/* Milled edge dots */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i / 36) * Math.PI * 2;
        const x = 60 + 55.5 * Math.cos(angle);
        const y = 60 + 55.5 * Math.sin(angle);
        return (
          <circle key={i} cx={x} cy={y} r="1" fill="#8A6010" opacity="0.5" />
        );
      })}
    </svg>
  );
}

/**
 * TAILS — reverse face of the Indian ₹ coin.
 * Ashoka Lion Capital (simplified) + "SATYAMEVA JAYATE" motto.
 */
function CoinTails() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      {/* Coin body */}
      <circle
        cx="60"
        cy="60"
        r="58"
        fill="#C8A84B"
        stroke="#8A6010"
        strokeWidth="2.5"
      />
      <circle
        cx="60"
        cy="60"
        r="52"
        fill="#D4B05A"
        stroke="#B8942A"
        strokeWidth="1"
      />
      <circle
        cx="60"
        cy="60"
        r="47"
        fill="#D4B05A"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.5"
      />

      {/* ── Simplified Ashoka Lion Capital ── */}
      {/* Base / abacus */}
      <rect
        x="38"
        y="78"
        width="44"
        height="5"
        rx="1"
        fill="#5C3E0A"
        opacity="0.85"
      />
      {/* Dharma wheel (simplified) */}
      <circle
        cx="60"
        cy="75"
        r="5"
        fill="none"
        stroke="#5C3E0A"
        strokeWidth="1.2"
        opacity="0.85"
      />
      <line
        x1="60"
        y1="70"
        x2="60"
        y2="80"
        stroke="#5C3E0A"
        strokeWidth="0.8"
        opacity="0.7"
      />
      <line
        x1="55"
        y1="75"
        x2="65"
        y2="75"
        stroke="#5C3E0A"
        strokeWidth="0.8"
        opacity="0.7"
      />
      {/* Pillar shaft */}
      <rect
        x="57"
        y="55"
        width="6"
        height="20"
        rx="1"
        fill="#5C3E0A"
        opacity="0.75"
      />
      {/* Lion body — left */}
      <ellipse cx="47" cy="52" rx="9" ry="6" fill="#5C3E0A" opacity="0.85" />
      <circle cx="42" cy="46" r="5.5" fill="#5C3E0A" opacity="0.85" />
      {/* Lion body — right */}
      <ellipse cx="73" cy="52" rx="9" ry="6" fill="#5C3E0A" opacity="0.85" />
      <circle cx="78" cy="46" r="5.5" fill="#5C3E0A" opacity="0.85" />
      {/* Centre lion (facing front) */}
      <ellipse cx="60" cy="50" rx="7" ry="5" fill="#5C3E0A" opacity="0.9" />
      <circle cx="60" cy="44" r="5" fill="#5C3E0A" opacity="0.9" />
      {/* Mane detail lines */}
      <path
        d="M55 43 Q57 40 60 43 Q63 40 65 43"
        fill="none"
        stroke="#D4B05A"
        strokeWidth="0.8"
        opacity="0.5"
      />

      {/* Motto */}
      <text
        x="60"
        y="96"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="8.5"
        fontWeight="700"
        fill="#5C3E0A"
        letterSpacing="0.8"
      >
        SATYAMEVA JAYATE
      </text>

      {/* Year */}
      <text
        x="60"
        y="28"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="10"
        fontWeight="700"
        fill="#5C3E0A"
        letterSpacing="1.5"
      >
        भारत गणराज्य
      </text>

      {/* Milled edge dots */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i / 36) * Math.PI * 2;
        const x = 60 + 55.5 * Math.cos(angle);
        const y = 60 + 55.5 * Math.sin(angle);
        return (
          <circle key={i} cx={x} cy={y} r="1" fill="#8A6010" opacity="0.5" />
        );
      })}
    </svg>
  );
}

// ─── Team Avatar ──────────────────────────────────────────────────────────────

function TeamAvatar({
  name,
  logoUrl,
  size = "lg",
}: {
  name: string;
  logoUrl?: string | null;
  size?: "sm" | "lg";
}) {
  const dim = size === "lg" ? "w-16 h-16" : "w-10 h-10";
  const textSize = size === "lg" ? "text-xl" : "text-sm";

  if (logoUrl) {
    return (
      <div className={cn("rounded-full overflow-hidden flex-shrink-0", dim)}>
        <Image
          src={logoUrl}
          alt={name}
          width={size === "lg" ? 64 : 40}
          height={size === "lg" ? 64 : 40}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  // Placeholder: initials on dark circle
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--color-navy)]",
        dim,
      )}
    >
      <span
        className={cn(
          "font-[family-name:var(--font-display)] font-black text-white",
          textSize,
        )}
      >
        {initials}
      </span>
    </div>
  );
}

// ─── Team Winner Card ─────────────────────────────────────────────────────────

function TeamWinnerCard({
  name,
  logoUrl,
  selected,
  onSelect,
}: {
  name: string;
  logoUrl?: string | null;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex-1 flex flex-col items-center gap-3 py-5 px-3 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97]",
        selected
          ? "border-[var(--color-brand)] bg-[var(--color-bg-tint)] shadow-[0_4px_16px_rgba(27,63,160,0.14)]"
          : "border-[var(--color-bg-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-brand)]/30",
      )}
    >
      <TeamAvatar name={name} logoUrl={logoUrl} size="lg" />
      <span
        className={cn(
          "font-[family-name:var(--font-display)] font-black uppercase tracking-[0.04em] text-base transition-colors",
          selected ? "text-[var(--color-brand)]" : "text-[var(--color-navy)]",
        )}
      >
        {name}
      </span>

      {/* Selection indicator dot */}
      <div
        className={cn(
          "w-4 h-4 rounded-full border-2 transition-all duration-200",
          selected
            ? "border-[var(--color-brand)] bg-[var(--color-brand)]"
            : "border-[var(--color-bg-border)]",
        )}
      >
        {selected && (
          <div className="w-full h-full rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Decision Card ────────────────────────────────────────────────────────────

function DecisionCard({
  decision,
  selected,
  onSelect,
}: {
  decision: "BAT" | "BOWL";
  selected: boolean;
  onSelect: () => void;
}) {
  const isBat = decision === "BAT";

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex-1 flex items-center justify-center gap-2.5 py-4 px-3 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97]",
        selected
          ? "border-[var(--color-brand)] bg-[var(--color-bg-tint)] shadow-[0_4px_16px_rgba(27,63,160,0.14)]"
          : "border-[var(--color-bg-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-brand)]/30",
      )}
    >
      {/* Icon */}
      {isBat ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="flex-shrink-0"
        >
          <path
            d="M4 20L14 10M14 10L17 7C18.5 5.5 20.5 5.5 21 7C21.5 8.5 20 10 18.5 10L14 10Z"
            stroke={
              selected ? "var(--color-brand)" : "var(--color-text-secondary)"
            }
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="5.5"
            cy="18.5"
            r="1.5"
            fill={
              selected ? "var(--color-brand)" : "var(--color-text-secondary)"
            }
          />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="flex-shrink-0"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke={
              selected ? "var(--color-brand)" : "var(--color-text-secondary)"
            }
            strokeWidth="2"
          />
          <path
            d="M12 3C12 3 9 7 9 12C9 17 12 21 12 21"
            stroke={
              selected ? "var(--color-brand)" : "var(--color-text-secondary)"
            }
            strokeWidth="1.5"
          />
          <path
            d="M3 12H21"
            stroke={
              selected ? "var(--color-brand)" : "var(--color-text-secondary)"
            }
            strokeWidth="1.5"
          />
        </svg>
      )}

      <span
        className={cn(
          "font-[family-name:var(--font-display)] font-black uppercase tracking-[0.06em] text-sm transition-colors",
          selected
            ? "text-[var(--color-brand)]"
            : "text-[var(--color-text-secondary)]",
        )}
      >
        {isBat ? "Bat First" : "Bowl First"}
      </span>
    </button>
  );
}

// ─── Main TossClient ──────────────────────────────────────────────────────────

export default function TossClient() {
  const router = useRouter();
  const { setHeader } = useHeader();

  const teamA = useAppSelector(selectTeamA);
  const teamB = useAppSelector(selectTeamB);

  const [flipState, setFlipState] = useState<FlipState>("idle");
  const [coinFace, setCoinFace] = useState<CoinFace>("heads");
  const [flipCount, setFlipCount] = useState(0); // tracks number of flips for animation
  const [tossWinner, setTossWinner] = useState<"A" | "B" | null>(null);
  const [decision, setDecision] = useState<Decision>(null);

  const coinRef = useRef<HTMLDivElement>(null);
  const flipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setHeader({ title: "Toss Details", showBackButton: true });
  }, [setHeader]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (flipTimeout.current) clearTimeout(flipTimeout.current);
    };
  }, []);

  const handleFlip = () => {
    if (flipState === "flipping") return;

    setFlipState("flipping");
    setTossWinner(null);
    setDecision(null);

    // Determine result
    const resultFace: CoinFace = Math.random() < 0.5 ? "heads" : "tails";

    // Animate: rapidly cycle face, then settle
    setFlipCount((c) => c + 1);

    flipTimeout.current = setTimeout(() => {
      setCoinFace(resultFace);
      setFlipState("done");
    }, 1200); // matches CSS animation duration
  };

  const winnerTeam =
    tossWinner === "A" ? teamA : tossWinner === "B" ? teamB : null;
  const decisionLabel =
    decision === "BAT" ? "bat" : decision === "BOWL" ? "bowl" : null;

  const canContinue = tossWinner !== null && decision !== null;

  const handleContinue = () => {
    if (!canContinue) return;
    // TODO: dispatch toss result to redux store before navigating
    router.push("/start-match/playing-xi");
  };

  if (!teamA || !teamB) return null;

  return (
    <>
      {/* Coin flip animation styles */}
      <style>{`
        @keyframes coinFlip {
          0%   { transform: rotateY(0deg) scale(1); }
          20%  { transform: rotateY(180deg) scale(1.08); }
          40%  { transform: rotateY(360deg) scale(1.12); }
          60%  { transform: rotateY(540deg) scale(1.08); }
          80%  { transform: rotateY(720deg) scale(1.04); }
          100% { transform: rotateY(900deg) scale(1); }
        }
        .coin-flip {
          animation: coinFlip 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes coinSettle {
          0%   { transform: scale(1.06); }
          50%  { transform: scale(0.96); }
          100% { transform: scale(1); }
        }
        .coin-settle {
          animation: coinSettle 0.3s ease-out forwards;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-slide-up {
          animation: fadeSlideUp 0.35s ease-out forwards;
        }
      `}</style>

      <div className="flex min-h-full flex-col bg-[var(--color-bg-base)]">
        <div className="flex flex-1 flex-col gap-6 px-4 pt-8 pb-6">
          {/* ── Coin ───────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-5">
            {/* Coin */}
            <div
              ref={coinRef}
              key={flipCount} // re-mounts to restart animation
              className={cn(
                "w-28 h-28",
                flipState === "flipping" && "coin-flip",
                flipState === "done" && "coin-settle",
              )}
              style={{ perspective: "800px" }}
            >
              {coinFace === "heads" || flipState === "flipping" ? (
                <CoinHeads />
              ) : (
                <CoinTails />
              )}
            </div>

            {/* Flip result label */}
            {flipState === "done" && (
              <p className="fade-slide-up font-[family-name:var(--font-display)] font-black uppercase tracking-widest text-xs text-[var(--color-text-muted)]">
                {coinFace === "heads" ? "Heads!" : "Tails!"}
              </p>
            )}

            {/* Flip button */}
            <button
              onClick={handleFlip}
              disabled={flipState === "flipping"}
              className={cn(
                "px-8 py-3 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-bg-border)]",
                "font-[family-name:var(--font-display)] font-black uppercase tracking-[0.06em] text-sm text-[var(--color-brand)]",
                "shadow-[var(--shadow-card)] transition-all duration-200",
                "hover:bg-[var(--color-bg-tint)] hover:border-[var(--color-brand)]/30",
                "active:scale-95",
                flipState === "flipping" && "opacity-50 cursor-not-allowed",
              )}
            >
              {flipState === "flipping" ? "Flipping…" : "Flip Coin"}
            </button>
          </div>

          {/* ── Toss Winner ─────────────────────────────────────── */}
          <div className="bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-bg-border)] p-4 shadow-[var(--shadow-card)]">
            <p className="text-section-label mb-3">Toss Winner</p>
            <div className="flex gap-3">
              <TeamWinnerCard
                name={teamA.name}
                logoUrl={teamA.logoUrl}
                selected={tossWinner === "A"}
                onSelect={() => {
                  setTossWinner("A");
                  setDecision(null);
                }}
              />
              <TeamWinnerCard
                name={teamB.name}
                logoUrl={teamB.logoUrl}
                selected={tossWinner === "B"}
                onSelect={() => {
                  setTossWinner("B");
                  setDecision(null);
                }}
              />
            </div>
          </div>

          {/* ── Decision ────────────────────────────────────────── */}
          <div
            className={cn(
              "bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-bg-border)] p-4 shadow-[var(--shadow-card)] transition-opacity duration-300",
              tossWinner === null
                ? "opacity-40 pointer-events-none"
                : "opacity-100",
            )}
          >
            <p className="text-section-label mb-3">Decision</p>
            <div className="flex gap-3">
              <DecisionCard
                decision="BAT"
                selected={decision === "BAT"}
                onSelect={() => setDecision("BAT")}
              />
              <DecisionCard
                decision="BOWL"
                selected={decision === "BOWL"}
                onSelect={() => setDecision("BOWL")}
              />
            </div>
          </div>

          {/* ── Result sentence ─────────────────────────────────── */}
          <p className="text-center text-sm text-[var(--color-text-secondary)] leading-relaxed min-h-[1.5rem]">
            {winnerTeam && decisionLabel ? (
              <span className="fade-slide-up inline-block">
                <span className="font-semibold text-[var(--color-navy)]">
                  {winnerTeam.name}
                </span>
                {" won the toss and elected to "}
                <span className="font-semibold text-[var(--color-brand)]">
                  {decisionLabel} first
                </span>
                {"."}
              </span>
            ) : winnerTeam ? (
              <span className="text-[var(--color-text-muted)]">
                <span className="font-medium text-[var(--color-navy)]">
                  {winnerTeam.name}
                </span>
                {" won the toss and elected to "}
                <span className="text-[var(--color-text-muted)]">…</span>
              </span>
            ) : (
              <span className="text-[var(--color-text-muted)] italic text-xs">
                Select toss winner and decision above
              </span>
            )}
          </p>
        </div>

        {/* ── Continue button ──────────────────────────────────── */}
        <div className="safe-bottom shrink-0 px-4 pb-4">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-4 rounded-2xl",
              "font-[family-name:var(--font-display)] font-black uppercase tracking-[0.06em] text-sm",
              "transition-all duration-300",
              canContinue
                ? "bg-[var(--color-brand)] text-white shadow-[var(--shadow-button)] active:scale-[0.98]"
                : "bg-[var(--color-brand)]/30 text-white/60 cursor-not-allowed",
            )}
          >
            Continue to Match
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
