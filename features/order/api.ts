import { buildQueryParams } from "@/shared/lib/apiUtils";
import { getErrors } from "@/shared/lib/httpStatusCodes";
import { baseApi } from "@/store";
import { orderActions } from "./slice";
import {
  GetAllOrdersRequest,
  GetOrderByCartIdRequest,
  GetOrderByIdRequest,
  Order,
  PaginatedOrders,
} from "./types";

export const orderApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllOrders: builder.query<PaginatedOrders, GetAllOrdersRequest>({
      query: (params) => {
        const queryParams = buildQueryParams(params as Record<string, unknown>);

        return {
          url: `/orders?${queryParams.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ orderId }) => ({
                type: "Order" as const,
                id: orderId,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(orderActions.setOrders(data.items));
        } catch (error: unknown) {
          dispatch(orderActions.setError(getErrors(error)));
        }
      },
    }),

    getOrderById: builder.query<Order, GetOrderByIdRequest>({
      query: ({ orderId }) => ({
        url: `/orders/${orderId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, arg) => [
        { type: "Order", id: arg.orderId },
      ],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(orderActions.setCurrentOrder(data));
        } catch (error: unknown) {
          dispatch(orderActions.setError(getErrors(error)));
        }
      },
    }),

    getOrdersByUserId: builder.query<PaginatedOrders, { userId: string }>({
      query: ({ userId }) => ({
        url: `/orders/user/${userId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ orderId }) => ({
                type: "Order" as const,
                id: orderId,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(orderActions.setOrders(data.items));
        } catch (error: unknown) {
          dispatch(orderActions.setError(getErrors(error)));
        }
      },
    }),

    getOrderByCartId: builder.query<Order, GetOrderByCartIdRequest>({
      query: ({ cartId }) => ({
        url: `/orders/${cartId}/cart`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Order"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(orderActions.setCurrentOrder(data));
        } catch (error: unknown) {
          dispatch(orderActions.setError(getErrors(error)));
        }
      },
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useLazyGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrdersByUserIdQuery,
  useGetOrderByCartIdQuery,
} = orderApi;
