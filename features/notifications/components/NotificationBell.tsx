"use client";

import { Button } from "@/shared/ui";
import { Bell } from "lucide-react";
import { Notification } from "../types";
import NotificationBellDropdown from "./NotificationBellDropdown";

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
    <div className="relative inline-block z-100 group">
      <Button
        variant="plain"
        className="
          px-4 text-gray-800 flex items-center 
          border-transparent border-2 border-b-0
          group-hover:border-gray-800
          group-hover:bg-white
          relative z-70
          transition-colors duration-100 rounded-none
        "
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Button>

      <NotificationBellDropdown
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={onMarkAsRead}
        onMarkAllAsRead={onMarkAllAsRead}
        onClear={onClear}
        onClearAll={onClearAll}
      />
    </div>
  );
};

export default NotificationBell;
