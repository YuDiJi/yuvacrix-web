import type { VolleyballCourtPosition } from "@/types/volleyball/set";

export type VolleyballCourtSlot = {
  position: VolleyballCourtPosition;
  left: string;
  top: string;
};

export const VOLLEYBALL_COURT_SLOTS: readonly VolleyballCourtSlot[] = [
  { position: 1, left: "28%", top: "18%" },
  { position: 2, left: "72%", top: "18%" },
  { position: 3, left: "28%", top: "50%" },
  { position: 4, left: "72%", top: "50%" },
  { position: 5, left: "28%", top: "82%" },
  { position: 6, left: "72%", top: "82%" },
];
