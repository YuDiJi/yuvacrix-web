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
