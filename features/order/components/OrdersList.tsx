"use client";

import { useOrdersByUserId } from "@/features/order/hooks";
import { useAuth } from "@/hooks/state/useAuth";
import { motion } from "framer-motion";
import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";

/**
 * Orders List Component
 *
 * Usage example showing how to fetch all orders for a user
 */
const OrdersList = () => {
  const { user } = useAuth();
  const { orders, isLoading, error, refetch } = useOrdersByUserId(
    user?.id ?? null
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">Failed to load orders</p>
        <button
          onClick={() => refetch()}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No orders yet
        </h3>
        <p className="text-gray-600 mb-6">
          Start shopping to place your first order
        </p>
        <Link
          href="/"
          className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
      {orders.map((order, index) => (
        <motion.div
          key={order.orderId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            href={`/orders/${order.orderId}`}
            className="block bg-white rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-900">
                  Order #{order.trackingCode}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {order.orderItems.length} item
                  {order.orderItems.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}
                >
                  {order.orderStatus}
                </span>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>
              </div>
              <p className="font-bold text-gray-900">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default OrdersList;
