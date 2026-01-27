"use client";

import HeaderIcon from "@/components/layouts/header/HeaderIcon";
import { Bell } from "lucide-react";
import { Notification } from "../types";
import NotificationBellDropdown from "./NotificationDropdown";

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClear: (id: string) => void;
  onClearAll: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
  onClearAll,
}) => {
  return (
    <HeaderIcon
      icon={<Bell size={20} />}
      badgeCount={unreadCount}
      label="Notifications"
    >
      <NotificationBellDropdown
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={onMarkAsRead}
        onMarkAllAsRead={onMarkAllAsRead}
        onClear={onClear}
        onClearAll={onClearAll}
      />
    </HeaderIcon>
  );
};

export default NotificationBell;
