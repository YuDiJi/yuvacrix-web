import { cn } from "@/lib/cn";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="flex min-h-dvh items-start justify-center bg-(--color-bg-base) md:bg-[#c9d1df]">
        {/* Phone frame — 430px cap on desktop, full-screen on mobile */}
        <div
          className={cn(
            "relative flex h-dvh w-full flex-col overflow-hidden bg-(--color-bg-base)",
            "md:max-w-[430px] md:shadow-[0_0_80px_rgba(13,27,62,0.28)]",
          )}
        >
          {children}
        </div>
      </div>
    </main>
  );
}
