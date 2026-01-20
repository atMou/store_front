"use client";

import NumberInput from "@/components/atoms/NumberInput";
import TextAreaInput from "@/components/atoms/TextAreaInput";
import TextInput from "@/components/atoms/TextInput";
import { EmptyState } from "@/components/feedback";
import { PriceDisplay, SectionHeader } from "@/components/molecules";
import { useAddAddressMutation, useDeleteAddressMutation } from "@/features";
import { useChangeDeliveryAddressMutation } from "@/features/cart";
import { useOrderByCartId } from "@/features/order/hooks";
import { useCreatePaymentIntentMutation } from "@/features/payment";
import { useAuth } from "@/hooks/state/useAuth";
import useToast from "@/hooks/ui/useToast";
import { TryAsync } from "@/shared";
import { logger } from "@/shared/lib/logger";
import { generateProductPlaceholder } from "@/shared/lib/placeholderImage";
import { Address } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CreditCard,
  MapPin,
  Package,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface OrderReviewProps {
  cartId: string | null;
}

const addressSchema = z.object({
  receiverName: z.string().trim().min(2, "Receiver name is required"),
  street: z.string().trim().min(2, "Street is required"),
  houseNumber: z
    .number()
    .int("House number must be a whole number")
    .positive("House number must be positive"),
  city: z.string().trim().min(2, "City is required"),
  postalCode: z
    .number()
    .int("Postal code must be a whole number")
    .positive("Postal code must be positive"),
  extraDetails: z.string().trim().optional(),
});

type NewAddressFormValues = z.infer<typeof addressSchema>;

