export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  sportType: string;
  memberCount?: number;
  isAdmin?: boolean;
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

// ─── Cricket profile team history ─────────────────────────────────────────────

export type TeamMembershipStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "LEFT"
  | "REMOVED"
  | (string & {});

export type CricketProfileTeamPerformance = {
  played: number;
  won: number;
  lost: number;
};

export type CricketProfileTeamHistoryItem = {
  teamId: string;
  name: string;
  shortName: string | null;
  logoUrl: string | null;
  initials: string;
  city: string | null;

  memberSince: string | null;
  membershipStatus: TeamMembershipStatus;

  isVerified: boolean;

  performance: CricketProfileTeamPerformance;
};

export type CricketProfileTeamsPagination = {
  skip: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type GetMyCricketProfileTeamsResponse = {
  items: CricketProfileTeamHistoryItem[];
  pagination: CricketProfileTeamsPagination;
};

export type GetMyCricketProfileTeamsQuery = {
  skip?: number;
  limit?: number;
  currentOnly?: boolean;
};

export type TeamOverviewFilter = "YOUR" | "PARTICIPATE" | "ALL"; ////// | "NETWORK"

export interface GetMyTeamsOverviewParams {
  filter: TeamOverviewFilter;
  skip: number;
  limit: number;
}

export interface TeamsOverviewPagination {
  skip: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface GetMyTeamsOverviewResponse {
  items: Team[];
  pagination: TeamsOverviewPagination;
}
