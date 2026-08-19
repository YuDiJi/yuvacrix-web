// src/store/scoring/scoringSlice.ts
import { ScoringState } from "@/types/cricket/innings";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ScoringSliceState {
  inningsId: string | null;
  scoringState: ScoringState | null;
  // nextAction queue — we process one at a time
  pendingNextAction: any | null;
  // tracks if we're mid-flow (batter selected, waiting for bowler)
  awaitingBowlerAfterBatter: boolean;
}

const initialState: ScoringSliceState = {
  inningsId: null,
  scoringState: null,
  pendingNextAction: null,
  awaitingBowlerAfterBatter: false,
};

const scoringSlice = createSlice({
  name: "scoring",
  initialState,
  reducers: {
    // Called after startInnings or any ball API
    setScoringState(state, action: PayloadAction<ScoringState>) {
      state.scoringState = action.payload;
      state.inningsId = action.payload.inningsId;
    },

    // Called after every ball API response
    setNextAction(state, action: PayloadAction<any>) {
      state.pendingNextAction = action.payload;
    },

    // Clear pending action once modal/flow is resolved
    clearNextAction(state) {
      state.pendingNextAction = null;
    },

    // Set after batter is selected so we know to open bowler modal next
    setAwaitingBowlerAfterBatter(state, action: PayloadAction<boolean>) {
      state.awaitingBowlerAfterBatter = action.payload;
    },

    resetScoring() {
      return initialState;
    },
  },
});

export const {
  setScoringState,
  setNextAction,
  clearNextAction,
  setAwaitingBowlerAfterBatter,
  resetScoring,
} = scoringSlice.actions;

export default scoringSlice.reducer;
