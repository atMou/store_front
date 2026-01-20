"use client";

import Link from "next/link";

interface CategoryBreadcrumbProps {
  mainCategory: string;
  category: string;
  subcategory?: string;
  mainCategoryLink?: string;
  categoryLink?: string;
}

const CategoryBreadcrumb: React.FC<CategoryBreadcrumbProps> = ({
  mainCategory,
  category,
  subcategory,
  mainCategoryLink = "/",
  categoryLink,
}) => {
  return (
    <nav className="flex items-center gap-2 ">
      <Link href={mainCategoryLink} className="hover:underline">
        {mainCategory}
      </Link>
      <span>›</span>
      {categoryLink && subcategory ? (
        <>
          <Link href={categoryLink} className="hover:underline">
            {category}
          </Link>
          <span>›</span>
          <span className="">{subcategory}</span>
        </>
      ) : (
        <span className="">{category}</span>
      )}
    </nav>
  );
};

export default CategoryBreadcrumb;
