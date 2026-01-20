"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { selectMainCategory, subCategoryActions } from "../index";

type SubCategoryProps = {
  subCategory: string;
};

function CarouselLink({ subCategory }: SubCategoryProps) {
  const dispatch = useAppDispatch();
  const mainCategory = useAppSelector(selectMainCategory);

  const router = useRouter();

  return (
    <>
      <li
        onMouseEnter={() => {
          dispatch(subCategoryActions.setOpenState(true));
          dispatch(subCategoryActions.setCarouselSubCategory(subCategory));
        }}
        onClick={() => {
          router.push(
            `/${mainCategory.toLowerCase()}-${subCategory.toLowerCase()}`
          );
          dispatch(subCategoryActions.setSidebarSubCategory(subCategory));
        }}
        className={`cursor-pointer list-none text-xs  hover:underline text-gray-700"
          `}
      >
        {subCategory === "Sale" ? (
          <span className="text-red-600  tracking-widest font-bold">
            {subCategory}%
          </span>
        ) : (
          <span className="tracking-widest">{subCategory}</span>
        )}
      </li>
    </>
  );
}

export default CarouselLink;
