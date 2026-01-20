"use client";

import { withAuth } from "@/components/HOC/WithAuth";
import Header from "@/components/layouts/header/Header";
import { OrdersList } from "@/features/order/components";

const OrdersPage = () => {
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">View and track all your orders</p>
        </div>

        <OrdersList />
      </div>
    </>
  );
};

export default withAuth(OrdersPage);
