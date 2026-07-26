// ─── Server Component — no "use client" ──────────────────────────────────────

import Image from "next/image";
import { LoginForm } from "./Loginform";

export const metadata = {
  title: "Sign In — YuvaCrix",
  description: "Sign in with your mobile number to start scoring cricket.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-start justify-center bg-(--color-bg-base) md:bg-[#c9d1df]">
      <div className="relative h-dvh w-full overflow-hidden md:max-w-107.5 md:shadow-[0_0_80px_rgba(13,27,62,0.28)]">
        {/* ── Full-screen background image ── */}
        <Image
          src="/onboarding-login.png"
          alt="YuvaCrix cricket stadium"
          fill
          priority
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover object-center"
        />

        {/* ── Gradient scrim — darkens bottom so form stays readable ── */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* ── Login form — overlays the image at the bottom ── */}
        <div className="absolute inset-x-0 bottom-0 z-20 rounded-t-[28px] bg-(--color-bg-card) px-6 pb-8 pt-7 shadow-[0_-4px_32px_rgba(13,27,62,0.18)]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
