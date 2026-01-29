import { Address } from "@/types";

export type { Address };

export interface OrderItem {
  productId: string;
  colorVariantId: string;
  slug: string;
  sku: string;
  size: string;
  color: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  orderId: string;
  userId: string;
  email: string;
  phone?: string | null;
  shipmentId?: string | null;
  paymentId?: string | null;
  subtotal: number;
  tax: number;
  total: number;
  discount: number;
  trackingCode: string;
  orderStatus: string;
  couponIds: string[];
  shippingAddress: Address;
  notes: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface GetOrderByIdRequest {
  orderId: string;
}

export interface GetOrderByCartIdRequest {
  cartId: string;
}

export interface GetAllOrdersRequest {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface PaginatedOrders {
  items: Order[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded";

export type PaymentStatus =
  | "Pending"
  | "Processing"
  | "Succeeded"
  | "Failed"
  | "Cancelled";

export interface PaymentStatusUpdateEvent {
  orderId: string;
  paymentStatus: string;
  orderStatus: string;
}

export interface OrderStatusUpdateEvent {
  orderId: string;
  status: string;
}
