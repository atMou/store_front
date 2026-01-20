"use client";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { mainCategoryActions, selectMainCategory } from "../slice";
import { MainCategoryType } from "../types";

type CategoryProps = {
  mainCategory: MainCategoryType;
};

function MainCategoryItem({ mainCategory }: CategoryProps) {
  const selectedMainCategory = useAppSelector(selectMainCategory);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleClick = () => {
    dispatch(mainCategoryActions.setMainCategory(mainCategory));
    router.push(`/${mainCategory.toLowerCase()}-home`);
  };

  return (
    <>
      <span
        onClick={handleClick}
        className={`px-2 py-1 cursor-pointer ${
          selectedMainCategory === mainCategory
            ? "bg-black font-bold text-white"
            : " font-bold text-gray-700 hover:bg-gray-100"
        }`}
      >
        {mainCategory}
      </span>
    </>
  );
}

export default MainCategoryItem;
