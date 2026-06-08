// src/app/(marketing)/on-boarding/profile-picture/page.tsx
// ─── Server Component ─────────────────────────────────────────────────────────

import { OnboardingProfilePicture } from "./Onboardingprofilepicture";

export const metadata = { title: "Add Profile Picture — YuvaCrix" };

export default function ProfilePicturePage() {
  return (
    <div className="flex min-h-dvh items-start justify-center bg-(--color-bg-base) md:bg-[#c9d1df]">
      <div className="relative flex h-dvh w-full flex-col overflow-hidden md:max-w-[430px] md:shadow-[0_0_80px_rgba(13,27,62,0.28)]">
        <OnboardingProfilePicture />
      </div>
    </div>
  );
}
