import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DialogBoxProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  onClose: () => void;
}

export function DialogBox({
  open,
  children,
  className,
  onClose,
}: DialogBoxProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        style={{
          background: "rgba(5, 12, 30, 0.75)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Dialog Container (Centered) */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 pointer-events-none",
          open ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Actual Dialog Card */}
        <div
          className={cn(
            "bg-white rounded-xl w-full max-w-85 shadow-2xl pointer-events-auto overflow-hidden",
            "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            open ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
}
