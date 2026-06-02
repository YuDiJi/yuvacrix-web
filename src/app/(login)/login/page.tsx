// src/app/(marketing)/login/page.tsx
// ─── Server Component — no "use client" ──────────────────────────────────────
// Only the interactive children carry "use client", keeping this RSC boundary.

import { CricketBackdrop } from "@/components/login/Cricketbackdrop";
import { LoginForm } from "@/components/login/Loginform";

export const metadata = {
  title: "Sign In — YuvaCrix",
  description: "Sign in with your mobile number to start scoring cricket.",
};

export default function LoginPage() {
  return (
    // Same phone-frame shell as the app layout
    <div className="flex min-h-dvh items-start justify-center bg-(--color-bg-base) md:bg-[#c9d1df]">
      <div className="relative flex h-dvh w-full flex-col overflow-hidden md:max-w-[430px] md:shadow-[0_0_80px_rgba(13,27,62,0.28)]">
        {/* ── Dark hero upper section (static — server rendered) ─────────── */}
        <div className="relative flex-none" style={{ height: "52%" }}>
          <CricketBackdrop />

          {/* Logo + wordmark over backdrop */}
          <div className="relative z-10 flex h-full flex-col items-center justify-end pb-10 px-8">
            <div className="flex flex-col items-center gap-3">
              {/* Logo mark */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/15 shadow-[0_8px_32px_rgba(13,27,62,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]">
                <span
                  className="absolute inset-0 rounded-[22px]"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 60%)",
                  }}
                />
                <span
                  className="relative z-10 font-(family-name:--font-display) text-3xl font-black text-white"
                  style={{ letterSpacing: "0.02em" }}
                >
                  YC
                </span>
              </div>

              <div className="text-center">
                <h1
                  className="font-(family-name:--font-display) text-4xl font-black uppercase text-white"
                  style={{ letterSpacing: "0.04em", lineHeight: 1 }}
                >
                  YuvaCrix
                </h1>
                <p className="mt-1 text-[13px] font-medium text-white/55 tracking-wide">
                  Cricket. Scored. Shared.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Interactive login card (client boundary starts here) ────────── */}
        <div
          className="relative z-20 flex flex-1 flex-col rounded-t-[28px] bg-(--color-bg-card) px-6 pt-7 pb-6"
          style={{
            marginTop: "-24px",
            boxShadow: "0 -4px 32px rgba(13,27,62,0.12)",
          }}
        >
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
