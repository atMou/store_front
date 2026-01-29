"use client";

import { selectSidebarSubCategory } from "@/features/category";
import { FilterValues } from "@/features/product/types";
import { useClickOutside } from "@/hooks";
import { useAppSelector } from "@/store";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

interface FilterOption {
  label: string;
  value: string;
  color?: string;
}

interface FilterDropdownProps {
  placeholder: string;
  options?: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  isSingleSelect?: boolean;
  badge?: number;
  renderCustomContent?: () => React.ReactNode;
  showActionButtons?: boolean;
  onSave?: () => void;
  onReset?: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  placeholder,
  options,
  selectedValues,
  onChange,
  isSingleSelect = false,
  badge,
  renderCustomContent,
  showActionButtons = false,
  onSave,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelectedValues, setTempSelectedValues] = useState<string[]>([]);
  const [alignRight, setAlignRight] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const toggleValue = (value: string) => {
    if (isSingleSelect) {
      if (showActionButtons) {
        setTempSelectedValues([value]);
      } else {
        onChange([value]);
        setIsOpen(false);
      }
    } else {
      const currentValues = showActionButtons
        ? tempSelectedValues
        : selectedValues;
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      if (showActionButtons) {
        setTempSelectedValues(newValues);
      } else {
        onChange(newValues);
      }
    }
  };

  const handleSave = () => {
    if (showActionButtons && tempSelectedValues) {
      onChange(tempSelectedValues);
      onSave?.();
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempSelectedValues([]);
    onChange([]);
    onReset?.();
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && showActionButtons) {
      setTempSelectedValues(selectedValues);
    }
  };

  useEffect(() => {
    if (isOpen && dropdownRef.current && ref.current) {
      const containerRect = ref.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      const wouldOverflowRight = containerRect.left + 240 > viewportWidth;
      setAlignRight(wouldOverflowRight);
    }
  }, [isOpen]);

  const displayText =
    isSingleSelect && selectedValues.length > 0
      ? options?.find((opt) => opt.value === selectedValues[0])?.label
      : placeholder;

  return (
    <div className="relative min-h-14 select-none" ref={ref}>
      <div
        onClick={handleOpen}
        className={`relative w-full h-11 px-3  text-sm flex items-center justify-between gap-2 cursor-pointer bg-white ${
          isOpen
            ? "border-2 border-b-0  z-10 h-13 "
            : "border-2 border-transparent outline-1"
        }`}
      >
        <span
          className={
            selectedValues.length === 0 && !isSingleSelect
              ? "text-gray-400"
              : ""
          }
        >
          {displayText}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {badge !== undefined && badge > 0 && (
            <span className="bg-black text-white text-sm rounded-full w-5 h-5 flex items-center justify-center">
              {badge}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute ${alignRight ? "right-0" : "left-0"} top-12 mt-[3px] min-w-60 bg-white border-2 z-5 max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:rounded-full`}
        >
          {renderCustomContent
            ? renderCustomContent()
            : options?.map((option, index) => {
                const currentValues = showActionButtons
                  ? tempSelectedValues
                  : selectedValues;
                const isSelected = currentValues.includes(option.value);
                return (
                  <div key={option.value}>
                    <div
                      onClick={() => toggleValue(option.value)}
                      className={`px-3 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center whitespace-nowrap ${
                        isSingleSelect ? "gap-2" : "justify-between"
                      } ${isSelected && !isSingleSelect ? "bg-gray-50" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        {option.color && (
                          <span
                            className="w-4 h-4 border border-gray-300 inline-block"
                            style={{ backgroundColor: option.color }}
                          />
                        )}
                        <span className="text-sm">{option.label}</span>
                      </div>
                      {!isSingleSelect && isSelected && (
                        <Check size={16} className="text-black" />
                      )}
                    </div>
                    {index < options.length - 1 && (
                      <div className="h-px bg-gray-200 mx-[5px]" />
                    )}
                  </div>
                );
              })}
          {showActionButtons && (
            <div className="sticky bottom-0 bg-white border-t-2 flex ">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 border border-gray-300 bg-gray-200 cursor-pointer hover:bg-gray-50 text-sm font-medium"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-black text-white cursor-pointer hover:bg-gray-800 text-sm font-medium"
              >
                Save
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface FilterBarProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  sizeOptions?: FilterOption[];
  brandOptions?: FilterOption[];
  colourOptions?: FilterOption[];
}

const ProductFilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  sizeOptions = [],
  brandOptions = [],
  colourOptions = [],
}) => {
  const [minPrice, setMinPrice] = useState(filters?.minPrice ?? 0);
  const [maxPrice, setMaxPrice] = useState(filters?.maxPrice ?? 500);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const subCategory = useAppSelector(selectSidebarSubCategory);

  const materialOptions = useMemo(() => {
    const sub = subCategory?.toLowerCase() || filters?.sub?.toLowerCase() || "";

    if (
      sub.includes("shoe") ||
      sub.includes("sneaker") ||
      sub.includes("boot") ||
      sub.includes("sandal")
    ) {
      return [
        { label: "Leather", value: "leather" },
        { label: "Canvas", value: "canvas" },
        { label: "Suede", value: "suede" },
        { label: "Synthetic", value: "synthetic" },
        { label: "Mesh", value: "mesh" },
        { label: "Rubber", value: "rubber" },
      ];
    }

    if (
      sub.includes("shirt") ||
      sub.includes("dress") ||
      sub.includes("pant") ||
      sub.includes("jacket") ||
      sub.includes("coat") ||
      sub.includes("sweater") ||
      sub.includes("top") ||
      sub.includes("bottom") ||
      sub.includes("jean")
    ) {
      return [
        { label: "Cotton", value: "cotton" },
        { label: "Polyester", value: "polyester" },
        { label: "Wool", value: "wool" },
        { label: "Silk", value: "silk" },
        { label: "Linen", value: "linen" },
        { label: "Denim", value: "denim" },
        { label: "Fleece", value: "fleece" },
        { label: "Cashmere", value: "cashmere" },
      ];
    }

    if (
      sub.includes("bag") ||
      sub.includes("wallet") ||
      sub.includes("belt") ||
      sub.includes("hat") ||
      sub.includes("scarf") ||
      sub.includes("glove")
    ) {
      return [
        { label: "Leather", value: "leather" },
        { label: "Fabric", value: "fabric" },
        { label: "Nylon", value: "nylon" },
        { label: "Canvas", value: "canvas" },
        { label: "Synthetic", value: "synthetic" },
        { label: "Metal", value: "metal" },
      ];
    }

    return [
      { label: "Cotton", value: "cotton" },
      { label: "Polyester", value: "polyester" },
      { label: "Leather", value: "leather" },
      { label: "Synthetic", value: "synthetic" },
    ];
  }, [subCategory, filters?.sub]);

  const sortOptions: FilterOption[] = [
    { label: "Most Popular", value: "popular" },
    { label: "Newest", value: "newest" },
    { label: "Lowest Price", value: "price_asc" },
    { label: "Highest Price", value: "price_desc" },
    { label: "Deals", value: "deals" },
  ];

  const handleSortChange = (values: string[]) => {
    onFilterChange?.({ ...filters, orderBy: values[0] });
  };

  const handleSizeChange = (values: string[]) => {
    onFilterChange?.({ ...filters, size: values.join(",") });
  };

  const handleBrandChange = (values: string[]) => {
    onFilterChange?.({ ...filters, brand: values.join(",") });
  };

  const handleColourChange = (values: string[]) => {
    onFilterChange?.({ ...filters, color: values.join(",") });
  };

  const handleMaterialChange = (values: string[]) => {
    onFilterChange?.({ ...filters, material: values.join(",") });
  };

  const handleSavingsChange = (values: string[]) => {
    onFilterChange?.({ ...filters, savings: values.join(",") });
  };

  const handleSpecialFiltersChange = (values: string[]) => {
    const newFilters = { ...filters };

    newFilters.isFeatured = undefined;
    newFilters.isTrending = undefined;
    newFilters.isBestSeller = undefined;
    newFilters.isNew = undefined;

    values.forEach((value) => {
      if (value === "featured") newFilters.isFeatured = true;
      if (value === "trending") newFilters.isTrending = true;
      if (value === "bestseller") newFilters.isBestSeller = true;
      if (value === "new") newFilters.isNew = true;
    });

    onFilterChange?.(newFilters);
  };

  const handlePriceReset = () => {
    setMinPrice(0);
    setMaxPrice(500);
    onFilterChange?.({ ...filters, minPrice: undefined, maxPrice: undefined });
  };

  const handlePriceSave = () => {
    onFilterChange?.({ ...filters, minPrice: minPrice, maxPrice: maxPrice });
  };

  const selectedSort = filters?.orderBy ? [filters.orderBy] : [];
  const selectedSizes = filters?.size
    ? filters.size.split(",").filter(Boolean)
    : [];
  const selectedBrands = filters?.brand
    ? filters.brand.split(",").filter(Boolean)
    : [];
  const selectedColors = filters?.color
    ? filters.color.split(",").filter(Boolean)
    : [];
  const selectedMaterials = filters?.material
    ? filters.material.split(",").filter(Boolean)
    : [];
  const selectedSavings = filters?.savings
    ? filters.savings.split(",").filter(Boolean)
    : [];
  const selectedSpecialFilters: string[] = [];
  if (filters?.isFeatured) selectedSpecialFilters.push("featured");
  if (filters?.isTrending) selectedSpecialFilters.push("trending");
  if (filters?.isBestSeller) selectedSpecialFilters.push("bestseller");
  if (filters?.isNew) selectedSpecialFilters.push("new");

  const hasPriceFilter =
    filters?.minPrice !== undefined || filters?.maxPrice !== undefined;

  return (
    <div className="flex items-start gap-y-1 gap-x-2 flex-wrap">
      <FilterDropdown
        placeholder="Sort by"
        options={sortOptions}
        selectedValues={selectedSort}
        onChange={handleSortChange}
        isSingleSelect
      />

      {subCategory === "Clothing" && sizeOptions.length > 0 && (
        <FilterDropdown
          placeholder="Size"
          options={sizeOptions}
          selectedValues={selectedSizes}
          onChange={handleSizeChange}
          badge={selectedSizes.length}
          showActionButtons={true}
        />
      )}

      <FilterDropdown
        placeholder="Brand"
        options={brandOptions}
        selectedValues={selectedBrands}
        onChange={handleBrandChange}
        badge={selectedBrands.length}
        showActionButtons={true}
      />

      {colourOptions.length > 0 && (
        <FilterDropdown
          placeholder="Colour"
          options={colourOptions}
          selectedValues={selectedColors}
          onChange={handleColourChange}
          badge={selectedColors.length}
          showActionButtons={true}
        />
      )}

      {subCategory === "Clothing" && materialOptions.length > 0 && (
        <FilterDropdown
          placeholder="Material"
          options={materialOptions}
          selectedValues={selectedMaterials}
          onChange={handleMaterialChange}
          badge={selectedMaterials.length}
          showActionButtons={true}
        />
      )}

      {showAllFilters && (
        <>
          <FilterDropdown
            placeholder="Special"
            options={[
              { label: "Featured", value: "featured" },
              { label: "Trending", value: "trending" },
              { label: "Best Seller", value: "bestseller" },
              { label: "New Arrivals", value: "new" },
            ]}
            selectedValues={selectedSpecialFilters}
            onChange={handleSpecialFiltersChange}
            badge={selectedSpecialFilters.length}
            showActionButtons={true}
          />

          <FilterDropdown
            placeholder="Savings"
            options={[
              { label: "10% or more", value: "10" },
              { label: "25% or more", value: "25" },
              { label: "50% or more", value: "50" },
            ]}
            selectedValues={selectedSavings}
            onChange={handleSavingsChange}
            badge={selectedSavings.length}
            showActionButtons={true}
          />

          <FilterDropdown
            placeholder="Price"
            selectedValues={[]}
            onChange={() => {}}
            badge={hasPriceFilter ? 1 : undefined}
            renderCustomContent={() => (
              <div className="relative   ">
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) =>
                          setMinPrice(Number(e.target.value) || 0)
                        }
                        min={0}
                        max={500}
                        className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Min"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                        €
                      </span>
                    </div>
                    <span className="text-gray-400">−</span>
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) =>
                          setMaxPrice(Number(e.target.value) || 500)
                        }
                        min={0}
                        max={500}
                        className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Max"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                        €
                      </span>
                    </div>
                  </div>
                  <div className="mb-6 pt-2">
                    <div className="relative h-2">
                      <div className="absolute w-full h-2 bg-gray-200 rounded-lg"></div>
                      <div
                        className="absolute h-2 bg-black rounded-lg"
                        style={{
                          left: `${(minPrice / 500) * 100}%`,
                          right: `${100 - (maxPrice / 500) * 100}%`,
                        }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={minPrice}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val <= maxPrice) setMinPrice(val);
                        }}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                        style={{ zIndex: 3 }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={maxPrice}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= minPrice) setMaxPrice(val);
                        }}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                        style={{ zIndex: 4 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0  bg-white border-t-2 flex ">
                  <button
                    onClick={handlePriceReset}
                    className="flex-1 px-4 py-2 border border-gray-300 bg-gray-200 cursor-pointer hover:bg-gray-50 text-sm font-medium"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handlePriceSave}
                    className="flex-1 px-4 py-2 bg-black text-white cursor-pointer hover:bg-gray-800 text-sm font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          />
        </>
      )}

      <button
        onClick={() => setShowAllFilters(!showAllFilters)}
        className="flex items-center gap-2 h-11 px-4 py-2.5 border cursor-pointer bg-white hover:border-gray-400 transition-colors text-sm font-medium"
      >
        <SlidersHorizontal size={16} />
        <span>{showAllFilters ? "Show less" : "Show all"}</span>
      </button>
    </div>
  );
};

export default ProductFilterBar;
