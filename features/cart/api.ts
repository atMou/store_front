import { isApiError } from "./../../shared/lib/httpStatusCodes";
import { getErrors } from "@/shared/lib/httpStatusCodes";
import { baseApi } from "@/store";
import { RootState } from "@/store/store";
import { PaginatedResult } from "@/types";
import { cartActions } from "./slice";
import {
  AddMultipleLineItemsRequest,
  Cart,
  ChangeDeliveryAddressRequest,
  Coupon,
  CouponStatus,
  DeleteLineItemRequest,
  GetCouponsByUserIdRequest,
  RemoveCouponFromCartRequest,
} from "./types";
import { userActions } from "../user";

export const cartApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCart: builder.query<
      Cart,
      { Id: string; include: ("lineItems" | "couponIds")[] }
    >({
      query: ({ Id, include }) => ({
        url: `/baskets/${Id}`,
        method: "GET",
        credentials: "include",
        params: { include: include.join(",") },
      }),
      providesTags: ["Cart"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("[Cart API] getCart result:", data);
          dispatch(cartActions.setCart(data));
        } catch (error: unknown) {
          dispatch(cartActions.setError(getErrors(error)));
        }
      },
    }),

    getCartByUserId: builder.query<
      Cart,
      { userId: string; include: ("lineItems" | "couponIds")[] }
    >({
      query: ({ userId, include }) => ({
        url: `/baskets/${userId}/user`,
        method: "GET",
        credentials: "include",
        params: { include: include.join(",") },
      }),
      providesTags: ["Cart"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("[Cart API] getCartByUserId result:", data);
          dispatch(cartActions.setCart(data));
          dispatch(userActions.setCartId(data.cartId));
        } catch (error) {
          dispatch(cartActions.setError(getErrors(error)));
        }
      },
    }),

    addLineItem: builder.mutation<
      Cart,
      {
        cartId: string;
        productId: string;
        colorVariantId: string;
        sizeVariantId: string;
        quantity: number;
      }
    >({
      query: (request) => ({
        url: "/baskets/add-line-item",
        method: "POST",
        body: request,
        credentials: "include",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("[Cart API] addLineItem result:", data);
          dispatch(cartActions.setCart(data));
        } catch (error) {
          dispatch(cartActions.setError(getErrors(error)));
        }
      },
      invalidatesTags: ["Cart"],
    }),

    addMultipleLineItems: builder.mutation<Cart, AddMultipleLineItemsRequest>({
      query: (request) => ({
        url: "/baskets/add-multiple-line-items",
        method: "POST",
        body: request,
        credentials: "include",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("[Cart API] addMultipleLineItems result:", data);
          dispatch(cartActions.setCart(data));
        } catch (error) {
          dispatch(cartActions.setError(getErrors(error)));
        }
      },
      invalidatesTags: ["Cart"],
    }),

    updateLineItem: builder.mutation<
      Cart,
      {
        cartId: string;
        colorVariantId: string;
        sizeVariantId: string;
        quantity: number;
      }
    >({
      query: (request) => ({
        url: `/baskets/update-line-item`,
        method: "POST",
        body: request,
        credentials: "include",
      }),
      async onQueryStarted(
        { colorVariantId, sizeVariantId, quantity },
        { dispatch, queryFulfilled, getState }
      ) {
        const state = getState() as RootState;
        const previousCart = state.cart.cart;

        // Optimistic update
        dispatch(
          cartActions.optimisticUpdateItem({
            colorVariantId,
            sizeVariantId,
            quantity,
          })
        );

        try {
          const { data } = await queryFulfilled;
          console.log("[Cart API] updateLineItem result:", data);
          dispatch(cartActions.setCart(data));
        } catch (error) {
          // Rollback on error
          if (previousCart) {
            dispatch(cartActions.rollbackOptimisticUpdate(previousCart));
          }
          dispatch(cartActions.setError(getErrors(error)));
        }
      },
      invalidatesTags: ["Cart"],
    }),

    deleteLineItem: builder.mutation<Cart, DeleteLineItemRequest>({
      query: (request) => ({
        url: `/baskets/delete-line-item`,
        method: "DELETE",
        body: request,
        credentials: "include",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        // Store previous state for rollback
        const state = getState() as RootState;
        const previousCart = state.cart.cart;

        try {
          const { data } = await queryFulfilled;
          console.log("[Cart API] deleteLineItem result:", data);
          dispatch(cartActions.setCart(data));
        } catch (error) {
          // Rollback on error
          if (previousCart) {
            dispatch(cartActions.rollbackOptimisticUpdate(previousCart));
          }
          dispatch(cartActions.setError(getErrors(error)));
        }
      },
      invalidatesTags: ["Cart"],
    }),

    addCouponToCart: builder.mutation<
      void,
      {
        cartId: string;
        couponCode: string;
      }
    >({
      query: (request) => ({
        url: `/baskets/add-coupon`,
        method: "POST",
        body: request,
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCouponFromCart: builder.mutation<
      void,
      {
        cartId: string;
        couponId: string;
      }
    >({
      query: (request) => ({
        url: `/baskets/remove-coupon`,
        method: "POST",
        body: request,
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    checkoutCart: builder.mutation<void, { cartId: string }>({
      query: (request: { cartId: string }) => ({
        url: `/baskets/checkout`,
        method: "POST",
        body: request,
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    changeDeliveryAddress: builder.mutation<
      void,
      {
        cartId: string;
        addressId: string;
        userId: string;
      }
    >({
      query: (request) => ({
        url: `/baskets/change-delivery-address`,
        method: "POST",
        body: request,
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    deleteCouponFromCart: builder.mutation<void, RemoveCouponFromCartRequest>({
      query: (request) => ({
        url: `/baskets/remove-coupon`,
        method: "POST",
        body: request,
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    getCouponsByUserId: builder.query<
      PaginatedResult<Coupon>,
      {
        userId: string;
        pageNumber?: number;
        pageSize?: number;
        status?: CouponStatus[];
      }
    >({
      query: ({ userId, pageNumber = 1, pageSize = 10, status }) => {
        const params = new URLSearchParams({
          pageNumber: pageNumber.toString(),
          pageSize: pageSize.toString(),
          status: status ? status.join(",") : "",
        });
        return {
          url: `/coupons/user/${userId}?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useLazyGetCartQuery,
  useGetCouponsByUserIdQuery,
  useLazyGetCouponsByUserIdQuery,
  useGetCartByUserIdQuery,
  useLazyGetCartByUserIdQuery,
  useAddLineItemMutation,
  useAddMultipleLineItemsMutation,
  useUpdateLineItemMutation,
  useDeleteLineItemMutation,
  useAddCouponToCartMutation,
  useRemoveCouponFromCartMutation,
  useCheckoutCartMutation,

  useChangeDeliveryAddressMutation,
  useDeleteCouponFromCartMutation,
} = cartApi;
