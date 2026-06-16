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

export interface Player {
  id: string;
  fullName: string;
  fullNameLower: string;
  userId: string;
  ownershipStatus: "GUEST" | "CLAIMED";
  profileImageUrl?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth?: string;
  city?: string;
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
  city?: string;
  gender?: string;
  dateOfBirth?: string;
  profileImageUrl?: string;
  createdSource: string;
  createdByActorType: string;
  createdByActorId: string;
  userId?: string;
  claimMobile?: string;
}
