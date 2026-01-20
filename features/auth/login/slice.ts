import { createSlice } from "@reduxjs/toolkit";
import { LoginFormData } from "../types";

const initialState: LoginFormData = {
  email: "",
  password: "",
  rememberMe: false,
};

const loginSlice = createSlice({
  name: "loginForm",
  initialState,
  reducers: {
    setEmail(state, action: { payload: string }) {
      state.email = action.payload;
    },
    setPassword(state, action: { payload: string }) {
      state.password = action.payload;
    },
    setRememberMe(state, action: { payload: boolean }) {
      state.rememberMe = action.payload;
    },
    resetForm(state) {
      state.email = "";
      state.password = "";
      state.rememberMe = false;
    },
  },
});
export const { actions: loginActions } = loginSlice;
export const { reducer: loginReducer } = loginSlice;
