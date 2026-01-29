import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCallback } from "react";
import {
  useGetOrderByCartIdQuery,
  useGetOrderByIdQuery,
  useGetOrdersByUserIdQuery,
} from "../api";
import {
  orderActions,
  selectCurrentOrder,
  selectOrderError,
  selectOrderLoading,
  selectMyOrders,
} from "../slice";

export function useOrder() {
  const dispatch = useAppDispatch();
  const currentOrder = useAppSelector(selectCurrentOrder);
  const orders = useAppSelector(selectMyOrders);
  const isLoading = useAppSelector(selectOrderLoading);
  const error = useAppSelector(selectOrderError);

  const clearCurrentOrder = useCallback(() => {
    dispatch(orderActions.clearCurrentOrder());
  }, [dispatch]);

  const clearOrders = useCallback(() => {
    dispatch(orderActions.clearOrders());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(orderActions.clearError());
  }, [dispatch]);

  return {
    currentOrder,
    orders,
    isLoading,
    error,
    errorDetail: error?.detail ?? null,
    errorMessages: error?.errors ?? [],
    hasError: error !== null,
    clearCurrentOrder,
    clearOrders,
    clearError,
  };
}

export function useOrderById(orderId: string | null, skip = false) {
  const { data, isLoading, error, refetch } = useGetOrderByIdQuery(
    { orderId: orderId! },
    { skip: !orderId || skip }
  );

  return {
    order: data,
    isLoading,
    error,
    refetch,
  };
}

export function useOrdersByUserId(userId: string | null, skip = false) {
  const { data, isLoading, error, refetch } = useGetOrdersByUserIdQuery(
    { userId: userId! },
    { skip: !userId || skip }
  );

  return {
    orders: data?.items ?? [],
    isLoading,
    error,
    refetch,
  };
}

export function useOrderByCartId(cartId: string | null, skip = false) {
  const { data, isLoading, error, refetch } = useGetOrderByCartIdQuery(
    { cartId: cartId! },
    { skip: !cartId || skip }
  );

  return {
    order: data,
    isLoading,
    error,
    refetch,
  };
}
