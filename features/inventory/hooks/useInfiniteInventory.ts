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

  const inventory = useAppSelector(selectAllInventory);
  const pagination = useAppSelector(selectInventoryPagination);
  const filters = useAppSelector(selectInventoryFilters);

  const filtersKey = JSON.stringify({ ...filters, ...additionalFilters });

  const memoizedFilters = useMemo(
    () => ({ ...filters, ...additionalFilters }),
    [filtersKey]
  );

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

  useEffect(() => {
    dispatch(setLoading(isLoading || isFetching));
  }, [dispatch, isLoading, isFetching]);

  useEffect(() => {
    dispatch(setError(error ? "Failed to load inventory" : null));
  }, [dispatch, error]);

  useEffect(() => {
    setCurrentPage(1);
  }, [memoizedFilters]);

  const loadNextPage = useCallback(() => {
    if (pagination.hasNextPage && !isLoading && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [pagination.hasNextPage, isLoading, isFetching]);

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
