export { NotificationHubClient } from "./services/NotificationHubClient";

export * from "./api";

export * from "./slice";
export { notificationActions, type ProductSubscription } from "./slice";

export * from "./types";

export { useNotifications } from "./hooks/useNotifications";

export { default as NotificationIcon } from "./components/NotificationIcon";
export {
  default as NotificationProvider,
  useNotificationContext,
} from "./components/NotificationProvider";
export { default as SubscribeButton } from "./components/SubscribeButton";
