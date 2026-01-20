import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { User } from "./types";
interface UserState {
  user: User | undefined;
  accessToken?: string;
  error: string | null;
  guestLikedProductIds: string[]; // For non-authenticated users
}
const intialState: UserState = {
  user: undefined,
  accessToken: undefined,
  error: null,
  guestLikedProductIds: [],
};

const userSlice = createSlice({
  name: "user",
  initialState: intialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setCartId: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.cartId = action.payload;
      }
    },
    clearUser(state) {
      state.user = undefined;
      state.accessToken = undefined;
      state.error = null;
      // Keep guestLikedProductIds for guest users
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },

    clearTokens(state) {
      state.accessToken = undefined;
    },

    toggleLikedProductId(state, action: PayloadAction<string>) {
      const productId = action.payload;

      if (state.user) {
        // Authenticated user
        const likedProducts = state.user.likedProductIds || [];
        const index = likedProducts.indexOf(productId);

        if (index > -1) {
          state.user.likedProductIds = likedProducts.filter(
            (id) => id !== productId
          );
        } else {
          state.user.likedProductIds = [...likedProducts, productId];
        }
      } else {
        // Guest user - ensure array exists (for redux-persist compatibility)
        if (!state.guestLikedProductIds) {
          state.guestLikedProductIds = [];
        }
        const index = state.guestLikedProductIds.indexOf(productId);

        if (index > -1) {
          state.guestLikedProductIds = state.guestLikedProductIds.filter(
            (id) => id !== productId
          );
        } else {
          state.guestLikedProductIds = [
            ...state.guestLikedProductIds,
            productId,
          ];
        }
      }
    },

    mergeLikedProducts(state) {
      // Merge guest liked products with user liked products when user logs in
      if (state.user && state.guestLikedProductIds.length > 0) {
        const userLikedProducts = state.user.likedProductIds || [];
        const mergedLikedProducts = [
          ...new Set([...userLikedProducts, ...state.guestLikedProductIds]),
        ];
        state.user.likedProductIds = mergedLikedProducts;
        state.guestLikedProductIds = []; // Clear guest liked products
      }
    },

    toggleProductSubscription(
      state,
      action: PayloadAction<{ productId: string; color: string; size: string }>
    ) {
      if (!state.user) return;

      const { productId, color, size } = action.payload;
      const subscriptionKey = `${productId}_${color}_${size}`;
      const subscriptions = state.user.productSubscriptions || [];
      const index = subscriptions.indexOf(subscriptionKey);

      if (index > -1) {
        // Unsubscribe
        state.user.productSubscriptions = subscriptions.filter(
          (key) => key !== subscriptionKey
        );
      } else {
        // Subscribe
        state.user.productSubscriptions = [...subscriptions, subscriptionKey];
      }
    },
    removeAddress(state, action: PayloadAction<string>) {
      const addressId = action.payload;
      if (state.user) {
        state.user.addresses = state.user.addresses.filter(
          (addr) => addr.id !== addressId
        );
      }
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    clearError(state) {
      state.error = null;
    },
  },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;

export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectUserLikedProductIds = (state: { user: UserState }) =>
  state.user.user?.likedProductIds || state.user.guestLikedProductIds || [];
export const selectGuestLikedProductIds = (state: { user: UserState }) =>
  state.user.guestLikedProductIds;
export const selectAccessToken = (state: { user: UserState }) =>
  state.user.accessToken;
export const selectUserError = (state: { user: UserState }) => state.user.error;

// Product subscription selectors
export const selectProductSubscriptions = (state: { user: UserState }) =>
  state.user.user?.productSubscriptions || [];

export const selectIsSubscribedToProduct = (
  state: { user: UserState },
  productId: string,
  color: string,
  size: string
) => {
  const subscriptions = state.user.user?.productSubscriptions || [];
  const subscriptionKey = `${productId}_${color}_${size}`;
  return subscriptions.includes(subscriptionKey);
};
