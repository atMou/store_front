"use client";

import { ErrorDisplay } from "@/components/feedback";
import { useOrderById } from "@/features/order/hooks";
import { motion } from "framer-motion";
import { CreditCard, MapPin, Package, Tag } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

const OrderDetailPage = () => {
  const params = useParams();
  const orderId = params?.orderId as string;

  const { order, isLoading, error, refetch } = useOrderById(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ErrorDisplay
            error={{
              detail: "Failed to load order details",
              errors: ["Unable to fetch order information. Please try again."],
            }}
          />
          <button
            onClick={() => refetch()}
            className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Retry
          </button>
        </div>
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.trackingCode}
              </h1>
              <p className="text-gray-600 mt-1">Order ID: {order.orderId}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}
            >
              {order.orderStatus}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Package size={20} className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Items ({order.orderItems.length})
                </h2>
              </div>

              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.colorVariantId}`}
                    className="flex gap-4 pb-4 border-b last:border-b-0"
                  >
                    <div className="relative w-20 h-20 shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.slug}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.slug}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        SKU: {item.sku}
                      </p>
                      <p className="text-xs text-gray-500">
                        Color: {item.colorVariantId} • Size: {item.size}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ${item.unitPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Notes
                </h2>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
          </motion.div>

          {/* Order Summary & Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${order.tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  {order.shippingAddress.street}{" "}
                  {order.shippingAddress.houseNumber}
                </p>
                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>
                {order.shippingAddress.extraDetails && (
                  <p className="text-xs text-gray-500">
                    {order.shippingAddress.extraDetails}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <span className="font-medium">Email:</span> {order.email}
                </p>
                {order.phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {order.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Applied Coupons */}
            {order.couponIds && order.couponIds.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={20} className="text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Applied Coupons
                  </h2>
                </div>
                <div className="space-y-2">
                  {order.couponIds.map((couponId) => (
                    <div
                      key={couponId}
                      className="bg-green-50 border border-green-200 rounded-lg p-3"
                    >
                      <p className="text-xs text-green-600">
                        Coupon ID: {couponId}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IDs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h2>
              <div className="text-xs text-gray-600 space-y-2">
                {order.shipmentId && (
                  <p>
                    <span className="font-medium">Shipment ID:</span>{" "}
                    {order.shipmentId}
                  </p>
                )}
                {order.paymentId && (
                  <p>
                    <span className="font-medium">Payment ID:</span>{" "}
                    {order.paymentId}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
