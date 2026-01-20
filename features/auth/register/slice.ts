import { createSlice } from "@reduxjs/toolkit";
import { FormSteps, RegisterFormData } from "../types";

export const initialState: RegisterFormData = {
  step: FormSteps.CREDENTIALS,
};

const registerSlice = createSlice({
  name: "registerForm",
  initialState,
  reducers: {
    setEmail(state, action: { payload: string }) {
      state.email = action.payload;
    },
    setPhone(state, action: { payload: string }) {
      state.phone = action.payload;
    },
    setPassword(state, action: { payload: string }) {
      state.password = action.payload;
    },
    setPasswordConfirm(state, action: { payload: string }) {
      state.passwordConfirm = action.payload;
    },
    setRememberMe(state, action: { payload: boolean }) {
      state.rememberMe = action.payload;
    },
    resetForm() {
      return initialState;
    },
    setStep(
      state,
      action: { payload: (typeof FormSteps)[keyof typeof FormSteps] }
    ) {
      state.step = action.payload;
    },

    setAge(state, action: { payload: number }) {
      state.age = action.payload;
    },
    setGender(state, action: { payload: "male" | "female" | "other" }) {
      state.gender = action.payload;
    },
    setFirstName(state, action: { payload: string }) {
      state.firstName = action.payload;
    },
    setLastName(state, action: { payload: string }) {
      state.lastName = action.payload;
    },
    setCity(state, action: { payload: string }) {
      state.city = action.payload;
    },
    setStreet(state, action: { payload: string }) {
      state.street = action.payload;
    },
    setPostalCode(state, action: { payload: number }) {
      state.postalCode = action.payload;
    },
    setHouseNumber(state, action: { payload: number }) {
      state.houseNumber = action.payload;
    },
    setExtraDetails(state, action: { payload: string }) {
      state.extraDetails = action.payload;
    },
    setProfileImage(state, action: { payload: File }) {
      state.profileImage = action.payload;
    },
  },
});

export const { actions: registerActions } = registerSlice;
export const { reducer: registerReducer } = registerSlice;
