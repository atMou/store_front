import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "./types";

export interface ProductSubscription {
  productId: string;
  sizeCode: string;
  subscribedAt: string;
}

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  subscriptions: ProductSubscription[];
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  subscriptions: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items = [action.payload, ...state.items];
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },

    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllAsRead: (state) => {
      state.items.forEach((n) => (n.read = true));
      state.unreadCount = 0;
    },

    clearNotification: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.items = state.items.filter((n) => n.id !== action.payload);
    },

    clearAllNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
      state.subscriptions = [];
    },

    addSubscription: (state, action: PayloadAction<ProductSubscription>) => {
      const exists = state.subscriptions.some(
        (sub) =>
          sub.productId === action.payload.productId &&
          sub.sizeCode === action.payload.sizeCode
      );
      if (!exists) {
        state.subscriptions.push(action.payload);
      }
    },

    removeSubscription: (
      state,
      action: PayloadAction<{ productId: string; sizeCode: string }>
    ) => {
      state.subscriptions = state.subscriptions.filter(
        (sub) =>
          !(
            sub.productId === action.payload.productId &&
            sub.sizeCode === action.payload.sizeCode
          )
      );
    },

    setSubscriptions: (state, action: PayloadAction<ProductSubscription[]>) => {
      state.subscriptions = action.payload;
    },

    clearSubscriptions: (state) => {
      state.subscriptions = [];
    },

    trimNotifications: (state, action: PayloadAction<number>) => {
      const maxNotifications = action.payload;
      if (state.items.length > maxNotifications) {
        const removed = state.items.slice(maxNotifications);
        const removedUnread = removed.filter((n) => !n.read).length;
        state.items = state.items.slice(0, maxNotifications);
        state.unreadCount = Math.max(0, state.unreadCount - removedUnread);
      }
    },
  },
});

export const notificationActions = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;

// Selectors
export const selectNotifications = (state: {
  notifications: NotificationState;
}) => state.notifications.items;
export const selectUnreadCount = (state: {
  notifications: NotificationState;
}) => state.notifications.unreadCount;
export const selectSubscriptions = (state: {
  notifications: NotificationState;
}) => state.notifications.subscriptions;
