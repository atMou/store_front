"use client";

import { useRouter } from "next/navigation";
import { useGetProductByIdQuery } from "@/features/product";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  CircleAlert,
  CreditCard,
  Gift,
  Info,
  Package,
  ShoppingBag,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  Notification,
  NotificationType,
  StockAlertNotification,
} from "../types";

interface NotificationBellDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClear: (id: string) => void;
  onClearAll: () => void;
}

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onClear,
  getNotificationColor,
  getNotificationIcon,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClear: (id: string) => void;
  getNotificationColor: (type: NotificationType) => string;
  getNotificationIcon: (type: NotificationType) => JSX.Element;
}) => {
  const router = useRouter();
  const isStockAlert =
    notification.type === NotificationType.Alert ||
    notification.type === NotificationType.Stock;
  const stockData = isStockAlert
    ? (notification.data as StockAlertNotification)
    : null;

  console.log("NotificationItem Render:", {
    id: notification.id,
    type: notification.type,
    isStockAlert,
    stockData,
    productId: stockData?.productId,
  });

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(
    { id: stockData?.productId ?? "", include: "images" },
    { skip: !isStockAlert || !stockData?.productId }
  );

  console.log("Product Fetch:", {
    productId: stockData?.productId,
    product,
    isLoading,
    error,
  });

  // Determine image: Priority 1: Notification Data, Priority 2: Fetched Product
  // Product images are an array of objects { url: string }, so we access [0]?.url
  const imageUrl = stockData?.imageUrl || product?.images?.[0]?.url;
  const productName = stockData?.brand || product?.slug || "Product";

  const handleNotificationClick = () => {
    if (stockData?.productId) {
      router.push(`/product/${stockData.productId}`);
    }
  };

  return (
    <div
      onClick={handleNotificationClick}
      className={`mb-4 pb-4 border-b border-gray-100 last:border-b-0 cursor-pointer ${
        !notification.read ? "bg-blue-50/30 -mx-6 px-6 py-3" : ""
      }`}
    >
      <div className="flex gap-3">
        {imageUrl ? (
          <div className="shrink-0 w-16 h-20 relative bg-gray-100 rounded-md overflow-hidden border border-gray-200">
            <Image
              src={imageUrl}
              alt={productName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${getNotificationColor(
              notification.type
            )}`}
          >
            {getNotificationIcon(notification.type)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm">{notification.title}</h4>
            {!notification.read && (
              <span className="shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1" />
            )}
          </div>

          {stockData ? (
            <div className="mt-1">
              <p className="text-sm font-medium text-gray-900">{productName}</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Color: <span className="font-medium">{stockData.color}</span> •
                Size: <span className="font-medium">{stockData.size}</span>
              </p>
              <p className="text-sm text-green-600 mt-1 font-medium">
                {notification.message}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          )}

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
  );
};

const NotificationBellDropdown: React.FC<NotificationBellDropdownProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
  onClearAll,
}) => {
  const getNotificationIcon = (type: NotificationType) => {
    const iconSize = 20;
    switch (type) {
      case NotificationType.Success:
        return <Check size={iconSize} className="text-green-600" />;
      case NotificationType.Alert:
        return <CircleAlert size={iconSize} className="text-indigo-600" />;
      case NotificationType.Error:
        return <X size={iconSize} className="text-red-600" />;
      case NotificationType.Warning:
        return <AlertTriangle size={iconSize} className="text-yellow-600" />;
      case NotificationType.Shipment:
        return <Package size={iconSize} className="text-blue-600" />;
      case NotificationType.Order:
        return <ShoppingBag size={iconSize} className="text-purple-600" />;
      case NotificationType.Stock:
        return <TrendingUp size={iconSize} className="text-orange-600" />;
      case NotificationType.Payment:
        return <CreditCard size={iconSize} className="text-teal-600" />;
      case NotificationType.NewProduct:
        return <Gift size={iconSize} className="text-pink-600" />;
      default:
        return <Info size={iconSize} className="text-gray-600" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.Success:
        return "bg-green-50 border-green-200";
      case NotificationType.Alert:
        return "bg-indigo-50 border-indigo-200";
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
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onClear={onClear}
              getNotificationColor={getNotificationColor}
              getNotificationIcon={getNotificationIcon}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationBellDropdown;
