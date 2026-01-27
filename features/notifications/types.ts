export interface ShipmentStatusNotification {
  shipmentId: string;
  orderId: string;
  status: string;
  trackingCode: string;
  message: string;
  updatedAt: string;
}

export interface OrderStatusNotification {
  orderId: string;
  status: string;
  message: string;
  updatedAt: string;
}

export interface StockAlertNotification {
  productId: string;
  color: string;
  size: string;
  slug: string;
  brand: string;
  message: string;
  stock: number;
  isAvailable: boolean;
  imageUrl?: string;
}

export interface PaymentStatusNotification {
  orderId: string;
  paymentId: string;
  status: string;
  message: string;
  updatedAt: string;
}

export interface NewProductNotification {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  message: string;
}

export enum NotificationType {
  Info = "info",
  Alert = "alert",
  Success = "success",
  Warning = "warning",
  Error = "error",
  Shipment = "shipment",
  Order = "order",
  Stock = "stock",
  Payment = "payment",
  NewProduct = "newProduct",
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  data?: unknown;
}

export interface NotificationPreferences {
  orderUpdates: boolean;
  shipmentUpdates: boolean;
  stockAlerts: boolean;
  paymentUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}
