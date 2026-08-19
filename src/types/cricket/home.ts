export type HomeIcon =
  | "LIVE"
  | "TEAM"
  | "TROPHY"
  | "BROADCAST"
  | "LIGHTNING"
  | "SCORECARD"
  | "PLAYER"
  | "EDIT"
  | "CALENDAR"
  | "STATS"
  | "PLUS"
  | "GROUP"
  | "ARROW_RIGHT";

export type HomeActionType = "NAVIGATION" | "EXTERNAL_LINK";

export type HomeCtaAction = {
  actionType: HomeActionType;
  route: string | null;
  url: string | null;
};

export type HomeBannerStat = {
  label: string;
  value: string;
  icon: HomeIcon;
};

export type HomeBannerHighlight = {
  label: string;
  icon: HomeIcon;
};

export type HomeBanner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  ctaText: string | null;
  ctaAction: HomeCtaAction | null;
  stats: HomeBannerStat[];
  highlights: HomeBannerHighlight[];
  sortOrder: number;
};

export type HomeQuickAction = {
  id: string;
  title: string;
  icon: HomeIcon;
  actionType: HomeActionType;
  route: string;
  sortOrder: number;
  enabled: boolean;
};

export type HomeActivityItem = {
  id: string;
  title: string;
  value: number;
  subtitle: string | null;
  actionText: string;
  route: string;
  icon: HomeIcon;
  sortOrder: number;
};

export type HomeTournamentTeam = {
  teamId: string;
  name: string;
  logoUrl: string | null;
  rank: number;
  points: number;
};

export type HomeTournament = {
  seriesId: string;
  title: string;
  subtitle: string | null;
  matchTypeLabel: string;
  completedMatches: number;
  totalMatches: number;
  progressPercent: number;
  theme: "BLUE" | "PURPLE" | "PINK" | string;
  topTeams: HomeTournamentTeam[];
  route: string;
};

export type HomeCricketPulse = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  tagText: string;
  tagIcon: HomeIcon;
  route: string | null;
  sortOrder: number;
};

export type HomeMetadata = {
  source: string;
  version: string;
};

export type HomeResponse = {
  generatedAt: string;
  banners: HomeBanner[];
  quickActions: HomeQuickAction[];
  todayLiveMatches: unknown[];
  myActivity: HomeActivityItem[];
  activeTournaments: HomeTournament[];
  cricketPulse: HomeCricketPulse[];
  metadata: HomeMetadata;
};

export type GetHomeRequest = {
  liveMatchLimit?: number;
  city?: string;
};
