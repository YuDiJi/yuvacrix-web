// ─── Server Component — no "use client" ──────────────────────────────────────
// Pure decorative markup, zero JS sent to the client.

export function CricketBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Navy-to-brand gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #0d1b3e 0%, #1b3fa0 60%, #0d1b3e 100%)",
        }}
      />

      {/* Subtle cricket pitch oval */}
      <svg
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
        width="340"
        height="340"
        viewBox="0 0 340 340"
        fill="none"
        aria-hidden="true"
      >
        <ellipse
          cx="170"
          cy="170"
          rx="160"
          ry="160"
          stroke="white"
          strokeWidth="1.5"
        />
        <ellipse
          cx="170"
          cy="170"
          rx="120"
          ry="120"
          stroke="white"
          strokeWidth="1"
        />
        <ellipse
          cx="170"
          cy="170"
          rx="80"
          ry="80"
          stroke="white"
          strokeWidth="0.75"
        />
        {/* Pitch rectangle */}
        <rect
          x="158"
          y="100"
          width="24"
          height="140"
          rx="2"
          stroke="white"
          strokeWidth="1"
        />
        {/* Crease lines */}
        <line
          x1="148"
          y1="130"
          x2="192"
          y2="130"
          stroke="white"
          strokeWidth="0.75"
        />
        <line
          x1="148"
          y1="210"
          x2="192"
          y2="210"
          stroke="white"
          strokeWidth="0.75"
        />
      </svg>

      {/* Top-right sky glow */}
      <div
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #4b8bff 0%, transparent 70%)",
        }}
      />

      {/* Bottom-left brand glow */}
      <div
        className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #1b3fa0 0%, transparent 70%)",
        }}
      />

      {/* Noise grain */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />
    </div>
  );
}