const OrderReview = ({ cartId }: OrderReviewProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();

  const { order, refetch } = useOrderByCartId(cartId);

  const [createPaymentIntent, { isLoading: isCreatingIntent }] =
    useCreatePaymentIntentMutation();

  const [changeDeliveryAddress] = useChangeDeliveryAddressMutation();

  const [addAddress] = useAddAddressMutation();

  const [deleteAddress] = useDeleteAddressMutation();

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewAddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      receiverName: "",
      street: "",
      houseNumber: undefined,
      city: "",
      postalCode: undefined,
      extraDetails: "",
    } satisfies Partial<NewAddressFormValues>,
  });

  useEffect(() => {
    if (order?.shippingAddress) {
      setSelectedAddress(order.shippingAddress);
    }
  }, [order?.shippingAddress]);

  const onSubmit = async (values: NewAddressFormValues) => {
    console.log("Submitting new address:", values);
    const { error } = await TryAsync(async () => {
      await addAddress({
        fullname: values.receiverName,
        street: values.street,
        city: values.city,
        postalCode: values.postalCode,
        houseNumber: values.houseNumber,
        extraDetails: values.extraDetails,
      }).unwrap();
    });

    if (error) {
      logger.error("Failed to add delivery address", error);
      showToast({
        message:
          error.detail || "Failed to add delivery address. Please try again.",
        type: "error",
      });
      return;
    }

    showToast({
      message: "Delivery address added successfully",
      type: "success",
    });

    reset();
    setShowNewAddressForm(false);
  };

  const changeDeliveryAddressHandler = async (addressId: string) => {
    if (!user) {
      showToast({
        message: "Please log in to change delivery address",
        type: "error",
      });
      return;
    }
    const { error } = await TryAsync(async () => {
      await changeDeliveryAddress({
        cartId: cartId!,
        addressId,
        userId: user.id,
      }).unwrap();
    });

    if (error) {
      logger.error("Failed to change delivery address", error);
      showToast({
        message:
          error.detail ||
          "Failed to change delivery address. Please try again.",
        type: "error",
      });
      return;
    }

    showToast({
      message: "Delivery address updated successfully",
      type: "success",
    });

    await refetch();
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) {
      showToast({
        message: "Please log in to delete address",
        type: "error",
      });
      return;
    }

    const { error } = await TryAsync(async () => {
      await deleteAddress({ userId: user.id, addressId }).unwrap();
    });

    if (error) {
      logger.error("Failed to delete address", error);
      showToast({
        message: error.detail || "Failed to delete address. Please try again.",
        type: "error",
      });
      return;
    }

    showToast({
      message: "Address deleted successfully",
      type: "success",
    });

    // Reset selected address if it was the deleted one
    if (selectedAddress?.id === addressId) {
      setSelectedAddress(null);
    }

    await refetch();
  };

  const handleProceedToPayment = async () => {
    if (!cartId || !order) {
      showToast({
        message: "Order not found",
        type: "error",
      });
      return;
    }
    if (!selectedAddress) {
      showToast({
        message: "Please select a delivery address",
        type: "error",
      });
      return;
    }

    if (!order.orderItems || order.orderItems.length === 0) {
      showToast({
        message: "Your order is empty",
        type: "error",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await createPaymentIntent({
        cartId: cartId,
      }).unwrap();
      logger.info("Payment intent created", {
        paymentIntentId: response.paymentIntentId,
        cartId,
      });

      router.push(
        `/payment?clientSecret=${response.clientSecret}&paymentIntentId=${response.paymentIntentId}&amount=${response.amount}&cartId=${cartId}&paymentId=${response.paymentId}`
      );
    } catch (err) {
      const errorMessage =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to initialize payment. Please try again.";
      logger.error("Create Payment Intent Error", err);
      showToast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle error/empty state
  if (!order || !order.orderItems || order.orderItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Order not found"
        message="Unable to load your order details. Please try again."
        actionLabel="Back to Cart"
        onAction={() => router.push("/cart")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Review Your Order
          </h1>
          <p className="text-gray-600">
            Please review your order details before proceeding to payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white  shadow-sm border border-gray-100 overflow-hidden">
              <SectionHeader
                icon={<ShoppingCart size={20} className="text-gray-600" />}
                title="Order Items"
                badge={{
                  text: `${order?.orderItems?.length || 0} ${order?.orderItems?.length === 1 ? "item" : "items"}`,
                  variant: "blue",
                }}
                action={
                  <button
                    onClick={() => router.push("/cart")}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Package size={16} />
                    <span className="text-sm font-medium">Edit Cart</span>
                  </button>
                }
              />

              <div className="divide-y divide-gray-100">
                {order?.orderItems?.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.colorVariantId}-${index}`}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-5">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 shrink-0 bg-gray-100  overflow-hidden border border-gray-200">
                        <Image
                          src={
                            item.imageUrl ||
                            generateProductPlaceholder(item.slug)
                          }
                          alt={item.slug}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-base mb-2">
                              {item.slug}
                            </h3>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">
                                  SKU:
                                </span>
                                <span className="text-sm text-gray-900">
                                  {item.sku}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">
                                  Color:
                                </span>
                                <span className="text-sm text-gray-900 capitalize">
                                  {item.color}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">
                                  Size:
                                </span>
                                <span className="text-sm text-gray-900">
                                  {item.size}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">
                                  Quantity:
                                </span>
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-900  text-sm font-semibold">
                                  {item.quantity}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">
                                  Unit Price:
                                </span>
                                <span className="text-sm text-gray-900 font-semibold">
                                  ${item.unitPrice.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Item Total
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address Management */}
            <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
              <SectionHeader
                icon={<MapPin size={20} className="text-gray-600" />}
                title="Delivery Address"
                containerClassName="bg-white border-b border-gray-100"
              />
              <div className="p-6 space-y-6">
                {/* Current Address Selection */}

                {user &&
                  user.addresses &&
                  user.addresses.length > 0 &&
                  user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowNewAddressForm(false);
                        changeDeliveryAddressHandler(addr.id);
                      }}
                    >
                      <div
                        className={`border p-4 cursor-pointer transition-colors ${
                          selectedAddress?.id === addr.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            checked={
                              order.shippingAddress.receiverName ===
                                addr.receiverName &&
                              order.shippingAddress.postalCode ===
                                addr.postalCode &&
                              order.shippingAddress.street === addr.street &&
                              order.shippingAddress.houseNumber ===
                                addr.houseNumber
                            }
                            onChange={() => {
                              setSelectedAddress(addr);
                              setShowNewAddressForm(false);
                            }}
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-gray-900 text-sm">
                                Deliver to this address
                              </p>
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm font-medium"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAddress(addr.id);
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                              {addr.receiverName}
                            </p>
                            <p className="text-sm text-gray-700">
                              {addr.street} {addr.houseNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              {addr.city}, {addr.postalCode}
                            </p>
                            {addr.extraDetails && (
                              <p className="text-sm text-gray-500">
                                {addr.extraDetails}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {!selectedAddress && !showNewAddressForm && (
                  <div className="bg-gray-50 border border-gray-100  p-4">
                    <p className="text-sm text-gray-600">
                      No delivery address selected. Please add a delivery
                      address below.
                    </p>
                  </div>
                )}

                {/* New Address Form */}
                <div className="space-y-4">
                  <div
                    onClick={() => setShowNewAddressForm((prev) => !prev)}
                    className={`border  p-4 cursor-pointer transition-colors ${
                      // showNewAddressForm
                      //   ? "border-blue-500 bg-blue-50"
                      "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Plus size={18} className="text-gray-600" />
                        <p className="text-sm font-semibold text-gray-900">
                          Deliver to another address
                        </p>
                      </div>
                    </div>
                  </div>

                  {showNewAddressForm && (
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4 bg-gray-50 border border-gray-100 p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                          control={control}
                          name="receiverName"
                          label="Receiver name"
                          placeholder="Who will receive this order"
                          Icon={User}
                        />

                        <TextInput
                          control={control}
                          name="street"
                          label="Street"
                          placeholder="123 Main St"
                          Icon={MapPin}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NumberInput
                          control={control}
                          name="houseNumber"
                          label="House number"
                          placeholder="42"
                          isInteger
                          min={1}
                        />

                        <TextInput
                          control={control}
                          name="city"
                          label="City"
                          placeholder="City"
                          Icon={MapPin}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NumberInput
                          control={control}
                          name="postalCode"
                          label="Postal code"
                          placeholder="12345"
                          isInteger
                          min={1}
                        />

                        <TextAreaInput
                          control={control}
                          name="extraDetails"
                          label="Extra details (optional)"
                          placeholder="Apartment, floor, gate code"
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            reset();
                            setShowNewAddressForm(false);
                          }}
                          className="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-slate-900 text-white px-4 py-2  font-medium hover:bg-slate-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                        >
                          {isSubmitting ? (
                            <span>Saving...</span>
                          ) : (
                            <>
                              <Plus size={16} />
                              <span>Save address</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Applied Coupons */}
            {order?.couponIds && order.couponIds.length > 0 && (
              <div className="bg-white  shadow-sm border border-gray-100 overflow-hidden">
                <SectionHeader
                  icon={<Tag size={20} className="text-gray-600" />}
                  title="Applied Coupons"
                  badge={{
                    text: `${order.couponIds.length} active`,
                    variant: "green",
                  }}
                  containerClassName="bg-white border-b border-gray-100"
                />
                <div className="p-6">
                  <div className="space-y-2">
                    {order.couponIds.map((couponId, idx) => (
                      <div
                        key={couponId}
                        className="bg-green-50 border border-green-200 p-3 flex items-center gap-2"
                      >
                        <Tag size={16} className="text-green-600" />
                        <p className="text-sm font-medium text-green-700">
                          Coupon {idx + 1} applied
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-white  shadow-sm border border-gray-100 overflow-hidden sticky top-6">
              <SectionHeader
                icon={<Package size={20} className="text-gray-600" />}
                title="Order Summary"
                containerClassName="bg-white border-b border-gray-100"
              />
              <div className="p-6">
                <div className="space-y-1 mb-6">
                  <PriceDisplay
                    label="Subtotal"
                    amount={order?.subtotal ?? 0}
                    currency="€"
                    variant="small"
                  />

                  {order && order.discount > 0 && (
                    <PriceDisplay
                      label="Discount"
                      amount={-order.discount}
                      currency="€"
                      variant="small"
                      labelClassName="text-green-600"
                      amountClassName="text-green-600"
                    />
                  )}

                  <PriceDisplay
                    label="Tax"
                    amount={order?.tax ?? 0}
                    currency="€"
                    variant="small"
                  />

                  <PriceDisplay
                    label="Total"
                    amount={order?.total ?? 0}
                    currency="€"
                    variant="medium"
                    showBorder
                    className="pt-3"
                  />
                </div>

                {/* Proceed to Payment Button */}
                <button
                  onClick={handleProceedToPayment}
                  disabled={isProcessing || isCreatingIntent}
                  className="w-full bg-slate-900 text-white cursor-pointer py-3 font-medium hover:bg-slate-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing || isCreatingIntent ? (
                    <>
                      <div className="animate-spin  h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center mt-4">
                  By proceeding, you agree to our terms and conditions
                </p>

                {/* Security Info */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={16}
                      className="text-gray-400 mt-0.5 shrink-0"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Secure Payment</p>
                      <p>
                        Your payment information is encrypted and secure. We use
                        industry-standard security measures to protect your
                        data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
