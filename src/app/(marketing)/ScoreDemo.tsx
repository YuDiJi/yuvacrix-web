import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";

// ── Pad definition ─────────────────────────────────────────────
interface PadCell {
  label: string;
  row: number;
  col: number;
  textColor?: string;
  sub?: string;
  subColor?: string;
}

const PAD: PadCell[] = [
  { label: "0", row: 0, col: 0 },
  { label: "1", row: 0, col: 1 },
  { label: "2", row: 0, col: 2 },
  { label: "UNDO", row: 0, col: 3, textColor: "#5EE8C8" },
  { label: "3", row: 1, col: 0 },
  {
    label: "4",
    row: 1,
    col: 1,
    textColor: "#22C55E",
    sub: "FOUR",
    subColor: "#22C55E",
  },
  {
    label: "6",
    row: 1,
    col: 2,
    textColor: "#F59E0B",
    sub: "SIX",
    subColor: "#F59E0B",
  },
  { label: "OUT", row: 1, col: 3, textColor: "#FF3B30" },
  { label: "WD", row: 2, col: 0 },
  { label: "NB", row: 2, col: 1 },
  { label: "BYE", row: 2, col: 2 },
  { label: "LB", row: 2, col: 3 },
];

const SEQUENCE = ["1", "0", "4", "2", "6", "1", "OUT"] as const;
const GAP = 3; // px gap between cells

function padIndex(label: string) {
  return PAD.findIndex((p) => p.label === label);
}

interface ScoreState {
  runs: number;
  balls: number;
  wkts: number;
}

