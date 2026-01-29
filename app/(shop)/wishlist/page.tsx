"use client";

import { ApiErrorDisplay } from "@/components/feedback";
import BreadCrumb from "@/components/feedback/BreadCrumb";
import LandingLayout from "@/components/layouts/LandingLayout";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/features/product/components";
import { useInfiniteLikedProducts } from "@/features/product/hooks/useInfiniteLikedProducts";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const {
    products: productsData,
    isLoading,
    error,
  } = useInfiniteLikedProducts({
    include: "variants",
  });

  const products = productsData || [];
  const showSkeleton = isLoading && products.length > 0;

  return (
    <LandingLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <BreadCrumb />

        <div className="mt-4 mb-6 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-600 fill-current" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Wishlist ({products.length})
          </h1>
        </div>

        {error && (
          <div className="mb-6">
            <ApiErrorDisplay error={error} variant="default" />
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Save items you love to revisit them later.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {showSkeleton
              ? Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    size="medium"
                  />
                ))}
          </div>
        )}
      </div>
    </LandingLayout>
  );
}
