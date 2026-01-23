"use client";

import { selectAccessToken } from "@/features/user/slice";
import { logger } from "@/shared/lib/logger";
import { TryAsync } from "@/shared/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { store } from "@/store/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { NotificationHubClient } from "../services/NotificationHubClient";
import {
  notificationActions,
  selectNotifications,
  selectUnreadCount,
} from "../slice";
import {
  NewProductNotification,
  Notification,
  NotificationType,
  OrderStatusNotification,
  PaymentStatusNotification,
  ShipmentStatusNotification,
  StockAlertNotification,
} from "../types";

interface UseNotificationsOptions {
  maxNotifications?: number;
  autoMarkAsRead?: boolean;
  persistNotifications?: boolean;
  onNotificationReceived?: (notification: Notification) => void;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { maxNotifications = 50, onNotificationReceived } = options;

  // Redux state management
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);

  // SignalR Connection Management
  const accessToken = useAppSelector(selectAccessToken);
  const [notificationHub, setNotificationHub] =
    useState<NotificationHubClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(
    accessToken ? null : "Not authenticated"
  );
  const notificationHubRef = useRef<NotificationHubClient | null>(null);
  const isConnectingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Initialize SignalR Connection
  useEffect(() => {
    isMountedRef.current = true;

    const cleanup = () => {
      isMountedRef.current = false;
      isConnectingRef.current = false;

      if (notificationHubRef.current) {
        logger.debug("Cleaning up SignalR connection");
        const hubToStop = notificationHubRef.current;
        notificationHubRef.current = null;

        setTimeout(() => {
          hubToStop.stop().catch((err) => {
            logger.debug("Error stopping connection during cleanup", {
              error: err?.message || "Unknown error",
            });
          });
        }, 50);
      }
    };

    if (!accessToken) {
      logger.debug("No access token available for notification connection");
      return cleanup;
    }

    if (isConnectingRef.current) {
      logger.debug("Connection attempt already in progress");
      return cleanup;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SIGNALR_URL || "http://localhost:5000";

    logger.debug("Initializing SignalR connection", {
      baseUrl,
      hasToken: !!accessToken,
    });

    const newNotificationHub = new NotificationHubClient(baseUrl, () => {
      const currentState = store.getState();
      const currentToken = selectAccessToken(currentState);

      if (!currentToken) {
        logger.warn("Access token not available in Redux store");
      }

      return currentToken || "";
    });
    notificationHubRef.current = newNotificationHub;
    isConnectingRef.current = true;

    newNotificationHub
      .start()
      .then(() => {
        if (!isMountedRef.current) {
          logger.debug("Component unmounted during connection, stopping");
          newNotificationHub.stop();
          return;
        }

        logger.logConnection("signalr", "NotificationHub Connected");
        setIsConnected(true);
        setNotificationHub(newNotificationHub);
        setConnectionError(null);
        isConnectingRef.current = false;
      })
      .catch((error) => {
        if (!isMountedRef.current) {
          return;
        }

        const errorMessage = error?.message || "Unknown error";

        // Log backend unavailable only as debug, not error
        if (
          errorMessage.includes("connection was stopped during negotiation") ||
          errorMessage.includes("Failed to start the connection")
        ) {
          logger.debug("SignalR backend unavailable", { error: errorMessage });
        } else {
          logger.warn("SignalR connection failed", { error: errorMessage });
        }

        setConnectionError("Backend not available");
        setIsConnected(false);
        setNotificationHub(null);
        isConnectingRef.current = false;
      });

    return cleanup;
  }, [accessToken]);

  // Clear notifications when user logs out
  useEffect(() => {
    if (!accessToken) {
      dispatch(notificationActions.clearAllNotifications());
      logger.debug("Notifications cleared due to logout");
    }
  }, [accessToken, dispatch]);

  // Add notification helper
  const addNotification = useCallback(
    (notification: Notification) => {
      dispatch(notificationActions.addNotification(notification));
      dispatch(notificationActions.trimNotifications(maxNotifications));
      onNotificationReceived?.(notification);
    },
    [dispatch, maxNotifications, onNotificationReceived]
  );

  // Handle shipment status updates
  useEffect(() => {
    if (!notificationHub || !isConnected) return;

    const handleShipmentUpdate = (notification: ShipmentStatusNotification) => {
      logger.debug("Shipment status update received", {
        shipmentId: notification.shipmentId,
        status: notification.status,
      });
      addNotification({
        id: `shipment-${notification.shipmentId}-${Date.now()}`,
        title: "Shipment Update",
        message: notification.message,
        type: NotificationType.Shipment,
        timestamp: notification.updatedAt,
        read: false,
        data: notification,
      });
    };

    notificationHub.onShipmentStatusUpdate(handleShipmentUpdate);

    return () => {
      notificationHub.offShipmentStatusUpdate();
    };
  }, [notificationHub, isConnected, addNotification]);

  // Handle order status updates
  useEffect(() => {
    if (!notificationHub || !isConnected) return;

    const handleOrderUpdate = (notification: OrderStatusNotification) => {
      logger.debug("Order status update received", {
        orderId: notification.orderId,
        status: notification.status,
      });
      addNotification({
        id: `order-${notification.orderId}-${Date.now()}`,
        title: "Order Update",
        message: notification.message,
        type: NotificationType.Order,
        timestamp: notification.updatedAt,
        read: false,
        data: notification,
      });
    };

    notificationHub.onOrderStatusUpdate(handleOrderUpdate);

    return () => {
      notificationHub.offOrderStatusUpdate();
    };
  }, [notificationHub, isConnected, addNotification]);

  // Handle stock alerts
  useEffect(() => {
    if (!notificationHub || !isConnected) return;

    const handleStockAlert = (notification: StockAlertNotification) => {
      logger.debug("Stock alert received in hook", {
        notification,
        hasProductId: !!notification?.productId,
      });

      if (!notification) {
        logger.warn("Received empty stock notification");
        return;
      }

      addNotification({
        id: `stock-${notification.productId || "unknown"}-${Date.now()}`,
        title: "Stock Alert",
        message: (notification.message || "Product is back in stock!").replace(
          /^\?\?\s*/,
          ""
        ),
        type: NotificationType.Alert,
        timestamp: new Date(),
        read: false,
        data: notification,
      });
    };

    notificationHub.onStockAlert(handleStockAlert);

    return () => {
      // notificationHub.offStockAlert();
    };
  }, [notificationHub, isConnected, addNotification]);

  // Handle payment updates
  useEffect(() => {
    if (!notificationHub || !isConnected) return;

    const handlePaymentUpdate = (notification: PaymentStatusNotification) => {
      logger.debug("Payment update received", {
        paymentId: notification.paymentId,
        status: notification.status,
      });
      addNotification({
        id: `payment-${notification.paymentId}-${Date.now()}`,
        title: "Payment Update",
        message: notification.message,
        type: NotificationType.Payment,
        timestamp: notification.updatedAt,
        read: false,
        data: notification,
      });
    };

    notificationHub.onPaymentUpdate(handlePaymentUpdate);

    return () => {
      notificationHub.offPaymentUpdate();
    };
  }, [notificationHub, isConnected, addNotification]);

  // Handle generic notifications
  useEffect(() => {
    if (!notificationHub || !isConnected) return;

    const handleGenericNotification = (
      title: string,
      message: string,
      type: string
    ) => {
      logger.debug("Generic notification received", { title, message, type });
      addNotification({
        id: `notification-${Date.now()}`,
        title,
        message,
        type: (type as NotificationType) || NotificationType.Info,
        timestamp: new Date(),
        read: false,
      });
    };

    notificationHub.onNotification(handleGenericNotification);

    return () => {
      notificationHub.offNotification();
    };
  }, [notificationHub, isConnected, addNotification]);

  // Handle new product arrival notifications
  useEffect(() => {
    if (!notificationHub || !isConnected) return;

    const handleNewProductNotification = (
      notification: NewProductNotification
    ) => {
      logger.debug("New product notification received", {
        productId: notification.productId,
        slug: notification.slug,
      });
      addNotification({
        id: `new-product-${notification.productId}-${Date.now()}`,
        title: "🎉 New Arrival!",
        message: notification.message || `Check out ${notification.name}`,
        type: NotificationType.NewProduct,
        timestamp: new Date(),
        read: false,
        data: notification,
      });
    };

    notificationHub.onNewProductNotification(handleNewProductNotification);

    return () => {
      notificationHub.offNewProductNotification();
    };
  }, [notificationHub, isConnected, addNotification]);

  // Mark notification as read
  const markAsRead = useCallback(
    (notificationId: string) => {
      dispatch(notificationActions.markAsRead(notificationId));
    },
    [dispatch]
  );

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    dispatch(notificationActions.markAllAsRead());
  }, [dispatch]);

  // Clear notification
  const clearNotification = useCallback(
    (notificationId: string) => {
      dispatch(notificationActions.clearNotification(notificationId));
    },
    [dispatch]
  );

  // Clear all notifications
  const clearAll = useCallback(() => {
    dispatch(notificationActions.clearAllNotifications());
  }, [dispatch]);

  // Subscribe to order updates
  const subscribeToOrder = useCallback(
    async (orderId: string) => {
      if (!notificationHub || !isConnected) return;

      const { error } = await TryAsync(() =>
        notificationHub.subscribeToOrder(orderId)
      );

      if (error) {
        logger.error("Failed to subscribe to order", new Error(error.detail), {
          orderId,
          errors: error.errors,
        });
        return;
      }

      logger.debug("Subscribed to order updates", { orderId });
    },
    [notificationHub, isConnected]
  );

  // Unsubscribe from order updates
  const unsubscribeFromOrder = useCallback(
    async (orderId: string) => {
      if (!notificationHub || !isConnected) return;

      const { error } = await TryAsync(() =>
        notificationHub.unsubscribeFromOrder(orderId)
      );

      if (error) {
        logger.error(
          "Failed to unsubscribe from order",
          new Error(error.detail),
          {
            orderId,
            errors: error.errors,
          }
        );
        return;
      }

      logger.debug("Unsubscribed from order updates", { orderId });
    },
    [notificationHub, isConnected]
  );

  // Subscribe to shipment updates
  const subscribeToShipment = useCallback(
    async (shipmentId: string) => {
      if (!notificationHub || !isConnected) return;

      const { error } = await TryAsync(() =>
        notificationHub.subscribeToShipment(shipmentId)
      );

      if (error) {
        logger.error(
          "Failed to subscribe to shipment",
          new Error(error.detail),
          {
            shipmentId,
            errors: error.errors,
          }
        );
        return;
      }

      logger.debug("Subscribed to shipment updates", { shipmentId });
    },
    [notificationHub, isConnected]
  );

  // Unsubscribe from shipment updates
  const unsubscribeFromShipment = useCallback(
    async (shipmentId: string) => {
      if (!notificationHub || !isConnected) return;

      const { error } = await TryAsync(() =>
        notificationHub.unsubscribeFromShipment(shipmentId)
      );

      if (error) {
        logger.error(
          "Failed to unsubscribe from shipment",
          new Error(error.detail),
          {
            shipmentId,
            errors: error.errors,
          }
        );
        return;
      }

      logger.debug("Unsubscribed from shipment updates", { shipmentId });
    },
    [notificationHub, isConnected]
  );

  const subscribeToProduct = useCallback(
    async (productId: string, colorCode: string, sizeCode: string) => {
      const hookStartTime = Date.now();
      logger.info("🔌 [useNotifications] subscribeToProduct called", {
        isConnected,
        hasHub: !!notificationHub,
        productId,
        colorCode,
        sizeCode,
      });

      if (!notificationHub) {
        logger.error(
          "Failed to subscribe to product",
          new Error("Notification hub not initialized"),
          {
            productId,
            colorCode,
            sizeCode,
          }
        );
        return;
      }
      if (!isConnected) {
        logger.error(
          "Failed to subscribe to product",
          new Error("Not connected to notification service"),
          {
            productId,
            colorCode,
            sizeCode,
          }
        );
        return;
      }

      const beforeHubCall = Date.now();
      logger.info(
        "🔌 Calling notificationHub.subscribeToProduct - elapsed: " +
          (beforeHubCall - hookStartTime) +
          "ms"
      );

      const { error } = await TryAsync(() =>
        notificationHub.subscribeToProduct(productId, colorCode, sizeCode)
      );

      const afterHubCall = Date.now();

      if (error) {
        logger.error(
          "Failed to subscribe to product",
          new Error(error.detail),
          {
            productId,
            colorCode,
            sizeCode,
            errors: error.errors,
            duration: afterHubCall - beforeHubCall,
          }
        );
        return;
      }

      logger.info(
        "🔌 Hub call completed - duration: " +
          (afterHubCall - beforeHubCall) +
          "ms, total: " +
          (afterHubCall - hookStartTime) +
          "ms"
      );
    },
    [notificationHub, isConnected]
  );

  // Unsubscribe from product stock alerts
  const unsubscribeFromProduct = useCallback(
    async (productId: string, colorCode: string, sizeCode: string) => {
      const hookStartTime = Date.now();
      logger.info("🔌 [useNotifications] unsubscribeFromProduct called", {
        isConnected,
        hasHub: !!notificationHub,
        productId,
        colorCode,
        sizeCode,
      });

      if (!notificationHub) {
        logger.error(
          "Failed to unsubscribe from product",
          new Error("Notification hub not initialized"),
          {
            productId,
            colorCode,
            sizeCode,
          }
        );
        return;
      }
      if (!isConnected) {
        logger.error(
          "Failed to unsubscribe from product",
          new Error("Not connected to notification service"),
          {
            productId,
            colorCode,
            sizeCode,
          }
        );
        return;
      }

      const beforeHubCall = Date.now();
      logger.info(
        "🔌 Calling notificationHub.unsubscribeFromProduct - elapsed: " +
          (beforeHubCall - hookStartTime) +
          "ms"
      );

      const { error } = await TryAsync(() =>
        notificationHub.unsubscribeFromProduct(productId, colorCode, sizeCode)
      );

      const afterHubCall = Date.now();

      if (error) {
        logger.error(
          "Failed to unsubscribe from product",
          new Error(error.detail),
          {
            productId,
            colorCode,
            sizeCode,
            errors: error.errors,
            duration: afterHubCall - beforeHubCall,
          }
        );
        return;
      }

      logger.info(
        "🔌 Hub unsubscribe completed - duration: " +
          (afterHubCall - beforeHubCall) +
          "ms, total: " +
          (afterHubCall - hookStartTime) +
          "ms"
      );
    },
    [notificationHub, isConnected]
  );

  return {
    // Connection state
    notificationHub,
    isConnected,
    connectionError,

    // Notifications
    notifications,
    unreadCount,

    // Actions
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,

    // Subscriptions
    subscribeToOrder,
    unsubscribeFromOrder,
    subscribeToShipment,
    unsubscribeFromShipment,
    subscribeToProduct,
    unsubscribeFromProduct,
  };
};
