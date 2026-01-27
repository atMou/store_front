"use client";

import HeaderIcon from "@/components/layouts/header/HeaderIcon";
import { Bell } from "lucide-react";
import NotificationBellDropdown from "./NotificationDropdown";
import { useNotificationContext } from "./NotificationProvider";

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
    <HeaderIcon
      icon={<Bell size={20} />}
      badgeCount={unreadCount}
      label="Notifications"
    >
      <NotificationBellDropdown
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onClear={clearNotification}
        onClearAll={clearAll}
      />
    </HeaderIcon>
  );
}
