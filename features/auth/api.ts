import { baseApi } from "@/store";
import { cartActions } from "../cart";
import { notificationActions } from "../notifications/slice";
import { userActions } from "../user/slice";
import { User } from "../user/types";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<
      { accessToken: string; user: User },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (data?.accessToken && data?.user) {
            dispatch(userActions.setAccessToken(data.accessToken));
            dispatch(userActions.setUser(data.user));

            dispatch(userActions.mergeLikedProducts());
          }
        } catch {}
      },
    }),
    register: builder.mutation<string, FormData>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    sendVerificationCode: builder.mutation<string, { email: string }>({
      query: ({ email }) => ({
        url: "/auth/send-verification",
        method: "POST",
        body: { email },
      }),
    }),

    verifyEmail: builder.mutation<
      { accessToken: string; user: User },
      { email: string; code?: string; token?: string; rememberMe?: boolean }
    >({
      query: ({ email, code, rememberMe }) => ({
        url: "/auth/verify",
        method: "POST",
        body: { email, code, rememberMe },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (data?.accessToken && data?.user) {
            dispatch(userActions.setAccessToken(data.accessToken));
            dispatch(userActions.setUser(data.user));

            // Merge guest liked products with user account
            dispatch(userActions.mergeLikedProducts());
          }
        } catch {}
      },
    }),
    resendVerificationCode: builder.mutation<string, { email: string }>({
      query: ({ email }) => ({
        url: "/auth/resend-code",
        method: "POST",
        body: { email },
      }),
    }),

    logout: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: "/auth/logout",
        method: "POST",
        body: { email },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(userActions.clearUser());
          dispatch(userActions.clearTokens());
          dispatch(cartActions.clearCart());
          dispatch(notificationActions.clearAllNotifications());
        } catch {
          dispatch(userActions.clearUser());
          dispatch(userActions.clearTokens());
          dispatch(cartActions.clearCart());
          dispatch(notificationActions.clearAllNotifications());
        }
      },
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),
    checkAuth: builder.mutation<{ accessToken: string; user: User }, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (data?.accessToken && data?.user) {
            dispatch(userActions.setAccessToken(data.accessToken));
            dispatch(userActions.setUser(data.user));
          }
        } catch {
          // Clear tokens on auth check failure
          dispatch(userActions.clearUser());
          dispatch(userActions.clearTokens());
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationCodeMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useCheckAuthMutation,
} = authApi;
