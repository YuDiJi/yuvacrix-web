import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SelectedTeam = {
  id: string;
  name: string;
  initials: string;
  color: string;
  city: string;
  squadCount: number;
  logoUrl?: string;
};

type StartMatchState = {
  teamA: SelectedTeam | null;
  teamB: SelectedTeam | null;
};

const initialState: StartMatchState = {
  teamA: null,
  teamB: null,
};

const startMatchSlice = createSlice({
  name: "startMatch",
  initialState,
  reducers: {
    setTeamA: (state, action: PayloadAction<SelectedTeam>) => {
      state.teamA = action.payload;
    },

    setTeamB: (state, action: PayloadAction<SelectedTeam>) => {
      state.teamB = action.payload;
    },

    resetMatch: (state) => {
      state.teamA = null;
      state.teamB = null;
    },
  },
});

export const { setTeamA, setTeamB, resetMatch } = startMatchSlice.actions;

export default startMatchSlice.reducer;
