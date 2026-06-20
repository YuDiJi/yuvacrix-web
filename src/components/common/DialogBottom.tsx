import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DialogBottomProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  onClose: () => void;
}

export function DialogBottom({
  open,
  children,
  className,
  onClose,
}: DialogBottomProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 z-40 transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        style={{
          background: "rgba(5, 12, 30, 0.65)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Sheet */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-50 bg-(--color-bg-card) rounded-t-[28px]",
          "shadow-[0_-8px_48px_rgba(13,27,62,0.20)]",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "translate-y-0" : "translate-y-full",
          className,
        )}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1.5 w-10 rounded-full bg-(--color-bg-border)" />
        </div>

        {/* Content Area */}
        <div className="px-5 pb-8">{children}</div>
      </div>
    </>
  );
}
