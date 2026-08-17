import { DialogBottom } from "@/components/common/DialogBottom";
import { Button } from "@/components/common/Button";
import { FieldZone } from "@/types/scoring";

const ZONES: Array<{ value: FieldZone; label: string }> = [
  { value: "THIRD_MAN", label: "Third man" },
  { value: "DEEP_FINE_LEG", label: "Deep fine leg" },
  { value: "FINE_LEG", label: "Fine leg" },
  { value: "SQUARE_LEG", label: "Square leg" },
  { value: "DEEP_SQUARE_LEG", label: "Deep square" },
  { value: "MID_WICKET", label: "Mid wicket" },
  { value: "DEEP_MID_WICKET", label: "Deep mid wicket" },
  { value: "LONG_ON", label: "Long on" },
  { value: "LONG_OFF", label: "Long off" },
  { value: "COVER", label: "Cover" },
  { value: "DEEP_COVER", label: "Deep cover" },
  { value: "POINT", label: "Point" },
  { value: "DEEP_POINT", label: "Deep point" },
];

export function WagonWheelDirectionSheet({
  open,
  batRuns,
  isRecording,
  onClose,
  onSelect,
}: {
  open: boolean;
  batRuns: number | null;
  isRecording: boolean;
  onClose: () => void;
  onSelect: (fieldZone: FieldZone) => void;
}) {
  return (
    <DialogBottom open={open} onClose={onClose}>
      <div className="px-1 pb-2">
        <h3 className="font-display text-xl font-black uppercase tracking-[0.04em] text-(--color-navy)">
          {batRuns === 6 ? "Six" : "Four"} direction
        </h3>
        <p className="mt-1 text-sm text-(--color-text-body)">
          Select where the batter hit the ball. The delivery is recorded only
          after a direction is selected.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {ZONES.map((zone) => (
            <Button
              key={zone.value}
              type="button"
              variant="secondary"
              disabled={isRecording}
              onClick={() => onSelect(zone.value)}
            >
              {zone.label}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={isRecording}
          onClick={onClose}
          className="mt-4"
        >
          Cancel
        </Button>
      </div>
    </DialogBottom>
  );
}
