import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

interface OtpInputProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  const focus = (i: number) => refs.current[i]?.focus();

  const handleChange = (i: number, char: string) => {
    const d = char.replace(/\D/g, "").slice(-1);
    const next = digits.slice();
    next[i] = d;
    onChange(next.join("").replace(/ /g, ""));
    if (d && i < 5) focus(i + 1);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[i]?.trim()) {
        const next = digits.slice();
        next[i] = " ";
        onChange(next.join("").replace(/ /g, ""));
      } else if (i > 0) {
        focus(i - 1);
      }
    } else if (e.key === "ArrowLeft" && i > 0) focus(i - 1);
    else if (e.key === "ArrowRight" && i < 5) focus(i + 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted);
    focus(Math.min(pasted.length, 5));
  };

  return (
    <div className="flex items-center justify-between gap-2">
      {Array.from({ length: 6 }).map((_, i) => {
        const filled = digits[i]?.trim() !== "";

        return (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digits[i]?.trim() ?? ""}
            disabled={disabled}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              // Dimensions
              "h-13 w-11 rounded-2xl border-2 text-center",
              // Typography
              "font-(family-name:--font-display) text-2xl font-black",
              // Behaviour
              "transition-all duration-150 outline-none",
              // White background, dark text
              "bg-(--color-bg-card) text-(--color-text-primary)",
              // Border states
              filled
                ? "border-(--color-brand) shadow-[0_0_0_3px_rgba(27,63,160,0.12)]"
                : "border-(--color-bg-border) focus:border-(--color-sky) focus:shadow-[0_0_0_3px_rgba(75,139,255,0.12)]",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            style={{ caretColor: "transparent" }}
            aria-label={`OTP digit ${i + 1}`}
          />
        );
      })}
    </div>
  );
}
