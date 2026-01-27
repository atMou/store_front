"use client";
import SectionHeader from "@/components/molecules/SectionHeader";
import { FilterValues } from "@/features/product";
import { ProductCard } from "@/features/product/components";
import { useInfiniteProducts } from "@/features/product/hooks/useInfiniteProducts";
import { cn } from "@/shared/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/ui";
import { Plus } from "lucide-react";
import React from "react";
import ProductCarouselSkeleton from "./ProductCarouselSkeleton";

type ProductCarouselProps = {
  filters?: FilterValues;
  title?: string;
  icon?: React.ReactNode;
  itemSize?: "small" | "medium" | "large";
  direction?: "rtl" | "ltr";
  showFollowButton?: boolean;
  isFollowing?: boolean;
  bgColor?: string;
};

const sizeClasses = {
  small: "basis-1/3 md:basis-1/6 lg:basis-1/8 xl:basis-[10%] 2xl:basis-1/12",
  medium: "basis-1/3 md:basis-1/5 lg:basis-1/6 xl:basis-[14.28%] 2xl:basis-1/8",
  large: "basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.28%]",
};

function ProductCarousel({
  filters,
  title,
  icon,
  itemSize = "small",
  direction = "ltr",
  showFollowButton = false,
  bgColor,
  isFollowing = false,
}: ProductCarouselProps) {
  const { products, isLoading } = useInfiniteProducts({
    additionalFilters: filters,
    pageSize: 20,
  });
  const [api, setApi] = React.useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const isCentered = !canScrollPrev && !canScrollNext && !!api;

  const followButtonPosition = direction === "ltr" ? "left" : "right";

  React.useEffect(() => {
    if (!api) return;

    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateScrollState();
    api.on("select", updateScrollState);
    api.on("reInit", updateScrollState);

    return () => {
      api.off("select", updateScrollState);
      api.off("reInit", updateScrollState);
    };
  }, [api]);

  if (isLoading) {
    return (
      <ProductCarouselSkeleton
        title={title}
        icon={icon}
        itemSize={itemSize}
        direction={direction}
      />
    );
  }

  return (
    <div
      className={cn("mx-auto w-full pt-3 pb-3 select-none")}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      {title && (
        <SectionHeader
          title={title}
          icon={icon}
          direction={direction}
          containerClassName={bgColor ? "text-white" : ""}
          titleClassName={bgColor ? "text-white" : ""}
        />
      )}
      <div className="w-full">
        <Carousel
          opts={{
            align: "start",
            direction: direction,
            containScroll: false,
            dragFree: true,
            slidesToScroll: 4,
          }}
          setApi={setApi}
          className="w-full"
          dir={direction}
        >
          <CarouselContent
            className={cn(
              direction === "rtl" ? "ml-0 -mr-2" : "-ml-2",
              isCentered && "justify-center"
            )}
          >
            {products?.map((p) => {
              return (
                <CarouselItem
                  key={p.id}
                  className={cn(
                    "basis-auto",
                    direction === "rtl" ? "pl-0 pr-2" : "pl-2",
                    sizeClasses[itemSize]
                  )}
                >
                  <ProductCard
                    product={p}
                    isLoading={isLoading}
                    size={itemSize}
                    hasBackground={bgColor != ""}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious
            className={`left-[455px] ${!canScrollPrev && "hidden"}`}
          />
          <CarouselNext
            className={`right-[305px] ${!canScrollNext && "hidden"}`}
          />
        </Carousel>
      </div>
      {showFollowButton && (
        <div
          className={cn(
            "flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4",
            followButtonPosition === "right" ? "justify-start" : "justify-end"
          )}
        >
          <button
            className={cn(
              "flex  items-center gap-1 px-4 py-2 border-2 text-sm leading-2.5 tracking-wide font-semibold transition-colors cursor-pointer group",
              bgColor
                ? "border-white text-white hover:bg-white hover:text-black"
                : "border-black text-black hover:bg-black hover:text-white"
            )}
          >
            {isFollowing ? "Following" : "Follow"}
            <Plus
              size={16}
              className={cn(
                bgColor
                  ? "text-white group-hover:text-black"
                  : "text-black group-hover:text-white"
              )}
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductCarousel;
