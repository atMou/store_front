"use client";

import { QuantitySelector } from "@/components/molecules";
import { selectMainCategory, useToggleLikedProductMutation } from "@/features";
import { useCart } from "@/features/cart/hooks";
import { Cart } from "@/features/cart/types";
import { TryAsync } from "@/shared";
import { Button } from "@/shared/ui";
import { useAppSelector } from "@/store";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartDropdownProps {
  cart: Cart | null;
  isLoading: boolean;
}

function CartDropdown({ cart, isLoading }: CartDropdownProps) {
  const mainCategory = useAppSelector(selectMainCategory);
  const [toggleLikedProduct] = useToggleLikedProductMutation();
  const router = useRouter();

  const { removeItem } = useCart();
  const deliveryFee = 4.9;
  const freeShippingThreshold = 29.9;

  const handleRemoveItem = (colorVariantId: string, sizeVariantId: string) => {
    console.log("Removing from cart:", {
      colorVariantId,
      sizeVariantId,
    });
    removeItem(colorVariantId, sizeVariantId);
  };

  const handleMoveToWishlist = async (
    productId: string,
    colorVariantId: string,
    sizeVariantId: string
  ) => {
    console.log("Moving to wishlist:", {
      productId,
      colorVariantId,
      sizeVariantId,
    });
    await TryAsync(async () => {
      await toggleLikedProduct({ productIds: [productId] }).unwrap();
    });

    removeItem(colorVariantId, sizeVariantId);
  };

  if (isLoading) {
    return (
      <div className="absolute right-0 mt-0 w-[350px] bg-white border-2 border-black shadow-lg p-6 opacity-0 -translate-y-0.5 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-in-out z-50">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-20 h-24 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.lineItems.length === 0) {
    return (
      <div className="absolute right-0 -translate-y-0.5 w-[350px] bg-white border-2 border-black  p-6 opacity-0  pointer-events-none group-hover:opacity-100  group-hover:pointer-events-auto transition-all duration-100 ease-in-out z-10">
        <div className="flex flex-col items-center space-y-2 mb-4">
          <p className="text-sm font-bold">Your bag is empty</p>
          <p className="text-gray-600 text-center text-sm">
            Go fill it up with all your fashion hopes and dreams.
          </p>
          <p className="text-sm font-bold">Don&apos;t know where to start?</p>
        </div>
        <Button
          variant="plain"
          className="bg-neutral-900 rounded-none text-white w-full text-center"
          onClick={() => {
            router.push(mainCategory.toLocaleLowerCase() + "-trending");
          }}
        >
          See What&apos;s New
        </Button>
      </div>
    );
  }

  const needsMoreForFreeShipping = freeShippingThreshold - cart.totalSub;
  const qualifiesForFreeShipping = cart.totalSub >= freeShippingThreshold;

  return (
    <div className="absolute right-0 mt-0 w-[450px] opacity-0 bg-white border-2 border-gray-800 shadow-xl  -translate-y-0.5 pointer-events-none group-hover:opacity-100  group-hover:pointer-events-auto transition-all duration-200 ease-in-out z-50">
      {}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-center">Your bag</h2>
      </div>

      {}
      <div className="max-h-[400px] overflow-y-auto px-3 py-2">
        {cart.lineItems.map((item) => (
          <div
            key={item.productId}
            className="flex gap-2 mb-4 pb-4 border-b border-gray-100 last:border-b-0"
          >
            {}
            <div className="relative w-20 h-24 shrink-0 bg-gray-100">
              <Image
                src={item.imageUrl}
                alt={item.slug}
                fill
                sizes="80px"
                className="object-cover"
                loading="lazy"
              />
            </div>

            {}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-2">
                  <p className="text-sm font-normal line-clamp-2 mb-2 text-gray-900 ">
                    {item.slug}
                  </p>
                  <div className="flex gap-3 mb-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Color:</span> {item.color}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Size:</span> {item.size}
                    </p>
                  </div>
                  <p className="text-base font-bold text-red-600 mb-1">
                    {item.unitPrice.toFixed(2)} €
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    Total: {item.lineTotal.toFixed(2)} €
                  </p>
                </div>
                <button
                  className="text-gray-400 hover:text-black transition-colors p-1 -mt-1"
                  aria-label="Remove item"
                  onClick={() =>
                    handleRemoveItem(item.colorVariantId, item.sizeVariantId)
                  }
                >
                  <X size={24} strokeWidth={2} />
                </button>
              </div>

              <div className="mb-2">
                <QuantitySelector
                  value={item.quantity}
                  productId={item.productId}
                  colorVariantId={item.colorVariantId}
                  sizeVariantId={item.sizeVariantId}
                />
              </div>

              <button
                onClick={() =>
                  handleMoveToWishlist(
                    item.productId,
                    item.colorVariantId,
                    item.sizeVariantId
                  )
                }
                className="text-sm  cursor-pointer underline hover:no-underline text-gray-900 font-normal"
              >
                Move to wish list
              </button>
            </div>
          </div>
        ))}
      </div>

      {}
      <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
        {}
        {!qualifiesForFreeShipping && needsMoreForFreeShipping > 0 && (
          <div className="flex items-start gap-3 mb-5 p-3 bg-gray-100 rounded">
            <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-sm font-bold">i</span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              If your bag is over {freeShippingThreshold.toFixed(2)} € you will
              qualify for free shipping.
            </p>
          </div>
        )}

        {}
        <div className="space-y-3 mb-5">
          <div className="flex justify-between text-base">
            <span className="font-medium">Delivery</span>
            <span className="font-bold">
              {qualifiesForFreeShipping
                ? "FREE"
                : `${deliveryFee.toFixed(2)} €`}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>
              Total{" "}
              <span className="text-sm font-normal text-gray-600">
                VAT included
              </span>
            </span>
            <span>
              {(
                cart.totalSub + (qualifiesForFreeShipping ? 0 : deliveryFee)
              ).toFixed(2)}{" "}
              €
            </span>
          </div>
        </div>

        {}
        <Link href="/cart">
          <Button
            variant="plain"
            className="w-full bg-black text-white hover:bg-gray-900 transition-colors py-4 rounded-none font-bold text-base"
          >
            View
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default CartDropdown;
