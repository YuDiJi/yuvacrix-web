import { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { PublicPageBackButton } from "@/components/public/PublicPageBackButton";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-(--color-bg-base)">
      <header className="safe-top relative z-30 flex h-14 shrink-0 items-center justify-start border-b border-white/10 bg-(--color-navy) px-4">
        <PublicPageBackButton />

        <Link href="/" className="flex items-center gap-2 w-30 h-21.5">
          <Image
            src="/logo/logo_dark.png"
            alt="YuvaCrix"
            width={110}
            height={36}
            className="w-full h-full overflow-hidden"
            priority
          />
        </Link>
      </header>
      <main>
        <div className="flex items-start justify-center bg-(--color-bg-base) md:bg-[#c9d1df]">
          {/* Phone frame — 430px cap on desktop, full-screen on mobile */}
          <div
            className={cn(
              "relative flex h-dvh w-full flex-col overflow-y-scroll bg-(--color-bg-base)",
              //   "md:max-w-107.5",
              "md:shadow-[0_0_80px_rgba(13,27,62,0.28)]",
            )}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
