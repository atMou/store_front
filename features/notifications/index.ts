// Service exports
export { NotificationHubClient } from "./services/NotificationHubClient";

// API exports
export * from "./api";

// Slice exports
export * from "./slice";
export { notificationActions, type ProductSubscription } from "./slice";

// Type exports
export * from "./types";

// Hook exports
export { useNotifications } from "./hooks/useNotifications";

// Component exports
export { default as NotificationIcon } from "./components/NotificationIcon";
export {
  default as NotificationProvider,
  useNotificationContext,
} from "./components/NotificationProvider";
export { default as SubscribeButton } from "./components/SubscribeButton";
