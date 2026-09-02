export const VOLLEYBALL_MY_SCOPES = {
  ALL: "ALL",
  PLAYED: "PLAYED",
  CREATED: "CREATED",
  NETWORK: "NETWORK",
} as const;

export type VolleyballMyScope =
  (typeof VOLLEYBALL_MY_SCOPES)[keyof typeof VOLLEYBALL_MY_SCOPES];

export interface VolleyballViewerRelation {
  created: boolean;
  played: boolean;
  network: boolean;
  admin: boolean;
}
