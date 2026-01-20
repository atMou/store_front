"use client";

import { Order } from "@/features/order/types";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  RotateCcw,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

const getStatusStep = (status: string) => {
  const steps = ["PENDING", "PROCESSING", "SHIPPED", "IN_TRANSIT", "DELIVERED"];
  return steps.indexOf(status);
};

const OrderStatus = ({ order }: { order: Order }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "IN_TRANSIT":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELED":
        return "bg-red-100 text-red-800";
      case "RETURNED":
        return "bg-orange-100 text-orange-800";
      case "REFUNDED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock size={24} />;
      case "PROCESSING":
        return <Package size={24} />;
      case "SHIPPED":
      case "IN_TRANSIT":
        return <Truck size={24} />;
      case "DELIVERED":
        return <CheckCircle size={24} />;
      case "CANCELED":
        return <XCircle size={24} />;
      case "RETURNED":
        return <RotateCcw size={24} />;
      case "REFUNDED":
        return <DollarSign size={24} />;
      default:
        return <ShoppingBag size={24} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "PROCESSING":
        return "Processing";
      case "SHIPPED":
        return "Shipped";
      case "IN_TRANSIT":
        return "In Transit";
      case "DELIVERED":
        return "Delivered";
      case "CANCELED":
        return "Canceled";
      case "RETURNED":
        return "Returned";
      case "REFUNDED":
        return "Refunded";
      default:
        return "Unknown";
    }
  };

 

  const currentStep = getStatusStep(order.orderStatus);
  console.log("currentStep ->", currentStep);
  const isTerminalStatus = ["CANCELED", "RETURNED", "REFUNDED"].includes(
    order.orderStatus
  );
  const statusSteps = isTerminalStatus
    ? ["PENDING", order.orderStatus]
    : ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"]; // 4 steps

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
    >
      <div className="border-b border-gray-100 pb-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <p
            className={`font-medium px-3 py-1 rounded-full flex items-center ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {getStatusIcon(order.orderStatus)}
            <span className="ml-2">{getStatusText(order.orderStatus)}</span>
          </p>
        </div>
      </div>

      {/* Status Steps */}
      <div className="flex flex-wrap justify-between relative mt-6">
        {/* Progress line */}
        <div
          className="absolute top-5 left-0 h-1 bg-gray-200 w-full"
          style={{ zIndex: 1 }}
        ></div>
        <div
          className="absolute top-5 left-0 h-1 bg-blue-500 transition-all duration-500"
          style={{
            zIndex: 2,
            width: `${
              ((currentStep - 1) / Math.max(statusSteps.length - 1, 1)) * 100
            }%`,
          }}
        ></div>
        {statusSteps.map((status, index) => (
          <motion.div
            key={status}
            className={`flex flex-col items-center z-10 w-${
              statusSteps.length === 2 ? "1/2" : `1/${statusSteps.length}`
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div
              className={`w-12 h-12 rounded-md flex items-center justify-center mb-2 ${
                currentStep >= index + 1
                  ? "bg-blue-100 text-blue-500"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {getStatusIcon(status)}
            </div>
            <span className="text-sm font-medium">{getStatusText(status)}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OrderStatus;
