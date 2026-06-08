import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle Unauthorized
  if (result.error?.status === 401) {
    // Try refresh token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed

      // Optional:
      api.dispatch(logout());
      window.location.href = "/login";
    }
  }

  return result;
};

// src/store/api/baseApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { logout } from "../auth/authSlice";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithInterceptor,

  tagTypes: ["Auth", "Player"],

  endpoints: () => ({}),
});
