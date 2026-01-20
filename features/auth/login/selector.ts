import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectLoginForm = createSelector(
  (state: RootState) => state.loginForm,
  (loginForm) => loginForm
);
