"use client";

import { Order } from "@/features/order/types";
import { motion } from "framer-motion";
import { Building, Mail, Map, MapPin } from "lucide-react";

export default function ShippingAddressCard({ order }: { order: Order }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="col-span-1 bg-white rounded-xl h-fit shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-center space-x-2 mb-4">
        <MapPin size={18} />
        <h2 className="font-semibold text-gray-800">Shipping Address</h2>
      </div>

      <div className="ml-6 pl-4 border-l-2 border-indigo-100 space-y-3 text-gray-700">
        {/* Street */}
        <div className="flex items-center space-x-2">
          <Map size={16} />
          <p className="text-gray-600">
            {order.shippingAddress?.street || "Not provided"}
          </p>
        </div>

        {/* City */}
        <div className="flex items-center space-x-2">
          <Building size={16} />
          <p className="text-gray-600">
            {order.shippingAddress?.city || "Not provided"}
          </p>
        </div>

        {/* ZIP/Postal Code */}
        <div className="flex items-center space-x-2">
          <Mail size={16} />
          <p className="text-gray-600">
            {order.shippingAddress?.postalCode || "Not provided"}
          </p>
        </div>

        {/* Street */}
        <div className="flex items-center space-x-2">
          <MapPin size={28} />
          <p className="text-gray-600">
            {order.shippingAddress?.street || "Not provided"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
