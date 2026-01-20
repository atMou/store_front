"use client";

import { motion } from "framer-motion";
import { CheckCircle, Headphones, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PaymentSucceeded = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-green-50 to-emerald-100 p-4"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-green-600 mb-6"
      >
        <CheckCircle size={100} />
      </motion.div>

      {/* Success Message */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-4xl font-bold text-green-700 mb-4"
      >
        Payment Successful!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-lg text-gray-700 mb-2 max-w-md"
      >
        Thank you for your purchase. Your order has been confirmed and is being
        processed.
      </motion.p>

      {orderId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white px-6 py-3 rounded-lg shadow-md mb-8"
        >
          <p className="text-sm text-gray-600">
            Order ID:{" "}
            <span className="font-mono font-semibold text-gray-900">
              {orderId}
            </span>
          </p>
        </motion.div>
      )}

      {/* Helpful Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 mt-6"
      >
        <Link
          href={"/orders"}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg 
                   hover:bg-slate-800 transition-colors font-medium shadow-lg"
        >
          <Package size={20} />
          <span>View Orders</span>
        </Link>
        <Link
          href={"/"}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg 
                   hover:bg-gray-50 transition-colors font-medium shadow-lg border border-gray-200"
        >
          <ShoppingCart size={20} />
          <span>Continue Shopping</span>
        </Link>
        <Link
          href={"/support"}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg 
                   hover:bg-gray-50 transition-colors font-medium shadow-lg border border-gray-200"
        >
          <Headphones size={20} />
          <span>Contact Support</span>
        </Link>
      </motion.div>

      {/* Email Confirmation Notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-sm text-gray-600 mt-8 text-center max-w-md"
      >
        A confirmation email with your order details has been sent to your
        registered email address.
      </motion.p>
    </motion.div>
  );
};

export default PaymentSucceeded;
