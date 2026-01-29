import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "./types";

interface OrderState {
  currentOrder: Order | null;
  myOrders: Order[];
  allOrders: Order[];
  isLoading: boolean;
  error: {
    detail: string;
    errors: string[];
  } | null;
}

const initialState: OrderState = {
  currentOrder: null,
  myOrders: [],
  allOrders: [],
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
      state.error = null;
    },
    setMyOrders: (state, action: PayloadAction<Order[]>) => {
      state.myOrders = action.payload;
      state.error = null;
    },
    setAllOrders: (state, action: PayloadAction<Order[]>) => {
      state.allOrders = action.payload;
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrders: (state) => {
      state.myOrders = [];
      state.allOrders = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (
      state,
      action: PayloadAction<{ detail: string; errors: string[] }>
    ) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { actions: orderActions } = orderSlice;

export const selectCurrentOrder = (state: RootState) =>
  state.order.currentOrder;
export const selectMyOrders = (state: RootState) => state.order.myOrders;
export const selectAllOrders = (state: RootState) => state.order.allOrders;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;
export const selectOrderError = (state: RootState) => state.order.error;

export const { reducer: orderReducer } = orderSlice;
