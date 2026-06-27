import { ExtraType, WicketType } from "@/types/scoring";

export type OutFlowStep =
  | "SELECT_WICKET_TYPE"
  | "SELECT_DISMISSED_BATTER"
  | "SELECT_FIELDER"
  | "SELECT_DELIVERY_TYPE_AND_RUNS"
  | "CONFIRM";

export type BuildRunsResult = {
  runs?: {
    batRuns: number;
  };
  extra?: {
    type: ExtraType;
    additionalRuns: number;
  };
};

export type WicketConfig = {
  flow: OutFlowStep[];

  fieldersRequired?: 1 | 2;

  autoDismissedPlayer: "STRIKER" | "NON_STRIKER" | null;

  requiresStrikerSelectionAfterWicket?: boolean;

  confirmOption?: "WIDE_BALL" | "NO_BALL" | "DONT_COUNT_BALL" | "CAN_BAT_AGAIN";
};

export const WICKET_CONFIG: Record<WicketType, WicketConfig> = {
  BOWLED: {
    flow: ["CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: false,
  },

  CAUGHT: {
    flow: ["SELECT_FIELDER", "CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    fieldersRequired: 1,
    requiresStrikerSelectionAfterWicket: true,
  },

  CAUGHT_BEHIND: {
    flow: ["SELECT_FIELDER", "CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: true,
  },

  CAUGHT_AND_BOWLED: {
    flow: ["CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: true,
  },

  RUN_OUT: {
    flow: [
      "SELECT_DISMISSED_BATTER",
      "SELECT_FIELDER",
      "SELECT_DELIVERY_TYPE_AND_RUNS",
      "CONFIRM",
    ],
    autoDismissedPlayer: null,
    fieldersRequired: 2,
    requiresStrikerSelectionAfterWicket: true,
  },

  LBW: {
    flow: ["CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: false,
  },

  STUMPED: {
    flow: ["SELECT_FIELDER", "CONFIRM"],
    fieldersRequired: 1,
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: false,
    confirmOption: "WIDE_BALL",
  },

  RETIRED_HURT: {
    flow: [
      "SELECT_DISMISSED_BATTER",
      "SELECT_DELIVERY_TYPE_AND_RUNS",
      "CONFIRM",
    ],
    autoDismissedPlayer: null,
    requiresStrikerSelectionAfterWicket: false,
    confirmOption: "DONT_COUNT_BALL",
  },

  MANKADED: {
    flow: ["CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: false,
  },

  HIT_WICKET: {
    flow: ["CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: false,
    confirmOption: "WIDE_BALL",
  },

  ///////////////// yet to deciede flow
  ABSENT_HURT: {
    flow: ["SELECT_DISMISSED_BATTER", "CONFIRM"],
    autoDismissedPlayer: null,
    requiresStrikerSelectionAfterWicket: false,
  },

  RETIRED_OUT: {
    flow: [
      "SELECT_DISMISSED_BATTER",
      "SELECT_DELIVERY_TYPE_AND_RUNS",
      "CONFIRM",
    ],
    autoDismissedPlayer: null,
    requiresStrikerSelectionAfterWicket: false,
    confirmOption: "DONT_COUNT_BALL",
  },

  HIT_BALL_TWICE: {
    flow: ["CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: false,
    confirmOption: "NO_BALL",
  },

  OBSTRUCTING_FIELD: {
    flow: [
      "SELECT_DISMISSED_BATTER",
      "SELECT_DELIVERY_TYPE_AND_RUNS",
      "CONFIRM",
    ],
    autoDismissedPlayer: null,
    requiresStrikerSelectionAfterWicket: true,
  },

  ///////////////// yet to deciede flow

  TIMED_OUT: {
    flow: ["SELECT_DISMISSED_BATTER", "CONFIRM"],
    autoDismissedPlayer: null,
    requiresStrikerSelectionAfterWicket: false,
  },

  RETIRED: {
    flow: ["SELECT_DISMISSED_BATTER", "CONFIRM"],
    autoDismissedPlayer: null,
    requiresStrikerSelectionAfterWicket: false,
    confirmOption: "CAN_BAT_AGAIN",
  },
};
