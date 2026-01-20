"use client";

import { useCallback, useEffect, useState } from "react";
import { useGetProductsByIdsQuery } from "../api";
import { Product } from "../types";

interface UseInfiniteLikedProductsOptions {
  productIds: string[];
  pageSize?: number;
  include?: string;
}

export function useInfiniteLikedProducts({
  productIds,
  pageSize = 20,
  include = "variants",
}: UseInfiniteLikedProductsOptions) {
  const productIdsKey = productIds.join(",");
  const [pageState, setPageState] = useState({
    currentPage: 1,
    idsKey: productIdsKey,
  });

  // Reset page when productIds change
  useEffect(() => {
    if (pageState.idsKey !== productIdsKey) {
      setPageState({ currentPage: 1, idsKey: productIdsKey });
    }
  }, [productIdsKey, pageState.idsKey]);

  // RTK Query with current page
  const { data, error, isLoading, isFetching } = useGetProductsByIdsQuery(
    {
      productIds,
      pageNumber: pageState.currentPage,
      pageSize,
      include,
    },
    {
      skip: productIds.length === 0,
    }
  );

  // Accumulate products from all pages
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!data?.items) return;

    if (
      pageState.currentPage === 1 &&
      accumulatedProducts.length > 0 &&
      accumulatedProducts[0]?.id !== data.items[0]?.id
    ) {
      setAccumulatedProducts(data.items);
    } else if (pageState.currentPage > 1) {
      const existingIds = new Set(accumulatedProducts.map((p) => p.id));
      const newProducts = data.items.filter((p) => !existingIds.has(p.id));
      if (newProducts.length > 0) {
        setAccumulatedProducts((prev) => [...prev, ...newProducts]);
      }
    } else if (accumulatedProducts.length === 0) {
      setAccumulatedProducts(data.items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageState.currentPage]);

  // Calculate pagination info
  const hasNextPage = data
    ? pageState.currentPage < Math.ceil(data.totalCount / data.pageSize)
    : false;

  // Load next page function
  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isLoading && !isFetching) {
      setPageState((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  }, [hasNextPage, isLoading, isFetching]);

  // Load more function for infinite scroll (alias for loadNextPage)
  const loadMore = useCallback(() => {
    loadNextPage();
  }, [loadNextPage]);

  return {
    products: accumulatedProducts,
    isLoading,
    isFetching,
    error,
    loadMore,
    loadNextPage,
    hasNextPage,
    totalCount: data?.totalCount || 0,
    currentPage: pageState.currentPage,
  };
}
