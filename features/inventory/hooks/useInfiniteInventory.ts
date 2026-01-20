"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { useGetInventoryQuery } from "../api";
import {
  selectAllInventory,
  selectInventoryFilters,
  selectInventoryPagination,
  setError,
  setInventory,
  setLoading,
} from "../slice";
import { InventoryQueryParams } from "../types";

interface UseInfiniteInventoryOptions {
  pageSize?: number;
  skip?: boolean;
  additionalFilters?: InventoryQueryParams;
}

export function useInfiniteInventory({
  pageSize = 20,
  skip = false,
  additionalFilters,
}: UseInfiniteInventoryOptions = {}) {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  // Selectors
  const inventory = useAppSelector(selectAllInventory);
  const pagination = useAppSelector(selectInventoryPagination);
  const filters = useAppSelector(selectInventoryFilters);

  // Memoize filters to detect changes
  const filtersKey = JSON.stringify({ ...filters, ...additionalFilters });
  /* eslint-disable react-hooks/exhaustive-deps */
  const memoizedFilters = useMemo(
    () => ({ ...filters, ...additionalFilters }),
    [filtersKey]
  );

  // RTK Query with current page and Redux filters
  const { data, error, isLoading, isFetching } = useGetInventoryQuery(
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
        setInventory({
          inventory: data.items,
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
    dispatch(setError(error ? "Failed to load inventory" : null));
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
    inventory,
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
