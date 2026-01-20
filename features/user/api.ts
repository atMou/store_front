import { baseApi } from "@/store";
import { userActions } from "./slice";
import { User } from "./types";

export const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
      }),
    }),
    getAllAdmins: builder.query({
      query: () => ({
        url: "/users/admins",
      }),
    }),
    getProfile: builder.query<User, { email: string }>({
      query: ({ email }) => ({
        url: `/users/profile`,
        body: { email },
        method: "GET",
      }),
    }),

    toggleLikedProduct: builder.mutation<void, { productIds: string[] }>({
      query: ({ productIds }) => ({
        url: `/users/toggle-liked-products`,
        method: "POST",
        body: { productIds },
      }),
      async onQueryStarted({ productIds }, { dispatch, queryFulfilled }) {
        productIds.forEach((productId) => {
          dispatch(userActions.toggleLikedProductId(productId));
        });

        try {
          await queryFulfilled;
        } catch {
          // Rollback on error by toggling again
          productIds.forEach((productId) => {
            dispatch(userActions.toggleLikedProductId(productId));
          });
        }
      },
      // invalidatesTags: ["User"],
    }),
    checkEmailExists: builder.query<void, { email: string }>({
      query: ({ email }) => ({
        url: `/users/check-user-email`,
        method: "GET",
        params: { email },
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query<User, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userActions.setUser(data));
          dispatch(userActions.clearError());
        } catch (err) {
          dispatch(userActions.setError("Failed to fetch user data"));
          dispatch(userActions.clearUser());
          dispatch(userActions.clearTokens());
        }
      },
    }),

    addAddress: builder.mutation<
      User,
      {
        fullname: string;
        street: string;
        city: string;
        postalCode: number;
        houseNumber: number;
        extraDetails?: string;
        isMain?: boolean;
      }
    >({
      query: (request) => ({
        url: `/users/add-address`,
        method: "POST",
        body: request,
        credentials: "include",
      }),
      // invalidatesTags: ["Order"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(userActions.setUser(data));
          console.log("Address added successfully", data);
          dispatch(userActions.clearError());
        } catch (err) {
          console.error("Failed to add address:", err);
          // Don't rethrow - let the component handle the error
          // Rethrowing can trigger unnecessary auth state clearing
        }
      },
    }),

    deleteAddress: builder.mutation<
      void,
      { userId: string; addressId: string }
    >({
      query: (request) => ({
        url: `/users/delete-address`,
        method: "POST",
        body: request,
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
      async onQueryStarted({ addressId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userActions.removeAddress(addressId));
          dispatch(userActions.clearError());
        } catch (err) {
          throw err;
        }
      },
    }),

    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/users/admin",
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllAdminsQuery,
  useUpdateUserMutation,
  useCreateAdminMutation,
  useDeleteUserMutation,
  useGetProfileQuery,
  useGetMeQuery,
  useGetAllUsersQuery,
  useLazyGetMeQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useLazyCheckEmailExistsQuery,
  useToggleLikedProductMutation,
} = userApi;
