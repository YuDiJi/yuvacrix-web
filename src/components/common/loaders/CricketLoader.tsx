// src/components/common/loaders/CricketLoader.tsx
// ─── Full-screen cricket animation loader ────────────────────────────────────
// Usage: <CricketLoader />
//        <CricketLoader message="Loading squad..." />

interface CricketLoaderProps {
  message?: string;
}

export function CricketLoader({ message = "Loading..." }: CricketLoaderProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-6 bg-(--color-bg-base) px-6">
      {/* Animation */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Orbit ring */}
        <svg
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "1.6s" }}
          viewBox="0 0 96 96"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="48"
            cy="48"
            r="38"
            stroke="var(--color-bg-border)"
            strokeWidth="3"
            strokeDasharray="60 180"
            strokeLinecap="round"
          />
          <circle
            cx="48"
            cy="48"
            r="38"
            stroke="var(--color-brand)"
            strokeWidth="3"
            strokeDasharray="30 210"
            strokeLinecap="round"
          />
        </svg>

        {/* Bat + ball group — centered */}
        <div className="relative flex h-14 w-14 items-center justify-center">
          {/* Cricket bat (SVG) */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true"
            className="absolute"
            style={{ transform: "rotate(-40deg)" }}
          >
            {/* Blade */}
            <rect
              x="14"
              y="2"
              width="9"
              height="22"
              rx="3"
              fill="var(--color-navy)"
            />
            {/* Handle */}
            <rect
              x="16"
              y="23"
              width="5"
              height="10"
              rx="2"
              fill="var(--color-text-muted)"
            />
            {/* Grain lines */}
            <line
              x1="16"
              y1="6"
              x2="16"
              y2="20"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <line
              x1="19"
              y1="6"
              x2="19"
              y2="20"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <line
              x1="22"
              y1="6"
              x2="22"
              y2="20"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>

          {/* Cricket ball — bounces */}
          <div
            className="absolute"
            style={{
              animation: "ballBounce 0.8s ease-in-out infinite alternate",
              top: 0,
              right: 0,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="7" fill="var(--color-live)" />
              {/* Seam lines */}
              <path
                d="M3 5 Q8 8 13 5"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M3 11 Q8 8 13 11"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <p
          className="font-(family-name:--font-display) text-base font-black uppercase text-(--color-text-primary)"
          style={{ letterSpacing: "0.06em" }}
        >
          {message}
        </p>
        {/* Animated dots */}
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-(--color-brand)"
              style={{
                animation: `dotPulse 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes ballBounce {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(-18px, 12px) scale(0.85); }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40%           { opacity: 1;    transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
