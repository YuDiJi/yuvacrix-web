export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  sportType: string;
  memberCount?: number;
}

export interface CreateTeamDto {
  name: string;
  city?: string;
  logoUrl?: string;
  description?: string;
  sportType: string;
}

export interface AddTeamMemberDto {
  playerId: string;
}

export interface TeamMember {
  fullName: string;
  joinedAt: string;
  membershipId: string;
  playerId: string;
  profileImageUrl?: null | string;
  roles: string[];
}
