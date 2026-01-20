"use client";

import { useNotificationContext } from "@/features/notifications";
import { useEffect } from "react";

export default function OrderTrackingExample({ orderId }: { orderId: string }) {
  const { subscribeToOrder, unsubscribeFromOrder, isConnected } =
    useNotificationContext();

  // Subscribe to order updates when component mounts
  useEffect(() => {
    if (isConnected) {
      console.log("Subscribing to order updates:", orderId);
      subscribeToOrder(orderId);
    }

    // Cleanup: unsubscribe when component unmounts
    return () => {
      if (isConnected) {
        console.log("Unsubscribing from order updates:", orderId);
        unsubscribeFromOrder(orderId);
      }
    };
  }, [orderId, isConnected, subscribeToOrder, unsubscribeFromOrder]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border border-black p-6">
        <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
        <p className="text-gray-600 mb-2">Order ID: {orderId}</p>
        <p className="text-sm text-gray-500">
          {isConnected ? (
            <span className="text-green-600">
              ✓ Connected - You&apos;ll receive real-time updates
            </span>
          ) : (
            <span className="text-yellow-600">
              ⚠ Connecting to notification service...
            </span>
          )}
        </p>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> You&apos;ll receive notifications when your
            order status changes. Check the bell icon in the header!
          </p>
        </div>

        {/* Order details would go here */}
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Order Status</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Order Placed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full" />
              <span>Shipped</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full" />
              <span>Delivered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
