"use client";

import CategoryBreadcrumb from "@/components/feedback/CategoryBreadcrumb";
import Header from "@/components/layouts/header/Header";
import { COLORS, SIZES } from "@/constants";
import { mainCategoryActions, selectSidebarSubCategory } from "@/features/category";
import CategorySidebar from "@/features/category/components/CategorySidebar";
import TabPanelDropdown from "@/features/category/components/TabPanelDropdown";
import {
  useFilters,
  useFilterSync,
  useGetBrandsQuery,
} from "@/features/product";
import ProductFilterBar from "@/features/product/components/ProductFilterBar";
import { FilterValues } from "@/features/product/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {  useEffect } from "react";
import { SubHeader } from "./header";

interface CategoryLayoutProps {
  children: React.ReactNode;
  mainCategory: "Men" | "Women" | "Kids";
  mainCategoryLink: string;
  initialFilters?: FilterValues;
}

export default function MainLayout({
  children,
  mainCategory,
  mainCategoryLink,
}: CategoryLayoutProps) {
  const dispatch = useAppDispatch();

 const subCategory = useAppSelector(selectSidebarSubCategory);

  const { filters, setFilters, updateFilters } = useFilters();
  const { data: brands = [] } = useGetBrandsQuery();

  useFilterSync();

  useEffect(() => {
    dispatch(mainCategoryActions.setMainCategory(mainCategory));

    setFilters({
      category: mainCategory,
      sub: subCategory || undefined,
    });
  }, [dispatch, mainCategory, setFilters, subCategory]);

  return (
    <>
      <Header />
      <SubHeader />
      <TabPanelDropdown />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {subCategory && (
          <div className="py-4">
            <CategoryBreadcrumb
              mainCategory={mainCategory}
              category={subCategory || ""}
              mainCategoryLink={mainCategoryLink}
            />
          </div>
        )}

        <div className="flex ">
          <CategorySidebar />

          <div className="flex-1">
            <ProductFilterBar
              filters={filters}
              onFilterChange={updateFilters}
              sizeOptions={SIZES.map((size) => ({
                label: size,
                value: size,
              }))}
              brandOptions={brands.map((brand) => ({
                label: brand,
                value: brand.toLowerCase(),
              }))}
              colourOptions={COLORS.map((color) => ({
                label: color.name,
                value: color.name.toLowerCase(),
                color: color.hex,
              }))}
            />
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
