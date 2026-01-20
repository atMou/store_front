"use client";

import { useGetAllProductsQuery } from "@/features/product/api";
import { FilterValues } from "../types";

export function useProductSection(filters: FilterValues, pageSize = 12) {
  const { data, isLoading, isFetching } = useGetAllProductsQuery({
    ...filters,
    pageNumber: 1,
    pageSize: pageSize,
  });
  console.log("useProductSection data", data);
  console.log("filters in useProductSection", filters);
  return {
    products: data?.items || [],
    isLoading: isLoading || isFetching,
    totalCount: data?.totalCount || 0,
  };
}
