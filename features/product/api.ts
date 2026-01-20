import { logger } from "@/shared/lib/logger";
import { baseApi } from "@/store";
import { PaginatedResult } from "@/types";
import { FilterValues, Product } from "./types";

const toPascalCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const productApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllProducts: builder.query<PaginatedResult<Product>, FilterValues>({
      query: (params) => {
        console.log("Product API query params", { params });
        const queryString = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            // Convert camelCase to PascalCase for backend
            const backendKey = toPascalCase(key);
            queryString.append(backendKey, value.toString());
          }
        });

        logger.debug("Product API query string generated", {
          queryString: queryString.toString(),
        });

        return {
          url: `/products?${queryString.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: PaginatedResult<Product>) => {
        logger.debug("Products API response received", {
          totalCount: response.totalCount,
          pageNumber: response.pageNumber,
        });
        return response;
      },

      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({
                type: "Product" as const,
                id: p.id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    createProduct: builder.mutation<{ id: string }, FormData>({
      query: (formData) => {
        return {
          url: "/products",
          method: "POST",
          body: formData,
          headers: {},
        };
      },
      transformResponse: (response: { id: string }) => {
        logger.info("Product created successfully", { productId: response.id });
        return response;
      },
      invalidatesTags: ["Product"],
    }),

    getMarerials: builder.query<string[], void>({
      query: () => ({
        url: "/products/materials",
        method: "GET",
      }),
      providesTags: ["Materials"],
    }),
    getProductById: builder.query<Product, { id: string; include?: string }>({
      query: ({ id, include }) => ({
        url: `/products/${id}`,
        params: { include },
        method: "GET",
      }),

      providesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    updateProduct: builder.mutation<void, { data: FormData }>({
      query: ({ data }) => ({
        url: `/products`,
        method: "PUT",
        body: data,
        headers: {},
      }),
      invalidatesTags: () => ["Product"],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, productId) => [
        { type: "Product", id: productId },
        "Product",
      ],
    }),
    getBrands: builder.query<string[], void>({
      query: () => ({
        url: "/products/brands",
        method: "GET",
      }),
      providesTags: ["Brands"],
    }),

    createReview: builder.mutation<
      void,
      { productId: string; rating: number; comment: string }
    >({
      query: ({ productId, rating, comment }) => ({
        url: `/products/${productId}/reviews`,
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        "Product",
      ],
    }),

    deleteReview: builder.mutation<
      void,
      { productId: string; reviewId: string }
    >({
      query: ({ productId, reviewId }) => ({
        url: `/products/${productId}/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        "Product",
      ],
    }),

    getProductsByIds: builder.query<
      PaginatedResult<Product>,
      {
        productIds: string[];
        orderBy?: string;
        sortDir?: string;
        pageNumber?: number;
        pageSize?: number;
        include?: string;
      }
    >({
      query: (params) => {
        const body: Record<string, unknown> = {};
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            const keyPascal = toPascalCase(key);
            body[keyPascal] = value;
          }
        });

        logger.debug("GetProductsByIds query body", { body });

        return {
          url: `/products/liked-products`,
          method: "POST",
          body,
        };
      },
      transformResponse: (response: PaginatedResult<Product>) => {
        logger.debug("GetProductsByIds response received", {
          totalCount: response.totalCount,
        });
        return response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({
                type: "Product" as const,
                id: p.id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    addProductAlternatives: builder.mutation<
      void,
      { productId: string; alternativeProductIds: string[] }
    >({
      query: ({ productId, alternativeProductIds }) => ({
        url: "/products/alternatives",
        method: "POST",
        body: {
          productId,
          alternativeProductIds,
        },
      }),
      transformResponse: () => {
        logger.info("Product alternatives added successfully");
      },
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByIdsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetBrandsQuery,
  useGetMarerialsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useAddProductAlternativesMutation,
} = productApi;
