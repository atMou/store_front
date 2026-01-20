"use client";

import {
  NotificationBell,
  useNotificationContext,
} from "@/features/notifications";

export default function NotificationIcon() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
  } = useNotificationContext();

  return (
    <NotificationBell
      notifications={notifications}
      unreadCount={unreadCount}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={markAllAsRead}
      onClear={clearNotification}
      onClearAll={clearAll}
    />
  );
}
