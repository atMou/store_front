"use client";

import Table, { Column } from "@/components/molecules/Table";
import { useNotifications } from "@/features/notifications";
import {
  OrderStatusNotification,
  PaymentStatusNotification,
} from "@/features/notifications/types";
import { OrdersTableFilters } from "@/features/order/components";
import { useOrders } from "@/features/order/hooks";
import { Order } from "@/features/order/types";
import { formatShippingDate } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const OrdersPage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    status: "",
    minPrice: "",
    maxPrice: "",
    startDate: "",
    endDate: "",
    searchTerm: "",
  });

  const {
    orders,
    pagination,
    isLoading,
    refetch: refetchOrders,
  } = useOrders({
    ...filters,
    pageNumber: 1,
    pageSize: 10,
  });

  // Connect to SignalR for real-time order updates
  const { notificationHub, isConnected } = useNotifications();

  useEffect(() => {
    if (!notificationHub || !isConnected) return;

    // Listen for payment status updates
    const handlePaymentStatusUpdate = (data: PaymentStatusNotification) => {
      console.log("[Orders] Payment status updated:", data);
      // Refetch orders when payment status changes
      refetchOrders();
    };

    // Listen for order status updates
    const handleOrderStatusUpdate = (data: OrderStatusNotification) => {
      console.log("[Orders] Order status updated:", data);
      refetchOrders();
    };

    notificationHub.onPaymentUpdate(handlePaymentStatusUpdate);
    notificationHub.onOrderStatusUpdate(handleOrderStatusUpdate);

    return () => {
      notificationHub.offPaymentUpdate();
      notificationHub.offOrderStatusUpdate();
    };
  }, [notificationHub, isConnected, refetchOrders]);

  const getStatusBadgeVariant = (
    status: string
  ): "default" | "destructive" | "secondary" => {
    const statusMap: Record<string, "default" | "destructive" | "secondary"> = {
      pending: "secondary",
      confirmed: "default",
      processing: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
      refunded: "secondary",
    };
    return statusMap[status.toLowerCase()] || "default";
  };

  const handleViewOrder = useCallback(
    (orderId: string) => {
      router.push(`/dashboard/orders/${orderId}`);
    },
    [router]
  );

  const columns: Column<Order>[] = [
    {
      key: "trackingCode",
      label: "Order #",
      sortable: true,
      width: "150px",
      render: (order) => (
        <span className="font-mono text-sm font-medium">
          {order.trackingCode || order.orderId.slice(0, 8)}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      width: "180px",
      render: (order) => (
        <span className="text-sm text-gray-600">
          {formatShippingDate(new Date(order.createdAt))}
        </span>
      ),
    },
    {
      key: "total",
      label: "Total",
      sortable: true,
      width: "120px",
      align: "right",
      render: (order) => (
        <span className="font-semibold text-gray-900">
          ${order.total.toFixed(2)}
        </span>
      ),
    },
    {
      key: "orderStatus",
      label: "Order Status",
      sortable: true,
      width: "140px",
      render: (order) => (
        <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
          {order.orderStatus}
        </Badge>
      ),
    },
    {
      key: "itemCount",
      label: "Items",
      width: "80px",
      align: "center",
      render: (order) => (
        <span className="text-sm text-gray-600">
          {order.orderItems?.length || 0}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "100px",
      align: "center",
      render: (order) => (
        <button
          onClick={() => handleViewOrder(order.orderId)}
          className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Eye size={16} />
          <span>View</span>
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-sm text-gray-600 mt-1">
          View and manage all orders
          {isConnected && (
            <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Live Updates
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <OrdersTableFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={() =>
          setFilters({
            status: "",
            minPrice: "",
            maxPrice: "",
            startDate: "",
            endDate: "",
            searchTerm: "",
          })
        }
      />

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          data={orders.map((order) => ({ ...order, id: order.orderId }))}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No orders found"
          showHeader={false}
          showSearchBar={false}
          showPaginationDetails={true}
          totalPages={pagination.totalPages}
          totalResults={pagination.totalCount}
          resultsPerPage={pagination.pageSize}
          currentPage={pagination.currentPage}
          onRefresh={refetchOrders}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
