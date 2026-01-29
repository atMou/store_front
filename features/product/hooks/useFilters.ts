"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCallback } from "react";
import {
  clearFilters as clearFiltersAction,
  selectProductsFilters,
  setFilters as setFiltersAction,
  updateFilters as updateFiltersAction,
} from "../slice";
import { FilterValues } from "../types";

export function useFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectProductsFilters);

  const setFilters = useCallback(
    (newFilters: FilterValues) => {
      dispatch(setFiltersAction(newFilters));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (partialFilters: Partial<FilterValues>) => {
      dispatch(updateFiltersAction(partialFilters));
    },
    [dispatch]
  );

  const resetFilters = useCallback(() => {
    dispatch(clearFiltersAction());
  }, [dispatch]);

  return {
    filters,
    setFilters,
    updateFilters,
    resetFilters,
  };
}
