export { store } from "./store";
export type { AppDispatch, Persistor as AppStore, RootState } from "./store";

export { StoreProvider } from "../app/providers/StoreProvider";
export { useAppDispatch, useAppSelector } from "./hooks";

export { baseApi } from "./apis/base-api";
