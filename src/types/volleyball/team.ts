import type { SportType } from "@/types/sport";

export const VOLLEYBALL_POSITIONS = {
  SETTER: "SETTER",
  OUTSIDE_HITTER: "OUTSIDE_HITTER",
  OPPOSITE: "OPPOSITE",
  MIDDLE_BLOCKER: "MIDDLE_BLOCKER",
  LIBERO: "LIBERO",
  DEFENSIVE_SPECIALIST: "DEFENSIVE_SPECIALIST",
} as const;

export type VolleyballPosition =
  (typeof VOLLEYBALL_POSITIONS)[keyof typeof VOLLEYBALL_POSITIONS];

export type VolleyballMembershipStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "LEFT"
  | "REMOVED"
  | (string & {});

export interface AddVolleyballTeamMemberDto {
  playerId: string;
  jerseyNumber: number;
  primaryPosition: VolleyballPosition;
  secondaryPosition?: VolleyballPosition;
}

export interface UpdateVolleyballTeamMemberDto {
  jerseyNumber?: number;
  primaryPosition?: VolleyballPosition;
  secondaryPosition?: VolleyballPosition | null;
}

export interface VolleyballTeamMember {
  membershipId: string;
  playerId: string;
  fullName: string;
  profileImageUrl: string | null;
  membershipStatus: VolleyballMembershipStatus;
  roles: string[];
  jerseyNumber: number;
  primaryPosition: VolleyballPosition;
  secondaryPosition: VolleyballPosition | null;
  joinedAt: string;
}

export interface GetVolleyballTeamMembersResponse {
  teamId: string;
  sportType: SportType;
  members: VolleyballTeamMember[];
}
