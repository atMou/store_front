import SectionHeader from "@/components/molecules/SectionHeader";
import { cn } from "@/shared/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui";
import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

type ProductCarouselSkeletonProps = {
  title?: string;
  icon?: React.ReactNode;
  itemSize?: "small" | "medium" | "large";
  direction?: "rtl" | "ltr";
  itemCount?: number;
};

const sizeClasses = {
  small: "basis-1/3 md:basis-1/6 lg:basis-1/8 xl:basis-[10%] 2xl:basis-1/12",
  medium: "basis-1/3 md:basis-1/5 lg:basis-1/6 xl:basis-[14.28%] 2xl:basis-1/8",
  large: "basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.28%]",
};

function ProductCarouselSkeleton({
  title,
  icon,
  itemSize = "small",
  direction = "ltr",
  itemCount = 8,
}: ProductCarouselSkeletonProps) {
  return (
    <div className="mx-auto w-full pt-3 pb-3 select-none">
      {title && (
        <div className="flex items-center justify-between mb-2">
          <SectionHeader title={title} icon={icon} direction={direction} />
        </div>
      )}
      <div className="w-full">
        <Carousel
          opts={{
            align: "start",
            direction: direction,
            containScroll: false,
            dragFree: false,
            slidesToScroll: 4,
          }}
          className="w-full"
          dir={direction}
        >
          <CarouselContent
            className={cn(direction === "rtl" ? "ml-0 -mr-2" : "-ml-2")}
          >
            {Array.from({ length: itemCount }).map((_, index) => (
              <CarouselItem
                key={index}
                className={cn(
                  "basis-auto",
                  direction === "rtl" ? "pl-0 pr-2" : "pl-2",
                  sizeClasses[itemSize]
                )}
              >
                <ProductCardSkeleton size={itemSize} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

export default ProductCarouselSkeleton;
