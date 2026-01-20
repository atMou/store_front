import { RootState } from "@/store";
import {
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { FilterValues, Product } from "./types";

// Create entity adapter for products
export const productsAdapter = createEntityAdapter<Product>({
  sortComparer: (a, b) => a.slug.localeCompare(b.slug),
});

export interface ProductsState {
  entities: ReturnType<typeof productsAdapter.getInitialState>;
  pagination: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
  };
  filters: FilterValues;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  entities: productsAdapter.getInitialState(),
  pagination: {
    totalCount: 0,
    currentPage: 1,
    pageSize: 12,
    hasNextPage: false,
  },
  filters: {},
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (
      state,
      action: PayloadAction<{
        products: Product[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        filters: FilterValues;
      }>
    ) => {
      const { products, totalCount, pageNumber, pageSize, filters } =
        action.payload;

      // Reset entities for new filters or first page
      if (
        pageNumber === 1 ||
        JSON.stringify(state.filters) !== JSON.stringify(filters)
      ) {
        state.entities = productsAdapter.setAll(state.entities, products);
      } else {
        // Add new products for infinite scroll
        productsAdapter.addMany(state.entities, products);
      }

      state.pagination = {
        totalCount,
        currentPage: pageNumber,
        pageSize,
        hasNextPage: pageNumber * pageSize < totalCount,
      };
      state.filters = filters;
    },

    addProducts: (state, action: PayloadAction<Product[]>) => {
      productsAdapter.addMany(state.entities, action.payload);
    },

    updateProduct: (state, action: PayloadAction<Product>) => {
      productsAdapter.updateOne(state.entities, {
        id: action.payload.id,
        changes: action.payload,
      });
    },

    removeProduct: (state, action: PayloadAction<string>) => {
      productsAdapter.removeOne(state.entities, action.payload);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setFilters: (state, action: PayloadAction<FilterValues>) => {
      state.filters = action.payload;
      // Reset pagination when filters change
      state.pagination.currentPage = 1;
    },

    updateFilters: (state, action: PayloadAction<Partial<FilterValues>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset pagination when filters change
      state.pagination.currentPage = 1;
    },

    clearFilters: (state) => {
      state.filters = {};
      // Reset pagination when filters are cleared
      state.pagination.currentPage = 1;
    },

    resetProducts: (state) => {
      state.entities = productsAdapter.getInitialState();
      state.pagination = {
        totalCount: 0,
        currentPage: 1,
        pageSize: 12,
        hasNextPage: false,
      };
    },
  },
});

export const {
  setProducts,
  addProducts,
  updateProduct,
  removeProduct,
  setLoading,
  setError,
  setFilters,
  updateFilters,
  clearFilters,
  resetProducts,
} = productsSlice.actions;

// Entity adapter selectors
const selectProductsState = (state: RootState) => state.products.entities;

export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductIds,
  selectEntities: selectProductEntities,
  selectTotal: selectProductsTotal,
} = productsAdapter.getSelectors(selectProductsState);

// Custom selectors
export const selectProductsPagination = (state: RootState) =>
  state.products.pagination;
export const selectProductsFilters = (state: RootState) =>
  state.products.filters;
export const selectProductsLoading = (state: RootState) =>
  state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;

// Memoized selectors
export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectProductsFilters],
  (products) => {
    return products;
  }
);

export const selectProductsWithPagination = createSelector(
  [selectAllProducts, selectProductsPagination],
  (products, pagination) => ({
    products,
    ...pagination,
  })
);

export const { reducer: productsReducer } = productsSlice;

interface ViewedProductsState {
  products: Product[];
}

const vInitialState: ViewedProductsState = {
  products: [],
};

const viewedProductsSlice = createSlice({
  name: "viewedProducts",
  initialState: vInitialState,
  reducers: {
    addViewedProduct: (state, action: PayloadAction<Product>) => {
      const existingIndex = state.products.findIndex(
        (p) => p.id === action.payload.id
      );

      if (existingIndex !== -1) {
        state.products.splice(existingIndex, 1);
      }

      state.products.unshift(action.payload);

      if (state.products.length > 50) {
        state.products = state.products.slice(0, 50);
      }
    },
    removeViewedProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    clearViewedProducts: (state) => {
      state.products = [];
    },
  },
});

export const { addViewedProduct, removeViewedProduct, clearViewedProducts } =
  viewedProductsSlice.actions;

export const viewedProductsReducer = viewedProductsSlice.reducer;

// Selectors
export const selectViewedProducts = (state: RootState) =>
  state.viewedProducts.products;

export const selectViewedProductById =
  (productId: string) => (state: RootState) =>
    state.viewedProducts.products.find((p) => p.id === productId);
