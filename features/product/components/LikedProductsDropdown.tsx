"use client";

import { Product } from "@/features/product/types";
import { Button } from "@/shared/ui";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LikedProductsDropdownProps {
  likedProducts: Product[];
  isLoading: boolean;
  onRemove?: (productId: string) => void;
  onMoveToCart?: (productId: string) => void;
}

function LikedProductsDropdown({
  likedProducts,
  isLoading,
  onRemove,
  onMoveToCart,
}: LikedProductsDropdownProps) {
  if (isLoading) {
    return (
      <div className="absolute right-0  w-[320px] bg-white border-2 border-black shadow-lg p-3 opacity-0 -translate-y-0.5 pointer-events-none group-hover:opacity-100  group-hover:pointer-events-auto transition-all duration-50 ease-in z-50">
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

  if (likedProducts.length === 0) {
    return (
      <div className="absolute right-0 -translate-y-0.5 w-[450px] bg-white border-2 border-black p-6 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-50 ease-in z-10">
        <div className="flex flex-col items-center space-y-2 mb-4">
          <p className="text-sm font-bold">Your wish list is empty</p>
          <p className="text-gray-600 text-center text-xs">
            Save your favourite items here so you never lose them!
          </p>
          <p className="text-sm font-bold">Start exploring!</p>
        </div>
        <Link href="/">
          <Button
            variant="plain"
            className="bg-neutral-900 rounded-none text-white w-full text-center"
          >
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute right-0 -mt-[1.8px] w-[450px] bg-white border-2 border-gray-800 shadow-xl opacity-0 -translate-y-0.5 pointer-events-none group-hover:opacity-100 group-hover:-translate-y-0 group-hover:pointer-events-auto transition-all duration-50 ease-in z-50">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-center">Your wish list</h2>
      </div>

      {/* Liked Items */}
      <div className="max-h-[400px] overflow-y-auto px-6 py-4">
        {likedProducts.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 mb-4 pb-4 border-b border-gray-100 last:border-b-0" >
            {/* Product Image */}
            <div className="relative w-20 h-24 shrink-0 bg-gray-100">
              <Image
                src={item.images?.[0]?.url || "/placeholder.png"}
                alt={item.slug}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-2">
                  <p className="text-sm text-gray-700 font-bold mb-1 ">
                    {item.brand}
                  </p>
                  <p className="text-sm font-normal line-clamp-2 mb-2 text-gray-900">
                    {item.slug}
                  </p>
                  <p className="text-base font-bold text-red-600 mb-1">
                    {(item.newPrice || item.price).toFixed(2)} €
                  </p>
                  {item.newPrice && item.newPrice < item.price && (
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500 line-through">
                        Originally: {item.price.toFixed(2)} €
                      </p>
                      {item.discount && (
                        <span className="text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          - {((item.discount / item.price) * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  className="text-gray-400 hover:text-black transition-colors p-1 -mt-1"
                  aria-label="Remove item"
                  onClick={() => onRemove?.(item.id)}
                >
                  <X size={24} strokeWidth={2} />
                </button>
              </div>

              {/* Color and Size */}
              {(item.colors?.length > 0 || item.sizes?.length > 0) && (
                <div className="text-sm text-gray-700 mb-2 space-y-1">
                  {item.colors?.[0] && <p>Colour: {item.colors[0].name}</p>}
                  {item.sizes?.[0] && <p>Size: {item.sizes[0].name}</p>}
                </div>
              )}

              {/* Move to bag */}
              <button
                className="text-sm underline hover:no-underline text-gray-900 font-normal cursor-pointer"
                onClick={() => onMoveToCart?.(item.id)}
              >
                Move to bag
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
        {/* Info Notice */}
        <div className="flex items-start gap-3 mb-5 p-3 bg-gray-100 rounded">
          <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-xs font-bold">i</span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed">
            Items in your wish list are not reserved. Add them to your bag to
            complete your purchase.
          </p>
        </div>

        {/* View all button */}
        <Link href="/wishlist">
          <Button
            variant="plain"
            className="w-full bg-black text-white hover:bg-gray-900 transition-colors py-4 rounded-none font-bold text-base"
          >
            View all saved items
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default LikedProductsDropdown;
