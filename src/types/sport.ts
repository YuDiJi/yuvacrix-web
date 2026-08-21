// src/types/sport.ts

export const SPORT_TYPES = {
  CRICKET: "CRICKET",
  VOLLEYBALL: "VOLLEYBALL",
} as const;

export type SportType = (typeof SPORT_TYPES)[keyof typeof SPORT_TYPES];
