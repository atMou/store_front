"use client";
import TextInput from "@/components/atoms/TextInput";
import { ApiErrorDisplay } from "@/components/feedback";
import { PriceDisplay } from "@/components/molecules";
import {
  Cart,
  useAddCouponToCartMutation,
  useCheckoutCartMutation,
  useGetCouponsByUserIdQuery,
  useRemoveCouponFromCartMutation,
} from "@/features";
import { useAuth } from "@/hooks/state/useAuth";
import useToast from "@/hooks/ui/useToast";
import { logger, TryAsync } from "@/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ChevronDown, Gift, Tag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CartSummaryProps {
  subtotal: number;
  shippingRate?: number;
  currency?: string;
  totalItems: number;
  cartId: string;
  cart: Cart | null;
}
const couponSchema = z
  .object({
    couponCode: z.string().min(1, "Coupon code is required"),
  })
  .refine(
    (data) => {
      const parts = data.couponCode.split("-");
      return parts.length === 5 && parts.every((part) => part.length === 5);
    },
    {
      message: "Coupon code must be in format: XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
      path: ["couponCode"],
    }
  );

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  currency = "€",
  totalItems,
  cartId,
  cart,
}) => {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [showVouchers, setShowVouchers] = useState(false);
  const [addCouponError, setAddCouponError] = useState<unknown | null>(null);
  const [checkoutCart] = useCheckoutCartMutation();
  const { data: pagiatedResults, isLoading: couponsLoading } =
    useGetCouponsByUserIdQuery(
      {
        userId: user?.id ?? "",
        pageNumber: 1,
        pageSize: 10,
        status: ["AssignedToUser", "Unknown"],
      },
      { skip: !isAuthenticated }
    );
  const [addCouponToCart] = useAddCouponToCartMutation();
  const [removeCouponFromCart] = useRemoveCouponFromCartMutation();

  const { control, handleSubmit } = useForm<z.infer<typeof couponSchema>>({
    defaultValues: { couponCode: "" },
    resolver: zodResolver(couponSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const FREE_SHIPPING_THRESHOLD = 29.9;

  const shippingFee =
    cart?.shipmentCost ?? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.9);

  const total = cart?.total ?? subtotal + shippingFee;

  const handleAddCouponToCart = async (couponCode: string) => {
    setAddCouponError(null); // Clear previous errors
    const { error } = await TryAsync(async () => {
      await addCouponToCart({ cartId, couponCode }).unwrap();
      showToast({
        message: `Coupon ${couponCode} applied successfully!`,
        type: "success",
      });
    });
    if (error) {
      logger.error("Add coupon error structure:", error);
      logger.error("Add coupon error JSON:", JSON.stringify(error, null, 2));
      setAddCouponError(error);
    }
  };

  const handleRemoveCoupon = async (couponId: string) => {
    const { error } = await TryAsync(async () => {
      await removeCouponFromCart({ cartId, couponId }).unwrap();
      showToast({
        message: "Coupon removed successfully!",
        type: "success",
      });
    });
    if (error) {
      console.error("Remove coupon error:", error);
      showToast({
        message: "Failed to remove coupon",
        type: "error",
      });
    }
  };

  const handleCheckout = async () => {
    if (!cartId) {
      showToast({ message: "Cart not found", type: "error" });
      return;
    }

    if (totalItems === 0) {
      showToast({ message: "Your cart is empty", type: "error" });
      return;
    }
    const { error } = await TryAsync(async () => {
      return await checkoutCart({ cartId }).unwrap();
    });

    if (error) {
      showToast({
        message:
          "An error occurred while proceeding to checkout. Please try again.",
        type: "error",
      });
      console.error("Checkout error:", error);
      return;
    }

    router.push("/order-review?cartId=" + cartId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      className="  p-6 border border-gray-200 sticky top-6"
    >
      {/* Vouchers and Gift Cards */}
      <button
        onClick={() => {
          setShowVouchers(!showVouchers);
          if (!showVouchers) {
            setAddCouponError(null); // Clear errors when opening vouchers
          }
        }}
        className="w-full flex items-center justify-between py-3   mb-4"
      >
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-gray-700" />
          <span className="text-sm font-medium text-gray-900">
            Vouchers and gift cards
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform ${showVouchers ? "rotate-180" : ""}`}
        />
      </button>

      {showVouchers && (
        <div className="mb-4 pb-4 border-b border-gray-300">
          <form
            onSubmit={handleSubmit((data) => {
              void handleAddCouponToCart(data.couponCode);
            })}
          >
            <div className="flex items-start gap-2">
              <TextInput
                Icon={Gift}
                control={control}
                placeholder="Enter code"
                name="couponCode"
                label=""
              />
              <button
                type="submit"
                className="h-9 px-4 bg-black text-white  font-medium text-sm hover:bg-gray-800 transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}

      {addCouponError !== null && (
        <div className="mb-4 pb-4 border-b border-gray-300">
          <ApiErrorDisplay error={addCouponError} variant="compact" />
        </div>
      )}

      {/* Available Coupons */}
      {isAuthenticated &&
        pagiatedResults &&
        pagiatedResults.items.length > 0 && (
          <div className="mb-4 pb-4 border-b border-gray-300">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Available Coupons
            </h3>
            <div className="space-y-2">
              {pagiatedResults.items.map((coupon) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-white border border-gray-200 rounded"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {coupon.code}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {coupon.description}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>
                          {coupon.discountType === "Percentage"
                            ? `${coupon.discountValue}%`
                            : `${coupon.discountValue} ${currency}`}{" "}
                          off
                        </span>
                        {coupon.minimumPurchaseAmount > 0 && (
                          <span>
                            Min: {coupon.minimumPurchaseAmount} {currency}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(coupon.code);
                        showToast({
                          message: "Coupon code copied!",
                          type: "success",
                        });
                      }}
                      className="text-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
            {pagiatedResults.totalPages && pagiatedResults.totalPages > 1 && (
              <div className="mt-3 text-sm text-center text-gray-500">
                Page {pagiatedResults.pageNumber} of{" "}
                {pagiatedResults.totalPages}
              </div>
            )}
          </div>
        )}

      {isAuthenticated && couponsLoading && (
        <div className="mb-4 pb-4 border-b border-gray-300">
          <div className="animate-pulse space-y-2">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      )}

      {/* Applied Coupons */}
      {cart?.coupons && cart.coupons.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-300">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Tag size={16} />
            Applied Coupons
          </h3>
          <div className="space-y-2">
            {cart.coupons.map((coupon) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-50 border border-green-200 rounded"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {coupon.code}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      {coupon.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-green-700 font-semibold">
                        {coupon.discountType === "Percentage"
                          ? `${coupon.discountValue}% off`
                          : `${coupon.discountValue.toFixed(2)} ${currency} off`}
                      </span>
                      {coupon.minimumPurchaseAmount > 0 && (
                        <span className="text-gray-500">
                          Min: {coupon.minimumPurchaseAmount.toFixed(2)}{" "}
                          {currency}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    // onClick={() => handleRemoveCoupon(coupon.id)}
                    className="text-red-600 hover:text-red-800 transition-colors shrink-0"
                    title="Remove coupon"
                  >
                    <X
                      size={16}
                      onClick={() => handleRemoveCoupon(coupon.id)}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Expires: {new Date(coupon.expiryDate).toLocaleDateString()} •
                  Status: {coupon.status}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="space-y-1 mb-4">
        <PriceDisplay
          label="Subtotal"
          amount={cart?.totalSub ?? subtotal}
          currency={currency}
          variant="small"
        />
        {cart?.discount && cart.discount > 0 ? (
          <PriceDisplay
            label="Discount"
            amount={-cart.discount}
            currency={currency}
            variant="small"
            labelClassName="text-green-700"
            amountClassName="text-green-700"
          />
        ): null}
        <PriceDisplay
          label="Tax"
          amount={cart?.tax ?? 0}
          currency={currency}
          variant="small"
        />
        <div className="flex justify-between items-baseline py-2">
          <span className="text-sm font-medium text-gray-600">Delivery</span>
          <span className="text-sm font-semibold text-gray-900">
            {shippingFee === 0
              ? "FREE"
              : `${shippingFee.toFixed(2)} ${currency}`}
          </span>
        </div>
        {cart?.totalDiscounted && cart.totalDiscounted !== cart.totalSub && (
          <PriceDisplay
            label="Subtotal after discount"
            amount={cart.totalDiscounted}
            currency={currency}
            variant="small"
            showBorder
            labelClassName="font-semibold"
            amountClassName="font-semibold"
          />
        )}
      </div>

      {/* Total */}
      <PriceDisplay
        label="Total"
        amount={total}
        currency={currency}
        note="VAT included"
        variant="summary"
        showBorder
      />

      {/* Points Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded">
          <span className="text-xs font-medium">P</span>
          <span className="text-xs">Points</span>
        </div>
      </div>

      {/* Checkout Button */}
      {isAuthenticated ? (
        <button
          disabled={totalItems === 0}
          onClick={handleCheckout}
          className="w-full bg-black text-white py-3  font-medium text-sm hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-6  cursor-pointer"
        >
          Checkout
        </button>
      ) : (
        <Link
          href="/login"
          className="block w-full bg-black text-white py-3 rounded font-medium text-sm text-center hover:bg-gray-800 transition-colors mb-6"
        >
          Log in to checkout
        </Link>
      )}

      {/* Payment Methods */}
      <div>
        <p className="text-xs text-gray-600 mb-3">We accept</p>
        <div className="flex items-center gap-3">
          <Image
            src="/assets/icons/Visa.svg"
            alt="Visa"
            width={50}
            height={20}
            className="object-contain"
          />

          <Image
            src="/assets/icons/Mastercard.svg"
            alt="Mastercard"
            width={50}
            height={20}
            className="object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CartSummary;
