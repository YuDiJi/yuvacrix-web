import { WicketType } from "@/types/scoring";

export type OutFlowStep =
  | "SELECT_WICKET_TYPE"
  | "SELECT_DISMISSED_BATTER"
  | "SELECT_FIELDER"
  // | "SELECT_WICKET_KEEPER"
  | "SELECT_DELIVERY_TYPE_AND_RUNS"
  | "CONFIRM";

export type DeliveryUIType =
  | "FULL" // Run Out, Obstructing Field
  | "WIDE_CHECKBOX" // Stumped, Hit Wicket
  | "NO_BALL_CHECKBOX" // Hit Ball Twice
  | "DONT_COUNT_BALL" // Retired Hurt, Retired Out
  | "CAN_BAT_AGAIN" // Retired
  | "NONE";

export type WicketConfig = {
  flow: OutFlowStep[];

  fieldersRequired?: 1 | 2;

  wicketKeeperRequired?: boolean;

  autoDismissedPlayer: "STRIKER" | "NON_STRIKER" | null;

  requiresStrikerSelectionAfterWicket?: boolean;

  deliveryUI: DeliveryUIType;
};

export const WICKET_CONFIG: Record<WicketType, WicketConfig> = {
  BOWLED: {
    flow: ["CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: false,
    deliveryUI: "NONE",
  },

  CAUGHT: {
    flow: ["SELECT_FIELDER", "CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    fieldersRequired: 1,
    requiresStrikerSelectionAfterWicket: true,
    deliveryUI: "NONE",
  },

  CAUGHT_BEHIND: {
    flow: ["SELECT_FIELDER", "CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    wicketKeeperRequired: true,
    requiresStrikerSelectionAfterWicket: true,
    deliveryUI: "NONE",
  },

  CAUGHT_AND_BOWLED: {
    flow: ["CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: true,
    deliveryUI: "NONE",
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
    deliveryUI: "FULL",
  },

  LBW: {
    flow: ["CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: false,
    deliveryUI: "NONE",
  },

  STUMPED: {
    flow: ["SELECT_FIELDER", "SELECT_DELIVERY_TYPE_AND_RUNS", "CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: false,
    deliveryUI: "WIDE_CHECKBOX",
  },

  RETIRED_HURT: {
    flow: [
      "SELECT_DISMISSED_BATTER",
      "SELECT_DELIVERY_TYPE_AND_RUNS",
      "CONFIRM",
    ],
    autoDismissedPlayer: null,
    requiresStrikerSelectionAfterWicket: false,
    deliveryUI: "DONT_COUNT_BALL",
  },

  MANKADED: {
    flow: ["CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: false,
    deliveryUI: "NONE",
  },

  HIT_WICKET: {
    flow: ["SELECT_DELIVERY_TYPE_AND_RUNS", "CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: false,
    deliveryUI: "WIDE_CHECKBOX",
  },

  ///////////////// yet to deciede flow
  ABSENT_HURT: {
    flow: ["SELECT_DISMISSED_BATTER", "CONFIRM"],
    autoDismissedPlayer: null,
    requiresStrikerSelectionAfterWicket: false,
    deliveryUI: "NONE",
  },

  RETIRED_OUT: {
    flow: [
      "SELECT_DISMISSED_BATTER",
      "SELECT_DELIVERY_TYPE_AND_RUNS",
      "CONFIRM",
    ],
    autoDismissedPlayer: null,
    requiresStrikerSelectionAfterWicket: false,
    deliveryUI: "DONT_COUNT_BALL",
  },

  HIT_BALL_TWICE: {
    flow: ["SELECT_DELIVERY_TYPE_AND_RUNS", "CONFIRM"],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: false,
    deliveryUI: "NO_BALL_CHECKBOX",
  },

  OBSTRUCTING_FIELD: {
    flow: [
      "SELECT_DISMISSED_BATTER",
      "SELECT_DELIVERY_TYPE_AND_RUNS",
      "CONFIRM",
    ],
    autoDismissedPlayer: null,
    requiresStrikerSelectionAfterWicket: true,
    deliveryUI: "FULL",
  },

  ///////////////// yet to deciede flow

  TIMED_OUT: {
    flow: ["SELECT_DISMISSED_BATTER", "CONFIRM"],
    autoDismissedPlayer: null,
    requiresStrikerSelectionAfterWicket: false,
    deliveryUI: "NONE",
  },

  RETIRED: {
    flow: [
      "SELECT_DISMISSED_BATTER",
      "SELECT_DELIVERY_TYPE_AND_RUNS",
      "CONFIRM",
    ],
    autoDismissedPlayer: "STRIKER",
    requiresStrikerSelectionAfterWicket: false,
    deliveryUI: "CAN_BAT_AGAIN",
  },
};
