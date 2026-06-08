export type Team = {
  id: string;
  name: string;
  location: string;
  playersCount: number;
  logo?: string;
  shortName?: string;
};

export type Player = {
  id: string;
  name: string;
  role: string;
  battingStyle: string;
  bowlingStyle?: string;
  profileImageUrl?: string;
};
