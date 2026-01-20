import { CategoryResponse } from "./api";
import { CategoryItemProps } from "./components/SubCategoryItem";

export const MainCategory = {
  Men: "Men",
  Women: "Women",
  Kids: "Kids",
} as const;

export type MainCategoryType = (typeof MainCategory)[keyof typeof MainCategory];

export interface MainCategoryState {
  mainCategory: MainCategoryType;
}

export interface SubCategoryState {
  carouselSubCategory: string;
  sidebarSubCategory: string;
  categoryResponses: CategoryResponse[];
  isOpen?: boolean;
}

export type PanelItemProps = {
  icon?: React.ReactNode;
  type: string;
  sub: string;
  newTag?: boolean;
};
export type MenGroupedItems = {
  group:
    | "NEW IN"
    | "Trending"
    | "Clothing"
    | "Designer"
    | "Accessories"
    | "Sale"
    | "Sports"
    | "Shoes"
    | "Streetwear";
  items: { title: string; items: CategoryItemProps[] }[];
  imageUrl?: string;
  borderLeftColor?: string;
  borderBottomColor?: string;
};

export type WomenGroupedItems = {
  group:
    | "NEW IN"
    | "Trending"
    | "Clothing"
    | "Designer"
    | "Accessories"
    | "Sale"
    | "Beauty"
    | "Shoes"
    | "Sports"
    | "Streetwear";
  items: { title: string; items: CategoryItemProps[] }[];
  imageUrl?: string;
  borderLeftColor?: string;
  borderBottomColor?: string;
};
export type KidsGroupedItems = {
  group:
    | "Girls"
    | "Boys"
    | "Baby"
    | "Clothing"
    | "Designer"
    | "Accessories"
    | "Sale"
    | "Beauty"
    | "Shoes"
    | "Sports"
    | "Streetwear";
  items: { title: string; items: CategoryItemProps[] }[];
  imageUrl?: string;
  borderLeftColor?: string;
  borderBottomColor?: string;
};

export interface CategoryTabPanels {
  category: "Men" | "Women" | "Kids";
  tabs: (MenGroupedItems | WomenGroupedItems | KidsGroupedItems)[];
}
