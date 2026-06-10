import { Team } from "@/types/team";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MatchPlayerRole = {
  id: string;
  name: string;
};

type StartMatchState = {
  teamA: Team | null;
  teamB: Team | null;

  teamACaptain: MatchPlayerRole | null;
  teamAKeeper: MatchPlayerRole | null;

  teamBCaptain: MatchPlayerRole | null;
  teamBKeeper: MatchPlayerRole | null;

  activeTeam: "A" | "B" | null;
};

const initialState: StartMatchState = {
  teamA: null,
  teamB: null,

  teamACaptain: null,
  teamAKeeper: null,

  teamBCaptain: null,
  teamBKeeper: null,

  activeTeam: null,
};

const startMatchSlice = createSlice({
  name: "startMatch",
  initialState,
  reducers: {
    setTeamA: (state, action: PayloadAction<Team>) => {
      if (state.teamB?.id === action.payload.id) return;
      state.teamA = action.payload;
    },

    setTeamB: (state, action: PayloadAction<Team>) => {
      if (state.teamA?.id === action.payload.id) return;
      state.teamB = action.payload;
    },

    setActiveTeam: (state, action: PayloadAction<"A" | "B">) => {
      state.activeTeam = action.payload;
    },

    setTeamARoles: (
      state,
      action: PayloadAction<{
        captain: MatchPlayerRole;
        keeper: MatchPlayerRole;
      }>,
    ) => {
      state.teamACaptain = action.payload.captain;
      state.teamAKeeper = action.payload.keeper;
    },

    setTeamBRoles: (
      state,
      action: PayloadAction<{
        captain: MatchPlayerRole;
        keeper: MatchPlayerRole;
      }>,
    ) => {
      state.teamBCaptain = action.payload.captain;
      state.teamBKeeper = action.payload.keeper;
    },

    resetMatch: (state) => {
      state.teamA = null;
      state.teamB = null;
      state.teamACaptain;
      state.teamAKeeper;
      state.teamBCaptain;
      state.teamBKeeper;
    },
  },
});

export const {
  setTeamA,
  setTeamB,
  setTeamARoles,
  setTeamBRoles,
  setActiveTeam,
  resetMatch,
} = startMatchSlice.actions;

export default startMatchSlice.reducer;
