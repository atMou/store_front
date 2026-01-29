import { baseApi } from "@/store";
import { subCategoryActions } from "./slice";

export type ProductType = {
  type: string;
  subTypes: string[];
};

export type CategoryResponse = {
  main: string;
  sub: string;
  productTypes: ProductType[];
};

const categoriesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryResponse[], void>({
      query: () => ({
        url: "/products/categories",
        method: "GET",
      }),
      transformResponse: (response: CategoryResponse[]): CategoryResponse[] => {
        return response.filter((cat) => cat.main && cat.sub);
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log("Fetched Categories:", data);

          dispatch(subCategoryActions.setCategoryResponses(data));
        } catch {}
      },
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
