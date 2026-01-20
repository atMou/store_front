import { useAuth } from "@/hooks/state/useAuth";
import { TryAsync } from "@/shared/lib/utils";
import {  useAppSelector } from "@/store/hooks";
import { useCallback } from "react";
import {
  useAddLineItemMutation,
  useDeleteLineItemMutation,
  useLazyGetCartByUserIdQuery,
  useUpdateLineItemMutation,
} from "../api";
import {
  selectCart,
  selectCartError,
  selectCartItemCount,
  selectCartItems,
  selectCartLoading,
  selectCartSubTotal,
  selectCartTotal,
} from "../slice";
import { CartItem } from "../types";

export function useCart() {
  const { isAuthenticated, user } = useAuth();
  const cart = useAppSelector(selectCart);
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const total = useAppSelector(selectCartTotal);
  const subTotal = useAppSelector(selectCartSubTotal);
  const isLoading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);

  // Mutations
  const [addLineItemMutation, { isLoading: isAdding }] =
    useAddLineItemMutation();
  const [updateLineItemMutation, { isLoading: isUpdating }] =
    useUpdateLineItemMutation();
  const [deleteLineItemMutation, { isLoading: isDeleting }] =
    useDeleteLineItemMutation();
  const [getCartByUserIdTrigger] = useLazyGetCartByUserIdQuery();

  const addItem = useCallback(
    async (item: CartItem) => {
      if (!isAuthenticated) {
        return {
          success: false,
          error: {
            detail: "Please log in to add items to cart",
            errors: ["Authentication required"],
          },
        };
      }
      if (!cart?.cartId) {
        await getCartByUserIdTrigger({
          userId: user?.id || "",
          include: ["lineItems", "couponIds"],
        }).unwrap();
      }

      const { error } = await TryAsync(() =>
        addLineItemMutation({
          cartId: cart?.cartId || "",
          productId: item.productId,
          quantity: item.quantity,
          colorVariantId: item.colorVariantId,
          sizeVariantId: item.sizeVariantId,
        }).unwrap()
      );

      if (error) {
        return {
          success: false,
          error,
        };
      }

      return { success: true };
    },

    [
      cart,
      addLineItemMutation,
      isAuthenticated,
      getCartByUserIdTrigger,
      user?.id,
    ]
  );

  /**
   * Update item quantity with optimistic update
   * @returns Object with success status and optional error details
   */
  const updateItem = useCallback(
    async (
      productId: string,
      quantity: number,
      colorVariantId: string,
      sizeVariantId: string
    ) => {
      // Require authentication for cart operations
      if (!isAuthenticated || !cart?.cartId) {
        return {
          success: false,
          error: {
            detail: "Please log in to update cart",
            errors: ["Authentication required"],
          },
        };
      }

      const { error } = await TryAsync(() =>
        updateLineItemMutation({
          cartId: cart.cartId,
          quantity,
          colorVariantId: colorVariantId,
          sizeVariantId: sizeVariantId,
        }).unwrap()
      );

      if (error) {
        return {
          success: false,
          error,
        };
      }

      return { success: true };
    },
    [cart, updateLineItemMutation, isAuthenticated]
  );

  const removeItem = useCallback(
    async (colorVariantId: string, sizeVariantId: string) => {
      // Require authentication for cart operations
      if (!isAuthenticated || !cart?.cartId) {
        return {
          success: false,
          error: {
            detail: "Please log in to remove items",
            errors: ["Authentication required"],
          },
        };
      }

      const { error } = await TryAsync(() =>
        deleteLineItemMutation({
          cartId: cart.cartId,
          colorVariantId,
          sizeVariantId,
        }).unwrap()
      );

      if (error) {
        return {
          success: false,
          error,
        };
      }

      return { success: true };
    },
    [cart, deleteLineItemMutation, isAuthenticated]
  );

  const getItem = useCallback(
    (productId: string) => {
      return items.find((item) => item.productId === productId);
    },
    [items]
  );

  const hasItem = useCallback(
    (productId: string) => {
      return items.some((item) => item.productId === productId);
    },
    [items]
  );

  return {
    cart,
    items,
    itemCount,
    total,
    subTotal,
    isLoading: isLoading || isAdding || isUpdating || isDeleting,
    error,
    errorDetail: error?.detail ?? null,
    errorMessages: error?.errors ?? [],
    hasError: error !== null,

    addItem,
    updateItem,
    removeItem,
    getItem,
    hasItem,

    isAdding,
    isUpdating,
    isDeleting,
  };
}
