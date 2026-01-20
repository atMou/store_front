"use client";

import React, { createContext, useContext } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { Notification } from "../types";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  connectionError: string | null;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  subscribeToOrder: (orderId: string) => Promise<void>;
  unsubscribeFromOrder: (orderId: string) => Promise<void>;
  subscribeToShipment: (shipmentId: string) => Promise<void>;
  unsubscribeFromShipment: (shipmentId: string) => Promise<void>;
  subscribeToProduct: (
    productId: string,
    colorCode: string,
    sizeCode: string
  ) => Promise<void>;
  unsubscribeFromProduct: (
    productId: string,
    colorCode: string,
    sizeCode: string
  ) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  persistNotifications?: boolean;
  onNotificationReceived?: (notification: Notification) => void;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 50,
  persistNotifications = true,
  onNotificationReceived,
}) => {
  const notificationData = useNotifications({
    maxNotifications,
    persistNotifications,
    onNotificationReceived,
  });

  return (
    <NotificationContext.Provider value={notificationData}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
