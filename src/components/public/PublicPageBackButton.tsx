// src/components/public/PublicPageBackButton.tsx

"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/auth/authSelectors";

export function PublicPageBackButton() {
  const router = useRouter();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(isAuthenticated ? "/home" : "/");
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
    >
      <ChevronLeft size={22} />
    </button>
  );
}
