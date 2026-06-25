import React, { useState } from "react";
import { ExtraType, WicketFlowState, WicketType } from "@/types/scoring";
import { cn } from "@/lib/cn";
import { Button } from "@/components/common/Button";
import { WICKET_CONFIG } from "./constant";

const deliveryType: Array<{ label: string; value: ExtraType }> = [
  { label: "WD", value: "WIDE" },
  { label: "NB", value: "NO_BALL" },
  { label: "Bye", value: "BYE" },
  { label: "LB", value: "LEG_BYE" },
];

const runs = [0, 1, 2, 3, 4];

export default function DeliveryTypeRunsSelector({
  wicketType,
  value,
  onContinue,
}: {
  wicketType: WicketType;
  value: WicketFlowState;
  onContinue: (value: any) => void;
}) {
  const config = WICKET_CONFIG[wicketType];

  const [selectedType, setSelectedType] = useState<ExtraType | null>(null); // delivery type
  // Specific state for when NB is selected
  const [nbSubType, setNbSubType] = useState<"BAT" | "BYE" | "LEG_BYE" | null>(
    null,
  );

  const [selectedRun, setSelectedRun] = useState<number | null>(null);

  // Custom Run State
  const [isCustomRunActive, setIsCustomRunActive] = useState(false);
  const [customRunValue, setCustomRunValue] = useState<string>("");

  // Checkbox states
  // const [isBoundary, setIsBoundary] = useState(false);
  const [dontCountBall, setDontCountBall] = useState(false);

  // --- Handlers ---

  const handleTypeSelect = (value: ExtraType) => {
    setSelectedType((prev) => (prev === value ? null : value));
    if (value !== "NO_BALL") {
      setNbSubType(null);
    }
  };

  const handleRunSelect = (run: number) => {
    setSelectedRun((prev) => (prev === run ? null : run));
    setIsCustomRunActive(false);
    setCustomRunValue("");
  };

  const handleCustomRunClick = () => {
    setIsCustomRunActive(true);
    setSelectedRun(null);
  };

  const handleCustomRunChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Only allow empty string or numbers
    if (val === "" || /^\d+$/.test(val)) {
      const numVal = parseInt(val, 10);
      // Cap at max 7 as requested
      if (val === "" || (numVal >= 0 && numVal <= 7)) {
        setCustomRunValue(val);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-4 pb-4">
      {(config.deliveryUI === "FULL" || dontCountBall) && (
        <>
          {/* --- DELIVERY TYPE --- */}
          <div>
            <p className="text-section-label mb-3">Delivery type</p>
            <div className="flex gap-3">
              {deliveryType.map((type) => {
                const isSelected = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => handleTypeSelect(type.value)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl font-display font-bold text-base transition-all",
                      isSelected
                        ? "bg-(--color-brand) text-white shadow-(--shadow-button)"
                        : "bg-(--color-bg-base) text-(--color-text-secondary) hover:bg-(--color-bg-border)",
                    )}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- RUNS SCORED --- */}
          <div>
            <p className="text-section-label mb-3">Runs scored</p>
            <div className="flex flex-wrap gap-2.5 items-center">
              {runs.map((run) => {
                const isSelected = selectedRun === run;
                return (
                  <button
                    key={run}
                    onClick={() => handleRunSelect(run)}
                    className={cn(
                      "w-11 h-11 flex items-center justify-center rounded-xl border-2 transition-all font-display text-lg",
                      isSelected
                        ? "border-(--color-brand) bg-(--color-bg-tint) text-(--color-brand) font-bold shadow-sm"
                        : "border-(--color-bg-border) text-(--color-text-primary) hover:border-(--color-brand)/40 hover:bg-(--color-bg-tint)",
                    )}
                  >
                    {run}
                  </button>
                );
              })}

              {/* Plus Button */}
              <button
                onClick={handleCustomRunClick}
                className={cn(
                  "w-11 h-11 flex items-center justify-center rounded-xl border-2 transition-all font-display text-2xl leading-none",
                  isCustomRunActive
                    ? "border-(--color-brand) bg-(--color-brand) text-white shadow-(--shadow-button)"
                    : "border-(--color-bg-border) bg-transparent text-(--color-text-primary) hover:border-(--color-brand)/40",
                )}
              >
                +
              </button>

              {/* Custom Run Input Box (Appears when + is active) */}
              {isCustomRunActive && (
                <input
                  type="text"
                  inputMode="numeric"
                  value={customRunValue}
                  onChange={handleCustomRunChange}
                  placeholder="0-7"
                  className="w-16 h-11 border-2 border-(--color-brand) rounded-xl text-center text-(--color-text-primary) font-display text-lg font-bold outline-none bg-(--color-bg-tint) shadow-sm transition-all ml-1"
                  autoFocus
                />
              )}
            </div>

            {/* --- NO BALL CONDITIONAL OPTIONS --- */}
            {selectedType === "NO_BALL" && selectedRun && (
              <div className="flex gap-5 mt-4 ml-1 bg-(--color-bg-base) p-3 rounded-xl border border-(--color-bg-border)">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="nb_type"
                    checked={nbSubType === "BAT"}
                    onChange={() => setNbSubType("BAT")}
                    className="w-4 h-4 text-(--color-brand) focus:ring-(--color-brand) border-(--color-bg-border)"
                  />
                  <span className="text-body font-medium text-(--color-text-body)">
                    From bat
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="nb_type"
                    checked={nbSubType === "BYE"}
                    onChange={() => setNbSubType("BYE")}
                    className="w-4 h-4 text-(--color-brand) focus:ring-(--color-brand) border-(--color-bg-border)"
                  />
                  <span className="text-body font-medium text-(--color-text-body)">
                    Bye
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="nb_type"
                    checked={nbSubType === "LEG_BYE"}
                    onChange={() => setNbSubType("LEG_BYE")}
                    className="w-4 h-4 text-(--color-brand) focus:ring-(--color-brand) border-(--color-bg-border)"
                  />
                  <span className="text-body font-medium text-(--color-text-body)">
                    Leg bye
                  </span>
                </label>
              </div>
            )}
          </div>
        </>
      )}

      {/* --- CHECKBOXES --- */}
      <div className="flex flex-col gap-3.5 mt-2">
        {/* <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={isBoundary}
              onChange={(e) => setIsBoundary(e.target.checked)}
              className="peer appearance-none w-5 h-5 rounded border-2 border-(--color-bg-border) checked:border-(--color-brand) checked:bg-(--color-brand) transition-colors cursor-pointer group-hover:border-(--color-brand)/50"
            />
            <svg
              className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 14 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1.5 6 4.5 9 10.5 1" />
            </svg>
          </div>
          <span className="text-body font-medium text-(--color-text-body)">
            Boundary
          </span>
        </label> */}

        {config.deliveryUI === "DONT_COUNT_BALL" && (
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={dontCountBall}
                onChange={(e) => setDontCountBall(e.target.checked)}
                className="peer appearance-none w-5 h-5 rounded border-2 border-(--color-bg-border) checked:border-(--color-brand) checked:bg-(--color-brand) transition-colors cursor-pointer group-hover:border-(--color-brand)/50"
              />
              <svg
                className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                viewBox="0 0 14 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1.5 6 4.5 9 10.5 1" />
              </svg>
            </div>
            <span className="text-body font-medium text-(--color-text-body)">
              Don&apos;t count the ball
            </span>
          </label>
        )}

        {config.deliveryUI === "WIDE_CHECKBOX" && (
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                // checked={dontCountBall}
                // onChange={(e) => setDontCountBall(e.target.checked)}
                className="peer appearance-none w-5 h-5 rounded border-2 border-(--color-bg-border) checked:border-(--color-brand) checked:bg-(--color-brand) transition-colors cursor-pointer group-hover:border-(--color-brand)/50"
              />
              <svg
                className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                viewBox="0 0 14 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1.5 6 4.5 9 10.5 1" />
              </svg>
            </div>
            <span className="text-body font-medium text-(--color-text-body)">
              Wide
            </span>
          </label>
        )}
        {config.deliveryUI === "NO_BALL_CHECKBOX" && (
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                // checked={dontCountBall}
                // onChange={(e) => setDontCountBall(e.target.checked)}
                className="peer appearance-none w-5 h-5 rounded border-2 border-(--color-bg-border) checked:border-(--color-brand) checked:bg-(--color-brand) transition-colors cursor-pointer group-hover:border-(--color-brand)/50"
              />
              <svg
                className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                viewBox="0 0 14 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1.5 6 4.5 9 10.5 1" />
              </svg>
            </div>
            <span className="text-body font-medium text-(--color-text-body)">
              No Ball
            </span>
          </label>
        )}
      </div>

      {/* --- CONTINUE BUTTON --- */}
      <Button>Continue</Button>
    </div>
  );
}
