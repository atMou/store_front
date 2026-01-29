import { RootState } from "@/store";
import {
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { InventoryQueryParams, InventoryResult } from "./types";

export const inventoryAdapter = createEntityAdapter<InventoryResult>({
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

export interface InventoryState {
  entities: ReturnType<typeof inventoryAdapter.getInitialState>;
  pagination: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
  };
  filters: InventoryQueryParams;
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  entities: inventoryAdapter.getInitialState(),
  pagination: {
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
    hasNextPage: false,
  },
  filters: {},
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setInventory: (
      state,
      action: PayloadAction<{
        inventory: InventoryResult[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        filters: InventoryQueryParams;
      }>
    ) => {
      const { inventory, totalCount, pageNumber, pageSize, filters } =
        action.payload;

      if (
        pageNumber === 1 ||
        JSON.stringify(state.filters) !== JSON.stringify(filters)
      ) {
        state.entities = inventoryAdapter.setAll(state.entities, inventory);
      } else {
        inventoryAdapter.addMany(state.entities, inventory);
      }

      state.pagination = {
        totalCount,
        currentPage: pageNumber,
        pageSize,
        hasNextPage: pageNumber * pageSize < totalCount,
      };
      state.filters = filters;
    },

    addInventory: (state, action: PayloadAction<InventoryResult[]>) => {
      inventoryAdapter.addMany(state.entities, action.payload);
    },

    updateInventoryItem: (state, action: PayloadAction<InventoryResult>) => {
      inventoryAdapter.updateOne(state.entities, {
        id: action.payload.id,
        changes: action.payload,
      });
    },

    removeInventoryItem: (state, action: PayloadAction<string>) => {
      inventoryAdapter.removeOne(state.entities, action.payload);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setFilters: (state, action: PayloadAction<InventoryQueryParams>) => {
      state.filters = action.payload;

      state.pagination.currentPage = 1;
    },

    updateFilters: (
      state,
      action: PayloadAction<Partial<InventoryQueryParams>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };

      state.pagination.currentPage = 1;
    },

    clearFilters: (state) => {
      state.filters = {};

      state.pagination.currentPage = 1;
    },

    resetInventory: (state) => {
      state.entities = inventoryAdapter.getInitialState();
      state.pagination = {
        totalCount: 0,
        currentPage: 1,
        pageSize: 20,
        hasNextPage: false,
      };
    },
  },
});

export const {
  setInventory,
  addInventory,
  updateInventoryItem,
  removeInventoryItem,
  setLoading,
  setError,
  setFilters,
  updateFilters,
  clearFilters,
  resetInventory,
} = inventorySlice.actions;

const selectInventoryState = (state: RootState) => state.inventory.entities;

export const {
  selectAll: selectAllInventory,
  selectById: selectInventoryById,
  selectIds: selectInventoryIds,
  selectEntities: selectInventoryEntities,
  selectTotal: selectInventoryTotal,
} = inventoryAdapter.getSelectors(selectInventoryState);

export const selectInventoryPagination = (state: RootState) =>
  state.inventory.pagination;
export const selectInventoryFilters = (state: RootState) =>
  state.inventory.filters;
export const selectInventoryLoading = (state: RootState) =>
  state.inventory.loading;
export const selectInventoryError = (state: RootState) => state.inventory.error;

export const selectFilteredInventory = createSelector(
  [selectAllInventory, selectInventoryFilters],
  (inventory) => {
    return inventory;
  }
);

export const selectInventoryWithPagination = createSelector(
  [selectAllInventory, selectInventoryPagination],
  (inventory, pagination) => ({
    inventory,
    ...pagination,
  })
);

export default inventorySlice.reducer;
