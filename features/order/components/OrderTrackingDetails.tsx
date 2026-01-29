"use client";

import ToggleableText from "@/components/atoms/ToggleableText";
import { Order } from "@/features/order/types";
import useFormatPrice from "@/hooks/ui/useFormatPrice";
import { motion } from "framer-motion";
import {
  Building,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Mail,
  Map,
  MapPin,
  Package,
  RotateCcw,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";
import Image from "next/image";

interface OrderTrackingDetailsProps {
  order: Order;
}

const PROGRESS_STEPS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

const normalizeStatus = (status: string) => status?.toUpperCase() || "PENDING";

const getStepIndex = (status: string) => {
  const s = normalizeStatus(status);

  if (s === "IN_TRANSIT") return 2;
  if (s === "PLACED") return 0;

  const index = PROGRESS_STEPS.indexOf(s);
  return index === -1 ? 0 : index;
};

const OrderTrackingDetails = ({ order }: OrderTrackingDetailsProps) => {
  const formatPrice = useFormatPrice();

  const currentStatus = normalizeStatus(order.orderStatus);

  const getStatusColor = (status: string) => {
    switch (normalizeStatus(status)) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "SHIPPED":
      case "IN_TRANSIT":
        return "bg-indigo-100 text-indigo-700 border border-indigo-200";
      case "DELIVERED":
        return "bg-green-100 text-green-700 border border-green-200";
      case "CANCELED":
      case "CANCELLED":
        return "bg-red-100 text-red-700 border border-red-200";
      case "RETURNED":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      case "REFUNDED":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status: string, size: number = 20) => {
    switch (normalizeStatus(status)) {
      case "PENDING":
        return <Clock size={size} />;
      case "PROCESSING":
        return <Package size={size} />;
      case "SHIPPED":
      case "IN_TRANSIT":
        return <Truck size={size} />;
      case "DELIVERED":
        return <CheckCircle size={size} />;
      case "CANCELED":
      case "CANCELLED":
        return <XCircle size={size} />;
      case "RETURNED":
        return <RotateCcw size={size} />;
      case "REFUNDED":
        return <DollarSign size={size} />;
      default:
        return <Clock size={size} />;
    }
  };

  const getStatusText = (status: string) => {
    const s = normalizeStatus(status);
    if (s === "IN_TRANSIT") return "In Transit";
    if (s === "CANCELLED") return "Canceled";

    return s.charAt(0) + s.slice(1).toLowerCase();
  };

  const currentStepIndex = getStepIndex(currentStatus);
  const isTerminalFailure = [
    "CANCELED",
    "CANCELLED",
    "RETURNED",
    "REFUNDED",
  ].includes(currentStatus);

  const displaySteps = isTerminalFailure
    ? ["PENDING", currentStatus]
    : PROGRESS_STEPS;

  const progressWidth = isTerminalFailure
    ? 100
    : (currentStepIndex / (PROGRESS_STEPS.length - 1)) * 100;

  const activeStepLimit = isTerminalFailure ? 1 : currentStepIndex;

  const subtotal = order.subtotal;
  const discount = order.discount;
  const tax = order.tax;
  const total = order.total;
  const calculatedShipping = total - (subtotal - discount + tax);
  const shippingCost = calculatedShipping > 0.01 ? calculatedShipping : 0;

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <div className="border-b border-gray-100 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(
                currentStatus
              )}`}
            >
              {getStatusIcon(currentStatus, 16)}
              {getStatusText(currentStatus)}
            </span>
            <span className="text-sm text-gray-500">
              Order updated:{" "}
              {order.updatedAt
                ? new Date(order.updatedAt).toLocaleDateString()
                : new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {}
        <div className="relative px-4">
          <div className="absolute top-5 left-4 right-4 h-1 bg-gray-100 rounded-full overflow-hidden z-0">
            <motion.div
              className={`h-full transition-all duration-1000 ease-out ${
                isTerminalFailure ? "bg-red-500" : "bg-blue-600"
              }`}
              initial={{ width: "0%" }}
              animate={{ width: `${progressWidth}%` }}
            />
          </div>

          <div className="relative z-10 flex justify-between w-full">
            {displaySteps.map((step, index) => {
              const isActive = index <= activeStepLimit;
              let iconBg = "bg-white border-2 border-gray-200 text-gray-400";
              if (isActive) {
                if (isTerminalFailure && index === 1) {
                  iconBg = "bg-red-500 border-red-500 text-white";
                } else {
                  iconBg = "bg-blue-600 border-blue-600 text-white";
                }
              }

              return (
                <motion.div
                  key={step}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${iconBg}`}
                  >
                    {getStatusIcon(step, 18)}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium uppercase tracking-wide ${
                      isActive ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step === "IN_TRANSIT" ? "In Transit" : getStatusText(step)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2 space-y-6">
          {}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
              <ShoppingCart size={18} className="text-gray-600" />
              <h2 className="font-semibold text-gray-800">
                Order Items ({order.orderItems.length})
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {order.orderItems.map((item) => (
                <div
                  key={`${item.productId}-${item.colorVariantId}-${item.size}`}
                  className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                >
                  <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-md border border-gray-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.slug}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 text-base">
                        {item.slug}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        SKU: {item.sku}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 text-xs font-medium text-gray-700 border border-gray-200">
                          Color: {item.color}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 text-xs font-medium text-gray-700 border border-gray-200">
                          Size: {item.size}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-gray-900">
                          {item.quantity}
                        </span>{" "}
                        x {formatPrice(item.unitPrice)}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {order.notes && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Package size={16} />
                    Order Notes
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 italic">
                    &ldquo;{order.notes}&rdquo;
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center space-x-2 mb-4">
              <MapPin size={18} />
              <h2 className="font-semibold text-gray-800">Shipping Address</h2>
            </div>

            <div className="ml-6 pl-4 border-l-2 border-indigo-100 space-y-3 text-gray-700">
              <div className="flex items-center space-x-2">
                <Map size={16} />
                <p className="text-gray-600">
                  {order.shippingAddress?.street || "Not provided"}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Building size={16} />
                <p className="text-gray-600">
                  {order.shippingAddress?.city || "Not provided"}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <p className="text-gray-600">
                  {order.shippingAddress?.postalCode || "Not provided"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-4"
          >
            <div className="flex items-center gap-2 mb-6">
              <CreditCard size={20} className="text-gray-600" />
              <h2 className="font-bold text-gray-800">Order Summary</h2>
            </div>

            <div className="border-b border-gray-100 pb-4 mb-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Package size={16} />
                    <span className="font-medium">Tracking:</span>
                  </div>
                  <div className="text-gray-900 font-medium">
                    <ToggleableText
                      content={order?.trackingCode || "Not available"}
                      truncateLength={12}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="font-medium">Placed on:</span>
                  </div>
                  <span className="text-gray-900 font-medium">{orderDate}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal ({order.orderItems.length} items)
                </span>
                <span className="font-medium text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(tax)}
                </span>
              </div>

              {shippingCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping Estimate</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(shippingCost)}
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-100 mt-4">
                <span className="font-bold text-lg text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingDetails;
