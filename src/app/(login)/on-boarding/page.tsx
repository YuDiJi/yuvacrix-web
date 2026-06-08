// src/app/(marketing)/on-boarding/page.tsx
// ─── Server Component ─────────────────────────────────────────────────────────

import { OnboardingProfileForm } from "./Onboardingprofileform";

export const metadata = { title: "Complete Your Profile — YuvaCrix" };

export default function OnboardingPage() {
  return (
    <div className="flex min-h-dvh items-start justify-center bg-(--color-bg-base) md:bg-[#c9d1df]">
      <div className="relative flex h-dvh w-full flex-col overflow-hidden md:max-w-[430px] md:shadow-[0_0_80px_rgba(13,27,62,0.28)]">
        <OnboardingProfileForm />
      </div>
    </div>
  );
}
