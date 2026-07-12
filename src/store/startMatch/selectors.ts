import { RootState } from "../index";

export const selectTeamA = (state: RootState) => state.startMatch.teamA;

export const selectTeamB = (state: RootState) => state.startMatch.teamB;

export const selectTeamACaptain = (state: RootState) =>
  state.startMatch.teamACaptain;
export const selectTeamAKeeper = (state: RootState) =>
  state.startMatch.teamAKeeper;

export const selectTeamBCaptain = (state: RootState) =>
  state.startMatch.teamBCaptain;
export const selectTeamBKeeper = (state: RootState) =>
  state.startMatch.teamBKeeper;

export const selectMatchId = (state: RootState) => state.startMatch.matchId;

export const selectTournamentId = (state: RootState) =>
  state.startMatch.tournamentId;

export const selectRoundId = (state: RootState) => state.startMatch.roundId;

export const selectLineUpMode = (state: RootState) =>
  state.startMatch.lineUpMode;
