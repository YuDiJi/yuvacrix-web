import { SportType } from "./sport";

export interface Team {
  id: string;
  name: string;

  shortName?: string | null;
  city?: string | null;

  logoUrl?: string;
  description?: string;
  sportType: string;
  memberCount?: number;
  isAdmin?: boolean;
}

export interface CreateTeamDto {
  name: string;
  shortName?: string;
  city?: string;
  logoUrl?: string;
  description?: string;
  sportType: SportType;
}
