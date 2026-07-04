// src/store/api/uploadApi.ts
import { baseApi } from "./baseApi";

export type UploadPurpose =
  | "PLAYER_AVATAR"
  | "TEAM_LOGO"
  | "TOURNAMENT_BANNER"
  | "SERIES_BANNER"
  | "MATCH_IMAGE"
  | "SCORECARD_IMAGE"
  | "HOME_BANNER"
  | "DOCUMENT"
  | "OTHER";

export type UploadedFile = {
  bucket: string;
  key: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  signedUrl: string;
  signedUrlExpiresInSeconds: number;
};

export type UploadResponse = {
  success: boolean;
  file: UploadedFile;
};

export type SignedUrlResponse = {
  success: boolean;
  key: string;
  signedUrl: string;
  expiresInSeconds: number;
};

export const imageUploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<
      UploadResponse,
      { purpose: UploadPurpose; file: File }
    >({
      query: ({ purpose, file }) => {
        const formData = new FormData();
        formData.append("purpose", purpose);
        formData.append("file", file);

        return {
          url: "/uploads",
          method: "POST",
          body: formData,
        };
      },
    }),

    getSignedUrl: builder.query<SignedUrlResponse, string>({
      query: (key) => ({
        url: "/uploads/signed-url",
        method: "GET",
        params: { key },
      }),
    }),
  }),
});

export const { useUploadFileMutation, useGetSignedUrlQuery } = imageUploadApi;
