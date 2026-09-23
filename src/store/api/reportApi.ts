import {
  CreateReportRequest,
  CreateReportResponse,
} from "@/types/report";
import { baseApi } from "./baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitReport: builder.mutation<CreateReportResponse, CreateReportRequest>({
      query: (body) => ({
        url: "/reports",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSubmitReportMutation } = reportApi;
