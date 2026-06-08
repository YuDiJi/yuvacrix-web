import { MeResponse, User } from "@/types/user";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendOtp: builder.mutation<{ success: boolean; message: string }, string>({
      query: (mobile) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: {
          mobile,
        },
      }),
    }),

    verifyOtp: builder.mutation<
      {
        token: string;
        user: User;
      },
      {
        mobile: string;
        otp: string;
      }
    >({
      query: ({ mobile, otp }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: {
          mobile,
          otp,
        },
      }),
      invalidatesTags: ["Auth"],
    }),

    getMe: builder.query<MeResponse, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/users/me",
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUpdateProfileMutation,
  useLazyGetMeQuery,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
