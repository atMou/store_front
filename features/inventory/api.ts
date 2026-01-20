import { buildQueryParams } from "@/shared/lib/apiUtils";
import { baseApi } from "@/store/apis/base-api";
import { PaginatedResult } from "@/types";
import {
  InventoryQueryParams,
  InventoryResult,
  UpdateInventoryRequest,
  WarehouseResult,
} from "./types";

export const inventoryApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getInventory: builder.query<
      PaginatedResult<InventoryResult>,
      InventoryQueryParams
    >({
      query: (params) => {
        const searchParams = buildQueryParams(params);

        return {
          url: `/Inventories?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }: { id: string }) => ({
                type: "Inventory" as const,
                id,
              })),
              { type: "Inventory", id: "LIST" },
            ]
          : [{ type: "Inventory", id: "LIST" }],
    }),

    getInventoryById: builder.query<InventoryResult, string>({
      query: (id) => ({
        url: `/Inventories/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Inventory", id }],
    }),

    getInventoryByProductId: builder.query<InventoryResult, string>({
      query: (productId) => ({
        url: `/api/Inventory/product/${productId}`,
        method: "GET",
      }),
      providesTags: (result, error, productId) => [
        { type: "Inventory", id: productId },
      ],
    }),

    getInventoryByVariantId: builder.query<InventoryResult, string>({
      query: (variantId) => ({
        url: `/Inventory/variant/${variantId}`,
        method: "GET",
      }),
      providesTags: (result, error, variantId) => [
        { type: "Inventory", id: variantId },
      ],
    }),

    getInventoryBySku: builder.query<InventoryResult, string>({
      query: (sku) => ({
        url: `/api/Inventory/sku/${sku}`,
        method: "GET",
      }),
      providesTags: (result, error, sku) => [{ type: "Inventory", id: sku }],
    }),

    updateInventory: builder.mutation<void, UpdateInventoryRequest>({
      query: (data) => ({
        url: `/inventories`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Inventory", id: id },
        { type: "Inventory", id: "LIST" },
      ],
    }),

    getWarehouses: builder.query<WarehouseResult[], void>({
      query: () => ({
        url: `/Inventories/warehouses`,
      }),
      providesTags: [{ type: "Inventory", id: "WAREHOUSES" }],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useGetInventoryByIdQuery,
  useGetInventoryByProductIdQuery,
  useGetInventoryByVariantIdQuery,
  useGetInventoryBySkuQuery,
  useGetWarehousesQuery,
  useLazyGetInventoryQuery,
  useLazyGetInventoryByIdQuery,
  useLazyGetInventoryByProductIdQuery,
  useLazyGetInventoryByVariantIdQuery,
  useLazyGetInventoryBySkuQuery,
  useUpdateInventoryMutation,
} = inventoryApi;
