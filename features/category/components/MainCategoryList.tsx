import { MainCategoryType } from "../types";
import MainCategoryItem from "./MainCategoryItem";

function CategoryList() {
  const categories: MainCategoryType[] = ["Men", "Women", "Kids"];

  return (
    <div className="flex items-center space-x-1 ">
      {categories?.map((c) => {
        return <MainCategoryItem key={c} mainCategory={c} />;
      })}
    </div>
  );
}

export default CategoryList;