// ── ScoreDemo ──────────────────────────────────────────────────
const ScoreDemo: React.FC = () => {
  const [state, setState] = useState<ScoreState>({
    runs: 0,
    balls: 0,
    wkts: 0,
  });
  const [seqIdx, setSeqIdx] = useState(0);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [toast, setToast] = useState<{ label: string; color: string } | null>(
    null,
  );

  // Measure the live grid dimensions to position the cursor
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ w: 289, h: 180 });

  useEffect(() => {
    if (!gridRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setGridSize({ w: width, h: height });
    });
    ro.observe(gridRef.current);
    return () => ro.disconnect();
  }, []);

  // Compute cursor centre for the current sequence cell
  function cursorCenter(idx: number) {
    const p = PAD[idx];
    const cw = (gridSize.w - 3 * GAP) / 4; // effective cell width
    const ch = (gridSize.h - 2 * GAP) / 3; // effective cell height
    return {
      x: p.col * (cw + GAP) + cw / 2,
      y: p.row * (ch + GAP) + ch / 2,
    };
  }

  const curIdx = padIndex(SEQUENCE[seqIdx]);
  const ctr = cursorCenter(curIdx);

  const cursorX = useSpring(ctr.x, { stiffness: 160, damping: 20 });
  const cursorY = useSpring(ctr.y, { stiffness: 160, damping: 20 });

  useEffect(() => {
    cursorX.set(ctr.x);
    cursorY.set(ctr.y);
  }, [ctr.x, ctr.y, cursorX, cursorY]);

  const advance = useCallback(() => {
    const key = SEQUENCE[seqIdx];
    const pidx = padIndex(key);

    setActivePad(pidx);
    setTimeout(() => setActivePad(null), 500);

    setState((prev) => {
      const n = { ...prev };
      const k = key as string;
      if (k === "1") {
        n.runs += 1;
        n.balls += 1;
      } else if (k === "0") {
        n.balls += 1;
      } else if (k === "2") {
        n.runs += 2;
        n.balls += 1;
      } else if (k === "3") {
        n.runs += 3;
        n.balls += 1;
      } else if (k === "4") {
        n.runs += 4;
        n.balls += 1;
      } else if (k === "6") {
        n.runs += 6;
        n.balls += 1;
      } else if (k === "OUT") {
        n.balls += 1;
        n.wkts += 1;
      }
      return n;
    });

    if (key === "4") setToast({ label: "FOUR", color: "#22C55E" });
    if (key === "6") setToast({ label: "SIX", color: "#F59E0B" });
    if (key === "OUT") setToast({ label: "OUT", color: "#FF3B30" });
    setTimeout(() => setToast(null), 850);

    if (seqIdx === SEQUENCE.length - 1) {
      setTimeout(() => {
        setState({ runs: 0, balls: 0, wkts: 0 });
        setSeqIdx(0);
      }, 1400);
    } else {
      setSeqIdx((i) => i + 1);
    }
  }, [seqIdx]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    timerRef.current = setTimeout(advance, 900);
    return () => clearTimeout(timerRef.current);
  }, [advance]);

  const overs = `${Math.floor(state.balls / 6)}.${state.balls % 6}`;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: 700 }}
    >
      {/* ── Phone frame ── */}
      <div
        className="relative overflow-hidden select-none"
        style={{
          width: 310,
          height: 668,
          background: "#0a0c18",
          borderRadius: 48,
          border: "2.5px solid rgba(255,255,255,0.14)",
          boxShadow:
            "0 0 90px rgba(75,139,255,0.22), 0 30px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Dynamic island */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 bg-black z-20"
          style={{ width: 88, height: 26, borderRadius: 14 }}
        />

        {/* ── Screen — full flex column ── */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden"
          style={{ background: "#0B1635", borderRadius: 48 }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-5 pt-10 pb-1 shrink-0">
            <span className="text-white/70 text-base leading-none">←</span>
            <span className="font-body font-semibold text-white text-sm tracking-wide">
              Scoring
            </span>
          </div>

          {/* Score */}
          <div className="px-5 pt-1 pb-2 text-center shrink-0">
            <div className="font-display font-black leading-none inline-flex items-baseline gap-1">
              <span className="text-white" style={{ fontSize: 46 }}>
                {state.runs}/{state.wkts}
              </span>
              <span style={{ fontSize: 18, color: "#5EE8C8", fontWeight: 700 }}>
                ({overs})
              </span>
            </div>
            <p
              className="text-white/50 font-body font-medium mt-1 leading-snug"
              style={{ fontSize: 10, letterSpacing: "0.08em" }}
            >
              BLACK PANTHER WON THE TOSS AND ELECTED TO FIELD
            </p>
            <div
              className="inline-block mt-1.5 px-3 py-0.5 font-body text-white/70"
              style={{
                fontSize: 10,
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 20,
                letterSpacing: "0.05em",
              }}
            >
              Match ID: 25578100
            </div>
          </div>

          {/* ── Players card ── */}
          <div
            className="mx-3 rounded-2xl overflow-hidden shrink-0"
            style={{ background: "#fff" }}
          >
            {/* Batters row */}
            <div className="flex border-b border-gray-100">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border-r border-gray-100">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full"
                  style={{
                    width: 32,
                    height: 32,
                    background: "#EFF6FF",
                    border: "1.5px solid #BFDBFE",
                  }}
                >
                  <span style={{ fontSize: 16 }}>🏏</span>
                </div>
                <div className="min-w-0">
                  <p
                    className="font-body font-bold text-gray-900 leading-none"
                    style={{ fontSize: 10 }}
                  >
                    VIVAAN PATEL
                  </p>
                  <p
                    className="font-body font-semibold mt-0.5"
                    style={{ fontSize: 9, color: "#EF4444" }}
                  >
                    REPLACE
                  </p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100"
                  style={{
                    width: 32,
                    height: 32,
                    border: "1.5px solid #E5E7EB",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="7" r="4" fill="#9CA3AF" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#9CA3AF" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p
                    className="font-body font-bold text-gray-900 leading-none"
                    style={{ fontSize: 10 }}
                  >
                    KARAN MEHTA
                  </p>
                  <p
                    className="font-body font-semibold mt-0.5"
                    style={{ fontSize: 9, color: "#EF4444" }}
                  >
                    REPLACE
                  </p>
                </div>
              </div>
            </div>
            {/* Bowler row */}
            <div className="flex items-center gap-2 px-3 py-2">
              <div
                className="flex-shrink-0 rounded-full"
                style={{ width: 10, height: 10, background: "#22C55E" }}
              />
              <span
                className="font-body font-bold text-gray-800 flex-1"
                style={{ fontSize: 10 }}
              >
                AARAV SHARMA
              </span>
              <span className="font-mono text-gray-500" style={{ fontSize: 9 }}>
                1-0-0.1-0
              </span>
            </div>
          </div>

          {/* ── Pad — flex-1 so it fills all remaining height ── */}
          <div className="flex-1 relative min-h-0 px-[3px] pt-[3px] pb-0">
            {/* Toast overlay */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  key={toast.label}
                  initial={{ scale: 0.4, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 1.2, opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute font-display font-black uppercase z-20"
                  style={{
                    fontSize: 28,
                    color: toast.color,
                    textShadow: `0 0 24px ${toast.color}80`,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    pointerEvents: "none",
                  }}
                >
                  {toast.label}!
                </motion.div>
              )}
            </AnimatePresence>

            {/* CSS grid — 4 cols × 3 rows filling full height */}
            <div
              ref={gridRef}
              className="w-full h-full relative"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gridTemplateRows: "repeat(3, 1fr)",
                gap: GAP,
              }}
            >
              {PAD.map((p, i) => (
                <div
                  key={p.label}
                  className="relative flex flex-col items-center justify-center overflow-hidden"
                  style={{
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: 6,
                    zIndex: 1,
                  }}
                >
                  <span
                    className="font-display font-black leading-none"
                    style={{
                      fontSize: p.sub ? 20 : 18,
                      color: p.textColor ?? "#111827",
                      lineHeight: 1,
                    }}
                  >
                    {p.label}
                  </span>
                  {p.sub && (
                    <span
                      className="font-body font-semibold uppercase"
                      style={{
                        fontSize: 8,
                        color: p.subColor ?? "#111",
                        marginTop: 2,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {p.sub}
                    </span>
                  )}

                  {/* Tap pulse */}
                  <AnimatePresence>
                    {activePad === i && (
                      <motion.div
                        key="pulse"
                        initial={{ scale: 0, opacity: 0.8 }}
                        animate={{ scale: 3, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        style={{
                          background: `${p.textColor ?? "rgba(94,232,200,1)"}33`,
                          transformOrigin: "center",
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Animated cursor — springs to centre of active cell */}
              <motion.div
                className="pointer-events-none"
                style={{
                  position: "absolute",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "2px solid rgba(94,232,200,0.85)",
                  background: "rgba(255,255,255,0.12)",
                  boxShadow: "0 0 14px rgba(94,232,200,0.6)",
                  zIndex: 10,
                  x: cursorX,
                  y: cursorY,
                  translateX: "-50%",
                  translateY: "-50%",
                }}
              />
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="text-center py-3 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span
              className="font-body font-semibold text-white/40 uppercase tracking-widest"
              style={{ fontSize: 9 }}
            >
              SCORING SHORTCUTS ▲
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreDemo;
