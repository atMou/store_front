"use client";
import { FilterValues } from "@/features/product";
import { setFilters } from "@/features/product/slice";
import { Badge } from "@/shared/ui";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { selectMainCategory, subCategoryActions } from "../slice";

export type CategoryItemProps = {
  icon: React.ReactNode;
  text: string;
  filters: FilterValues;
  newTag?: boolean;
};

const SubCategoryItem = ({
  icon,
  text,
  filters,
  newTag,
}: CategoryItemProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const mainCategory = useAppSelector(selectMainCategory);

  const handleClick = () => {
    dispatch(setFilters(filters));
    dispatch(subCategoryActions.setSidebarSubCategory(filters.sub || ""));
    router.push(`/${mainCategory.toLowerCase()}-${filters.sub?.toLowerCase()}`);
    console.log("Filters set to:", filters);
  };

  return (
    <li className="flex  items-center space-x-2 tracking-wide hover:text-gray-600 hover:underline  ">
      <div
        onClick={handleClick}
        className="flex items-center text-nowrap space-x-2 cursor-pointer"
      >
        <div className="text-gray-600 ">{icon}</div>
        <div className="line-clamp-1">{text}</div>
      </div>
      {newTag && <Badge variant="avaliable">New</Badge>}
    </li>
  );
};

export default SubCategoryItem;
