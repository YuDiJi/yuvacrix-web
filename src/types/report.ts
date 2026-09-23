export type FeedbackType = "BUG" | "QUERY" | "IDEA";

export interface CreateReportRequest {
  type: FeedbackType;
  subject: string;
  description: string;
  evidenceKeys?: string[];
}

export interface CreateReportResponse {
  id: string;
  type: FeedbackType;
  subject: string;
  status: "OPEN";
  createdAt: string;
  updatedAt: string;
}
