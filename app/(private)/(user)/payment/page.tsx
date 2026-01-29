"use client";

import { withAuth } from "@/components/HOC";
import { LandingLayout } from "@/components/layouts";
import { CheckoutForm, StripeProvider } from "@/features/payment";
import { useAppSelector } from "@/store/hooks";
import { motion } from "framer-motion";
import { Apple, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const PaymentPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cart = useAppSelector((state) => state.cart.cart);

  const clientSecret = searchParams.get("clientSecret");
  const paymentId = searchParams.get("paymentId");
  const paymentIntentId = searchParams.get("paymentIntentId");
  const amountParam = searchParams.get("amount");

  useEffect(() => {
    if (!clientSecret || !paymentIntentId || !amountParam) {
      router.push("/order-review");
    }
  }, [clientSecret, paymentIntentId, amountParam, router]);

  const amount = amountParam ? parseFloat(amountParam) : 0;

  const formattedTotal = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(val);

  if (!clientSecret || !paymentIntentId) {
    return (
      <LandingLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white p-12 rounded-2xl shadow-xl w-full max-w-md mx-4"
          >
            <ShoppingCart size={48} className="mx-auto text-slate-900 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Initializing Payment
            </h2>
            <p className="text-gray-500 mb-8">
              Please wait while we prepare your secure payment environment...
            </p>
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </motion.div>
        </div>
      </LandingLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {}
      <div className="w-full lg:w-1/2 bg-gray-50 p-6 lg:p-16 border-r border-gray-200 order-2 lg:order-1">
        <div className="max-w-lg mx-auto lg:ml-auto lg:mr-0">
          {}
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-gray-600 transition-colors mb-8 text-sm font-medium"
          >
            <span className="mr-2">←</span>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                P
              </span>
              <span className="text-gray-900 font-semibold">Stripe</span>
            </div>
            <span className="ml-3 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              TEST MODE
            </span>
          </button>

          <div className="mb-8">
            <p className="text-gray-500 text-sm mb-2">Pay </p>
            <h1 className="text-4xl font-bold text-gray-900">
              {formattedTotal}
            </h1>
          </div>

          {}
          <div className="space-y-6 mb-8">
            {cart?.lineItems.map((item) => (
              <div
                key={`${item.productId}-${item.colorVariantId}-${item.sizeVariantId}`}
                className="flex items-start justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-white rounded border border-gray-200 overflow-hidden shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.slug}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.slug}</h3>
                    <p className="text-sm text-gray-500">
                      Qty {item.quantity}
                      <span className="mx-2">•</span>
                      {item.size} / {item.color}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">
                  {formatPrice(item.lineTotal)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                {cart ? formatPrice(cart.totalSub) : formatPrice(amount)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-gray-900">
                {cart ? formatPrice(cart.shipmentCost) : "Calculated"}
              </span>
            </div>
            {cart && cart.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span className="font-medium">
                  -{formatPrice(cart.discount)}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total due</span>
            <span className="text-xl font-bold text-gray-900">
              {formattedTotal}
            </span>
          </div>

          <div className="mt-auto pt-12 flex items-center gap-4 text-xs text-gray-400">
            <span>Powered by stripe</span>
            <span className="border-l border-gray-300 h-3"></span>
            <a href="#" className="hover:text-gray-600">
              Terms
            </a>
            <a href="#" className="hover:text-gray-600">
              Privacy
            </a>
          </div>
        </div>
      </div>

      {}
      <div className="w-full lg:w-1/2 p-6 lg:p-16 order-1 lg:order-2 flex flex-col">
        <div className="max-w-md mx-auto w-full lg:mr-auto lg:ml-0">
          {}
          <div className="mb-8">
            <button className="w-full bg-black text-white h-12 rounded flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors font-medium">
              <Apple size={20} className="mb-0.5" />
              Pay
            </button>
            <div className="relative mt-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative bg-white px-4 text-sm text-gray-400">
                Or pay with card
              </span>
            </div>
          </div>

          {}
          <StripeProvider clientSecret={clientSecret}>
            <CheckoutForm
              paymentId={paymentId!}
              paymentIntentId={paymentIntentId}
              amount={amount}
            />
          </StripeProvider>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  return (
    <Suspense
      fallback={
        <LandingLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        </LandingLayout>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
};

export default withAuth(PaymentPage);
