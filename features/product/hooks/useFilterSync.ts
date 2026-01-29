"use client";

import useQueryParams from "@/hooks/network/useQueryParams";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { selectProductsFilters, setFilters } from "../slice";
import { FilterValues } from "../types";

export function useFilterSync() {
  const searchParams = useSearchParams();
  const { updateQuery } = useQueryParams();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectProductsFilters);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      const urlFilters: Partial<FilterValues> = {};

      searchParams.forEach((value, key) => {
        if (value === "true" || value === "false") {
          (urlFilters as Record<string, unknown>)[key] = value === "true";
        } else if (
          ["minPrice", "maxPrice", "pageNumber", "pageSize"].includes(key)
        ) {
          const num = Number(value);
          if (!isNaN(num)) (urlFilters as Record<string, unknown>)[key] = num;
        } else {
          (urlFilters as Record<string, unknown>)[key] = value;
        }
      });

      if (Object.keys(urlFilters).length > 0) {
        dispatch(setFilters(urlFilters));
      }

      isInitialMount.current = false;
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) return;

    const urlParams: Record<string, string | number | boolean | null> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        key === "include" ||
        key === "category" ||
        key === "sub"
      ) {
        return;
      }

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        urlParams[key] = value;
      }
    });

    updateQuery(urlParams);
  }, [filters]);
}
