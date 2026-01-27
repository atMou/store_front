"use client";

import { useCallback, useEffect, useState } from "react";
import { useGetProductsByIdsQuery } from "../api";
import { Product } from "../types";
import { useAppSelector } from "@/store";
import { selectUserLikedProductIds } from "@/features/user";

interface UseInfiniteLikedProductsOptions {
  pageSize?: number;
  include?: string;
}

export function useInfiniteLikedProducts({
  pageSize = 20,
  include = "variants",
}: UseInfiniteLikedProductsOptions) {

  const likedProductIds = useAppSelector(selectUserLikedProductIds);

  const productIdsKey = likedProductIds.join(",");
  const [pageState, setPageState] = useState({
    currentPage: 1,
    idsKey: productIdsKey,
  });
  useEffect(() => {
    if (pageState.idsKey !== productIdsKey) {
      setPageState({ currentPage: 1, idsKey: productIdsKey });
      setAccumulatedProducts([]); // Reset products immediately when IDs change
    }
  }, [productIdsKey, pageState.idsKey]);

  const { data, error, isLoading, isFetching } = useGetProductsByIdsQuery(
    {
      productIds: likedProductIds,
      pageNumber: pageState.currentPage,
      pageSize,
      include,
    },
    {
      skip: likedProductIds.length === 0,
      refetchOnMountOrArgChange: true,
    }
  );

  // Accumulate products from all pages
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!data?.items) return;

    if (pageState.currentPage === 1) {
      // Always update on first page to reflect removals/changes
      setAccumulatedProducts(data.items);
    } else {
      const existingIds = new Set(accumulatedProducts.map((p) => p.id));
      const newProducts = data.items.filter((p) => !existingIds.has(p.id));
      if (newProducts.length > 0) {
        setAccumulatedProducts((prev) => [...prev, ...newProducts]);
      }
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
