import { baseApi } from "@/store";
import {
  ConfirmPaymentResponse,
  CreatePaymentIntentResponse,
  Payment,
} from "./types";

export const paymentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllPayments: builder.query<Payment[], void>({
      query: () => "api/payments",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Payment" as const, id })),
              { type: "Payment", id: "LIST" },
            ]
          : [{ type: "Payment", id: "LIST" }],
    }),

    getPayment: builder.query({
      query: (id: string) => `/Payments/${id}`,
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    getPaymentByCartId: builder.query<Payment, { cartId: string }>({
      query: ({ cartId }) => ({
        url: `api/payments/${cartId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, { cartId }) => [
        { type: "Payment", id: cartId },
      ],
    }),

    createPaymentIntent: builder.mutation<
      CreatePaymentIntentResponse,
      { cartId: string }
    >({
      query: ({ cartId }) => ({
        url: `api/payments/${cartId}/create-payment-intent`,
        method: "POST",
        credentials: "include",
      }),
    }),

    confirmPayment: builder.mutation<
      ConfirmPaymentResponse,
      {
        paymentId: string;
      }
    >({
      query: ({ paymentId }) => ({
        url: `api/payments/${paymentId}/confirm-payment-intent`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Payment", "Cart"],
    }),

    paymentFailed: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `api/payments/status`,
        method: "PUT",
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Payment", id },
        "Payment",
      ],
    }),

    paymentFulfilled: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `api/payments/status`,
        method: "PUT",
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Payment", id },
        "Payment",
      ],
    }),
  }),
});

export const {
  useGetAllPaymentsQuery,

  useGetPaymentQuery,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
  usePaymentFailedMutation,
  usePaymentFulfilledMutation,
  useGetPaymentByCartIdQuery,
} = paymentApi;
