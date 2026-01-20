"use client";

import { selectMainCategory } from "@/features/category";
import { useFilters } from "@/features/product";
import { Capitalize } from "@/shared";
import { useAppSelector } from "@/store";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { sidebarData } from "../data/sidebarData";

export default function CategorySidebar() {
  const { updateFilters } = useFilters();
  const [expandedTypes, setExpandedTypes] = useState<Set<number>>(new Set([0]));
  const pathname = usePathname();

  const mainCategory = useAppSelector(selectMainCategory);

  const subcategoryFromPath = useCallback(() => {
    const parts = pathname.split("-");
    return parts.length > 1 ? Capitalize(parts[1]) : null;
  }, [pathname]);

  // Find the sidebar data for the current category and subcategory
  const currentSidebarData = sidebarData.find(
    (category) =>
      category.sub === (subcategoryFromPath() || "") &&
      category.main === mainCategory
  );

  const handleProductTypeClick = (type: string, subType: string) => {
    updateFilters({ type, subType });
  };

  const toggleTypeExpansion = (index: number) => {
    setExpandedTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (!currentSidebarData) {
    return null;
  }

  return (
    <aside className="w-64 shrink-0">
      <div className="pr-8">
        <h2 className="font-bold mb-3">
          {mainCategory}&apos;s {subcategoryFromPath()}
        </h2>
        <nav>
          <ul className="space-y-2 cursor-pointer">
            {currentSidebarData.types.map((typeData, index) => {
              const isExpanded = expandedTypes.has(index);

              return (
                <li key={index}>
                  <button
                    onClick={() => toggleTypeExpansion(index)}
                    className="flex items-center gap-1  cursor-pointer font-bold  mb-1 hover:text-gray-700 transition-colors w-full text-left"
                  >
                    <span className="transition-transform duration-200 ease-in-out">
                      {isExpanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </span>
                    {typeData.type}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="ml-5">
                      {typeData.subTypes.map((subTypeData, subIndex) => (
                        <li key={subIndex}>
                          <button
                            onClick={() =>
                              handleProductTypeClick(
                                typeData.type,
                                subTypeData.subType
                              )
                            }
                            className="block py-1  hover:underline transition-colors cursor-pointer  text-left w-full"
                          >
                            {subTypeData.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
