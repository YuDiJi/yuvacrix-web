import { cn } from "@/lib/cn";
import { AlertCircle, Calendar, X } from "lucide-react";

function ScheduleModal({
  open,
  value,
  onChange,
  onConfirm,
  onClose,
  loading,
  error,
}: {
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
  error: string;
}) {
  if (!open) return null;
  return (
    <>
      <div
        className="absolute inset-0 z-40"
        style={{
          background: "rgba(13,27,62,0.55)",
          backdropFilter: "blur(2px)",
        }}
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 z-50 rounded-t-[24px] bg-(--color-bg-card) shadow-[0_-8px_40px_rgba(13,27,62,0.18)]">
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-(--color-bg-border)" />
        </div>
        <div className="px-5 pb-6 pt-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3
                className="font-(family-name:--font-display) text-lg font-black uppercase text-(--color-text-primary)"
                style={{ letterSpacing: "0.04em" }}
              >
                Schedule Match
              </h3>
              <p className="text-meta mt-0.5">
                Pick a date and time for the match
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-bg-base) text-(--color-text-secondary) active:scale-90 transition-all"
            >
              <X size={16} />
            </button>
          </div>
          <div
            className={cn(
              "rounded-2xl border-2 bg-(--color-bg-base) px-4 py-3.5 transition-all",
              "focus-within:border-(--color-sky) focus-within:shadow-[0_0_0_3px_rgba(75,139,255,0.10)]",
              "border-(--color-bg-border)",
            )}
          >
            <p className="text-section-label mb-1.5">Date &amp; Time</p>
            <div className="flex items-center gap-2.5">
              <Calendar
                size={16}
                className="shrink-0 text-(--color-text-muted)"
              />
              <input
                type="datetime-local"
                value={value}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 bg-transparent text-sm font-medium text-(--color-text-primary) outline-none"
              />
            </div>
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-(--color-live)/20 bg-(--color-live)/8 px-3 py-2">
              <AlertCircle size={14} className="shrink-0 text-(--color-live)" />
              <p className="text-xs font-semibold text-(--color-live)">
                {error}
              </p>
            </div>
          )}
          <button
            onClick={onConfirm}
            disabled={!value || loading}
            className={cn(
              "mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl",
              "font-(family-name:--font-display) text-base font-black uppercase tracking-[0.06em] text-white",
              "transition-all duration-200 active:scale-[0.97]",
              value && !loading
                ? "bg-(--color-brand) shadow-(--shadow-button)"
                : "cursor-not-allowed bg-(--color-bg-border) text-(--color-text-muted)",
            )}
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <Calendar size={16} /> Confirm Schedule
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default ScheduleModal;
