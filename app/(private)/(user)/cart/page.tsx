"use client";
import { Dropdown } from "@/components/atoms";
import { ApiErrorDisplay } from "@/components/feedback";
import BreadCrumb from "@/components/feedback/BreadCrumb";
import CartSkeletonLoader from "@/components/feedback/CartSkeletonLoader";
import { withAuth } from "@/components/HOC";
import { LandingLayout } from "@/components/layouts";
import { CartItem } from "@/features";
import CartSummary from "@/features/cart/components/CartSummary";
import { useCart } from "@/features/cart/hooks";
import {
  ProductsLikedCarousel,
  ProductsViewedCarousel,
} from "@/features/product";
import {
  selectUserLikedProductIds,
  useToggleLikedProductMutation,
} from "@/features/user";
import useToast from "@/hooks/ui/useToast";
import { Button, TryAsync } from "@/shared";
import { generateProductPlaceholder } from "@/shared/lib/placeholderImage";
import {
  formatShippingDate,
  getWorkingDaysFromToday,
} from "@/shared/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { Info, Package, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const formatVariantName = (item: CartItem) => {
  return item.slug || "Product";
};

const Cart = () => {
  const router = useRouter();
  const {
    cart,
    items: cartItems,
    isLoading,
    removeItem,
    updateItem,
    error,
  } = useCart();

  const likedProductIds = useAppSelector(selectUserLikedProductIds);
  const [toggleLikedProduct] = useToggleLikedProductMutation();
  const { showToast } = useToast();

  const showSkeleton = isLoading && cart === null;

  const FREE_SHIPPING_THRESHOLD = 29.9;

  const shippingStartDate = getWorkingDaysFromToday(2);
  const shippingEndDate = getWorkingDaysFromToday(3);
  const shippingDateRange = `${formatShippingDate(shippingStartDate)} - ${formatShippingDate(shippingEndDate)}`;

  const subtotal = useMemo(() => {
    if (!cartItems.length) return 0;
    return cartItems.reduce(
      (sum: number, item: { lineTotal: number }) => sum + item.lineTotal,
      0
    );
  }, [cartItems]);

  const routeToProduct = (productId: string) => {
    return router.push(`/product/${productId}`);
  };
  const handleRemoveFromCart = async (
    colorVariantId: string,
    sizeVariantId: string
  ) => {
    const { error } = await TryAsync(
      async () => await removeItem(colorVariantId, sizeVariantId)
    );

    if (error) {
      showToast({
        message: error.detail || "Failed to remove item",
        type: "error",
      });
      console.error("Error removing item:", error);
    }
  };

  const handleQuantityChange = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;

    const { error } = await TryAsync(
      async () =>
        await updateItem(
          item.productId,
          newQuantity,
          item.colorVariantId,
          item.sizeVariantId
        )
    );

    if (error) {
      showToast({
        message: error.detail || "Failed to update quantity",
        type: "error",
      });
      console.error("Error updating quantity:", error);
    }
  };

  const handleMoveToWishlist = async (item: CartItem) => {
    if (!likedProductIds.includes(item.productId)) {
      const { error: wishListError } = await TryAsync(
        async () =>
          await toggleLikedProduct({ productIds: [item.productId] }).unwrap()
      );

      if (wishListError) {
        showToast({
          message:
            wishListError.detail || "Failed to add to wishlist, try again.",
          type: "error",
        });
        return;
      }
    }
    const { error: removeError } = await TryAsync(
      async () => await removeItem(item.colorVariantId, item.sizeVariantId)
    );

    if (removeError) {
      showToast({
        message:
          removeError.detail ||
          "Added to wishlist but failed to remove from cart",
        type: "error",
      });
      return;
    }

    showToast({ message: "Moved to wish list", type: "success" });
  };

  return (
    <LandingLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <BreadCrumb />

        {error && (
          <div className="mb-6">
            <ApiErrorDisplay error={error} variant="default" />
          </div>
        )}

        {}
        <div className="mt-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Your bag ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            )
          </h1>
        </div>

        {}
        {showSkeleton ? (
          <CartSkeletonLoader />
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {}
            <div className="lg:col-span-2 space-y-4">
              {}
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="bg-orange-50 border border-orange-200  p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Almost there!</p>
                    <p className="text-sm text-gray-700">
                      If your bag is over {FREE_SHIPPING_THRESHOLD.toFixed(2)} €
                      you will qualify for free shipping.
                    </p>
                  </div>
                </div>
              )}

              {}
              <div className="bg-white border border-gray-200  p-4 flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-700 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">
                    Parcel shipped by FakeLando
                  </p>
                  <p className="text-sm text-gray-600">{shippingDateRange}</p>
                </div>
              </div>

              {}
              {cartItems.map((item: CartItem) => (
                <div
                  key={`${item.productId}-${item.colorVariantId}-${item.sizeVariantId}`}
                  className="bg-white border border-gray-200  p-4 flex gap-4 cursor-pointer"
                  onClick={() => routeToProduct(item.productId)}
                >
                  {}
                  <div className="w-24 h-32 sm:w-28 sm:h-36 bg-gray-100 rounded flex items-center justify-center overflow-hidden shrink-0">
                    <Image
                      src={
                        item?.imageUrl || generateProductPlaceholder(item.slug)
                      }
                      alt={formatVariantName(item)}
                      width={112}
                      height={144}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = generateProductPlaceholder(
                          item.slug
                        );
                      }}
                    />
                  </div>

                  {}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 mb-2">
                          {formatVariantName(item)}
                        </p>
                        <p className="text-sm font-bold text-red-600 mb-1">
                          {item.unitPrice.toFixed(2)} €
                        </p>
                        <div className="space-y-1 text-sm text-gray-700 mb-2">
                          <p>
                            <span className="text-gray-600">Colour:</span>{" "}
                            {item.color}
                          </p>
                          <p>
                            <span className="text-gray-600">Size:</span>{" "}
                            {item.size}
                          </p>
                          <p>
                            <span className="text-gray-600">Line Total:</span>{" "}
                            <span className="font-semibold">
                              {item.lineTotal.toFixed(2)} €
                            </span>
                          </p>
                        </div>
                      </div>

                      {}
                      <button
                        onClick={() =>
                          handleRemoveFromCart(
                            item.colorVariantId,
                            item.sizeVariantId
                          )
                        }
                        className="text-gray-400 hover:text-gray-600 transition-colors h-6"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {}
                    <div
                      className="mt-auto pt-3 flex items-center gap-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Dropdown
                        options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => ({
                          label: num.toString(),
                          value: num.toString(),
                        }))}
                        value={item.quantity.toString()}
                        onChange={(value) => {
                          handleQuantityChange(item, parseInt(value as string));
                        }}
                        placeholder="Qty"
                      />
                      <Button
                        variant={"plain"}
                        className="text-sm text-gray-700 underline hover:text-gray-900"
                        onClick={() => handleMoveToWishlist(item)}
                      >
                        Move to wish list
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {}
              <div className="flex items-start gap-2 text-sm text-gray-600 pt-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Items placed in this bag are not reserved.</p>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold">Pricing:</span> Originally
                  refers to the price the item was first listed at.
                </p>
              </div>
            </div>

            {}
            <div className="lg:col-span-1">
              <CartSummary
                subtotal={subtotal}
                totalItems={cartItems.length}
                cartId={cart?.cartId || ""}
                cart={cart}
              />
            </div>
          </div>
        )}
      </div>
      <ProductsLikedCarousel direction="ltr" itemSize="medium" />
      <ProductsViewedCarousel currentProductId="" itemSize="medium" />
    </LandingLayout>
  );
};

export default withAuth(Cart);
