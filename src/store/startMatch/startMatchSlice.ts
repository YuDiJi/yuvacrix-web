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

  matchId: string | null;
  lineUpMode: "FIXED" | "FLEXIBLE";
};

const initialState: StartMatchState = {
  teamA: null,
  teamB: null,

  teamACaptain: null,
  teamAKeeper: null,

  teamBCaptain: null,
  teamBKeeper: null,

  activeTeam: null,

  matchId: null,
  lineUpMode: "FLEXIBLE",
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

    setMatchIdMode: (
      state,
      action: PayloadAction<{
        matchId: string;
        lineUpMode: "FIXED" | "FLEXIBLE";
      }>,
    ) => {
      state.matchId = action.payload.matchId;
      state.lineUpMode = action.payload.lineUpMode;
    },

    setMatchContext: (
      state,
      action: PayloadAction<{
        matchId: string;
        lineUpMode: "FIXED" | "FLEXIBLE";

        teamA: Team;
        teamB: Team;

        teamACaptain: MatchPlayerRole | null;
        teamAKeeper: MatchPlayerRole | null;

        teamBCaptain: MatchPlayerRole | null;
        teamBKeeper: MatchPlayerRole | null;
      }>,
    ) => {
      state.matchId = action.payload.matchId;
      state.lineUpMode = action.payload.lineUpMode;

      state.teamA = action.payload.teamA;
      state.teamB = action.payload.teamB;

      state.teamACaptain = action.payload.teamACaptain;
      state.teamAKeeper = action.payload.teamAKeeper;

      state.teamBCaptain = action.payload.teamBCaptain;
      state.teamBKeeper = action.payload.teamBKeeper;
    },

    resetMatch: (state) => {
      state.teamA = null;
      state.teamB = null;
      state.teamACaptain = null;
      state.teamAKeeper = null;
      state.teamBCaptain = null;
      state.teamBKeeper = null;
      state.matchId = null;
      state.lineUpMode = "FLEXIBLE";
    },
  },
});

export const {
  setTeamA,
  setTeamB,
  setTeamARoles,
  setTeamBRoles,
  setActiveTeam,
  setMatchIdMode,
  setMatchContext,
  resetMatch,
} = startMatchSlice.actions;

export default startMatchSlice.reducer;
