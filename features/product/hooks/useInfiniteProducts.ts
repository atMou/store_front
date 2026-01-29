"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useGetAllProductsQuery } from "../api";
import { FilterValues, Product } from "../types";

interface UseInfiniteProductsOptions {
  pageSize?: number;
  skip?: boolean;
  additionalFilters?: FilterValues;
}

export function useInfiniteProducts({
  pageSize = 20,
  skip = false,
  additionalFilters,
}: UseInfiniteProductsOptions = {}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    currentPage: 1,
    pageSize,
    hasNextPage: false,
  });

  const filtersKey = JSON.stringify({ ...additionalFilters });

  const memoizedFilters = useMemo(
    () => ({ ...additionalFilters }),
    [filtersKey]
  );

  const { data, error, isLoading, isFetching } = useGetAllProductsQuery(
    {
      ...memoizedFilters,
      pageNumber: currentPage,
      pageSize: pageSize,
    },
    {
      skip,
    }
  );

  useEffect(() => {
    if (!data) return;

    setItems((prev) =>
      data.pageNumber === 1 ? data.items : [...prev, ...data.items]
    );
    setPagination({
      totalCount: data.totalCount,
      currentPage: data.pageNumber,
      pageSize: data.pageSize,
      hasNextPage: data.pageNumber * data.pageSize < data.totalCount,
    });
  }, [data]);

  const loadNextPage = useCallback(() => {
    if (pagination.hasNextPage && !isLoading && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [pagination.hasNextPage, isLoading, isFetching]);

  const loadMore = useCallback(() => {
    loadNextPage();
  }, [loadNextPage]);

  return {
    products: items,
    pagination,
    isLoading,
    isFetching,
    error,
    loadMore,
    loadNextPage,
    hasNextPage: pagination.hasNextPage,
    totalCount: pagination.totalCount,
  };
}
