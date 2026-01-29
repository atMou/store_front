import { RootState } from "@/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryResponse } from "./api";
import type {
  MainCategoryState,
  MainCategoryType,
  SubCategoryState,
} from "./types";

const mainCategoryInitialState: MainCategoryState = {
  mainCategory: "Women",
};

const mainCategorySlice = createSlice({
  name: "mainCategory",
  initialState: mainCategoryInitialState,
  reducers: {
    setMainCategory(state, action: PayloadAction<MainCategoryType>) {
      state.mainCategory = action.payload;
    },
    clearMainCategory(state) {
      state.mainCategory = mainCategoryInitialState.mainCategory;
    },
  },
});

export const { actions: mainCategoryActions } = mainCategorySlice;
export const { reducer: mainCategoryReducer } = mainCategorySlice;

export const selectMainCategory = (state: RootState): MainCategoryType =>
  state.mainCategory.mainCategory;

const subCategoryInitialState: SubCategoryState = {
  carouselSubCategory: "",
  sidebarSubCategory: "",
  categoryResponses: [],
  isOpen: false,
};
const SubCategorySlice = createSlice({
  name: "subCategory",
  initialState: subCategoryInitialState,
  reducers: {
    setCarouselSubCategory(state, action: PayloadAction<string>) {
      state.carouselSubCategory = action.payload;
    },
    setSidebarSubCategory(state, action: PayloadAction<string>) {
      state.sidebarSubCategory = action.payload;
    },
    clearSidebarSubCategory(state) {
      state.sidebarSubCategory = subCategoryInitialState.sidebarSubCategory;
    },
    setCategoryResponses(state, action: PayloadAction<CategoryResponse[]>) {
      state.categoryResponses = action.payload;
    },
    clearCarouselSubCategory(state) {
      state.carouselSubCategory = subCategoryInitialState.carouselSubCategory;
      state.isOpen = false;
    },
    setOpenState(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
  },
});

export const { actions: subCategoryActions } = SubCategorySlice;
export const { reducer: subCategoryReducer } = SubCategorySlice;

export const selectCarouselSubCategory = (state: RootState): string | null =>
  state.subCategory?.carouselSubCategory;

export const selectCategoryResponses = (state: RootState): CategoryResponse[] =>
  state.subCategory?.categoryResponses || [];

export const selectIsOpen = (state: RootState): boolean =>
  state.subCategory?.isOpen || false;

export const selectSidebarSubCategory = (state: RootState): string | null =>
  state.subCategory?.sidebarSubCategory;
