"use client";

import { useAppSelector } from "@/store/hooks";
import { useInfiniteProducts } from "../hooks/useInfiniteProducts";
import { selectProductsFilters } from "../slice";
import ProductCard from "./ProductCard";

function ProductGrid() {
  const filters = useAppSelector(selectProductsFilters);
  const { products, totalCount, isLoading, hasNextPage, loadMore, isFetching } =
    useInfiniteProducts({
      pageSize: 24,
      additionalFilters: { include: "colorVariants", ...filters },
    });

  if (isLoading) {
    return (
      <div className="py-12 text-center text-gray-500">Loading products...</div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No products available
      </div>
    );
  }

  return (
    <div className="w-full">
      {}
      <div className="flex items-center gap-2 py-4 text-sm text-gray-600">
        <span className="font-medium">
          {totalCount?.toLocaleString() || products.length.toLocaleString()}{" "}
          items
        </span>
        <button className="text-gray-400 hover:text-gray-600">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="8"
              cy="8"
              r="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 5v3m0 3h.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {}
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="w-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {}
      {hasNextPage && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={isFetching}
            className="px-6 py-3 border border-gray-300 hover:border-black transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetching ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
