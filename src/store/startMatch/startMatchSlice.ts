import { Team } from "@/types/cricket/team";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MatchPlayerRole = {
  id: string;
  name: string;
};
type MatchCreationMode = "PLAY_NOW" | "SCHEDULE";

type StartMatchState = {
  matchSource: "NORMAL" | "TOURNAMENT";

  tournamentId: string | null;
  roundId: string | null;
  groupId: string | null;
  fixtureId: string | null;
  creationMode: MatchCreationMode;

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
  matchSource: "NORMAL",

  tournamentId: null,
  roundId: null,
  groupId: null,
  fixtureId: null,
  creationMode: "PLAY_NOW",

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
        fixtureId?: string;
      }>,
    ) => {
      state.matchId = action.payload.matchId;
      state.lineUpMode = action.payload.lineUpMode;
      state.fixtureId = action.payload.fixtureId ?? null;
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

    setMatchCreationMode: (state, action: PayloadAction<MatchCreationMode>) => {
      state.creationMode = action.payload;
    },

    setTournamentMatchContext: (
      state,
      action: PayloadAction<{
        tournamentId: string;
        roundId: string;
        groupId?: string | null;
      }>,
    ) => {
      state.matchSource = "TOURNAMENT";
      state.tournamentId = action.payload.tournamentId;
      state.roundId = action.payload.roundId;
      state.groupId = action.payload.groupId ?? null;
    },

    setTournamentGroupId: (state, action: PayloadAction<string | null>) => {
      state.groupId = action.payload;
    },

    resetMatch: (state) => {
      state.matchSource = "NORMAL";
      state.tournamentId = null;
      state.roundId = null;
      state.groupId = null;
      state.fixtureId = null;
      state.creationMode = "PLAY_NOW";
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
  setTournamentMatchContext,
  setMatchCreationMode,
  setTournamentGroupId,
  resetMatch,
} = startMatchSlice.actions;

export default startMatchSlice.reducer;
