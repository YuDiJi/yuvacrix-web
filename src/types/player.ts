import { SportType } from "./sport";

export type BattingStyle = "RIGHT_HAND_BAT" | "LEFT_HAND_BAT";
export type BowlingStyle =
  | "RIGHT_ARM_FAST"
  | "RIGHT_ARM_FAST_MEDIUM"
  | "RIGHT_ARM_MEDIUM"
  | "RIGHT_ARM_OFF_BREAK"
  | "RIGHT_ARM_LEG_BREAK"
  | "LEFT_ARM_FAST"
  | "LEFT_ARM_FAST_MEDIUM"
  | "LEFT_ARM_ORTHODOX"
  | "LEFT_ARM_WRIST_SPIN";

export type PlayerRole = "BATTER" | "BOWLER" | "ALL_ROUNDER" | "WICKET_KEEPER";

export interface Player {
  id: string;
  fullName: string;
  fullNameLower: string;
  userId: string;
  activeSport?: SportType;
  ownershipStatus: "GUEST" | "CLAIMED";
  profileImageUrl?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth?: string;
  city?: string;
  bio?: string;
  playerRole?: PlayerRole;
  battingStyle?: BattingStyle;
  bowlingStyle?: BowlingStyle;
  createdSource: string;
  createdBy: {
    actorType: string;
    actorId: string;
  };
  isActive: boolean;
  mergedInto: string | null;
  mergedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetPlayerResponse {
  success: boolean;
  player: Player;
}

export interface CreatePlayerDto {
  fullName: string;
  fullNameLower?: string;
  activeSport?: SportType;
  profileImageUrl?: string;
  gender?: string;
  dateOfBirth?: string;
  city?: string;
  bio?: string;
  playerRole?: PlayerRole;
  battingStyle?: BattingStyle;
  bowlingStyle?: BowlingStyle;
  createdSource: string;
  createdByActorType: string;
  createdByActorId: string;
  userId?: string;
  claimMobile?: string;
}
