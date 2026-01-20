import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart, CartItem, Coupon } from "./types";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: { detail: string; errors: string[] } | null;
  lastSyncedAt: number | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
  lastSyncedAt: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      state.lastSyncedAt = Date.now();
      state.error = null;
    },

    setUserId: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        state.cart.userId = action.payload;
      }
    },
    setCartId: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        state.cart.cartId = action.payload;
      }
    },

    clearCart: (state) => {
      state.cart = initialState.cart;
      state.lastSyncedAt = null;
      state.error = null;
    },

    // Optimistic add item
    optimisticAddItem: (state, action: PayloadAction<CartItem>) => {
      if (!state.cart) {
        return;
      }

      const existingItemIndex = state.cart.lineItems.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.colorVariantId === action.payload.colorVariantId &&
          item.sizeVariantId === action.payload.sizeVariantId
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        state.cart.lineItems[existingItemIndex].quantity +=
          action.payload.quantity;
        state.cart.lineItems[existingItemIndex].lineTotal =
          state.cart.lineItems[existingItemIndex].quantity *
          state.cart.lineItems[existingItemIndex].unitPrice;
      } else {
        // Add new item
        state.cart.lineItems.push(action.payload);
      }

      // Recalculate totals
      state.cart.totalSub = state.cart.lineItems.reduce(
        (sum, item) => sum + item.lineTotal,
        0
      );
      state.cart.total =
        state.cart.totalSub - state.cart.discount + state.cart.tax;
      state.cart.totalDiscounted = state.cart.total;
    },

    // Optimistic update item quantity
    optimisticUpdateItem: (
      state,
      action: PayloadAction<{
        colorVariantId: string;
        sizeVariantId: string;
        quantity: number;
      }>
    ) => {
      if (!state.cart) {
        return;
      }

      const item = state.cart.lineItems.find(
        (item) =>
          item.colorVariantId === action.payload.colorVariantId &&
          item.sizeVariantId === action.payload.sizeVariantId
      );

      if (item) {
        item.quantity = action.payload.quantity;
        item.lineTotal = item.quantity * item.unitPrice;

        // Recalculate totals
        state.cart.totalSub = state.cart.lineItems.reduce(
          (sum, item) => sum + item.lineTotal,
          0
        );
        state.cart.total =
          state.cart.totalSub - state.cart.discount + state.cart.tax;
        state.cart.totalDiscounted = state.cart.total;
      }
    },

    // Optimistic remove item
    optimisticRemoveItem: (
      state,
      action: PayloadAction<{ colorVariantId: string; sizeVariantId: string }>
    ) => {
      if (!state.cart) {
        return;
      }

      state.cart.lineItems = state.cart.lineItems.filter(
        (item) =>
          item.colorVariantId !== action.payload.colorVariantId ||
          item.sizeVariantId !== action.payload.sizeVariantId
      );

      // Recalculate totals
      state.cart.totalSub = state.cart.lineItems.reduce(
        (sum, item) => sum + item.lineTotal,
        0
      );
      state.cart.total =
        state.cart.totalSub - state.cart.discount + state.cart.tax;
      state.cart.totalDiscounted = state.cart.total;
    },

    // Optimistic add coupon
    optimisticAddCoupon: (
      state,
      action: PayloadAction<{ coupon: Coupon; discountAmount: number }>
    ) => {
      if (!state.cart) {
        return;
      }

      state.cart.coupons.push(action.payload.coupon);
      state.cart.discount += action.payload.discountAmount;
      state.cart.total =
        state.cart.totalSub - state.cart.discount + state.cart.tax;
      state.cart.totalDiscounted = state.cart.total;
    },

    // Optimistic remove coupon
    optimisticRemoveCoupon: (
      state,
      action: PayloadAction<{ couponId: string; discountAmount: number }>
    ) => {
      if (!state.cart) {
        return;
      }

      state.cart.coupons = state.cart.coupons.filter(
        (coupon) => coupon.id !== action.payload.couponId
      );
      state.cart.discount -= action.payload.discountAmount;
      state.cart.total =
        state.cart.totalSub - state.cart.discount + state.cart.tax;
      state.cart.totalDiscounted = state.cart.total;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (
      state,
      action: PayloadAction<{ detail: string; errors: string[] } | null>
    ) => {
      state.error = action.payload;
    },

    // Rollback optimistic update (revert to last synced state)
    rollbackOptimisticUpdate: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      state.error = {
        detail: "Failed to update cart. Please try again.",
        errors: ["Failed to update cart. Please try again."],
      };
    },
  },
});

export const cartActions = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartItems = (state: RootState) =>
  state.cart.cart?.lineItems || [];
export const selectCartItemCount = (state: RootState) =>
  state.cart.cart?.lineItems.reduce((sum, item) => sum + item.quantity, 0) || 0;
export const selectCartTotal = (state: RootState) =>
  state.cart.cart?.total || 0;
export const selectCartSubTotal = (state: RootState) =>
  state.cart.cart?.totalSub || 0;
export const selectCartDiscount = (state: RootState) =>
  state.cart.cart?.discount || 0;
export const selectCartCoupons = (state: RootState) =>
  state.cart.cart?.coupons || [];
export const selectCartLoading = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectLastSyncedAt = (state: RootState) => state.cart.lastSyncedAt;
