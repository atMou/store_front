"use client";

import CustomLoader from "@/components/feedback/CustomLoader";
import { withAuth } from "@/components/HOC";
import { LandingLayout } from "@/components/layouts";
import { useNotificationContext } from "@/features/notifications";
import { useGetOrderByIdQuery } from "@/features/order";
import { OrderTrackingDetails } from "@/features/order/components";
import { Bell, BellOff } from "lucide-react";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const OrderTrackingContent = () => {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { data: order, isLoading, error } = useGetOrderByIdQuery({ orderId });
  const { subscribeToOrder, unsubscribeFromOrder, isConnected } =
    useNotificationContext();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (order && isConnected) {
      const shouldAutoSubscribe = ![
        "DELIVERED",
        "CANCELED",
        "REFUNDED",
      ].includes(order.orderStatus.toUpperCase());

      if (shouldAutoSubscribe && !isSubscribed) {
        subscribeToOrder(orderId)
          .then(() => {
            setIsSubscribed(true);
          })
          .catch((error) => {
            console.error("Failed to subscribe to order notifications:", error);
          });
      }
    }

    return () => {
      if (isSubscribed) {
        unsubscribeFromOrder(orderId);
      }
    };
  }, [
    order,
    orderId,
    isConnected,
    subscribeToOrder,
    unsubscribeFromOrder,
    isSubscribed,
  ]);

  const handleToggleNotifications = async () => {
    try {
      if (isSubscribed) {
        await unsubscribeFromOrder(orderId);
        setIsSubscribed(false);
      } else {
        await subscribeToOrder(orderId);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error("Failed to toggle notifications:", error);
    }
  };

  if (isLoading) {
    return <CustomLoader />;
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Error loading order or order not found.</p>
      </div>
    );
  }

  const canSubscribe = !["DELIVERED", "CANCELED", "REFUNDED"].includes(
    order.orderStatus.toUpperCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {}
      {canSubscribe && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleToggleNotifications}
            disabled={!isConnected}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSubscribed
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubscribed ? (
              <>
                <Bell size={16} />
                Notifications On
              </>
            ) : (
              <>
                <BellOff size={16} />
                Enable Notifications
              </>
            )}
          </button>
        </div>
      )}

      <OrderTrackingDetails order={order} />
    </div>
  );
};

const OrderTrackingPage = () => {
  return (
    <LandingLayout>
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-8">
            <CustomLoader />
          </div>
        }
      >
        <OrderTrackingContent />
      </Suspense>
    </LandingLayout>
  );
};

export default withAuth(OrderTrackingPage);
