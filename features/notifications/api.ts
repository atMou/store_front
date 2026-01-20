import { baseApi } from "@/store/apis/base-api";

// Note: Product subscriptions are managed via SignalR NotificationHub, not REST API
// See useNotifications hook for subscription methods

export const notificationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: () => ({
    // No endpoints - notifications are handled via SignalR
    // Future: Could add endpoints for notification history, preferences, etc.
  }),
});

export const {} = notificationApi;
