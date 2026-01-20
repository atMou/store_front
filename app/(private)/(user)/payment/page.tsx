"use client";

import { withAuth } from "@/components/HOC";
import { LandingPageLayout } from "@/components/layouts";
import { CheckoutForm, StripeProvider } from "@/features/payment";
import { motion } from "framer-motion";
import { AlertCircle, CreditCard, ShoppingCart } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

/**
 * Payment Page Component
 *
 * This page handles the actual payment process after order review.
 * It receives payment intent data from the order-review page.
 */
const PaymentPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clientSecret = searchParams.get("clientSecret");
  const paymentId = searchParams.get("paymentId");
  const paymentIntentId = searchParams.get("paymentIntentId");
  const amountParam = searchParams.get("amount");

  useEffect(() => {
    // If no payment intent data, redirect back to order review
    if (!clientSecret || !paymentIntentId || !amountParam) {
      router.push("/order-review");
    }
  }, [clientSecret, paymentIntentId, amountParam, router]);

  const amount = amountParam ? parseFloat(amountParam) : 0;

  if (!clientSecret || !paymentIntentId) {
    return (
      <LandingPageLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Initializing Payment
            </h2>
            <p className="text-gray-500 mb-6">
              Please wait while we prepare your secure payment...
            </p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          </motion.div>
        </div>
      </LandingPageLayout>
    );
  }

  return (
    <LandingPageLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full mb-4">
              <CreditCard size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Payment
            </h1>
            <p className="text-gray-600">
              Enter your payment details to complete your order
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">
                Amount to pay:{" "}
                <span className="text-xl font-bold text-blue-600">
                  `Pay $
                  {amount < 1000
                    ? amount.toFixed(2)
                    : (amount / 100).toFixed(2)}
                  `
                </span>
              </span>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-6"
          >
            <StripeProvider clientSecret={clientSecret}>
              <CheckoutForm
                paymentId={paymentId!}
                paymentIntentId={paymentIntentId}
                amount={amount}
              />
            </StripeProvider>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-gray-400 mt-0.5 shrink-0"
              />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Secure Payment
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Your payment is secured with 256-bit SSL encryption</li>
                  <li>• We never store your credit card information</li>
                  <li>• All transactions are processed securely via Stripe</li>
                  <li>
                    • Your personal data is protected according to GDPR
                    standards
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              ← Back to Order Review
            </button>
          </div>
        </div>
      </div>
    </LandingPageLayout>
  );
};

const PaymentPage = () => {
  return (
    <Suspense
      fallback={
        <LandingPageLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        </LandingPageLayout>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
};

export default withAuth(PaymentPage);
