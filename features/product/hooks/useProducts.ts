"use client";

import { useAppSelector } from "@/store/hooks";
import { useGetAllProductsQuery } from "../api";
import { selectProductsFilters } from "../slice";
import { FilterValues } from "../types";

interface UseProductsOptions {
  pageSize?: number;
  additionalFilters?: Partial<FilterValues>;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { pageSize = 12, additionalFilters = {} } = options;

  const reduxFilters = useAppSelector(selectProductsFilters);

  const finalFilters: FilterValues = {
    ...reduxFilters,
    ...additionalFilters,
    pageNumber: reduxFilters.pageNumber || 1,
    pageSize: pageSize,
  };

  const { data, isLoading, isFetching, error } =
    useGetAllProductsQuery(finalFilters);

  return {
    products: data?.items || [],
    totalCount: data?.totalCount || 0,
    pageNumber: data?.pageNumber || 1,
    pageSize: data?.pageSize || pageSize,
    hasNextPage: (data?.totalCount || 0) > (data?.items.length || 0),
    isLoading: isLoading || isFetching,
    error,
    filters: finalFilters,
  };
}
