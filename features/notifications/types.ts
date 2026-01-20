export interface ShipmentStatusNotification {
  shipmentId: string;
  orderId: string;
  status: string;
  trackingCode: string;
  message: string;
  updatedAt: Date;
}

export interface OrderStatusNotification {
  orderId: string;
  status: string;
  message: string;
  updatedAt: Date;
}

export interface StockAlertNotification {
  productId: string;
  variantId: string;
  productName: string;
  message: string;
  isAvailable: boolean;
}

export interface PaymentStatusNotification {
  orderId: string;
  paymentId: string;
  status: string;
  message: string;
  updatedAt: Date;
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
  timestamp: Date;
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
