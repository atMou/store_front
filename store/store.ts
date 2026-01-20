import { loginReducer } from "@/features/auth/login/slice";
import { registerReducer } from "@/features/auth/register/slice";
import { cartReducer } from "@/features/cart/slice";
import {
  mainCategoryReducer,
  subCategoryReducer,
} from "@/features/category/slice";
import inventoryReducer from "@/features/inventory/slice";
import { notificationReducer } from "@/features/notifications/slice";
import { orderReducer } from "@/features/order/slice";
import {
  productsReducer,
  viewedProductsReducer,
} from "@/features/product/slice";
import { userReducer } from "@/features/user/slice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { baseApi } from "./apis/base-api";
import { toastReducer } from "./slices/toastSlice";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: unknown) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const combinedReducers = combineReducers({
  user: userReducer,
  cart: cartReducer,
  order: orderReducer,
  toasts: toastReducer,
  registerForm: registerReducer,
  loginForm: loginReducer,
  products: productsReducer,
  viewedProducts: viewedProductsReducer,
  mainCategory: mainCategoryReducer,
  subCategory: subCategoryReducer,
  inventory: inventoryReducer,
  notifications: notificationReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "mainCategory",
    "subCategory",
    "viewedProducts",
    "cart",
    "registerForm",
    "loginForm",
    "user",
    "notifications",
  ],
};
const persistedReducer = persistReducer(persistConfig, combinedReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof combinedReducers>;
export type AppDispatch = typeof store.dispatch;
export const Persistor = persistStore(store);
