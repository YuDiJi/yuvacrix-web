export type LiveStreamProvider = "YOUTUBE";

export type MatchLiveStream = {
  provider: LiveStreamProvider;
  videoId: string;
  watchUrl: string;
  embedUrl: string;
  isEnabled: boolean;
  configuredByUserId: string;
  updatedAt: string;
};

export type ConfigureMatchLiveStreamPayload = {
  youtubeUrl: string;
  isEnabled: boolean;
};

export type ConfigureMatchLiveStreamArgs = {
  matchId: string;
  body: ConfigureMatchLiveStreamPayload;
};

export type UpdateMatchLiveStreamStatusPayload = {
  isEnabled: boolean;
};

export type UpdateMatchLiveStreamStatusArgs = {
  matchId: string;
  body: UpdateMatchLiveStreamStatusPayload;
};
