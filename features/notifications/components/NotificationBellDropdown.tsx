"use client";

import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { Notification, NotificationType } from "../types";

interface NotificationBellDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClear: (id: string) => void;
  onClearAll: () => void;
}

const NotificationBellDropdown: React.FC<NotificationBellDropdownProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
  onClearAll,
}) => {
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.Success:
        return "✓";
      case NotificationType.Error:
        return "✕";
      case NotificationType.Warning:
        return "⚠";
      case NotificationType.Shipment:
        return "📦";
      case NotificationType.Order:
        return "🛍️";
      case NotificationType.Stock:
        return "📊";
      case NotificationType.Payment:
        return "💳";
      case NotificationType.NewProduct:
        return "🎁";
      default:
        return "ℹ";
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.Success:
        return "bg-green-50 border-green-200";
      case NotificationType.Error:
        return "bg-red-50 border-red-200";
      case NotificationType.Warning:
        return "bg-yellow-50 border-yellow-200";
      case NotificationType.Shipment:
        return "bg-blue-50 border-blue-200";
      case NotificationType.Order:
        return "bg-purple-50 border-purple-200";
      case NotificationType.Stock:
        return "bg-orange-50 border-orange-200";
      case NotificationType.Payment:
        return "bg-teal-50 border-teal-200";
      case NotificationType.NewProduct:
        return "bg-pink-50 border-pink-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="absolute right-0  w-[350px] bg-white border-2 border-black  opacity-0  pointer-events-none group-hover:opacity-100 -translate-y-0.5 group-hover:pointer-events-auto transition-all duration-100 ease-in-out z-50">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h2 className=" font-bold text-center">Notifications</h2>
          <p className="text-sm text-gray-600 ">{unreadCount} unread</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Mark all as read"
            >
              <CheckCheck size={18} />
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="p-2 hover:bg-gray-100 rounded-full text-red-600"
              title="Clear all"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[400px] overflow-y-auto px-6 py-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center space-y-2">
            <Bell size={48} className="text-gray-300" />
            <p className="text-sm font-bold">No notifications</p>
            <p className="text-gray-600 text-center text-xs">
              You&apos;re all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`mb-4 pb-4 border-b border-gray-100 last:border-b-0 ${
                !notification.read ? "bg-blue-50/30 -mx-6 px-6 py-3" : ""
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg border ${getNotificationColor(
                    notification.type
                  )}`}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm">
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <span className="shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => onClear(notification.id)}
                    className="p-1.5 hover:bg-red-100 rounded text-red-600 transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationBellDropdown;
