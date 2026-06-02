import { User } from "@/types/user";
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
        user: any;
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

    getMe: builder.query<User, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/profile",
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
  useLazyGetMeQuery,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
