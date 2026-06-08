export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  sportType: string;
}

export interface GetTeamResponse {
  success: boolean;
  team: Team;
}

export interface CreateTeamDto {
  name: string;
  city?: string;
  logoUrl?: string;
  description?: string;
  sportType: string;
}
