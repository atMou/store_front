"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { useGetAllProductsQuery } from "../api";
import {
  selectAllProducts,
  selectProductsFilters,
  selectProductsPagination,
  setError,
  setLoading,
  setProducts,
} from "../slice";
import { FilterValues } from "../types";

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
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  // Selectors
  const products = useAppSelector(selectAllProducts);
  const pagination = useAppSelector(selectProductsPagination);
  const filters = useAppSelector(selectProductsFilters);

  // Memoize filters to detect changes
  const filtersKey = JSON.stringify({ ...filters, ...additionalFilters });
  /* eslint-disable react-hooks/exhaustive-deps */
  const memoizedFilters = useMemo(
    () => ({ ...filters, ...additionalFilters }),
    [filtersKey]
  );

  // RTK Query with current page and Redux filters
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

  // Handle data updates
  useEffect(() => {
    if (data) {
      dispatch(
        setProducts({
          products: data.items,
          totalCount: data.totalCount,
          pageNumber: data.pageNumber,
          pageSize: data.pageSize,
          filters: memoizedFilters,
        })
      );
    }
  }, [data, dispatch, memoizedFilters]);

  // Handle loading state
  useEffect(() => {
    dispatch(setLoading(isLoading || isFetching));
  }, [dispatch, isLoading, isFetching]);

  // Handle error state
  useEffect(() => {
    dispatch(setError(error ? "Failed to load products" : null));
  }, [dispatch, error]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [memoizedFilters]);

  // Load next page function
  const loadNextPage = useCallback(() => {
    if (pagination.hasNextPage && !isLoading && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [pagination.hasNextPage, isLoading, isFetching]);

  // Load more function for infinite scroll (alias for loadNextPage)
  const loadMore = useCallback(() => {
    loadNextPage();
  }, [loadNextPage]);

  return {
    products,
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
