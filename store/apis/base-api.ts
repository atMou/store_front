import { notificationActions } from "@/features/notifications/slice";
import { userActions } from "@/features/user/slice";
import { User } from "@/features/user/types";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

interface RefreshTokenResponse {
  accessToken: string;
  user: User;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL as string,
  credentials: "include",
  mode: "cors",
  timeout: 60000,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (headers.get("Content-Type")?.includes("multipart")) {
      headers.delete("Content-Type");
    }

    return headers;
  },
});

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (isRefreshing && refreshPromise) {
      await refreshPromise;
      return await rawBaseQuery(args, api, extraOptions);
    }

    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const refreshResult = await rawBaseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const { accessToken, user } =
            refreshResult.data as RefreshTokenResponse;

          if (accessToken && user) {
            api.dispatch(userActions.setAccessToken(accessToken));
            api.dispatch(userActions.setUser(user));
            return true;
          }
        }

        api.dispatch(userActions.clearUser());
        api.dispatch(userActions.clearTokens());
        api.dispatch(notificationActions.clearAllNotifications());
        return false;
      } catch {
        api.dispatch(userActions.clearUser());
        api.dispatch(userActions.clearTokens());
        api.dispatch(notificationActions.clearAllNotifications());
        return false;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    const refreshSuccess = await refreshPromise;

    if (refreshSuccess) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "baseApi",
  tagTypes: [
    "Product",
    "User",
    "Cart",
    "Order",
    "Variant",
    "Category",
    "Payment",
    "Reviews",
    "Brands",
    "Materials",
    "Chat",
    "ChatSession",
    "Inventory",
    "Subscriptions",
  ],
  endpoints: () => ({}),
});
