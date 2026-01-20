import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectRegisterForm = createSelector(
  (state: RootState) => state.registerForm,
  (form) => form
);

export const selectRegisterStep = createSelector(
  (state: RootState) => state.registerForm.step,
  (step) => step
);
