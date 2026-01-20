"use client";

import { logger } from "@/shared/lib/logger";
import { useAppDispatch } from "@/store/hooks";
import { toastActions } from "@/store/slices/toastSlice";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useConfirmPaymentMutation } from "../api";

interface CheckoutFormProps {
  paymentId: string;
  paymentIntentId: string;
  amount: number;
}

const CheckoutForm = ({ paymentId, amount }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [confirmPayment] = useConfirmPaymentMutation();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      logger.info("Stripe payment confirmation attempted", {
        hasError: !!error,
        paymentIntentStatus: paymentIntent?.status,
        errorCode: error?.code,
      });

      if (error) {
        // Handle payment cancellation by user
        if (
          error.code === "payment_intent_authentication_failure" ||
          error.type === "validation_error" ||
          error.message?.toLowerCase().includes("cancel")
        ) {
          logger.info("Payment cancelled by user", {
            paymentId,
            errorCode: error.code,
          });
          dispatch(
            toastActions.addToast({
              type: "info",
              message: "Payment was cancelled",
            })
          );
          router.push("/cancel");
          return;
        }

        if (error.code === "payment_intent_unexpected_state") {
          logger.info("Payment already processed, confirming with backend", {
            paymentId,
          });
          // Payment already succeeded, proceed to backend confirmation
          try {
            const response = await confirmPayment({
              paymentId,
            }).unwrap();

            dispatch(
              toastActions.addToast({
                type: "success",
                message: "Payment successful!",
              })
            );
            router.push(`/success?orderId=${response.orderId}`);
            return;
          } catch (err) {
            // If backend also confirms it's already processed, redirect anyway
            logger.warn("Backend confirmation error for processed payment", {
              error: err,
            });
            setErrorMessage("Payment was already processed. Redirecting...");
            setTimeout(() => router.push("/success"), 2000);
            return;
          }
        }

        logger.error(
          "Stripe payment error",
          new Error(error.message || "Unknown error"),
          {
            errorCode: error.code,
            errorType: error.type,
          }
        );
        setErrorMessage(error.message || "An error occurred during payment");
        setIsProcessing(false);
        return;
      }

      // Handle successful payment
      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Confirm payment with backend
        logger.info("Payment succeeded, confirming with backend", {
          paymentId,
          paymentIntentId: paymentIntent.id,
        });

        const response = await confirmPayment({
          paymentId,
        }).unwrap();

        logger.info("Payment confirmed successfully", {
          orderId: response.orderId,
        });

        dispatch(
          toastActions.addToast({
            type: "success",
            message: "Payment successful!",
          })
        );
        router.push(`/success?orderId=${response.orderId}`);
        return;
      }

      // Handle other payment statuses
      if (paymentIntent) {
        if (paymentIntent.status === "canceled") {
          logger.info("Payment was canceled", {
            paymentIntentId: paymentIntent.id,
          });
          dispatch(
            toastActions.addToast({
              type: "info",
              message: "Payment was cancelled",
            })
          );
          router.push("/cancel");
          return;
        }

        if (paymentIntent.status === "requires_action") {
          logger.info("Payment requires additional action", {
            paymentIntentId: paymentIntent.id,
          });
          setErrorMessage(
            "Additional authentication required. Please complete the verification."
          );
          setIsProcessing(false);
          return;
        }

        // Log unexpected status
        logger.warn("Unexpected payment intent status", {
          status: paymentIntent.status,
          paymentIntentId: paymentIntent.id,
        });
        setErrorMessage(`Unexpected payment status: ${paymentIntent.status}`);
        setIsProcessing(false);
      }
    } catch (error) {
      logger.error("Payment confirmation error", error as Error, {
        paymentId,
      });
      const message =
        error instanceof Error ? error.message : "Payment confirmation failed";
      setErrorMessage(message);
      dispatch(
        toastActions.addToast({
          type: "error",
          message,
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <PaymentElement
          options={{
            layout: {
              type: "tabs",
              defaultCollapsed: false,
            },
          }}
        />
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          {errorMessage}
        </motion.div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            logger.info("User cancelled payment from form", { paymentId });
            dispatch(
              toastActions.addToast({
                type: "info",
                message: "Payment cancelled",
              })
            );
            router.push("/cancel");
          }}
          disabled={isProcessing}
          className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-lg font-semibold 
                   hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-colors duration-200"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-slate-900 text-white py-4 px-6 rounded-lg font-semibold 
                   hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            `Pay €${amount.toFixed(2)}`
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. We do not store your card details.
      </p>
    </form>
  );
};

export default CheckoutForm;
