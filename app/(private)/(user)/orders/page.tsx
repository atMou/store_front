"use client";

import { withAuth } from "@/components/HOC/WithAuth";
import OrderCardSkeleton from "@/components/feedback/OrderCardSkeleton";
import Header from "@/components/layouts/header/Header";
import { OrdersList } from "@/features/order/components";
import { Suspense } from "react";

/**
 * User Orders Page
 *
 * Displays all orders for the authenticated user using the OrdersList component from order feature.
 * Route: /orders
 */
const UserOrdersPage = () => {
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
              </div>
              {[1, 2, 3].map((i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <OrdersList />
        </Suspense>
      </div>
    </>
  );
};

export default withAuth(UserOrdersPage);
